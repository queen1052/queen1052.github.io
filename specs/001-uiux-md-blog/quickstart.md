# Quickstart: UI_UX MD Blog on GitHub Pages

**Feature**: 001-uiux-md-blog
**Date**: 2026-04-09

---

## Prerequisites

- Node.js 20+ (`node --version`)
- npm 10+ (`npm --version`)
- Git

---

## 1. Install Dependencies

```bash
cd site
npm ci
```

> Always use `npm ci` (not `npm install`) to ensure exact reproducibility with the committed
> `package-lock.json`.

---

## 2. Run the Development Server

```bash
cd site
npm run dev
```

Opens at `http://localhost:5173`. Hot-reload is enabled for both source code and post files.

> **Note**: The Vite plugin regenerates `src/generated/posts.json` on every dev server start
> and on hot-reload when a `.md` file in `site/posts/` changes.

---

## 3. Write a New Blog Post

1. Create a new file in `site/posts/` following the naming convention:

   ```
   site/posts/YYYY-MM-DD-your-post-slug.md
   ```

2. Add the required front-matter at the top of the file:

   ```markdown
   ---
   title: "게시물 제목"
   date: 2026-04-09
   category: "개발"
   tags: [React, TypeScript]
   ---

   # 게시물 제목

   본문을 여기에 작성합니다.
   ```

3. Save the file. The dev server hot-reloads and the post appears on the home page.

See [contracts/post-file-format.md](./contracts/post-file-format.md) for the full schema with
all optional fields and validation rules.

---

## 4. Build for Production

```bash
cd site
npm run build
```

This runs the Vite plugin which:
- Validates all `site/posts/*.md` files (fails on missing `title` or `date`)
- Generates `site/src/generated/posts.json`
- Builds the React app → outputs to `site/dist/`
- Generates `site/dist/sitemap.xml` and `site/dist/feed.xml`

Verify the output:

```bash
ls site/dist/
# Should contain: index.html, assets/, robots.txt, sitemap.xml, feed.xml, .nojekyll
```

---

## 5. Test the Production Build Locally

```bash
cd site
npm run preview
```

Opens at `http://localhost:4173`. Tests the exact same bundle that will be deployed.

To test SPA deep-linking (simulates GitHub Pages 404 fallback):

```bash
cp site/dist/index.html site/dist/404.html
# Then open http://localhost:4173/post/your-slug directly
```

---

## 6. Deploy to GitHub Pages

Push to `main`:

```bash
git add .
git commit -m "feat: add new post - your-post-title"
git push origin main
```

GitHub Actions (`deploy.yml`) automatically:
1. Runs `npm ci` in `site/`
2. Runs `npm run build` (validates + builds)
3. Copies `dist/index.html` → `dist/404.html`
4. Publishes `site/dist/` to the `gh-pages` branch via `peaceiris/actions-gh-pages`

Monitor progress at: `https://github.com/queen1052/queen1052.github.io/actions`

Live site updates at: `https://queen1052.github.io`

---

## 7. Verify Deployment

After the Actions workflow succeeds (typically 2–3 minutes):

1. Open `https://queen1052.github.io` — home page loads with your new post card
2. Click the post card — full post renders with formatted Markdown
3. Open `https://queen1052.github.io/post/your-post-slug` directly — SPA deep-link works
4. Check `https://queen1052.github.io/sitemap.xml` — post appears in sitemap
5. Verify all assets return HTTP 200 (no 404s in browser DevTools Network tab)

---

## Troubleshooting

| Problem | Cause | Fix |
|---|---|---|
| Build fails with "Missing required field: title" | A `.md` file is missing `title:` in front-matter | Add `title:` to the file |
| Post not showing on home page | File not in `site/posts/` or filename missing date prefix | Move file and rename correctly |
| Assets return 404 on live site | `base` not set to `/` in `vite.config.ts` | Verify `base: '/'` in vite config |
| Direct URL shows GitHub 404 | `404.html` missing in `dist/` | Check CI step `cp dist/index.html dist/404.html` |
| Styles missing after deploy | CSS file not in `dist/assets/` | Run `npm run build` locally and check `dist/` |
| `npm ci` fails in CI | `package-lock.json` out of sync | Run `npm install` locally, commit updated lock file |
