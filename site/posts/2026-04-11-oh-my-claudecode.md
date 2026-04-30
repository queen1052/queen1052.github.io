---
title: "oh-my-claudecode: Claude Code를 위한 팀 퍼스트 멀티 에이전트 오케스트레이션"
date: "2026-04-11"
category: "AI 에이전트"
tags: ["Claude Code", "멀티 에이전트", "오케스트레이션"]
excerpt: "oh-my-claudecode(OMC)는 Claude Code를 위한 제로 학습 곡선의 멀티 에이전트 오케스트레이션 플랫폼입니다. 팀 모드, 오토파일럿, 울트라워크 등 다양한 실행 모드와 19개의 전문 에이전트, 스마트 모델 라우팅을 제공합니다."
author: "큐레이터"
readTime: "8분"
image: null
---

## oh-my-claudecode란 무엇인가?

Claude Code는 강력하지만 복잡한 멀티 에이전트 워크플로우를 직접 구성하는 것은 어렵습니다. 어떤 에이전트를 어떻게 조합할지, 어떻게 병렬로 실행할지, 결과를 어떻게 검증할지... 이 모든 것을 사용자가 수동으로 해야 한다면 생산성이 오히려 떨어집니다.

**oh-my-claudecode(OMC)**는 이 복잡함을 숨깁니다. "Don't learn Claude Code. Just use OMC." — 이 슬로건이 전부를 설명합니다. 자연어로 지시하면 OMC가 최적의 에이전트 팀을 구성하고, 병렬로 실행하고, 검증하고, 실패하면 수정합니다. GitHub 스타 27,500개 이상, TypeScript 57% + JavaScript 41.2%, MIT 라이선스, 92명의 기여자를 보유한 한국산 오픈소스입니다.

## 주요 기능 한눈에 보기

OMC가 Claude Code에 추가하는 핵심 가치:

- **제로 설정**: 설치 후 즉시 사용 가능한 지능형 기본값
- **팀 퍼스트 오케스트레이션**: Team이 정식 멀티 에이전트 표면
- **자연어 인터페이스**: 명령어 암기 불필요
- **자동 병렬화**: 복잡한 작업을 전문 에이전트들에게 자동 분배
- **비용 최적화**: 스마트 모델 라우팅으로 토큰 30-50% 절약
- **스킬 학습**: 세션에서 자동으로 재사용 가능한 패턴 추출
- **실시간 HUD**: 상태바에서 오케스트레이션 메트릭 실시간 확인

## 실행 모드 완전 가이드

OMC는 다양한 사용 케이스를 위한 여러 실행 모드를 제공합니다:

| 모드 | 방식 | 최적 사용 케이스 |
|------|------|----------------|
| Team (권장) | 단계별 파이프라인 (plan→prd→exec→verify→fix) | 조율된 에이전트 팀 |
| omc team (CLI) | tmux CLI 워커 (claude/codex/gemini 창) | Codex/Gemini 연동 |
| ccg | 트라이-모델 어드바이저 (Codex + Gemini + Claude) | 백엔드+UI 혼합 작업 |
| Autopilot | 자율 실행 (단일 리드 에이전트) | 엔드투엔드 기능 개발 |
| Ultrawork/ulw | 최대 병렬화 | 병렬 수정/리팩토링 |
| Ralph | 검증/수정 루프 지속 모드 | 완전 완료 보장 작업 |
| Pipeline | 순차적 단계별 처리 | 엄격한 순서 변환 |

## Team 모드와 tmux CLI 워커 심층 탐구

v4.1.7부터 Team이 OMC의 표준 오케스트레이션 표면입니다.

**내부 파이프라인**: `team-plan → team-prd → team-exec → team-verify → team-fix (루프)`

세션 내 명령어:
```
/team 3:executor "모든 TypeScript 오류 수정"
```

tmux CLI 워커(v4.4.0+)는 터미널에서 실제 claude/codex/gemini 프로세스를 분할 창에 스폰합니다:
```bash
omc team N:codex "..."    # N개의 Codex CLI 창
omc team N:gemini "..."   # N개의 Gemini CLI 창
/ccg                      # 트라이-모델 어드바이저
```

워커는 온디맨드로 생성되고 작업 완료 시 자동 종료됩니다. 유휴 리소스 낭비가 없습니다.

## 19개의 전문 에이전트와 스킬 시스템

OMC에는 19개의 전문 에이전트(티어 변형 포함)가 있습니다: 아키텍처, 리서치, 디자인, 테스팅, 데이터 사이언스 등. 스마트 모델 라우팅으로 단순 작업에는 Haiku, 복잡한 추론에는 Opus를 자동 선택합니다.

커스텀 스킬 시스템으로 세션에서 추출한 문제 해결 패턴을 재사용합니다:
```markdown
# .omc/skills/fix-proxy-crash.md
---
name: Fix Proxy Crash
description: aiohttp proxy crashes on ClientDisconnectedError
triggers: ["proxy", "aiohttp", "disconnected"]
source: extracted
---
```

## 기술 스택 및 아키텍처

- **언어**: TypeScript 57.0%, JavaScript 41.2%
- **라이선스**: MIT
- **플랫폼**: macOS, Ubuntu/Debian, Arch (tmux 필요), Windows (psmux 지원)
- **npm 패키지**: `oh-my-claude-sisyphus`
- **Claude Code 요구**: Max/Pro 구독 또는 Anthropic API 키

## 설치 및 사용법

### 마켓플레이스/플러그인 설치 (권장)

```
/plugin marketplace add https://github.com/Yeachan-Heo/oh-my-claudecode
/plugin install oh-my-claudecode
```

### npm 설치

```bash
npm i -g oh-my-claude-sisyphus@latest
```

### 설정 및 첫 사용

```bash
# 세션 내 설정
/setup
/omc-setup

# 터미널에서
omc setup

# 첫 번째 프로젝트 시작
/autopilot "작업 관리 REST API 구축"

# 요구사항이 불명확하면 소크라테스 인터뷰 먼저
/deep-interview "업무 관리 앱을 만들고 싶어"

# Claude Code 네이티브 팀 활성화
# ~/.claude/settings.json에 추가:
{
  "env": {
    "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS": "1"
  }
}
```

주요 인세션 키워드: `/autopilot`, `/team`, `/ultrawork`(ulw), `/ralplan`, `/deep-interview`, `deepsearch`, `ultrathink`, `ralph`, `stopomc`

## 마치며

oh-my-claudecode는 Claude Code의 잠재력을 최대한 끌어내는 멀티 에이전트 오케스트레이션 플랫폼입니다. 팀 기반 파이프라인, tmux CLI 워커, 트라이-모델 검증, 19개 전문 에이전트, 스킬 학습 시스템... 이 모든 것이 자연어 인터페이스로 제어됩니다. Yeachan Heo의 개인 레포에서 시작해 27,500개 스타, 92명 기여자, 214개 릴리스를 달성한 놀라운 성장세를 보여주고 있습니다. Claude Code 사용자라면 반드시 알아야 할 필수 도구입니다.
