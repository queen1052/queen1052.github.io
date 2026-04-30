---
title: "x-research: AI 에이전트를 위한 X/Twitter 리서치 스킬"
date: "2026-04-11"
category: "AI 도구"
tags: ["X API", "Twitter", "Claude Code"]
excerpt: "X/Twitter 연구를 위한 Claude Code·OpenClaw 전용 에이전트 스킬. 트윗 검색, 스레드 추적, 계정 모니터링을 터미널 하나로 처리한다."
author: "큐레이터"
readTime: "6분"
image: null
---

## 소개

소셜 미디어에서 실시간 정보를 얻는 일은 AI 리서치 에이전트에게도 중요한 과제입니다. **x-research**는 X(Twitter) API를 감싸 Claude Code와 OpenClaw 에이전트가 자연어 명령으로 트윗을 검색하고, 스레드를 추적하며, 계정을 모니터링할 수 있도록 만든 TypeScript 기반 CLI 스킬입니다.

GitHub Stars 1,100개를 돌파한 이 프로젝트는 X API의 복잡한 curl 명령을 추상화해 에이전트와 개발자 모두가 직관적으로 X 데이터를 활용할 수 있게 해 줍니다. MIT 라이선스로 공개되어 있으며, Bun 런타임 기반의 단일 TypeScript 엔트리포인트(`x-search.ts`)로 구성되어 있어 설치와 유지보수가 간단합니다.

---

## 주요 기능

x-research의 핵심 기능을 한눈에 살펴보겠습니다.

| 기능 | 설명 |
|------|------|
| 검색 | 참여도 정렬, 시간 필터, 노이즈 제거 포함 |
| Quick Mode | 저렴하고 빠른 단발성 검색 |
| 워치리스트 | 특정 계정 모니터링 |
| 캐시 | 반복 API 호출 비용 절감 |
| 비용 투명성 | 검색마다 소비 크레딧 표시 |
| 스레드 추적 | 트윗 ID로 전체 대화 맥락 수집 |

에이전트 관점에서 가장 강력한 특징은 **자연어 명령 지원**입니다. 에이전트에게 "오늘 CT에서 BNKR에 대해 뭐라고 하는지 알려줘"라고 말하면, x-research가 적절한 검색 쿼리를 구성해 결과를 정리된 형태로 반환합니다.

---

## 핵심 기능 1: 고급 검색 옵션

x-research의 검색 시스템은 다양한 필터 옵션으로 노이즈를 줄이고 유용한 정보만 추출합니다.

```bash
# 좋아요 순으로 정렬, 리트윗 자동 제외
bun run x-search.ts search "AI agents" --sort likes --limit 15

# 특정 사용자의 최근 트윗
bun run x-search.ts search "Claude" --from anthropic --quick

# 품질 필터 (좋아요 10개 이상만)
bun run x-search.ts search "vibe coding" --quality --no-replies
```

주요 검색 옵션 정리:

- `--sort likes|impressions|retweets|recent` — 정렬 기준
- `--since 1h|3h|12h|1d|7d` — 시간 범위 (기본: 7일)
- `--min-likes N` / `--min-impressions N` — 최소 참여도 필터
- `--pages 1-5` — 페이지 수 (페이지당 최대 100건)
- `--quality` — 좋아요 10개 이하 트윗 사전 필터링
- `--markdown` / `--save` — 결과를 마크다운 리서치 문서로 저장

`--from` 단축 옵션은 쿼리에 `from:username`을 자동으로 추가해 특정 사용자의 트윗만 타겟팅합니다.

---

## 핵심 기능 2: Quick Mode와 비용 관리

X API는 현재 선불 크레딧 방식으로 과금되며, 트윗 100건 조회 시 약 $0.50가 소비됩니다. x-research는 이 비용을 줄이기 위한 **Quick Mode**를 제공합니다.

```bash
# Quick Mode: 1페이지 고정, 1시간 캐시, 노이즈 자동 필터
bun run x-search.ts search "Opus 4.6" --quick

# 조합 사용
bun run x-search.ts search "AI news" --quality --quick --from sama
```

Quick Mode의 절약 메커니즘:
- **단일 페이지 강제**: 다중 페이지 실수 방지 (최대 절약 효과)
- **1시간 캐시 TTL**: 반복 검색 무료
- **자동 노이즈 필터**: `-is:retweet -is:reply` 자동 추가
- **비용 표시**: 모든 검색 후 소비 금액 출력

또한 15분(기본) 또는 1시간(Quick) 캐시로 동일 쿼리 반복 실행 시 API 호출이 발생하지 않으며, X API의 24시간 중복 제거 정책으로 같은 날 동일 결과를 다시 요청할 때 추가 과금이 없습니다.

---

## 기술 스택 및 아키텍처

```
x-research/
├── SKILL.md              # 에이전트 지침 (Claude가 읽는 파일)
├── x-search.ts           # CLI 엔트리포인트
├── lib/
│   ├── api.ts            # X API 래퍼
│   ├── cache.ts          # 파일 기반 캐시
│   └── format.ts         # Telegram + 마크다운 포매터
└── data/
    ├── watchlist.json    # 모니터링 계정 목록
    └── cache/            # 자동 관리 캐시
```

- **런타임**: [Bun](https://bun.sh/) (빠른 TypeScript 실행)
- **언어**: TypeScript 100%
- **라이선스**: MIT
- **X API**: `/2/tweets/search/recent` (최근 7일, 선불 크레딧 방식)

보안 측면에서는 `X_BEARER_TOKEN`을 환경변수 또는 `~/.config/env/global.env`에서 읽으며, stdout에는 절대 출력하지 않습니다. 단, AI 에이전트 세션 로그에 HTTP 헤더가 기록될 수 있으므로 읽기 전용 토큰 사용과 정기적인 토큰 교체를 권장합니다.

---

## 설치 및 사용법

### Claude Code에 설치

```bash
mkdir -p .claude/skills
cd .claude/skills
git clone https://github.com/rohunvora/x-research-skill.git x-research
```

### OpenClaw에 설치

```bash
mkdir -p skills
cd skills
git clone https://github.com/rohunvora/x-research-skill.git x-research
```

### 환경 설정

1. [X Developer Portal](https://developer.x.com/)에서 Bearer Token 발급
2. `export X_BEARER_TOKEN="your-token-here"` 설정
3. Bun 설치: [https://bun.sh](https://bun.sh/)

### 자연어 사용 예시 (Claude 에이전트 내)

```
"What are people saying about Claude Sonnet 4?"
"Search X for OpenClaw skills"  
"Check what @OpenAI posted recently"
"What's CT saying about BTC today?"
```

### CLI 직접 사용

```bash
# 검색
bun run x-search.ts search "your query" --sort likes

# 프로필 (사용자 최근 트윗)
bun run x-search.ts profile username

# 스레드 전체 조회
bun run x-search.ts thread TWEET_ID

# 워치리스트 추가 및 확인
bun run x-search.ts watchlist add username
bun run x-search.ts watchlist check
```

---

## 마치며

x-research는 AI 에이전트가 X/Twitter를 실시간 정보 소스로 활용할 수 있는 실용적인 브리지입니다. 자연어 명령 지원, 비용 투명성, 캐시 기반 절약 메커니즘을 갖춰 Claude Code나 OpenClaw 환경에서 리서치 워크플로우에 즉시 통합할 수 있습니다.

현재는 최근 7일 검색만 지원하지만, 전체 아카이브 검색 지원도 계획 중입니다. X API 비용이 신경 쓰인다면 Quick Mode와 캐시 전략을 적극 활용하는 것을 권장합니다.

- GitHub: [rohunvora/x-research-skill](https://github.com/rohunvora/x-research-skill)
- 라이선스: MIT
- Stars: 1.1k+
