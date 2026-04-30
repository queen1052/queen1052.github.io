---
title: "tradingview-mcp: 30개 이상의 기술 분석 도구를 Claude에 연결하는 AI 트레이딩 MCP 서버"
date: "2026-04-11"
category: "AI 트레이딩"
tags: ["MCP", "트레이딩", "기술분석"]
excerpt: "TradingView 기술 분석, 백테스팅, 실시간 감성 분석, Yahoo Finance를 Claude Desktop에 연결하는 30개 이상의 MCP 도구를 제공하는 AI 트레이딩 인프라입니다."
author: "큐레이터"
readTime: "7분"
image: null
---

## tradingview-mcp란?

**tradingview-mcp**는 TradingView 기술 분석, 백테스팅 엔진, 실시간 감성 분석, Yahoo Finance 데이터를 Claude Desktop과 모든 MCP 호환 클라이언트에 연결하는 AI 트레이딩 인텔리전스 프레임워크입니다. 1,600개 이상의 스타와 353개의 포크를 보유하며 활발히 개발 중입니다.

Python 99.5%로 구현되었으며 MIT 라이선스로 공개되어 있습니다. `pip install tradingview-mcp-server` 한 줄로 설치 가능하며 API 키가 필요 없습니다.

가장 큰 장점은 **설치 5분에 추가 비용 없이** TradingView 기술 분석과 Yahoo Finance 실시간 데이터를 자유롭게 사용할 수 있다는 점입니다.

## 주요 기능

tradingview-mcp가 제공하는 기능들을 살펴보겠습니다.

**기술 분석 (30개+ 지표)**: RSI, MACD, 볼린저 밴드, 23개 지표로 구성된 완전한 TA 분석, 15개 캔들스틱 패턴 감지, 다중 시간프레임 분석(주→일→4H→1H→15m)을 제공합니다.

**백테스팅 엔진**: 6개 전략(RSI, MACD, Supertrend 등) + Sharpe 비율, Calmar 비율, 기대값 지표, 워크포워드 백테스팅(과적합 감지)을 지원합니다.

**Yahoo Finance 실시간 가격**: 주식(AAPL, TSLA, NVDA), 암호화폐(BTC-USD, ETH-USD), ETF(SPY, QQQ), 지수(^GSPC, VIX), 외환(EURUSD=X), 국내 주식(THYAO.IS 등)의 실시간 인용을 지원합니다.

**AI 감성 & 인텔리전스**: Reddit 커뮤니티 감성(강세/약세 점수), Reuters·CoinDesk·CoinTelegraph RSS 실시간 뉴스, 기술 분석 + Reddit 감성 + 뉴스를 통합하는 결합 분석 도구를 제공합니다.

**멀티 거래소 지원**: Binance, KuCoin, Bybit (암호화폐), NASDAQ/NYSE (미국 주식), EGX (이집트), BIST (터키 via TradingView).

## 30개 이상의 MCP 도구

tradingview-mcp가 Claude에 제공하는 MCP 도구 목록입니다.

**기술 분석 도구**:
- `get_technical_analysis`: RSI, MACD, 볼린저 밴드, 23개 지표 + BUY/SELL/HOLD
- `get_bollinger_band_analysis`: 독자적인 ±3 BB 평가 시스템
- `get_stock_decision`: 3계층 결정 엔진 (순위 + 매매 설정 + 품질 점수)
- `screen_stocks`: 20개 이상 필터로 멀티 거래소 스크리너
- `get_candlestick_patterns`: 15개 캔들스틱 패턴 감지
- `get_multi_timeframe_analysis`: 다중 시간프레임 정렬 분석

**가격/시장 도구**:
- `yahoo_price`: 실시간 시세 + 52주 고저가
- `market_snapshot`: S&P500, NASDAQ, VIX, BTC, ETH, EUR/USD 글로벌 개요

**감성/AI 도구**:
- `market_sentiment`: 금융 커뮤니티 Reddit 감성
- `financial_news`: 실시간 RSS 헤드라인
- `combined_analysis`: 기술 분석 + 감성 + 뉴스 → 통합 결정

**백테스팅 도구**:
- `backtest_strategy`: 단일 전략 백테스트
- `compare_strategies`: 모든 전략 비교

## 기술 스택 및 아키텍처

```
Python 3.10+ (tradingview-ta, yfinance, praw)
TradingView 스크리너 API (기술 분석)
Yahoo Finance (yfinance 무료 실시간 데이터)
Reddit PRAW (감성 분석)
RSS Parser (실시간 뉴스)
MCP SDK (Claude Desktop 통합)
Docker (컨테이너화 배포)
```

**아키텍처**: Claude Desktop → MCP 프로토콜 → tradingview-mcp 서버 → TradingView/Yahoo/Reddit API

설치가 없는 API 키: TradingView 스크리너와 Yahoo Finance는 무료이므로 별도 API 키가 필요 없습니다. Reddit 감성 분석을 위해서는 무료 Reddit API 앱 등록이 필요합니다.

## 설치 및 사용법

**PIP 설치**:
```bash
pip install tradingview-mcp-server
```

**Claude Desktop 설정 (claude_desktop_config.json)**:
```json
{
  "mcpServers": {
    "tradingview": {
      "command": "/Users/YOUR_USERNAME/.local/bin/uvx",
      "args": ["--from", "tradingview-mcp-server", "tradingview-mcp"]
    }
  }
}
```

**소스 빌드**:
```bash
git clone https://github.com/atilaahmettaner/tradingview-mcp
cd tradingview-mcp
uv run tradingview-mcp
```

**Claude와의 대화 예시**:
```
나: "NVDA에 대한 완전한 시장 스냅샷 줘"
AI: market_snapshot + get_technical_analysis → STRONG BUY (RSI 45, MACD 상향)

나: "BTC-USD에 대해 2년간 RSI 전략 백테스트"
AI: backtest_strategy → +31.5% 수익 | 100% 승률 | 2회 거래 | B&H: -5%

나: "AAPL에 대한 기술 분석 + Reddit 감성 + 뉴스 통합 분석"
AI: combined_analysis → BUY (기술 STRONG BUY + 강세 Reddit + 긍정 뉴스)
```

## 마치며

tradingview-mcp는 별도 트레이딩 플랫폼 구독 없이 Claude를 강력한 트레이딩 리서치 어시스턴트로 변환합니다. TradingView 기술 분석의 높은 품질, Yahoo Finance의 실시간 데이터, Reddit 커뮤니티 감성, 백테스팅 엔진이 하나의 MCP 서버에서 통합되어 5분 설치에 비용 없이 사용 가능합니다. 단, 이 도구는 교육·연구 목적이며 투자 조언이 아님을 항상 유의하세요.
