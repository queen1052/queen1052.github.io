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
    return symbols.find((item) => report.series[item].some(Boolean)) ??
      (report.binance?.series.some(Boolean) ? 'BTCUSD' : 'US100Cash');
  });
  const sample = tradingSamples[symbol];
  const entries = report?.series[symbol];
  const isBinance = Boolean(report && symbol === 'BTCUSD');
  const binance = isBinance ? report?.binance : undefined;
  const days = report?.days ?? tradingDays;
  const normalized = report?.basis === 'same_fill_v1';
  const comparableEntries = entries?.map((item) => item?.simulated == null ? null : item);
  const simulated = cumulative(isBinance ? days.map(() => null) : comparableEntries?.map((item) => item?.simulated ?? null) ?? sample.simulated);
  const live = cumulative(isBinance ? days.map((_, index) => binance?.series[index]?.live ?? null)
    : comparableEntries?.map((item) => item?.live ?? null) ?? sample.live);
  const simTotal = [...simulated].reverse().find((value) => value !== null) ?? 0;
  const liveTotal = [...live].reverse().find((value) => value !== null) ?? 0;
  const hasData = isBinance ? binance?.series.some(Boolean) : !entries || comparableEntries?.some(Boolean);
  const simLabel = normalized ? '가상 손익 · 실체결 수량 기준' : '가상매매';
  const liveLabel = isBinance ? 'Binance 순손익' : report ? 'MT5 실거래 순손익' : '실거래 가정';
  const format = (value: number) => report
    ? `${value > 0 ? '+' : ''}${number.format(value)}${isBinance ? ' USDT' : '원'}`
    : signedUsd(value);
  const decimals = new Intl.NumberFormat('en-US', { maximumFractionDigits: 8 });
  const settled = binance?.series.filter((row) => row !== null) ?? [];
  const mt5Rows = entries?.filter((row) => row !== null) ?? [];
  const lots = mt5Rows.length && mt5Rows.every((row) => row.lots != null)
    ? mt5Rows.reduce((sum, row) => sum + (row.lots ?? 0), 0) : null;
  const virtualLots = mt5Rows.length && mt5Rows.every((row) => row.virtualLots != null)
    ? mt5Rows.reduce((sum, row) => sum + (row.virtualLots ?? 0), 0) : null;
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
          <p className="market-kicker">{isBinance ? 'Binance BTCUSDT · USDT' : `${sample.label} · 누적 손익 (${report?.currency ?? 'USD'})`}</p>
          <h2 id="trade-heading">{isBinance ? 'Binance 정산' : '가상매매 vs 실거래'}</h2>
        </div>
        <span className="sample-badge">{isBinance ? binance?.environment ?? '자료 미확인' : report ? 'MT5' : '샘플 데이터'}</span>
      </div>
      <div className="trade-controls" role="group" aria-label="비교 종목">
        {symbols.map((item) => (
          <button type="button" key={item} onClick={() => setSymbol(item)} aria-pressed={item === symbol}>{item}</button>
        ))}
      </div>
      {hasData ? <><div className="trade-legend">
        {isBinance ? <>
          <div><span>정산 순손익</span><strong>{format(liveTotal)}</strong></div>
          <div><span>수수료</span><strong>{number.format(settled.reduce((sum, row) => sum + row.fees, 0))} USDT</strong></div>
          <div><span>펀딩</span><strong>{format(settled.reduce((sum, row) => sum + row.funding, 0))}</strong></div>
        </> : <>
          <div><span><i />{simLabel}</span><strong>{format(simTotal)}</strong></div>
          <div><span><i />{liveLabel}</span><strong>{format(liveTotal)}</strong></div>
          <div><span>{report && !normalized ? '기준 보정 전' : '실거래 − 가상'}</span><strong>{report && !normalized ? '—' : format(liveTotal - simTotal)}</strong></div>
        </>}
      </div>
      <svg className="trade-chart" viewBox="0 0 468 175" role="img" aria-labelledby={chartId}>
        <title id={chartId}>{isBinance ? `Binance BTCUSDT 누적 순손익 ${format(liveTotal)}` : `${symbol} 누적 손익 비교. 가상매매 ${format(simTotal)}, ${liveLabel} ${format(liveTotal)}.`} 일별 수치는 아래 표에 있습니다.</title>
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
      </svg></> : <p className="market-note py-4">{isBinance ? '확인된 Binance 정산 기록이 없습니다.' : entries?.some(Boolean) ? '가상 가격 또는 계약 기준 미확인 · 실거래 순손익은 일별 표에서 확인할 수 있습니다.' : '이 종목의 검증된 MT5 비교 결과가 없습니다.'}</p>}
      <div className="trade-foot">
        {isBinance ? <>
          <p className="market-note">{days[0]} ~ {days[days.length - 1]} (KST) · 정산 {settled.reduce((sum, row) => sum + row.count, 0)}건 · 청산 {decimals.format(settled.reduce((sum, row) => sum + row.quantity, 0))} BTC</p>
          <p className="market-note">정산 순손익에는 수수료와 펀딩을 반영했습니다. 가상매매 대비 차이는 확정된 짝을 확인할 수 없어 표시하지 않습니다.</p>
        </> : report ? <>
          <p className="market-note">{days[0]} ~ {days[days.length - 1]} (KST) · 비교 {entries?.reduce((sum, item) => sum + (item?.count ?? 0), 0)}건</p>
          <p className="market-note">MT5 청산 수량 {lots === null ? '미확인' : `${decimals.format(lots)} lot`}{lots !== null && virtualLots !== null && virtualLots > 0 ? ` · 실체결/가상 lot 비율 ${decimals.format(lots / virtualLots)}배` : ''}</p>
          <p className="market-note">{normalized
            ? '가상 가격에 동일 실체결 수량의 계약 손익률을 적용했습니다. 양쪽 USD 손익에는 같은 FRED DEXKOUS 환율을 적용합니다.'
            : '이전 보고서의 가상 손익에는 실체결 수량 보정이 적용되지 않았습니다.'}</p>
          {entries?.some((item) => item && item.simulated === null) && (
            <p className="market-note">보정이 확인된 날짜만 차트에 포함합니다.</p>
          )}
          {Object.entries(report.coverage).some(([, status]) => status === 'unavailable') && (
            <p className="market-note">확인 자료 없음 · {Object.entries(report.coverage).filter(([, status]) => status === 'unavailable').map(([project]) => project).join(', ')}</p>
          )}
          {report.missingFx > 0 && <p className="market-note">환율 미확인으로 제외된 전체 종목 비교 {report.missingFx}건</p>}
        </> : <p className="market-note">2026.11.09–13 · 시작 잔고 ${number.format(sampleStartingBalance)} · 두 계열 모두 예시</p>}
        <details>
          <summary>일별 데이터</summary>
          <div className="overflow-x-auto">
          {isBinance ? <table>
            <thead><tr><th scope="col">날짜</th><th scope="col">순손익</th><th scope="col">수수료</th><th scope="col">펀딩</th><th scope="col">청산 BTC</th><th scope="col">건수</th></tr></thead>
            <tbody>{days.map((day, index) => {
              const row = binance?.series[index];
              return <tr key={day}><th scope="row">{day}</th><td>{row ? format(row.live) : '미확인'}</td><td>{row ? `${number.format(row.fees)} USDT` : '—'}</td><td>{row ? format(row.funding) : '—'}</td><td>{row ? decimals.format(row.quantity) : '—'}</td><td>{row?.count ?? '—'}</td></tr>;
            })}</tbody>
          </table> : <table>
            <thead><tr><th scope="col">날짜</th>{report && <th scope="col">가상 엔진 원본</th>}<th scope="col">{simLabel}</th><th scope="col">{liveLabel}</th>{report && <><th scope="col">청산 lot</th><th scope="col">건수</th></>}</tr></thead>
            <tbody>{days.map((day, index) => {
              const entry = entries?.[index];
              return (
                <tr key={day}><th scope="row">{day}</th>
                  {report && <td>{entry?.virtualOriginal != null ? format(entry.virtualOriginal) : '—'}</td>}
                  <td>{entries ? entry?.simulated != null ? format(entry.simulated) : '미확인' : format(sample.simulated[index])}</td>
                  <td>{entries ? entry ? format(entry.live) : '미확인' : format(sample.live[index])}</td>
                  {report && <><td>{entry?.lots != null ? decimals.format(entry.lots) : '—'}</td><td>{entry?.count ?? '—'}</td></>}
                </tr>
              );
            })}</tbody>
          </table>}
          </div>
        </details>
      </div>
    </section>
  );
}
