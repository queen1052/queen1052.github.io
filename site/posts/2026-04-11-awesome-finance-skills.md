---
title: "Awesome Finance Skills: AI 에이전트를 월스트리트 애널리스트로 만드는 금융 스킬 컬렉션"
date: "2026-04-11"
category: "AI 도구"
tags: ["금융 분석", "AI 스킬", "주식", "뉴스 분석", "Claude Code"]
excerpt: "8개 스킬로 LLM에 실시간 뉴스, 주식 데이터, 감성 분석, 시계열 예측, 논리 체인 시각화를 부여한다. npx 한 줄로 Claude·Codex·Gemini가 금융 전문가가 된다."
author: "큐레이터"
readTime: "7분"
image: null
---

## 소개: AI 에이전트에 금융 분석 능력을 플러그인하다

AI 에이전트에게 "오늘 금 가격 폭락이 A주에 어떤 영향을 미칠까?"라고 물으면 어떤 일이 벌어질까? 일반적인 LLM은 학습 시점 이전 데이터에 기반한 일반적인 설명만 할 수 있다. 실시간 뉴스, 현재 주가, 시장 감성, 예측 모델은 없다.

**Awesome Finance Skills**는 이 간극을 메우는 오픈소스 금융 분석 스킬 컬렉션이다. GitHub 스타 1,700개, 포크 226개, Python 100%, Apache-2.0 라이선스. DeepEar/AlphaEar 프레임워크의 스킬 레이어로, Claude Code, Codex, Gemini CLI, OpenCode, Antigravity 등 모든 주요 AI 에이전트 프레임워크에서 작동한다.

핵심은 단순하다: 스킬 폴더를 복사하면 AI 에이전트가 10개 이상 뉴스 소스에서 실시간으로 정보를 가져오고, 주가를 조회하고, 감성을 분석하고, 시계열을 예측하며, 시장 영향 전달 체인 다이어그램까지 그릴 수 있게 된다.

## 8가지 핵심 스킬

| 스킬 | 기능 | 데이터 소스 |
|------|------|------------|
| **alphaear-news** | 실시간 금융 뉴스 & 트렌드 | 10+ 소스, Polymarket 예측 시장 |
| **alphaear-stock** | A주/홍콩/미국 주식 데이터 | 티커 검색, OHLCV, 기업 기본정보 |
| **alphaear-sentiment** | FinBERT/LLM 감성 분석 | 점수: -1.0 ~ +1.0 |
| **alphaear-predictor** | Kronos 시계열 예측 모델 | 뉴스 감성 연동 동적 조정 |
| **alphaear-signal-tracker** | 투자 신호 진화 추적 | 강화/약화/반증 판단 |
| **alphaear-logic-visualizer** | 시장 영향 전달 체인 시각화 | Draw.io XML 출력 |
| **alphaear-reporter** | 전문 리서치 리포트 생성 | 계획→작성→편집→차트 |
| **alphaear-search** | 전체 인터넷 검색 & 로컬 RAG | Jina/DuckDuckGo/바이두 |

뉴스 소스에는 财联社(Cailian), 华尔街见闻(WSJ China), 微博(Weibo), Polymarket 예측 시장 등 중국과 글로벌 10개 이상의 소스가 포함된다.

## 핵심 기능 1: 뉴스 분석과 논리 체인

가장 차별화된 기능은 **alphaear-logic-visualizer**다. 단순히 뉴스를 요약하는 게 아니라, 시장 영향의 전달 경로를 시각적으로 다이어그램으로 만든다.

예를 들어 "미국 연준 금리 인상 발표" 뉴스가 들어오면:

```
연준 금리 인상
→ 달러 강세
  → 신흥시장 자본 유출
    → 중국 A주 외자 감소
      → 역외 위안화 약세
        → 수출 관련주 상승
        → 내수 관련주 하락
→ 미국채 수익률 상승
  → 성장주 밸류에이션 압박
    → 기술주 조정
```

이 전달 체인이 Draw.io XML로 출력되어 즉시 시각화할 수 있다. 리서치 리포트의 핵심 섹션이 자동으로 완성된다.

**alphaear-news**는 10개 이상 소스에서 집계한 핫뉴스를 제공하면서 Polymarket 예측 시장 데이터도 통합한다. 시장이 어떤 결과에 얼마의 확률을 베팅하는지를 뉴스와 함께 볼 수 있다.

## 핵심 기능 2: 예측 모델과 감성 분석

**alphaear-predictor**는 Kronos 라는 시계열 예측 모델을 기반으로 한다. 순수한 과거 가격 데이터만이 아니라 뉴스 감성 점수를 동적으로 반영해 예측을 조정한다.

**alphaear-sentiment**는 FinBERT(금융 특화 BERT)와 LLM을 결합해 뉴스 텍스트의 감성을 -1.0에서 +1.0 스케일로 정량화한다. 이 점수가 alphaear-predictor의 뉴스 인식 조정에 입력된다.

**alphaear-signal-tracker**는 투자 신호의 진화를 추적한다. 특정 종목에 대한 강세 신호가 시간이 지나며 강화됐는지, 약화됐는지, 반증 사례가 나왔는지를 체계적으로 기록한다.

## 기술 스택과 통합 가이드

- **언어**: Python 100%
- **라이선스**: Apache-2.0
- **관련 프로젝트**: DeepEar Live Demo → https://deepear.vercel.app/ (무료 Lite 버전)

### 프레임워크별 설치 위치

| 프레임워크 | 위치 유형 | 경로 |
|-----------|----------|------|
| Claude Code / Codex | 개인 | `~/.claude/skills/` 또는 `~/.codex/skills/` |
| Claude Code / Codex | 프로젝트 | `.claude/skills/` |
| OpenCode | 글로벌 | `~/.config/opencode/skills/` |
| OpenCode | 프로젝트 | `.opencode/skills/` 또는 `.claude/skills/` |
| Antigravity | 글로벌 | `~/.gemini/antigravity/global_skills/<skill>/` |
| OpenClaw | 워크스페이스 | `<workspace>/skills/` |

각 스킬 폴더에는 `SKILL.md` 파일이 있어야 한다.

## 설치와 사용법

### 방법 1: npx 한 줄 설치 (권장)

```bash
# 특정 스킬 설치 (예: alphaear-news)
npx skills add RKiding/Awesome-finance-skills@alphaear-news

# 검색해서 선택
npx skills find "alphaear"
```

### 방법 2: 수동 설치

```bash
git clone https://github.com/RKiding/Awesome-finance-skills.git

# OpenCode 글로벌 설치
cp -r Awesome-finance-skills/skills/* ~/.config/opencode/skills/

# Claude Code 개인 설치
cp -r Awesome-finance-skills/skills/* ~/.claude/skills/
```

설치 후 AI에게 한국어로 물어보면 된다:

```
"오늘 금 가격 폭락이 A주에 어떤 영향을 미칠까?"
"삼성전자 최근 2週 뉴스 감성과 주가 흐름을 분석해줘"
"NVDA 다음 분기 실적 예측과 리스크 요인을 분석해줘"
"애플 실적 발표가 나스닥 기술주에 미치는 전달 경로를 그려줘"
```

즉시 실시간 데이터가 포함된 분석이 돌아온다.

## 마치며

Awesome Finance Skills는 AI 에이전트의 가장 큰 약점 중 하나 — 실시간 금융 데이터와 전문 분석 능력의 부재 — 를 플러그인 형태로 해결한다.

월스트리트 애널리스트가 사용하는 것과 같은 분석 과정(뉴스 집계→감성 분석→시장 영향 전달 체인→예측 모델→리포트 생성)이 14개의 `SKILL.md` 파일로 패키징되어 있다. npx 한 줄이면 당신의 Claude나 Codex가 이 능력을 가진다.

1,700개의 스타와 226개의 포크, DeepEar Free Lite Demo까지 공개된 이 프로젝트. 금융 AI 에이전트 개발자라면 필수 참고 자료다.
