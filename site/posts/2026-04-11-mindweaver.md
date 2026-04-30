---
title: "MindWeaver: 학습 세션을 지식 그래프로 변환하는 로컬 퍼스트 AI 도구"
date: "2026-04-11"
category: "지식 관리"
tags: ["AI", "KnowledgeGraph", "LocalFirst"]
excerpt: "MindWeaver는 학습 자료를 출처 기반 개념 그래프로 변환해주는 로컬 퍼스트 AI 지식 관리 도구입니다. Chrome 익스텐션과 OpenAI를 활용한 갭 분석, 퀴즈 생성 기능을 제공합니다."
author: "큐레이터"
readTime: "5분"
image: null
---

## 소개

[MindWeaver](https://github.com/uatragada/MindWeaver)는 학습 세션을 출처가 명확한 개념 그래프(Knowledge Graph)로 변환해주는 로컬 퍼스트 AI 도구입니다. "그래프가 주인공"이라는 철학 하에, 모든 학습 자료를 목표, 도메인, 스킬, 개념, 관계의 계층 구조로 정리합니다.

강의 노트, PDF, YouTube 트랜스크립트, 북마크 등 다양한 형태의 학습 자료를 가져와 AI가 개념을 추출하고 관계를 정의합니다. 사용자는 AI가 생성한 결과를 맹목적으로 신뢰하는 대신 직접 검토하고 정제할 수 있어, 진정으로 자신의 것이 되는 지식 지도를 만들 수 있습니다. Chrome 익스텐션을 통해 웹 페이지에서 직접 내용을 저장할 수도 있습니다.

## 주요 기능

MindWeaver는 학습의 전체 라이프사이클을 지원합니다:

- **그래프 탐색**: 노드 검색, 유형별 필터링, 개념 인스펙터
- **개념 관리**: 중복 합치기, 약한 노드 승인/거부, 관계 편집
- **AI 기반 학습 도구**: 갭 분석, 퀴즈 생성, 출처 기반 그래프 채팅
- **Chrome 익스텐션**: 웹 페이지 저장, 선택 하이라이트 저장 (명시적 온디맨드 방식)
- **다양한 가져오기**: 수동 노트, PDF 텍스트, YouTube 트랜스크립트, 마크다운, 북마크
- **내보내기**: Markdown, JSON, 완전한 로컬 백업

## 핵심 기능 심층 분석: 출처 기반 그래프 구성

MindWeaver의 핵심 가치는 "출처 추적성(Provenance)"입니다. 모든 개념 노드는 어떤 자료에서 추출되었는지 연결되어 있어, 학습 중 "이 내용의 원문이 뭐였지?"라는 질문에 즉시 답할 수 있습니다.

AI가 개념을 자동으로 분류하고 관계를 정의하지만, 사용자는 Inspector를 통해:
- 노드 이름 변경 및 자신만의 설명 작성
- 마스터리 상태 변경
- 중복 병합
- 엣지(관계) 품질 검토
- 불량 증거 제거

이 과정이 MindWeaver를 불투명한 AI 분류기가 아닌 사용자 자신의 도구로 만드는 핵심입니다.

## 핵심 기능 심층 분석: AI 학습 워크스페이스

그래프를 구성한 후에는 우측 패널의 다양한 학습 도구를 활용할 수 있습니다:

- **Graph Assistant**: 그래프에 연결된 출처를 기반으로 한 AI 질문 답변
- **Gap Analysis**: 목표 대비 부족한 지식 영역 자동 식별
- **Quiz Loop**: 간격 복습을 위한 문제 생성 (Spaced Repetition)
- **Next Actions**: 다음에 학습할 구체적인 행동 목록 제안
- **Review Queue**: 품질이 낮거나 검토가 필요한 개념 목록
- **Progress Report**: 세션별 학습 진행 이력

OpenAI API 키 없이도 기본 기능은 동작하지만, AI 기반 기능들은 구성된 OpenAI 계정을 통해 훨씬 풍부해집니다.

## 기술 스택 및 아키텍처

- **프론트엔드**: Vite + React (JavaScript 87.4%)
- **백엔드**: Express API 서버
- **AI 통합**: OpenAI API (선택적)
- **데이터 저장**: 로컬 JSON (`server/data.json`)
- **Chrome 익스텐션**: 온디맨드 방식의 페이지/하이라이트 저장

```
web/         # Vite + React 그래프 UI
server/      # Express API, 영속성, AI 학습 엔드포인트
extension/   # Chrome 익스텐션
```

로컬 퍼스트 설계로 모든 데이터는 자체 서버에 저장됩니다. `.env.local` 파일과 로컬 데이터는 git에서 제외됩니다.

## 설치 및 사용법

**기본 설치:**
```bash
npm run setup
```

**환경 설정 (선택적 OpenAI):**
```bash
copy server\.env.example server\.env.local
# server/.env.local에서 OPENAI_API_KEY 설정
```

**개발 서버 실행:**
```bash
npm run dev
# 웹 앱: http://127.0.0.1:5197
# API 서버: http://127.0.0.1:3001
```

**5분 빠른 체험:**
1. http://127.0.0.1:5197 접속
2. `Try A Demo Map` 클릭
3. 그래프 노드 클릭
4. `Gap Analysis` 또는 `Generate Quiz` 실행

Windows 사용자는 `quick-start-first-time.bat`으로 의존성 설치부터 Chrome 익스텐션 로드까지 자동화할 수 있습니다.

## 마치며

MindWeaver는 AI를 학습의 대리자가 아닌 파트너로 활용하는 철학을 구현한 도구입니다. AI가 무언가를 분류하고 관계를 정의하더라도, 최종적으로는 사용자가 모든 것을 검토하고 자신만의 이해로 정제할 수 있습니다. 아직 초기 알파 단계이지만, 로컬 퍼스트 철학과 출처 추적성, 풍부한 AI 학습 도구의 조합은 깊이 있는 학습을 추구하는 개발자와 연구자에게 강력한 선택지가 될 것입니다.
