# Data Model: Interactive Tag Knowledge Graph

**Branch**: `002-tag-knowledge-graph` | **Date**: 2026-04-10
**Derived from**: `spec.md` (Key Entities) + `research.md` (decisions 3, 4, 8)

---

## Source: Existing Types (no changes)

These types from `site/src/app/data/types.ts` are the upstream data source — UNCHANGED.

```ts
// Existing — do not modify
interface BlogPost {
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
```

---

## New Types

All new types are added to `site/src/app/data/types.ts`.

### GraphNodeType

```ts
export type GraphNodeType = 'post' | 'tag';
```

### GraphNode

```ts
export interface GraphNode {
  /** Unique node ID. Format: 'post:{slug}' for posts, 'tag:{tagName}' for tags. */
  id: string;

  /** Discriminates post and tag nodes for rendering and interaction logic. */
  type: GraphNodeType;

  /** Display label. Post title or tag name. */
  label: string;

  /**
   * Number of edges connected to this node.
   * Posts: number of tags on the post.
   * Tags: number of posts that use this tag.
   * Used for visual sizing (larger weight = larger node radius).
   */
  weight: number;

  /**
   * Slug for post nodes only. Used to build the navigation URL /post/{slug}.
   * Undefined for tag nodes.
   */
  slug?: string;

  // d3-force runtime properties (injected by ForceGraph2D — do not set manually)
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  fx?: number | null;
  fy?: number | null;
}
```

### GraphEdge

```ts
export interface GraphEdge {
  /**
   * ID of the source node (post). Must match a GraphNode.id of type 'post'.
   * react-force-graph resolves this to the full node object at runtime.
   */
  source: string;

  /**
   * ID of the target node (tag). Must match a GraphNode.id of type 'tag'.
   * react-force-graph resolves this to the full node object at runtime.
   */
  target: string;
}
```

### GraphData

```ts
export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}
```

---

## Data Derivation Function

Pure function, no side effects. Lives in `site/src/app/data/graph.ts` (new file).

```ts
import type { BlogPost } from './types';
import type { GraphData, GraphNode, GraphEdge } from './types';

export function buildGraphData(posts: BlogPost[]): GraphData {
  // Count how many posts use each tag (for weight/sizing)
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
```

---

## Node Sizing Formula

Applied inside the `nodeCanvasObject` callback (see quickstart.md):

```ts
function getNodeRadius(node: GraphNode): number {
  if (node.type === 'post') return 4;
  // Logarithmic scale for tags: 4px base + up to ~14px for 100 posts
  return 4 + Math.log2(node.weight + 1) * 3;
}
```

---

## React State for Highlight

Managed locally in `GraphPage.tsx`:

```ts
// Set of node IDs currently in the highlighted subset.
// Empty set = no active selection (all nodes at full opacity).
const [highlightIds, setHighlightIds] = useState<Set<string>>(new Set());

// Node ID of the currently hovered node (for transient hover highlight).
const [hoverNodeId, setHoverNodeId] = useState<string | null>(null);
```

---

## Entity Relationships

```
BlogPost (existing)
  └── tags: string[]          ← source data

GraphNode (new)
  type='post' ──────────────── derived from BlogPost { id, title, slug, tags.length }
  type='tag'  ──────────────── derived from all unique tags across all BlogPosts

GraphEdge (new)
  source: GraphNode.id (post)  ┐
  target: GraphNode.id (tag)   ┘  one edge per (post, tag) pair

GraphData (new)
  nodes: GraphNode[]            ← postNodes + tagNodes
  edges: GraphEdge[]            ← all (post, tag) pairs
```

---

## Validation Rules

| Rule | Enforcement |
|---|---|
| `GraphNode.id` must be globally unique | Guaranteed by `post:{slug}` / `tag:{tagName}` namespacing — post slugs are unique per existing Vite plugin constraint; tag names are de-duped by Map |
| Post `slug` must be defined for type='post' | TypeScript: `slug?` is checked before navigation in `onNodeClick` handler |
| Tags array may be empty | `post.tags.flatMap(...)` produces zero edges — isolated post node still renders |
| Zero posts | `buildGraphData([])` returns `{ nodes: [], edges: [] }` — graph renders empty-state |
