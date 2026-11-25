import { useEffect, useState } from 'react';

type NewsItem = { published_at?: string | null; source?: string | null; news: string };
type NewsPayload = { generated_at: string | null; items: NewsItem[] };

export function RecentEconomicNews() {
  const [payload, setPayload] = useState<NewsPayload | null>(null);
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading');

  useEffect(() => {
    const controller = new AbortController();
    fetch(`${import.meta.env.BASE_URL}data/recent-economic-news.json`, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error('news unavailable');
        return response.json() as Promise<NewsPayload>;
      })
      .then((data) => {
        setPayload(data);
        setState('ready');
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'AbortError') return;
        setState('error');
      });
    return () => controller.abort();
  }, []);

  const items = payload?.items ?? [];
  return (
    <section className="market-panel macro-panel" aria-labelledby="macro-heading" data-state={state}>
      <div className="cme-icon"><span aria-hidden="true">◎</span></div>
      <p className="market-kicker">시장 읽기</p>
      <h2 id="macro-heading">최근 경제 뉴스</h2>
      {state === 'loading' && <p className="market-note" role="status">최신 뉴스를 불러오는 중입니다.</p>}
      {state === 'error' && <p className="market-note" role="status">뉴스 자료를 불러오지 못했습니다.</p>}
      {state === 'ready' && items.length === 0 && <p className="market-note">표시할 뉴스가 없습니다.</p>}
      {state === 'ready' && items.length > 0 && <>
        {items.length < 5 && <p className="market-note">뉴스 {items.length}건만 확인되었습니다. 일부 자료를 표시합니다.</p>}
        <div className="economic-news-list">
          {items.slice(0, 5).map((item, index) => (
            <details className="economic-news-item" key={`${item.published_at ?? 'undated'}-${index}`}>
              <summary>
                <span>{item.news.split(/\r?\n/).map((line) => line.trim()).find(Boolean)?.replace(/^[■○●\s]+/, '') || `경제 뉴스 ${index + 1}`}</span>
                <time dateTime={item.published_at ?? undefined}>{item.published_at ?? '발행일 미기재'}</time>
              </summary>
              <p>{item.news}</p>
            </details>
          ))}
        </div>
      </>}
    </section>
  );
}
