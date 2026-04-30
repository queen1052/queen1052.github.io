---
title: "PriceDrop MVP: 네이버 쇼핑 가격 하락 감지 및 텔레그램 알림 시스템"
date: "2026-04-11"
category: "생산성"
tags: ["가격 알림", "네이버 쇼핑", "Telegram"]
excerpt: "네이버 쇼핑 가격을 수집하고 SQLite에 이력을 저장해 임계치 이상 가격 하락 시 Telegram으로 즉시 알림을 보내는 한국 시장 특화 MVP 파이프라인."
author: "큐레이터"
readTime: "5분"
image: null
---

## 소개

원하는 상품의 가격이 내렸을 때 즉시 알림을 받을 수 있다면 어떨까요? **PriceDrop MVP**는 이 아이디어를 한국 시장 기준으로 구현한 첫 번째 실용적 파이프라인입니다.

네이버 쇼핑 데이터를 수집하고 SQLite에 가격 이력을 저장한 뒤, 설정한 임계치(기본 20%) 이상의 가격 하락이 감지되면 Telegram 봇으로 즉시 딜 알림을 발송합니다. 22B Labs(sinmb79)가 개발한 이 Python 기반 CLI 도구는 MIT 라이선스로 공개되어 있으며, 가장 최근에 공개된 신규 프로젝트입니다.

---

## 주요 기능

| 기능 | 설명 |
|------|------|
| 가격 수집 | Naver Shopping API 기반 데이터 수집 |
| 이력 저장 | SQLite에 카테고리별 가격 이력 누적 |
| 하락 감지 | 카테고리별 임계치 기반 가격 하락 판정 |
| 중복 딜 필터 | 최근 더 좋은 딜이 있으면 발행 제외 |
| 의심 할인 감지 | 급등 후 할인 패턴 자동 차단 |
| Telegram 발행 | 딜 조건 충족 시 즉시 알림 발송 |
| Python CLI | 단일 명령으로 전체 파이프라인 실행 |

---

## 핵심 기능 1: 4단계 판정 로직

PriceDrop MVP의 핵심은 단순한 가격 비교를 넘어선 **스마트 딜 판정 시스템**입니다.

```
Naver Shopping 수집 → SQLite 저장 → Drop Detection → Telegram 발행
```

판정 규칙:

| 규칙 | 조건 | 결과 |
|------|------|------|
| 이력 부족 | 최근 이력이 충분하지 않음 | 발행 안 함 |
| 임계치 미달 | 하락률 < 카테고리 임계치 | 발행 안 함 |
| 중복 딜 | 최근 더 좋거나 같은 가격 딜 존재 | 발행 안 함 |
| 의심 할인 | 최근 급등 후 할인 패턴 | suspicious로 차단 |

이 4중 필터로 노이즈 없는 진짜 가격 하락 딜만 텔레그램에 발송됩니다. 특히 "의심 할인" 감지는 인위적 가격 조작(먼저 올리고 내리는 패턴)을 차단하는 중요한 보호 장치입니다.

---

## 핵심 기능 2: 모듈식 파이프라인 구조

```
src/pricedrop/
├── app.py           CLI 엔트리포인트와 전체 파이프라인 조립
├── config.py        환경변수 로드와 설정 검증
├── db/              SQLite 스키마와 저장소
├── detection/       가격하락 판정 로직
├── providers/       외부 마켓 API 어댑터 (현재: Naver)
└── publishing/      Telegram 발행 어댑터
```

각 모듈이 독립적으로 분리되어 있어 공급자 추가(Coupang, G마켓 등)나 발행 채널 변경(Slack, Discord 등)이 용이합니다. 현재 범위:

| 포함 | 제외 |
|------|------|
| Naver Shopping 수집 | 웹 UI |
| SQLite 저장 | 결제 기능 |
| 가격하락 판정 | 글로벌 마켓 |
| Telegram 발행 | Claude AI 딜 심사 |

---

## 기술 스택 및 아키텍처

- **언어**: Python 100%
- **데이터베이스**: SQLite (로컬 파일 기반)
- **알림**: Telegram Bot API
- **데이터 소스**: Naver Shopping API
- **라이선스**: MIT
- **패키지 관리**: pyproject.toml (Python 3.11+)

환경변수는 `.env.example`을 복사해 설정합니다:
```
NAVER_CLIENT_ID=...
NAVER_CLIENT_SECRET=...
TELEGRAM_BOT_TOKEN=...
TELEGRAM_CHAT_ID=...
```

---

## 설치 및 사용법

### 설치

```bash
git clone https://github.com/sinmb79/pricedrop-io.git
cd pricedrop-io

python -m venv .venv
.venv\Scripts\activate   # Windows
# source .venv/bin/activate  # macOS/Linux

pip install -e . pytest
```

### 환경 설정

```bash
# .env.example 참고해 환경변수 설정 (Naver API + Telegram)
```

### 테스트 실행

```bash
pytest -v
```

### 파이프라인 실행

```bash
pricedrop --category electronics --limit 10 --db-path pricedrop.db
```

---

## 다음 단계 (로드맵)

개발자가 밝힌 향후 계획:

1. **n8n 연동**: n8n 워크플로우에서 이 CLI를 스케줄로 호출
2. **공급자 확장**: Coupang, G마켓 등 Naver 외 마켓 추가
3. **AI 딜 심사**: Claude 기반 AI가 딜 품질을 한 번 더 검토
4. **웹 피드**: Next.js 기반 딜 피드 웹사이트 구축

특히 n8n과의 연동은 같은 개발자의 다른 프로젝트(`blog-writer`, `Shorts-engine`)와 함께 22B Labs의 통합 자동화 생태계 구축 방향성을 보여줍니다.

---

## 마치며

PriceDrop MVP는 아직 초기 단계이지만, 한국 쇼핑 시장 특화 가격 모니터링 파이프라인의 검증된 기초를 제공합니다. 의심 할인 감지와 중복 딜 필터로 노이즈를 줄인 스마트 알림 시스템이 특징입니다.

직접 가격 알림 시스템을 만들고 싶거나, 이 MVP를 확장해 더 넓은 마켓을 커버하고 싶은 개발자에게 좋은 출발점이 됩니다.

- GitHub: [sinmb79/pricedrop-io](https://github.com/sinmb79/pricedrop-io)
- 라이선스: MIT
- 개발: 22B Labs
