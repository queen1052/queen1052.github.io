"""Collect source-linked headlines and run the two editorial passes."""

import difflib
import json
import os
import re
import shutil
import subprocess
import xml.etree.ElementTree as ET
from html import unescape
from html.parser import HTMLParser
from concurrent.futures import ThreadPoolExecutor
from datetime import timedelta, timezone
from email.utils import parsedate_to_datetime
from pathlib import Path
from urllib.error import URLError
from urllib.parse import urlsplit
from urllib.request import HTTPRedirectHandler, Request, build_opener

FEEDS = {
    "CNBC": "https://www.cnbc.com/id/20910258/device/rss/rss.html",
    "Federal Reserve": "https://www.federalreserve.gov/feeds/press_all.xml",
    "BLS": "https://www.bls.gov/feed/news_release/rss.xml",
    "BEA": "https://www.bea.gov/rss/rss.xml",
}
HOSTS = {urlsplit(url).hostname for url in FEEDS.values()} | {"fred.stlouisfed.org"}
MARKET = re.compile(
    r"econom|inflat|tariff|trade|market|stocks|gold|bitcoin|crypto|nasdaq|interest rate|"
    r"federal reserve|payroll|employment|gdp|consumer price|retail sales|monetary|oil|pce|dollar|cpi",
    re.I,
)


def trusted(url):
    u = urlsplit(url)
    return u.scheme == "https" and u.netloc.lower() in HOSTS and not re.search(r"[\s<>\\]", url)


class TrustedRedirects(HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        if not trusted(newurl):
            raise URLError("unapproved public source redirect")
        return super().redirect_request(req, fp, code, msg, headers, newurl)


def download(url, limit=2_000_000):
    if not trusted(url):
        raise ValueError("unapproved public source URL")
    req = Request(url, headers={"User-Agent": "MarketNote/1.0 (public economic news reader)"})
    with build_opener(TrustedRedirects).open(req, timeout=15) as response:
        data = response.read(limit + 1)
        if len(data) > limit:
            raise ValueError("public source response too large")
        return data


def source_items(item, now):
    publisher, feed = item
    try:
        root = ET.fromstring(download(feed))
    except (ET.ParseError, OSError, ValueError):
        return []
    results = []
    for entry in root.findall("./channel/item"):
        try:
            timestamp = parsedate_to_datetime(entry.findtext("pubDate", "")).astimezone(timezone.utc)
            title = " ".join(entry.findtext("title", "").split())
            url = entry.findtext("link", "").strip()
            if (now - timedelta(hours=48) <= timestamp <= now and MARKET.search(title)
                    and trusted(url) and urlsplit(url).hostname == urlsplit(feed).hostname):
                description = " ".join(unescape(re.sub(r"<[^>]*>", " ", entry.findtext("description", ""))).split())
                results.append({"publisher": publisher, "title": title[:300], "url": url, "published": timestamp.isoformat(),
                                "source_summary": description[:650]})
        except (TypeError, ValueError, OverflowError):
            continue
    return results


class ArticleMetadata(HTMLParser):
    def __init__(self):
        super().__init__()
        self.descriptions = {}

    def handle_starttag(self, tag, attrs):
        if tag == "meta":
            values = dict(attrs)
            key = values.get("name") or values.get("property")
            if key in ("description", "og:description") and values.get("content"):
                self.descriptions[key] = " ".join(values["content"].split())[:650]


def search_news(now):
    with ThreadPoolExecutor(max_workers=len(FEEDS)) as worker:
        results = [row for feed in worker.map(lambda item: source_items(item, now), FEEDS.items()) for row in feed]
    picked = []
    seen = set()
    for row in sorted(results, key=lambda item: item["published"], reverse=True):
        key = (row["url"].split("?")[0], row["title"].casefold())
        if any(part in seen for part in key):
            continue
        try:
            raw = download(row["url"], limit=4_000_000)
            if not raw:
                continue
        except (OSError, ValueError):
            continue
        parsed = ArticleMetadata()
        parsed.feed(raw.decode("utf-8", errors="replace"))
        description = parsed.descriptions.get("og:description") or parsed.descriptions.get("description")
        if description and description != row["source_summary"]:
            row["source_summary"] = " ".join(filter(None, (row["source_summary"], description)))[:1100]
        seen.update(key)
        picked.append({"id": len(picked) + 1, **row})
        if len(picked) == 5:
            break
    if not picked:
        raise ValueError("최근 48시간 내 원문을 확인한 경제 기사가 없습니다.")
    return picked


def object_schema(properties):
    return {"type": "object", "properties": properties, "required": list(properties), "additionalProperties": False}


STRING = {"type": "string"}
DRAFT_SCHEMA = object_schema({
    "title": STRING, "excerpt": STRING,
    "watch": object_schema({"btc": STRING, "gold": STRING, "nasdaq": STRING}),
    "items": {"type": "array", "items": object_schema({
        "source": {"type": "integer"}, "fact": STRING, "analysis": STRING,
    })},
})


def codex_json(work, name, instruction, payload):
    exe = shutil.which("codex.exe" if os.name == "nt" else "codex")
    launcher = [exe] if exe else []
    if not launcher and os.name == "nt":
        shim = shutil.which("codex.cmd")
        node = shutil.which("node.exe")
        if shim and node:
            script = Path(shim).parent / "node_modules/@openai/codex/bin/codex.js"
            if script.is_file():
                launcher = [node, str(script)]
    if not launcher:
        raise ValueError("Codex CLI 실행 파일을 찾을 수 없습니다.")
    schema = work / f"{name}-schema.json"
    output = work / f"{name}.json"
    schema.write_text(json.dumps(DRAFT_SCHEMA), encoding="utf-8")
    command = [
        *launcher, "exec", "--ephemeral", "--sandbox", "read-only", "--ignore-user-config",
        "--disable", "shell_tool", "-c", 'web_search="disabled"', "--skip-git-repo-check",
        "--output-schema", schema.name, "--output-last-message", output.name, "-",
    ]
    prompt = instruction + "\n\n<reference-data>\n" + json.dumps(payload, ensure_ascii=False) + "\n</reference-data>"
    try:
        subprocess.run(command, cwd=work, input=prompt.encode("utf-8"),
                       stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True, timeout=300)
        return json.loads(output.read_text(encoding="utf-8"))
    except (subprocess.SubprocessError, OSError, ValueError):
        raise ValueError(f"Codex CLI {name} 단계 실패. 인증과 구조화 출력 지원을 확인하세요.") from None


def valid_draft(data, sources):
    if not isinstance(data, dict) or set(data) != {"title", "excerpt", "items", "watch"}:
        raise ValueError("제목·요약·본문 구조가 올바르지 않습니다.")
    used = set()
    if not isinstance(data["items"], list) or not 1 <= len(data["items"]) <= min(5, len(sources)):
        raise ValueError("기사 항목 개수가 올바르지 않습니다.")
    texts = [(data["title"], 120), (data["excerpt"], 300)]
    watch = data["watch"]
    if not isinstance(watch, dict) or set(watch) != {"btc", "gold", "nasdaq"}:
        raise ValueError("세 종목의 점검 포인트가 필요합니다.")
    texts.extend((watch[key], 420) for key in ("btc", "gold", "nasdaq"))
    for item in data["items"]:
        if not isinstance(item, dict) or set(item) != {"source", "fact", "analysis"} or type(item["source"]) is not int:
            raise ValueError("기사 항목 구조가 올바르지 않습니다.")
        source = item["source"]
        if source not in sources or source in used:
            raise ValueError("중복되거나 확인되지 않은 기사 ID입니다.")
        used.add(source)
        texts.extend(((item["fact"], 480), (item["analysis"], 850)))
    if any(not isinstance(value, str) or not value.strip() or len(value) > limit
           or re.search(r"[\x00-\x1f<>]|https?://|!\[|\]\(|(?:^|\s)#[# ]", value)
           for value, limit in texts):
        raise ValueError("본문은 규격 내의 일반 텍스트여야 합니다.")
    if any(len(watch[key].strip()) < 100 for key in watch) or any(len(item["analysis"].strip()) < 120 for item in data["items"]):
        raise ValueError("종목별 점검 포인트 또는 시장 해석이 지나치게 짧습니다.")
    return [value for value, _ in texts]


def editorial(work, policy, rules, report, news):
    sources = {item["id"]: item for item in news}
    draft = codex_json(work, "draft", policy, {"news": news, "aggregate": report})
    before = valid_draft(draft, sources)
    polished = codex_json(work, "polish", (
        "마켓노트 한국어 윤문 단계입니다. im-not-ai v2.0.0의 아래 규칙으로 어색한 부분만 고치세요. "
        "기사 순서·ID·수치·단위·고유명사·사실과 해석의 강도를 보존하세요. "
        "규칙 문서의 파일 생성 지시는 적용하지 말고 동일한 JSON 구조만 반환하세요.\n\n" + rules
    ), {"draft": draft, "news": news})
    valid_draft(polished, sources)
    if [i["source"] for i in draft["items"]] != [i["source"] for i in polished["items"]]:
        raise ValueError("윤문 중 기사 출처가 바뀌었습니다.")
    protected = re.compile(r"\d+(?:[.,]\d+)*|[A-Z][A-Z0-9-]{1,}")
    reverted = 0
    # im-not-ai keeps the original wherever the rewrite changes a protected fact token.
    for original, revised, fields in [(draft, polished, ("title", "excerpt")),
        (draft["watch"], polished["watch"], ("btc", "gold", "nasdaq")), *(
        (a, b, ("fact", "analysis")) for a, b in zip(draft["items"], polished["items"])
    )]:
        for field in fields:
            if protected.findall(original[field]) != protected.findall(revised[field]):
                revised[field] = original[field]
                reverted += 1
    if reverted:
        print(f"수치·약어를 보존하기 위해 윤문 {reverted}곳을 원문으로 복원했습니다.", flush=True)
    after = valid_draft(polished, sources)
    change = 1 - difflib.SequenceMatcher(None, "\n".join(before), "\n".join(after), autojunk=False).ratio()
    if change > 0.5:
        raise ValueError("윤문 변경률이 50%를 넘었습니다.")
    if change > 0.3:
        print("윤문 변경률 30% 초과")
    return polished
