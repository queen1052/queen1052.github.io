---
description: "Task list for feature 002-tag-knowledge-graph"
---

# Tasks: Interactive Tag Knowledge Graph

**Branch**: `002-tag-knowledge-graph`
**Input**: `specs/002-tag-knowledge-graph/plan.md`, `spec.md`, `data-model.md`, `contracts/graph-route.md`, `quickstart.md`, `research.md`
**Prerequisites**: plan.md ✅  spec.md ✅  research.md ✅  data-model.md ✅  contracts/ ✅  quickstart.md ✅

**Organization**: Tasks grouped by user story. Each phase is independently testable.
**Tests**: Not in scope per spec (manual browser testing + CI build validation only).

## Format: `[ID] [P?] [Story?] Description`
- **[P]**: Can run in parallel (different files, no shared dependencies with incomplete tasks)
- **[Story]**: User story this task belongs to (US1–US4)

---

## Phase 1: Setup

**Purpose**: Add the one new npm dependency required by this feature. All subsequent phases depend
on the `react-force-graph` package being installed and locked.

- [ ] T001 Add `react-force-graph` to `dependencies` in `site/package.json`, then run `npm install` inside `site/` to regenerate `site/package-lock.json` — commit updated lock file

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Type definitions and the pure data-derivation function that ALL user story phases
depend on. No user story implementation can begin until both tasks are complete.

**⚠️ CRITICAL**: T003 imports from T002 — they MUST run sequentially.

- [ ] T002 Add `GraphNodeType`, `GraphNode`, `GraphEdge`, `GraphData` type definitions to `site/src/app/data/types.ts` per `data-model.md` — append after the existing `PostFrontMatter` interface
- [ ] T003 Create `buildGraphData(posts: BlogPost[]): GraphData` pure function in `site/src/app/data/graph.ts` per `data-model.md` — builds `postNodes`, `tagNodes` (with `tagCount` Map), and `edges` arrays; handles empty posts array gracefully

**Checkpoint**: Types and data function ready — user story phases can now begin.

---

## Phase 3: User Story 1 — Interactive Force-Directed Graph Canvas (Priority: P1) 🎯 MVP

**Goal**: A visitor opens `/graph` and sees an interactive network of post and tag nodes rendered
on a canvas, with force-directed layout, visible node labels, zoom/pan, hover dimming, and an
empty-state message when there are no posts.

**Independent Test**: Navigate to `/graph` with 3 published posts. Verify: all post nodes (purple)
and tag nodes (zinc, size ∝ usage) appear; edges connect each post to its tags; scroll zooms;
drag pans; hovering a node dims unconnected nodes and shows a label.

- [ ] T004 [US1] Create `site/src/app/pages/GraphPage.tsx` with `ForceGraph2D` from `react-force-graph`: implement `nodeCanvasObject` (post=purple 4px circle, tag=zinc logarithmic-radius circle, per `research.md` §3), `hoverNodeId` state, `adjacency` Map built from edges, `activeIds` Set (union of hoverNodeId + its neighbours), per-node opacity (1.0 highlighted / 0.2 dimmed) and label rendering, force params `d3AlphaDecay=0.02` `d3VelocityDecay=0.3` `warmupTicks=100` `minZoom=0.3` `maxZoom=10`, empty-state `<div>` when `posts.length === 0`, dark background `#09090b` — follow `quickstart.md` Step 4 exactly
- [ ] T005 [US1] Add `/graph` lazy route to `site/src/app/routes.tsx`: `React.lazy(() => import('./pages/GraphPage'))` with `<Suspense>` fallback `<div className="flex items-center justify-center h-screen bg-zinc-950 text-zinc-400">Loading…</div>` — follow `quickstart.md` Step 5

---

## Phase 4: User Story 2 — Graph → Post Navigation (Priority: P2)

**Goal**: Clicking a post node navigates to its detail page; clicking a tag node toggles a
persistent highlight of connected posts; clicking the graph background resets all highlights.

**Independent Test**: Click a post node → browser navigates to `/post/:slug`. Click a tag node →
only connected posts and their edges remain bright, rest dim. Click empty background → all nodes
return to full opacity.

- [ ] T006 [P] [US2] Add interaction handlers to `site/src/app/pages/GraphPage.tsx`: `onNodeClick` — post node calls `navigate('/post/${node.slug}')`, tag node toggles the clicked tag's ID in `highlightIds` Set (single-select: clear then add, or clear if already selected); `onBackgroundClick` — clears both `highlightIds` and `hoverNodeId`; update `isActive` memoisation to combine `hoverNodeId` and `highlightIds` into `activeIds`

---

## Phase 5: User Story 3 — Automatic Graph Updates (Priority: P3)

**Goal**: Verify that publishing a new post (push → CI → deploy) automatically reflects in the
graph with no manual graph-configuration step — validated through the existing `buildGraphData`
runtime-derivation design.

**Independent Test**: Add one new post to `site/posts/` with an existing tag and a new tag. Run
`npm run build` inside `site/`. Open the preview — confirm new post node, new tag node, and edges
to both tags all appear. No `graph.json` or other manual file was needed.

- [ ] T007 [US3] Validation task — run `npm run build` inside `site/`; confirm zero TypeScript errors; open `npm run preview` and navigate to `/graph`; verify the running post count equals `posts.length` from `posts.json`, the tag node count equals the number of unique tags across all posts, and no post-tag edge is missing

---

## Phase 6: User Story 4 — Sidebar Navigation Entry Point (Priority: P4)

**Goal**: A "지식 그래프" link with a `Network` icon appears in the sidebar on every page, uses
React Router `<Link>` (no full-page reload), and shows an active style when the current route
is `/graph`.

**Independent Test**: Starting from `/`, click "지식 그래프" in the sidebar — browser navigates
to `/graph` without a full reload. While on `/graph`, the link has the purple active style. Click
the blog logo/home link — returns to `/`.

- [ ] T008 [P] [US4] Update `site/src/app/components/Sidebar.tsx`: add `import { useLocation } from 'react-router'` and `import { Network } from 'lucide-react'`; after the Tags section add a `<div className="mt-4 pt-4 border-t border-zinc-800">` containing a `<Link to="/graph">` with `Network` icon and label "지식 그래프", applying `bg-purple-600/20 text-purple-400` active style when `location.pathname === '/graph'` and `text-zinc-400 hover:text-white hover:bg-zinc-800` otherwise — follow `contracts/graph-route.md` Sidebar Navigation Contract

> T006 (GraphPage.tsx) and T008 (Sidebar.tsx) modify different files — they CAN be worked
> on simultaneously once T005 is complete.

---

## Final Phase: Polish & Cross-Cutting Concerns

**Goal**: Production-quality build with correct bundle structure; SPA deep-link works for `/graph`;
no regressions on existing routes.

- [ ] T009 [P] Build structure check: run `npm run build` inside `site/`; inspect `dist/assets/` — confirm `react-force-graph` (ForceGraph2D) appears as a **separate lazy chunk** (filename contains a hash, not merged into the main `index-*.js` entry bundle); confirm existing routes (`/`, `/post/:slug`) still work in `npm run preview`
- [ ] T010 [P] Deep-link verification: confirm `dist/404.html` is present (copy of `dist/index.html`); manually verify that navigating directly to `https://localhost:preview/graph` (via `npm run preview`) loads the graph correctly without showing an error page — satisfies `contracts/graph-route.md` and constitution 원칙 II

---

## Dependencies

```
T001 (install)
  └── T002 (types)
        └── T003 (graph.ts)
              ├── T004 (GraphPage.tsx)  ← US1 MVP
              │     └── T005 (routes)
              │           ├── T006 (click handlers)  ← US2
              │           └── T008 (Sidebar)         ← US4  [parallel with T006]
              └── T007 (build validation)  ← US3  [after T008]
                    ├── T009 (bundle structure)  [parallel]
                    └── T010 (deep-link)         [parallel]
```

## Parallel Execution

Within **Phase 4 + Phase 6** (once T005 is complete):
- T006 `GraphPage.tsx` click handlers
- T008 `Sidebar.tsx` nav link

These modify different files with no shared dependencies → can run simultaneously.

Within **Final Phase** (once T007 is complete):
- T009 bundle structure check
- T010 deep-link verification

Both are read-only validation checks → can run simultaneously.

## Implementation Strategy

**MVP scope** (just US1): T001 → T002 → T003 → T004 → T005
After this, the graph renders interactively at `/graph` with zoom, pan, hover, and size-weighted
tags. The sidebar link (US4) and post-click navigation (US2) can follow, and auto-update (US3)
is validated last.
