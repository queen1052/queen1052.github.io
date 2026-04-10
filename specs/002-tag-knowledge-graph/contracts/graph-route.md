# Contract: SPA Route — /graph

**Branch**: `002-tag-knowledge-graph` | **Date**: 2026-04-10
**Type**: SPA client-side route contract

---

## Route Definition

| Property | Value |
|---|---|
| Path | `/graph` |
| Component | `GraphPage` (lazy-loaded) |
| Route type | Client-side (React Router `createBrowserRouter`) |
| Deep-link support | Via existing `404.html` SPA fallback (원칙 II 준수) |
| Auth required | No |
| Loading state | `<Suspense>` fallback while lazy chunk downloads |

---

## URL Behaviour

| Input URL | Result |
|---|---|
| `https://queen1052.github.io/graph` | Renders GraphPage |
| Direct browser address bar | 404.html catches → React Router renders GraphPage |
| Back button from `/post/:slug` | Returns to previous page (history stack) |
| Link click from sidebar on `/` | React Router `<Link to="/graph">` — no full page reload |
| Link click from sidebar on `/post/:slug` | Same |

---

## Page Contract

### Inputs
- `posts: BlogPost[]` — imported from `src/app/data/posts.ts` (same source as Home page)
- No URL parameters, no query strings, no props from router

### Outputs (Rendered UI)
- A full-screen interactive graph canvas
- Sidebar with "지식 그래프" link highlighted as active when on `/graph`
- Empty-state message when `posts.length === 0`

### Side Effects
- `useNavigate()` called on post node click → navigates to `/post/:slug`
- No data writes, no API calls, no local storage access

---

## Navigation Transitions

| From | To | Mechanism |
|---|---|---|
| `/` (Home) | `/graph` | `<Link to="/graph">` in Sidebar |
| `/post/:slug` (PostDetail) | `/graph` | `<Link to="/graph">` in Sidebar |
| `/graph` (GraphPage) | `/` | `<Link to="/">` (logo / home link) |
| `/graph` (GraphPage) | `/post/:slug` | `useNavigate(\`/post/${slug}\`)` on post node click |

---

## Lazy Loading Contract

```tsx
// site/src/app/routes.tsx
import React, { Suspense } from 'react';

const GraphPage = React.lazy(() => import('./pages/GraphPage'));

// Route entry:
{
  path: '/graph',
  element: (
    <Suspense fallback={<div className="flex items-center justify-center h-screen bg-zinc-950 text-zinc-400">Loading…</div>}>
      <GraphPage />
    </Suspense>
  ),
}
```

The lazy chunk (`GraphPage` + `react-force-graph`) is downloaded only when the user first
navigates to `/graph`. Subsequent visits are served from browser cache.

---

## Sidebar Navigation Contract

New entry added to `Sidebar.tsx`:

```tsx
import { Link, useLocation } from 'react-router';
import { Network } from 'lucide-react';

// Inside the sidebar JSX, after the Tags section:
<Link
  to="/graph"
  className={`flex items-center gap-2 text-sm px-3 py-2 rounded-md transition-colors
    ${location.pathname === '/graph'
      ? 'bg-purple-600/20 text-purple-400'
      : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
    }`}
>
  <Network className="w-4 h-4" />
  지식 그래프
</Link>
```

---

## Error States

| Scenario | Behaviour |
|---|---|
| `react-force-graph` chunk fails to download | React error boundary (if added) OR white screen — acceptable for MVP |
| `posts` array is empty | Empty-state `<div>` rendered instead of canvas |
| Unknown route beyond `/graph` | Existing unmatched route handler (PostDetail "not found" or home) |
