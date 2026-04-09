# Data Model: UI_UX MD Blog

**Feature**: 001-uiux-md-blog
**Date**: 2026-04-09
**Source**: specs/001-uiux-md-blog/spec.md (FR-001–FR-003, Key Entities section)

---

## Entities

### PostFrontMatter

Represents the author-supplied metadata parsed from a Markdown file's YAML front-matter block.
This is the **source schema** — what an author writes.

| Field | Type | Required | Description |
|---|---|---|---|
| `title` | `string` | **YES** | Display title of the post. Build fails if absent. |
| `date` | `string` | **YES** | Publication date in ISO 8601 format (`YYYY-MM-DD`). Build fails if absent or unparseable. |
| `category` | `string` | **YES** | Single category label (e.g., `"개발"`, `"디자인"`). Used for sidebar filtering. |
| `tags` | `string[]` | **YES** | Array of tag strings (e.g., `["React", "TypeScript"]`). At least one tag required. |
| `excerpt` | `string` | no | Short description for the post card. If absent, auto-derived from first 150 chars of body. |
| `image` | `string` | no | Cover image URL (external) or path relative to `public/` (e.g., `/assets/img/cover.jpg`). |
| `author` | `string` | no | Display name. Defaults to `"익명"` (Anonymous) if absent. |
| `readTime` | `string` | no | Override for the read time badge (e.g., `"5분"`). Auto-calculated from word count if absent. |

**Validation rules**:
- `title`: non-empty string after trimming.
- `date`: parseable by `new Date(date)` and must produce a valid date (not `Invalid Date`).
- `category`: non-empty string after trimming.
- `tags`: non-empty array; each element is a non-empty string.
- `image`: if supplied, must be a valid URL starting with `http://`, `https://`, or `/`.

---

### BlogPost

Represents a fully processed, publish-ready post. This is the **generated schema** — what the
React application consumes at runtime. Produced by the Vite plugin from `PostFrontMatter` + the
Markdown body.

| Field | Type | Source | Description |
|---|---|---|---|
| `id` | `string` | filename (auto) | URL-safe slug derived from the filename without extension. E.g., `2026-04-09-my-post`. |
| `title` | `string` | front-matter | Post display title. |
| `date` | `string` | front-matter | `YYYY-MM-DD` string as authored. |
| `category` | `string` | front-matter | Category label. |
| `tags` | `string[]` | front-matter | Array of tag strings. |
| `excerpt` | `string` | front-matter or auto | Short description ≤150 chars, stripped of Markdown. |
| `image` | `string \| null` | front-matter | Cover image URL/path or `null` if not supplied. |
| `author` | `string` | front-matter or default | Author display name. Default: `"익명"`. |
| `readTime` | `string` | front-matter or auto | Read time badge string (e.g., `"5분"`). |
| `contentHtml` | `string` | Markdown body | Post body converted from Markdown to sanitized HTML. |

**Derivation rules**:
- `id`: `path.basename(filename, '.md')` — strips the `.md` extension from the filename.
- `excerpt`: if not in front-matter, take the first 150 characters of the raw Markdown body
  (stripped of front-matter) with Markdown syntax removed (headings `#`, bold `**`, etc.),
  append `…` if truncated.
- `readTime`: if not in front-matter, `Math.ceil(wordCount / 200)` where `wordCount` is
  `rawBody.split(/\s+/).filter(Boolean).length`. Format as `"${n}분"`.
- `contentHtml`: `sanitize-html(marked.parse(rawBody, { gfm: true, breaks: false }))`.

---

### Category (derived)

Not stored separately. Derived in the React app at runtime:

```ts
const categories = ['전체', ...new Set(posts.map(p => p.category))].sort()
```

Filtering by `'전체'` shows all posts.

---

### Tag (derived)

Not stored separately. Derived in the React app at runtime:

```ts
const allTags = [...new Set(posts.flatMap(p => p.tags))].sort()
```

---

## File Naming Convention

Post filenames follow the pattern: **`YYYY-MM-DD-slug-with-hyphens.md`**

| Constraint | Rule |
|---|---|
| Date component | Must match YYYY-MM-DD (4-2-2 digits) |
| Slug component | URL-safe: lowercase letters, numbers, hyphens only |
| Extension | Must be `.md` |
| Uniqueness | Filename must be unique within `site/posts/` (case-insensitive) |

**Examples**:
- `2026-04-09-modern-web-development.md`
- `2026-04-07-clean-code-tips.md`

Non-conforming filenames (missing date prefix, spaces, uppercase) emit a build warning but do
not fail the build, to allow draft files or notes. Only files with valid date prefixes are
published.

---

## State Transitions

Posts have a single implicit lifecycle:

```
[MD file created in site/posts/] → [Built by Vite plugin] → [Included in posts.json] → [Live on site]
```

There is no draft/published state separator in this version (all valid `.md` files in `posts/`
are published). Future versions may add a `draft: true` front-matter flag.

---

## Sorting

Posts in `posts.json` are sorted by `date` descending (newest first) by the Vite plugin at
build time. No runtime sorting required.
