import { useId, useState } from 'react';
import { sampleStartingBalance, tradingDays, tradingSamples } from '../data/tradingSamples';
import { latestTradeReport, type TradeReport } from '../data/tradeReports';

const symbols = Object.keys(tradingSamples) as (keyof typeof tradingSamples)[];
const number = new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 });
const signedUsd = (value: number) => `${value < 0 ? '−' : value > 0 ? '+' : ''}$${number.format(Math.abs(value))}`;

function cumulative(values: (number | null)[]) {
  let total = 0;
  return [0, ...values.map((value) => value === null ? null : total += value)];
}

export function TradeComparison({ report = latestTradeReport }: { report?: TradeReport }) {
  const chartId = useId();
  const [symbol, setSymbol] = useState<keyof typeof tradingSamples>(() => {
    if (!report || report.series.US100Cash.some(Boolean)) return 'US100Cash';
    return symbols.find((item) => report.series[item].some(Boolean)) ?? 'US100Cash';
  });
  const sample = tradingSamples[symbol];
  const entries = report?.series[symbol];
  const days = report?.days ?? tradingDays;
  const simulated = cumulative(entries?.map((item) => item?.simulated ?? null) ?? sample.simulated);
  const live = cumulative(entries?.map((item) => item?.live ?? null) ?? sample.live);
  const simTotal = [...simulated].reverse().find((value) => value !== null) ?? 0;
  const liveTotal = [...live].reverse().find((value) => value !== null) ?? 0;
  const hasData = !entries || entries.some(Boolean);
  const liveLabel = report ? '실거래' : '실거래 가정';
  const format = (value: number) => report
    ? `${value > 0 ? '+' : ''}${number.format(value)}원`
    : signedUsd(value);
  const range = [...simulated, ...live];
  const bounds = range.filter((value): value is number => value !== null);
  const high = Math.ceil(Math.max(...bounds) / 100) * 100;
  const low = Math.min(high - 100, Math.floor(Math.min(...bounds) / 100) * 100);
  const x = (index: number) => 56 + index * 388 / days.length;
  const y = (value: number) => 15 + (high - value) * 132 / (high - low);
  const points = (series: (number | null)[]) => series.flatMap((value, index) => (
    value === null ? [] : [`${x(index)},${y(value)}`]
  )).join(' ');
  const segments = (series: (number | null)[]) => series.map((value, index) => {
    const previous = series[index - 1];
    return value === null || previous == null ? '' : `M ${x(index - 1)} ${y(previous)} L ${x(index)} ${y(value)}`;
  }).join(' ');

  return (
    <section className="market-panel trade-panel" id="trade" aria-labelledby="trade-heading">
      <div className="trade-heading">
        <div>
          <p className="market-kicker">{sample.label} · 누적 손익 ({report?.currency ?? 'USD'})</p>
          <h2 id="trade-heading">가상매매 vs 실거래</h2>
        </div>
        <span className="sample-badge">{report ? '확인된 거래만 집계' : '샘플 데이터'}</span>
      </div>
      <div className="trade-controls" role="group" aria-label="비교 종목">
        {symbols.map((item) => (
          <button type="button" key={item} onClick={() => setSymbol(item)} aria-pressed={item === symbol}>{item}</button>
        ))}
      </div>
      {hasData ? <><div className="trade-legend">
        <div><span><i />가상매매</span><strong>{format(simTotal)}</strong></div>
        <div><span><i />{liveLabel}</span><strong>{format(liveTotal)}</strong></div>
        <div><span>실거래 − 가상</span><strong>{format(liveTotal - simTotal)}</strong></div>
      </div>
      <svg className="trade-chart" viewBox="0 0 468 175" role="img" aria-labelledby={chartId}>
        <title id={chartId}>{symbol} 누적 손익 비교. 가상매매 {format(simTotal)}, {liveLabel} {format(liveTotal)}. 일별 수치는 아래 표에 있습니다.</title>
        <defs>
          <linearGradient id={`${chartId}-fill`} x2="0" y2="1" gradientUnits="objectBoundingBox">
            <stop stopColor="#64eac4" stopOpacity=".24" />
            <stop offset="100%" stopColor="#64eac4" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[high, (high + low) / 2, low].map((tick) => (
          <g key={tick}>
            <line x1={x(0)} x2={x(days.length)} y1={y(tick)} y2={y(tick)} className="chart-grid" />
            <text x="49" y={y(tick) + 4} textAnchor="end">{new Intl.NumberFormat('ko-KR', { notation: 'compact' }).format(tick)}</text>
          </g>
        ))}
        {!report && <polygon points={`${x(0)},147 ${points(simulated)} ${x(simulated.length - 1)},147`} fill={`url(#${chartId}-fill)`} />}
        <path fill="none" stroke="#64eac4" strokeWidth="2.5" strokeLinejoin="round" d={segments(simulated)} />
        <path fill="none" stroke="#a8bcff" strokeWidth="2.25" strokeDasharray="5 4" strokeLinejoin="round" d={segments(live)} />
        {report ? [simulated, live].map((series, group) => series.map((value, index) => (
          index > 0 && value !== null && <circle key={`${group}-${index}`} cx={x(index)} cy={y(value)} r="3.5" fill={group ? '#a8bcff' : '#64eac4'} />
        ))) : <>
          <circle cx={x(days.length)} cy={y(simTotal)} r="3.5" fill="#64eac4" />
          <circle cx={x(days.length)} cy={y(liveTotal)} r="3.5" fill="#a8bcff" />
        </>}
        {['시작', ...days].map((day, index) => <text key={day} x={x(index)} y="169" textAnchor="middle">{day.slice(-5)}</text>)}
      </svg></> : <p className="market-note py-4">이 종목의 검증된 비교 결과가 없습니다.</p>}
      <div className="trade-foot">
        {report ? <>
          <p className="market-note">{days[0]} ~ {days[days.length - 1]} (KST) · 비교 {entries?.reduce((sum, item) => sum + (item?.count ?? 0), 0)}건</p>
          <p className="market-note">누락일은 합계에서 제외됩니다. USD는 전일까지의 최근 FRED DEXKOUS 관측값을 적용합니다.</p>
          {Object.entries(report.coverage).some(([, status]) => status === 'unavailable') && (
            <p className="market-note">확인 자료 없음 · {Object.entries(report.coverage).filter(([, status]) => status === 'unavailable').map(([project]) => project).join(', ')}</p>
          )}
          {report.missingFx > 0 && <p className="market-note">환율 미확인으로 제외된 전체 종목 비교 {report.missingFx}건</p>}
        </> : <p className="market-note">2026.11.09–13 · 시작 잔고 ${number.format(sampleStartingBalance)} · 두 계열 모두 예시</p>}
        <details>
          <summary>일별 데이터</summary>
          <table>
            <thead><tr><th scope="col">날짜</th><th scope="col">가상매매</th><th scope="col">{liveLabel}</th>{report && <th scope="col">건수</th>}</tr></thead>
            <tbody>{days.map((day, index) => {
              const entry = entries?.[index];
              return (
                <tr key={day}><th scope="row">{day}</th>
                  <td>{entries ? entry ? format(entry.simulated) : '미확인' : format(sample.simulated[index])}</td>
                  <td>{entries ? entry ? format(entry.live) : '미확인' : format(sample.live[index])}</td>
                  {report && <td>{entry?.count ?? '—'}</td>}
                </tr>
              );
            })}</tbody>
          </table>
        </details>
      </div>
    </section>
  );
}
