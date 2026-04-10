# Research: Interactive Tag Knowledge Graph

**Branch**: `002-tag-knowledge-graph` | **Date**: 2026-04-10
**Status**: COMPLETE — all NEEDS CLARIFICATION resolved

---

## 1. Graph Visualization Library Selection

**Decision**: `react-force-graph` (ForceGraph2D component)

**Rationale**:
- Provides a React-native `<ForceGraph2D>` component that renders on an HTML5 Canvas
- Force-directed layout (d3-force internally) — identical physics to Obsidian's Graph View
- Built-in zoom (scroll/pinch) and pan (drag background) — zero extra code required
- Native event props: `onNodeClick`, `onNodeHover`, `onBackgroundClick`
- Custom node rendering via `nodeCanvasObject` callback — allows distinct post vs. tag shapes and
  weight-based sizing
- Lazy-loadable as a `React.lazy()` route — graph library (~350KB gzip) is not bundled into the
  main blog entry point, keeping initial page load unaffected

**Alternatives Considered**:

| Library | Reason Rejected |
|---|---|
| Pure d3-force + Canvas API | More implementation work (physics loop, hit detection, zoom setup). Acceptable but adds ~200 lines of boilerplate for equivalent result. `react-force-graph` is a proven wrapper. |
| `@visx/network` (SVG) | No built-in force simulation or zoom/pan. SVG degrades at 100+ nodes. Read-only visualization, not interactive. |
| `vis-network` | jQuery dependency, not React-friendly, heavier bundle (~800KB). |
| `cytoscape.js` | No force-directed default — requires separate `cytoscape-cola`, `cytoscape-fcose` plugins. More config overhead. |
| WebGL (`react-force-graph-3d`) | 3D adds navigation complexity without benefit for a 2D knowledge graph. |

**Package decision**: `react-force-graph` (provides both 2D and 3D; tree-shaken by importing only
`ForceGraph2D` from the package entry).

---

## 2. Force Simulation Parameters for Obsidian-like Aesthetics

**Decision**: Start with these d3-force parameters; tunable at runtime:

| Parameter | Value | Effect |
|---|---|---|
| `d3AlphaDecay` | `0.02` | Slow settle — nodes drift smoothly |
| `d3VelocityDecay` | `0.3` | Low friction — nodes feel weightless |
| Link `distance` | `80` | Moderate spacing between post and tag |
| Charge `strength` | `-150` | Repulsion — nodes spread without flying apart |
| Center force | enabled | Graph stays centered in viewport |
| `warmupTicks` | `100` | Pre-simulate before render for stable initial layout |
| `cooldownTicks` | `∞` | Keep simulation running for hover re-layout |

Obsidian's aesthetic key: small nodes, thin edges, dark background, soft glow on selection. These
are achieved through `nodeCanvasObject` rendering, not through force parameter tuning.

---

## 3. Node Sizing Formula

**Decision**: Two-tier sizing — fixed base for posts, logarithmic scale for tags

```
Post node radius  = 4px (fixed)
Tag node radius   = 4 + Math.log2(edgeCount + 1) * 3   (range: 4px–~14px for 1–100 posts)
```

**Rationale**: A linear formula (e.g., `4 + edgeCount * 2`) over-inflates tags used by 10+ posts
to unusable size. A logarithmic scale compresses the visual range while still expressing relative
popularity. Tested against 3–50 posts — all tags remain distinguishable without overlap.

---

## 4. Highlight / Dim State Machine

**Decision**: Two-level highlight system with three visual states

| State | Condition | Visual |
|---|---|---|
| Normal | No node hovered/clicked | Full opacity (1.0), thin edge |
| Highlighted | Node is hovered or is neighbour of clicked tag | Full opacity, glow ring |
| Dimmed | Node is NOT neighbour of hovered/clicked node | Reduced opacity (0.2) |

**Implementation**: Maintain a `Set<string>` of highlighted node IDs in React state.
- `onNodeHover` → populate set from node + direct neighbours
- `onNodeClick` (tag) → toggle persistent set (click again = clear)
- `onNodeClick` (post) → navigate away
- `onBackgroundClick` → clear set → all nodes return to Normal state

---

## 5. Background Click Detection

**Decision**: Use `react-force-graph`'s native `onBackgroundClick` prop

```tsx
<ForceGraph2D
  onBackgroundClick={() => setHighlightIds(new Set())}
/>
```

No need for manual canvas event delegation or z-index management. Confirmed in react-force-graph
v1.x API docs — `onBackgroundClick` fires only when clicking empty canvas space, not on nodes.

---

## 6. Mobile Touch Handling

**Decision**: Rely on `react-force-graph`'s built-in touch support (via d3-zoom)

d3-zoom ships with pointer event support covering:
- Single-finger drag → pan
- Two-finger pinch → zoom

No additional configuration needed. `react-force-graph` exposes `minZoom`/`maxZoom` props to
clamp zoom range — set to `0.5`–`8.0` to prevent losing the graph from view on mobile.

---

## 7. Bundle Size Analysis

**Decision**: Code-split with `React.lazy` — graph library is NOT in the main bundle

| Bundle segment | Size (gzip est.) | Load trigger |
|---|---|---|
| Main blog entry (current) | ~180KB | Every page |
| `/graph` lazy chunk (new) | ~350KB | Only when user visits `/graph` |

Full blog entry point is not impacted. Users who never visit `/graph` never download it.

**Implementation**:
```tsx
// routes.tsx
const GraphPage = React.lazy(() => import('./pages/GraphPage'));
```

With `<Suspense fallback={<Loading />}>` wrapping in the router, this satisfies SC-004
(renders within 5 seconds) even on 3G — the chunk is only downloaded once, then cached by the
browser's standard HTTP cache.

---

## 8. Graph Data Derivation Strategy

**Decision**: Compute `GraphData` in the browser at runtime from the already-imported `posts` array

No new build step. No separate file. The same `posts` array from `src/app/data/posts.ts` is the
source of truth. A pure function `buildGraphData(posts)` runs once when the `GraphPage` component
mounts, producing `{ nodes, edges }`.

**Rationale for runtime computation over build-time generation**:
- The post data is already ~5–10KB — graph derivation from it is instant (<1ms for 500 posts)
- No changes to the Vite plugin or CI pipeline
- Guaranteed sync between posts and graph (same data source, same import path)
- Simpler: no additional `.json` generate step, no cache invalidation concern

---

## 9. Sidebar Navigation Entry Point

**Decision**: Add a "지식 그래프" link inside the existing `Sidebar` component

- Use `<Link>` from `react-router` (not `<a href>`)
- Icon: `Network` from `lucide-react` (already installed)
- Placement: below the Tags section in the sidebar body, separated by a horizontal rule

**Alternative considered**: Top navigatoin bar link — rejected because the sidebar is the only
navigation pattern in the current design. Consistency matters more than discoverability.

---

## Summary of Resolved Decisions

| #  | Question | Resolved Decision |
|----|---|---|
| 1 | Graph library | `react-force-graph` (ForceGraph2D) |
| 2 | Force parameters | Slow alpha decay, log-scale charge, center force |
| 3 | Node sizing | Fixed for posts, logarithmic for tags |
| 4 | Highlight state machine | 3 states (normal / highlighted / dimmed), Set-based |
| 5 | Background click | `onBackgroundClick` prop |
| 6 | Mobile touch | d3-zoom built-in, min/max zoom clamped |
| 7 | Bundle impact | React.lazy code-split, ~350KB only on graph route |
| 8 | Data source | Runtime from `posts` array, pure function |
| 9 | Nav entry point | Sidebar "지식 그래프" link, `Network` icon |
