---
title: "OpenClaude: OpenAI·Gemini·Ollama 200개 모델을 지원하는 오픈소스 코딩 에이전트 CLI"
date: "2026-04-11"
category: "AI 개발 도구"
tags: ["ClaudeCode", "코딩에이전트", "CLI", "오픈소스", "멀티프로바이더"]
excerpt: "Claude Code 코드베이스에서 파생된 CLI로, OpenAI, Gemini, DeepSeek, Ollama 등 200개 이상의 모델을 단일 터미널 워크플로우에서 사용할 수 있는 20.5k 스타 오픈소스 프로젝트입니다."
author: "큐레이터"
readTime: "7분"
image: null
---

## OpenClaude란?

**OpenClaude**는 Anthropic의 Claude Code에서 파생된 오픈소스 코딩 에이전트 CLI입니다. 원본 Claude Code의 단일 제공사 제한을 넘어, OpenAI, Gemini, GitHub Models, Codex, Ollama, Atomic Chat 등 200개 이상의 OpenAI 호환 API를 단일 터미널 워크플로우에서 사용할 수 있게 확장했습니다.

GitHub 스타 20,500개와 7,200개의 포크를 보유하며, TypeScript 99.4%로 구현되어 있습니다. `npm install -g @gitlawb/openclaude` 한 줄로 설치 가능합니다. 63명의 기여자가 활발히 개발 중이며 최근 v0.1.8이 출시되었습니다.

**중요**: OpenClaude는 Anthropic으로부터 독립적인 커뮤니티 프로젝트이며 Anthropic이 보증하지 않습니다.

## 주요 기능

OpenClaude가 제공하는 핵심 기능들을 살펴보겠습니다.

**멀티 프로바이더 지원**: OpenAI 호환 API, Gemini, GitHub Models, Codex, Ollama, Atomic Chat, Bedrock, Vertex AI, Azure Foundry를 지원합니다. `/provider` 명령으로 가이드형 프로바이더 설정과 프로필 저장이 가능합니다.

**코딩 에이전트 워크플로우**: Bash 실행, 파일 읽기/쓰기/편집, grep, glob, 에이전트, 태스크, MCP, 슬래시 명령까지 Claude Code의 완전한 도구 세트를 유지합니다.

**에이전트 라우팅**: 설정 기반으로 다른 에이전트를 다른 모델에 라우팅합니다. 비용 최적화나 모델 강점별 작업 분배에 활용할 수 있습니다.

**스트리밍 응답**: 실시간 토큰 출력과 도구 진행 상황 스트리밍을 지원합니다.

**헤드리스 gRPC 서버**: 외부 애플리케이션, CI/CD 파이프라인, 커스텀 UI에 에이전트 능력을 통합하기 위한 gRPC 서비스로 실행할 수 있습니다.

**VS Code 확장**: OpenClaude 실행 통합, 프로바이더 인식 컨트롤 센터 UI, 테마 지원을 제공하는 VS Code 확장도 포함되어 있습니다.

## 지원 프로바이더

| 프로바이더 | 설정 방법 | 설명 |
|-----------|---------|------|
| OpenAI 호환 | /provider 또는 env vars | OpenAI, OpenRouter, DeepSeek, Groq, Mistral, LM Studio |
| Gemini | /provider 또는 env vars | API 키, 액세스 토큰, 로컬 ADC |
| GitHub Models | /onboard-github | 가이드형 온보딩 |
| Ollama | /provider 또는 env vars | 로컬 추론, API 키 불필요 |
| Codex | /provider | 기존 Codex 자격증명 사용 |
| Bedrock/Vertex | env vars | 지원 환경용 추가 통합 |

최고의 결과를 위해 강력한 도구/함수 호출 지원 모델 사용을 권장합니다.

## 에이전트 라우팅 설정

**~/.claude/settings.json**:
```json
{
  "agentModels": {
    "deepseek-chat": {
      "base_url": "https://api.deepseek.com/v1",
      "api_key": "sk-xxx"
    },
    "gpt-4o": {
      "base_url": "https://api.openai.com/v1",
      "api_key": "sk-xxx"
    }
  },
  "agentRouting": {
    "Explore": "deepseek-chat",
    "Plan": "gpt-4o",
    "frontend-dev": "deepseek-chat",
    "default": "gpt-4o"
  }
}
```

이 설정으로 탐색 작업은 저렴한 DeepSeek, 복잡한 계획 작업은 GPT-4o를 자동으로 사용하여 비용을 최적화합니다.

## 설치 및 사용법

**전역 설치**:
```bash
npm install -g @gitlawb/openclaude
openclaude
```

**OpenAI 빠른 설정 (macOS/Linux)**:
```bash
export CLAUDE_CODE_USE_OPENAI=1
export OPENAI_API_KEY=sk-your-key
export OPENAI_MODEL=gpt-4o
openclaude
```

**로컬 Ollama 연결**:
```bash
export CLAUDE_CODE_USE_OPENAI=1
export OPENAI_BASE_URL=http://localhost:11434/v1
export OPENAI_MODEL=qwen2.5-coder:7b
openclaude
```

**GitHub Models 온보딩 (무료)**:
```bash
openclaude
/onboard-github
```

**gRPC 서버 실행**:
```bash
npm run dev:grpc           # gRPC 서버 시작 (포트 50051)
npm run dev:grpc:cli       # 별도 터미널에서 CLI 클라이언트
```

**소스 빌드**:
```bash
bun install
bun run build
node dist/cli.mjs
```

## 마치며

OpenClaude는 Claude Code의 강력한 코딩 에이전트 경험을 Anthropic API에 종속되지 않고 원하는 어떤 모델로도 사용할 수 있게 해주는 프로젝트입니다. 월 수십 달러의 Claude API 비용을 절감하면서도 동일한 워크플로우를 유지하거나, 오프라인 환경에서 Ollama 로컬 모델로 사용하거나, GitHub Models 무료 티어로 시작하는 등 다양한 시나리오에서 활용할 수 있습니다. 20,500개의 스타가 입증하듯, 커뮤니티에서는 이미 필수 도구로 자리잡고 있습니다.
