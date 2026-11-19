"""Read local trading evidence and return a public, aggregate-only report."""

import csv
import json
import sqlite3
from collections import Counter, defaultdict
from dataclasses import dataclass, replace
from datetime import date, datetime, timedelta, timezone
from decimal import Decimal, InvalidOperation, ROUND_HALF_UP
from pathlib import Path

KST = timezone(timedelta(hours=9))
SYMBOLS = ("BTCUSD", "US100Cash", "GOLD")
CONFIGS = {
    "mt5": "config/settings_org.json",
    "mt5_codex1": "config.example.json",
    "mt5_rust1": "src/config.rustgw.json",
}
MONEY_FIELDS = ("profit", "commission", "swap", "fee")


@dataclass(frozen=True)
class Pair:
    symbol: str
    day: date
    simulated: Decimal
    live: Decimal
    currency: str
    tickets: frozenset
    normalized: Decimal | None = None


def price_move(side, entry, exit):
    if side not in ("BUY", "SELL"):
        raise ValueError("unknown trade direction")
    return exit - entry if side == "BUY" else entry - exit


def same_exposure_pnl(pair, event, virtual_prices):
    """Value the virtual move using the observed gross sensitivity of the same MT5 fill."""
    if pair.currency != "USD":
        return None
    deals = {str(row["ticket"]): row for row in event["mt5_deals"]}.values()
    qty = money(event["filled"])
    actual_open = sum(money(row["price"]) * money(row["volume"]) for row in deals if int(row["entry"]) == 0) / qty
    actual_close = sum(money(row["price"]) * money(row["volume"]) for row in deals if int(row["entry"]) in (1, 3)) / qty
    side, virtual_open, virtual_close = virtual_prices
    if side != event.get("side"):
        return None
    actual_move = price_move(side, actual_open, actual_close)
    gross = sum(money(row["profit"]) for row in deals)
    if not actual_move or gross / actual_move <= 0:
        return None
    return price_move(side, virtual_open, virtual_close) * gross / actual_move


def rust_virtual_prices(root, symbol, strategy, stamp, virtual_profit):
    matches = set()
    date_start = datetime.fromisoformat(stamp).date() - timedelta(days=2)
    for file in (root / "results" / f"{symbol}#").glob("trades_*.csv"):
        try:
            if date.fromisoformat(file.stem.split("_")[-2]) < date_start:
                continue
        except ValueError:
            continue
        opened = None
        with file.open(encoding="utf-8-sig", newline="") as stream:
            for row in csv.DictReader(stream):
                if row["strategy"] != strategy:
                    continue
                kind = row["kind"]
                if kind == "진입":
                    side = {"매수": "BUY", "매도": "SELL", "BUY": "BUY", "SELL": "SELL"}.get(row["side"])
                    opened = (side, money(row["price"])) if side else None
                elif kind == "청산":
                    if opened and row["time"] == stamp and money(row["profit_krw"]) == virtual_profit:
                        matches.add((*opened, money(row["price"])))
                    opened = None
    return next(iter(matches)) if len(matches) == 1 else None


def money(value):
    result = Decimal(str(value))
    if not result.is_finite():
        raise ValueError("nonfinite amount")
    return result


def symbol_key(value):
    cleaned = value.rstrip("#").upper()
    return {
        "BTCUSD": "BTCUSD", "US100CASH": "US100Cash", "GOLD": "GOLD", "XAUUSD": "GOLD",
    }.get(cleaned)


def read_json(path):
    return json.loads(path.read_text(encoding="utf-8-sig"))


def selection(project, config):
    if project == "mt5":
        choices = config["check_list"]
        if isinstance(choices, str):
            choices = json.loads(choices) if choices.lstrip().startswith("[") else choices.split(",")
        symbol = symbol_key(config["mt5_symbol"])
        return {symbol: {item.strip() for item in choices if item.strip()}} if symbol else {}
    trade = config["trade_option"]["trade_mt5"]
    if not trade["mt5_enabled"]:
        return {}
    selected = defaultdict(set)
    for symbol, item in trade["real_trade"].items():
        key = symbol_key(symbol)
        if key:
            selected[key].update(item.get("select_Strategy", item.get("select_strategy", [])))
    return dict(selected)


def local_day(value):
    if isinstance(value, (int, float)):
        stamp = datetime.fromtimestamp(value, timezone.utc)
    else:
        stamp = datetime.fromisoformat(value)
    if stamp.tzinfo is None:
        raise ValueError("timestamp must include timezone")
    return stamp.astimezone(KST).date()


def verified_pair(event, selected, days, *, observed=False):
    symbol = symbol_key(event["symbol"])
    if event["strategy_name"] not in selected.get(symbol, ()):
        return None
    if not (
        event.get("dry_run") is False and event.get("environment") == "Live"
        and event.get("flat_confirmed") is True and event.get("history_complete") is True
        and event.get("virtual_profit_final") is True
    ):
        return None
    closed = event["observed_at"] if observed else event["closed_at"]
    day = local_day(closed)
    if day not in days or day != local_day(event["virtual_profit_at"]):
        return None
    if observed:
        delta = datetime.fromtimestamp(closed, timezone.utc) - datetime.fromisoformat(event["virtual_profit_at"])
        if not timedelta(0) <= delta <= timedelta(minutes=5):
            return None
    rows = {}
    for row in event["mt5_deals"]:
        ticket = str(row["ticket"])
        if not ticket.isdigit() or int(ticket) <= 0 or (ticket in rows and rows[ticket] != row):
            return None
        rows[ticket] = row
    positions = {str(row["position_id"]) for row in rows.values()}
    if len(positions) != 1 or not all(value.isdigit() and int(value) > 0 for value in positions):
        return None
    entry = exit = net = Decimal(0)
    for row in rows.values():
        quantity = money(row["volume"])
        direction = int(row["entry"])
        if quantity <= 0:
            return None
        if direction == 0:
            entry += quantity
        elif direction in (1, 3):
            exit += quantity
        else:
            return None
        net += sum(money(row[field]) for field in MONEY_FIELDS)
    if entry <= 0 or entry != exit or entry != money(event["filled"]):
        return None
    currency = event["currency"]
    if currency not in ("USD", "KRW"):
        return None
    return Pair(symbol, day, money(event["virtual_profit_krw"]), net, currency, frozenset(rows))


def rust_events(root):
    path = root / "results/mt5_telegram.sqlite3"
    with sqlite3.connect(path.resolve().as_uri() + "?mode=ro", uri=True, timeout=3) as db:
        return [json.loads(row[0]) for row in db.execute("""
            SELECT payload FROM jobs
            WHERE json_extract(payload, '$.event') IN ('settled', 'settlement_update')
            ORDER BY CASE json_extract(payload, '$.event') WHEN 'settlement_update' THEN 0 ELSE 1 END,
            due DESC, rowid DESC
        """)]


def native_closes(project, root, selected, days):
    closes = Counter()
    first_file_day = days[0] - timedelta(days=2)
    for symbol, choices in selected.items():
        if not choices:
            continue
        files = (
            (root / "history" / symbol).glob(f"trade_data_{symbol}_*.csv") if project == "mt5"
            else (root / "results" / f"{symbol}#").glob("trades_*.csv")
        )
        for file in files:
            suffix = file.stem.split("_")
            date_token = suffix[-1] if project == "mt5" else suffix[-2]
            try:
                if date.fromisoformat(date_token) < first_file_day:
                    continue
            except ValueError:
                continue
            with file.open(encoding="utf-8-sig", newline="") as stream:
                if project == "mt5":
                    rows = ((row[0], row[1], row[2], row[6]) for row in csv.reader(stream) if len(row) == 10)
                else:
                    rows = ((row["strategy"], row["time"], row["kind"], row["profit_krw"])
                            for row in csv.DictReader(stream))
                for strategy, timestamp, kind, amount in rows:
                    if strategy not in choices or kind not in ("청산", "종료 청산"):
                        continue
                    try:
                        stamp = datetime.fromisoformat(timestamp)
                        stamp = stamp.replace(tzinfo=KST) if stamp.tzinfo is None else stamp.astimezone(KST)
                        if stamp.date() in days:
                            closes[symbol, strategy, stamp.replace(microsecond=0), money(amount)] += 1
                    except (ValueError, InvalidOperation, TypeError):
                        continue
    return closes


def collect(roots, evidence_dir, today):
    days = [today - timedelta(days=offset) for offset in range(7, 0, -1)]
    pairs = []
    seen = set()
    coverage = {}
    for project, config_path in CONFIGS.items():
        coverage[project] = "unavailable"
        try:
            root = roots / project
            selected = selection(project, read_json(root / config_path))
            if not any(selected.values()):
                coverage[project] = "no_selection"
                continue
            external = evidence_dir / f"{project}.json"
            observed = project == "mt5_rust1" and not external.is_file()
            events = rust_events(root) if observed else read_json(external)
            if not isinstance(events, list):
                raise ValueError("invalid transaction evidence")
            native = native_closes(project, root, selected, days) if project != "mt5_rust1" else None
            for event in events:
                try:
                    pair = verified_pair(event, selected, days, observed=observed)
                    if pair is not None and native is not None:
                        stamp = datetime.fromisoformat(event["virtual_profit_at"]).astimezone(KST)
                        key = pair.symbol, event["strategy_name"], stamp.replace(microsecond=0), pair.simulated
                        if native[key] != 1:
                            continue
                        native[key] = 0
                except (KeyError, ValueError, TypeError, InvalidOperation, OverflowError):
                    continue
                if pair is None or seen.intersection(pair.tickets):
                    continue
                seen.update(pair.tickets)
                normalized = None
                try:
                    if project == "mt5_rust1":
                        prices = rust_virtual_prices(root, pair.symbol, event["strategy_name"],
                                                    event["virtual_profit_at"], pair.simulated)
                    else:
                        explicit = event.get("virtual_prices")
                        prices = (explicit["side"], money(explicit["entry"]), money(explicit["exit"])) if explicit else None
                    if prices:
                        normalized = same_exposure_pnl(pair, event, prices)
                except (OSError, KeyError, TypeError, ValueError, InvalidOperation, csv.Error):
                    pass
                pair = replace(pair, normalized=normalized)
                pairs.append((project, pair))
                coverage[project] = "partial"
        except (OSError, sqlite3.Error, csv.Error, ValueError, TypeError, KeyError):
            continue
    return days, pairs, coverage


def parse_rates(text):
    rates = {}
    for row in csv.DictReader(text.splitlines()):
        if row.get("DEXKOUS") in (None, "", "."):
            continue
        value = money(row["DEXKOUS"])
        if value > 0:
            rates[date.fromisoformat(row.get("observation_date") or row["DATE"])] = value
    return rates


def public_report(days, pairs, coverage, rates):
    amounts = defaultdict(lambda: [Decimal(0), Decimal(0), 0, Decimal(0), 0])
    missing_fx = 0
    included = set()
    for project, pair in pairs:
        rate = Decimal(1)
        if pair.currency == "USD":
            available = [day for day in rates if timedelta(0) < pair.day - day <= timedelta(days=7)]
            if not available:
                missing_fx += 1
                continue
            rate = rates[max(available)]
        values = amounts[pair.symbol, pair.day]
        values[0] += pair.simulated
        values[1] += pair.live * rate
        values[2] += 1
        values[3] += (pair.normalized * rate) if pair.normalized is not None else 0
        values[4] += pair.normalized is not None
        included.add(project)
    if not amounts:
        raise ValueError("검증된 비교 결과가 없습니다. 체결 근거와 환율을 확인하세요.")
    return {
        "currency": "KRW",
        "basis": "same_fill_v1",
        "days": [day.isoformat() for day in days],
        "coverage": {project: status if project in included or status != "partial" else "unavailable"
                     for project, status in coverage.items()},
        "missingFx": missing_fx,
        "series": {
            symbol: [
                dict(zip(("simulated", "live", "count", "virtualOriginal"), (
                    int(amounts[symbol, day][3].quantize(Decimal(1), rounding=ROUND_HALF_UP))
                    if amounts[symbol, day][2] == amounts[symbol, day][4] else None,
                    int(amounts[symbol, day][1].quantize(Decimal(1), rounding=ROUND_HALF_UP)),
                    amounts[symbol, day][2],
                    int(amounts[symbol, day][0].quantize(Decimal(1), rounding=ROUND_HALF_UP)),
                ))) if (symbol, day) in amounts else None
                for day in days
            ]
            for symbol in SYMBOLS
        },
    }
