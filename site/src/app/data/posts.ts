import type { BlogPost } from './types';
import rawPosts from '../../generated/posts.json';

export const posts: BlogPost[] = rawPosts as BlogPost[];

export const categories: string[] = [...new Set(posts.map((p) => p.category))].sort();

export const allTags: string[] = [...new Set(posts.flatMap((p) => p.tags))].sort();
