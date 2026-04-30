---
title: "PraisonAI: 5줄 코드로 24/7 AI 인력 배치하기"
date: "2026-04-11"
category: "AI 프레임워크"
tags: ["PraisonAI", "멀티에이전트", "Python"]
excerpt: "100개 이상 LLM을 지원하는 멀티에이전트 AI 프레임워크 - Elon Musk도 주목한 5줄 코드 에이전트 배포"
author: "큐레이터"
readTime: "6분"
image: null
---

## 소개

**PraisonAI**는 "24/7 AI 인력을 고용하라"는 컨셉으로 만들어진 멀티에이전트 AI 프레임워크입니다. 보일러플레이트 없이 5줄의 코드만으로 연구, 계획, 코드 작성, 작업 실행을 자율적으로 수행하는 에이전트를 배포할 수 있습니다.

이 프로젝트는 Elon Musk가 자신의 X 계정에 PraisonAI 관련 콘텐츠를 인용하며 소개할 정도로 주목받은 프레임워크입니다.

OpenAI, Anthropic, Gemini를 비롯한 100개 이상의 LLM을 지원하며, 4μs 미만의 에이전트 인스턴스화 속도로 대규모 멀티에이전트 시스템도 효율적으로 운영할 수 있습니다.

---

## 주요 기능

PraisonAI의 풍부한 기능들:

- **MCP 프로토콜**: stdio, HTTP, WebSocket, SSE 전송 방식 지원
- **플래닝 모드**: plan → execute → reason 자율 계획
- **딥 리서치**: 멀티스텝 자율 리서치 에이전트
- **외부 에이전트 오케스트레이션**: Claude Code, Gemini CLI, Codex 조율
- **에이전트 핸드오프**: seamless 대화 전달 (`handoff=True`)
- **가드레일**: 입/출력 검증
- **자기 반성**: 에이전트가 자신의 출력을 검토
- **워크플로우 패턴**: route, parallel, loop, repeat
- **메모리 (제로 의존성)**: `memory=True`로 즉시 활성화
- **언제나 실행 예약**: 24/7 스케줄링

---

## 핵심 기능 1: PraisonAI 생태계

PraisonAI는 단일 패키지가 아닌 완전한 생태계입니다:

**Core SDK (순수 Python 개발):**
```bash
pip install praisonaiagents
export OPENAI_API_KEY="your-api-key"
```

```python
from praisonaiagents import Agent
agent = Agent(instructions="You are a senior data analyst.")
agent.start("2026년 상위 3가지 AI 트렌드를 마크다운 표로 분석해줘")
```

**PraisonAI CLI (터미널 개발자용):**
```bash
pip install praisonai
```

**Claw Dashboard (Telegram/Slack/Discord):**
```bash
pip install "praisonai[claw]"
praisonai claw
# http://localhost:8082 — Chat, Agents, Memory, Knowledge 등 13개 페이지
```

**Flow Visual Builder (드래그앤드롭):**
```bash
pip install "praisonai[flow]"
praisonai flow
# http://localhost:7861
```

**JavaScript SDK:**
```bash
npm install praisonai
```

---

## 핵심 기능 2: 멀티에이전트 협업과 MCP 통합

**2개 에이전트 협업 (YAML):**
```yaml
framework: praisonai
topic: "AI에 관한 블로그 포스트 작성"

agents:
  researcher:
    role: Research Analyst
    goal: AI 트렌드 조사
    instructions: "정확한 AI 트렌드 정보 수집"
    
  writer:
    role: Content Writer
    goal: 매력적인 블로그 포스트 작성
    instructions: "연구를 바탕으로 명확한 콘텐츠 작성"
```

**MCP 도구 연동:**
```python
from praisonaiagents import Agent, MCP

agent = Agent(
    tools=MCP(
        command="npx",
        args=["-y", "@modelcontextprotocol/server-brave-search"],
        env={"BRAVE_API_KEY": "your-key"}
    )
)
```

**커스텀 도구:**
```python
from praisonaiagents import Agent, tool

@tool
def search(query: str) -> str:
    """웹에서 정보를 검색합니다."""
    return f"Results for: {query}"

agent = Agent(tools=[search])
```

---

## 기술 스택 및 아키텍처

**언어 구성:**
- Python 85.9% (핵심)
- TypeScript 9.7% (JS SDK)
- Rust 4.1% (성능 최적화)

**성능:**
- 에이전트 인스턴스화: **평균 3.77 μs**
- 694개 릴리스로 빠른 개발 속도 유지
- 36명 기여자, 활발한 커뮤니티

---

## 설치 및 사용법

```bash
# 기본 설치
pip install praisonaiagents

# 하이브리드 모드 (로컬 + 호스팅)
pip install "praisonai[claw]"  # 대시보드 포함

# 트레이싱 (Langfuse)
pip install "praisonai[langfuse]"
```

**CLI 빠른 참조:**
```
praisonai --auto          # 자율 실행
praisonai --interactive   # 대화형 모드
praisonai research --deep-research  # 딥 리서치
praisonai workflow run    # 워크플로우 실행
praisonai memory show     # 메모리 조회
praisonai mcp list        # MCP 서버 목록
```

---

## 마치며

PraisonAI는 AI 에이전트 프레임워크 중 가장 빠르게 성장하는 도구 중 하나입니다. 5줄 코드부터 시작해 수백 개의 에이전트를 조율하는 복잡한 워크플로우까지 스케일업이 가능하며, 100개 이상 LLM 지원으로 벤더 종속 없이 운영할 수 있습니다. 24/7 자율 에이전트 팀을 구축하고 싶다면 PraisonAI가 가장 빠른 출발점입니다.

GitHub: [https://github.com/MervinPraison/PraisonAI](https://github.com/MervinPraison/PraisonAI) | 문서: [https://docs.praison.ai](https://docs.praison.ai)
