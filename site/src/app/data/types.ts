export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  date: string;
  category: string;
  tags: string[];
  excerpt: string;
  author: string;
  readTime: string;
  image: string | null;
  contentHtml: string;
}

export interface PostFrontMatter {
  title: string;
  date: string;
  category: string;
  tags?: string[];
  excerpt?: string;
  author?: string;
  readTime?: string;
  image?: string | null;
}
