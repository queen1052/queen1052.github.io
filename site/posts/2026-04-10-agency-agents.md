---
title: "Agency Agents: 완전한 AI 에이전시를 위한 100+ 전문 에이전트"
date: "2026-04-10"
category: "AI 에이전트"
tags: ["multi-agent", "Claude", "agency"]
excerpt: "실제 에이전시처럼 구성된 AI 에이전트 팀 — 제품, 엔지니어링, 디자인, 마케팅, 영업 부문별 100개 이상의 전문 AI 에이전트."
author: "큐레이터"
readTime: "6분"
image: null
---

## 소개

Agency Agents는 msitarzewski가 공개한 **AI 에이전시 구조 에이전트 컬렉션**입니다. 이 프로젝트의 독특한 점은 에이전트를 단순히 나열하는 대신 **실제 회사의 부서 구조**를 그대로 모방했다는 것입니다. 제품팀, 엔지니어링팀, 디자인팀, 마케팅팀, 영업팀 등 각 부서마다 전문화된 AI 에이전트가 배치됩니다.

"Sprint Prioritizer", "Trend Researcher", "Whimsy Injector", "Reality Checker"처럼 실제 에이전시에서 필요로 하는 구체적이고 재미있는 역할들이 구현되어 있습니다. 이 에이전트들을 Claude Code나 다른 AI 플랫폼에 연결하면, 혼자서도 실제 에이전시 팀이 수행하는 다양한 작업을 AI로 처리할 수 있습니다.

`install.sh` 스크립트 하나로 전체 에이전트 라이브러리를 설치하고 바로 사용할 수 있습니다. 소규모 스타트업부터 프리랜서까지, 다양한 분야의 전문 AI 어시스턴트가 필요한 사람들에게 즉시 활용 가능한 스터팅 포인트를 제공합니다.

## 주요 기능

- **부서 구조 기반 에이전트 조직**: 실제 에이전시처럼 Product, Engineering, Design, Marketing, Sales, Operations, Finance 부서로 에이전트가 분류됩니다. 필요한 부서의 에이전트만 선택적으로 설치할 수 있습니다.
- **Sprint Prioritizer**: 백로그 아이템을 비즈니스 임팩트, 기술 부채, 팀 역량을 고려해 우선순위를 정렬합니다. Jira/Trello 연동도 가능합니다.
- **Trend Researcher**: 업계 최신 트렌드를 수집하고 분석해 주간 인사이트 보고서를 자동 생성합니다. 소셜 미디어, 뉴스, GitHub 트렌드를 통합 분석합니다.
- **Whimsy Injector**: 지나치게 딱딱하거나 기술적인 콘텐츠에 창의성과 유머를 불어넣는 에이전트. 마케팅 카피, 소셜 포스트 작성에 유용합니다.
- **Reality Checker**: 지나치게 낙관적인 계획이나 주장을 검토하고 리스크와 가정을 명시적으로 드러냅니다. 제품 로드맵 검증에 특히 효과적입니다.
- **100+ 전문 에이전트**: Claude Code 기반으로 각 에이전트가 특정 역할에 최적화된 시스템 프롬프트를 가집니다.

### 부서별 주요 에이전트 — 실제 에이전시 역할 AI화

**Product Division:**
- Product Researcher — 시장 조사 및 경쟁사 분석
- Feature Architect — 기능 요구사항을 기술 스펙으로 변환
- Sprint Prioritizer — 스프린트 계획 및 백로그 우선순위

**Engineering Division:**
- Code Reviewer — PR 리뷰 자동화
- Tech Debt Auditor — 기술 부채 분석 및 개선 계획
- API Designer — RESTful/GraphQL API 설계 가이드

**Design Division:**
- UX Auditor — 사용자 경험 문제점 식별
- Whimsy Injector — 창의적 표현 강화
- Brand Guardian — 브랜드 일관성 유지

**Marketing Division:**
- Content Strategist — 콘텐츠 캘린더 및 전략 수립
- SEO Analyst — 검색 최적화 분석
- Trend Researcher — 업계 동향 파악

### install.sh — 원클릭 에이전트 설치

```bash
# 전체 설치
bash install.sh

# 특정 부서만 설치
bash install.sh --division engineering

# 개별 에이전트 설치
bash install.sh --agent sprint-prioritizer
```

설치 후 에이전트는 Claude Code의 `@` 멘션 또는 MCP 서버로 호출됩니다.

## 기술 스택 / 아키텍처

| 항목 | 내용 |
|------|------|
| 플랫폼 | Claude Code, MCP |
| 에이전트 수 | 100+ |
| 설치 | install.sh 스크립트 |
| 에이전트 포맷 | Markdown 시스템 프롬프트 |
| 라이선스 | MIT |

에이전트 구조:  
`agents/<division>/<agent-name>.md` → 시스템 프롬프트 + 역할 정의 + 예시 입출력

## 설치 / 사용법

```bash
# 저장소 클론
git clone https://github.com/msitarzewski/agency-agents
cd agency-agents

# 전체 에이전트 설치
bash install.sh

# Claude Code에서 에이전트 호출
# @sprint-prioritizer 백로그를 분석하고 이번 스프린트 우선순위를 정해줘
# @trend-researcher 2025년 AI 에이전트 프레임워크 트렌드를 조사해줘
# @reality-checker 이 제품 로드맵의 리스크를 분석해줘
```

특정 에이전트만 직접 사용하려면 해당 `.md` 파일의 내용을 Claude 시스템 프롬프트에 붙여넣기 할 수 있습니다.

## 활용 사례 / 사용 시나리오

1. **솔로 스타트업/프리랜서**: 혼자 일하지만 다양한 전문 역할이 필요할 때. Product Researcher로 경쟁사를 분석하고, Feature Architect로 스펙을 작성하고, Content Strategist로 마케팅 계획을 세우는 전체 파이프라인을 AI로 처리합니다.

2. **AI 에이전시 서비스**: 클라이언트별로 맞춤화된 에이전트 팀을 구성해 제공합니다. 기본 에이전트 라이브러리 위에 클라이언트 도메인 지식을 추가해 빠르게 특화된 서비스를 구축합니다.

3. **스타트업 팀 생산성 향상**: 소규모 팀이 각 부서 역할의 에이전트를 선택해 업무에 통합합니다. 회의 준비, 보고서 작성, 코드 리뷰, 마케팅 카피 작성을 에이전트가 지원합니다.

## 결론

Agency Agents는 AI 에이전트를 실제 업무 구조에 맞게 조직화했다는 점에서 차별화됩니다. "무엇을 해야 하는지 알지만 사람이 없을 때", AI 에이전시를 즉시 구성할 수 있는 실용적인 솔루션입니다. 100개 이상의 검증된 에이전트가 즉시 사용 가능하며, MIT 라이선스로 팀의 도메인에 맞게 자유롭게 커스터마이징할 수 있습니다.

---

> 원문: https://github.com/msitarzewski/agency-agents
