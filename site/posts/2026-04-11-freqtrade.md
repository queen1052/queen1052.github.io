---
title: "Freqtrade: 48.6k Stars의 오픈소스 암호화폐 거래 봇 — 백테스팅부터 FreqAI까지"
date: "2026-04-11"
category: "트레이딩"
tags: ["freqtrade", "암호화폐", "자동매매", "백테스팅", "FreqAI", "Telegram"]
excerpt: "Python으로 작성된 자유 오픈소스 암호화폐 거래 봇. 모든 주요 거래소 지원, Telegram/WebUI 제어, 머신러닝 전략 최적화(FreqAI), 강력한 백테스팅 엔진을 갖춘 성숙한 프레임워크."
author: "큐레이터"
readTime: "7분"
image: null
---

## 소개: 9년 역사의 오픈소스 암호화폐 거래 봇

48.6k 스타, 10.1k 포크, 333명의 기여자, 111개 릴리즈. 이 숫자들이 **Freqtrade**의 성숙도를 말해준다.

Freqtrade는 Python으로 작성된 자유 오픈소스 암호화폐 거래 봇이다. GPL-3.0 라이선스로 공개되어 있으며, 2017년부터 꾸준히 발전해온 성숙한 프레임워크다. Windows, macOS, Linux 모든 운영체제를 지원하고, Telegram 또는 내장 WebUI로 제어할 수 있다.

⚠️ 주의: 이 소프트웨어는 교육 목적으로만 사용해야 한다. 잃을 수 있는 돈만 위험에 노출시키고, 반드시 드라이런(Dry-Run) 모드로 먼저 테스트해야 한다. 개발자와 기여자는 trading 결과에 대한 책임을 지지 않는다.

## 주요 기능: 풀 트레이딩 파이프라인

**드라이런(Dry-Run)**으로 실제 돈 없이 봇을 실행해 전략을 안전하게 테스트한다. 충분한 검증 후에만 실전 매매로 전환한다.

**백테스팅(Backtesting)**: 과거 거래소 데이터로 매수/매도 전략을 시뮬레이션한다. `freqtrade backtesting` 명령으로 상세한 성과 리포트를 생성한다.

**하이퍼옵트(Hyperopt)**: 머신러닝으로 전략 파라미터를 최적화한다. 실제 거래소 데이터를 기반으로 최적의 매수/매도 조건을 찾아낸다.

**FreqAI**: 적응형 머신러닝 예측 모델로 전략을 강화한다. 시장 변화에 따라 자기 학습하는 스마트 전략 구현이 가능하다. XGBoost, LightGBM, Scikit-learn, PyTorch, Reinforcement Learning을 지원한다.

**화이트리스트/블랙리스트**: 거래할 코인 목록이나 동적 화이트리스트를 설정하거나, 특정 코인을 제외한다.

**법정화폐 손익 표시**: 총 손익을 USD, EUR, KRW 등 법정화폐로 환산해 직관적으로 파악한다.

**성과 리포트**: 현재 오픈 포지션의 성과 현황을 언제든지 확인할 수 있다.

## 봇 커맨드 구조

Freqtrade는 서브커맨드 구조로 다양한 작업을 처리한다:

```
freqtrade {trade|backtesting|hyperopt|download-data|...}
```

주요 커맨드:
- `trade`: 실제 거래 실행
- `backtesting`: 백테스팅 실행
- `backtesting-show`: 이전 백테스팅 결과 표시
- `hyperopt`: 하이퍼파라미터 최적화
- `hyperopt-list/show`: 하이퍼옵트 결과 관리
- `download-data`: 백테스팅용 거래소 데이터 다운로드
- `new-strategy`: 새 전략 템플릿 생성
- `plot-dataframe`: 지표와 함께 캔들 차트 시각화
- `plot-profit`: 수익 곡선 차트 생성
- `lookahead-analysis`: 잠재적 미래 데이터 사용 오류 검사

**Telegram RPC 커맨드**로 언제 어디서나 봇을 제어한다:
- `/start` / `/stop`: 봇 시작/정지
- `/stopentry`: 새 포지션 진입 차단 (기존 포지션 유지)
- `/status [table]`: 오픈 포지션 목록
- `/profit [n]`: n일간 누적 수익
- `/forceexit <id>|all`: 강제 청산
- `/performance`: 코인별 성과 통계
- `/balance`: 거래소 잔고 조회

## FreqAI 심층 분석

**FreqAI**는 Freqtrade의 머신러닝 확장 모듈이다. 시장 변화에 적응하는 예측 모델을 빌드하고, 과거 데이터로 훈련한 뒤 실시간 추론으로 트레이딩 신호를 생성한다.

지원 모델 백엔드:
- **Scikit-learn**: RandomForest, GradientBoosting 등 전통 ML
- **XGBoost**: 강력한 그래디언트 부스팅
- **LightGBM**: 빠르고 메모리 효율적인 부스팅
- **PyTorch**: 딥러닝 커스텀 모델
- **Reinforcement Learning**: 환경과 상호작용으로 학습

FreqAI 전략 예시:

```python
class FreqaiExampleStrategy(IStrategy):
    def feature_engineering_expand_all(self, dataframe, period, metadata, **kwargs):
        dataframe["%-rsi"] = ta.RSI(dataframe, timeperiod=period)
        return dataframe
    
    def set_freqai_targets(self, dataframe, metadata, **kwargs):
        dataframe["&-s_close"] = (dataframe["close"].shift(-self.freqai.feature_parameters["label_period"]) 
                                  / dataframe["close"]) - 1
        return dataframe
```

백테스팅 중에도 FreqAI 모델을 학습시키고 검증하는 워크플로우를 지원해, 실전 배포 전에 ML 전략의 효과를 충분히 검증할 수 있다.

## 전략 개발 가이드

Freqtrade의 전략은 `IStrategy` 클래스를 상속받아 개발한다. `freqtrade new-strategy` 명령으로 템플릿을 생성하면 된다.

핵심 메서드:
- `populate_indicators()`: 기술 지표 계산
- `populate_entry_trend()`: 매수 신호 정의
- `populate_exit_trend()`: 매도 신호 정의

예를 들어 간단한 EMA 교차 전략:

```python
def populate_indicators(self, dataframe, metadata):
    dataframe['ema20'] = ta.EMA(dataframe, timeperiod=20)
    dataframe['ema50'] = ta.EMA(dataframe, timeperiod=50)
    return dataframe

def populate_entry_trend(self, dataframe, metadata):
    dataframe.loc[
        (dataframe['ema20'] > dataframe['ema50']) &
        (dataframe['volume'] > 0),
        'enter_long'
    ] = 1
    return dataframe
```

전략 개발 후 `freqtrade backtesting --strategy MyStrategy`로 즉시 검증한다.

## 설치 및 시작

**Docker로 빠르게 시작** (권장):

```bash
mkdir ft_userdata
cd ft_userdata/

# Docker Compose 다운로드
curl https://raw.githubusercontent.com/freqtrade/freqtrade/stable/docker-compose.yml -o docker-compose.yml

# 설정 초기화
docker compose run --rm freqtrade create-userdir --userdir user_data
docker compose run --rm freqtrade new-config --config user_data/config.json

# 봇 시작
docker compose up -d
```

**네이티브 설치** (Python 3.11+ 필요):

```bash
git clone https://github.com/freqtrade/freqtrade.git
cd freqtrade

# Windows
setup.ps1

# Linux/macOS
./setup.sh -i

# 설정 파일 생성
freqtrade new-config --config user_data/config.json

# 드라이런으로 시작
freqtrade trade --config user_data/config.json --strategy SampleStrategy
```

**최소 요구사항**: 2GB RAM, 1GB 디스크, 2vCPU. NTP 서버와 시간 동기화 필수.

## 마치며

Freqtrade는 9년의 역사와 333명 기여자가 만든 암호화폐 자동매매의 표준 프레임워크다. 백테스팅 엔진, FreqAI 머신러닝 통합, Telegram 제어, WebUI를 강력하게 갖추고 있다.

가장 중요한 것은 철학이다: 반드시 드라이런으로 충분히 테스트하고, 잃어도 괜찮은 금액만 투자하며, Python과 코드를 이해한 후에 실전에 임해야 한다. 암호화폐 트레이딩 봇을 직접 만들고 싶은 개발자에게는 Freqtrade가 학습과 실전 모두를 위한 최선의 출발점이다.

- GitHub: [freqtrade/freqtrade](https://github.com/freqtrade/freqtrade)
