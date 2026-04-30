---
title: "Hermes Agent: 스스로 성장하는 자기개선형 AI 에이전트"
date: "2026-04-11"
category: "AI 도구"
tags: ["AI 에이전트", "자기개선 AI", "멀티플랫폼"]
excerpt: "경험에서 스킬을 생성하고, 대화 기록을 검색하며, 당신을 점점 더 깊이 이해하는 유일한 AI 에이전트. Telegram·Discord·Slack에서 클라우드 VM을 제어한다."
author: "큐레이터"
readTime: "8분"
image: null
---

## 소개: 당신과 함께 성장하는 에이전트

AI 에이전트는 대부분 비슷한 한계를 가지고 있다. 세션이 끝나면 모든 맥락이 사라지고, 같은 질문을 다음에 또 설명해야 한다. 명령어를 외워야 하고, 노트북에서만 실행해야 하며, 복잡한 작업을 맡기면 중간에 막혀버린다.

**Hermes Agent**는 NousResearch가 만든 Python 기반 오픈소스 AI 에이전트로, 이 문제들을 정면으로 해결한다. GitHub 스타 54,400개, 기여자 378명, MIT 라이선스로 공개된 이 도구는 "사용할수록 똑똑해지는" 에이전트를 목표로 한다.

핵심 가치는 하나다: **닫힌 학습 루프(closed learning loop)**. 복잡한 작업을 마친 후 에이전트가 스스로 스킬을 생성하고, 사용 중에 그 스킬을 개선하며, 대화 기록을 검색 가능한 형태로 저장하고, Honcho 변증법적 사용자 모델링을 통해 당신이 어떤 사람인지 점점 더 깊이 이해한다. 노트북에 묶이지 않고 $5짜리 VPS나 클라우드 VM에서 실행하며 Telegram으로 제어할 수 있다.

## 주요 기능

Hermes Agent가 다른 에이전트와 구별되는 핵심 기능들이다.

**자기개선 스킬 시스템**: 복잡한 작업을 완료하면 에이전트가 자율적으로 스킬을 생성한다. 다음번에 비슷한 작업이 오면 저장된 스킬을 사용해 더 빠르게, 더 정확하게 처리한다. agentskills.io 오픈 표준을 따르므로 다른 도구와 스킬 공유도 가능하다.

**메모리와 세션 검색**: FTS5 전문 검색과 LLM 요약으로 과거 대화를 검색할 수 있다. "지난달에 우리가 OAuth에 대해 뭐라고 말했지?"라는 질문에 실제로 답할 수 있다.

**멀티플랫폼 메시징**: Telegram, Discord, Slack, WhatsApp, Signal, 이메일 모두를 단일 게이트웨이 프로세스로 지원한다. 음성 메모 전사, 플랫폼 간 대화 연속성도 포함된다.

**유연한 실행 환경**: 로컬, Docker, SSH, Daytona, Singularity, Modal 6개의 터미널 백엔드를 지원한다. Daytona와 Modal은 서버리스 지속성을 제공해 에이전트 환경이 유휴 시 동면하고 요청 시 깨어난다.

**배치 처리와 병렬화**: 격리된 서브에이전트를 생성해 병렬 작업흐름을 위임할 수 있다. 도구를 RPC로 호출하는 Python 스크립트를 작성해 멀티스텝 파이프라인을 제로 컨텍스트 비용 턴으로 압축할 수 있다.

## 닫힌 학습 루프: 에이전트가 스스로 성장하는 방법

Hermes의 가장 독특한 특징은 단순한 실행이 아니라 **학습과 개선**이다.

### 에이전트 큐레이션 메모리

주기적인 넛지(nudge) 시스템이 메모리 영속성을 보장한다. 에이전트는 대화 후 중요한 정보를 MEMORY.md와 사용자 프로필에 저장하도록 스스로 상기시킨다. 이는 단순한 벡터 저장이 아니라 구조화된 지식으로 쌓인다.

### 스킬 자동 생성

복잡한 작업을 완료한 후 에이전트는 그 과정에서 배운 것을 스킬로 패키징한다. 다음 세션에서 `/skills`를 실행하면 새로운 스킬이 목록에 들어있다. 스킬은 사용 중에 자기개선(self-improve)된다.

### Honcho 사용자 모델링

Honcho 변증법적 시스템이 사용자를 모델링한다. 당신이 어떤 방식으로 질문하고, 어떤 코딩 스타일을 좋아하며, 어떤 설명 깊이를 선호하는지 학습해 응답을 개인화한다.

### 크론 스케줄러

자연어로 반복 작업을 예약할 수 있다. "매일 밤 11시에 Git 커밋 요약을 Telegram으로 보내줘", "월요일 아침마다 지난 주 코드 리뷰를 정리해줘" 같은 명령이 작동한다.

## RL 훈련과 리서치 기능

Hermes는 실용적 에이전트를 넘어 AI 리서치 플랫폼이기도 하다.

**Atropos RL 환경**: 멀티스텝 웹 리서치를 위한 WebResearchEnv 강화학습 환경이 포함된다. 배치 궤적 생성, 궤적 압축으로 다음 세대 도구 호출 모델 훈련 데이터를 만들 수 있다.

**미니 SWE 러너**: 소프트웨어 엔지니어링 벤치마크를 위한 내장 실행기가 있다.

**OpenClaw 마이그레이션**: OpenClaw 사용자라면 설정, 메모리, 스킬, API 키를 `hermes claw migrate`로 자동 가져올 수 있다.

## 기술 스택과 아키텍처

- **언어**: Python 94.0%, TeX 2.8%, Shell 0.6%, Nix 0.4%, JavaScript 0.3%
- **LLM 지원**: Nous Portal, OpenRouter(200+ 모델), z.ai/GLM, Kimi/Moonshot, MiniMax, OpenAI, 개인 엔드포인트. `hermes model`로 전환, 코드 변경 없음
- **메시징**: Telegram, Discord, Slack, WhatsApp, Signal, CLI, 이메일
- **터미널 백엔드**: 로컬, Docker, SSH, Daytona, Singularity, Modal
- **메모리 스토어**: SQLite FTS5, 사용자 프로필, SOUL.md 퍼소나, Honcho 모델링
- **스킬 표준**: agentskills.io 오픈 표준 호환
- **플랫폼**: Linux, macOS, WSL2, Android(Termux)

## 설치와 사용법

**빠른 설치** (Linux, macOS, WSL2, Termux):
```bash
curl -fsSL https://raw.githubusercontent.com/NousResearch/hermes-agent/main/scripts/install.sh | bash
source ~/.bashrc    # 또는 source ~/.zshrc
hermes              # 실행 시작
```

Windows는 WSL2 설치 후 위 명령 실행.

**기본 명령어**:
```
hermes              # CLI 대화 시작
hermes model        # LLM 제공자 및 모델 선택
hermes tools        # 사용 가능한 도구 설정
hermes config set   # 개별 설정값 지정
hermes gateway      # 메시징 게이트웨이 시작 (Telegram, Discord 등)
hermes setup        # 전체 설정 마법사 실행
hermes claw migrate # OpenClaw에서 마이그레이션
hermes update       # 최신 버전으로 업데이트
hermes doctor       # 문제 진단
```

**대화 중 슬래시 명령어**:
```
/new 또는 /reset    # 새 대화 시작
/model [provider:model]  # 모델 변경
/personality [name]      # 퍼소나 설정
/compress, /usage        # 컨텍스트 압축, 사용량 확인
/skills                  # 스킬 목록 보기
```

**개발자 기여 설정**:
```bash
git clone https://github.com/NousResearch/hermes-agent.git
cd hermes-agent
curl -LsSf https://astral.sh/uv/install.sh | sh
uv venv venv --python 3.11
source venv/bin/activate
uv pip install -e ".[all,dev]"
python -m pytest tests/ -q
```

## 마치며

Hermes Agent는 AI 에이전트 패러다임의 전환점이다. 단순히 프롬프트에 응답하는 도구가 아니라, 매 상호작용에서 학습하고, 스킬을 쌓고, 당신의 작업 방식을 이해해나가는 **동반자**에 가깝다.

54,400개의 GitHub 스타와 378명의 기여자가 만들어낸 이 프로젝트는 현재도 급속히 발전 중이다. 2026년 4월만 해도 v0.8.0이 릴리즈됐고, WSL-aware 게이트웨이, MiMo v2 Pro, Camofox 반탐지 브라우저 백엔드, Nix 플레이크 빌드 등 새로운 기능이 계속 추가되고 있다.

$5짜리 VPS 하나로 자신만의 AI 에이전트를 24시간 운영하고, 스마트폰 Telegram 앱에서 클라우드 VM을 제어하는 미래. Hermes가 그 미래를 지금 만들고 있다.
