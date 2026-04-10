# queen1052.github.io Development Guidelines

Auto-generated from all feature plans. Last updated: 2026-04-10

## Active Technologies
- `site/posts/*.md` → `site/src/generated/posts.json` (existing build artifact). (002-tag-knowledge-graph)

- TypeScript 5 / Node.js 20 (LTS, pinned in CI) (001-uiux-md-blog)

## Project Structure

```text
src/
tests/
```

## Commands

npm test; npm run lint

## Code Style

TypeScript 5 / Node.js 20 (LTS, pinned in CI): Follow standard conventions

## Recent Changes
- 002-tag-knowledge-graph: Added TypeScript 5 / Node.js 20 (LTS, pinned in CI)

- 001-uiux-md-blog: Added TypeScript 5 / Node.js 20 (LTS, pinned in CI)

<!-- MANUAL ADDITIONS START -->

## LIST.md 자동 포스트 생성 워크플로우

사용자가 **"LIST.md 실행해줘"** 라고 요청하면:
1. `LIST.md` **대기 중** 섹션의 URL을 읽는다
2. 각 URL의 페이지 내용을 가져온다
3. 한국어 블로그 포스트를 `site/posts/YYYY-MM-DD-{slug}.md` 형식으로 생성한다
4. LIST.md의 해당 항목을 **완료** 섹션으로 이동한다

상세 지침: `.github/prompts/process-list.prompt.md` 참조

<!-- MANUAL ADDITIONS END -->
