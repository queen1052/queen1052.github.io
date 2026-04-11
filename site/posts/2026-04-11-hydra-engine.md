---
title: "HYDRA Engine: 로컬 우선 올인원 자동매매 엔진"
date: "2026-04-11"
category: "핀테크"
tags: ["알고트레이딩", "백테스트", "FastAPI", "Docker", "Python", "암호화폐"]
excerpt: "데이터 수집 → 지표 계산 → 레짐 분류 → 시그널 생성 → 백테스트 → 실거래까지 하나의 저장소에서 관리하는 로컬 우선 자동매매 엔진."
author: "큐레이터"
readTime: "7분"
image: null
---

## 소개

자동매매 시스템을 직접 구축하고 싶지만 어디서 시작해야 할지 막막하다면, **HYDRA Engine**이 좋은 출발점이 될 수 있습니다. 데이터 수집, 지표 계산, 레짐 분류, 시그널 생성, 백테스트, 실거래까지 전체 파이프라인을 하나의 저장소에서 관리하는 로컬 우선(Local-first) 설계의 Python 기반 프레임워크입니다.

22B Labs(sinmb79)가 개발한 이 교육·연구·실험용 프로젝트는 GitHub Stars 19개의 신생 프로젝트이지만, FastAPI REST API, SQLite/TimescaleDB, Docker 3단계 프로필, Kill Switch 등 실전적인 기능을 갖추고 있습니다. MIT 라이선스로 공개되어 있으며, 처음 시작하는 분을 위한 상세한 한국어 가이드가 큰 강점입니다.

> ⚠️ 이 프로젝트는 교육·연구·실험용입니다. 실거래 수익을 보장하지 않으며, 사용에 따른 책임은 사용자에게 있습니다.

---

## 주요 기능

| 기능 | 설명 |
|------|------|
| OHLCV 수집기 | 거래소에서 캔들 데이터 수집, SQLite/TimescaleDB 저장 |
| 지표 계산 엔진 | RSI, MACD, Bollinger Band 등 자동 계산 |
| 레짐 분류 엔진 | 시장 상태(추세/횡보/변동성) 분류 |
| 전략 시그널 엔진 | 매수/매도 시그널 생성 |
| 인메모리 백테스트 | 수집된 데이터로 전략 성과 검증 |
| Kill Switch | 긴급 전 포지션 청산 |
| FastAPI 서버 | REST API로 모든 기능 제어 |
| Telegram 알림 | 주요 이벤트 실시간 알림 |

---

## 핵심 기능 1: 단계적 접근 철학

HYDRA의 가장 중요한 특징은 설계 철학입니다. 한 번에 모든 기능을 켜는 프로젝트가 아닙니다:

```
1단계: 테스트 실행으로 코드 정상 확인
2단계: 데이터 수집 (거래소 API 키 없어도 공개 데이터 가능)
3단계: 지표·레짐·시그널 계산 확인
4단계: API/CLI로 상태 관찰
5단계: 백테스트로 전략 검증
6단계: (충분한 검증 후) 실거래 연결
```

처음 사용자는 1~4단계부터 시작하는 것을 강력히 권장합니다. 이 단계적 접근은 리스크를 최소화하고 시스템을 충분히 이해한 후 실거래로 나아가도록 유도합니다.

---

## 핵심 기능 2: Docker 3단계 프로필

HYDRA는 사용자 수준에 맞는 세 가지 Docker 구성을 제공합니다:

| 프로필 | 파일 | 스토리지 | 대상 |
|--------|------|---------|------|
| **lite** | docker-compose.lite.yml | SQLite | 처음 시작하는 분, 개인 PC |
| **pro** | docker-compose.pro.yml | TimescaleDB + Redis | 중간 규모 수집·분석 |
| **expert** | docker-compose.expert.yml | 고사양 확장 구성 | 대용량, 고성능 서버 |

lite 프로필부터 시작해 요구사항이 늘어나면 단계적으로 업그레이드할 수 있습니다.

REST API 예시:
```bash
# 헬스체크
curl http://127.0.0.1:8000/health

# 캔들 데이터 조회
curl -G http://127.0.0.1:8000/data/candles \
  -H "X-HYDRA-KEY: my-key" \
  --data-urlencode "market=binance" \
  --data-urlencode "symbol=BTC/USDT" \
  --data-urlencode "timeframe=1h"

# 백테스트 실행
curl -X POST http://127.0.0.1:8000/backtest/run \
  -H "X-HYDRA-KEY: my-key" \
  -d '{"market":"binance","symbol":"BTC/USDT","timeframe":"1h","initial_capital":10000}'
```

---

## 기술 스택 및 아키텍처

```
Hydra-Engine/
├── hydra/
│   ├── cli/           CLI 명령어
│   ├── data/          데이터 수집·저장
│   ├── indicators/    기술적 지표 계산
│   ├── regime/        시장 레짐 분류
│   ├── signals/       매매 시그널
│   └── api/           FastAPI 서버
├── config/            설정 파일
├── n8n/               n8n 모니터링 통합
├── scripts/           유틸리티 스크립트
├── docs/              KPI 레퍼런스, 퀵스타트 가이드
├── docker-compose.lite.yml
├── docker-compose.pro.yml
└── docker-compose.expert.yml
```

- **언어**: Python 99.3%
- **API 프레임워크**: FastAPI
- **스토리지**: SQLite(lite) / TimescaleDB(pro/expert) + Redis
- **인증**: X-HYDRA-KEY 헤더
- **라이선스**: MIT

---

## 설치 및 사용법

### 저장소 클론 및 환경 설정

```bash
git clone https://github.com/sinmb79/Hydra-Engine.git
cd Hydra-Engine

python -m venv .venv
# Windows: .venv\Scripts\Activate.ps1
# macOS/Linux: source .venv/bin/activate

pip install -e .[dev]
```

### 환경 변수 설정

```bash
Copy-Item .env.example .env  # Windows PowerShell
# .env 편집:
HYDRA_API_KEY=랜덤-문자열    # API 인증 키 (반드시 변경)
HYDRA_PROFILE=lite           # lite / pro / expert
REDIS_URL=redis://localhost:6379
```

### 테스트 실행

```bash
pytest -q
# 모든 테스트 통과 → 준비 완료
```

### Docker로 전체 파이프라인 실행

```bash
docker compose -f docker-compose.lite.yml up --build

# 헬스체크
curl http://127.0.0.1:8000/health
# {"status": "ok"}
```

### CLI 주요 명령어

```bash
python -m hydra.cli.app setup           # 초기 설정 마법사
python -m hydra.cli.app status          # 현재 상태
python -m hydra.cli.app market list-markets
python -m hydra.cli.app market enable binance --mode paper
python -m hydra.cli.app kill            # Kill Switch (긴급 청산)
```

---

## 마치며

HYDRA Engine은 자동매매에 관심 있는 개발자가 처음부터 끝까지 배우고 실험할 수 있는 완전한 학습·개발 환경을 제공합니다. 단계적 접근 철학, 3단계 Docker 프로필, 상세한 한국어 문서가 진입 장벽을 크게 낮춥니다.

실거래에 앞서 백테스트와 paper 모드(모의거래)로 충분히 검증하는 것을 강력히 권장하며, 거래소 API 키는 최소 권한만 부여하는 보안 습관도 함께 기억하세요.

- GitHub: [sinmb79/Hydra-Engine](https://github.com/sinmb79/Hydra-Engine)
- 라이선스: MIT
- 개발: 22B Labs
- Stars: 19
