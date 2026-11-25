import { useEffect, useState } from 'react';
import { Activity, ArrowDown, ArrowRight, ArrowUpRight, Network } from 'lucide-react';
import { Link, useSearchParams } from 'react-router';
import { CmeSchedule, MarketQuotes } from '../components/MarketBrief';
import { TradeComparison } from '../components/TradeComparison';
import { RecentEconomicNews } from '../components/RecentEconomicNews';
import { allTags, categories, posts } from '../data/posts';
import './market-home.css';

const pageSize = 6;
const marketCategory = /경제|투자|금융|트레이딩/;

export function Home() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [category, setCategory] = useState('market');
  const [limit, setLimit] = useState(pageSize);
  const tag = searchParams.get('tag');
  const selectedTag = tag && allTags.includes(tag) ? tag : '';
  const activeCategory = selectedTag ? 'all' : category;
  const filtered = posts.filter((post) => {
    if (selectedTag && !post.tags.includes(selectedTag)) return false;
    if (activeCategory === 'market') return marketCategory.test(post.category);
    return activeCategory === 'all' || post.category === activeCategory;
  });

  useEffect(() => {
    if (selectedTag) document.getElementById('articles')?.scrollIntoView();
  }, [selectedTag]);

  function changeTag(nextTag: string) {
    const next = new URLSearchParams(searchParams);
    if (nextTag) next.set('tag', nextTag);
    else next.delete('tag');
    setCategory('all');
    setLimit(pageSize);
    setSearchParams(next, { preventScrollReset: true });
  }

  return (
    <div className="market-home">
      <header className="market-header">
        <div className="market-shell market-header-inner">
          <Link to="/" className="market-brand">
            <span><Activity size={22} aria-hidden="true" /></span>
            <strong>마켓노트</strong>
          </Link>
          <nav aria-label="주 메뉴">
            <a href="#trade">거래 비교</a>
            <a href="#weekly">주간 일정</a>
            <a href="#articles">아티클</a>
          </nav>
          <Link className="market-graph-link" to="/graph" aria-label="지식 그래프"><Network size={17} aria-hidden="true" /><span>지식 그래프</span></Link>
        </div>
      </header>

      <main className="market-shell">
        <MarketQuotes />

        <div className="market-hero">
          <div className="hero-copy">
            <p className="market-kicker"><span className="market-dot" /> 시장 브리핑 · 거래 기록</p>
            <h1>시장을 읽고,<br /> <em>거래를 기록하다.</em></h1>
            <p className="hero-description">비트코인, 나스닥 100, 금을 중심으로 세계 경제의 흐름을 살핍니다. 거래 결과와 판단 근거를 함께 기록합니다.</p>
            <div className="hero-actions">
              <a href="#articles">아티클 읽기 <ArrowRight size={18} aria-hidden="true" /></a>
              <a href="#weekly">이번 주 일정 <ArrowDown size={16} aria-hidden="true" /></a>
            </div>
          </div>
          <TradeComparison />
        </div>

        <div className="market-week" id="weekly">
          <CmeSchedule />
          <RecentEconomicNews />
        </div>

        <section className="market-articles" id="articles" aria-labelledby="articles-heading">
          <div className="market-section-head">
            <div>
              <p className="market-kicker">마켓노트 아카이브</p>
              <h2 id="articles-heading">아티클</h2>
              {selectedTag && <p className="market-note">#{selectedTag} 태그로 필터링된 게시글</p>}
            </div>
            <div className="market-filters">
              <label>
                카테고리
                <select value={activeCategory} onChange={(event) => {
                  const nextCategory = event.target.value;
                  if (selectedTag) changeTag('');
                  setCategory(nextCategory);
                  setLimit(pageSize);
                }}>
                  <option value="market">시장·투자</option>
                  <option value="all">전체 게시글</option>
                  {categories.map((item) => <option key={item}>{item}</option>)}
                </select>
              </label>
              <label>
                태그
                <select value={selectedTag} onChange={(event) => changeTag(event.target.value)}>
                  <option value="">전체 태그</option>
                  {allTags.map((item) => <option key={item}>{item}</option>)}
                </select>
              </label>
            </div>
          </div>
          {filtered.length === 0 && <p className="market-note">해당 조건의 게시글이 없습니다.</p>}
          <div className="market-article-grid">
            {filtered.slice(0, limit).map((post) => (
              <Link key={post.id} to={`/post/${post.slug}`} className="market-article-card">
                <article>
                  <div className="article-card-meta"><span>{post.category}</span><ArrowUpRight size={18} aria-hidden="true" /></div>
                  <h3>{post.title}</h3>
                  {post.excerpt && <p>{post.excerpt}</p>}
                  <div className="article-card-date"><time dateTime={post.date}>{post.date}</time><span>{post.readTime}</span></div>
                </article>
              </Link>
            ))}
          </div>
          {limit < filtered.length && <button className="market-more" type="button" onClick={() => setLimit(limit + pageSize)}>아티클 더 보기 <ArrowDown size={15} aria-hidden="true" /></button>}
        </section>
      </main>

      <footer className="market-footer">
        <div className="market-shell"><strong>마켓노트</strong><p>시장 및 거래 정보는 학습과 기록을 위한 자료입니다.</p></div>
      </footer>
    </div>
  );
}
