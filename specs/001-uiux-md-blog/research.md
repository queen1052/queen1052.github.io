# Research: UI_UX MD Blog on GitHub Pages

**Feature**: 001-uiux-md-blog
**Date**: 2026-04-09
**Status**: Complete — no NEEDS CLARIFICATION items remain

---

## Decision 1: Build-Time Markdown Pipeline Strategy

**Decision**: Use a custom Vite plugin (`scripts/vite-plugin-posts.mjs`) that runs in Node.js
during the `buildStart` hook. The plugin:
1. Scans all `*.md` files in `site/posts/`
2. Parses front-matter with `gray-matter`
3. Converts Markdown body to HTML with `marked` (GFM mode)
4. Sanitizes the generated HTML with `sanitize-html`
5. Auto-calculates `readTime` when not supplied in front-matter
6. Validates required fields (`title`, `date`) — throws a build error on missing fields
7. Writes the processed array to `site/src/generated/posts.json`
8. Also writes `dist/sitemap.xml` and `dist/feed.xml` via the `writeBundle` hook

**Rationale**: Generated JSON is bundled by Vite as a static ES module import. The React app
consumes it with zero runtime fetching. The output is pure static HTML/CSS/JS — no server
needed. The plugin is idempotent (same input → same output) satisfying Constitution P3.

**Alternatives considered**:
- `import.meta.glob('../posts/*.md', { query: '?raw', eager: true })` — Rejected: ships raw
  Markdown strings into the JS bundle and requires runtime parsing with `gray-matter` in the
  browser. `gray-matter` has limited browser support and increases bundle size.
- `vite-plugin-md` (third-party) — Rejected: designed for Markdown-as-Vue/React pages,
  not for a post-data pipeline. Too much magic, harder to debug.
- Pre-build shell script (`generate_feeds.js` pattern) — Rejected: requires a separate CI step
  before `npm run build`; the Vite plugin approach handles it in one `npm run build` invocation,
  simplifying `deploy.yml`.

---

## Decision 2: GitHub Pages SPA Routing

**Decision**: Use `createBrowserRouter` from `react-router` with Vite `base: '/'`. The CI
workflow copies `dist/index.html` to `dist/404.html`. When GitHub Pages serves a direct URL
like `/post/my-post` and no matching file exists, it falls back to `404.html` (the SPA shell),
which boots React and the router resolves `/post/my-post` correctly.

**Rationale**: Clean URLs (no `#` hash) that are shareable and SEO-addressable. The 404.html
trick is the standard, well-tested pattern for GitHub Pages SPAs. The site is deployed at the
apex domain (`https://queen1052.github.io`) with no sub-path, so `base: '/'` is correct.

**Alternatives considered**:
- `createHashRouter` — Rejected: produces `/#/post/slug` URLs which are less clean and
  non-standard. Hash routing also means web crawlers may not index individual posts.
- Sub-path deployment (e.g., `/blog/`) — Not applicable. The site is at the apex ` /`.
- `@vitejs/plugin-legacy` + server-side 404 config — Not applicable. GitHub Pages cannot be
  configured with custom server redirects.

---

## Decision 3: Markdown Renderer

**Decision**: `marked` v12 with `{ gfm: true, breaks: false }` options.

**Rationale**: Well-maintained, fast, runs perfectly in Node.js at build time. GFM mode
supports fenced code blocks, tables, strikethrough — all common blog content. The output
is standard HTML that Tailwind's `prose` class styles correctly.

**Alternatives considered**:
- `remark` + `rehype` pipeline — Rejected: powerful but significantly more complex for a
  personal blog. Remark/rehype requires multiple packages and plugin configuration.
- `markdown-it` — Viable alternative; marked chosen for its simpler API and lower bundle
  impact if ever needed at runtime.

---

## Decision 4: XSS Sanitization Strategy

**Decision**: Sanitize at build time in the Vite plugin using `sanitize-html` (Node.js).
The JSON stored in `posts.json` contains pre-sanitized HTML. The React component renders it
with `dangerouslySetInnerHTML={{ __html: post.contentHtml }}`.

**Rationale**: Content authors are the site owners (trusted source). `sanitize-html` at build
time provides defence-in-depth with zero runtime cost. Sanitized HTML in the static bundle
is safe to render directly. No browser-side `DOMPurify` needed (reduces bundle size ~30KB).

**Alternatives considered**:
- `DOMPurify` at React render time — Rejected: adds ~30KB to browser bundle, runs on every
  render, and is unnecessary when content is already sanitized at build time.
- No sanitization — Rejected: violates FR-007 and the OWASP XSS prevention requirement even
  for trusted content.

---

## Decision 5: Slug Generation

**Decision**: The slug is derived from the filename: `YYYY-MM-DD-title-with-hyphens.md`
→ slug = `YYYY-MM-DD-title-with-hyphens`. The post URL becomes `/post/YYYY-MM-DD-title-with-hyphens`.

**Rationale**: The filename IS the slug — no additional metadata needed. This convention
matches Jekyll's standard post naming and is familiar to blog authors. It also means two posts
cannot accidentally have the same URL (filenames must be unique).

---

## Decision 6: Auto Read-Time Calculation

**Decision**: When `readTime` is not present in front-matter, calculate as:
`Math.ceil(rawMarkdownBody.split(/\s+/).filter(Boolean).length / 200)` minutes.
Supply as `${n}분` (Korean: "N minutes").

**Rationale**: 200 WPM is the standard reading speed used by Medium and most blog platforms.
Counting words from the raw Markdown body (before HTML conversion) avoids counting HTML tags.

---

## Decision 7: `deploy.yml` Changes

**Decision**: Remove the standalone `Generate sitemap & RSS` step from `deploy.yml`. The Vite
plugin's `writeBundle` hook generates `dist/sitemap.xml` and `dist/feed.xml` during
`npm run build`. The workflow simplifies to: `npm ci` → `npm run build` → copy 404 → deploy.

**Rationale**: Fewer CI steps means fewer failure points. Integrating feed generation into the
build guarantees that feeds always reflect the exact same posts as the deployed site.

---

## Decision 8: Existing `site/` Directory

**Decision**: Replace the current `site/` content (Jekyll/Chirpy era files: `.gitattributes`,
`.nojekyll`, `gulpfile.js/`, `_javascript/`, `ragflow/`, `skills/`, `tools/`, etc.) with the
new Vite+React SPA structure. Preserve `site/package-lock.json` by regenerating after adding
new dependencies.

**Rationale**: The `deploy.yml` contract is `cd site && npm ci && npm run build → publish dist`.
The `site/` directory IS the build root. Replacing its contents (not the workflow contract)
is the minimal-change approach.

**Note on `site/.nojekyll`**: A `.nojekyll` file MUST exist in `site/public/` so it gets
copied to `dist/` and then to `gh-pages`. This prevents GitHub Pages from trying to process
the deployed files as a Jekyll site, which would break JavaScript filenames containing `_`.

---

## Summary of All NEEDS CLARIFICATION Items

| Item | Status | Resolution |
|---|---|---|
| MD → posts pipeline approach | ✅ Resolved | Vite plugin, build-time, outputs posts.json |
| GitHub Pages SPA routing | ✅ Resolved | BrowserRouter + 404.html copy |
| Markdown parser | ✅ Resolved | `marked` v12 with GFM |
| XSS sanitization | ✅ Resolved | `sanitize-html` at build time |
| Slug generation | ✅ Resolved | Derived from filename |
| Auto read time | ✅ Resolved | 200 WPM formula |
| CI workflow changes | ✅ Resolved | Remove separate feeds step |
| Existing site/ contents | ✅ Resolved | Replace with Vite+React SPA |
