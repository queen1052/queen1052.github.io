---
title: "Superpowers: Claude Code를 위한 15가지 스킬 라이브러리"
date: "2026-04-10"
category: "개발도구"
tags: ["Claude", "skills", "TDD"]
excerpt: "obra가 공개한 Claude Code 스킬 라이브러리 — TDD, 브레인스토밍, 디버깅, 병렬 에이전트 등 15가지 검증된 워크플로우 스킬."
author: "큐레이터"
readTime: "5분"
image: null
---

## 소개

Superpowers는 obra(Adam Spiers)가 공개한 **Claude Code 스킬 컬렉션**입니다. Claude Code에서 `/skills` slash command를 통해 전문화된 워크플로우를 즉시 활성화할 수 있습니다. 단순한 프롬프트 모음이 아니라 검증된 소프트웨어 엔지니어링 방법론(TDD, 체계적 디버깅, 병렬 에이전트 등)을 Claude Code에 이식한 구조화된 스킬 시스템입니다.

핵심 아이디어는 "모든 Claude 세션에서 처음부터 방법론을 설명하지 말자"입니다. 한 번 검증된 워크플로우를 스킬로 패키징하면, 이후 모든 프로젝트에서 `/skills/test-driven-development` 한 줄로 TDD 방법론을 가진 Claude를 즉시 소환할 수 있습니다. MIT 라이선스로 공개되어 자유롭게 수정하고 자신만의 스킬을 추가할 수 있습니다.

Superpowers는 Claude for Work 구독자가 Claude.ai에서 대규모 자율 에이전트 작업을 할 때도 동일하게 적용됩니다. 팀이 공통 스킬 라이브러리를 저장소에 커밋하면 모든 팀원이 동일한 수준의 AI 어시스턴트를 갖게 됩니다.

## 주요 기능

- **test-driven-development**: Red-Green-Refactor 사이클로 Claude가 작동하도록 합니다. 먼저 실패하는 테스트를 작성하고, 그 다음에만 구현 코드를 작성하는 원칙을 강제합니다.
- **systematic-debugging**: 버그 수정 전에 문제를 완전히 이해하는 체계적 접근법. 가정 기반 디버깅이 아닌 관찰-증거-분석 흐름을 따릅니다.
- **writing-plans**: 구현 시작 전에 상세한 행동 계획을 수립하고 사용자와 합의합니다. 작성 도중 방향을 잃는 문제를 방지합니다.
- **executing-plans**: 계획을 실행하며 각 단계를 명시적으로 추적합니다. 복잡한 작업에서 진행 상황을 투명하게 유지합니다.
- **brainstorming**: 아이디어 발산과 수렴을 구분하는 창의적 아이디어 생성 워크플로우. 너무 일찍 수렴하지 않고 다양한 관점을 탐색합니다.
- **dispatching-parallel-agents**: 독립적인 서브태스크를 병렬 Claude 에이전트로 위임하는 패턴. 복잡한 작업을 동시에 여러 에이전트가 처리해 속도를 높입니다.

### 7단계 기본 워크플로우

Superpowers는 스킬들을 순서대로 적용하는 **7단계 기본 워크플로우**를 권장합니다:

1. **Understand** — 요구사항과 컨텍스트를 명확히 파악
2. **Explore** — 코드베이스와 관련 컨텍스트 탐색
3. **Plan** — `writing-plans` 스킬로 상세 계획 수립
4. **Implement** — `executing-plans` 또는 `test-driven-development` 스킬로 구현
5. **Test** — 테스트 작성 및 실행
6. **Commit** — 의미 있는 커밋 메시지로 변경사항 저장
7. **Review** — 결과물 검토 및 다음 단계 계획

이 흐름을 따르면 Claude가 "무엇을 해야 하는지" 스스로 파악하는 시간보다 "어떻게 잘 할 것인지"에 더 많은 에너지를 쏟습니다.

### test-driven-development 스킬 — TDD를 Claude에 이식하기

TDD 스킬은 Claude가 항상 테스트 먼저 작성하도록 강제합니다:  
1. 요구사항 분석 → 엣지 케이스 목록 작성  
2. 실패하는 테스트 작성 (RED)  
3. 테스트를 통과하는 최소 코드 작성 (GREEN)  
4. 리팩토링 후 테스트 재실행 (REFACTOR)  

"구현 먼저, 테스트 나중"의 나쁜 습관을 Claude Code 세션에서 원천 차단합니다.

## 기술 스택 / 아키텍처

| 항목 | 내용 |
|------|------|
| 대상 | Claude Code, Claude.ai |
| 스킬 포맷 | Markdown (.md) |
| 설치 방식 | git clone → 프로젝트 루트 복사 |
| 라이선스 | MIT |
| 스킬 수 | 15+ |

스킬 구조:  
`skills/` 디렉토리 → 각 스킬별 `.md` 파일 → YAML 프론트매터(triggering 조건) + 스킬 본문

## 설치 / 사용법

```bash
# 저장소 클론
git clone https://github.com/obra/superpowers
cd superpowers

# 스킬 파일을 프로젝트에 복사
cp -r skills/ /path/to/your/project/skills/

# 또는 Git submodule로 추가
cd /path/to/your/project
git submodule add https://github.com/obra/superpowers .superpowers
ln -s .superpowers/skills skills
```

Claude Code에서 사용:
```
# TDD 스킬 활성화
/skills/test-driven-development

# 계획 수립 스킬
/skills/writing-plans

# 병렬 에이전트 파견
/skills/dispatching-parallel-agents
```

## 활용 사례 / 사용 시나리오

1. **팀 AI 워크플로우 표준화**: 팀의 `skills/` 디렉토리를 모노레포에 커밋합니다. 모든 팀원이 같은 스킬을 사용해 Claude Code 세션의 품질이 개인 프롬프팅 능력에 덜 의존하게 됩니다.

2. **복잡한 기능 개발**: `writing-plans` → `test-driven-development` → `executing-plans` 순서로 스킬을 적용해 대규모 기능 개발을 체계적으로 진행합니다. 각 단계에서 사람의 검토를 받을 수 있습니다.

3. **병렬 처리로 개발 가속화**: `dispatching-parallel-agents` 스킬을 사용해 독립적인 컴포넌트(UI, API, 테스트)를 동시에 여러 Claude 에이전트가 작업하도록 분배합니다.

## 결론

Superpowers는 Claude Code를 사용하는 개발자의 생산성을 즉시 높일 수 있는 실용적인 도구입니다. 소프트웨어 엔지니어링 베스트 프랙티스(TDD, 체계적 디버깅, 계획 기반 개발)를 AI 워크플로우에 통합하는 접근 방식이 돋보입니다. MIT 라이선스이므로 팀의 필요에 맞게 커스터마이징하거나 새 스킬을 추가하기 쉽습니다.

---

> 원문: https://github.com/obra/superpowers
