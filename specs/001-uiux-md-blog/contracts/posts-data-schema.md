# Contract: Generated Posts Data Schema

**Feature**: 001-uiux-md-blog
**Version**: 1.0.0
**Date**: 2026-04-09
**Audience**: React app implementors, Vite plugin implementors

---

## Overview

The Vite plugin generates `site/src/generated/posts.json` at build time. This file is the sole
data contract between the build pipeline and the React app. It MUST NOT be edited manually — it
is regenerated on every build.

---

## TypeScript Interface

```typescript
export interface BlogPost {
  id: string;           // Slug: filename without .md extension
  title: string;        // Post title
  date: string;         // Publication date: "YYYY-MM-DD"
  category: string;     // Single category label
  tags: string[];       // Array of tag strings, at least one
  excerpt: string;      // Short description ≤ 200 chars
  image: string | null; // Cover image URL/path, or null
  author: string;       // Author display name
  readTime: string;     // Read time badge, e.g., "5분"
  contentHtml: string;  // Post body as sanitized HTML
}

export type PostsData = BlogPost[];
```

---

## JSON Schema

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "type": "array",
  "items": {
    "type": "object",
    "required": ["id", "title", "date", "category", "tags", "excerpt", "image", "author", "readTime", "contentHtml"],
    "properties": {
      "id":          { "type": "string", "pattern": "^[0-9]{4}-[0-9]{2}-[0-9]{2}-.+$" },
      "title":       { "type": "string", "minLength": 1 },
      "date":        { "type": "string", "pattern": "^[0-9]{4}-[0-9]{2}-[0-9]{2}$" },
      "category":    { "type": "string", "minLength": 1 },
      "tags":        { "type": "array", "items": { "type": "string" }, "minItems": 1 },
      "excerpt":     { "type": "string" },
      "image":       { "type": ["string", "null"] },
      "author":      { "type": "string", "minLength": 1 },
      "readTime":    { "type": "string", "minLength": 1 },
      "contentHtml": { "type": "string" }
    },
    "additionalProperties": false
  }
}
```

---

## Ordering

Posts are sorted by `date` **descending** (newest first). The React app relies on this ordering
for display — no runtime re-sorting is required.

---

## Example

```json
[
  {
    "id": "2026-04-09-modern-web-development",
    "title": "모던 웹 개발의 미래",
    "date": "2026-04-09",
    "category": "개발",
    "tags": ["React", "TypeScript", "웹개발"],
    "excerpt": "최신 웹 기술 트렌드와 함께 살펴보는 2026년 웹 개발의 방향성.",
    "image": "https://images.unsplash.com/photo-1764183297925....",
    "author": "김개발",
    "readTime": "5분",
    "contentHtml": "<h1>모던 웹 개발의 미래</h1><p>웹 개발은 매년...</p>"
  },
  {
    "id": "2026-04-07-clean-code-tips",
    "title": "효율적인 코드 작성 방법",
    "date": "2026-04-07",
    "category": "개발",
    "tags": ["클린코드", "베스트프랙티스"],
    "excerpt": "클린 코드 원칙과 함께하는 실전 코딩 팁.",
    "image": null,
    "author": "박코더",
    "readTime": "7분",
    "contentHtml": "<h1>효율적인 코드 작성 방법</h1><p>좋은 코드는...</p>"
  }
]
```

---

## Import Pattern

In the React app, import as a static module (Vite resolves this at build time):

```typescript
// site/src/app/data/posts.ts
import type { BlogPost } from './types'
import postsData from '../../generated/posts.json'

export const posts = postsData as BlogPost[]
export const categories = ['전체', ...new Set(posts.map(p => p.category))].sort()
export const allTags = [...new Set(posts.flatMap(p => p.tags))].sort()
```

---

## Invariants

1. The array is never null — an empty array `[]` is valid (zero posts published).
2. Every `id` is unique across all items.
3. Every `contentHtml` value has been processed through `sanitize-html` — safe for
   `dangerouslySetInnerHTML`.
4. The file is a valid UTF-8 encoded JSON document.
5. Posts are always sorted newest-first by `date`.
