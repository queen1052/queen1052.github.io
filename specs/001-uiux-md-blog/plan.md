# Implementation Plan: UI_UX Design Integration with MD-driven Blog on GitHub Pages

**Branch**: `001-uiux-md-blog` | **Date**: 2026-04-09 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `specs/001-uiux-md-blog/spec.md`

## Summary

Replace the current `site/` directory (Jekyll/Chirpy legacy) with a production-ready Vite + React
SPA that applies the Dark Modern Blog design from `UI_UX/`. Blog posts authored as Markdown files
in `site/posts/` are processed at build time by a custom Vite plugin into a static `posts.json`,
eliminating any server-side runtime. GitHub Actions deploys the site to GitHub Pages on every push
to `main`. All post URLs are deep-linkable via the standard `404.html` SPA fallback.

## Technical Context

**Language/Version**: TypeScript 5 / Node.js 20 (LTS, pinned in CI)
**Primary Dependencies**:
- React 18, React Router 7 (`createBrowserRouter`) — SPA framework, routing
- Vite 6 + `@vitejs/plugin-react` — build tooling, dev server
- Tailwind CSS 4 + `@tailwindcss/vite` — utility-first styling
- `gray-matter` — front-matter YAML parsing (build-time, Node.js)
- `marked` v12 — Markdown → HTML conversion (build-time, Node.js)
- `sanitize-html` — HTML XSS sanitization (build-time, Node.js)
- `lucide-react` — icon library (already in UI_UX)
- `peaceiris/actions-gh-pages@v3` — GitHub Actions deployment (already in deploy.yml)

**Storage**: `site/posts/*.md` (source) → `site/src/generated/posts.json` (build artifact,
committed `.gitignore`-excluded; regenerated on every build)

**Testing**: Manual browser testing (local `npm run dev` and `npm run preview`) + CI build
validation (failing CI = no deployment). No automated unit/integration tests in scope.

**Target Platform**: GitHub Pages (static CDN, no server runtime). Modern browsers:
Chrome 120+, Firefox 120+, Safari 17+, Edge 120+. Mobile: iOS Safari 16+, Chrome Android.

**Project Type**: Static SPA (Single Page Application on static hosting)

**Performance Goals**:
- First Contentful Paint < 2s on a 4G connection
- Total JS bundle size < 300KB gzipped
- Build completes in < 60s in CI

**Constraints**:
- Zero server runtime — all output MUST be static files
- Vite `base: '/'` — site deployed at apex domain, no sub-path
- `package-lock.json` MUST be committed — CI uses `npm ci`
- `404.html` MUST be created by CI as a copy of `index.html`
- `.nojekyll` MUST be in the published `dist/` root

**Scale/Scope**: Personal blog, ~10–500 posts, single author, single language (Korean)

---

## Constitution Check

*GATE: Evaluated before Phase 0 research and re-validated after Phase 1 design.*

| Principle | Assessment | Evidence |
|---|---|---|
| **P1 — Static-First Output** | ✅ PASS | All output from `npm run build` is static HTML/CSS/JS in `site/dist/`. No server runtime. `posts.json` is bundled into the JS at build time. |
| **P2 — GitHub Pages Compatibility** | ✅ PASS | `dist/404.html` = copy of `index.html` (CI step preserved). `robots.txt` in `site/public/`. `.nojekyll` in `site/public/`. No Jekyll plugins. `gh-pages` branch published via `peaceiris/actions-gh-pages`. |
| **P3 — Deterministic Builds** | ✅ PASS | `npm ci` in CI. `package-lock.json` committed. Node 20 pinned in workflow. Vite plugin is idempotent (same MD files → same `posts.json`). |
| **P4 — Correct Base URL** | ✅ PASS | Vite `base: '/'`. No hardcoded `localhost`. `sitemap.xml` and `feed.xml` generated with absolute `https://queen1052.github.io` URLs. Asset filenames use Vite content hashing. |
| **P5 — Automated CD** | ✅ PASS | `deploy.yml` triggers on push to `main`. Steps: `npm ci` → `npm run build` → `cp 404.html` → `peaceiris/actions-gh-pages`. Build failure blocks deployment. |
| **P6 — Content Integrity** | ✅ PASS | Post files follow `YYYY-MM-DD-slug.md` naming. Required front-matter enforced by Vite plugin (build fails on missing `title` or `date`). Theme is applied from `UI_UX/src/` (no in-place modification). |

**All 6 principles: PASS. Gate cleared.**

*Post-design re-check*: No principle violations introduced by Phase 1 design decisions.
All contracts and data model decisions reinforce static-first, reproducible, and path-correct
requirements. No complexity justification table needed.

---

## Project Structure

### Documentation (this feature)

```text
specs/001-uiux-md-blog/
├── plan.md                          # This file
├── research.md                      # Phase 0: Architecture decisions
├── data-model.md                    # Phase 1: BlogPost entity, PostFrontMatter schema
├── quickstart.md                    # Phase 1: Author + developer guide
├── contracts/
│   ├── post-file-format.md          # Phase 1: .md file front-matter contract
│   ├── url-schema.md                # Phase 1: Route and static asset URL contract
│   └── posts-data-schema.md         # Phase 1: Generated posts.json TypeScript/JSON schema
└── checklists/
    └── requirements.md              # Spec quality validation
```

### Source Code Layout

```text
# Production codebase root: site/
# Build output: site/dist/ → published to gh-pages branch

site/
├── package.json              # Updated: gray-matter, marked, sanitize-html + react/vite/tailwind
├── package-lock.json         # Committed. CI uses npm ci.
├── vite.config.ts            # base:'/', postsPlugin(), react(), tailwindcss()
├── tsconfig.json             # strict: true, paths alias @ → src/
├── postcss.config.mjs        # Tailwind CSS 4 postcss config
├── index.html                # SPA entrypoint (single <div id="root">)
│
├── public/                   # Copied as-is to dist/ by Vite
│   ├── .nojekyll             # Prevents GitHub Pages from running Jekyll on gh-pages
│   ├── robots.txt            # User-agent: *, Allow: /, Sitemap: https://queen1052.github.io/sitemap.xml
│   └── assets/
│       └── img/              # Local cover images (referenced as /assets/img/*.jpg)
│
├── posts/                    # AUTHOR-WRITTEN MARKDOWN BLOG POSTS
│   └── YYYY-MM-DD-slug.md    # Front-matter + Markdown body (see contracts/post-file-format.md)
│
├── scripts/
│   └── vite-plugin-posts.mjs # Build-time plugin: posts/*.md → src/generated/posts.json
│                             #   + dist/sitemap.xml + dist/feed.xml
│
└── src/
    ├── main.tsx              # createRoot(<App />) — entry point
    ├── generated/
    │   └── posts.json        # BUILD ARTIFACT — do not edit manually. Gitignored if desired.
    ├── app/
    │   ├── App.tsx           # <RouterProvider router={router} />
    │   ├── routes.tsx        # createBrowserRouter: / → Home, /post/:slug → PostDetail
    │   ├── components/
    │   │   ├── BlogCard.tsx  # Post card (migrated from UI_UX, uses BlogPost from posts.ts)
    │   │   └── Sidebar.tsx   # Category+tag sidebar (migrated from UI_UX)
    │   ├── pages/
    │   │   ├── Home.tsx      # Post list + Sidebar (migrated from UI_UX)
    │   │   └── PostDetail.tsx # Full post: hero image + metadata + dangerouslySetInnerHTML
    │   └── data/
    │       ├── posts.ts      # Import posts.json, export posts[], categories[], allTags[]
    │       └── types.ts      # BlogPost TypeScript interface (matches posts-data-schema.md)
    └── styles/
        ├── index.css         # Imports fonts.css, tailwind.css, theme.css
        ├── fonts.css         # Font face declarations (migrated from UI_UX)
        ├── tailwind.css      # Tailwind CSS 4 @import
        └── theme.css         # CSS custom properties (migrated from UI_UX)
```

### GitHub Actions (CI/CD)

```text
.github/
└── workflows/
    └── deploy.yml            # Updated: remove separate "Generate feeds" step
                              # Steps: checkout → setup-node 20 → npm ci → npm run build
                              #        → cp index.html 404.html → peaceiris deploy
```

---

## Complexity Tracking

> No constitution violations in this design. Table not required.
