---
title: "blog-writer: AI 기반 블로그 자동 수익화 풀스택 엔진"
date: "2026-04-11"
category: "자동화"
tags: ["블로그 자동화", "콘텐츠 생성", "YouTube Shorts"]
excerpt: "Google AdSense·쿠팡 파트너스·YouTube 광고를 동시 추구하는 완전 자동 블로그 수익화 엔진. 글 하나를 인스타그램·X·틱톡·YouTube Shorts로 자동 변환 배포한다."
author: "큐레이터"
readTime: "8분"
image: null
---

## 소개

블로그 하나로 여러 수익 채널을 동시에 운영할 수 있다면 어떨까요? **blog-writer**는 이 아이디어를 현실로 구현한 풀스택 자동화 엔진입니다. Google AdSense, 쿠팡 파트너스, YouTube 광고 수익을 동시에 추구하며, 블로그 글 하나를 인스타그램·X·TikTok·YouTube Shorts 등 멀티플랫폼 콘텐츠로 자동 변환 배포합니다.

22B Labs(sinmb79)가 개발한 이 Python/JavaScript 기반 프로젝트는 GitHub Stars 104, Fork 42로 꾸준한 관심을 받고 있습니다. v3.3.0을 맞이한 현재는 WordPress, Naver 블로그 자동 발행과 Creative DNA 기반 아티클 생성까지 지원합니다.

---

## 주요 기능

| 기능 | 설명 |
|------|------|
| 트렌드 수집 | Google Trends + RSS 자동 수집, 품질 점수 부여 |
| AI 글쓰기 | LLM으로 Blogger-ready HTML 원고 자동 생성 |
| 쿠팡 링크 삽입 | 키워드 기반 쿠팡 파트너스 링크 자동 삽입 |
| 멀티플랫폼 발행 | Blogger, WordPress, Naver 블로그 자동 발행 |
| YouTube Shorts | 블로그 글 → TTS + 자막 + 스톡 영상 → Shorts 자동 제작 |
| 소셜 배포 | 인스타그램, X, TikTok 자동 배포 |
| Telegram 제어 | 스마트폰으로 승인/거부/즉시 실행 |
| 대시보드 | React + FastAPI 웹 대시보드 |

---

## 핵심 기능 1: 4계층 자동화 아키텍처

blog-writer의 설계 철학은 명확합니다: AI는 글씨기에만, 나머지는 AI 없이.

```
LAYER 1  AI 콘텐츠 생성   OpenClaw(로컬) / Claude / Gemini / OpenAI
LAYER 2  변환 엔진        Python (AI 없음) — 멀티플랫폼 포맷 변환
LAYER 3  배포 엔진        Python (AI 없음) — 플랫폼 API 연동
LAYER 4  분석 + 피드백    Python (AI 없음) — 성과 측정·리포트
```

이 구조의 장점:
- AI 비용을 글쓰기 레이어에만 집중
- 변환·배포는 무료 Python으로 처리
- AI 엔진만 교체해도 전체 파이프라인 작동

스케줄 흐름:
```
07:00 트렌드 수집 → 08:00 AI 글쓰기 → 08:30 변환
09:00 블로그 발행 → 10:00 인스타 → 10:35 YouTube Shorts
11:00 X(Twitter) → 16:00 Shorts 2차 → 18:00 TikTok → 20:00 YouTube
22:00 일일 성과 리포트
```

---

## 핵심 기능 2: YouTube Shorts 자동 생산 파이프라인

블로그 글을 15~30초 세로 영상(9:16, 1080x1920)으로 자동 변환합니다. FFmpeg만으로 조립하며 별도 편집 도구가 필요 없습니다.

```
블로그 글
  STEP 0  Asset Resolution    에셋 소스 결정 (auto/semi_auto)
  STEP 1  Script Extraction   LLM으로 hook/body/closer 추출
  STEP 2  Visual Sourcing     스톡 영상 수집 + 캐릭터 오버레이
  STEP 3  TTS Generation      음성 합성 + 단어별 타임스탬프
  STEP 4  Caption Rendering   ASS 자막 (단어별 노란색 하이라이트)
  STEP 5  Video Assembly      FFmpeg 조립 + 루프 최적화
  STEP 6  YouTube Upload      Data API v3 업로드 + AI 공시 레이블
YouTube Shorts
```

TTS 엔진 우선순위:
1. ElevenLabs (유료, 최고 품질)
2. Google Cloud TTS Neural2 (유료)
3. **Edge TTS ko-KR-SunHiNeural** (무료, API 키 불필요)

API 키 없이도 Edge TTS로 즉시 Shorts을 만들 수 있습니다.

---

## 기술 스택 및 아키텍처

```
blog-writer_mcp/
├── bots/
│   ├── collector_bot.py       트렌드 수집
│   ├── writer_bot.py          AI 글쓰기
│   ├── publisher_bot.py       Blogger 발행
│   ├── wp_publisher_bot.py    WordPress 발행
│   ├── naver_publisher_bot.py Naver 발행 (Playwright)
│   ├── shorts_bot.py          YouTube Shorts 오케스트레이터
│   ├── converters/            변환 엔진
│   └── distributors/          배포 엔진
├── dashboard/
│   ├── backend/               FastAPI
│   └── frontend/              React
└── config/
    ├── engine.json            AI 엔진 선택
    └── shorts_config.json     Shorts 파이프라인 설정
```

- **언어**: Python 87.9%, JavaScript 10.7%
- **라이선스**: MIT
- **요구사항**: Python 3.11+, FFmpeg, Node.js 18+
- **AI 엔진**: OpenClaw / Claude / Gemini / OpenAI (선택)

Naver 블로그 발행은 공식 API 대신 Playwright로 Chrome 자동화를 사용합니다(공식 API 중단으로 인한 대안).

---

## 설치 및 사용법

### 설치

```bash
git clone https://github.com/sinmb79/blog-writer_mcp.git
cd blog-writer_mcp

scripts\setup.bat   # 자동 설치 (venv, 패키지, 스케줄러)
```

### 환경 설정

```bash
cp .env.example .env
# Google OAuth, Telegram, WordPress, Naver 등 설정
python scripts/get_token.py   # Google OAuth 토큰 발급
```

### AI 엔진 설정

```json
// config/engine.json
{
  "writing": "openclaw",  // openclaw / claude / gemini / openai
  "tts": "edge_tts",
  "image": "openai",
  "video": "local"
}
```

### 실행

```bash
blog scheduler          # 스케줄러 시작 (메인)
blog server             # 대시보드 서버 (http://localhost:8080)
blog status             # 현재 상태
blog approve <id>       # 콘텐츠 발행 승인
blog assist <url>       # 수동 어시스트 세션 시작
```

### Telegram 명령어

```
/status    전체 현황
/approve [slug]   발행 승인
/shorts run       Shorts 즉시 실행
/report   성과 리포트
```

---

## 마치며

blog-writer는 완전 자동 블로그 수익화를 목표로 하는 야심 찬 프로젝트입니다. 트렌드 수집부터 Shorts 제작까지 하나의 파이프라인으로 연결되며, Telegram으로 외출 중에도 콘텐츠를 제어할 수 있습니다.

현재 Phase 1A(기본 파이프라인)와 대시보드는 완성 상태이며, 인스타그램·TikTok·YouTube 관련 기능은 추가 검증이 필요한 단계입니다. 한국 블로그 수익화 자동화에 관심 있는 개발자에게 좋은 베이스가 됩니다.

- GitHub: [sinmb79/blog-writer](https://github.com/sinmb79/blog-writer)
- 라이선스: MIT
- 개발: 22B Labs (the4thpath.com)
- Stars: 104
