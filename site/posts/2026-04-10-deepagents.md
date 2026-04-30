---
title: "DeepAgents: LangChain과 LangGraph 기반 심층 리서치 에이전트"
date: "2026-04-10"
category: "AI 에이전트"
tags: ["LangChain", "LangGraph", "Python"]
excerpt: "LangChain이 공개한 DeepAgents — 웹 검색과 파일시스템을 도구로 활용하는 계획형 심층 리서치 에이전트, uv 한 줄로 설치 완료."
author: "큐레이터"
readTime: "5분"
image: null
---

## 소개

DeepAgents는 LangChain 팀이 공개한 **심층 리서치(Deep Research) 에이전트 프레임워크**입니다. `uv add deepagents` 한 줄로 설치할 수 있으며, LangChain의 방대한 도구 생태계와 LangGraph의 강력한 에이전트 오케스트레이션을 기반으로 합니다. 최신 uv 패키지 매니저를 기본 지원해 빠른 설치가 가능합니다.

DeepAgents의 핵심인 Planning Tool은 복잡한 리서치 태스크를 서브태스크로 분해하고 실행 계획을 수립합니다. 계획이 세워지면 서브에이전트들이 병렬로 웹 검색, 파일 읽기, 코드 실행 등을 수행하고 결과를 통합합니다. 장기 대화에서 토큰 비용이 폭증하는 문제를 막기 위한 **Auto-Summarization** 기능이 내장되어 있습니다.

MCP(Model Context Protocol) 지원을 위해 `langchain-mcp-adapters`를 통합하여 다양한 외부 도구와 표준화된 방식으로 연결할 수 있습니다. Filesystem Backend와 결합하면 로컬 파일 시스템을 에이전트의 지식 저장소로 활용합니다.

## 주요 기능

- **Planning Tool**: 복잡한 리서치 질문을 계층적 서브태스크로 분해합니다. 각 서브태스크의 의존성을 파악하고 실행 순서와 병렬화 가능한 태스크를 결정합니다.
- **Filesystem Backend**: 에이전트가 파일을 읽고, 쓰고, 수정하는 도구를 제공합니다. 리서치 중간 결과물을 파일에 저장하고 후속 에이전트가 참조합니다.
- **Auto-Summarization**: 대화 기록이 설정한 길이를 초과하면 자동으로 이전 컨텍스트를 요약합니다. 장기 리서치 세션에서 토큰 비용을 제어합니다.
- **MCP 통합**: `langchain-mcp-adapters`를 통해 MCP 규격의 외부 도구(데이터베이스, 웹 서비스, 전용 API)를 에이전트 도구로 즉시 연결합니다.
- **서브에이전트 파견**: 메인 에이전트가 독립적인 서브태스크를 별도 에이전트에게 위임합니다. 병렬 처리로 리서치 속도를 높입니다.
- **LangGraph 기반 워크플로우**: 복잡한 에이전트 상태 관리, 분기, 루프를 LangGraph 그래프로 정의합니다. 에이전트 실행 흐름을 명시적으로 제어합니다.

### Planning Tool — 복잡한 리서치의 자동 분해

"2025년 AI 에이전트 프레임워크 비교 리포트를 작성해줘"라는 요청을 받으면:

```
계획 수립:
  1. [독립] 주요 프레임워크 목록 수집 (웹 검색)
  2. [독립] 각 프레임워크 GitHub 통계 수집 (웹 검색 × N)
  3. [의존: 1,2] 기능 비교 매트릭스 작성
  4. [독립] 최근 커뮤니티 토론 수집 (HN, Reddit)
  5. [의존: 3,4] 종합 비교 리포트 작성
  6. [의존: 5] 마크다운 파일로 저장

병렬 실행: 1, 2, 4 동시 실행
순차 실행: 3(1,2 완료 후) → 5(3,4 완료 후) → 6
```

플래너가 이 계획을 생성하고 스케줄러가 최적 순서로 실행합니다.

### Auto-Summarization — 토큰 비용 제어

장기 리서치 세션에서는 대화 기록이 수만 토큰에 달할 수 있습니다. DeepAgents의 Auto-Summarization은 컨텍스트 길이가 설정 임계값(예: 16k 토큰)을 초과하면 이전 대화를 자동으로 요약해 압축합니다. 중요한 정보는 요약에 포함하고 반복적인 내용은 제거합니다. 토큰 비용을 최대 70% 절감하면서 리서치 연속성을 유지합니다.

## 기술 스택 / 아키텍처

| 항목 | 내용 |
|------|------|
| 패키지 | `uv add deepagents` |
| 기반 | LangChain, LangGraph |
| 도구 | Filesystem, 웹 검색, MCP |
| 컨텍스트 | Auto-Summarization |
| LLM | OpenAI, Anthropic, 기타 LangChain 지원 모델 |
| 라이선스 | MIT |

## 설치 / 사용법

```bash
# uv로 설치 (권장)
uv add deepagents

# 또는 pip
pip install deepagents

# 환경 변수 설정
export OPENAI_API_KEY=sk-...
export TAVILY_API_KEY=tvly-...  # 웹 검색 도구

# Python에서 사용
from deepagents import DeepResearchAgent

agent = DeepResearchAgent(
    llm="gpt-4o",
    tools=["filesystem", "web_search"],
    max_context_tokens=16000,  # Auto-summarization 임계값
    enable_subagents=True,
)

result = agent.research(
    "LangChain vs LlamaIndex 2025년 비교 분석 리포트를 작성해줘",
    output_file="research_report.md"
)
print(result.summary)
```

## 활용 사례 / 사용 시나리오

1. **자동 리서치 리포트 생성**: 경쟁사 분석, 기술 트렌드 조사, 시장 조사를 DeepAgents에게 맡깁니다. 플래너가 리서치 계획을 세우고 서브에이전트들이 병렬로 데이터를 수집해 종합 보고서를 작성합니다.

2. **코드베이스 분석**: Filesystem Backend를 활용해 로컬 저장소를 읽고 아키텍처 분석, 코드 품질 리포트, 리팩토링 제안을 자동 생성합니다. 대규모 레거시 코드베이스 이해에 특히 유용합니다.

3. **데이터 파이프라인 에이전트**: MCP를 통해 데이터베이스, 외부 API와 연결하고 복잡한 데이터 수집·변환·분석 파이프라인을 에이전트로 자동화합니다.

## 결론

DeepAgents는 LangChain 생태계의 강점(방대한 도구 라이브러리)과 LangGraph의 에이전트 흐름 제어를 결합한 실용적인 리서치 에이전트입니다. `uv add deepagents` 한 줄 설치, Auto-Summarization의 비용 제어, MCP 통합이 특히 인상적입니다. 복잡한 리서치나 분석 태스크를 자동화하려는 개발자에게 즉시 활용 가능한 강력한 도구입니다.

---

> 원문: https://github.com/langchain-ai/deepagents
