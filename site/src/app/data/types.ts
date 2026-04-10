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

// --- Graph Types ---

export type GraphNodeType = 'post' | 'tag';

export interface GraphNode {
  id: string;
  type: GraphNodeType;
  label: string;
  weight: number;
  slug?: string;
  // d3-force runtime properties
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  fx?: number | null;
  fy?: number | null;
}

export interface GraphEdge {
  source: string;
  target: string;
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}
