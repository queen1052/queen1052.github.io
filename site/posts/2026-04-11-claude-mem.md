---
title: "Claude-Mem: Claude Code를 위한 영구 메모리 압축 시스템"
date: "2026-04-11"
category: "AI 메모리"
tags: ["Claude Code", "메모리", "컨텍스트", "MCP", "SQLite", "ChromaDB"]
excerpt: "Claude Code 세션 간 맥락을 자동 포착·압축·재주입하는 영구 메모리 시스템. SQLite+ChromaDB 하이브리드 검색, MCP 3레이어 워크플로우. 47.7k 스타."
author: "큐레이터"
readTime: "7분"
image: null
---

## 소개

Claude-Mem은 Claude Code를 위한 영구 메모리 압축 시스템입니다. 세션 간 맥락을 자동으로 포착하고 AI로 압축하여 미래 세션에 관련 컨텍스트를 다시 주입합니다. 프로젝트에 대한 지식의 연속성을 유지하고, 세션이 끊기거나 재연결된 후에도 Claude가 이전 작업을 기억할 수 있습니다.

GitHub에서 47.7k 스타와 3.7k 포크를 달성한 이 프로젝트는 TypeScript 82.8%, JavaScript 11.2%, Shell 3.1%로 구성되어 있으며 AGPL-3.0 라이선스로 배포됩니다. 93명의 기여자 (Claude, Copilot 포함)가 활발하게 개발하고 있으며, v12.1.0이 최신 릴리즈입니다.

## 주요 기능

**영구 메모리:** 세션 간에도 맥락이 유지됩니다. `<private>` 태그로 민감한 내용을 저장에서 제외할 수 있습니다.

**점진적 공개(Progressive Disclosure):** 레이어된 메모리 검색과 토큰 비용 가시성. 필요한 만큼만 컨텍스트를 로드합니다.

**스킬 기반 검색:** `mem-search` 스킬로 자연어 쿼리로 프로젝트 히스토리 검색.

**웹 뷰어 UI:** [http://localhost:37777](http://localhost:37777/)에서 실시간 메모리 스트림.

**3-레이어 MCP 워크플로우:** 토큰 효율적인 검색 패턴으로 ~10배 토큰 절약.

**지속적 작동:** 수동 개입 없이 자동 운영. 5개 라이프사이클 훅이 모든 것을 처리합니다.

**인용 참조:** `<private>` 없이 저장된 관찰 항목을 ID로 참조. API나 웹 뷰어에서 접근.

**엔드리스 모드 (베타):** 생체 모방 메모리 아키텍처로 연장된 세션 지원.

## 동작 원리

Claude-Mem은 5개 라이프사이클 훅으로 동작합니다.

```
1. SessionStart      - 이전 메모리를 현재 세션에 주입
2. UserPromptSubmit  - 프롬프트 제출 시 컨텍스트 최적화
3. PostToolUse       - 도구 사용 후 관찰 항목 포착
4. Stop              - 세션 일시 중단 시 요약 생성
5. SessionEnd        - 세션 종료 시 메모리 압축 및 저장
```

**핵심 구성 요소:**
1. **5개 라이프사이클 훅** — SessionStart, UserPromptSubmit, PostToolUse, Stop, SessionEnd
2. **스마트 설치** — 캐시된 의존성 확인 (사전 훅 스크립트)
3. **Worker 서비스** — 포트 37777에서 HTTP API + 웹 뷰어 UI (10개 검색 엔드포인트), Bun으로 관리
4. **SQLite 데이터베이스** — 세션, 관찰 항목, 요약 저장
5. **mem-search 스킬** — 점진적 공개를 통한 자연어 쿼리
6. **Chroma 벡터 데이터베이스** — 시맨틱 + 키워드 하이브리드 검색

## MCP 3-레이어 워크플로우

Claude-Mem은 4개 MCP 도구를 통한 토큰 효율적 3-레이어 워크플로우를 제공합니다.

```javascript
// 1단계: 컴팩트 인덱스 검색 (~50-100 토큰/결과)
search(query="authentication bug", type="bugfix", limit=10)

// 2단계: 관심 있는 결과 주변의 시간순 컨텍스트
timeline(observation_id=123)

// 3단계: 필터링된 ID의 전체 세부 정보만 가져오기 (~500-1,000 토큰/결과)
get_observations(ids=[123, 456])

// → 필터링 전 가져오기 대비 ~10배 토큰 절약
```

**MCP 도구 목록:**
- `search` — 전문 쿼리로 메모리 인덱스 검색, 유형/날짜/프로젝트로 필터링
- `timeline` — 특정 관찰 항목이나 쿼리 주변의 시간순 컨텍스트
- `get_observations` — ID로 전체 관찰 세부 정보 가져오기 (항상 여러 ID 배치 처리)

## 설치 및 설정

```bash
# Claude Code에 설치 (권장)
npx claude-mem install

# Gemini CLI에 설치
npx claude-mem install --ide gemini-cli

# Claude Code 내 플러그인 마켓플레이스에서
/plugin marketplace add thedotmack/claude-mem
/plugin install claude-mem

# OpenClaw 게이트웨이 (원클릭)
curl -fsSL https://install.cmem.ai/openclaw.sh | bash
```

> 주의: `npm install -g claude-mem`은 SDK/라이브러리만 설치합니다. 플러그인 훅이나 Worker 서비스가 설정되지 않습니다. 항상 `npx claude-mem install`이나 `/plugin` 명령으로 설치하세요.

Claude Code 또는 Gemini CLI를 재시작하면 이전 세션의 컨텍스트가 새 세션에 자동으로 나타납니다.

## 시스템 요구 사항 및 설정

**요구 사항:**
- Node.js: 18.0.0 이상
- Claude Code: 플러그인 지원이 있는 최신 버전
- Bun: JavaScript 런타임 및 프로세스 관리자 (없으면 자동 설치)
- uv: 벡터 검색용 Python 패키지 관리자 (없으면 자동 설치)
- SQLite 3: 영구 저장용 (번들 포함)

**설정 파일:** `~/.claude-mem/settings.json` (첫 실행 시 기본값으로 자동 생성)
AI 모델, Worker 포트, 데이터 디렉토리, 로그 레벨, 컨텍스트 주입 설정을 구성합니다.

**버그 리포트 자동 생성:**
```bash
cd ~/.claude/plugins/marketplaces/thedotmack
npm run bug-report
```

## 마치며

Claude-Mem은 Claude Code의 가장 큰 한계 — 세션 간 메모리 부재 — 를 정면으로 해결합니다. 47.7k 스타라는 놀라운 지지가 이 문제의 보편성을 입증합니다.

MCP 3-레이어 워크플로우의 ~10배 토큰 절약, SQLite+Chroma 하이브리드 검색의 정확성, 완전 자동화된 훅 시스템의 편리함이 삼박자를 이룹니다. OpenClaw 게이트웨이와의 원클릭 통합, Telegram/Discord/Slack 실시간 관찰 피드, 엔드리스 모드 베타 기능까지 Claude Code 생태계의 핵심 인프라로 자리 잡아가고 있습니다.
