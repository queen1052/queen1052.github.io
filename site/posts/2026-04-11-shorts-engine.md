---
title: "Shorts Engine: 취향에서 출발하는 숏폼 영상 시나리오 생성 CLI"
date: "2026-04-11"
category: "콘텐츠 생성"
tags: ["YouTube Shorts", "틱톡", "AI 영상", "TypeScript", "CLI", "콘텐츠 자동화"]
excerpt: "좋아하는 영화·스타일·작가를 입력하면 취향 DNA를 구축해 YouTube Shorts, TikTok, 인스타그램용 시나리오와 Kling·Runway·Veo 프롬프트를 자동 생성하는 CLI."
author: "큐레이터"
readTime: "6분"
image: null
---

## 소개

대부분의 영상 도구는 설정부터 묻습니다. **Shorts Engine**은 취향부터 묻습니다.

좋아하는 영화, 비주얼 스타일, 작가를 알려주면 엔진이 "취향 DNA"를 구축하고, 이 DNA가 이후 모든 숏폼 영상 시나리오 생성에 자동 반영됩니다. Kling, Runway, Veo, Pika, CapCut 등 주요 AI 영상 도구에 바로 붙여넣을 수 있는 형식으로 출력하는 TypeScript 기반 CLI입니다.

22B Labs(sinmb79)가 개발한 이 오픈 소스 프로젝트는 GitHub Stars 31개의 신생 프로젝트이지만, TypeScript 98.2%의 깔끔한 구조와 8종 프리셋 템플릿, 7개 출력 포맷, n8n 통합을 갖춘 완성도 높은 도구입니다. MIT 라이선스로 자유롭게 사용할 수 있습니다.

---

## 주요 기능

| 기능 | 설명 |
|------|------|
| 취향 DNA 시스템 | 영화·스타일·작가 프로필로 개인화된 DNA 구축 |
| 8종 프리셋 템플릿 | 요리·코미디·튜토리얼·제품 런칭·소설 등 |
| 7개 출력 포맷 | Kling, Runway, Veo, Pika, CapCut, Generic, Human |
| 품질 피드백 루프 | 시나리오 평점 → 취향 DNA 자동 보정 |
| LLM 선택적 정제 | OpenAI·Anthropic·Ollama (오프라인 모드 기본) |
| n8n 연동 | 워크플로우 자동화 통합 |

---

## 핵심 기능 1: 취향 DNA 시스템

취향 DNA는 Shorts Engine의 핵심입니다. 단순히 장르를 선택하는 것이 아니라, 구체적인 영화와 비주얼 스타일, 좋아하는 작가 등을 입력해 고유한 창작 프로필을 만듭니다.

```bash
npm run engine -- taste
```

이 대화형 프롬프트로 생성된 DNA는 다음 모든 과정에 반영됩니다:
- **시나리오 구조** — 서사 아크와 훅 선택
- **스타일 결정** — 색감·페이싱·카메라 언어
- **프롬프트 빌딩** — AI 영상 도구용 세부 묘사
- **품질 진화** — 피드백으로 점점 정확해지는 DNA

예: "왕가위, 네온 느와르, 슬로우 모션"을 취향 프로필에 입력하면, 이후 생성되는 모든 시나리오에 그 분위기가 녹아듭니다.

---

## 핵심 기능 2: 8종 프리셋 × 7개 출력 포맷

**8종 프리셋 템플릿**:

| 템플릿 | 길이 | 플랫폼 | 설명 |
|--------|------|--------|------|
| recipe-30s | 30초 | YouTube Shorts | 결과물 먼저 보여주는 요리 |
| comedy-skit-15s | 15초 | TikTok | 짧은 개그·캐릭터 비트 |
| tutorial-60s | 60초 | YouTube Shorts | 단계별 설명형 |
| product-launch-20s | 20초 | TikTok | 제품 런칭 모멘텀 |
| story-tease-25s | 25초 | Instagram Reels | 소설 에피소드 티저 |
| before-after-15s | 15초 | Instagram Reels | 변화 대비형 |
| cozy-vlog-20s | 20초 | Instagram Reels | 따뜻한 라이프스타일 |
| cinematic-mood-20s | 20초 | YouTube Shorts | 분위기 중심 영상 |

**7개 출력 포맷**:
- `kling` — Kling AI 프롬프트 형식
- `runway` — Runway Gen 형식
- `veo` — Google Veo 형식
- `pika` — Pika Labs 형식
- `capcut` — CapCut 편집 가이드
- `generic` — 범용 AI 영상 프롬프트
- `human` — 사람(편집자)을 위한 읽기 쉬운 가이드

---

## 기술 스택 및 아키텍처

```
Shorts-engine/
├── src/
│   ├── cli/            CLI 명령어 진입점
│   ├── taste/          취향 온보딩, DNA 생성, 프로필 관리
│   ├── taste-db/       참조 데이터 (영화, 스타일, 작가)
│   ├── style/          스타일 해석 엔진
│   ├── scenario/       훅·블록 위빙, 시나리오 구성
│   ├── prompt/         AI 프롬프트 빌더
│   ├── render/         렌더 플랜 생성
│   ├── publish/        발행 플랜 생성
│   ├── quality/        품질 점수, 피드백, 진화 루프
│   ├── llm/            LLM 프로바이더 라우팅
│   ├── output/         포맷터 (Kling, Runway, Veo 등)
│   └── templates/      프리셋 템플릿 8종
├── n8n/                n8n 워크플로우 연동
└── tests/
```

- **언어**: TypeScript 98.2%, JavaScript 1.8%
- **런타임**: Node.js 24+
- **라이선스**: MIT
- **LLM**: 선택적 (OpenAI, Anthropic, Ollama) — 기본은 오프라인

---

## 설치 및 사용법

### 설치

```bash
git clone https://github.com/sinmb79/Shorts-engine.git
cd Shorts-engine

npm install
npm run build
npm test
```

### 취향 프로필 생성

```bash
npm run engine -- taste
# 좋아하는 영화, 스타일, 작가를 대화형으로 입력
```

### 첫 시나리오 생성

```bash
# 대화형 가이드
npm run engine -- interactive

# 요청 파일로 직접 생성
npm run engine -- run tests/fixtures/valid-low-cost-request.json
```

### 템플릿으로 생성

```bash
npm run engine -- create --template recipe-30s my-recipe.json
```

`my-recipe.json` 예시:
```json
{
  "version": "0.1",
  "intent": {
    "topic": "15분 크리미 파스타",
    "goal": "오늘 저녁 따라 할 수 있는 빠른 레시피",
    "platform": "youtube_shorts",
    "duration_sec": 30
  }
}
```

### Kling용 프롬프트로 출력

```bash
npm run engine -- format my-recipe.json --output kling
npm run engine -- format my-recipe.json --output all --json
```

### 품질 피드백

```bash
npm run engine -- feedback <scenario-id>
npm run engine -- quality
```

---

## 마치며

Shorts Engine은 "설정 → 생성" 대신 "취향 → 생성"의 패러다임을 제시합니다. 취향 DNA가 축적될수록 나만의 스타일이 반영된 시나리오를 더 빠르게 만들 수 있고, 7개 출력 포맷으로 원하는 AI 영상 도구에 바로 연결할 수 있습니다.

숏폼 콘텐츠 창작자, AI 영상 도구 사용자, 웹소설 작가에게 특히 유용하며, n8n 통합으로 blog-writer 등 다른 22B Labs 도구와의 자동화 파이프라인 구성도 가능합니다.

- GitHub: [sinmb79/Shorts-engine](https://github.com/sinmb79/Shorts-engine)
- 라이선스: MIT
- 개발: 22B Labs
- Stars: 31
