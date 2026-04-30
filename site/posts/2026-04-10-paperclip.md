---
title: "Paperclip: AI 에이전트를 위한 기업 오케스트레이션 플랫폼"
date: "2026-04-10"
category: "AI 에이전트"
tags: ["orchestration", "business", "AI"]
excerpt: "paperclipai의 Paperclip — OpenClaw가 직원이라면 Paperclip은 회사. AI 에이전트 조직을 위한 org chart, 예산, 거버넌스, 에이전트 코디네이션 플랫폼."
author: "큐레이터"
readTime: "6분"
image: null
---

## 소개

Paperclip은 paperclipai 팀이 개발한 **AI 에이전트 기업 오케스트레이션 플랫폼**입니다. 창시자들의 설명을 빌리면: *"OpenClaw가 직원이라면, Paperclip은 그 직원들이 일하는 회사입니다."* 개별 AI 에이전트(직원)를 조율하는 상위 레이어로, 에이전트 조직도(org chart), 예산 배분, 거버넌스, 에이전트 간 커뮤니케이션을 관리합니다.

현실적인 비유를 들면, 기업에 20개의 AI 에이전트가 있을 때 개발팀 에이전트와 마케팅 에이전트가 충돌하거나 중복 작업을 하거나 예산을 초과할 수 있습니다. Paperclip은 이들을 조율하는 **AI Chief of Staff** 역할을 합니다. 곧 출시 예정인 Clipmart는 사전 구축된 에이전트 패키지를 마켓플레이스에서 구매해 즉시 Paperclip 조직에 통합하는 기능입니다.

MIT 라이선스로 공개되어 있으며, AI 에이전트 오케스트레이션 문제를 "기업 조직 관리"의 프레임으로 접근한 독창적인 프로젝트입니다.

## 주요 기능

- **에이전트 조직도 (Org Chart)**: AI 에이전트들의 계층 구조와 보고 라인을 시각적 org chart로 표현합니다. CEO 에이전트 → 팀장 에이전트 → 실무 에이전트의 명령 체계를 구성합니다.
- **에이전트 예산 관리**: 각 에이전트 팀에 API 토큰 예산을 배분하고 실시간으로 추적합니다. 특정 팀이 예산을 초과하면 자동으로 스로틀링하거나 승인을 요청합니다.
- **거버넌스 규칙**: "고객 데이터에 접근하는 에이전트는 반드시 감사 로그를 남겨야 한다"처럼 조직 전체 에이전트에 적용되는 규칙을 정의합니다.
- **에이전트 간 커뮤니케이션**: 에이전트들이 서로의 결과물을 공유하고 협력하는 메커니즘을 제공합니다. A 에이전트의 출력이 B 에이전트의 입력으로 자동 연결됩니다.
- **태스크 위임 시스템**: 상위 에이전트가 하위 에이전트에게 태스크를 위임하고 결과를 집계합니다. 병렬 처리로 복잡한 조직적 태스크를 효율적으로 처리합니다.
- **Clipmart (예정)**: 사전 구축된 에이전트 패키지 마켓플레이스. "HR 에이전트 팀", "마케팅 에이전트 팀" 같은 패키지를 구매해 즉시 Paperclip 조직에 통합합니다.

### Org Chart — AI 에이전트의 기업 계층 구조

```
CEO Agent (전략 수립, 최종 의사결정)
    ├── CTO Agent (기술 방향, 아키텍처)
    │     ├── Backend Dev Agent
    │     ├── Frontend Dev Agent
    │     └── QA/Testing Agent
    ├── CMO Agent (마케팅 전략)
    │     ├── Content Writer Agent
    │     ├── SEO Analyst Agent
    │     └── Social Media Agent
    └── CFO Agent (예산 관리)
          └── Finance Data Agent
```

각 에이전트는 역할과 권한 범위, 사용 가능한 도구, 보고 대상이 명확하게 정의됩니다. 복잡한 프로젝트에서 올바른 에이전트에게 올바른 태스크가 할당됩니다.

### 예산 거버넌스 — AI 비용 제어

```yaml
# paperclip-config.yaml
organization:
  name: "My AI Company"
  monthly_budget: 500  # USD
  
teams:
  engineering:
    budget_allocation: 40%  # $200
    agents:
      - backend-dev-agent
      - frontend-dev-agent
    rules:
      - "코드 생성 전 반드시 테스트 계획 수립"
      - "외부 API 호출은 감사 로그 필수"
  
  marketing:
    budget_allocation: 30%  # $150
    agents:
      - content-writer-agent
      - seo-agent
```

예산 초과 시 해당 팀 에이전트의 활동이 자동으로 제한되고 알림이 발송됩니다.

## 기술 스택 / 아키텍처

| 항목 | 내용 |
|------|------|
| 라이선스 | MIT |
| 핵심 개념 | Org Chart, Budget, Governance, Delegation |
| 통합 | OpenClaw 및 기타 에이전트 프레임워크 |
| 예정 기능 | Clipmart (에이전트 마켓플레이스) |
| 설계 철학 | 에이전트를 직원처럼, Paperclip을 기업처럼 |

## 설치 / 사용법

```bash
# 저장소 클론
git clone https://github.com/paperclipai/paperclip
cd paperclip

# 의존성 설치
npm install  # 또는 pip install -r requirements.txt

# 조직 설정
cp config.example.yaml paperclip-config.yaml
# 에이전트 등록, 예산, 거버넌스 규칙 설정

# Paperclip 실행
paperclip start --config paperclip-config.yaml

# 에이전트 태스크 제출
paperclip task submit \
  --team engineering \
  --task "GraphQL 스키마를 분석하고 최적화 제안을 작성해줘" \
  --priority high
```

## 활용 사례 / 사용 시나리오

1. **스타트업 AI 에이전시 구성**: 5-10개의 다양한 AI 에이전트로 회사 전체 운영을 지원할 때, Paperclip으로 에이전트 팀을 조직하고 예산을 부서별로 배분합니다.

2. **엔터프라이즈 AI 거버넌스**: 규제 산업(금융, 의료)에서 AI 에이전트 활동을 통제할 때 Paperclip의 거버넌스 규칙으로 컴플라이언스를 자동화합니다. "환자 데이터 접근 로그 필수" 같은 규칙을 중앙에서 관리합니다.

3. **복잡한 멀티에이전트 프로젝트**: 웹 개발 프로젝트에 디자인, 프론트엔드, 백엔드, QA, 배포 에이전트가 필요할 때 Paperclip이 전체 태스크 흐름을 조율하고 결과를 집계합니다.

## 결론

Paperclip은 "에이전트 오케스트레이션을 기업 관리처럼"이라는 독창적인 프레임으로 접근한 프로젝트입니다. Org Chart, 예산 관리, 거버넌스의 기업 운영 개념을 AI 에이전트에 적용한 것이 직관적이고 확장 가능합니다. 곧 출시될 Clipmart 마켓플레이스는 에이전트 생태계에 새로운 비즈니스 모델을 도입합니다. AI 에이전트로 조직 운영을 자동화하려는 팀에게 유망한 플랫폼입니다.

---

> 원문: https://github.com/paperclipai/paperclip
