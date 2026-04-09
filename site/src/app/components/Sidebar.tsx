import { Folder, Tag, Hash, X } from 'lucide-react';

interface SidebarProps {
  categories: string[];
  tags: string[];
  selectedCategory: string;
  selectedTag: string | null;
  onCategoryChange: (category: string) => void;
  onTagChange: (tag: string | null) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({
  categories,
  tags,
  selectedCategory,
  selectedTag,
  onCategoryChange,
  onTagChange,
  isOpen = true,
  onClose,
}: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && onClose && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`
          fixed lg:sticky top-0 left-0 h-screen z-30 lg:z-auto
          w-64 bg-zinc-900 border-r border-zinc-800 p-6 overflow-y-auto
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Mobile close button */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-zinc-400 hover:text-white lg:hidden"
            aria-label="사이드바 닫기"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        <div className="mb-8">
          <h1 className="text-2xl mb-2 text-white flex items-center gap-2">
            <Hash className="w-6 h-6 text-purple-500" />
            Dev Blog
          </h1>
          <p className="text-sm text-zinc-400">현대적인 개발 블로그</p>
        </div>

        <div className="mb-8">
          <h2 className="text-sm mb-3 text-zinc-400 flex items-center gap-2">
            <Folder className="w-4 h-4" />
            카테고리
          </h2>
          <ul className="space-y-2">
            {['전체', ...categories].map((category) => (
              <li key={category}>
                <button
                  onClick={() => {
                    onCategoryChange(category);
                    onClose?.();
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-200 ${
                    selectedCategory === category
                      ? 'bg-purple-600 text-white'
                      : 'text-zinc-300 hover:bg-zinc-800 hover:text-white'
                  }`}
                >
                  {category}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-sm mb-3 text-zinc-400 flex items-center gap-2">
            <Tag className="w-4 h-4" />
            태그
          </h2>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <button
                key={tag}
                onClick={() => {
                  onTagChange(selectedTag === tag ? null : tag);
                  onClose?.();
                }}
                className={`text-xs px-3 py-1.5 rounded-full transition-all duration-200 ${
                  selectedTag === tag
                    ? 'bg-purple-600 text-white'
                    : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </aside>
    </>
  );
}
