import { useState } from 'react';
import { sampleStartingBalance, tradingDays, tradingSamples } from '../data/tradingSamples';

const symbols = Object.keys(tradingSamples) as (keyof typeof tradingSamples)[];
const number = new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 });
const signedUsd = (value: number) => `${value < 0 ? '−' : value > 0 ? '+' : ''}$${number.format(Math.abs(value))}`;

function cumulative(values: number[]) {
  let total = 0;
  return [0, ...values.map((value) => total += value)];
}

export function TradeComparison() {
  const [symbol, setSymbol] = useState<keyof typeof tradingSamples>('US100Cash');
  const sample = tradingSamples[symbol];
  const simulated = cumulative(sample.simulated);
  const live = cumulative(sample.live);
  const simTotal = simulated[simulated.length - 1];
  const liveTotal = live[live.length - 1];
  const range = [...simulated, ...live];
  const high = Math.ceil(Math.max(...range) / 100) * 100;
  const low = Math.floor(Math.min(...range) / 100) * 100;
  const x = (index: number) => 44 + index * 400 / tradingDays.length;
  const y = (value: number) => 15 + (high - value) * 132 / (high - low);
  const points = (series: number[]) => series.map((value, index) => `${x(index)},${y(value)}`).join(' ');

  return (
    <section className="market-panel trade-panel" id="trade" aria-labelledby="trade-heading">
      <div className="trade-heading">
        <div>
          <p className="market-kicker">{sample.label} · 누적 손익 (USD)</p>
          <h2 id="trade-heading">가상매매 vs 실거래</h2>
        </div>
        <span className="sample-badge">샘플 데이터</span>
      </div>
      <div className="trade-controls" role="group" aria-label="비교 종목">
        {symbols.map((item) => (
          <button type="button" key={item} onClick={() => setSymbol(item)} aria-pressed={item === symbol}>{item}</button>
        ))}
      </div>
      <div className="trade-legend">
        <div><span><i />가상매매</span><strong>{signedUsd(simTotal)}</strong></div>
        <div><span><i />실거래 가정</span><strong>{signedUsd(liveTotal)}</strong></div>
        <div><span>실거래 − 가상</span><strong>{signedUsd(liveTotal - simTotal)}</strong></div>
      </div>
      <svg className="trade-chart" viewBox="0 0 468 175" role="img" aria-labelledby="trade-chart-title">
        <title id="trade-chart-title">{symbol} 누적 손익 비교. 가상매매 {signedUsd(simTotal)}, 실거래 가정 {signedUsd(liveTotal)}. 일별 수치는 아래 표에 있습니다.</title>
        <defs>
          <linearGradient id="sample-chart-fill" x2="0" y2="1" gradientUnits="objectBoundingBox">
            <stop stopColor="#64eac4" stopOpacity=".24" />
            <stop offset="100%" stopColor="#64eac4" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[high, (high + low) / 2, low].map((tick) => (
          <g key={tick}>
            <line x1={x(0)} x2={x(tradingDays.length)} y1={y(tick)} y2={y(tick)} className="chart-grid" />
            <text x="37" y={y(tick) + 4} textAnchor="end">{tick}</text>
          </g>
        ))}
        <polygon points={`${x(0)},147 ${points(simulated)} ${x(simulated.length - 1)},147`} fill="url(#sample-chart-fill)" />
        <polyline fill="none" stroke="#64eac4" strokeWidth="2.5" strokeLinejoin="round" points={points(simulated)} />
        <polyline fill="none" stroke="#a8bcff" strokeWidth="2.25" strokeDasharray="5 4" strokeLinejoin="round" points={points(live)} />
        <circle cx={x(simulated.length - 1)} cy={y(simTotal)} r="3.5" fill="#64eac4" />
        <circle cx={x(live.length - 1)} cy={y(liveTotal)} r="3.5" fill="#a8bcff" />
        {['시작', ...tradingDays].map((day, index) => <text key={day} x={x(index)} y="169" textAnchor="middle">{day}</text>)}
      </svg>
      <div className="trade-foot">
        <p className="market-note">2026.11.09–13 · 시작 잔고 ${number.format(sampleStartingBalance)} · 두 계열 모두 예시</p>
        <details>
          <summary>일별 데이터</summary>
          <table>
            <thead><tr><th scope="col">날짜</th><th scope="col">가상매매</th><th scope="col">실거래 가정</th></tr></thead>
            <tbody>{tradingDays.map((day, index) => (
              <tr key={day}><th scope="row">{day}</th><td>{signedUsd(sample.simulated[index])}</td><td>{signedUsd(sample.live[index])}</td></tr>
            ))}</tbody>
          </table>
        </details>
      </div>
    </section>
  );
}
