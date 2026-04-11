---
title: "Everything Claude Code: 15만 Stars의 Claude Code 에코시스템 컬렉션"
date: "2026-04-11"
category: "AI 도구"
tags: ["ClaudeCode", "에이전트", "스킬", "훅", "개발도구"]
excerpt: "Claude Code를 위한 에이전트, 스킬, 훅, 룰, MCP 설정의 최대 컬렉션 - 15만 스타를 넘긴 커뮤니티 주도 리소스"
author: "큐레이터"
readTime: "6분"
image: null
---

## 소개

**Everything Claude Code (ECC)**는 Claude Code 에코시스템을 위한 커뮤니티 주도 컬렉션으로, 15만 GitHub 스타를 기록하며 Claude Code 사용자라면 알아야 할 가장 중요한 오픈소스 리소스가 되었습니다.

단순한 설정 파일 모음이 아닙니다. ECC는 에이전트, 스킬, 훅, 룰, MCP 서버 설정, 커스텀 커맨드를 통합한 **Claude Code 개발 방법론의 집대성**입니다. 초보자부터 고급 사용자까지, 단순 설치부터 엔터프라이즈급 워크플로우까지 커버합니다.

---

## 주요 기능

ECC의 방대한 콘텐츠:

- **31개 이상 슬래시 커맨드**: /plan, /tdd, /code-review, /orchestrate 등
- **30개 이상 스킬 (Codex)**: API 설계, TDD 워크플로우, E2E 테스팅 등
- **다국어 지원**: TypeScript, Python, Go, Swift, PHP, Rust, Java, Kotlin
- **AgentShield 보안 감사**: 1282 테스트, 98% 커버리지
- **Continuous Learning v2**: 에이전트가 세션에서 패턴을 자동 학습
- **멀티 플랫폼**: Claude Code, Codex, OpenCode, Cursor, Gemini CLI, Trae 지원
- **ECC 2.0 Alpha**: Rust 컨트롤 플레인 프로토타입

---

## 핵심 기능 1: 스킬 라이브러리

ECC의 스킬은 AI 에이전트가 특정 워크플로우를 올바르게 실행하도록 안내하는 도메인 지식 파일들입니다:

**개발 스킬:**
- `coding-standards` — 언어 모범 사례
- `tdd-workflow` — 80% 커버리지 요구 TDD
- `e2e-testing` — Playwright E2E 테스팅
- `backend-patterns` — API, DB, 캐시 패턴
- `frontend-patterns` — React, Next.js 패턴
- `docker-patterns` — Docker Compose, 보안

**리서치 및 콘텐츠:**
- `deep-research` — 멀티 소스 리서치 및 합성
- `article-writing` — AI 톤 없는 장문 작성
- `market-research` — 출처 추적 시장 분석

**비즈니스:**
- `investor-materials` — 덱, 메모, 재무 모델
- `investor-outreach` — 개인화된 아웃리치
- `content-engine` — 멀티 플랫폼 콘텐츠 배포

---

## 핵심 기능 2: 훅 시스템과 AgentShield

**훅 아키텍처:**
세션 이벤트에 반응하는 자동화 트리거:

- `memory-persistence/`: 세션 시작/종료 컨텍스트 로드/저장
- `strategic-compact/`: 컨텍스트 압축 제안
- `evaluate-session.js`: 세션에서 패턴 추출
- PreToolUse/PostToolUse/Stop 이벤트 지원

**AgentShield 보안 감사:**
```bash
# 즉시 스캔 (설치 불필요)
npx ecc-agentshield scan

# 안전한 이슈 자동 수정
npx ecc-agentshield scan --fix

# Opus 4.6 에이전트 3개로 심층 분석
npx ecc-agentshield scan --opus --stream
```
102개 정적 분석 룰로 Claude Code 설정의 취약점, 잘못된 구성, 프롬프트 인젝션 위험 감지

**Continuous Learning v2:**
```
/instinct-status        # 학습된 instinct 신뢰도 표시
/instinct-import <file> # 다른 사용자의 instinct 가져오기
/evolve                 # 관련 instinct를 스킬로 클러스터링
```

---

## 기술 스택 및 아키텍처

**지원 AI 도구:**
Claude Code, Codex, OpenCode, Cursor, Gemini CLI, GitHub Copilot CLI, Trae 등

**Codex 포함 콘텐츠:**
- 설정 1개 (`.codex/config.toml`)
- AGENTS.md 2개 (루트 + Codex 전용)
- 스킬 30개 (`.agents/skills/`)
- MCP 서버 6개 (GitHub, Context7, Exa, Memory, Playwright, Sequential Thinking)
- 2개 프로파일 (strict 읽기 전용, yolo 완전 자동 승인)

---

## 설치 및 사용법

**플러그인으로 설치 (권장):**
```bash
# Claude Code에서
claude mcp add ecc-tools -t http https://ecc-tools.dev/mcp

# npm 패키지
npm install ecc-universal
# opencode.json에 추가: {"plugin": ["ecc-universal"]}
```

**수동 설치:**
```bash
git clone https://github.com/affaan-m/everything-claude-code.git
npm install  # 의존성 설치

# 전체 프로파일 설치
./install.sh --profile full

# 특정 언어만
./install.sh typescript python
```

**토큰 최적화 (빠른 설정):**
```json
// ~/.claude/settings.json
{
  "model": "sonnet",
  "env": {
    "MAX_THINKING_TOKENS": "10000",
    "CLAUDE_AUTOCOMPACT_PCT_OVERRIDE": "50",
    "CLAUDE_CODE_SUBAGENT_MODEL": "haiku"
  }
}
```

---

## 마치며

Everything Claude Code는 Claude Code 커뮤니티의 집단 지식이 집약된 리포지토리입니다. 15만 이상의 스타, 156명의 기여자, 694개의 릴리스가 이 프로젝트의 활력을 보여줍니다. Claude Code를 사용하는 개발자라면 이 리포지토리를 탐색하고, 필요한 부분만 선택해 자신의 워크플로우에 통합하는 것을 적극 추천합니다.

GitHub: [https://github.com/affaan-m/everything-claude-code](https://github.com/affaan-m/everything-claude-code)
