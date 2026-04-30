---
title: "Steel Browser: AI 에이전트용 오픈소스 브라우저 API"
date: "2026-04-11"
category: "브라우저 자동화"
tags: ["AI 에이전트", "브라우저 자동화", "TypeScript"]
excerpt: "AI 에이전트와 앱이 웹과 상호작용하기 쉽게 만드는 오픈소스 브라우저 API. 세션 관리, 프록시 지원, 안티-탐지까지 배터리 포함. 6.8k 스타."
author: "큐레이터"
readTime: "6분"
image: null
---

## 소개

Steel Browser는 AI 에이전트와 앱이 웹과 상호작용하기 쉽게 만드는 오픈소스 브라우저 API입니다. "배터리 포함 브라우저 샌드박스"를 표방하며, 자동화 인프라를 처음부터 구축할 필요 없이 AI 애플리케이션 개발에 집중할 수 있게 해줍니다.

GitHub에서 6.8k 스타를 획득한 이 프로젝트는 TypeScript 85.4%, EJS 10%, CSS 2%로 구성되어 있으며 Apache-2.0 라이선스로 배포됩니다. 23명의 기여자가 개발하고 있으며, v0.5.2-beta가 최신 릴리즈입니다. [Steel 클라우드](https://app.steel.dev)에서 관리형 서비스도 제공합니다.

## 주요 기능

**완전한 브라우저 제어:** Puppeteer와 CDP(Chrome DevTools Protocol)로 Chrome 인스턴스를 완전히 제어합니다. Puppeteer, Playwright, Selenium으로 연결할 수 있습니다.

**세션 관리:** 요청 간 브라우저 상태, 쿠키, 로컬 스토리지를 유지합니다.

**프록시 지원:** IP 로테이션을 위한 내장 프록시 체인 관리.

**확장 기능 지원:** 향상된 기능을 위한 커스텀 Chrome 확장 프로그램 로드.

**디버깅 도구:** 내장 요청 로깅과 세션 뷰/디버그 UI.

**안티-탐지:** 스텔스 플러그인과 핑거프린트 관리 포함.

**리소스 관리:** 자동 정리와 브라우저 라이프사이클 관리.

**브라우저 도구:** 페이지를 마크다운, 가독성 뷰, 스크린샷, PDF로 빠르게 변환하는 API.

## 빠른 배포 옵션

```bash
# Docker로 로컬 실행
docker run -p 3000:3000 -p 9223:9223 ghcr.io/steel-dev/steel-browser

# docker compose로 실행
docker compose up

# Mac Silicon
DOCKER_DEFAULT_PLATFORM=linux/arm64 docker compose up

# Node.js + Chrome 직접 실행
npm install
npm run dev
```

Steel 브라우저 서버는 포트 3000에서 시작되며([http://localhost:3000](http://localhost:3000/)), UI는 [http://localhost:3000/ui](http://localhost:3000/ui)에서. 포트 9223은 콘솔 디버거용입니다.

Cloud 배포 옵션: Railway 원클릭 배포, Render 원클릭 배포, GitHub Container Registry 이미지 모두 지원합니다.

## Sessions API 심층 분석

Sessions는 Steel의 핵심 기능입니다. `/sessions` 엔드포인트로 커스텀 옵션이나 확장 프로그램으로 브라우저를 재실행하고 브라우저 상태를 초기화할 수 있습니다. 복잡한 상태 저장 워크플로우에 최적입니다.

```javascript
// Node SDK 사용
import Steel from 'steel-sdk';

const client = new Steel({
  baseURL: "http://localhost:3000",
});

(async () => {
  const session = await client.sessions.create({
    blockAds: true,
    proxyUrl: "user:pass@host:port",
    dimensions: { width: 1280, height: 800 },
  });
  console.log("Created session:", session.id);
  
  // 세션 ID로 Playwright 연결
  // 또는 Puppeteer/Selenium 연결
})();
```

**Selenium 통합:** `isSelenium: true` 옵션으로 기존 Selenium 워크플로우를 그대로 유지하면서 Steel의 향상된 기능을 활용할 수 있습니다.

## Quick Actions API

단순 읽기 전용, 온디맨드 작업에 최적화된 즉시 사용 가능한 API입니다.

```bash
# 웹 페이지 스크래핑
curl -X POST http://0.0.0.0:3000/v1/scrape \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com", "delay": 1000}'

# 스크린샷 찍기
curl -X POST http://0.0.0.0:3000/v1/screenshot \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com"}'

# PDF 다운로드
curl -X POST http://0.0.0.0:3000/v1/pdf \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com"}'
```

전체 REST OpenAPI 문서는 로컬 Steel 인스턴스의 `http://localhost:3000/documentation`에서 Swagger UI로 확인할 수 있습니다.

## 기술 스택 및 SDK

**스택:** TypeScript(Fastify 기반 API), EJS(UI 템플릿), Puppeteer + CDP, Chrome DevTools Protocol, Docker

**SDK:**
- **Node SDK:** `npm install steel-sdk` — 완전한 타입 지원, Steel Cloud와 셀프 호스팅 모두 지원
- **Python SDK:** `pip install steel-sdk` — Node SDK와 동일한 기능

두 SDK 모두 REST API 위에 구축되어 편리한 인터페이스를 제공합니다. `baseURL` 옵션으로 Steel Cloud와 셀프 호스팅 인스턴스를 쉽게 전환합니다.

## 설치 및 사용법

**Steel Cloud 사용 (가장 쉬운 방법):**
[app.steel.dev](https://app.steel.dev)에서 무료 계정 생성 후 바로 사용.

**셀프 호스팅 — Docker:**
```bash
docker run -p 3000:3000 -p 9223:9223 ghcr.io/steel-dev/steel-browser
```

**셀프 호스팅 — Node.js:**
```bash
# Chrome이 설치되어 있어야 함
npm install
npm run dev
# API 서버: http://localhost:3000
# UI: http://localhost:5173

# 커스텀 Chrome 실행 파일 경로
export CHROME_EXECUTABLE_PATH=/path/to/your/chrome
npm run dev
```

**개발자용 (변경 사항 반영):**
```bash
docker compose -f docker-compose.dev.yml up --build
```

더 많은 예제는 [Steel Cookbook](https://github.com/steel-dev/steel-cookbook)에서 확인하거나 `cd repl && npm run start`로 REPL 패키지를 실험해보세요.

## 마치며

Steel Browser는 AI 에이전트 개발에서 가장 번거로운 부분인 브라우저 인프라 구축을 추상화합니다. Playwright가 차단되고 헤드리스 Chrome이 핑거프린팅되는 현대 웹에서, Steel은 세션 관리, 안티-탐지, 프록시 지원, 디버깅 도구를 하나의 검증된 패키지로 제공합니다.

클라우드 서비스로 즉시 시작하거나, Docker로 완전한 셀프 호스팅도 가능한 유연성이 특징입니다. 구인 중이며([jobs.ashbyhq.com/steel](https://jobs.ashbyhq.com/steel)), 오픈소스 테크스택을 사랑한다면 팀에 합류할 기회도 있습니다.
