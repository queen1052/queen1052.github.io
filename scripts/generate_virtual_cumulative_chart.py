"""Generate an all-history cumulative P&L chart for the selected virtual strategies."""

import argparse
import csv
from collections import OrderedDict
from datetime import datetime
from decimal import Decimal
from pathlib import Path


STRATEGIES = OrderedDict(
    [
        ("mt5_codex1 Gold", ("GOLD#_cusbox2_2m_1700", "#38bdf8")),
        ("mt5_rust1 Gold", ("GOLD#_crs_2m_0900_trend_a", "#f59e0b")),
    ]
)


def read_closes(root, strategy, cutoff):
    events = {}
    for path in sorted(Path(root).glob("*.csv")):
        with path.open("r", encoding="utf-8-sig", newline="") as handle:
            for row in csv.DictReader(handle):
                if row.get("strategy") != strategy or row.get("kind") != "청산":
                    continue
                stamp = datetime.fromisoformat(row["time"])
                if stamp > cutoff:
                    continue
                key = (row["time"], row.get("price"), row.get("profit_krw"), row.get("reason"))
                events[key] = (stamp, Decimal(row["profit_krw"]))
    return sorted(events.values())


def money(value):
    sign = "−" if value < 0 else "+"
    return f"{sign}{abs(value):,.0f}원"


def make_svg(series, cutoff):
    width, height = 960, 520
    left, right, top, bottom = 132, 820, 150, 402
    values = [Decimal(0)]
    for events in series.values():
        total = Decimal(0)
        for _, profit in events:
            total += profit
            values.append(total)
    low, high = min(values), max(values)
    span = max(high - low, Decimal(1))
    low -= span * Decimal("0.08")
    high += span * Decimal("0.08")

    def y(value):
        return bottom - float((value - low) / (high - low)) * (bottom - top)

    count = max(len(events) for events in series.values())
    def x(index):
        return left + (right - left) * index / max(count - 1, 1)

    paths = []
    labels = []
    for label, events in series.items():
        total = Decimal(0)
        points = [(x(0), y(total))]
        for index, (_, profit) in enumerate(events, start=1):
            total += profit
            points.append((x(index), y(total)))
        path = " ".join(("M" if i == 0 else "L") + f"{px:.1f} {py:.1f}" for i, (px, py) in enumerate(points))
        color = STRATEGIES[label][1]
        paths.append(f'<path d="{path}" fill="none" stroke="{color}" stroke-width="3"/>')
        for px, py in (points[0], points[-1]):
            labels.append(f'<circle cx="{px:.1f}" cy="{py:.1f}" r="5" fill="{color}" stroke="#111c2e" stroke-width="2"/>')
        labels.append(f'<text x="{right - 4}" y="{y(total) - 10:.1f}" text-anchor="end" fill="{color}" font-weight="700">{label}: {money(total)}</text>')

    ticks = []
    for fraction in (0, 0.25, 0.5, 0.75, 1):
        value = high - (high - low) * Decimal(str(fraction))
        yy = top + (bottom - top) * fraction
        ticks.append(f'<line x1="{left}" y1="{yy:.1f}" x2="{right}" y2="{yy:.1f}"/>')
        ticks.append(f'<text x="{left - 10}" y="{yy + 4:.1f}" text-anchor="end">{money(value)}</text>')

    legend = '<line x1="590" y1="67" x2="618" y2="67" stroke="#38bdf8" stroke-width="3"/><text x="626" y="72">mt5_codex1 Gold</text><line x1="770" y1="67" x2="798" y2="67" stroke="#f59e0b" stroke-width="3"/><text x="806" y="72">mt5_rust1 Gold</text>'
    display_cutoff = cutoff.replace(minute=0, second=0, microsecond=0) if cutoff.minute == 5 else cutoff
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} {height}" role="img" aria-labelledby="title desc">
  <title id="title">Gold 가상매매 전략 전체 누적 손익</title>
  <desc id="desc">각 선택 전략의 최초 기록부터 2026년 11월 27일 05시까지 모든 확정 청산 손익을 시간순으로 누적한 그래프</desc>
  <rect width="{width}" height="{height}" rx="24" fill="#0b1220"/><rect x="32" y="32" width="896" height="456" rx="18" fill="#111c2e" stroke="#263852"/>
  <text x="72" y="78" fill="#f8fafc" font-family="Arial, sans-serif" font-size="24" font-weight="700">Gold 가상매매 전략 전체 누적 손익</text>
  <text x="72" y="106" fill="#94a3b8" font-family="Arial, sans-serif" font-size="14">최초 기록부터 {display_cutoff.strftime('%Y-%m-%d %H:%M')} KST까지 · 세션 종료 직후 최종 기록 포함 · 일별 손익이 아니라 모든 청산을 누적</text>
  <g stroke="#263852" stroke-width="1" fill="#94a3b8" font-family="Arial, sans-serif" font-size="11">{"".join(ticks)}</g>
  <line x1="{left}" y1="{top}" x2="{left}" y2="{bottom}" stroke="#64748b" stroke-width="2"/>
  {''.join(paths)}{''.join(labels)}
  <g fill="#cbd5e1" font-family="Arial, sans-serif" font-size="12"><text x="72" y="470">선: 전략별 모든 확정 청산의 누적 손익 · 현재 글의 세션 표와 다른 전체 기간 범위</text></g>
  <g fill="#cbd5e1" font-family="Arial, sans-serif" font-size="11">{legend}</g>
</svg>'''


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--codex-root", required=True)
    parser.add_argument("--rust-root", required=True)
    parser.add_argument("--output", required=True)
    parser.add_argument("--cutoff", default="2026-11-27T05:00:00+09:00")
    args = parser.parse_args()
    cutoff = datetime.fromisoformat(args.cutoff)
    roots = {"mt5_codex1 Gold": args.codex_root, "mt5_rust1 Gold": args.rust_root}
    series = OrderedDict((label, read_closes(roots[label], strategy, cutoff)) for label, (strategy, _) in STRATEGIES.items())
    Path(args.output).write_text(make_svg(series, cutoff), encoding="utf-8")
    for label, events in series.items():
        print(label, len(events), sum((profit for _, profit in events), Decimal(0)))


if __name__ == "__main__":
    main()
