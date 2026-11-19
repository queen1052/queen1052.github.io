import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router';
import { ArrowLeft, ChevronDown, Clock, Hash, LibraryBig, Network } from 'lucide-react';
import { posts } from '../data/posts';
import { tradeReportFor } from '../data/tradeReports';
import { TradeComparison } from '../components/TradeComparison';
import { MarketPriceCharts } from '../components/MarketPriceCharts';
import type { BlogPost } from '../data/types';

interface ArticleHeading {
  id: string;
  title: string;
  nested: boolean;
}

export function PostDetail() {
  const { slug } = useParams<{ slug: string }>();
  const post = posts.find((item) => item.slug === slug);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <header className="sticky top-0 z-10 border-b border-zinc-800 bg-zinc-950/95 backdrop-blur">
        <nav aria-label="블로그 탐색" className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-8">
          <Link to="/" className="inline-flex items-center gap-2 font-semibold">
            <Hash className="size-5 text-purple-400" aria-hidden="true" />
            Dev Blog
          </Link>
          <div className="flex items-center gap-4 text-sm text-zinc-300 sm:gap-6">
            <Link to="/" className="hover:text-purple-300">게시글</Link>
            <Link to="/graph" className="inline-flex items-center gap-2 hover:text-purple-300">
              <Network className="hidden size-4 sm:block" aria-hidden="true" />
              지식 그래프
            </Link>
          </div>
        </nav>
      </header>
      {post ? (
        <Article key={post.slug} post={post} />
      ) : (
        <main className="mx-auto max-w-2xl px-4 py-24 text-center">
          <h1 className="mb-6 text-3xl font-semibold">게시글을 찾을 수 없습니다</h1>
          <Link to="/" className="text-purple-300 hover:text-purple-200">홈으로 돌아가기</Link>
        </main>
      )}
    </div>
  );
}

function Article({ post }: { post: BlogPost }) {
  const tradeReport = post.marketBriefDate ? tradeReportFor(post.marketBriefDate) : undefined;
  const articleRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [headings, setHeadings] = useState<ArticleHeading[]>([]);
  const [activeId, setActiveId] = useState('');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const article = articleRef.current;
    const content = contentRef.current;
    if (!article || !content) return;
    const sections = [...content.querySelectorAll<HTMLHeadingElement>('h1, h2, h3')]
      .filter((heading) => heading.textContent?.trim());

    setHeadings(sections.map((heading, index) => {
      heading.id = `section-${index + 1}`;
      return {
        id: heading.id,
        title: heading.textContent!.trim(),
        nested: heading.tagName === 'H3',
      };
    }));
    const sectionsFromEnd = [...sections].reverse();

    let frame = 0;
    const updateReadingPosition = () => {
      const articleTop = article.getBoundingClientRect().top;
      const contentBottom = content.getBoundingClientRect().bottom;
      const distance = Math.max(1, contentBottom - articleTop - window.innerHeight + 96);
      const fraction = (96 - articleTop) / distance;
      setProgress(contentBottom <= window.innerHeight ? 100 : Math.round(Math.min(1, Math.max(0, fraction)) * 100));

      const current = sectionsFromEnd.find((heading) => heading.getBoundingClientRect().top <= 120);
      setActiveId(current?.id ?? '');
    };
    const scheduleUpdate = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(updateReadingPosition);
    };

    const resizeObserver = new ResizeObserver(scheduleUpdate);
    resizeObserver.observe(article);
    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate);
    scheduleUpdate();

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', scheduleUpdate);
      window.cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    const initialId = window.location.hash.slice(1);
    if (!initialId) {
      window.scrollTo(0, 0);
    } else if (headings.some((heading) => heading.id === initialId)) {
      document.getElementById(initialId)?.scrollIntoView();
    }
  }, [headings]);

  const toc = (
    <ol className="space-y-1">
      {headings.map(({ id, title, nested }) => (
        <li key={id} className={nested ? 'pl-4' : undefined}>
          <a
            href={`#${id}`}
            aria-current={id === activeId ? 'location' : undefined}
            className="block rounded-md px-2.5 py-1.5 text-sm leading-snug break-words text-zinc-400 hover:bg-zinc-800 hover:text-white aria-[current=location]:bg-purple-500/15 aria-[current=location]:text-purple-200"
          >
            {title}
          </a>
        </li>
      ))}
    </ol>
  );

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-8 sm:py-12">
      <Link to="/" className="mb-7 inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-purple-300">
        <ArrowLeft className="size-4" aria-hidden="true" />
        게시글 목록
      </Link>

      <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_16rem] lg:gap-14">
        <article ref={articleRef} className="min-w-0" aria-labelledby="post-title">
          <header className="mb-8 border-b border-zinc-800 pb-7">
            <p className="mb-3 text-sm font-semibold text-purple-300">{post.category}</p>
            <h1 id="post-title" className="text-3xl font-bold leading-tight tracking-tight break-words sm:text-5xl">{post.title}</h1>
            {post.excerpt && (
              <p className="mt-4 text-lg leading-relaxed break-words text-zinc-300">{post.excerpt}</p>
            )}
            <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-zinc-400">
              <span className="font-medium text-zinc-200">{post.author}</span>
              <time dateTime={post.date}>{post.date}</time>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="size-4" aria-hidden="true" />
                {post.readTime}
              </span>
            </div>
          </header>

          <div className="sticky top-16 z-[1] mb-5 flex items-center gap-3 bg-zinc-950 py-2 text-xs text-zinc-400 lg:hidden">
            <label htmlFor="mobile-reading-progress" className="shrink-0">읽기 진행률</label>
            <progress id="mobile-reading-progress" className="article-progress flex-1" max={100} value={progress} />
            <span aria-hidden="true" className="w-9 text-right tabular-nums">{progress}%</span>
          </div>
          {headings.length > 0 && (
            <details className="group mb-8 rounded-xl border border-zinc-800 bg-zinc-900/60 lg:hidden">
              <summary className="flex cursor-pointer list-none items-center gap-2 px-4 py-3 text-sm font-semibold [&::-webkit-details-marker]:hidden">
                <LibraryBig className="size-4 text-purple-300" aria-hidden="true" />
                목차
                <ChevronDown className="ml-auto size-4 text-zinc-400 group-open:rotate-180" aria-hidden="true" />
              </summary>
              <nav aria-label="글 목차" className="max-h-64 overflow-y-auto border-t border-zinc-800 p-2">{toc}</nav>
            </details>
          )}

          {post.image && (
            <img src={post.image} alt="" className="mb-8 max-h-96 w-full rounded-xl border border-zinc-800 object-cover" />
          )}

          {/* The Markdown pipeline sanitizes the HTML at build time. */}
          <div
            ref={contentRef}
            className="prose-content article-content text-zinc-300"
            dangerouslySetInnerHTML={{ __html: post.contentHtml }}
          />
          {tradeReport && (
            <div className="market-article-report mt-8 space-y-8">
              <TradeComparison report={tradeReport} />
              <MarketPriceCharts />
            </div>
          )}

          <footer className="mt-10 border-t border-zinc-800 pt-6">
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Link
                  key={tag}
                  to={{ pathname: '/', search: new URLSearchParams({ tag }).toString() }}
                  className="rounded-full border border-zinc-800 px-3 py-1.5 text-sm break-all text-zinc-300 hover:border-purple-400/50 hover:text-purple-200"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          </footer>
        </article>

        <aside className="sticky top-24 hidden max-h-[calc(100dvh-8rem)] self-start overflow-y-auto border-l border-zinc-800 pl-6 lg:block">
          <div className="mb-6 border-b border-zinc-800 pb-5">
            <div className="mb-2 flex items-center justify-between gap-2 text-sm">
              <label htmlFor="desktop-reading-progress" className="font-medium">읽기 진행률</label>
              <span aria-hidden="true" className="text-xs text-purple-300 tabular-nums">{progress}%</span>
            </div>
            <progress id="desktop-reading-progress" className="article-progress w-full" max={100} value={progress} />
          </div>
          {headings.length > 0 && (
            <nav aria-labelledby="article-toc-title">
              <h2 id="article-toc-title" className="mb-3 flex items-center gap-2 text-sm font-semibold">
                <LibraryBig className="size-4 text-purple-300" aria-hidden="true" />
                목차
              </h2>
              {toc}
            </nav>
          )}
        </aside>
      </div>
    </main>
  );
}
