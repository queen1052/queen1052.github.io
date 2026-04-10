import { useMemo, useState, useCallback } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { useNavigate } from 'react-router';
import { posts } from '../data/posts';
import { buildGraphData } from '../data/graph';
import type { GraphNode, GraphEdge } from '../data/types';

const NODE_COLOR_POST = '#7c3aed';      // purple-600
const NODE_COLOR_TAG = '#52525b';       // zinc-600
const NODE_COLOR_HIGHLIGHT = '#c084fc'; // purple-400
const NODE_COLOR_DIM = '#27272a';       // zinc-800
const LINK_COLOR_NORMAL = '#3f3f46';    // zinc-700
const LINK_COLOR_HIGHLIGHT = '#7c3aed'; // purple-600
const BG_COLOR = '#09090b';             // zinc-950

export default function GraphPage() {
  const navigate = useNavigate();
  const [highlightIds, setHighlightIds] = useState<Set<string>>(new Set());
  const [hoverNodeId, setHoverNodeId] = useState<string | null>(null);
  const graphData = useMemo(() => buildGraphData(posts), []);

  // Adjacency map for O(1) neighbour lookup
  const adjacency = useMemo(() => {
    const map = new Map<string, Set<string>>();
    for (const edge of graphData.edges as GraphEdge[]) {
      const src =
        typeof edge.source === 'object'
          ? (edge.source as unknown as GraphNode).id
          : edge.source;
      const tgt =
        typeof edge.target === 'object'
          ? (edge.target as unknown as GraphNode).id
          : edge.target;
      if (!map.has(src)) map.set(src, new Set());
      if (!map.has(tgt)) map.set(tgt, new Set());
      map.get(src)!.add(tgt);
      map.get(tgt)!.add(src);
    }
    return map;
  }, [graphData]);

  // Union of hoverNodeId + highlightIds focal node + their neighbours
  const activeIds: Set<string> = useMemo(() => {
    const focus = hoverNodeId ?? (highlightIds.size === 1 ? [...highlightIds][0] : null);
    if (!focus) return new Set();
    const result = new Set<string>([focus]);
    adjacency.get(focus)?.forEach((id) => result.add(id));
    return result;
  }, [hoverNodeId, highlightIds, adjacency]);

  const isActive = useCallback(
    (id: string) => activeIds.size === 0 || activeIds.has(id),
    [activeIds]
  );

  const nodeRadius = useCallback((node: GraphNode) => {
    if (node.type === 'post') return 4;
    return 4 + Math.log2(node.weight + 1) * 3;
  }, []);

  const paintNode = useCallback(
    (node: GraphNode, ctx: CanvasRenderingContext2D) => {
      const r = nodeRadius(node);
      const active = isActive(node.id);

      let color: string;
      if (activeIds.size === 0) {
        color = node.type === 'post' ? NODE_COLOR_POST : NODE_COLOR_TAG;
      } else if (active) {
        color = NODE_COLOR_HIGHLIGHT;
      } else {
        color = NODE_COLOR_DIM;
      }

      ctx.beginPath();
      ctx.arc(node.x ?? 0, node.y ?? 0, r, 0, 2 * Math.PI);
      ctx.fillStyle = color;
      ctx.fill();

      // Label rendering
      if (active) {
        ctx.font = `${node.type === 'tag' ? 9 : 10}px sans-serif`;
        ctx.fillStyle = activeIds.size === 0 ? '#a1a1aa' : '#e4e4e7';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText(node.label, node.x ?? 0, (node.y ?? 0) + r + 2);
      }
    },
    [isActive, nodeRadius, activeIds]
  );

  const handleNodeClick = useCallback(
    (node: GraphNode) => {
      if (node.type === 'post' && node.slug) {
        navigate(`/post/${node.slug}`);
      } else {
        // Tag click: toggle persistent highlight (single-select)
        setHighlightIds((prev) => {
          const next = new Set(prev);
          if (next.has(node.id)) {
            next.delete(node.id);
          } else {
            next.clear();
            next.add(node.id);
          }
          return next;
        });
      }
    },
    [navigate]
  );

  if (posts.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen bg-zinc-950 text-zinc-500">
        게시물이 없습니다
      </div>
    );
  }

  return (
    <div className="w-full h-screen bg-zinc-950">
      <ForceGraph2D
        graphData={{ nodes: graphData.nodes, links: graphData.edges }}
        backgroundColor={BG_COLOR}
        nodeId="id"
        nodeLabel="label"
        nodeCanvasObject={(node, ctx) => paintNode(node as unknown as GraphNode, ctx)}
        nodeCanvasObjectMode={() => 'replace' as const}
        linkColor={(edge) => {
          const src =
            typeof (edge as unknown as GraphEdge).source === 'object'
              ? ((edge as unknown as GraphEdge).source as unknown as GraphNode).id
              : ((edge as unknown as GraphEdge).source as string);
          return activeIds.size === 0 || activeIds.has(src)
            ? LINK_COLOR_HIGHLIGHT
            : LINK_COLOR_NORMAL;
        }}
        onNodeClick={(node) => handleNodeClick(node as unknown as GraphNode)}
        onNodeHover={(node) => setHoverNodeId(node ? (node as unknown as GraphNode).id : null)}
        onBackgroundClick={() => {
          setHighlightIds(new Set());
          setHoverNodeId(null);
        }}
        d3AlphaDecay={0.02}
        d3VelocityDecay={0.3}
        warmupTicks={100}
        minZoom={0.3}
        maxZoom={10}
      />
    </div>
  );
}
