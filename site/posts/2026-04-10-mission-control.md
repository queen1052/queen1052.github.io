---
title: "Mission Control: Tinder 방식의 자율 제품 개발 엔진"
date: "2026-04-10"
category: "AI 에이전트"
tags: ["product", "autonomous", "Next.js"]
excerpt: "Autensa의 자율 제품 엔진(APE) — RESEARCH→BUILD→PR까지 8단계 자동화, Tinder 스타일 기능 우선순위 결정 인터페이스."
author: "큐레이터"
readTime: "6분"
image: null
---

## 소개

Mission Control은 Autensa가 개발한 **자율 제품 엔진(Autonomous Product Engine, APE)**입니다. 아이디어를 입력하면 AI가 시장 조사, 기능 아이데이션, 계획 수립, 구현, 테스트, PR 생성까지 전체 제품 개발 사이클을 자동화합니다. 단순한 코드 생성 도구가 아니라 제품 매니저, 엔지니어, QA가 협력하는 전체 워크플로우를 AI로 재현합니다.

특히 눈에 띄는 점은 **SWIPE 단계**입니다. Tinder처럼 카드를 좌우로 스와이프해서 AI가 제안한 기능을 수락하거나 거부합니다. 이 과정에서 사람의 취향과 비즈니스 컨텍스트가 에이전트 파이프라인에 주입되어, 완전히 자동화된 결과물이 사람의 의도와 맞닿아 있게 됩니다.

Next.js 프론트엔드, SQLite 데이터베이스, Docker 컨테이너 기반으로 구축되어 로컬 또는 클라우드 어디서나 배포 가능합니다. 스타트업이나 솔로 개발자가 빠른 MVP 개발에 활용하기 적합합니다.

## 주요 기능

- **8단계 완전 자동화 파이프라인**: RESEARCH → IDEATION → SWIPE → PLAN → BUILD → TEST → REVIEW → PR의 8단계가 순차적으로 자동 실행됩니다. 각 단계에서 사람이 개입하거나 자동으로 진행할지 설정할 수 있습니다.
- **Tinder 스타일 SWIPE UI**: AI가 제안한 기능 카드를 좌(거부)/우(수락)로 스와이프합니다. 직관적인 인터페이스로 수십 개의 기능 제안을 빠르게 필터링합니다. 사람의 취향이 파이프라인 전체에 반영됩니다.
- **시장 조사 자동화 (RESEARCH)**: 아이디어를 입력하면 에이전트가 경쟁사, 시장 크기, 기술 트렌드를 조사하고 요약 보고서를 생성합니다.
- **자동 기능 제안 (IDEATION)**: 시장 조사 결과를 바탕으로 MVP에 포함할 기능 후보를 생성합니다. 비즈니스 임팩트, 개발 복잡도, 차별화 포인트를 고려합니다.
- **Product Autopilot**: 모든 단계를 자동으로 진행하는 "오토파일럿" 모드. 사람의 개입 없이 아이디어에서 PR까지 완전 자동화됩니다.
- **자동 PR 생성**: BUILD와 TEST 단계를 거친 코드가 자동으로 GitHub Pull Request로 생성됩니다. PR 설명, 변경사항 요약, 테스트 결과가 자동으로 작성됩니다.

### 8단계 파이프라인 — 전체 제품 개발의 자동화

```
RESEARCH  →  시장 조사, 경쟁사 분석, 기술 트렌드 파악
    ↓
IDEATION  →  MVP 기능 후보 생성 (비즈니스 + 기술 관점)
    ↓
SWIPE     →  Tinder UI로 기능 수락/거부 (Human-in-the-Loop)
    ↓
PLAN      →  수락된 기능의 기술 스펙, 아키텍처, 일정 계획
    ↓
BUILD     →  코드 생성, 컴포넌트 구현
    ↓
TEST      →  단위 테스트, 통합 테스트 자동 실행
    ↓
REVIEW    →  코드 품질, 보안, 성능 자동 리뷰
    ↓
PR        →  GitHub Pull Request 자동 생성 및 제출
```

사람은 SWIPE 단계에서만 개입하거나(Human-in-the-Loop 모드), Product Autopilot으로 전체를 자동화할 수 있습니다.

### SWIPE — 사람과 AI의 최적 협력 지점

Tinder 스타일 SWIPE 인터페이스는 단순한 UX 아이디어가 아닙니다. AI가 생성한 수십 개의 기능 제안을 텍스트로 검토하는 것보다 카드 스와이프가 훨씬 빠르고 직관적입니다. 거부된 기능 패턴을 에이전트가 학습해 이후 제안의 품질이 향상됩니다.

## 기술 스택 / 아키텍처

| 항목 | 내용 |
|------|------|
| Frontend | Next.js |
| 데이터베이스 | SQLite |
| 컨테이너 | Docker |
| 파이프라인 | 8단계 APE |
| UI 패턴 | Tinder-style SWIPE |
| LLM | OpenAI / Anthropic (설정 가능) |

## 설치 / 사용법

```bash
# Docker로 빠른 시작
docker pull autensa/mission-control
docker run -p 3000:3000 \
  -e OPENAI_API_KEY=sk-... \
  -e GITHUB_TOKEN=ghp_... \
  autensa/mission-control

# 또는 소스에서 빌드
git clone https://github.com/crshdn/mission-control
cd mission-control
npm install
cp .env.example .env.local  # API 키 설정
npm run dev
```

접속 후 "New Project" → 아이디어 입력 → RESEARCH 단계 시작.

## 활용 사례 / 사용 시나리오

1. **솔로 개발자 MVP 빠른 제작**: 아이디어 단계에서 PR까지 몇 시간 안에 처리합니다. 특히 SWIPE 단계에서 핵심 기능을 빠르게 필터링하고, Product Autopilot으로 나머지를 자동화하면 혼자서도 빠른 MVP를 만들 수 있습니다.

2. **스타트업 프로덕트 리서치**: 신규 기능 방향을 결정할 때, 먼저 RESEARCH → IDEATION → SWIPE 단계만 실행해 AI 기반 기능 아이디어 브레인스토밍을 수행합니다. SWIPE에서 팀원들이 각자 투표해 합의를 도출합니다.

3. **기술 부채 처리**: 레거시 코드 리팩토링이나 기술 부채 해소 프로젝트에 활용합니다. PLAN 단계에서 AI가 기술 부채 목록을 생성하고, BUILD 단계에서 자동으로 코드를 개선하고 PR을 생성합니다.

## 결론

Mission Control은 AI 에이전트를 제품 개발 전체 사이클에 통합한 야심찬 프로젝트입니다. Tinder-style SWIPE UI는 "AI와 사람의 최적 협업 지점"에 대한 영리한 답변입니다. Next.js + SQLite + Docker 스택은 간단하고 배포가 쉬워 즉시 활용 가능합니다. 완전 자동화보다 "적절한 인간 개입"을 설계한 Product Autopilot과 Human-in-the-Loop의 균형이 실용적입니다.

---

> 원문: https://github.com/crshdn/mission-control
