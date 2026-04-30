---
title: "Agent Orchestrator: 병렬 AI 코딩 에이전트를 위한 오케스트레이션 레이어"
date: "2026-04-11"
category: "AI 에이전트"
tags: ["AI 에이전트", "병렬 처리", "git worktree"]
excerpt: "Agent Orchestrator(ComposioHQ)는 병렬 AI 코딩 에이전트 플릿을 관리하는 오케스트레이션 플랫폼입니다. 각 에이전트는 독립된 git worktree를 갖고 자율적으로 CI 수정, PR 생성, 코드 리뷰 대응을 처리합니다."
author: "큐레이터"
readTime: "7분"
image: null
---

## Agent Orchestrator란 무엇인가?

터미널 하나에서 AI 에이전트 하나를 실행하는 것은 쉽습니다. 그런데 30개의 이슈를 서로 다른 브랜치에서 30개의 에이전트가 병렬로 처리하게 하려면? 이것은 완전히 다른 수준의 조율 문제입니다.

**Agent Orchestrator**는 이 문제를 해결합니다. Composio에서 만든 이 플랫폼은 AI 코딩 에이전트 플릿을 관리하는 오케스트레이션 레이어입니다. 각 에이전트는 독립된 git worktree와 브랜치, PR을 가지며 자율적으로 동작합니다. CI가 실패하면 에이전트가 수정하고, 리뷰어가 코멘트를 남기면 에이전트가 대응합니다. 인간의 개입은 최소화됩니다.

GitHub 스타 6,100개 이상, TypeScript 92.2% 기반, MIT 라이선스입니다.

## 주요 기능 한눈에 보기

Agent Orchestrator가 제공하는 핵심 가치:

- **병렬 에이전트 실행**: 여러 이슈를 동시에 독립된 worktree에서 처리
- **자동 CI 수정**: CI 실패 시 에이전트가 로그를 받아 자동 수정
- **리뷰 대응 자동화**: 코드 리뷰 코멘트 자동 처리
- **에이전트 무관 설계**: Claude Code, Codex, Aider 등 모두 지원
- **런타임 무관**: tmux, Docker 등 선택 가능
- **트래커 무관**: GitHub, Linear, GitLab 통합
- **웹 대시보드**: `http://localhost:3000`에서 실시간 상태 모니터링

## 작동 원리: 5단계 자동화 사이클

Agent Orchestrator의 자동화 사이클은 단순하면서 강력합니다:

1. **시작**: `ao start`로 대시보드와 오케스트레이터 에이전트 시작
2. **에이전트 생성**: 오케스트레이터가 각 이슈에 독립된 git worktree 내 에이전트 생성
3. **자율 작업**: 에이전트가 코드를 읽고, 테스트를 작성하고, PR을 생성
4. **피드백 처리**: CI 실패와 리뷰 코멘트가 자동으로 해당 에이전트에게 라우팅
5. **인간 검토**: PR 승인과 머지는 인간이 결정

이 사이클에서 인간은 최소한의 의사결정만 합니다. 나머지는 모두 자동화됩니다.

## 플러그인 아키텍처: 7개 슬롯의 완전한 커스터마이징

Agent Orchestrator의 가장 강력한 점은 7개의 플러그인 슬롯입니다. 라이프사이클은 코어에 유지되고, 각 레이어는 교체 가능합니다:

| 플러그인 | 기본값 | 대안 |
|---------|--------|------|
| Runtime | tmux | process |
| Agent | claude-code | codex, aider, cursor, opencode |
| Workspace | worktree | clone |
| Tracker | github | linear, gitlab |
| SCM | github | gitlab |
| Notifier | desktop | slack, discord, composio, webhook, openclaw |
| Terminal | iterm2 | web |

모든 인터페이스는 TypeScript로 정의됩니다. 플러그인은 인터페이스를 구현하고 `PluginModule`을 내보내면 됩니다.

## 설정 파일 상세

```yaml
# agent-orchestrator.yaml
port: 3000

defaults:
  runtime: tmux
  agent: claude-code
  workspace: worktree
  notifiers: [desktop]

projects:
  my-app:
    repo: owner/my-app
    path: ~/my-app
    defaultBranch: main
    sessionPrefix: app

reactions:
  ci-failed:
    auto: true
    action: send-to-agent
    retries: 2
  changes-requested:
    auto: true
    action: send-to-agent
    escalateAfter: 30m
  approved-and-green:
    auto: false  # true로 변경 시 자동 머지
    action: notify
```

## 기술 스택 및 아키텍처

- **언어**: TypeScript 92.2%, Shell 5.2%, CSS 2.3%
- **라이선스**: MIT
- **패키지 관리**: pnpm 모노레포
- **테스트**: 3,288개 테스트 케이스
- **사전 조건**: Node.js 20+, Git 2.25+, tmux, gh CLI

## 설치 및 사용법

```bash
# 설치
npm install -g @aoagents/ao

# 새 저장소에서 시작 (클론, 설정, 대시보드 실행 한번에!)
ao start https://github.com/your-org/your-repo

# 기존 로컬 저장소에서
cd ~/your-project && ao start

# 여러 프로젝트 추가
ao start ~/path/to/another-repo

# 개발 환경 구축
pnpm install && pnpm build   # 모든 패키지 설치 및 빌드
pnpm test                     # 테스트 실행 (3,288개)
pnpm dev                      # 웹 대시보드 개발 서버 시작
```

`ao start` 실행 후 `http://localhost:3000` 대시보드에서 에이전트 현황을 확인하고, 설정 파일 `agent-orchestrator.yaml`을 편집해 동작을 커스터마이징합니다.

## 마치며

Agent Orchestrator는 "AI 에이전트 하나"에서 "AI 에이전트 플릿"으로의 전환을 가능하게 합니다. 브랜치 생성, 에이전트 시작, CI 실패 확인, 리뷰 코멘트 전달, PR 추적, 완료 후 정리 등 모든 조율을 자동화합니다. 에이전트 무관, 런타임 무관, 트래커 무관 설계로 기존 워크플로우에 자연스럽게 통합됩니다. 6,100개 이상의 스타와 24명의 기여자로 빠르게 성장하는 이 프로젝트는 AI 보조 소프트웨어 개발의 새로운 패러다임을 제시합니다.
