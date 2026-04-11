---
title: "Vibe-Trading: 자연어로 거래 전략을 짜는 AI 멀티에이전트 금융 워크스페이스"
date: "2026-04-11"
category: "AI 트레이딩"
tags: ["트레이딩", "AI에이전트", "백테스팅", "핀테크", "오픈소스"]
excerpt: "자연어 요청을 실행 가능한 트레이딩 전략으로 변환하는 HKUDS의 AI 멀티에이전트 금융 워크스페이스로, 68개 전문 스킬과 29개 스웜 팀 프리셋을 제공합니다."
author: "큐레이터"
readTime: "8분"
image: null
---

## Vibe-Trading이란?

**Vibe-Trading**은 홍콩 과학기술대학교 데이터 사이언스 랩(HKUDS)이 개발한 AI 기반 멀티에이전트 금융 워크스페이스입니다. "자연어 요청을 실행 가능한 트레이딩 전략, 연구 인사이트, 글로벌 시장 포트폴리오 분석으로 변환한다"는 것이 핵심 가치입니다.

Python 82.2%, TypeScript 17.4%로 구성되었으며 MIT 라이선스로 공개되었습니다. PyPI 패키지(`vibe-trading-ai`)로 단 한 줄로 설치할 수 있으며, MCP 프로토콜을 통해 Claude Desktop, Cursor 등에서도 사용 가능합니다.

최근 v0.1.4에서 Docker 빌드 수정, `web_search` MCP 도구 추가(총 17개), 11개 LLM 제공사 지원(DeepSeek, Groq, Gemini, Ollama 등), PyPI 및 ClawHub 공개가 이루어졌습니다.

## 주요 기능

Vibe-Trading이 제공하는 핵심 기능들을 살펴보겠습니다.

**전략 생성**: 아이디어를 자연어로 표현하면 실제 실행 가능한 트레이딩 코드로 자동 변환합니다. TradingView Pine Script v6로의 원클릭 변환도 지원합니다.

**스마트 데이터 액세스**: 5개 데이터 소스(tushare, yfinance, OKX, AKShare, ccxt)를 자동 폴백으로 지원하며, 글로벌 시장 제로 설정으로 바로 사용 가능합니다.

**멀티시장 백테스팅**: A주, 홍콩·미국 주식, 암호화폐, 선물, 외환 등 7개 시장 엔진을 지원합니다. 몬테카를로, 부트스트랩 CI, 워크포워드 등 통계적 검증을 제공합니다.

**DeepResearch 조사**: 멀티도메인 분석, 자동 전략/시그널 생성, 매크로 경제 연구, 자연어 작업 라우팅이 가능합니다.

## 68개 스킬 및 29개 스웜 팀

Vibe-Trading의 특별한 점은 도메인별 전문 스킬과 팀 구성입니다.

**스킬 카테고리 (총 68개)**:

| 카테고리 | 수 | 예시 스킬 |
|---------|---|---------|
| 데이터 소스 | 6 | data-routing, yfinance, okx-market, akshare |
| 전략 | 16 | strategy-generate, technical-basic, elliot-wave, ml-strategy |
| 분석 | 15 | factor-research, macro-analysis, valuation-model |
| 자산 유형 | 9 | options-strategy, etf-analysis, asset-allocation |
| 암호화폐 | 7 | perp-funding-basis, liquidation-heatmap, defi-yield |
| 흐름 | 7 | hk-connect-flow, edgar-sec-filings, financial-statement |
| 도구 | 8 | backtest-diagnose, pine-script, web-reader |

**29개 스웜 팀 프리셋** 예시:
- `investment_committee`: 강세/약세 토론 → 리스크 검토 → PM 최종 결정
- `crypto_trading_desk`: 펀딩/기저 + 청산 + 흐름 → 리스크 매니저
- `quant_strategy_desk`: 스크리닝 + 팩터 연구 → 백테스트 → 리스크 감사
- `technical_analysis_panel`: TA + 이치모쿠 + 하모닉 + 엘리엇 + SMC → 컨센서스

## 기술 스택 및 아키텍처

**핵심 스택**:
- Python 3.11+ (에이전트, 스킬, 백테스트 엔진)
- FastAPI (웹 서버, SSE 스트리밍)
- TypeScript (React 프론트엔드)
- Docker / Docker Compose (배포)

**지원 LLM 제공사**: OpenRouter, OpenAI, DeepSeek, Gemini, Groq, DashScope/Qwen, Zhipu, Moonshot/Kimi, MiniMax, Xiaomi MIMO, Ollama (로컬)

**MCP 17개 도구**: `list_skills`, `load_skill`, `backtest`, `factor_analysis`, `analyze_options`, `pattern_recognition`, `get_market_data`, `web_search` 등 17개의 MCP 도구를 제공합니다.

**API 엔드포인트**: REST API + SSE 스트리밍, 스웜 실행, 세션 기반 대화를 지원합니다.

## 설치 및 사용법

**PyPI 원라인 설치**:
```bash
pip install vibe-trading-ai
vibe-trading init   # .env 설정 (대화형)
vibe-trading        # CLI 실행
```

**Docker 실행**:
```bash
git clone https://github.com/HKUDS/Vibe-Trading.git
cd Vibe-Trading && cp agent/.env.example agent/.env
# .env 파일에서 LLM 제공사 API 키 설정
docker compose up --build
# http://localhost:8899 접속
```

**MCP 통합 (claude_desktop_config.json)**:
```json
{
  "mcpServers": {
    "vibe-trading": {
      "command": "vibe-trading-mcp",
      "args": []
    }
  }
}
```

**CLI 사용 예시**:
```bash
vibe-trading run -p "AAPL에 대해 2년간 RSI 전략 백테스트 해줘"
vibe-trading run -p "비트코인 현재 기술적 분석 해줘"
vibe-trading serve --port 8899  # 웹 UI 실행
```

## 마치며

Vibe-Trading은 "바이브 코딩"의 금융 분야 적용판이라고 할 수 있습니다. 복잡한 퀀트 전략을 코딩 없이 자연어로 생성하고 백테스트하는 과정이 놀랍도록 직관적입니다. HKUDS 생태계(ClawTeam, NanoBot, OpenSpace)와의 연동, 68개 전문 스킬, 29개 팀 프리셋은 개인 투자자부터 전문 트레이더까지 모두가 활용할 수 있는 강력한 기반을 제공합니다. 단, 이 도구는 연구·시뮬레이션·백테스팅 목적이며 실제 매매를 실행하지 않는다는 점을 항상 명심하세요.
