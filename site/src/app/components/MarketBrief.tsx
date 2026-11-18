import { useEffect, useRef } from 'react';
import { ArrowUpRight, CalendarDays } from 'lucide-react';

const cmeUrl = 'https://www.cmegroup.com/trading-hours.html';
const marketSymbols = [
  { proName: 'FX_IDC:USDKRW', title: '달러 / 원', url: 'https://www.tradingview.com/symbols/USDKRW/' },
  { proName: 'KRX:KOSPI', title: 'KOSPI', url: 'https://www.tradingview.com/symbols/KRX-KOSPI/' },
  { proName: 'NASDAQ:NDX', title: 'NASDAQ 100', url: 'https://www.tradingview.com/symbols/NASDAQ-NDX/' },
];

export function MarketQuotes() {
  const widget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = widget.current;
    const mount = document.createElement('div');
    mount.className = 'tradingview-widget-container';
    const slot = document.createElement('div');
    slot.className = 'tradingview-widget-container__widget';
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js';
    script.async = true;
    script.textContent = JSON.stringify({
      symbols: marketSymbols.map(({ proName, title }) => ({ proName, title })),
      showSymbolLogo: true,
      isTransparent: true,
      displayMode: 'compact',
      colorTheme: 'dark',
      locale: 'kr',
    });
    mount.append(slot, script);
    element?.append(mount);
    return () => mount.remove();
  }, []);

  return (
    <section className="market-tape" aria-labelledby="market-heading">
      <div className="market-tape-label">
        <span className="market-dot" />
        <h2 id="market-heading">시장 지표</h2>
        <span>TradingView · 지연 가능</span>
      </div>
      <div ref={widget} />
      <div className="market-source-links" aria-label="시장 지표 원문">
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
