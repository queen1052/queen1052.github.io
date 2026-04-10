---
title: "json-render: JSON 하나로 React·이메일·터미널·영상 UI를 생성"
date: "2026-04-10"
category: "개발도구"
tags: ["React", "JSON", "generative-UI", "TypeScript", "Vercel"]
excerpt: "Vercel Labs의 json-render — JSON 스키마로 React/shadcn, 이메일, Next.js, Ink 터미널, Remotion 영상을 동시에 렌더링하는 14.1k 스타의 생성형 UI 프레임워크."
author: "큐레이터"
readTime: "6분"
image: null
---

## 소개

json-render는 Vercel Labs가 공개한 **생성형 UI(Generative UI) 프레임워크**입니다. GitHub에서 14,100개의 별을 기록하며 [json-render.dev](https://json-render.dev)에서 공개 데모를 제공합니다. Apache-2.0 라이선스로 공개됩니다.

핵심 아이디어는 강력합니다: **하나의 JSON 구조를 여러 렌더러에 전달해 다양한 UI를 동시에 생성합니다.** LLM이 JSON을 생성하면 React/shadcn UI로, 이메일 HTML로, Next.js 서버 컴포넌트로, Ink 터미널 UI로, Remotion 영상으로 동시에 렌더링됩니다. "한 번 정의, 어디서나 렌더링"의 생성형 UI 버전입니다.

AI 에이전트가 사용자에게 결과를 보여줄 때 단순한 텍스트가 아니라 구조화된 인터랙티브 UI로 제공하는 패턴을 쉽게 구현합니다. MCP(Model Context Protocol) Apps와의 통합도 지원해 MCP 서버가 json-render JSON을 생성하고 클라이언트가 자동으로 렌더링하는 흐름을 구성합니다.

## 주요 기능

- **9개 렌더러 지원**: React/shadcn(웹), ReactEmail(이메일 HTML), Next.js 서버 컴포넌트, Ink(터미널 CLI), Remotion(영상), Figma, PDF까지 하나의 JSON 정의로 멀티 플랫폼 렌더링.
- **StateStore 어댑터**: Redux, Zustand, Jotai, XState 등 인기 상태 관리 라이브러리를 플러그인으로 연결합니다. 기존 상태 관리 스택을 변경하지 않고도 json-render를 통합합니다.
- **MCP Apps 통합**: MCP 서버가 `render` 타입의 리소스를 json-render JSON으로 반환하면, MCP 클라이언트가 자동으로 적절한 렌더러를 선택해 UI를 생성합니다.
- **LLM Streaming 지원**: LLM이 JSON을 스트리밍으로 생성할 때 부분 JSON이 유효한 범위 내에서 점진적으로 UI가 렌더링됩니다. "Loading..." 없이 컴포넌트가 조금씩 나타나는 경험을 제공합니다.
- **타입 안전 JSON 스키마**: TypeScript 인터페이스로 정의된 JSON 스키마는 LLM이 올바른 구조로 생성하도록 제약합니다. JSON Schema로도 제공되어 LLM 파인튜닝에 활용 가능합니다.
- **컴포넌트 조합**: 기본 컴포넌트(Button, Card, Table, List, Form 등)를 JSON에서 중첩 구성합니다. 복잡한 UI를 선언적으로 정의합니다.

### 단일 JSON → 멀티 플랫폼 렌더링

```json
{
  "type": "card",
  "props": {
    "title": "TradingAgents 분석 결과",
    "stats": [
      { "label": "현재가", "value": "$185.2", "trend": "up" },
      { "label": "7일 변동", "value": "+3.4%", "trend": "up" },
      { "label": "RSI", "value": "62.3", "trend": "neutral" }
    ],
    "chart": { "type": "candlestick", "data": "..." },
    "actions": [
      { "label": "상세 분석", "action": "view_details" },
      { "label": "알림 설정", "action": "set_alert" }
    ]
  }
}
```

이 JSON 하나가:
- **React/shadcn**: 대화형 주가 카드 컴포넌트
- **ReactEmail**: 미려한 이메일 뉴스레터 섹션
- **Ink**: 터미널에서 ASCII 통계 표
- **Remotion**: 15초 요약 영상 슬라이드

로 각각 렌더링됩니다.

### MCP Apps 통합 흐름

```typescript
// MCP 서버 예시
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  if (request.params.uri === "analysis://portfolio") {
    const analysis = await analyzePortfolio()
    
    return {
      contents: [{
        uri: "analysis://portfolio",
        mimeType: "application/json",
        text: JSON.stringify({
          type: "render",  // json-render 신호
          schema: "json-render/v1",
          component: buildPortfolioUI(analysis)
        })
      }]
    }
  }
})
```

MCP 클라이언트(Claude Desktop 등)가 `render` 타입을 감지하고 json-render로 UI를 자동 생성합니다.

## 기술 스택 / 아키텍처

| 항목 | 내용 |
|------|------|
| 언어 | TypeScript |
| 렌더러 | React/shadcn, Email, Next.js, Ink, Remotion 등 |
| 상태 관리 | Redux, Zustand, Jotai, XState 어댑터 |
| 통합 | MCP Apps |
| 개발사 | Vercel Labs |
| 별 | 14,100+ |
| 라이선스 | Apache-2.0 |

## 설치 / 사용법

```bash
# 설치
npm install @json-render/react @json-render/core

# React에서 기본 사용
import { JsonRenderer } from '@json-render/react'

const uiSpec = {
  type: 'stack',
  direction: 'vertical',
  children: [
    { type: 'heading', level: 1, text: 'AI 분석 결과' },
    { type: 'table', data: analysisData },
    { type: 'button', label: '다운로드', action: 'download' }
  ]
}

export default function Page() {
  return <JsonRenderer spec={uiSpec} />
}

# 이메일 렌더러
npm install @json-render/email
import { renderToEmail } from '@json-render/email'
const emailHtml = await renderToEmail(uiSpec)

# 터미널 렌더러
npm install @json-render/ink
node -e "require('@json-render/ink').render(uiSpec)"
```

## 활용 사례 / 사용 시나리오

1. **AI 에이전트 응답 구조화**: 챗봇이나 AI 에이전트가 텍스트 대신 json-render JSON을 생성합니다. 사용자는 구조화된 카드, 표, 인터랙티브 컴포넌트로 결과를 확인합니다.

2. **멀티 채널 알림 시스템**: 같은 이벤트 데이터를 웹 UI, 이메일, Slack 알림, 대시보드 차트로 동시에 렌더링합니다. 각 채널별 템플릿을 별도로 유지하는 비용을 제거합니다.

3. **LLM 기반 리포트 생성**: LLM이 분석 결과를 json-render JSON으로 생성하면, 웹 대시보드, PDF 다운로드, 이메일 발송이 자동으로 이루어집니다. 리포트 생성 파이프라인을 크게 단순화합니다.

## 결론

json-render는 생성형 UI의 핵심 과제인 "구조와 렌더링의 분리"를 실용적으로 해결합니다. 하나의 JSON 정의로 9개 플랫폼에 렌더링하는 능력은 AI 에이전트 시대에 특히 가치 있습니다. Vercel Labs의 지원과 14.1k 별이 프레임워크의 성숙도와 커뮤니티 신뢰를 보여줍니다. AI 응답을 구조화된 UI로 제공하려는 개발자의 필수 탐구 도구입니다.

---

> 원문: https://github.com/vercel-labs/json-render
