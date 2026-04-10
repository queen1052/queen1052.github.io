---
title: "Page Agent: 자바스크립트로 웹페이지를 자연어로 제어하는 GUI 에이전트"
date: "2026-04-10"
category: "AI 에이전트"
tags: ["JavaScript", "browser-automation", "agent", "LLM", "npm"]
excerpt: "브라우저 확장 프로그램도, Python도, 헤드리스 브라우저도 필요 없이 페이지 내 JS만으로 웹 UI를 자연어로 자동화하는 Alibaba 오픈소스 라이브러리."
author: "큐레이터"
readTime: "5분"
image: null
---

## 소개

Page Agent는 Alibaba가 오픈소스로 공개한 **웹페이지 내 자바스크립트 GUI 에이전트**입니다. 가장 큰 특징은 **설치가 필요한 외부 도구가 전혀 없다**는 점입니다. 브라우저 확장 프로그램, Python 런타임, Playwright/Puppeteer 같은 헤드리스 브라우저 없이도, 순수하게 페이지 내 JavaScript만으로 웹 UI 요소를 자연어로 제어할 수 있습니다.

GitHub에서 16,700개 이상의 별을 받았으며, MIT 라이선스로 자유롭게 활용할 수 있습니다. 핵심은 **텍스트 기반 DOM 조작**입니다. 스크린샷을 찍어 비전 모델로 분석하는 방식이 아닌, DOM 트리를 텍스트로 직접 읽어 쓰기 때문에 멀티모달 LLM 없이도 동작합니다. "로그인 버튼 클릭", "검색창에 'AI 뉴스' 입력", "두 번째 결과 열기" 같은 자연어 명령을 그대로 사용할 수 있습니다.

선택적으로 Chrome 확장 프로그램을 설치하면 멀티 페이지 작업(새 탭 열기, 탭 전환 등)을 처리할 수 있고, MCP(Model Context Protocol) 서버도 베타로 제공하여 Claude Desktop 같은 AI 클라이언트에서 웹 제어를 외부에서 지시할 수도 있습니다.

## 주요 기능

- **No Extension / No Python / No Headless**: 페이지 내 JS만으로 동작합니다. 기존 웹 페이지에 스크립트 태그 한 줄만 추가하면 됩니다.
- **텍스트 기반 DOM 조작**: 스크린샷 없이 DOM 구조를 텍스트로 읽어 LLM이 처리합니다. 비전 모델이 필요 없어 비용이 낮습니다.
- **다양한 LLM 지원**: `qwen3.5-plus`, GPT, Claude 등 OpenAI SDK 형식을 지원하는 모든 API를 `baseURL`로 연결할 수 있습니다.
- **Chrome 확장으로 멀티탭 제어**: 선택 설치로 여러 탭에 걸친 작업을 처리합니다.
- **MCP Server (Beta)**: AI 클라이언트에서 외부적으로 브라우저를 제어하는 MCP 서버를 제공합니다.
- **NPM 패키지 배포**: `npm install page-agent`로 5분 이내 통합 가능합니다.

### 텍스트 기반 DOM 접근 방식의 차별점

기존 웹 자동화 도구(Puppeteer, Playwright)는 CSS 선택자나 XPath로 요소를 지정합니다. AI 에이전트 도구들은 스크린샷을 찍어 비전 모델로 클릭할 위치를 찾기도 합니다. Page Agent는 이 두 방식과 다릅니다. DOM 전체를 텍스트 표현으로 변환하여 LLM에 제공하고, LLM이 자연어 명령에 가장 맞는 요소를 판단해 `click()`, `fill()` 같은 DOM API를 직접 실행합니다.

이 방식의 장점은 비전 모델이 불필요해 API 비용이 낮고, 시각적으로 숨겨진 요소나 동적으로 렌더링된 요소도 처리할 수 있다는 점입니다. 단점은 JavaScript가 실행되어야 DOM이 구성되는 SPA에서는 로딩 타이밍 관리가 중요하다는 것입니다.

### MCP 서버 연동 — 외부 AI 클라이언트에서 웹 제어

MCP 서버 기능을 활성화하면 Claude Desktop, VS Code 에이전트, 또는 커스텀 LLM 클라이언트에서 "지금 열려 있는 브라우저 탭의 폼을 채워줘"처럼 자연어로 브라우저 제어를 지시할 수 있습니다. 브라우저 확장 프로그램이 중간에서 MCP 서버와 페이지 내 스크립트를 연결하는 다리 역할을 합니다.

## 기술 스택 / 아키텍처

| 항목 | 내용 |
|------|------|
| 언어 | TypeScript |
| 배포 | NPM 패키지 (`page-agent`) |
| LLM 연동 | OpenAI SDK 호환 API |
| 추가 기능 | Chrome 확장, MCP Server (Beta) |
| 라이선스 | MIT |
| 별 | 16,700+ |

아키텍처 흐름:  
`자연어 명령 → Page Agent → DOM 텍스트 추출 → LLM 판단 → DOM API 실행 → 결과 반환`

## 설치 / 사용법

```bash
# 패키지 설치
npm install page-agent
```

```javascript
import { PageAgent } from 'page-agent'

const agent = new PageAgent({
  model: 'qwen3.5-plus',
  baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
  apiKey: process.env.API_KEY,
  language: 'ko-KR',  // 한국어 페이지에서 유용
})

// 자연어로 웹 UI 조작
await agent.execute('로그인 버튼을 클릭해줘')
await agent.execute('이메일 입력란에 test@example.com을 입력해줘')
await agent.execute('두 번째 검색 결과의 제목을 알려줘')
```

환경변수로 API 키를 설정하고, `baseURL`에 사용하는 LLM 서비스의 엔드포인트를 지정합니다. OpenAI 호환 API라면 모두 사용 가능합니다.

## 활용 사례 / 사용 시나리오

1. **RPA 없는 업무 자동화**: 사내 웹 시스템에 확장 프로그램 설치 없이 반복 업무(폼 입력, 데이터 수집)를 자동화합니다. IT 부서의 승인 없이 개발자가 빠르게 프로토타입을 구현할 수 있습니다.

2. **E2E 테스트 자연어화**: Cypress, Playwright 테스트 코드를 자연어 단계로 대체합니다. 비개발자도 테스트 시나리오를 작성할 수 있고, UI 변경에 더 유연하게 대응합니다.

3. **AI 에이전트 웹 도구**: LangChain, AutoGen 등 에이전트 프레임워크에 Page Agent를 웹 인터랙션 도구로 통합하면 에이전트가 실제 웹 서비스를 조작할 수 있습니다.

## 결론

Page Agent는 "웹 자동화는 복잡하다"는 고정관념을 깨는 접근 방식입니다. npm 설치 후 몇 줄의 코드로 자연어 웹 자동화를 구현할 수 있어 접근 장벽이 매우 낮습니다. 현재 단일 페이지 중심으로 안정적이며, 멀티탭 작업에는 Chrome 확장 프로그램이 필요하다는 점을 고려해야 합니다. AI 에이전트에 웹 인터랙션 능력을 빠르게 추가하고 싶은 개발자에게 강하게 추천합니다.

---

> 원문: https://github.com/alibaba/page-agent
