---
title: "Agent File(.af): 상태를 가진 AI 에이전트를 이식 가능한 단일 파일로"
date: "2026-04-11"
category: "AI 에이전트"
tags: ["에이전트포맷", "Letta", "에이전트공유"]
excerpt: "시스템 프롬프트·메모리·도구·대화 히스토리를 하나의 .af 파일로 직렬화하는 오픈 스탠다드. Letta ADE, Python/TypeScript SDK, REST API로 에이전트 이식·공유·버전 관리 지원."
author: "큐레이터"
readTime: "7분"
image: null
---

## 소개

**Agent File(.af)**은 상태를 가진 AI 에이전트(Stateful AI Agent)를 단일 파일로 직렬화하는 오픈 스탠다드입니다. GitHub에서 1,100개의 스타를 기록했으며, TypeScript 67.6%, Python 23.2%로 구현된 Apache-2.0 라이선스 프로젝트입니다.

Letta(구 MemGPT) 팀이 개발한 이 표준은 에이전트의 시스템 프롬프트, 편집 가능한 메모리 블록, 도구 코드/스키마, LLM 설정, 전체 대화 히스토리를 하나의 `.af` 파일에 패키징합니다. Git처럼 에이전트를 버전 관리하고, 누구와도 공유할 수 있게 해줍니다.

## 주요 기능

- **완전한 에이전트 상태 직렬화**: 시스템 프롬프트, 메모리, 도구, LLM 설정, 대화 히스토리 모두 포함
- **Letta ADE 통합**: 브라우저에서 .af 파일을 드래그&드롭으로 임포트
- **Python/TypeScript SDK**: 코드에서 에이전트 임포트/익스포트 자동화
- **에이전트 디렉토리**: 커뮤니티가 훈련한 에이전트를 공유하고 탐색
- **로드맵**: MCP 서버·아카이브 메모리·데이터소스·멀티에이전트 .af 계획 중

## 왜 Agent File이 필요한가?

AI 에이전트를 훈련하는 일은 시간이 많이 걸립니다. 에이전트에게 선호를 가르치고, 실수를 수정하며, 컨텍스트를 축적하는 과정에 상당한 노력이 투자됩니다.

현재 AI 에코시스템의 문제는 이 투자가 특정 프레임워크에 종속된다는 것입니다. LangChain에서 훈련한 에이전트를 LlamaIndex로 이식하거나, 팀원과 에이전트 상태를 공유하거나, 특정 시점으로 롤백하기가 매우 어렵습니다.

.af 표준은 Git이 코드에 한 것을 에이전트에게 합니다: **이식성, 공유, 버전 관리**를 범용 파일 형식으로 해결합니다.

## .af 파일에 포함되는 상태

| 항목 | 내용 |
|------|------|
| 모델 설정 | 컨텍스트 창 크기, 모델 이름, 임베딩 모델 |
| 메시지 히스토리 | 전체 대화 기록, in_context 플래그 포함 |
| 시스템 프롬프트 | 에이전트 행동을 정의하는 초기 지시문 |
| 메모리 블록 | 성격, 사용자 정보 등 인컨텍스트 메모리 |
| 도구 규칙 | 도구 시퀀싱 및 제약 정의 |
| 환경 변수 | 도구 실행을 위한 설정값 (시크릿은 null) |
| 도구 정의 | 소스 코드 + JSON 스키마 포함 완전한 도구 정의 |

## 기술 스택 및 아키텍처

- **언어**: TypeScript 67.6%, Python 23.2%, SCSS 6.7%
- **라이선스**: Apache-2.0
- **웹 프론트엔드**: Next.js + Tailwind CSS
- **Python SDK**: `pip install letta-client>=1.0.0`
- **TypeScript SDK**: `npm install @letta-ai/letta-client@^1.0.0`
- **서버**: Letta Server (localhost:8283)
- **파일 포맷**: .af (JSON 기반 직렬화 스키마)

## 설치 및 사용법

에이전트 임포트 (Python SDK):
```python
from letta_client import Letta

# Letta 서버 연결 (localhost:8283에서 실행 중)
client = Letta(base_url="http://localhost:8283")

# .af 파일 임포트
agent_state = client.agents.import_file(
    file=open("/path/to/agent/file.af", "rb")
)
print(f"임포트된 에이전트: {agent_state.id}")
```

에이전트 익스포트 (TypeScript SDK):
```typescript
import { LettaClient } from '@letta-ai/letta-client'

const client = new LettaClient({ baseUrl: "http://localhost:8283" })
const schema = await client.agents.exportFile("<AGENT_ID>")
// 파일로 저장
```

cURL 사용:
```bash
# 익스포트
curl -X GET http://localhost:8283/v1/agents/{AGENT_ID}/export

# 임포트
curl -X POST "http://localhost:8283/v1/agents/import" \
  -F "file=/path/to/agent/file.af"
```

로컬 개발 서버:
```bash
npm install
npm run dev
```

## 마치며

**Agent File**은 "에이전트를 파일로"라는 단순하지만 강력한 아이디어를 오픈 스탠다드로 구현합니다. Git 없는 소프트웨어 개발을 상상하기 어렵듯, 미래의 AI 에이전트 개발도 .af 같은 표준 없이는 협업과 재사용이 어려울 것입니다. Letta 팀의 커뮤니티 에이전트 디렉토리는 훈련된 에이전트의 오픈소스 생태계 가능성을 보여줍니다. 상태 기반 에이전트를 개발하고 있다면, .af 표준 채택을 진지하게 고려할 때입니다.
