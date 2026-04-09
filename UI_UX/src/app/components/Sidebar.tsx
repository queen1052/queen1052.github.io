import { Folder, Tag, Hash } from "lucide-react";

interface SidebarProps {
  categories: string[];
  tags: string[];
  selectedCategory: string;
  selectedTag: string | null;
  onCategoryChange: (category: string) => void;
  onTagChange: (tag: string | null) => void;
}

export function Sidebar({
  categories,
  tags,
  selectedCategory,
  selectedTag,
  onCategoryChange,
  onTagChange,
}: SidebarProps) {
  return (
    <aside className="w-64 bg-zinc-900 border-r border-zinc-800 p-6 overflow-y-auto h-screen sticky top-0">
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
          {categories.map((category) => (
            <li key={category}>
              <button
                onClick={() => onCategoryChange(category)}
                className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-200 ${
                  selectedCategory === category
                    ? "bg-purple-600 text-white"
                    : "text-zinc-300 hover:bg-zinc-800 hover:text-white"
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
              onClick={() => onTagChange(selectedTag === tag ? null : tag)}
              className={`text-xs px-3 py-1.5 rounded-full transition-all duration-200 ${
                selectedTag === tag
                  ? "bg-purple-600 text-white"
                  : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
