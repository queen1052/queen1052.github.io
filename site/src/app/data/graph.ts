import type { BlogPost, GraphData, GraphEdge, GraphNode } from './types';

export function buildGraphData(posts: BlogPost[]): GraphData {
  const tagCount = new Map<string, number>();
  for (const post of posts) {
    for (const tag of post.tags) {
      tagCount.set(tag, (tagCount.get(tag) ?? 0) + 1);
    }
  }

  const postNodes: GraphNode[] = posts.map((post) => ({
    id: `post:${post.slug}`,
    type: 'post',
    label: post.title,
    weight: post.tags.length,
    slug: post.slug,
  }));

  const tagNodes: GraphNode[] = [...tagCount.entries()].map(([tag, count]) => ({
    id: `tag:${tag}`,
    type: 'tag',
    label: tag,
    weight: count,
  }));

  const edges: GraphEdge[] = posts.flatMap((post) =>
    post.tags.map((tag) => ({
      source: `post:${post.slug}`,
      target: `tag:${tag}`,
    }))
  );

  return { nodes: [...postNodes, ...tagNodes], edges };
}
