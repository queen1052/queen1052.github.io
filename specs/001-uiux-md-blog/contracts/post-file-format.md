# Contract: Post File Format

**Feature**: 001-uiux-md-blog
**Version**: 1.0.0
**Date**: 2026-04-09
**Audience**: Blog authors (site owners writing `.md` files)

---

## Overview

Every blog post is a Markdown file placed in `site/posts/`. The build pipeline reads these files
and publishes them as blog posts. All required fields must be present or the build will fail.

---

## File Location

```
site/posts/YYYY-MM-DD-slug.md
```

## File Name Rules

- **Must start with a date** in `YYYY-MM-DD` format
- **Slug portion**: lowercase letters, numbers, and hyphens only — no spaces or uppercase
- **Extension**: `.md`
- **Must be unique** within the `posts/` folder

**Valid examples**:
```
2026-04-09-modern-web-development.md
2026-04-07-clean-code-tips.md
2026-04-05-uiux-design-basics.md
```

**Invalid examples** (will be ignored or cause build failure):
```
new post.md           ← spaces in name
My-Post.md            ← uppercase, missing date prefix
2026-4-9-title.md     ← date not zero-padded
```

---

## Front-Matter Schema

Every post file MUST begin with a YAML front-matter block delimited by `---`.

### Required Fields

```yaml
---
title: "게시물 제목"          # string, non-empty
date: 2026-04-09            # date, YYYY-MM-DD format
category: "카테고리"         # string, single category label
tags: [태그1, 태그2, 태그3]  # list, at least one item
---
```

### Optional Fields

```yaml
---
excerpt: "카드에 표시될 요약 텍스트 (150자 이내 권장)"  # Defaults to first 150 chars of body
image: "https://example.com/cover.jpg"               # Or "/assets/img/my-image.jpg"
author: "홍길동"                                       # Defaults to "익명"
readTime: "5분"                                        # Defaults to auto-calculated value
---
```

### Complete Example

```markdown
---
title: "모던 웹 개발의 미래"
date: 2026-04-09
category: "개발"
tags: [React, TypeScript, 웹개발]
excerpt: "최신 웹 기술 트렌드와 함께 살펴보는 2026년 웹 개발의 방향성."
image: "https://images.unsplash.com/photo-1234567890"
author: "김개발"
readTime: "5분"
---

# 모던 웹 개발의 미래

본문 내용을 여기에 작성합니다.

## 소제목

단락 내용...

\`\`\`typescript
const hello = "world";
console.log(hello);
\`\`\`

- 항목 1
- 항목 2
```

---

## Supported Markdown Syntax (Body)

The post body supports **GitHub Flavored Markdown (GFM)**:

| Element | Syntax |
|---|---|
| Headings | `# H1`, `## H2`, `### H3`, etc. |
| Bold | `**bold**` |
| Italic | `*italic*` |
| Strikethrough | `~~text~~` |
| Unordered list | `- item` or `* item` |
| Ordered list | `1. item` |
| Code (inline) | `` `code` `` |
| Code block (fenced) | ` ```language ` ... ` ``` ` |
| Blockquote | `> text` |
| Link | `[text](url)` |
| Image | `![alt](url)` |
| Table | GFM pipe-table syntax |
| Horizontal rule | `---` |

---

## Validation Rules

The build pipeline enforces these rules at build time:

| Rule | On Failure |
|---|---|
| `title` is present and non-empty | **Build ERROR** — deployment blocked |
| `date` is present and parses as a valid date | **Build ERROR** — deployment blocked |
| `category` is present and non-empty | **Build ERROR** — deployment blocked |
| `tags` is present and at least one item | **Build ERROR** — deployment blocked |
| Filename follows `YYYY-MM-DD-slug.md` pattern | **Build WARNING** — file skipped |
| `image` URL is valid (if supplied) | **Build WARNING** — `image` set to `null` |

---

## Cover Image Guidelines

- **External URL**: Full HTTPS URL (e.g., Unsplash). Must be publicly accessible at deploy time.
- **Local file**: Place in `site/public/assets/img/` path. Reference as `/assets/img/name.jpg`.
  The file must be committed to the repository so Vite copies it to `dist/`.
- **No image**: Omit the `image` field. The UI will display the post card without a cover image.
