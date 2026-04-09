import { Link } from "react-router";
import { BlogPost } from "../data/mockPosts";
import { Calendar, Clock, Tag } from "lucide-react";

interface BlogCardProps {
  post: BlogPost;
}

export function BlogCard({ post }: BlogCardProps) {
  return (
    <Link to={`/post/${post.id}`}>
      <article className="bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800 hover:border-zinc-700 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10 group">
        <div className="relative h-48 overflow-hidden">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute top-4 right-4">
            <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm">
              {post.category}
            </span>
          </div>
        </div>
        
        <div className="p-6">
          <h2 className="text-xl mb-3 text-white group-hover:text-purple-400 transition-colors">
            {post.title}
          </h2>
          
          <p className="text-zinc-400 text-sm mb-4 line-clamp-2">
            {post.excerpt}
          </p>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs text-purple-400 bg-purple-950/50 px-2 py-1 rounded flex items-center gap-1"
              >
                <Tag className="w-3 h-3" />
                {tag}
              </span>
            ))}
          </div>
          
          <div className="flex items-center justify-between text-xs text-zinc-500">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {post.date}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {post.readTime}
              </span>
            </div>
            <span className="text-zinc-400">{post.author}</span>
          </div>
        </div>
      </article>
    </Link>
  );
}
