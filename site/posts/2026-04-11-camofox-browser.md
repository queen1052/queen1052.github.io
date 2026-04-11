---
title: "Camofox Browser: AI 에이전트용 안티-탐지 브라우저 서버"
date: "2026-04-11"
category: "브라우저 자동화"
tags: ["AI 에이전트", "안티-탐지", "Camoufox", "Firefox", "브라우저 자동화"]
excerpt: "C++ 레벨 핑거프린트 스푸핑으로 Cloudflare와 Google 봇 탐지를 우회하는 AI 에이전트용 브라우저 서버. 접근성 스냅샷으로 토큰 90% 절약. 1.8k 스타."
author: "큐레이터"
readTime: "7분"
image: null
---

## 소개

Camofox Browser는 AI 에이전트가 실제 웹을 탐색할 수 있도록 설계된 안티-탐지 브라우저 서버입니다. Playwright가 차단되고 헤드리스 Chrome이 핑거프린팅되는 환경에서, C++ 구현 레벨에서 Firefox를 패치하는 [Camoufox](https://camoufox.com/)를 REST API로 감싼 것입니다.

GitHub에서 1.8k 스타를 획득한 이 프로젝트는 JavaScript 91.3%, TypeScript 7.3%로 구성되어 있으며 MIT 라이선스로 배포됩니다. Jo(askjo.ai) — AI 어시스턴트 앱의 제작사 jo-inc이 관리하며, 같은 엔진이 Jo 서비스에 실제로 사용됩니다.

## 왜 Camofox인가?

AI 에이전트는 실제 웹을 탐색해야 합니다. Playwright는 차단됩니다. 헤드리스 Chrome은 핑거프린팅됩니다. 스텔스 플러그인은 그 자체가 핑거프린트가 됩니다.

Camoufox는 C++ 구현 레벨에서 Firefox를 패치합니다. `navigator.hardwareConcurrency`, WebGL 렌더러, AudioContext, 화면 지오메트리, WebRTC — 모두 JavaScript가 보기 전에 스푸핑됩니다. 심(shim)도 없고, 래퍼도 없고, 흔적도 없습니다.

이 프로젝트는 그 엔진을 에이전트에 맞게 설계된 REST API로 감쌉니다: 비대한 HTML 대신 접근성 스냅샷, 클릭을 위한 안정적인 요소 참조.

## 주요 기능

- **C++ 안티-탐지:** Google, Cloudflare, 대부분의 봇 탐지 우회
- **요소 참조:** 안정적인 `e1`, `e2`, `e3` 식별자로 신뢰성 있는 상호작용
- **토큰 효율:** 접근성 스냅샷은 원시 HTML 대비 ~90% 더 작음
- **가벼운 실행:** 지연 브라우저 실행 + 유휴 종료로 유휴 시 메모리 ~40MB. Raspberry Pi, $5 VPS에서도 동작
- **세션 격리:** 사용자별 별도 쿠키/스토리지
- **쿠키 가져오기:** 인증된 탐색을 위한 Netscape 형식 쿠키 파일 주입
- **프록시 + GeoIP:** Camoufox 내장 GeoIP로 자동 로케일/시간대 설정
- **YouTube 트랜스크립트:** yt-dlp로 YouTube 동영상 자막 추출 (API 키 불필요)
- **검색 매크로:** `@google_search`, `@youtube_search`, `@amazon_search`, `@reddit_subreddit` 등 10여 가지

## REST API 심층 분석

**탭 라이프사이클:**
```
POST /tabs                      - 초기 URL로 탭 생성
GET  /tabs?userId=X             - 열린 탭 목록
DELETE /tabs/:id                - 탭 닫기
DELETE /sessions/:userId        - 사용자의 모든 탭 닫기
```

**페이지 상호작용:**
```bash
# 접근성 스냅샷 (요소 참조 포함)
curl "http://localhost:9377/tabs/TAB_ID/snapshot?userId=agent1"
# → { "snapshot": "[button e1] Submit  [link e2] Learn more", ... }

# 참조로 클릭
curl -X POST http://localhost:9377/tabs/TAB_ID/click \
  -H 'Content-Type: application/json' \
  -d '{"userId": "agent1", "ref": "e1"}'

# 텍스트 입력
curl -X POST http://localhost:9377/tabs/TAB_ID/type \
  -H 'Content-Type: application/json' \
  -d '{"userId": "agent1", "ref": "e2", "text": "hello", "pressEnter": true}'

# Google 검색 매크로
curl -X POST http://localhost:9377/tabs/TAB_ID/navigate \
  -H 'Content-Type: application/json' \
  -d '{"userId": "agent1", "url": "@google_search:AI agents"}'
```

**YouTube 트랜스크립트:**
```bash
curl -X POST http://localhost:9377/youtube/transcript \
  -H 'Content-Type: application/json' \
  -d '{"url": "https://www.youtube.com/watch?v=...", "languages": ["ko", "en"]}'
```

## 아키텍처

```
Browser Instance (Camoufox)
└── User Session (BrowserContext) - 격리된 쿠키/스토리지
    ├── Tab Group (sessionKey: "conv1")
    │   ├── Tab (google.com)
    │   └── Tab (github.com)
    └── Tab Group (sessionKey: "conv2")
        └── Tab (amazon.com)
```

세션은 30분 비활성 후 자동 만료됩니다. 브라우저 자체는 활성 세션이 없으면 5분 후 종료되고 다음 요청 시 재실행됩니다. 탭 한도 초과 시 가장 오래/덜 사용된 탭이 자동으로 재활용됩니다.

## 설치 및 사용법

```bash
# 독립 실행
git clone https://github.com/jo-inc/camofox-browser
cd camofox-browser
npm install
npm start  # 첫 실행 시 Camoufox 다운로드 (~300MB)
# 기본 포트: 9377

# Docker (Makefile로 빌드)
make up          # 아키텍처 자동 감지 (aarch64/x86_64)
make down        # 컨테이너 중지
make reset       # 완전 재빌드

# npm 패키지
npm install @askjo/camofox-browser

# OpenClaw 플러그인
openclaw plugins install @askjo/camofox-browser
```

**주요 환경 변수:**
```
CAMOFOX_PORT=9377              # 서버 포트
MAX_SESSIONS=50                # 최대 동시 브라우저 세션
MAX_TABS_PER_SESSION=10        # 세션당 최대 탭
SESSION_TIMEOUT_MS=1800000     # 세션 비활성 타임아웃 (30분)
BROWSER_IDLE_TIMEOUT_MS=300000 # 유휴 브라우저 종료 (5분)
PROXY_STRATEGY=backconnect     # 프록시 모드
CAMOFOX_API_KEY=...            # 쿠키 가져오기 활성화
```

**Fly.io/Railway 배포:** `fly.toml`과 `railway.toml` 포함. `fly deploy`로 즉시 배포 가능.

## 마치며

Camofox Browser는 AI 에이전트가 실제 웹과 상호작용하는 가장 어려운 문제 — 봇 탐지 우회 — 를 C++ 레벨에서 해결합니다. 접근성 스냅샷의 토큰 90% 절약과 $5 VPS에서도 동작하는 경량 설계는 AI 에이전트 스택의 빠진 퍼즐 조각입니다.

단, 암호화폐 관련 사기 경고: "Camofox"라는 이름의 코인/토큰/NFT가 등장했지만 이 프로젝트와 전혀 무관합니다. 공식 저장소는 github.com/jo-inc/camofox-browser입니다.
