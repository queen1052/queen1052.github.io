---
title: "Hummingbot: 오픈소스 고빈도 암호화폐 트레이딩 봇 프레임워크"
date: "2026-04-11"
category: "핀테크"
tags: ["암호화폐", "알고트레이딩", "마켓메이킹", "Python", "DEX", "CEX"]
excerpt: "140개 이상 거래소에서 작동하는 오픈소스 암호화폐 트레이딩 봇. CEX·DEX·AMM을 모두 지원하며 사용자들이 연간 340억 달러의 거래량을 생성한다."
author: "큐레이터"
readTime: "7분"
image: null
---

## 소개

알고리즘 트레이딩은 오랫동안 기관 투자자의 전유물이었습니다. **Hummingbot**은 이 장벽을 허물고자 합니다. "고빈도 트레이딩의 민주화"를 미션으로 내건 이 오픈 소스 프레임워크는 140개 이상의 거래소에서 자동화된 트레이딩 전략을 실행할 수 있게 해 줍니다.

GitHub Stars 18,100개, 기여자 224명, Apache 2.0 라이선스로 공개된 Hummingbot은 지난 1년간 사용자들이 340억 달러의 거래량을 생성하는 글로벌 플랫폼으로 성장했습니다. CEX(중앙화 거래소), CLOB DEX(온체인 주문장), AMM DEX(자동 시장 조성자)를 단일 프레임워크에서 통합 지원한다는 점이 핵심 강점입니다.

---

## 주요 기능

| 기능 | 설명 |
|------|------|
| 140+ 거래소 연결 | Binance, OKX, Hyperliquid, Uniswap, dYdX 등 |
| 3가지 커넥터 유형 | CLOB CEX, CLOB DEX, AMM DEX 통합 지원 |
| Gateway DEX 미들웨어 | 여러 블록체인의 DEX를 표준화된 API로 통합 |
| 스크립트 기반 전략 | Python으로 커스텀 전략 자유롭게 작성 |
| V2 컨트롤러 | 모듈식 전략 구성 요소 재사용 |
| Docker 배포 | 원클릭 설치 및 실행 |
| MCP 통합 | Claude·Gemini로 Hummingbot 봇 제어 |

---

## 핵심 기능 1: 세 가지 커넥터 유형

Hummingbot의 커넥터 아키텍처는 다양한 거래 환경을 표준화합니다.

**CLOB CEX (중앙화 거래소)**
- Spot: Binance, OKX, KuCoin, Kraken 등
- Perpetual: Binance Perpetual, Hyperliquid Perpetual 등
- API 키로 연결, 거래소가 자산 보관

**CLOB DEX (온체인 주문장)**
- Spot: Hyperliquid, dYdX v4, Injective Helix 등
- 지갑 키로 연결, 비수탁 방식

**AMM DEX (자동 시장 조성자)**
- Gateway 미들웨어를 통해 연결
- Router: Uniswap, Jupiter (최적 스왑 경로 탐색)
- AMM: Uniswap, PancakeSwap, Raydium, SushiSwap
- CLMM: Meteora, Uniswap v3 (집중 유동성)

이 분류 체계로 전략 코드는 거래소에 독립적으로 작성하고, 커넥터만 교체해 다양한 환경에 배포할 수 있습니다.

---

## 핵심 기능 2: 마켓 메이킹과 V2 전략 시스템

Hummingbot의 핵심 전략은 **마켓 메이킹**(bid-ask 스프레드 제공)이지만, V2 컨트롤러 시스템으로 다양한 전략을 모듈식으로 구성할 수 있습니다.

제공되는 전략 유형:
- **Pure Market Making**: 양방향 호가 지속 제공
- **Cross-exchange Market Making**: 레퍼런스 거래소와 가격 차이 활용
- **AMM Arbitrage**: DEX와 CEX 간 차익 거래
- **Liquidity Mining**: 지정된 거래쌍에 유동성 공급 보상
- **TWAP/VWAP**: 시간·거래량 가중 평균 주문 분할

`scripts/` 폴더의 Python 파일로 완전히 커스텀 전략을 작성할 수 있으며, `controllers/` 폴더의 V2 컴포넌트를 조합해 복잡한 전략을 빠르게 구성하는 것도 가능합니다.

---

## 기술 스택 및 아키텍처

```
hummingbot/
├── hummingbot/           # 핵심 엔진
│   ├── connector/        # 거래소 커넥터
│   ├── strategy/         # 내장 전략
│   └── client/           # CLI 인터페이스
├── controllers/          # V2 전략 컴포넌트
├── scripts/              # 사용자 커스텀 전략
├── conf/                 # 설정 파일
├── gateway/              # DEX 미들웨어 (별도 서비스)
└── docker-compose.yml
```

- **언어**: Python 96.9%, Cython 3.0% (성능 최적화), C++ 0.1%
- **라이선스**: Apache 2.0
- **레퍼런스**: [hummingbot.org](https://hummingbot.org/)

Cython을 사용해 성능이 중요한 오더북 처리·시장 데이터 수신 부분을 컴파일하는 점이 특징입니다. 거버넌스는 HBOT 토큰으로 운영되며, 커뮤니티 투표로 커넥터 유지보수와 기능 로드맵이 결정됩니다.

---

## 설치 및 사용법

### Docker로 설치 (권장)

```bash
git clone https://github.com/hummingbot/hummingbot.git
cd hummingbot

# 설치 및 배포 (Gateway 포함 여부 선택)
make setup   # Gateway 포함 여부 묻는 프롬프트 표시
make deploy

# 실행 중인 인스턴스에 연결
docker attach hummingbot
```

### Gateway DEX 미들웨어 포함

```bash
make setup
# "Include Gateway? [y/N]" → y 입력
make deploy
```

### 소스에서 설치 (개발·커스텀)

```bash
conda create -n hummingbot python=3.10
conda activate hummingbot
pip install -e .
./compile    # Cython 컴파일
./start
```

### Telegram 봇으로 제어 (Condor)

```bash
# Hummingbot API를 통해 Telegram으로 봇 제어
# 설정: https://hummingbot.org/condor/installation/
```

---

## 마치며

Hummingbot은 알고리즘 트레이딩의 진입 장벽을 낮추는 데 성공한 플랫폼입니다. 연간 340억 달러의 사용자 생성 거래량이 그 실용성을 증명합니다.

CEX와 DEX를 동일한 프레임워크에서 다루고, HBOT 거버넌스로 커뮤니티가 방향을 결정하며, MCP 통합으로 Claude 같은 AI 어시스턴트가 트레이딩 봇을 직접 제어하는 미래도 열어가고 있습니다.

암호화폐 자동 트레이딩에 관심이 있다면, Hummingbot은 가장 풍부한 생태계와 검증된 트랙 레코드를 가진 출발점입니다.

- GitHub: [hummingbot/hummingbot](https://github.com/hummingbot/hummingbot)
- 공식 문서: [hummingbot.org](https://hummingbot.org/)
- 라이선스: Apache 2.0
- Stars: 18.1k+
