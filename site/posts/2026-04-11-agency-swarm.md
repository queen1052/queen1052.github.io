---
title: "Agency Swarm: OpenAI Agents SDK 기반 신뢰성 높은 멀티 에이전트 오케스트레이션 프레임워크"
date: "2026-04-11"
category: "AI 에이전트"
tags: ["멀티 에이전트", "Agency Swarm", "OpenAI Agents SDK"]
excerpt: "CEO, 개발자, 어시스턴트 등 실제 조직 구조를 모방한 AI 에이전트 팀을 쉽게 구축하는 프레임워크. OpenAI Agents SDK를 확장해 방향성 있는 통신 흐름과 타입 안전 도구를 제공한다."
author: "큐레이터"
readTime: "7분"
image: null
---

## 소개: 실제 조직처럼 협력하는 AI 에이전트 팀

AI 에이전트 하나가 모든 것을 처리하는 시대는 지나가고 있다. 복잡한 워크플로우를 처리하려면 각자 전문성을 가진 에이전트들이 협력하는 구조가 필요하다. **Agency Swarm**은 바로 그 아이디어를 구현한 프레임워크다.

VRSEN(Arsenii Shatokhin)이 개발한 Agency Swarm은 GitHub 4.2k stars, Python 97.6%, MIT 라이선스로 공개되어 있다. 52개 릴리즈, 22명의 기여자를 보유한 성숙한 프로젝트다. OpenAI Agents SDK를 기반으로, CEO가 개발자에게 지시하고 개발자가 어시스턴트에게 도움을 요청하는 실제 조직 구조를 모방한 에이전트 협업 시스템을 제공한다.

## 주요 기능: 실제 조직 구조를 반영한 AI 협업

**커스터마이즈 가능한 에이전트 역할**이 핵심이다. CEO, 가상 어시스턴트, 개발자 등 각 에이전트에 독자적인 역할, 지침(instructions), 도구, 모델을 설정할 수 있다. OpenAI Agents SDK의 `FunctionTool` 형식을 기반으로 한다.

**방향성 있는 통신 흐름**이 Agency Swarm의 가장 독특한 특징이다. `>` 연산자로 에이전트 간 통신 방향을 명시적으로 정의한다:

```python
agency = Agency(
    ceo,  # 사용자와의 진입점
    communication_flows=[
        ceo > dev,  # CEO는 Developer에게 지시 가능
        ceo > va,   # CEO는 Virtual Assistant에게 지시 가능
        dev > va    # Developer는 Virtual Assistant에게 도움 요청 가능
    ],
)
```

왼쪽 에이전트만 오른쪽 에이전트에게 메시지를 시작할 수 있다. 이 단방향 구조가 에이전트 협업의 혼란을 방지한다.

**타입 안전 도구**는 Pydantic 모델로 자동 인수 검증을 제공한다. `@function_tool` 데코레이터(권장) 또는 `BaseTool` 상속 방식을 지원한다.

## 에이전트 정의 및 도구 개발 심층 분석

**도구 정의** 방법은 두 가지다. 현대적 방식인 `@function_tool` 데코레이터:

```python
from agency_swarm import function_tool

@function_tool
def my_custom_tool(example_field: str) -> str:
    """도구의 목적과 사용법을 명확히 설명하는 독스트링.
    에이전트가 이 도구를 언제 사용할지 판단하는 데 활용된다."""
    return f"Result: {example_field}"
```

`BaseTool` 상속 방식은 더 복잡한 도구에 적합하다:

```python
from agency_swarm.tools import BaseTool
from pydantic import Field

class MyCustomTool(BaseTool):
    """도구 설명 — 에이전트가 이를 읽고 사용 시점을 결정한다."""
    example_field: str = Field(..., description="필드 설명")
    
    def run(self):
        return "실행 결과"
```

OpenAPI 스키마에서 도구를 자동 변환하는 `ToolFactory.from_openapi_schema()`도 지원한다. 기존 REST API를 에이전트 도구로 즉시 래핑할 수 있다.

**에이전트 정의**는 역할별로 파일을 분리한다:

```python
from agency_swarm import Agent, ModelSettings

ceo = Agent(
    name="CEO",
    description="클라이언트 소통, 작업 계획 및 관리 담당",
    instructions="./instructions.md",  # 마크다운 파일 참조 가능
    tools=[my_custom_tool],
    model="gpt-5.4-mini",
    model_settings=ModelSettings(max_tokens=25000),
)
```

## 실행 및 폴더 구조

**실행 방법**은 세 가지를 지원한다. Web UI:

```python
agency.copilot_demo()
```

Terminal UI(첫 실행 시 자동 설정):

```python
agency.tui()
```

프로그래매틱(비동기, 권장):

```python
import asyncio

async def main():
    resp = await agency.get_response("프로젝트 스켈레톤을 생성해줘.")
    print(resp.final_output)

asyncio.run(main())
```

**권장 폴더 구조**는 에이전트별 디렉토리로 정리한다:

```
your-agency/
├── agency_manifesto.md     # 에이전시 공통 지침
└── CEO/
    ├── CEO.py              # 에이전트 클래스
    ├── instructions.md     # 역할 지침
    ├── tools/              # 도구 디렉토리
    └── __init__.py
```

**모델 호환성**: OpenAI GPT-5 계열, Claude(Anthropic), Gemini(Google), Grok(xAI), Azure OpenAI, OpenRouter 등을 LiteLLM 라우터를 통해 지원한다. Python 3.12+ 필요.

## 플렉서블 상태 관리 및 영속성

**대화 기록 영속성**은 `load_threads_callback`과 `save_threads_callback`을 `Agency`에 제공해 DB 또는 파일에 저장할 수 있다:

```python
agency = Agency(
    ceo,
    communication_flows=[ceo > dev],
    load_threads_callback=load_from_db,   # 이전 대화 로드
    save_threads_callback=save_to_db,     # 대화 저장
)
```

이 메커니즘으로 세션 간 에이전트 상태를 유지하고, 장기 실행 워크플로우에서 중단 후 재개가 가능하다. 기업 환경에서의 실제 배포에 적합한 기능이다.

## 설치 및 시작

```bash
# 설치
pip install -U agency-swarm

# 환경 변수 설정
export OPENAI_API_KEY="your_api_key"
# 또는 .env 파일에 OPENAI_API_KEY=your_key
```

**빠른 시작은 Agency Starter Template을 권장한다**:

```bash
git clone https://github.com/agency-ai-solutions/agency-starter-template
cd agency-starter-template
pip install -r requirements.txt
python agency.py
```

Cursor IDE 사용자는 `.cursorrules` 파일을 활용해 AI 코딩 에이전트로 Agency Swarm 코드를 작성할 수 있다. 공식 Cursor IDE 가이드: `agency-swarm.ai/welcome/getting-started/cursor-ide`.

## 마치며

Agency Swarm은 "실제 조직처럼 작동하는 AI 팀"이라는 직관적인 개념으로 멀티 에이전트 시스템 구축의 복잡성을 줄여준다. 방향성 있는 `>` 통신 흐름 연산자는 에이전트 협업의 혼란을 방지하는 우아한 해결책이다.

v1.x에서 OpenAI Agents SDK로 마이그레이션하면서 프로덕션 신뢰성이 크게 향상되었다. 비즈니스 자동화를 위한 커스텀 에이전트 팀이 필요하다면, Agency Swarm의 구조화된 접근 방식이 올바른 출발점이 될 것이다. 비즈니스 맞춤형 에이전트 구축이 필요하다면 vrsen.ai의 Agents-as-a-Service도 활용할 수 있다.

- GitHub: [VRSEN/agency-swarm](https://github.com/VRSEN/agency-swarm)
