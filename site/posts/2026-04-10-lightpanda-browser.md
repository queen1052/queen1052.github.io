---
title: "Lightpanda Browser: AI 에이전트를 위한 초경량 헤드리스 브라우저"
date: "2026-04-10"
category: "개발도구"
tags: ["browser", "Zig", "headless", "AI", "automation"]
excerpt: "Chromium 포크가 아닌 Zig로 처음부터 새로 만든 헤드리스 브라우저. 크롬 대비 16배 적은 메모리, 9배 빠른 실행 속도."
author: "큐레이터"
readTime: "6분"
image: null
---

## 소개

Lightpanda Browser는 AI 에이전트와 자동화를 위해 **처음부터 새로 설계된 헤드리스 브라우저**입니다. Chromium 포크도 아니고 WebKit 패치도 아닌, **Zig 언어로 작성된 완전히 새로운 브라우저**입니다. GitHub에서 28,100개 이상의 별을 받았으며, AGPL-3.0 라이선스로 오픈소스로 공개되어 있습니다.

현대 웹 자동화의 문제는 크롬이 너무 무겁다는 것입니다. 수백~수천 개의 인스턴스를 동시에 실행해야 하는 AI 에이전트 워크로드에서 Chrome은 인스턴스당 2GB의 메모리를 사용합니다. Lightpanda는 동일한 100페이지 크롤링 작업에서 **123MB의 피크 메모리(Chrome 대비 16배 적음)**와 **5초(Chrome 46초 대비 9배 빠름)**를 달성합니다. 실제로 AWS EC2 m5.large 인스턴스에서 933개 실제 웹 페이지를 요청한 벤치마크 결과입니다.

단순한 HTTP 요청 브라우저가 아니라 **JavaScript를 완전히 실행**하고, Ajax/SPA/동적 로딩 등 현대 웹의 핵심을 처리합니다. CDP(Chrome DevTools Protocol) 서버도 내장되어 있어 기존 Puppeteer/Playwright 스크립트를 최소한의 수정으로 Lightpanda에서 실행할 수 있습니다.

## 주요 기능

- **극도로 낮은 메모리 사용량**: 100페이지 크롤링에 123MB (Chrome 2GB 대비 약 16분의 1 수준)
- **빠른 실행 속도**: 같은 작업 기준 Chrome보다 9배 빠름
- **JavaScript 완전 지원**: Ajax, SPA, Fetch API, XHR 등 현대 웹 JS를 실행합니다
- **CDP 서버 내장**: Puppeteer 스크립트를 `browserWSEndpoint` 설정만 변경해 연동 가능
- **URL 덤프 기능**: HTML 또는 Markdown으로 직접 변환 (`--dump html`, `--dump markdown`)
- **robots.txt 준수 옵션**: `--obey-robots` 플래그로 크롤 에티켓을 자동 적용
- **다양한 대기 옵션**: `--wait-until`, `--wait-ms`, `--wait-selector`, `--wait-script`로 동적 페이지 로딩 대기 제어

### CDP 서버 모드 — Puppeteer 완전 호환

Lightpanda의 CDP 서버 모드는 `lightpanda serve`로 실행하면 `ws://127.0.0.1:9222`에서 WebSocket 기반 CDP 서버가 시작됩니다. 기존에 Playwright나 Puppeteer를 사용하는 프로젝트는 `browserWSEndpoint`만 교체하면 됩니다. Chromium이 필요했던 CI 환경에서 Lightpanda로 교체하면 컨테이너 이미지 크기와 실행 시간을 대폭 줄일 수 있습니다.

현재 베타 단계로 안정성과 웹 API 커버리지가 계속 개선되고 있으며, 크래시 발생 시 이슈를 통해 리포트하면 팀이 빠르게 대응합니다.

### URL 덤프 모드 — RAG 파이프라인 연동에 최적

`lightpanda fetch` 명령은 URL의 콘텐츠를 HTML 또는 Markdown으로 변환합니다. `--dump markdown` 옵션은 AI RAG 파이프라인에서 웹 페이지를 LLM 입력 형식으로 변환할 때 매우 유용합니다. 스크린샷 없이 텍스트 기반으로 처리하기 때문에 비전 모델 없이도 웹 콘텐츠를 처리할 수 있습니다.

## 기술 스택 / 아키텍처

| 항목 | 내용 |
|------|------|
| 언어 | Zig 74.7%, HTML 24.2%, Rust 0.6% |
| HTML 파서 | html5ever (Rust) |
| HTTP 클라이언트 | libcurl |
| JavaScript 엔진 | V8 |
| 프로토콜 | CDP/WebSocket |
| 라이선스 | AGPL-3.0 |

아키텍처 흐름:  
`HTTP 요청(libcurl) → HTML 파싱(html5ever) → DOM 트리 구축 → V8 JS 실행 → 결과 덤프 / CDP 응답`

## 설치 / 사용법

```bash
# 릴리스에서 바이너리 다운로드 후 실행 권한 부여
chmod +x ./lightpanda

# URL 덤프 (HTML)
./lightpanda fetch --dump html https://example.com

# URL을 Markdown으로 변환 (RAG 파이프라인 용도)
./lightpanda fetch --dump markdown --obey-robots https://example.com

# CDP 서버 시작 (Puppeteer 연동)
./lightpanda serve --host 127.0.0.1 --port 9222
```

```javascript
// Puppeteer에서 Lightpanda 연동
const browser = await puppeteer.connect({
  browserWSEndpoint: 'ws://127.0.0.1:9222'
});
const page = await browser.newPage();
await page.goto('https://example.com');
```

## 활용 사례 / 사용 시나리오

1. **AI 에이전트 웹 크롤링**: 수천 개의 URL을 동시에 처리해야 하는 RAG 파이프라인이나 웹 리서치 에이전트에서 Chrome 대신 Lightpanda를 사용하면 서버 비용을 대폭 절감할 수 있습니다.

2. **CI/CD 헤드리스 테스트**: Docker 이미지에 Chrome을 포함하면 이미지가 수 GB가 됩니다. Lightpanda는 훨씬 가벼운 컨테이너 이미지로 E2E 테스트를 구성할 수 있습니다.

3. **스케일 아웃 웹 모니터링**: 페이지 변경을 주기적으로 감지하는 모니터링 서비스에서 인스턴스당 리소스를 줄여 더 많은 URL을 동시에 감시할 수 있습니다.

## 결론

Lightpanda는 AI 에이전트 시대에 맞춰 설계된 브라우저입니다. Chrome이 서버 자동화에 필요 이상으로 무겁다는 문제를 근본적으로 해결하려는 시도이며, 28,000개 이상의 별은 커뮤니티의 높은 기대를 반영합니다. 현재 베타 단계이므로 일부 웹사이트에서 오류가 발생할 수 있지만, 크롤링·RAG·간단한 자동화 용도에서는 이미 충분히 실용적입니다. AI 에이전트 인프라를 구축 중이라면 반드시 검토해볼 만한 도구입니다.

---

> 원문: https://github.com/lightpanda-io/browser
