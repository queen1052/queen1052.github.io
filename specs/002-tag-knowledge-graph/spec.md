# Feature Specification: Interactive Tag Knowledge Graph

**Feature Branch**: `002-tag-knowledge-graph`
**Created**: 2026-04-10
**Status**: Draft
**Input**: User description: "posts의 tags를 연결해서 옵시디언의 map 처럼 보이게 해서 github pages에 올려서 보고싶어."

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Visitor Explores the Tag Knowledge Graph (Priority: P1)

A visitor opens the knowledge graph page and sees an interactive network visualization where post
nodes and tag nodes are connected, resembling Obsidian's Graph View. Large tags appear as prominent
nodes, smaller or rarer tags appear smaller. Post nodes link to the tags they carry. The visitor can
pan and zoom freely, hover over nodes to see their name, and click a tag node to highlight only the
posts and tags connected to it.

**Why this priority**: The graph is the entire new feature. Without a navigable, interactive graph
that renders correctly, no other story can be exercised.

**Independent Test**: Open the graph page with three published posts (each with 3–5 tags, some
overlapping). Verify that all posts and tags appear as distinct nodes, edges connect posts to their
tags, and nodes for tags shared by multiple posts are visually more prominent.

**Acceptance Scenarios**:

1. **Given** the blog has published posts with tags, **When** a visitor navigates to the graph
   page, **Then** an interactive force-directed graph is displayed showing all posts and all unique
   tags as distinct nodes, with edges between each post node and the tag nodes it belongs to.
2. **Given** the graph is fully loaded, **When** a visitor hovers over any node, **Then** the
   node's name is shown in a tooltip and directly connected neighbors are visually highlighted
   while unconnected nodes dim.
3. **Given** the graph contains many nodes, **When** a visitor uses scroll/pinch to zoom, **Then**
   the graph zooms in or out smoothly, and **When** a visitor drags the background, **Then** the
   graph pans.
4. **Given** a tag is used by more than one post, **When** the graph renders, **Then** that tag's
   node is visually larger or more prominent than a tag used by only one post.

---

### User Story 2 - Visitor Navigates from Graph to Post (Priority: P2)

A visitor sees a post node in the graph that interests them. They click the post node and are taken
directly to that post's detail page — without leaving the graph page first.

**Why this priority**: The graph must be a navigation surface, not just a visual decoration.
Connecting exploration to reading is the core value proposition analogous to Obsidian's "click a
node → open the file".

**Independent Test**: Click a post node in the graph and confirm the browser navigates to the
correct post detail page for that post.

**Acceptance Scenarios**:

1. **Given** a post node is visible in the graph, **When** a visitor clicks it, **Then** the
   browser navigates to the corresponding post's detail page (same routing as clicking a card on
   the home page).
2. **Given** a tag node is clicked, **When** the visitor clicks it, **Then** only the posts that
   carry that tag — and edges connecting them to the tag — are highlighted (no navigation occurs
   for tag nodes; they serve as filters/lenses within the graph).
3. **Given** a visitor clicked a tag node (highlighting subset), **When** they click somewhere on
   the empty graph background, **Then** the highlight is cleared and the full graph is shown again.

---

### User Story 3 - Author Publishes a Post and Graph Updates Automatically (Priority: P3)

The author adds a new post Markdown file with tags and pushes to `main`. After GitHub Actions
deploys the site, the knowledge graph page reflects the new post and its tags — including any new
edges to existing tags — without any manual graph update step.

**Why this priority**: The graph must stay in sync with the posts data automatically. Any
disconnect between posts and graph would erode trust in the graph as a navigation tool.

**Independent Test**: Add a new post with at least one existing tag and one new tag. After
deployment, open the graph and verify the new post node appears, the new tag node appears, and the
edge to the shared existing tag connects through without duplicating existing nodes.

**Acceptance Scenarios**:

1. **Given** a new post is published (pushed and deployed), **When** a visitor opens the graph
   page, **Then** the new post node is visible and connected to all tags listed in its front-matter.
2. **Given** the new post shares a tag that already exists in the graph, **When** the graph renders,
   **Then** the existing tag node now has an additional edge to the new post node (no duplicate
   tag node is created).
3. **Given** the new post introduces a brand-new tag not previously used, **When** the graph
   renders, **Then** a new tag node is created and connected to the new post only.

---

### User Story 4 - Graph Is Accessible from the Blog Navigation (Priority: P4)

A visitor on the blog home page or post detail page can reach the knowledge graph in one click
via a clearly labelled navigation element (e.g., a sidebar link or a nav icon labeled "Graph" or
"지식 그래프").

**Why this priority**: Without an obvious entry point, the graph page is unreachable except via
direct URL, making it practically invisible to casual visitors.

**Independent Test**: Starting from the blog home page, reach the graph page using a single click
on a navigation element. Starting from the graph page, return to the home page in a single click.

**Acceptance Scenarios**:

1. **Given** a visitor is on the home page, **When** they click the graph navigation link in the
   sidebar, **Then** they are taken to the graph page.
2. **Given** a visitor is on the graph page, **When** they click the home/logo link, **Then** they
   are returned to the blog home page.
3. **Given** the graph page URL is opened directly in a browser, **When** the page loads,
   **Then** the graph is displayed correctly (the SPA deep-link fallback works for the graph route).

---

### Edge Cases

- **No posts**: When zero posts are published, the graph page shows an empty-state message (e.g.,
  "게시물이 없습니다") rather than a blank canvas or broken layout.
- **Single post with no tags**: A post with an empty tags list appears as an isolated node with no
  edges. The graph still renders without errors.
- **All posts share one tag**: The single shared tag becomes a highly connected hub; the graph must
  remain readable and not overflow its container.
- **Large number of tags**: With 50+ unique tags, the graph must still be navigable — nodes must
  not fully overlap and the graph should have a default zoom level that fits within the viewport.
- **Mobile / small screen**: The graph renders on screens down to 375px width with basic
  touch-to-pan and pinch-to-zoom behavior; the graph is usable even if not perfectly laid out.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The graph page MUST be accessible at a dedicated route within the existing SPA (e.g.,
  `/graph`) and linked from the blog sidebar navigation.
- **FR-002**: The graph MUST represent posts and tags as distinct visual node types (e.g., different
  shapes or colours), with edges connecting each post node to each of its tag nodes.
- **FR-003**: Tag node visual size or weight MUST reflect the number of posts that carry that tag —
  tags used by more posts appear larger or more prominent than less-used tags.
- **FR-004**: The graph MUST support interactive pan (drag background) and zoom (scroll/pinch).
- **FR-005**: Hovering over any node MUST display its label (post title or tag name) in a tooltip
  and highlight only the hovered node and its direct neighbours; all other nodes and edges MUST dim.
- **FR-006**: Clicking a post node MUST navigate the browser to that post's detail page using the
  existing SPA routing.
- **FR-007**: Clicking a tag node MUST highlight all posts and edges connected to that tag without
  navigating away from the graph page; clicking the background MUST reset the highlight.
- **FR-008**: The graph data MUST be derived from the same `posts.json` data source used by the
  home page — no separate data file or manual graph definition is needed.
- **FR-009**: The graph MUST update automatically when new posts are published: no manual graph
  update step is required beyond the normal post authoring workflow.
- **FR-010**: The graph page MUST render an empty-state message when no posts are available.
- **FR-011**: The graph MUST be visually consistent with the existing dark blog theme (dark
  background, accent colour for highlights, readable text labels).
- **FR-012**: The graph page URL MUST be deep-linkable via the existing SPA `404.html` fallback
  mechanism.

### Key Entities

- **GraphNode**: Represents either a Post or a Tag on the graph. Attributes: `id` (unique),
  `type` (`"post"` or `"tag"`), `label` (post title or tag name), `weight` (number of edges,
  used for visual sizing), `slug` (for post nodes only, used to build the navigation URL).
- **GraphEdge**: Represents the relationship between a Post and a Tag. Attributes: `source`
  (post node id), `target` (tag node id).
- **GraphData**: The complete graph input. Attributes: `nodes: GraphNode[]`, `edges: GraphEdge[]`.
  Derived at the same time as `posts.json` (same build step, or computed in the browser from
  `posts.json` on page load).

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: The graph page renders all unique tags from all published posts as distinct interactive
  nodes — zero published tags are absent from the graph.
- **SC-002**: Every published post appears as a node in the graph with correct edges to all of its
  tags — 100% of post-tag relationships are reflected.
- **SC-003**: A visitor can reach any post's detail page from the graph in no more than 2 clicks
  (1 click to navigate to graph + 1 click on the post node).
- **SC-004**: The graph page loads and renders the initial graph within a time that feels
  responsive to a user on a standard broadband connection (well under 5 seconds including assets).
- **SC-005**: The graph remains navigable (pan, zoom, hover, click) with all currently published
  posts and their tags present in the visualization — no freezing, overlapping labels obscuring all
  nodes, or unresponsive interactions.
- **SC-006**: Adding a new post and pushing to `main` results in the new post and any new tags
  appearing in the graph after a successful GitHub Actions deployment — zero manual graph
  configuration steps required.
- **SC-007**: The graph page URL (`/graph`) is directly accessible via browser address bar and the
  SPA deep-link mechanism — no GitHub 404 error page is displayed.
- **SC-008**: The graph maintains visual consistency with the dark blog theme: background, node
  colours, and typography match the existing design language.

---

## Assumptions

- The graph will be implemented as a new route (`/graph`) within the existing React SPA — it is
  not a separate standalone page.
- Graph data is computed from `posts.json` in the browser at runtime; no separate build step for
  graph data is required unless build-time generation proves necessary.
- Node layout uses a force-directed algorithm (standard approach for knowledge graphs); the exact
  forces and physics parameters are tuning details decided during implementation.
- Cover images are NOT displayed as node thumbnails — nodes use text labels only to keep the
  graph lightweight.
- Tag nodes that share no posts with any other tag (isolated tag nodes) are still displayed in the
  graph; they are shown as isolated nodes near the periphery.
- The graph does not need to support cross-post search or filtering beyond what is already provided
  by the home page sidebar.
- There is no requirement for a server-side API; all graph data comes from the statically generated
  `posts.json` file at the usual CDN path.
- Touch interaction on mobile is supported at a basic level (pan and zoom); advanced multi-touch
  gestures (e.g., two-finger rotate) are not required.
