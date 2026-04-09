# Feature Specification: UI_UX Design Integration with MD-driven Blog on GitHub Pages

**Feature Branch**: `001-uiux-md-blog`
**Created**: 2026-04-09
**Status**: Draft
**Input**: User description: "현재 프로젝트 UI_UX 폴더의 디자인을 적용해줘. 사용자가 md 파일을 작성하면 md 파일이 게시물이 되도록 해줘. github pages에서 완벽하게 동작해야해. Actions로 자동 배포가 정상적으로 되어야 해."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Author Publishes a Post by Writing an MD File (Priority: P1)

An author (site owner) creates a new Markdown file in the designated posts folder, writes the post
content with basic front-matter (title, date, category, tags), commits, and pushes to `main`. Within
a few minutes, the new post appears on the live site at `https://queen1052.github.io` with no manual
build steps.

**Why this priority**: This is the entire authoring workflow. Without this, the content pipeline does
not exist and every other story has nothing to display.

**Independent Test**: Author creates a single `.md` file with minimal front-matter, pushes to
`main`, waits for GitHub Actions to succeed, and verifies the post card appears on the home page.

**Acceptance Scenarios**:

1. **Given** a new `.md` file is placed in the posts folder with required front-matter (title, date,
   category, tags), **When** the file is pushed to `main`, **Then** GitHub Actions builds and
   deploys the site, and the new post is visible on the live blog within 5 minutes.
2. **Given** an existing post `.md` file is edited, **When** the change is pushed to `main`,
   **Then** the updated content is reflected on the live site after the next successful deployment.
3. **Given** a `.md` file is missing the `title` front-matter field, **When** the build runs,
   **Then** the build fails with a clear error message indicating the missing field (no silent
   data corruption).

---

### User Story 2 - Visitor Browses Posts with Dark Modern Blog Design (Priority: P2)

A visitor opens the blog URL and sees the Dark Modern Blog layout: a left sidebar showing
categories and tags for filtering, a main content area with a card grid of recent posts, each card
showing the post title, excerpt, category badge, tags, date, read time, and cover image.

**Why this priority**: Visual presentation is the primary user-facing deliverable. The UI_UX design
must be applied exactly as designed — dark zinc background, purple accent, sidebar navigation.

**Independent Test**: A visitor opens the site and can filter the post list by category or tag
without any page reloads, and the correct subset of cards is shown.

**Acceptance Scenarios**:

1. **Given** a visitor opens `https://queen1052.github.io`, **When** the page loads, **Then** the
   Dark Modern Blog design is displayed: `zinc-950` dark background, purple (`#7c3aed`) accent,
   left sidebar with category and tag filters, and post cards in a responsive grid.
2. **Given** the sidebar lists all categories derived from published post front-matter, **When** a
   visitor clicks a category, **Then** only posts in that category are displayed in the main area.
3. **Given** the sidebar lists all tags derived from published posts, **When** a visitor clicks a
   tag, **Then** only posts containing that tag are shown.
4. **Given** no posts match the selected category/tag combination, **When** the filter is applied,
   **Then** a "no posts" message is displayed instead of an empty grid.
5. **Given** the blog is viewed on a mobile device, **When** the page renders, **Then** the layout
   adapts responsively — sidebar collapses or is accessible via a toggle, cards stack vertically.

---

### User Story 3 - Visitor Reads a Full Post (Priority: P3)

A visitor clicks a blog post card and is taken to the individual post detail page. The post content,
written in Markdown, is rendered as formatted HTML — headings, lists, code blocks, bold/italic text,
and images are all displayed correctly with the Dark Modern Blog styling.

**Why this priority**: Post detail is the destination that drives the core value of the blog.
Without readable post content, the site has no purpose.

**Independent Test**: A visitor opens a post that contains headings, a code block, a list, and an
image, and all elements render visually correct in the dark theme.

**Acceptance Scenarios**:

1. **Given** a visitor clicks a post card, **When** the detail page loads**, Then** the full post
   content is displayed with the hero image at the top, post metadata (author, date, read time,
   category, tags) and the Markdown body rendered as styled HTML below it.
2. **Given** the post body contains a code block, **When** it is rendered, **Then** the code block
   is displayed with a monospace font and syntax-distinguishable styling (dark background, visible
   borders or highlighting).
3. **Given** the detail page URL is opened directly (e.g., pasted into a browser), **When** the
   page loads via the `404.html` → SPA redirect mechanism, **Then** the correct post is displayed
   without requiring navigation from the home page.
4. **Given** a visitor clicks the "back" button on the post detail page, **When** they navigate,
   **Then** they are returned to the post list.

---

### User Story 4 - GitHub Actions Automatically Deploys on Every Push (Priority: P4)

Every time the author pushes code or content to the `main` branch, GitHub Actions automatically
builds the site and deploys it to GitHub Pages — no manual steps required.

**Why this priority**: Without automated deployment, the author cannot rely on the authoring
workflow described in US1. Manual deployments are error-prone and undermine the "write an MD →
see it live" promise.

**Independent Test**: Push a commit to `main`, observe the Actions tab in GitHub showing the
workflow runs to completion, then navigate to the live site and confirm the change is visible.

**Acceptance Scenarios**:

1. **Given** a push is made to the `main` branch, **When** GitHub Actions triggers, **Then** the
   `deploy.yml` workflow runs: installs dependencies, generates feeds, builds the site, and publishes
   to the `gh-pages` branch — all without manual intervention.
2. **Given** the workflow completes successfully, **When** a visitor opens the site, **Then** the
   deployed content matches the latest pushed content.
3. **Given** the build fails (e.g., an MD file has a malformed front-matter), **When** the workflow
   runs, **Then** the workflow exits with an error, the `gh-pages` branch is NOT updated (previous
   version stays live), and the failure is visible in the GitHub Actions log.
4. **Given** the `gh-pages` branch is published by GitHub Pages, **When** a visitor navigates to
   any valid post URL directly, **Then** the `404.html` fallback serves the SPA shell and the
   React router resolves the correct post — no white screen or GitHub 404 page.

---

### Edge Cases

- What happens when an MD post file has no cover image specified? The post card and detail page
  must display gracefully — either a placeholder or the image field may be omitted.
- What happens when there are zero published posts? The home page must show an empty-state message
  rather than a broken layout.
- What happens when the site is accessed via a URL path that doesn't match any route (unknown slug)?
  The SPA must display a user-friendly "Post not found" view and provide a link back to the home page.
- What happens if a post's MD content contains raw HTML? It must be sanitized to prevent
  cross-site scripting (XSS) vulnerabilities in the rendered output.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The site MUST source all blog post data from Markdown files placed in a designated
  posts folder in the repository; mock or hardcoded post data MUST NOT appear in the production site.
- **FR-002**: Each post Markdown file MUST support the following front-matter fields: `title`
  (required), `date` (required, ISO 8601: `YYYY-MM-DD`), `category` (required), `tags` (required,
  list), `excerpt` (optional), `image` (optional cover image URL or path), `author` (optional),
  `readTime` (optional).
- **FR-003**: The build process MUST transform all valid Markdown post files into a data structure
  (available at build time) that the React application can consume at runtime without requiring a
  server.
- **FR-004**: The home page MUST render the Dark Modern Blog UI design as specified in `UI_UX/`: dark
  zinc-950 background, purple-600 accent color, left sidebar with category and tag navigation, main
  area with a responsive card grid.
- **FR-005**: The sidebar MUST dynamically populate categories and tags from the actual published
  posts — categories and tags are NOT hardcoded.
- **FR-006**: The post detail page MUST render the full Markdown body as formatted HTML with support
  for: headings (h1–h6), paragraphs, bold/italic, ordered/unordered lists, code blocks (inline and
  fenced), blockquotes, images, and links.
- **FR-007**: Markdown body content rendered in the post detail page MUST be sanitized against XSS
  before display.
- **FR-008**: The site MUST function as a Single Page Application (SPA) on GitHub Pages, with a
  `404.html` fallback that loads the SPA shell so all post URLs are deep-linkable.
- **FR-009**: The `robots.txt` file MUST be present at the root of the deployed output and correctly
  reference the site's canonical URL.
- **FR-010**: The GitHub Actions `deploy.yml` workflow MUST complete without manual intervention on
  every push to `main` and MUST NOT update `gh-pages` if the build step fails.
- **FR-011**: All internal asset URLs (CSS, JS, images) MUST resolve correctly under
  `https://queen1052.github.io` — no `localhost` references or broken relative paths in production.
- **FR-012**: The build MUST fail with a clear error message when a required front-matter field
  (`title` or `date`) is missing from a post file.

### Key Entities

- **BlogPost**: Represents a single published post. Key attributes: `id` (slug derived from filename),
  `title`, `date`, `category`, `tags[]`, `excerpt`, `image`, `author`, `readTime`, `content`
  (Markdown body as string).
- **Category**: A named grouping of posts. Derived dynamically from all post `category` values at
  build time.
- **Tag**: A label attached to one or more posts. Derived dynamically from all post `tags` arrays at
  build time.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: An author can publish a new post by writing a single `.md` file and pushing it to
  `main` — the post appears live within 5 minutes of push with zero additional manual steps.
- **SC-002**: 100% of blog post URLs are accessible via direct link on GitHub Pages without
  displaying the GitHub 404 error page (SPA redirect correctly handled).
- **SC-003**: All assets (styles, scripts, images) on the deployed site load with HTTP 200 status
  under `https://queen1052.github.io` — zero 404s attributable to incorrect base paths.
- **SC-004**: The GitHub Actions workflow succeeds on every push that contains well-formed MD files
  and fails fast (with visible error) on pushes that contain invalid post files.
- **SC-005**: The Dark Modern Blog UI design is applied: home page and post detail page visually
  match the UI_UX prototype (dark background, purple accent, sidebar layout, card grid).
- **SC-006**: Post body Markdown content renders correctly: a post containing headings, a code
  block, a list, and an image displays all elements formatted and readable in the dark theme.
- **SC-007**: The site layout is usable on screen widths from 375px (mobile) to 1440px (desktop).

## Assumptions

- The author (site owner) has write access to the `main` branch of the repository.
- Cover images for posts may be external URLs (e.g., Unsplash) or paths to committed files in
  `assets/img/`. Both are supported; no image upload interface is needed.
- The `site/` subdirectory is the build root for the SPA; post Markdown files will be placed in a
  `site/posts/` (or equivalent) directory within it.
- The `deploy.yml` workflow already has the correct GitHub Actions permissions (`contents: write`,
  `pages: write`, `id-token: write`) and the `gh-pages` branch is already configured as the
  GitHub Pages source in repository settings.
- The existing `UI_UX/` folder components (Sidebar, BlogCard, PostDetail, Home, routing) are the
  reference implementation and will be migrated into `site/src/` as the production codebase.
- The Vite `base` config for production MUST be set to `/` (root) since the site is deployed at the
  apex of `https://queen1052.github.io` with no sub-path.
- `read-time` for posts without an explicit `readTime` front-matter field will be auto-calculated
  based on word count (approximately 200 words per minute).
- No search, comment system, or authentication is in scope for this feature.
