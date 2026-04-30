---
title: "Hermes HUD Web UI: AI 에이전트 의식 모니터링 대시보드"
date: "2026-04-11"
category: "AI 도구"
tags: ["Hermes", "AI에이전트", "대시보드"]
excerpt: "Hermes AI 에이전트의 상태를 브라우저에서 실시간으로 모니터링할 수 있는 웹 기반 의식 대시보드"
author: "큐레이터"
readTime: "5분"
image: null
---

## 소개

**Hermes HUD Web UI**는 [Hermes AI 에이전트](https://github.com/nousresearch/hermes-agent)용 브라우저 기반 실시간 모니터링 대시보드입니다. 기존 TUI(터미널 UI) 버전과 동일한 데이터를 제공하면서도, 웹 브라우저에서 더욱 풍부한 시각화와 편의 기능을 제공합니다.

에이전트가 현재 무엇을 알고 있고, 무엇을 기억하며, 어떤 작업을 진행 중인지를 한눈에 파악할 수 있는 이 도구는 AI 에이전트를 일상적으로 운영하는 개발자라면 반드시 주목해야 할 프로젝트입니다.

---

## 주요 기능

Hermes HUD Web UI는 에이전트의 전반적인 상태를 탭 형태로 구성하여 제공합니다:

- **Identity** — 에이전트 이름, 런타임, 기동 일수, 브레인 크기 등 기본 정보
- **What I Know** — 대화 횟수, 메시지 수, 수행한 액션, 습득한 스킬 수
- **What I Remember** — 메모리 용량 바, 사용자 프로필 상태, 흡수된 수정 사항
- **What I See** — API 키 유무, 서비스 헬스 체크
- **What I'm Learning** — 최근 수정된 스킬 목록과 카테고리
- **What I'm Working On** — 활성 프로젝트와 더티 파일 상태
- **What Runs While You Sleep** — 예약된 크론 잡 목록
- **How I Think** — 툴 사용 패턴, 그라디언트 바
- **My Rhythm** — 일별 활동 스파크라인
- **Growth Delta** — 변경 사항을 보여주는 스냅샷 비교
- **Token Costs** — 모델별 USD 토큰 비용 추정 및 일별 트렌드

---

## 핵심 기능 1: 실시간 WebSocket 업데이트

기존 TUI 버전의 가장 큰 한계였던 수동 새로고침 문제를 WebSocket으로 완전히 해결했습니다.

**동작 방식:**
1. 백엔드의 `watchfiles` 라이브러리가 `~/.hermes/` 디렉토리를 감시
2. 파일 변경 감지 시 즉시 `data_changed` 이벤트를 모든 WebSocket 클라이언트에 브로드캐스트
3. 프론트엔드의 SWR 라이브러리가 변경 이벤트를 받아 자동으로 데이터 재조회

**스마트 캐싱 전략:**
- 세션 데이터: 30초 TTL
- 스킬 데이터: 60초 TTL
- 패턴 데이터: 60초 TTL
- 프로필 데이터: 45초 TTL

mtime 기반 무효화로 파일이 변경되면 캐시를 즉시 갱신하며, `"● live"` 배지로 실시간 연결 상태를 시각적으로 표시합니다.

---

## 핵심 기능 2: 토큰 비용 추적 및 테마 시스템

**토큰 비용 계산:**

하드코딩된 모델별 가격표를 기반으로 실제 사용 비용을 USD로 계산합니다:

| 모델 | 입력(1M) | 출력(1M) |
|------|---------|---------|
| Claude Opus 4 | $15 | $75 |
| Claude Sonnet 4 | $3 | $15 |
| Claude Haiku 3.5 | $0.8 | $4 |
| GPT-4o | $2.5 | $10 |
| DeepSeek V3 | $0.27 | $1.10 |

로컬/무료 모델은 자동 감지하여 $0으로 처리합니다.

**4가지 테마:**
- **Neural Awakening** (`ai`): 딥 네이비 배경의 시안/블루
- **Blade Runner** (`blade-runner`): 웜 블랙 배경의 앰버/오렌지
- **fsociety** (`fsociety`): 순수 블랙 배경의 그린
- **Anime** (`anime`): 인디고 배경의 퍼플/바이올렛

선택적 CRT 스캔라인 오버레이까지 지원합니다.

---

## 기술 스택 및 아키텍처

```
React Frontend (Vite + SWR)
    ↓ /api/* + WebSocket /ws
FastAPI Backend (Python)
    ↓ collectors/*.py + cache + file watcher
~/.hermes/ (agent data files)
```

**백엔드:** Python (FastAPI), watchfiles, 지능형 캐시
**프론트엔드:** React, TypeScript, Vite, SWR

지원 플랫폼: macOS, Linux, Windows(WSL)

---

## 설치 및 사용법

```bash
git clone https://github.com/joeynyc/hermes-hudui.git
cd hermes-hudui
python3.11 -m venv venv
source venv/bin/activate
./install.sh
hermes-hudui
```

`http://localhost:3001`에서 대시보드에 접속할 수 있습니다.

**기본 요구사항:**
- Python 3.11+
- Node.js 18+
- 실행 중인 Hermes 에이전트 (`~/.hermes/` 데이터 필요)

재시작 시:
```bash
source venv/bin/activate
hermes-hudui
```

---

## 마치며

Hermes HUD Web UI는 AI 에이전트 모니터링의 새로운 기준을 제시합니다. 단순한 상태 확인을 넘어, 에이전트가 어떻게 성장하고, 무엇을 학습하며, 얼마나 비용이 드는지를 실시간으로 추적할 수 있는 강력한 도구입니다. Hermes 에이전트를 운영하는 분이라면 반드시 사용해보시길 추천합니다.

GitHub: [https://github.com/joeynyc/hermes-hudui](https://github.com/joeynyc/hermes-hudui)
