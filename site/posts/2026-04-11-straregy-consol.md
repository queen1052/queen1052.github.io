---
title: "22B Strategy Engine: Binance Futures 자동매매를 위한 풀스택 AI 트레이딩 시스템"
date: "2026-04-11"
category: "트레이딩"
tags: ["Binance", "자동매매", "AI 분석"]
excerpt: "Binance Futures 선물 거래를 위한 풀스택 자동매매 시스템. OpenClaw 기반 AI 분석, 차트 이미지 패턴 전략, Kill Switch를 갖춘 22B Strategy Engine."
author: "큐레이터"
readTime: "7분"
image: null
---

## 소개: AI가 함께 설계한 Binance 선물 자동매매 엔진

암호화폐 선물 거래의 복잡성을 AI와 함께 해결하려는 시도가 있다. **22B Strategy Engine**은 sinmb79(22B Labs)가 개발한 Binance Futures 자동매매 풀스택 시스템이다. GitHub 22 stars, Python 78% + JavaScript 11% + CSS + HTML, MIT 라이선스로 공개되어 있다.

프로젝트의 핵심 특징은 단순한 자동매매 봇이 아니라, OpenClaw(Claude) 기반 AI가 시장을 해석하고 전략을 추천하며 이미지 패턴으로 새 전략을 자동 생성하는 '지능형 거래 파트너'를 지향한다는 점이다. 현재 기본 모드는 OBSERVE/LIMITED(페이퍼 트레이딩)이며, 실전 매매 전에 충분한 테스트를 권장하고 있다.

⚠️ 주의: 이 소프트웨어는 교육·연구 목적으로 공개되었다. 암호화폐 선물 거래는 원금 전액 손실 위험이 있으며, 개발자는 금전적 손실에 대한 책임을 지지 않는다.

## 주요 기능: 코어 트레이딩 엔진

**거래 엔진**은 Binance WebSocket → DataStore(메모리+SQLite) → RegimeDetector → StrategyManager → Executor의 파이프라인으로 작동한다. 실시간 시장 데이터를 수집하고, BTC 시장 국면(상승/하락/횡보)을 판단한 뒤, 각 전략의 신호를 수집해 스코어링 후 상위 N개를 실행한다.

**전략 시스템**은 신호 기반 모듈형 설계다. 각 전략은 `generate_signals()` 메서드를 구현하면 되며, 3종의 기본 전략(돌파형, 역추세형, 모멘텀+볼류)이 내장되어 있다. 전략별 승률, 손익비, MDD, 기대값, 건강도가 실시간으로 추적된다. 건강도가 낮은 전략은 자동으로 경고 또는 비활성화된다.

**안전장치**는 세 가지 레벨로 구성된다. Kill Switch는 Soft(신규 진입 차단, 기존 포지션 SL/TP 보호)와 Hard(모든 활동 즉시 중단) 두 가지 모드를 지원한다. 5분 주기 Reconciler가 거래소와 DB를 대조해 불일치를 감지하고, 포트폴리오 제약으로 과도한 집중 투자를 방지한다.

## AI 분석 기능 심층 분석

**OpenClaw 연동 AI 분석**이 이 시스템의 가장 독특한 기능이다. 네 가지 상황에서 AI가 분석을 제공한다.

시장 국면 전환 시: BTC 레짐이 변경될 때마다 AI가 전환 이유, 관련 신호, 전략 추천을 분석한다. 매일 22:00 UTC: 일일 리뷰로 전략 성과와 시장 요약을 자동 생성한다. 매주 일요일 00:00 UTC: 심층 분석과 전략 승격/강등 추천을 제공한다. 사용자 요청 시: 차트 이미지를 업로드하면 AI가 패턴을 분석해 조건 JSON을 자동 추출한다.

**이미지 패턴 전략**은 가장 혁신적인 기능이다. 차트 이미지를 대시보드에 드래그앤드롭으로 업로드하면 OpenClaw 비전 모델이 패턴을 분석하고, 20종의 조건 타입(rsi_above/below, macd_cross_bullish/bearish, candle_hammer, candle_engulfing_bullish 등) 중에서 적합한 조건을 JSON으로 추출해 자동으로 전략을 생성한다. AI 기능은 OpenClaw 서버 연결이 필요하며, 미연결 시에도 FAQ+문서 기반 답변은 정상 작동한다.

```python
# AI 클라이언트 설정 (.env)
AI_ENABLED=true
OPENCLAW_BASE_URL=http://127.0.0.1:18789

# Binance 설정
BINANCE_API_KEY=your_api_key
BINANCE_SECRET_KEY=your_secret_key
BINANCE_TESTNET=true  # 테스트넷으로 시작 권장
```

## 대시보드 및 성과 분석

`http://localhost:8000`에서 접근하는 FastAPI 기반 대시보드는 30개 이상의 REST API 엔드포인트를 제공하며, `/api/docs`에서 Swagger UI로 확인할 수 있다. 실시간 WebSocket으로 틱 데이터, 신호, 포지션 변경이 즉시 반영된다.

**패널 구성**: System Status(연결 상태), Market Regime(BTC 시장 국면+8개 지표), Live Indicators(심볼별 실시간 지표), Strategy Signals(전략 신호 스트림), Positions(LIVE/PAPER), Strategy Board(전략 성과), Paper Trading Performance($1,000 기준 시뮬레이션), Trade Log, Regime & AI Analysis, Settings(모드 변경, Kill Switch, AI 토글).

**페이퍼 성과 분석**은 $1,000 기준 가상 자본으로 실제 시장 데이터를 바탕으로 성과를 시뮬레이션한다. 승률(Win Rate), 총 거래수, 순손익($), 최종 잔고, 손익비(Profit Factor, ≥1.5 권장), 최대 낙폭(Max DD), 기대값(거래당 기대 수익 $)을 계산한다.

## 기술 스택 및 전략 개발 가이드

**기술 스택**: Python 3.12+, FastAPI + uvicorn(ASGI), asyncio + websockets(비동기), pandas + numpy(데이터 분석), SQLite WAL 모드, httpx, OpenAI SDK(OpenClaw 호환, 이미지 비전 지원), python-telegram-bot, Vanilla JS + WebSocket(프론트엔드).

**커스텀 전략 개발**은 최소 구현으로 가능하다. `BaseStrategy`를 상속받아 `generate_signals()` 메서드를 구현하면 된다. 예를 들어 20봉 최고가 돌파 전략:

```python
def generate_signals(self, data, price):
    signals = []
    if price > max(data['closes'][-20:]):
        signals.append(Signal(
            direction="LONG",
            tp=round(price * 1.03, 8),   # +3% TP
            sl=round(price * 0.985, 8),  # -1.5% SL
            reason=f"20봉 최고가 돌파: {price:.2f}",
        ))
    return signals
```

새 전략을 `bot/strategies/` 폴더에 추가하면 StrategyManager가 자동으로 감지해 등록한다.

## 설치 및 사용법

```bash
# 1. 클론
git clone https://github.com/sinmb79/straregy-consol.git
cd straregy-consol

# 2. 가상환경 및 패키지 설치
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt

# 3. 환경 변수 설정
cp .env.example .env
# .env 편집: Binance API 키 입력 (테스트넷 권장)

# 4. 실행
python -m bot.main

# Windows 배치 파일 사용 시
start.bat
```

처음 시작 권장 순서: ① 테스트넷 API 키로 시작 → ② OBSERVE 모드에서 전략 성과 관찰 → ③ 페이퍼 트레이딩으로 검증 → ④ 충분한 수익률 확인 후 실전 검토. 대시보드: `http://localhost:8000`, API 문서: `http://localhost:8000/api/docs`.

## 마치며

22B Strategy Engine은 코드와 AI가 협력해 만든 트레이딩 시스템이다. 차트 이미지 하나로 전략을 자동 생성하거나, AI가 시장 국면을 해석해 전략을 추천하는 기능은 기존 자동매매 프레임워크에서 보기 드문 기능이다.

암호화폐 선물 거래는 높은 위험이 수반되므로 반드시 테스트넷과 페이퍼 트레이딩으로 충분히 검증한 후 실전에 임해야 한다. 교육·연구 목적의 프로젝트로서, Python 기반 자동매매 시스템을 배우고 싶은 개발자에게 훌륭한 학습 자료가 될 것이다.

- GitHub: [sinmb79/straregy-consol](https://github.com/sinmb79/straregy-consol)
