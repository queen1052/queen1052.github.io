# Implementation Plan: Interactive Tag Knowledge Graph

**Branch**: `002-tag-knowledge-graph` | **Date**: 2026-04-10 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `specs/002-tag-knowledge-graph/spec.md`

## Summary

Add an interactive knowledge graph page (`/graph`) to the existing React SPA that visualizes all
blog posts and their tags as a force-directed network — resembling Obsidian's Graph View. Post
nodes and tag nodes are visually distinct; tag nodes scale in size with usage frequency. Users can
pan, zoom, hover to see neighbours, click a tag to filter, and click a post to navigate to it.
The graph derives its data from the same `posts.json` already used by the home page — zero new
build steps required. The new route is code-split with `React.lazy` to keep the main bundle
unaffected.

## Technical Context

**Language/Version**: TypeScript 5 / Node.js 20 (LTS, pinned in CI)
**Primary Dependencies**:
- React 18, React Router 7 — existing; add `/graph` route and `useNavigate`
- Vite 6 + `@tailwindcss/vite` — existing build stack, no changes required
- `react-force-graph` (new) — `ForceGraph2D` canvas renderer, d3-force physics, built-in
  zoom/pan, node click/hover events, custom `nodeCanvasObject` rendering
- `lucide-react` — existing; uses `Network` icon for sidebar nav link

**Storage**: `site/posts/*.md` → `site/src/generated/posts.json` (existing build artifact).
Graph data is derived from `posts` array at browser runtime — no new files or build steps.

**Testing**: Manual browser testing (`npm run dev`, `npm run preview`). CI build validation as
gate. No automated tests in scope.

**Target Platform**: GitHub Pages (static CDN). Modern browsers (Chrome 120+, Firefox 120+,
Safari 17+, Edge 120+). Mobile: iOS Safari 16+, Chrome Android (basic touch pan/zoom).

**Project Type**: Static SPA — adding one new route and one new npm dependency.

**Performance Goals**:
- Graph `/graph` route: lazy chunk (~350KB gzip) loads under 3s on 4G
- Initial graph render: < 1s for current post count (~3–50 posts, 15–200 nodes)
- Main blog home page: zero performance regression (lazy split ensures this)

**Constraints**:
- Zero server runtime — graph data derived from static `posts.json`, no API
- `React.lazy` code-split MUST be used — graph library must NOT appear in main entry bundle
- No new Vite plugin, no new build step, no changes to `vite-plugin-posts.mjs`
- `base: '/'` unchanged — all routes must resolve under apex domain
- `/graph` must be deep-linkable via existing `404.html` SPA fallback

**Scale/Scope**: Personal blog, ~3–500 posts, single author. Current: 3 posts, 15 unique tags.

---

## Constitution Check

*GATE: Evaluated before Phase 0 research and re-validated after Phase 1 design.*

| 원칙 | 평가 | 근거 |
|---|---|---|
| **원칙 I — 정적 우선 출력** | ✅ PASS | Graph data derived from static `posts.json` at runtime. `react-force-graph` is a client-side canvas library. Zero server calls. All output remains in `site/dist/` as static files. |
| **원칙 II — GitHub Pages 호환성** | ✅ PASS | New `/graph` route is client-side only. `404.html` fallback (existing) handles direct URL access. `.nojekyll` and `robots.txt` unchanged. No new static file additions needed. |
| **원칙 III — 결정론적 빌드** | ✅ PASS | New dep (`react-force-graph`) pinned via `package-lock.json` after `npm install`. CI uses `npm ci`. Build is idempotent: same posts → same graph data. |
| **원칙 IV — 올바른 기본 URL** | ✅ PASS | `/graph` route uses React Router `<Link to="/graph">` — no hardcoded URLs. `useNavigate('/post/${slug}')` uses relative paths. Vite `base: '/'` unchanged. |
| **원칙 V — 자동화 지속 배포** | ✅ PASS | No changes to `deploy.yml`. Existing workflow: `npm ci` → `npm run build` → deploy. New dependency installed via `npm ci` + committed `package-lock.json`. |
| **원칙 VI — 콘텐츠 무결성** | ✅ PASS | Graph renders post titles and tag names — both are static strings from front-matter, not user-submitted content. No new markdown rendering, no XSS surface. |

**모든 6개 원칙: PASS. 게이트 통과.**

*Post-design re-check*: Phase 1 design (data-model.md, contracts/graph-route.md, quickstart.md)
introduces no principle violations. `React.lazy` code split reinforces原칙 I (graph weight stays
out of static bundle). Sidebar `<Link>` uses React Router (원칙 IV). No new build calls (원칙 III).

---

## Project Structure

### Documentation (this feature)

```text
specs/002-tag-knowledge-graph/
├── plan.md              # This file
├── research.md          # Phase 0 output ✅
├── data-model.md        # Phase 1 output ✅
├── quickstart.md        # Phase 1 output ✅
├── contracts/
│   └── graph-route.md   # Phase 1 output ✅
└── tasks.md             # Phase 2 output (created by /speckit.tasks)
```

### Source Code Changes

```text
site/
├── package.json          ← add react-force-graph dependency
├── package-lock.json     ← regenerated after npm install
└── src/
    └── app/
        ├── data/
        │   ├── types.ts          ← add GraphNode, GraphEdge, GraphData, GraphNodeType
        │   └── graph.ts          ← new: buildGraphData(posts) pure function
        ├── pages/
        │   └── GraphPage.tsx     ← new: /graph route component
        ├── components/
        │   └── Sidebar.tsx       ← update: add "지식 그래프" nav link
        └── routes.tsx            ← update: add /graph lazy route
```

**Structure Decision**: Single SPA project. All changes are within `site/src/`. No new directories
at the repository root. No backend. No new build scripts.

---

## Phase 0 Research Output

→ See [research.md](./research.md) for full decision rationale.

**Key decisions**:
1. **Graph library**: `react-force-graph` (ForceGraph2D canvas) — best UX/effort for Obsidian aesthetic
2. **Bundle strategy**: `React.lazy` code-split — graph library only loads when user visits `/graph`
3. **Data source**: Runtime derivation from existing `posts` array — no new build step
4. **Node sizing**: Fixed 4px for posts; logarithmic `4 + log₂(weight+1)×3` for tags
5. **Highlight state**: 3-state machine (normal/highlighted/dimmed) via a `Set<string>` in React state
6. **Background click**: `onBackgroundClick` prop from `react-force-graph` — clears highlight
7. **Mobile**: d3-zoom built-in touch support; min/max zoom clamped to 0.3–10

---

## Phase 1 Design Output

→ See [data-model.md](./data-model.md), [contracts/graph-route.md](./contracts/graph-route.md), [quickstart.md](./quickstart.md).

**Data model summary**:
- `GraphNode` (`id`, `type`, `label`, `weight`, optional `slug`)
- `GraphEdge` (`source: string`, `target: string`)
- `GraphData` (`nodes: GraphNode[]`, `edges: GraphEdge[]`)
- `buildGraphData(posts: BlogPost[]): GraphData` — pure function in `graph.ts`

**Route contract summary**:
- Path: `/graph`, lazy-loaded, Suspense fallback
- Sidebar link: `<Link to="/graph">` with `Network` icon, active state via `useLocation`
- Deep-link: existing `404.html` fallback covers `/graph` without changes

**Quickstart**: [quickstart.md](./quickstart.md) has step-by-step instructions with full code.
