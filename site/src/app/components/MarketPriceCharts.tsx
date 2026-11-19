import { useEffect, useRef } from 'react';

const charts = [
  ['BITSTAMP:BTCUSD', '비트코인 · BTCUSD', 'BITSTAMP-BTCUSD'],
  ['OANDA:XAUUSD', '금 · XAUUSD', 'OANDA-XAUUSD'],
  ['NASDAQ:NDX', '나스닥 100 지수 · NDX', 'NASDAQ-NDX'],
];

function PriceChart({ symbol, title, path }: { symbol: string; title: string; path: string }) {
  const host = useRef<HTMLDivElement>(null);
  const details = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    const node = details.current;
    const container = host.current;
    if (!node || !container) return;
    function loadChart() {
      if (!node?.open || !container || container.childElementCount) return;
      const wrapper = document.createElement('div');
      wrapper.className = 'tradingview-widget-container';
      wrapper.style.height = '360px';
      const slot = document.createElement('div');
      slot.className = 'tradingview-widget-container__widget';
      slot.style.height = '100%';
      const script = document.createElement('script');
      script.async = true;
      script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
      script.textContent = JSON.stringify({
        autosize: true, symbol, interval: 'D', timezone: 'Asia/Seoul', theme: 'dark',
        locale: 'kr', hide_side_toolbar: true, allow_symbol_change: false, support_host: 'https://www.tradingview.com',
      });
      wrapper.append(slot, script);
      container.append(wrapper);
    }
    node.addEventListener('toggle', loadChart);
    loadChart();
    return () => {
      node.removeEventListener('toggle', loadChart);
      container.replaceChildren();
    };
  }, [symbol]);

  return (
    <figure className="rounded-xl border border-zinc-800 p-4">
      <details ref={details}>
        <summary className="cursor-pointer font-medium">{title}</summary>
        <div ref={host} className="mt-3 overflow-hidden rounded-lg" />
      </details>
      <figcaption className="mt-2 text-sm text-zinc-400">
        <a className="underline" href={`https://www.tradingview.com/symbols/${path}/`} target="_blank" rel="noreferrer">TradingView 원문</a>
        {' · '}{symbol}
      </figcaption>
    </figure>
  );
}

export function MarketPriceCharts() {
  return (
    <section aria-labelledby="market-price-heading" className="space-y-3">
      <h2 id="market-price-heading" className="text-2xl font-semibold">시장 가격 차트</h2>
      <p className="text-sm text-zinc-400">TradingView 일봉 참고 시세입니다. 나스닥 100 지수와 브로커의 US100Cash는 상품과 가격 기준이 다릅니다.</p>
      {charts.map(([symbol, title, path]) => <PriceChart key={symbol} symbol={symbol} title={title} path={path} />)}
    </section>
  );
}
