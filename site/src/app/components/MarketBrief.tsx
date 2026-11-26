import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, CalendarDays } from 'lucide-react';

const cmeUrl = 'https://www.cmegroup.com/trading-hours.html';
// proName values are the TradingView symbol IDs passed to the official ticker-tape embed.
// Source links point at the matching TradingView symbol page; they are shown when the embed fails.
const marketSymbols = [
  { proName: 'FX_IDC:USDKRW', title: '달러 / 원', url: 'https://www.tradingview.com/symbols/USDKRW/' },
  { proName: 'KRX:KOSPI', title: 'KOSPI', url: 'https://www.tradingview.com/symbols/KRX-KOSPI/' },
  { proName: 'NASDAQ:NDX', title: 'NASDAQ 100', url: 'https://www.tradingview.com/symbols/NASDAQ-NDX/' },
];
const embedUrl = 'https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js';
// Cross-origin iframe contents cannot be inspected, so "ready" means the embed frame loaded.
const loadTimeoutMs = 10_000;

type QuoteState = 'loading' | 'ready' | 'error';

const statusText: Record<QuoteState, string> = {
  loading: '불러오는 중',
  ready: '위젯 표시됨',
  error: '불러오기 실패',
};

export function MarketQuotes() {
  const widget = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<QuoteState>('loading');

  useEffect(() => {
    const element = widget.current;
    if (!element) return;
    setState('loading');

    const mount = document.createElement('div');
    mount.className = 'tradingview-widget-container';
    const slot = document.createElement('div');
    slot.className = 'tradingview-widget-container__widget';
    const script = document.createElement('script');
    script.src = embedUrl;
    script.async = true;
    script.textContent = JSON.stringify({
      symbols: marketSymbols.map(({ proName, title }) => ({ proName, title })),
      showSymbolLogo: true,
      isTransparent: true,
      displayMode: 'adaptive',
      colorTheme: 'dark',
      locale: 'kr',
    });

    let settled = false;
    const observed = new WeakSet<HTMLIFrameElement>();
    const settle = (next: QuoteState) => {
      if (settled) return;
      settled = true;
      setState(next);
      window.clearTimeout(timer);
      observer.disconnect();
    };
    const watchFrame = (frame: HTMLIFrameElement) => {
      if (observed.has(frame)) return;
      observed.add(frame);
      frame.addEventListener('load', () => settle('ready'), { once: true });
    };
    const observer = new MutationObserver(() => {
      mount.querySelectorAll('iframe').forEach(watchFrame);
    });
    observer.observe(mount, { childList: true, subtree: true });
    const timer = window.setTimeout(() => settle('error'), loadTimeoutMs);
    script.addEventListener('error', () => settle('error'));

    mount.append(slot, script);
    element.append(mount);

    return () => {
      settled = true;
      window.clearTimeout(timer);
      observer.disconnect();
      mount.remove();
    };
  }, []);

  const failed = state === 'error';

  return (
    <section className="market-tape" aria-labelledby="market-heading" data-state={state}>
      <div className="market-tape-label">
        <span className="market-dot" />
        <h2 id="market-heading">시장 지표</h2>
        <span className="market-status" role="status" aria-live="polite">{statusText[state]}</span>
      </div>
      <div className="market-tape-body">
        <div className="market-quote-skeleton" aria-hidden="true"><i /><i /><i /></div>
        <div ref={widget} className="market-quote-slot" hidden={failed} />
        <div className="market-quote-fallback" hidden={!failed}>
          <p>실시간 값을 표시하지 못했습니다. 아래 원문에서 확인하세요.</p>
          {marketSymbols.map(({ title, url }) => (
            <a href={url} key={title} target="_blank" rel="noreferrer">{title} <ArrowUpRight size={13} aria-hidden="true" /></a>
          ))}
        </div>
      </div>
      <div className="market-source-links" aria-label="시장 지표 원문" hidden={failed}>
        <span className="market-note">값: TradingView · 지연될 수 있음</span>
        {marketSymbols.map(({ title, url }) => (
          <a href={url} key={title} target="_blank" rel="noreferrer">{title} <ArrowUpRight size={13} aria-hidden="true" /></a>
        ))}
      </div>
    </section>
  );
}

function chicagoWeek(now: Date) {
  const chicagoDate = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Chicago', year: 'numeric', month: '2-digit', day: '2-digit',
  }).format(now);
  const sunday = new Date(`${chicagoDate}T00:00:00Z`);
  sunday.setUTCDate(sunday.getUTCDate() - sunday.getUTCDay());
  const format = new Intl.DateTimeFormat('ko-KR', { timeZone: 'UTC', month: 'short', day: 'numeric' });
  const day = (offset: number) => format.format(new Date(sunday.getTime() + offset * 86_400_000));
  return { sunday: day(0), monday: day(1), thursday: day(4), friday: day(5) };
}

export function CmeSchedule() {
  const week = chicagoWeek(new Date());
  return (
    <section className="market-panel cme-panel" aria-labelledby="cme-heading">
      <div className="cme-icon"><CalendarDays size={22} aria-hidden="true" /></div>
      <p className="market-kicker">CME GROUP · GLOBEX</p>
      <h2 id="cme-heading">이번 주 시카고 거래 일정</h2>
      <p className="cme-period">{week.sunday}–{week.friday} · 시카고 현지 시간 (CT)</p>
      <ul className="cme-sessions">
        <li><div><strong>주간 개장</strong><span>{week.sunday} 일요일</span></div><time>17:00</time></li>
        <li><div><strong>일일 정비 시간</strong><span>{week.monday} 월요일–{week.thursday} 목요일</span></div><time>16:00–17:00</time></li>
        <li><div><strong>주간 마감</strong><span>{week.friday} 금요일</span></div><time>16:00</time></li>
      </ul>
      <p className="market-note">나스닥 100·금 선물의 정규 세션 기준입니다. 휴장·조기 종료와 상품별 예외는 CME 공식 일정을 확인하세요.</p>
      <a className="market-inline-link" href={cmeUrl} target="_blank" rel="noreferrer">CME 공식 일정 <ArrowUpRight size={16} aria-hidden="true" /></a>
    </section>
  );
}
