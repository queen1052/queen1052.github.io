"""Publish one Korean market brief and its public trading snapshot."""

import argparse
import hashlib
import json
import msvcrt
import os
import re
import shutil
import subprocess
import tempfile
from datetime import datetime, timedelta, timezone
from pathlib import Path
from urllib.error import URLError

from market_news import editorial, search_news
from market_trade_data import KST, binance_report, collect, parse_rates, public_report

ROOT = Path(__file__).resolve().parent.parent
WORK = ROOT / ".market-publisher"
REMOTE = "https://github.com/queen1052/queen1052.github.io.git"
IMPLEMENTATION = (
    ".gitignore",
    "scripts/publish_market_brief.py", "scripts/market_trade_data.py", "scripts/market_news.py",
    "scripts/market_editorial.md", "scripts/test_market_publisher.py", "docs/market-publisher.md",
    "site/scripts/vite-plugin-posts.mjs", "site/src/app/data/tradeReports.ts",
    "site/src/app/data/types.ts", "site/src/app/pages/PostDetail.tsx",
    "site/src/app/components/TradeComparison.tsx", "site/src/app/components/MarketPriceCharts.tsx",
    "site/src/app/pages/market-home.css",
)


def run(command, cwd=ROOT, timeout=90):
    return subprocess.run(command, cwd=cwd, check=True, timeout=timeout, text=True,
                          encoding="utf-8", errors="replace", stdout=subprocess.PIPE,
                          stderr=subprocess.STDOUT).stdout.strip()


def git(*args, cwd=ROOT):
    return run(["git", *args], cwd)


def atomic_write(path, text):
    path.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.NamedTemporaryFile(dir=path.parent, delete=False, mode="w", encoding="utf-8", newline="\n") as stream:
        temporary = Path(stream.name)
        stream.write(text)
    try:
        os.replace(temporary, path)
    finally:
        temporary.unlink(missing_ok=True)


def plain(text):
    return re.sub(r"([\\`*_\[\]{}#!|])", r"\\\1", text)


def markdown(today, report, news, draft):
    metadata = {
        "title": draft["title"], "excerpt": draft["excerpt"], "date": today,
        "category": "경제", "tags": ["시장 브리핑", "BTCUSD", "GOLD", "US100Cash"],
        "author": "마켓노트", "readTime": "4분", "marketBrief": True,
    }
    lines = ["---"]
    lines.extend(f"{key}: {json.dumps(value, ensure_ascii=False)}" for key, value in metadata.items())
    lines.extend(["---", "", "## 오늘의 경제 뉴스", ""])
    sources = {row["id"]: row for row in news}
    for item in draft["items"]:
        source = sources[item["source"]]
        stamp = datetime.fromisoformat(source["published"]).astimezone(KST).strftime("%m-%d %H:%M KST")
        lines += [plain(item["fact"]), "", f"**시장 해석** · {plain(item['analysis'])}", "",
                  f"출처 [{plain(source['publisher'])}](<{source['url']}>) · {stamp}", ""]
    if draft.get("watch"):
        lines.extend(["## 종목별 점검 포인트", ""])
        for symbol, label in (("btc", "BTCUSD"), ("gold", "GOLD"), ("nasdaq", "나스닥 100")):
            lines.extend([f"### {label}", "", plain(draft["watch"][symbol]), ""])
    lines += [
        "## 가상매매와 실거래 비교", "",
        f"집계 기간은 {report['days'][0]} ~ {report['days'][-1]} (KST)입니다. MT5는 원화, Binance는 USDT로 표시합니다.", "",
        "| MT5 종목 | 확인 거래 | 청산 lot 합계 | 가상 엔진 원본 | 가상 손익 (동일 lot) | MT5 순손익 |",
        "| --- | ---: | ---: | ---: | ---: | ---: |",
    ]
    for symbol, rows in report["series"].items():
        if symbol == "BTCUSD":
            continue
        values = [item for item in rows if item is not None]
        if not values:
            lines.append(f"| {symbol} | 미확인 | — | — | — | — |")
            continue
        comparable = all(row["simulated"] is not None for row in values)
        simulated = f"{sum(row['simulated'] for row in values):+,}원" if comparable else "보정 미확인"
        lots = f"{sum(row['lots'] for row in values):g}" if all(row.get("lots") is not None for row in values) else "미확인"
        lines.append(f"| {symbol} | {sum(row['count'] for row in values):,} | {lots} | "
                     f"{sum(row['virtualOriginal'] for row in values):+,}원 | {simulated} | "
                     f"{sum(row['live'] for row in values):+,}원 |")
    binance = report.get("binance")
    lines.extend(["", "### BTCUSD 지표 · Binance BTCUSDT 정산", ""])
    settled = [row for row in binance["series"] if row] if binance else []
    if settled:
        lines.append(
            f"Binance {binance['environment']}에서 확인한 정산 {sum(row['count'] for row in settled)}건의 "
            f"순손익은 {sum(row['live'] for row in settled):+,.2f} USDT입니다. "
            f"청산 수량 합계는 {sum(row['quantity'] for row in settled):g} BTC이며 "
            f"수수료 {sum(row['fees'] for row in settled):,.2f} USDT와 "
            f"펀딩 {sum(row['funding'] for row in settled):+,.2f} USDT가 반영됐습니다."
        )
    else:
        lines.append("이 기간에 사용할 수 있는 Binance 정산 자료를 확인하지 못했습니다.")
    unavailable = [project for project, status in report["coverage"].items() if status == "unavailable"]
    if unavailable:
        lines.extend(["", "비교 자료 미확인 · " + ", ".join(unavailable)])
    if report["missingFx"]:
        lines.extend(["", f"환율 미확인으로 비교 {report['missingFx']}건을 제외했습니다."])
    lines += ["", "가상 손익은 기록된 가상 진입·청산 가격에 동일 실체결 수량의 계약 손익률을 적용한 추정치입니다. "
              "MT5 실거래 순손익은 확인된 체결 비용과 스왑을 반영합니다. 두 USD 금액은 거래일 전일까지의 "
              "최근 [FRED DEXKOUS](https://fred.stlouisfed.org/series/DEXKOUS) 관측값을 사용합니다. "
              "가격이나 계약 손익률이 미확인인 가상 손익은 금액을 비웁니다. Binance 정산은 USDT로 별도 표시합니다.",
              "", "이 브리핑은 공개 출처와 거래 집계를 바탕으로 AI 도구의 도움을 받아 작성했습니다.", ""]
    return "\n".join(lines)


def publish(args, today, report, news):
    day = today.isoformat()
    post = f"site/posts/{day}-market-brief.md"
    report_path = f"site/src/app/data/trade-reports/{day}.json"
    manifest_path = WORK / "pending.json"
    if manifest_path.exists():
        raise ValueError("이전 발행 커밋이 대기 중입니다. --retry-push를 사용하세요.")
    if git("remote", "get-url", "origin") != REMOTE:
        raise ValueError("검증된 GitHub 원격 주소가 아닙니다.")
    git("fetch", "--no-tags", "origin", "main")
    base = git("rev-parse", "FETCH_HEAD")
    if args.bootstrap:
        if git("rev-parse", "HEAD") != base or git("branch", "--show-current") != "main":
            raise ValueError("최초 게시 전 로컬 main과 원격 main이 같아야 합니다.")
        if git("diff", "--cached", "--name-only"):
            raise ValueError("최초 게시에는 비어 있는 스테이징 영역이 필요합니다.")
        for path in (post, report_path):
            if (ROOT / path).exists():
                raise ValueError("최초 게시 경로에 기존 파일이 있습니다.")
    else:
        git("cat-file", "-e", f"{base}:scripts/publish_market_brief.py")
    editorial_path = ROOT / "scripts/market_editorial.md"
    policy = editorial_path.read_text(encoding="utf-8")
    rules = args.humanize_rules.read_text(encoding="utf-8")
    if "v2.0" not in rules[:500]:
        raise ValueError("im-not-ai v2.0 한국어 윤문 규칙 파일이 필요합니다.")
    payload = json.dumps(report, ensure_ascii=False, sort_keys=True, indent=2)
    token = hashlib.sha256(json.dumps([report, news, policy, rules], sort_keys=True).encode()).hexdigest()
    marker = f"<!-- market-input: {token} -->"
    worktree = WORK / "checkout"
    if worktree.exists():
        raise ValueError("이전 실행의 작업 트리가 남아 있습니다. 상태를 확인하세요.")
    git("worktree", "add", "--detach", str(worktree), base)
    cleanup = True
    try:
        if (worktree / post).is_file():
            old = (worktree / post).read_text(encoding="utf-8")
            if marker in old and (worktree / report_path).read_text(encoding="utf-8").strip() == payload:
                print(f"{day}: 거래 자료와 출처 변경 없음")
                return
            if not re.search(r"^<!-- market-input: [0-9a-f]{64} -->$", old, re.M):
                raise ValueError("자동 발행으로 생성되지 않은 글이 같은 경로에 있습니다.")
        if args.bootstrap:
            for path in IMPLEMENTATION:
                target = worktree / path
                target.parent.mkdir(parents=True, exist_ok=True)
                shutil.copyfile(ROOT / path, target)
        with tempfile.TemporaryDirectory(prefix="editor-", dir=WORK) as temp:
            draft = editorial(Path(temp), policy, rules, report, news)
        atomic_write(worktree / post, markdown(day, report, news, draft) + "\n" + marker + "\n")
        atomic_write(worktree / report_path, payload + "\n")
        site = worktree / "site"
        npm = shutil.which("npm.cmd")
        node = shutil.which("node.exe")
        if not npm or not node:
            raise ValueError("npm 실행 파일을 찾을 수 없습니다.")
        npm_cli = Path(npm).parent / "node_modules/npm/bin/npm-cli.js"
        run([node, str(npm_cli), "ci", "--prefer-offline", "--no-audit", "--no-fund"], site, timeout=240)
        run([node, "node_modules/vite/bin/vite.js", "build"], site, timeout=180)
        slug = f"market-brief-{day}"
        posts = json.loads((site / "src/generated/posts.json").read_text(encoding="utf-8"))
        if not any(item["slug"] == slug and item.get("marketBriefDate") == day for item in posts):
            raise ValueError("빌드 출력에 오늘의 경제 브리핑이 없습니다.")
        if any(key in payload for key in ('"ticket"', '"account"', '"strategy_name"', '"mt5_deals"')):
            raise ValueError("공개 집계에 비공개 필드가 있습니다.")
        if args.bootstrap:
            # Commit on main once so the initial installation and generated files are present locally.
            if any((ROOT / path).read_bytes() != (worktree / path).read_bytes() for path in IMPLEMENTATION):
                raise ValueError("검증 중 프로그램 파일이 바뀌었습니다.")
            for path in (post, report_path):
                atomic_write(ROOT / path, (worktree / path).read_text(encoding="utf-8"))
        commit_root = ROOT if args.bootstrap else worktree
        paths = [post, report_path, *(IMPLEMENTATION if args.bootstrap else ())]
        git("add", "--", *paths, cwd=commit_root)
        git("diff", "--cached", "--check", cwd=commit_root)
        if set(git("diff", "--cached", "--name-only", cwd=commit_root).splitlines()) - set(paths):
            raise ValueError("예상하지 않은 파일이 스테이징되어 있습니다.")
        git("commit", "--only", "-m", f"Publish MarketNote brief {day}", "--", *paths, cwd=commit_root)
        commit = git("rev-parse", "HEAD", cwd=commit_root)
        atomic_write(manifest_path, json.dumps({"commit": commit, "checkout": not args.bootstrap, "base": base}))
        cleanup = False
        push_pending()
    finally:
        if cleanup:
            git("worktree", "remove", "--force", str(worktree))


def push_pending():
    manifest_path = WORK / "pending.json"
    pending = json.loads(manifest_path.read_text(encoding="utf-8"))
    commit = pending["commit"]
    checkout = WORK / "checkout"
    source = checkout if pending["checkout"] else ROOT
    if not re.fullmatch(r"[0-9a-f]{40,64}", commit) or git("rev-parse", "HEAD", cwd=source) != commit:
        raise ValueError("게시 대기 커밋을 확인할 수 없습니다.")
    if git("remote", "get-url", "origin", cwd=source) != REMOTE:
        raise ValueError("검증된 GitHub 원격 주소가 아닙니다.")
    git("push", "origin", f"{commit}:refs/heads/main", cwd=source)
    manifest_path.unlink()
    if pending["checkout"] and git("branch", "--show-current") == "main" and git("rev-parse", "HEAD") == pending["base"]:
        try:
            git("merge", "--ff-only", commit)
        except subprocess.CalledProcessError:
            print("원격 발행 완료 · 로컬 작업 변경과 겹쳐 로컬 main 동기화를 보류했습니다.")
    if checkout.exists():
        git("worktree", "remove", "--force", str(checkout))
    print(f"게시 완료 · {commit}")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--dry-run", action="store_true", help="거래·기사 입력 검증만 수행")
    parser.add_argument("--bootstrap", action="store_true", help="최초 게시 커밋에 프로그램 파일을 포함")
    parser.add_argument("--retry-push", action="store_true", help="기존 게시 커밋을 재사용")
    parser.add_argument("--projects", type=Path, default=ROOT.parent)
    parser.add_argument("--evidence-dir", type=Path, default=Path.home() / ".market-note" / "evidence")
    parser.add_argument("--humanize-rules", type=Path, default=Path.home() / (
        ".codex/plugins/cache/im-not-ai-codex-marketplace/im-not-ai-codex/2.0.0/skills/"
        "humanize-korean/references/quick-rules.md"
    ))
    args = parser.parse_args()
    if sum((args.dry_run, args.bootstrap, args.retry_push)) > 1:
        parser.error("실행 옵션은 하나만 선택하세요.")
    if args.evidence_dir.resolve().is_relative_to(ROOT):
        parser.error("체결 근거는 블로그 저장소 밖에 두세요.")
    os.environ["GIT_TERMINAL_PROMPT"] = "0"
    WORK.mkdir(exist_ok=True)
    try:
        with (WORK / "run.lock").open("a+b") as lock:
            lock.seek(0)
            try:
                msvcrt.locking(lock.fileno(), msvcrt.LK_NBLCK, 1)
            except OSError:
                raise ValueError("다른 게시 작업이 실행 중입니다.") from None
            if args.retry_push:
                push_pending()
                return 0
            now = datetime.now(timezone.utc)
            today = now.astimezone(KST).date()
            days, pairs, coverage = collect(args.projects, args.evidence_dir, today)
            binance = binance_report(args.projects / "mt5_rust1", days)
            print(f"{days[0]} ~ {days[-1]} · 검증 후보 {len(pairs)}건 · {coverage}", flush=True)
            endpoint = ("https://fred.stlouisfed.org/graph/fredgraph.csv?id=DEXKOUS"
                        f"&cosd={days[0] - timedelta(days=7)}&coed={days[-1]}")
            rates = {}
            if any(pair.currency == "USD" for _, pair in pairs):
                try:
                    rates = parse_rates(run([
                        "curl.exe", "--fail", "--silent", "--show-error", "--max-time", "20", endpoint,
                    ], timeout=25))
                except (ValueError, OSError, subprocess.SubprocessError):
                    print("FRED 환율 조회 실패")
            report = public_report(days, pairs, coverage, rates, binance)
            news = search_news(now)
            print(f"검증된 기사 {len(news)}건", flush=True)
            if not args.dry_run:
                publish(args, today, report, news)
            return 0
    except (ValueError, KeyError, OSError, URLError, subprocess.SubprocessError) as exc:
        if isinstance(exc, subprocess.CalledProcessError):
            print(f"게시 중단 · {Path(exc.cmd[0]).name} 종료 코드 {exc.returncode}")
        else:
            print(f"게시 중단 · {exc}")
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
