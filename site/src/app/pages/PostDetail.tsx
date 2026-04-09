import { useParams, Link } from 'react-router';
import { posts } from '../data/posts';
import { ArrowLeft, Calendar, Clock, Tag, User } from 'lucide-react';

export function PostDetail() {
  const { slug } = useParams<{ slug: string }>();
  const post = posts.find((p) => p.slug === slug);

  if (!post) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl mb-4 text-white">게시글을 찾을 수 없습니다</h1>
          <Link
            to="/"
            className="text-purple-400 hover:text-purple-300 flex items-center gap-2 justify-center"
          >
            <ArrowLeft className="w-4 h-4" />
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Hero */}
      {post.image ? (
        <div className="relative h-96 overflow-hidden">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/50 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <PostHeader post={post} />
          </div>
        </div>
      ) : (
        <div className="bg-zinc-900 border-b border-zinc-800 p-8">
          <PostHeader post={post} />
        </div>
      )}

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-8 py-12">
        <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-8 md:p-12">
          <div className="mb-8 pb-8 border-b border-zinc-800">
            <p className="text-lg text-zinc-300 leading-relaxed">{post.excerpt}</p>
          </div>

          {/* Pre-sanitized HTML rendered from markdown */}
          <div
            className="prose-content text-zinc-300 leading-relaxed"
            // contentHtml is sanitized at build time by sanitize-html — safe to render
            dangerouslySetInnerHTML={{ __html: post.contentHtml }}
          />

          <div className="mt-12 pt-8 border-t border-zinc-800">
            <h3 className="text-sm mb-4 text-zinc-400 flex items-center gap-2">
              <Tag className="w-4 h-4" />
              태그
            </h3>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Link
                  key={tag}
                  to="/"
                  className="text-sm text-purple-400 bg-purple-950/50 hover:bg-purple-950 px-4 py-2 rounded-lg transition-colors"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            목록으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}

function PostHeader({ post }: { post: ReturnType<typeof posts.find> & object }) {
  return (
    <div className="max-w-4xl mx-auto">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-zinc-300 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        돌아가기
      </Link>

      <span className="inline-block bg-purple-600 text-white px-4 py-1.5 rounded-full text-sm mb-4">
        {post.category}
      </span>

      <h1 className="text-3xl sm:text-5xl mb-4 text-white">{post.title}</h1>

      <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm text-zinc-300">
        <span className="flex items-center gap-2">
          <User className="w-4 h-4" />
          {post.author}
        </span>
        <span className="flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          {post.date}
        </span>
        <span className="flex items-center gap-2">
          <Clock className="w-4 h-4" />
          {post.readTime}
        </span>
      </div>
    </div>
  );
}
