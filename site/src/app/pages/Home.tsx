import { useState } from 'react';
import { BlogCard } from '../components/BlogCard';
import { Sidebar } from '../components/Sidebar';
import { posts, categories, allTags } from '../data/posts';
import { Menu } from 'lucide-react';

export function Home() {
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const filteredPosts = posts.filter((post) => {
    const categoryMatch = selectedCategory === '전체' || post.category === selectedCategory;
    const tagMatch = !selectedTag || post.tags.includes(selectedTag);
    return categoryMatch && tagMatch;
  });

  return (
    <div className="flex min-h-screen bg-zinc-950">
      <Sidebar
        categories={categories}
        tags={allTags}
        selectedCategory={selectedCategory}
        selectedTag={selectedTag}
        onCategoryChange={setSelectedCategory}
        onTagChange={setSelectedTag}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Desktop sidebar spacer */}
      <div className="hidden lg:block w-64 shrink-0" />

      <main className="flex-1 p-8 min-w-0">
        {/* Mobile header */}
        <div className="flex items-center gap-4 mb-8 lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-zinc-400 hover:text-white transition-colors"
            aria-label="메뉴 열기"
          >
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="text-2xl text-white">Dev Blog</h1>
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="mb-8 hidden lg:block">
            <h1 className="text-4xl mb-2 text-white">
              {selectedCategory === '전체' ? '최근 게시글' : selectedCategory}
            </h1>
            {selectedTag && (
              <p className="text-zinc-400">
                #{selectedTag} 태그로 필터링된 게시글
              </p>
            )}
          </div>

          {/* Mobile heading */}
          <div className="mb-8 lg:hidden">
            <h2 className="text-2xl text-white">
              {selectedCategory === '전체' ? '최근 게시글' : selectedCategory}
            </h2>
            {selectedTag && (
              <p className="text-zinc-400 text-sm mt-1">
                #{selectedTag} 태그로 필터링된 게시글
              </p>
            )}
          </div>

          {filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-zinc-500 text-lg">
                해당 조건의 게시글이 없습니다.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
