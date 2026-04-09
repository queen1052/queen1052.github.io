---
description: "Task list for feature 001-uiux-md-blog"
---

# Tasks: UI_UX Design Integration with MD-driven Blog on GitHub Pages

**Branch**: `001-uiux-md-blog`
**Input**: `specs/001-uiux-md-blog/plan.md`, `spec.md`, `data-model.md`, `contracts/`
**Prerequisites**: plan.md ✅  spec.md ✅  research.md ✅  data-model.md ✅  contracts/ ✅

**Organization**: Tasks are grouped by user story. Each phase is independently testable.
**Tests**: Not in scope per spec (manual + CI validation only).

## Format: `[ID] [P?] [Story?] Description`
- **[P]**: Can run in parallel (different files, no shared dependencies with incomplete tasks)
- **[Story]**: User story this task belongs to (US1–US4)

---

## Phase 1: Setup (Project Scaffolding)

**Purpose**: Replace the legacy `site/` contents with the new Vite + React SPA scaffold. All subsequent phases depend on this being complete.

- [X] T001 Delete legacy `site/` contents: remove `_javascript/`, `gulpfile.js/`, `ragflow/`, `skills/`, `tools/`, `start.bat`, `commit.bat`, `.gitattributes`, `jekyll-theme-chirpy.gemspec`, `LICENSE`, `robots.txt` (root-level in site/) keeping only `package-lock.json` for reference
- [X] T002 Create `site/package.json` with scripts `dev`, `build`, `preview` and dependencies: react@18, react-dom@18, react-router@7, lucide-react, @radix-ui packages from UI_UX; devDependencies: vite@6, @vitejs/plugin-react, tailwindcss@4, @tailwindcss/vite, typescript@5, @types/react, @types/react-dom; buildDependencies (added to dependencies): gray-matter, marked, sanitize-html, @types/sanitize-html
- [X] T003 Create `site/tsconfig.json` with `strict: true`, `moduleResolution: bundler`, `jsx: react-jsx`, path alias `@` → `./src`
- [X] T004 Create `site/index.html` as SPA entrypoint: single `<div id="root"></div>`, script tag pointing to `src/main.tsx`, correct charset/viewport meta tags
- [X] T005 [P] Create `site/postcss.config.mjs` (removed — @tailwindcss/vite handles this) for Tailwind CSS 4 (`@tailwindcss/postcss` plugin)
- [X] T006 [P] Create `site/public/.nojekyll` (empty file — prevents GitHub Pages Jekyll processing)
- [X] T007 [P] Create `site/public/robots.txt` with content: `User-agent: *`, `Allow: /`, `Sitemap: https://queen1052.github.io/sitemap.xml`
- [X] T008 [P] Create `site/public/assets/img/.gitkeep` to establish the local cover-images directory
- [X] T009 Create `site/posts/` directory with two sample posts migrated from `UI_UX/src/app/data/mockPosts.ts` content: `site/posts/2026-04-09-modern-web-development.md` and `site/posts/2026-04-07-clean-code-tips.md`, each with complete front-matter (title, date, category, tags, excerpt, image, author, readTime) and Markdown body
- [X] T010 Create `site/src/generated/.gitkeep` placeholder (directory must exist before first build; posts.json is build-generated so add `site/src/generated/posts.json` to `site/.gitignore`)
- [X] T011 Create `site/.gitignore` ignoring: `node_modules/`, `dist/`, `src/generated/posts.json`
- [X] T012 Run `npm install` inside `site/` to generate the new `package-lock.json`, then commit it

---

## Phase 2: Foundational (Vite Plugin + Types — Blocking Prerequisite)

**Purpose**: The `vite-plugin-posts.mjs` pipeline and TypeScript types MUST exist before any React component can compile. This phase is a hard prerequisite for US1–US4.

**Independent test**: Run `cd site && npm run build` — build must complete without error and produce `site/src/generated/posts.json`, `site/dist/sitemap.xml`, `site/dist/feed.xml`.

- [X] T013 Create `site/src/app/data/types.ts` defining the `BlogPost` TypeScript interface exactly as specified in `contracts/posts-data-schema.md`: id, title, date, category, tags, excerpt, image (string|null), author, readTime, contentHtml
- [X] T014 Create `site/scripts/vite-plugin-posts.mjs` — the core build-time Vite plugin:
  - `buildStart` hook: scan `site/posts/*.md`, for each file: parse front-matter with `gray-matter`; validate required fields (`title`, `date`, `category`, `tags`) — throw build error on missing; derive `id` from basename; auto-calculate `excerpt` (first 150 chars stripped of MD syntax) if absent; auto-calculate `readTime` (ceil(wordCount/200) + "분") if absent; default `author` to "익명"; convert body with `marked.parse(body, { gfm: true })` then sanitize with `sanitize-html`; sort posts by date descending; write result array to `site/src/generated/posts.json`
  - `writeBundle` hook: read posts.json; generate `dist/sitemap.xml` (root URL + one `<url>` per post with `<loc>`, `<lastmod>`, `<changefreq>monthly`, `<priority>0.8`); generate `dist/feed.xml` (RSS 2.0, 20 most recent posts); write both files into `outDir`
- [X] T015 Create `site/vite.config.ts`: `base: '/'`, plugins: `[postsPlugin(), react(), tailwindcss()]`, resolve alias `@` → `src/`, `assetsInclude: ['**/*.svg']`. Import `postsPlugin` from `./scripts/vite-plugin-posts.mjs`
- [X] T016 Create `site/src/app/data/posts.ts` that imports `postsData from '../../generated/posts.json'` (with `assert { type: 'json' }` or Vite default JSON handling), casts to `BlogPost[]`, exports `posts`, `categories` (derived: `['전체', ...new Set(posts.map(p => p.category))].sort()`), `allTags` (derived: `[...new Set(posts.flatMap(p => p.tags))].sort()`)
- [X] T017 Validate Phase 2: run `cd site && npm run build` locally, confirm `src/generated/posts.json` exists with 2 posts and `dist/sitemap.xml`, `dist/feed.xml` are generated; fix any TypeScript or plugin errors before proceeding

---

## Phase 3: User Story 1 — MD → Live Post Pipeline (P1)

**Purpose**: Complete the authoring workflow end-to-end so a new `.md` file becomes a live post after push.

**Independent test**: Create a third sample post `site/posts/2026-04-05-test-post.md`, run `npm run build`, verify the post appears in `posts.json`. Then run `npm run preview` and confirm the card shows on the home page.

- [X] T018 [P] [US1] Update `.github/workflows/deploy.yml`: remove the separate "Generate sitemap & RSS" step (`node scripts/generate_feeds.js`); simplify to 4 steps: `npm ci` → `npm run build` → `cp -a dist/index.html dist/404.html` → `peaceiris/actions-gh-pages@v3` deploy with `publish_dir: ./site/dist`. Verify `permissions: contents: write, pages: write, id-token: write` are retained.
- [X] T019 [P] [US1] Add a third sample post `site/posts/2026-04-05-uiux-design-basics.md` migrated from the third mock post in `UI_UX/src/app/data/mockPosts.ts`, with full front-matter and Markdown body, to serve as end-to-end test content

---

## Phase 4: User Story 2 — Dark Modern Blog Home Page UI (P2)

**Purpose**: Apply the exact Dark Modern Blog design from `UI_UX/` — sidebar + card grid — consuming real data from `posts.ts`.

**Independent test**: Run `npm run dev`, open `http://localhost:5173`, verify: dark zinc-950 background, purple sidebar highlights, all 3 sample posts appear as cards, clicking a category filters the list, clicking a tag filters the list, empty-state message appears when no posts match.

- [X] T020 [P] [US2] Copy and adapt `site/src/styles/fonts.css` from `UI_UX/src/styles/fonts.css`
- [X] T021 [P] [US2] Copy and adapt `site/src/styles/tailwind.css` from `UI_UX/src/styles/tailwind.css` — Tailwind CSS 4 `@import "tailwindcss"` directive
- [X] T022 [P] [US2] Copy and adapt `site/src/styles/theme.css` from `UI_UX/src/styles/theme.css` — CSS custom properties (background, foreground, accent colors)
- [X] T023 [US2] Create `site/src/styles/index.css` importing fonts.css, tailwind.css, theme.css (order matters — same as UI_UX)
- [X] T024 [US2] Create `site/src/main.tsx`: `import './styles/index.css'`, `createRoot(document.getElementById('root')!).render(<App />)` (identical to UI_UX/src/main.tsx)
- [X] T025 [US2] Create `site/src/app/App.tsx`: `<RouterProvider router={router} />` (identical to UI_UX/src/app/App.tsx)
- [X] T026 [US2] Create `site/src/app/routes.tsx`: `createBrowserRouter([{ path: '/', Component: Home }, { path: '/post/:slug', Component: PostDetail }])` — note: slug param name changed from `id` to `slug` to match URL contract
- [X] T027 [US2] Create `site/src/app/components/Sidebar.tsx` migrated from `UI_UX/src/app/components/Sidebar.tsx`: accepts `categories`, `tags`, `selectedCategory`, `selectedTag`, `onCategoryChange`, `onTagChange` props; uses same Tailwind classes (zinc-900 background, purple-600 active state); uses icons from `lucide-react`
- [X] T028 [US2] Create `site/src/app/components/BlogCard.tsx` migrated from `UI_UX/src/app/components/BlogCard.tsx`: accepts `post: BlogPost`; renders link to `/post/${post.id}`; handles `post.image === null` gracefully (no `<img>` tag rendered when image is null, card layout adjusts); uses same Tailwind classes and lucide-react icons
- [X] T029 [US2] Create `site/src/app/pages/Home.tsx` migrated from `UI_UX/src/app/pages/Home.tsx`: imports `posts`, `categories`, `allTags` from `../data/posts` (not mockPosts); implements category and tag filter state; renders `<Sidebar>` + card grid; shows "해당 조건의 게시글이 없습니다" empty-state; adds responsive mobile sidebar toggle (hamburger button visible on `sm:` breakpoint, sidebar slides in/out)

---

## Phase 5: User Story 3 — Full Post Detail Page (P3)

**Purpose**: Visitors read full posts with correctly rendered Markdown HTML in the dark theme.

**Independent test**: Run `npm run dev`, click a post card, verify: hero image shows (or graceful fallback), metadata row shows author/date/readTime/category/tags, body renders headings/code-blocks/lists with dark-theme styling. Open a post URL directly (`http://localhost:5173/post/2026-04-09-modern-web-development`) to verify routing works.

- [X] T030 [US3] Create `site/src/app/pages/PostDetail.tsx` migrated and upgraded from `UI_UX/src/app/pages/PostDetail.tsx`:
  - Use `useParams<{ slug: string }>()` (not `id`) to match routes.tsx contract
  - Find post with `posts.find(p => p.id === slug)` from `../data/posts`
  - Replace the manual paragraph-by-paragraph render with `dangerouslySetInnerHTML={{ __html: post.contentHtml }}` (safe: sanitized at build time per research Decision 4)
  - Wrap the HTML render area with Tailwind `prose prose-invert prose-purple max-w-none` classes for full Markdown typography
  - Handle missing cover image: when `post.image === null`, hide the hero image section entirely, render a plain dark header band instead
  - Add code block styling: add `site/src/styles/index.css` prose overrides for `pre` and `code` elements (dark background `bg-zinc-800`, monospace font, rounded-lg, padding, horizontal scroll)
  - Retain: back navigation link, category badge, tags list, author/date/readTime metadata row

---

## Phase 6: User Story 4 — GitHub Actions Automated Deployment (P4)

**Purpose**: Validate the CI/CD pipeline end-to-end so every push to `main` produces a live deployment without manual steps.

**Independent test**: Push a commit to `main`, observe the Actions workflow succeed in GitHub UI, then verify the live site at `https://queen1052.github.io` shows the update.

- [X] T031 [US4] Verify `site/package-lock.json` is committed and up-to-date (run `npm install` inside `site/` after all package.json changes are finalised, commit the updated lock file)
- [X] T032 [US4] Create `site/scripts/generate_feeds.js` (not needed — removed from deploy.yml in T018) as a no-op stub (or remove the reference) — the `deploy.yml` step calling it has been removed in T018; ensure no dangling references to this file remain in `package.json` scripts
- [X] T033 [US4] Do a final local build verification: `cd site && npm ci && npm run build && ls dist/` — confirm all required files are present: `index.html`, `404.html` (copied by CI, not in dist yet), `assets/`, `robots.txt`, `sitemap.xml`, `feed.xml`, `.nojekyll`
- [ ] T034 [US4] Push the feature branch (requires user action) to `main` (or merge PR) and monitor the `deploy.yml` workflow run; confirm: workflow succeeds, `gh-pages` branch is updated, `https://queen1052.github.io` loads the new site, direct post URL deep-link works

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Mobile responsiveness, null-image handling, production path verification, and final quality checks.

- [X] T035 [P] Add responsive mobile sidebar to `site/src/app/pages/Home.tsx`: on viewport `< md`, hide the sidebar by default; show a hamburger/menu button (`☰`) in the top bar; clicking it toggles sidebar visibility with a slide-in animation using Tailwind `transition-transform`
- [X] T036 [P] Add `prose` typography CSS overrides in `site/src/styles/index.css` for dark-theme code blocks: `pre { @apply bg-zinc-800 rounded-lg p-4 overflow-x-auto; }`, `code { @apply font-mono text-sm; }`, `:not(pre) > code { @apply bg-zinc-800 px-1.5 py-0.5 rounded text-purple-300; }`
- [X] T037 [P] Add empty-state handling for zero posts in `Home.tsx`: when `posts` array is empty, render a centered message "아직 작성된 게시글이 없습니다" with a description encouraging the author to add their first `.md` file
- [ ] T038 Verify all asset paths (requires manual browser check) resolve correctly in the production build: run `npm run build && npm run preview`, open browser DevTools Network tab, navigate to home page and one post detail page, confirm zero 404 responses for CSS/JS/image assets
- [ ] T039 Verify SPA deep-link fallback (requires manual browser check): with the preview server running, manually copy `dist/index.html` to `dist/404.html`, then open `http://localhost:4173/post/2026-04-09-modern-web-development` directly in the browser — confirm the post renders correctly without a full page 404
- [X] T040 Final `deploy.yml` review: confirm `on: push: branches: [main]`, permissions block intact, `node-version: 20`, `npm ci` (not `npm install`), build step `cd site && npm run build`, 404 copy step `cp -a dist/index.html dist/404.html`, publish step with `publish_dir: ./site/dist` and `github_token: ${{ secrets.GITHUB_TOKEN }}`

---

## Dependencies (Story Completion Order)

```
Phase 1 (Setup) → Phase 2 (Plugin + Types) → Phase 3 (US1: Pipeline) ─┐
                                                                        ├→ Phase 4 (US2: Home UI)
                                                                        │   └→ Phase 5 (US3: PostDetail)
                                                                        └→ Phase 6 (US4: CI/CD)
                                                                              └→ Phase 7 (Polish)
```

- **Phase 2 blocks everything**: `posts.json` type contract and Vite plugin must compile before any React component
- **US1 (Phase 3) is MVP**: phases 3 alone delivers the authoring pipeline; add phases 4+5 for the full UI
- **US4 (Phase 6)** depends on T018 being merged, but most of its tasks are verification steps
- **Phase 7** tasks are independent of each other — all marked `[P]` can be done simultaneously

## Parallel Execution Opportunities

Within Phase 1: T005, T006, T007, T008 can all run in parallel (separate files).
Within Phase 2: T013 and T014 can start simultaneously; T015 and T016 depend on T013/T014.
Within Phase 4: T020, T021, T022 (styles) can run in parallel before T023 assembles them. T027 and T028 can run in parallel (separate components).
Within Phase 7: T035, T036, T037, T038, T039 are all independent.

## Implementation Strategy (MVP Scope)

**MVP = Phases 1 + 2 + 3 (T001–T019)**

After MVP, a new `.md` file in `site/posts/` produces a post in `posts.json` and the CI deploys it.
The home page and post detail are functional (using the SPA shell) but without full UI design.

**Full delivery = add Phases 4 + 5 + 6 + 7 (T020–T040)**

Full Dark Modern Blog design applied, mobile-responsive, all GitHub Pages edge cases handled.
