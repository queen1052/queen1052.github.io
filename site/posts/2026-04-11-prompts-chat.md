---
title: "prompts.chat: 세계 최대 오픈소스 AI 프롬프트 라이브러리 — 159k 스타"
date: "2026-04-11"
category: "AI 도구"
tags: ["프롬프트", "ChatGPT", "프롬프트엔지니어링"]
excerpt: "Forbes·Harvard에서 인용된 159k 스타의 첫 프롬프트 라이브러리. 자체 호스팅, Claude Code 플러그인, MCP 서버를 지원하는 커뮤니티 중심 AI 프롬프트 허브."
author: "큐레이터"
readTime: "7분"
image: null
---

## 소개

**prompts.chat**(구 Awesome ChatGPT Prompts)은 2022년 12월 세계 최초로 공개된 AI 프롬프트 라이브러리입니다. GitHub Stars 159,000개, 포크 20,900개로 GitHub Staff Pick에 선정된 이 프로젝트는 Forbes, Harvard, Columbia 대학에서 인용되고, OpenAI 공동 창업자 Greg Brockman과 Wojciech Zaremba, Hugging Face CEO Clement Delangue 등이 추천한 바 있습니다.

HTML 48.4%, MDX 36.3%, TypeScript 14.9%로 구성된 Next.js 기반 웹 앱으로, CC0(퍼블릭 도메인) 프롬프트 데이터와 MIT 소스 코드로 이중 라이선스 구조를 취합니다.

## 주요 기능

- **방대한 프롬프트 컬렉션**: 커뮤니티가 기여한 다국어 ChatGPT·Claude·Gemini 프롬프트
- **자체 호스팅**: `npx prompts.chat new my-prompt-library`로 즉시 자체 서버 배포
- **Claude Code 플러그인**: `/plugin marketplace add f/prompts.chat`으로 직접 통합
- **MCP 서버**: 원격(https://prompts.chat/api/mcp) 또는 로컬 MCP 서버 지원
- **인터랙티브 프롬프팅 교재**: 25+ 챕터 chain-of-thought·few-shot·에이전트 커버
- **아이들용 게임**: 8-14세 대상 AI 소통 학습 게임(Promi)

## 159k 스타의 역사적 의미

prompts.chat이 2022년 12월 공개될 당시, ChatGPT 출시 직후였습니다. 사람들은 AI와 어떻게 대화해야 하는지 몰랐고, 이 프롬프트 컬렉션은 즉각적인 공명을 일으켰습니다.

당시 Greg Brockman(OpenAI 공동창업자)이 직접 트위터에서 추천하며 초기 폭발적 성장의 발판이 되었습니다. 이후 40+건의 학술 논문 인용, Harvard·Columbia 대학의 AI 교육 자료 채택, Hugging Face의 최다 좋아요 데이터셋이 되었습니다.

이 프로젝트는 단순한 프롬프트 목록을 넘어 "프롬프트 엔지니어링"이라는 새로운 분야의 대중화를 상징합니다.

## V2 아키텍처: 단순 목록에서 플랫폼으로

초기 버전은 단순한 마크다운 파일 목록이었지만, 현재 V2는 완전한 웹 플랫폼입니다.

**신규 기능:**
- Prisma ORM + PostgreSQL 기반 프롬프트 데이터베이스
- 커뮤니티 제출 및 심사 워크플로우
- GitHub·Google·Azure AD 인증
- AI 기반 프롬프트 검색 및 생성
- Docker 자체 호스팅 지원

자체 호스팅 마법사가 브랜드, 테마, 인증, 기능을 단계별로 설정해줍니다.

## 기술 스택 및 아키텍처

- **언어**: HTML 48.4%, MDX 36.3%, TypeScript 14.9%
- **라이선스**: MIT (코드) + CC0 (프롬프트 데이터)
- **프레임워크**: Next.js (App Router)
- **데이터베이스**: Prisma ORM + PostgreSQL
- **인턴내셔널라이제이션**: next-intl
- **MCP 서버**: 원격(HTTPS) + 로컬(npx)
- **Claude Code 플러그인**: / commands 통합
- **Docker**: 완전 자체 호스팅 지원

## 설치 및 사용법

빠른 시작 (CLI):
```bash
npx prompts.chat
```

자체 호스팅:
```bash
npx prompts.chat new my-prompt-library
cd my-prompt-library
# 또는
git clone https://github.com/f/prompts.chat.git
cd prompts.chat
npm install && npm run setup
npm run dev
```

MCP 설정 (원격):
```json
{
  "mcpServers": {
    "prompts.chat": {
      "url": "https://prompts.chat/api/mcp"
    }
  }
}
```

Claude Code 플러그인:
```
/plugin marketplace add f/prompts.chat
/plugin install prompts.chat@prompts.chat
```

## 마치며

**prompts.chat**은 AI 시대의 참고서이자 커뮤니티 허브입니다. 159k 스타는 단순한 인기 지표가 아닌, 수백만 AI 사용자에게 실질적 가치를 제공한 기록입니다. CC0 라이선스로 프롬프트 데이터를 완전히 자유롭게 활용할 수 있으며, 자체 호스팅 기능으로 조직 전용 프롬프트 라이브러리를 쉽게 구축할 수 있습니다. MCP와 Claude Code 플러그인 지원은 AI 워크플로우 자동화의 새로운 가능성을 열어줍니다.
