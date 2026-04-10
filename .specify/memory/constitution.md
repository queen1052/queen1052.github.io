<!--
동기화 영향 보고서 (Sync Impact Report)
========================================
버전 변경: 1.0.0 → 1.0.1
  [PATCH] 전체 문서 한국어 번역
  [PATCH] 원칙 V, II 배포 도구 수정: peaceiris/actions-gh-pages@v3 →
          공식 GitHub Pages Actions (actions/configure-pages, upload-pages-artifact, deploy-pages)
  [PATCH] 기술 스택 항목 최신화: React 18 · Vite 6 · Tailwind CSS 4 · TypeScript 5

수정된 원칙:
  원칙 II — GitHub Pages 호환성: gh-pages 브랜치 방식 → GitHub Actions 방식으로 수정
  원칙 V  — 자동화 지속 배포: peaceiris 액션 → 공식 deploy-pages 액션으로 수정

추가된 섹션: 없음
제거된 섹션: 없음

템플릿 업데이트 현황:
  .specify/templates/spec-template.md   ✅ 원칙 참조 없음 — 수정 불필요
  .specify/templates/plan-template.md   ✅ Constitution Check 게이트 제목 영어 유지 허용
  .specify/templates/tasks-template.md  ✅ 원칙 참조 없음 — 수정 불필요
  specs/001-uiux-md-blog/plan.md        ✅ 이미 6원칙 영어명으로 검증 완료 — 소급 수정 불필요
  specs/002-tag-knowledge-graph/spec.md ✅ 원칙 준수 확인됨

후속 TODO: 없음
-->

# queen1052.github.io 프로젝트 헌법

## 프로젝트 정체성

**프로젝트 이름**: queen1052.github.io
**목적**: GitHub Pages에서 100% 정적으로 동작하는 개인 한국어 기술 블로그 SPA이다.
저자는 Markdown 파일을 작성하고 `main` 브랜치에 push하는 것만으로 콘텐츠를 발행한다.
GitHub Actions가 빌드와 배포를 자동으로 처리하며, 어떠한 서버 런타임도 존재하지 않는다.

**라이브 URL**: `https://queen1052.github.io`
**저장소**: `https://github.com/queen1052/queen1052.github.io`
**기술 스택**: React 18 · Vite 6 · Tailwind CSS 4 · TypeScript 5 · Node.js 20 (CI 고정) ·
GitHub Actions (`deploy.yml`) → `actions/deploy-pages@v4` → GitHub Pages

## 핵심 원칙

### 원칙 I — 정적 우선 출력 (Static-First Output)

프로덕션에 배포되는 모든 결과물은 반드시 정적 파일(HTML/CSS/JS/JSON)이어야 한다.
서버 사이드 런타임(Node.js, Python 등)은 프로덕션 환경에서 실행될 수 없다.
런타임이 필요한 기능은 클라이언트 사이드 또는 정적 호환 외부 API를 통해 구현해야 한다.

**규칙** (MUST):
- `npm run build`의 모든 출력물은 `site/dist/` 아래의 정적 파일만으로 구성되어야 한다
- 서버 런타임이 필요한 기능은 이 프로젝트 범위 밖으로 간주한다
- 블로그 포스트, 그래프 데이터 등 모든 콘텐츠 데이터는 빌드 시점에 생성되어
  JS 번들에 포함되어야 하며, 런타임 API 요청 없이 소비되어야 한다

**근거**: GitHub Pages는 정적 파일만 서빙하는 CDN 기반 호스트이다.
서버 의존 기능은 프로덕션에서 경고 없이 조용히 실패한다.

---

### 원칙 II — GitHub Pages 호환성 (GitHub Pages Compatibility)

`main`에 병합된 모든 변경 사항은 GitHub Pages 환경에서 추가 설정 없이
올바르게 동작하는 빌드를 생성해야 한다.

**규칙** (MUST):
- `dist/404.html`이 반드시 존재해야 한다 — SPA 딥링크 폴백에 필수
  (CI 단계: `cp dist/index.html dist/404.html`)
- `dist/.nojekyll`이 반드시 존재해야 한다 — GitHub Pages Jekyll 처리 방지
- `dist/robots.txt`가 반드시 존재해야 하며, 사이트 정규 URL을 참조해야 한다
- Jekyll 플러그인, `_config.yml`, Jekyll 특화 파일 구조를 사용해서는 안 된다
- `.htaccess` 또는 서버 설정 파일을 사용해서는 안 된다 — GitHub Pages가 무시함
- 모든 SPA 라우트는 `404.html` 폴백을 통해 직접 URL 접근이 가능해야 한다
- GitHub Pages 소스는 반드시 **"GitHub Actions"**로 설정되어야 한다

**근거**: GitHub Pages는 SPA 라우팅을 기본 지원하지 않는다.
`404.html` 폴백이 없으면 직접 URL 접근 시 GitHub의 404 페이지가 표시된다.

---

### 원칙 III — 결정론적 빌드 (Deterministic Builds)

동일한 소스 코드는 항상 동일한 빌드 출력물을 생성해야 한다.
CI와 로컬 개발 환경 사이에 차이가 없어야 한다.

**규칙** (MUST):
- CI에서는 반드시 `npm ci`를 사용해야 한다 — `npm install`은 금지
- `site/package-lock.json`이 반드시 저장소에 커밋되어 최신 상태를 유지해야 한다
- Node.js 버전은 CI 워크플로우에 고정되어야 한다 (현재: `node-version: '20'`)
- 빌드 스크립트(Vite 플러그인을 포함)는 멱등성을 가져야 한다
  (동일 입력 → 동일 출력)
- 빌드 시점에 외부 네트워크 호출을 해서는 안 된다

**근거**: 고정되지 않은 의존성은 "내 환경에서는 됩니다" 문제의 주요 원인이다.
결정론적 빌드는 안전한 롤백과 문제 추적을 가능하게 한다.

---

### 원칙 IV — 올바른 기본 URL (Correct Base URL)

모든 에셋 URL과 내부 링크는 반드시 프로덕션 도메인
`https://queen1052.github.io`에서 올바르게 해석되어야 한다.

**규칙** (MUST):
- Vite `base`는 반드시 `'/'`로 설정되어야 한다
- 소스 코드 또는 빌드 출력물에 `localhost` 또는 `127.0.0.1`을 하드코딩해서는 안 된다
- `sitemap.xml`과 `feed.xml`의 절대 URL은 반드시 `https://queen1052.github.io`를
  기준으로 해야 한다
- 번들러가 생성하는 에셋 파일명은 Vite 콘텐츠 해싱을 사용해야 한다
- 내부 링크는 React Router의 `<Link>` 또는 `useNavigate`를 사용해야 하며,
  `<a href="...">` 하드코딩은 금지한다

**근거**: 잘못된 기본 URL은 에셋 404를 유발하여 사이트를 완전히 망가뜨린다.

---

### 원칙 V — 자동화 지속 배포 (Automated CD)

`main` 브랜치에 push할 때마다 GitHub Actions가 자동으로 빌드 및 배포해야 한다.
수동 배포 단계는 허용되지 않는다.

**규칙** (MUST):
- `deploy.yml` 워크플로우는 반드시 `main` 브랜치 push에 의해 트리거되어야 한다
- 빌드 실패는 반드시 배포를 차단해야 한다
- 배포 단계는 공식 GitHub Pages Actions를 사용해야 한다:
  1. `actions/checkout@v4`
  2. `npm ci` — 재현 가능한 의존성 설치
  3. `npm run build` — 프로덕션 번들 생성 (`site/dist/`)
  4. `cp dist/index.html dist/404.html` — 404 폴백 생성
  5. `actions/configure-pages@v5`
  6. `actions/upload-pages-artifact@v3` (path: `./site/dist`)
  7. `actions/deploy-pages@v4`
- CI를 우회하여 GitHub Pages에 직접 수동 커밋하는 행위는 금지된다
- 워크플로우 권한: `pages: write`, `id-token: write`

**근거**: 자동화 배포는 모든 병합이 즉시 라이브 사이트에 반영되도록 보장하고
배포 이력을 커밋 기록으로 감사할 수 있게 한다.

---

### 원칙 VI — 콘텐츠 무결성 (Content Integrity)

블로그 포스트 콘텐츠는 구조적으로 유효해야 하며,
사용자에게 표시되기 전에 보안 위협으로부터 무결해야 한다.

**규칙** (MUST):
- 포스트 파일명은 반드시 `YYYY-MM-DD-slug.md` 형식을 따라야 한다
- `title`과 `date` 프론트매터 필드는 필수값이다 — 누락 시 빌드가 실패해야 한다
- `category`와 `tags` 프론트매터 필드는 선택값이지만 지식 그래프 기능에 권장된다
- 포스트 Markdown 본문에서 파생된 모든 HTML은 사용자에게 렌더링되기 전에
  반드시 XSS 방지 처리되어야 한다 (OWASP Top 10 A03 준수)
- 실제 포스트 데이터는 반드시 `site/posts/*.md`에서 가져와야 한다 —
  목업(mock) 데이터나 하드코딩된 포스트는 프로덕션 빌드에서 허용되지 않는다
- UI_UX 디자인 소스는 직접 수정하지 않는다 — 빌드 파이프라인을 통해서만 적용한다

**근거**: 콘텐츠 구조 검증은 잘못된 데이터가 라이브 상태가 되는 것을 방지한다.
XSS 방지는 Markdown에서 파생된 HTML 렌더링의 필수 보안 요건이다.

---

## GitHub Pages 배포 요구사항

GitHub Pages에서 올바른 동작을 위한 비협상 요구사항:

| 요구사항 | 적용 원칙 |
|---|---|
| 정적 출력만 허용 (서버 런타임 없음) | 원칙 I — 아키텍처 제약 |
| 프로덕션에서 모든 에셋 로드 성공 (404 없음) | 원칙 IV — URL 정확성 |
| 배포 디렉터리에 `404.html` 존재 | 원칙 II — CI 단계: cp index.html 404.html |
| 배포 디렉터리에 `robots.txt` 존재 | 원칙 II — 빌드 출력물에 포함 |
| 배포 디렉터리에 `.nojekyll` 존재 | 원칙 II — Jekyll 처리 방지 |
| CI를 통해서만 배포 (수동 금지) | 원칙 V — 수동 커밋 금지 |
| `package-lock.json` 커밋 | 원칙 III — 재현 가능한 설치 |
| GitHub Pages 소스: "GitHub Actions" 설정 | 원칙 II — 저장소 설정 필수 |

이 테이블의 모든 요구사항을 충족할 수 없는 기능이나 변경 사항은
구현 전에 재설계되어야 한다.

---

## 개발 워크플로우

1. **브랜치**: `main`에서 피처 브랜치를 생성한다. 브랜치명은 반드시
   `NNN-short-description` 형식 (예: `002-tag-knowledge-graph`)을 따른다.
2. **로컬 개발**: `npm run dev` (Vite) 또는 `npm run build && npm run preview`로 검증한다.
3. **빌드 검증**: `site/` 내에서 `npm run build`를 실행하고 `dist/` 출력물이
   경로를 올바르게 해석하는지 확인한다.
4. **명세 작성**: 새 기능은 구현 전에 `specs/NNN-feature/spec.md`가 작성되어야 한다.
5. **피처 계획**: `plan.md`의 Constitution Check 게이트가 모두 PASS여야 구현을 시작한다.
6. **병합**: `main`에 병합한다. 배포는 자동으로 진행된다.

---

## 거버넌스

이 헌법은 다른 모든 개발 관례에 우선한다. 개정 절차:

1. `.specify/memory/constitution.md`를 수정하는 풀 리퀘스트를 생성한다.
2. 아래 버전 정책에 따라 버전을 업데이트한다.
3. `최종 수정일`을 오늘 날짜(ISO 8601: YYYY-MM-DD)로 업데이트한다.
4. 상단 HTML 주석에 동기화 영향 보고서를 기록한다.
5. 의존 템플릿(`spec-template.md`, `plan-template.md`, `tasks-template.md`)의
   일관성을 검토한다.
6. 커밋 메시지 형식: `docs: amend constitution to vX.Y.Z (변경 내용 요약)`

### 버전 정책

| 변경 유형 | 버전 업 |
|---|---|
| 기존 원칙 삭제 또는 하위 호환성을 깨는 거버넌스 재정의 | **MAJOR** (x.0.0) |
| 새 원칙 추가 또는 기존 원칙의 실질적 확장 | **MINOR** (1.x.0) |
| 명확화, 문구 수정, 오타 교정 등 비의미론적 변경 | **PATCH** (1.0.x) |

### 컴플라이언스 검토

- 원칙 II, III, V를 위반하는 CI 빌드는 반드시 병합을 차단해야 한다 — 권고 수준이 아니다.
- 원칙 I, IV, VI를 위반하는 코드는 코드 리뷰에서 병합 전에 반드시 수정되어야 한다.
- 새 기여자가 합류할 때 헌법 컴플라이언스를 검토할 것을 권장한다 (SHOULD).

---

**버전**: 1.0.1 | **최초 채택일**: 2026-04-09 | **최종 수정일**: 2026-04-10
