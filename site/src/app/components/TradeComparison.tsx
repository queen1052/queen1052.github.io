import { useEffect, useState } from 'react';

type StrategyResult = {
  project: string;
  target: string;
  symbol: string;
  strategy: string;
  cumulative_virtual_krw: number | null;
  status: 'available' | 'no_trades' | 'unavailable';
  completed_session_date: string | null;
  closed_trades: number;
  winning_trades: number;
  win_rate: number | null;
};

type TradingSummary = {
  generated_at: string | null;
  completed_session_date: string | null;
  session_definition: string;
  cumulative_virtual_krw: number | null;
  closed_trades: number;
  winning_trades: number;
  win_rate: number | null;
  strategies: StrategyResult[];
};

const currency = new Intl.NumberFormat('ko-KR', { maximumFractionDigits: 0 });
const projectLabel: Record<string, string> = { mt5_codex1: 'MT5 Codex', mt5_rust1: 'MT5 Rust' };

export function TradeComparison() {
  const [summary, setSummary] = useState<TradingSummary | null>(null);
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading');

  useEffect(() => {
    const controller = new AbortController();
    fetch(`${import.meta.env.BASE_URL}data/trading-summary.json`, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error('trading summary unavailable');
        return response.json() as Promise<TradingSummary>;
      })
      .then((data) => {
        setSummary(data);
        setState('ready');
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'AbortError') return;
        setState('error');
      });
    return () => controller.abort();
  }, []);

  const strategies = summary?.strategies ?? [];
  const total = summary?.cumulative_virtual_krw;
  const hasData = state === 'ready' && total !== null && total !== undefined;

  return (
    <section className="market-panel trade-panel" id="trade" aria-labelledby="trade-heading" data-state={state}>
      <div className="trade-heading">
        <div>
          <p className="market-kicker">선택 전략 · 가상매매 누적손익</p>
          <h2 id="trade-heading">전략 거래 결과</h2>
        </div>
        <span className="sample-badge">{state === 'loading' ? '불러오는 중' : state === 'error' ? '자료 없음' : hasData ? '가상 거래' : '확인 불가'}</span>
      </div>
      {state === 'loading' && <p className="market-note trade-state">선택 전략의 누적 자료를 불러오고 있습니다.</p>}
      {state === 'error' && <p className="market-note trade-state" role="status">가상 거래 요약을 불러오지 못했습니다. 집계 자료를 확인할 수 없습니다.</p>}
      {state === 'ready' && summary && <>
        {hasData && <div className="trade-metrics">
          <div className="trade-total"><span>전체 누적 가상손익</span><strong>{total! < 0 ? '−' : total! > 0 ? '+' : ''}₩{currency.format(Math.abs(total!))}</strong></div>
          <div className="trade-total"><span>전체 승률 <small>({summary.winning_trades}/{summary.closed_trades}건)</small></span><strong>{summary.win_rate === null ? '확인 불가' : `${summary.win_rate.toFixed(2)}%`}</strong></div>
        </div>}
        {strategies.length === 0 && <p className="market-note trade-state">현재 선택된 전략을 확인할 수 없습니다.</p>}
        {!hasData && strategies.length > 0 && <p className="market-note trade-state">선택 전략의 누적 자료를 집계할 수 없습니다.</p>}
        <ul className="strategy-results">
          {strategies.map((row) => (
            <li key={`${row.project}-${row.target}-${row.strategy}`}>
              <div className="strategy-result-name">
                <strong>{row.strategy}</strong>
                <span>{projectLabel[row.project] ?? row.project} · {row.target} · {row.symbol}{row.completed_session_date ? ` · ${row.completed_session_date}까지` : ''}</span>
              </div>
              {row.status === 'available' && row.cumulative_virtual_krw !== null
                ? <div className="strategy-result-numbers"><b className={row.cumulative_virtual_krw >= 0 ? 'is-positive' : 'is-negative'}>{row.cumulative_virtual_krw < 0 ? '−' : row.cumulative_virtual_krw > 0 ? '+' : ''}₩{currency.format(Math.abs(row.cumulative_virtual_krw))}</b><span>{row.win_rate === null ? '승률 확인 불가' : `승률 ${row.win_rate.toFixed(2)}% (${row.winning_trades}/${row.closed_trades})`}</span></div>
                : <span className="strategy-result-state">{row.status === 'no_trades' ? '완료 거래 없음' : '누적 자료 확인 불가'}</span>}
            </li>
          ))}
        </ul>
        <div className="trade-foot">
          <p className="market-note">완료 세션: {summary.completed_session_date ?? '미확인'} · {summary.session_definition}</p>
          <p className="market-note">누적액은 선택 전략의 완료 세션 손익 합계이며, 승률은 완료 거래에서 수익이 난 건의 비율입니다.</p>
          <p className="market-note">자료 기준 시각: {summary.generated_at ?? '미확인'}</p>
        </div>
      </>}
    </section>
  );
}
