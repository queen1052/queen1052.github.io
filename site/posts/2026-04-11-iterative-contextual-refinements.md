---
title: "Iterative Studio: BFS/DFS로 LLM 솔루션 탐색 공간을 확장하는 멀티에이전트 시스템"
date: "2026-04-11"
category: "AI 에이전트"
tags: ["멀티에이전트", "LangGraph", "반복정제"]
excerpt: "Deepthink·Contextual·Agentic 5가지 모드로 BFS/DFS 탐색 기법을 LLM에 적용, 2시간 무인 자율 실행이 가능한 反복 컨텍스트 정제 시스템."
author: "큐레이터"
readTime: "8분"
image: null
---

## 소개

**Iterative Studio**(Iterative-Contextual-Refinements)는 BFS(너비 우선 탐색)와 DFS(깊이 우선 탐색) 알고리즘을 LLM 추론에 적용하여 솔루션 탐색 공간을 대규모로 탐색하는 멀티에이전트 시스템입니다.

GitHub에서 408개의 스타를 기록했으며, TypeScript 81.1%, CSS 18.8%로 구성된 React 19 기반 웹 애플리케이션입니다. Apache-2.0 라이선스로 공개되었습니다.

가장 주목할 특징은 Contextual 모드에서의 **2시간 무인 자율 실행** 능력입니다. 어려운 문제에 대해 인간 개입 없이 2시간 동안 실행하면서 고품질 결과를 산출할 수 있습니다.

## 주요 기능

- **5가지 동작 모드**: Deepthink, Adaptive Deepthink, Contextual, Refine, Agentic
- **2시간 자율 실행**: Contextual 모드에서 인간 개입 없이 장시간 고품질 작업 처리
- **BFS/DFS 탐색**: 트리 탐색 알고리즘으로 다수 솔루션 경로 동시 탐색
- **LangGraph 통합**: Agentic·Adaptive Deepthink 모드에서 LangGraph 에이전트 그래프 활용
- **완전 오프라인**: 로컬 모델(LM Studio/Ollama)로 인터넷 없이 실행 가능
- **멀티 AI 제공자**: Google AI, OpenAI, Anthropic, 로컬 모델 모두 지원

## 5가지 모드 상세 분석

**1. Deepthink 모드**: 문제를 주요 전략과 하위 전략으로 분해하는 다중 에이전트 파이프라인. Strategy Generation → Sub-Strategy → Solution → Critique → Refinement → Red Team → Final Judge 순서로 진행. 레드팀이 약한 솔루션을 필터링하고 최종 심판이 최적 솔루션을 선택합니다.

**2. Adaptive Deepthink 모드**: Deepthink의 완전한 기능을 대화형 에이전트에 제공. AI가 대화 중 필요할 때 Deepthink 도구를 자율적으로 호출합니다.

**3. Contextual 모드**: 세 에이전트 협력 시스템. Main Generator → Iterative Agent → Memory Agent의 사이클로 최대 2시간 무인 실행. 컨텍스트 한계 도달 시 Memory Agent가 히스토리를 자동 압축합니다.

**4. Refine 모드**: 기능 제안 에이전트와 버그 수정 에이전트가 반복적으로 개선하는 전통적 정제 파이프라인.

**5. Agentic 모드**: LangGraph 기반 도구 루프. `multi_edit`, `read_current_content`, `verify_current_content`, `searchacademia`(arXiv 검색) 도구로 구조적 편집 수행.

## BFS/DFS 탐색의 원리

전통적인 단일 LLM 호출은 하나의 솔루션 경로만 탐색합니다. Iterative Studio는 이를 트리 탐색으로 확장합니다.

Deepthink 모드에서 5개 전략 × 3개 하위 전략이면 15개의 솔루션 후보를 병렬 생성합니다(BFS). 각 후보는 Critique-Refinement 사이클을 반복하면서 깊이 개선됩니다(DFS). Red Team 필터링으로 약한 경로를 가지치기하고, Final Judge가 최선을 선택합니다.

이 접근법은 복잡한 수학 증명, 코드 아키텍처 설계, 연구 방법론 수립 같이 하나의 최적 답변이 필요한 문제에서 단순 프롬프팅 대비 현저히 높은 품질을 보입니다.

## 기술 스택 및 아키텍처

- **언어**: TypeScript 81.1%, CSS 18.8%
- **라이선스**: Apache-2.0
- **프레임워크**: React 19, Vite
- **에이전트**: LangGraph (@langchain/core)
- **AI 제공자**: Google AI, OpenAI, Anthropic SDK
- **수식 렌더링**: KaTeX
- **diff 시각화**: diff2html
- **상태 저장**: .gz 파일 내보내기/불러오기

## 설치 및 사용법

```bash
# 저장소 클론
git clone https://github.com/ryoiki-tokuiten/Iterative-Contextual-Refinements.git
cd Iterative-Contextual-Refinements

# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
# → http://localhost:5173
```

로컬 모델(완전 오프라인) 사용:
```
1. LM Studio 설치 및 모델 로드
2. LM Studio에서 서버 시작 (http://127.0.0.1:1234)
3. 앱에서 로컬 모델 선택
4. WiFi 끊고 Iterative Studio 사용
```

## 마치며

**Iterative Studio**는 "LLM 한 번 호출"의 한계를 체계적으로 극복하려는 야심찬 시도입니다. BFS/DFS 탐색, Red Team 필터링, 2시간 자율 실행이라는 조합은 단순한 프롬프트 체이닝이 아닌 본격적인 계산 최적화입니다. 특히 Contextual 모드의 장시간 자율 실행 능력은 복잡한 연구·설계 프로젝트에서 진정한 AI 협업 파트너 역할을 할 수 있음을 보여줍니다.
