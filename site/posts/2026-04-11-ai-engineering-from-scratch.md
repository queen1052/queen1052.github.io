---
title: "AI Engineering from Scratch: 처음부터 배우는 AI 엔지니어링 260+ 레슨"
date: "2026-04-11"
category: "학습 자료"
tags: ["AI 교육", "머신러닝", "딥러닝", "LLM", "에이전트", "Python", "TypeScript"]
excerpt: "선형대수부터 자율 에이전트 스웜까지. 260개 이상의 레슨, 20개 단계, 약 290시간 분량의 AI 엔지니어링 완전 정복 커리큘럼."
author: "큐레이터"
readTime: "7분"
image: null
---

## 소개

"AI를 배웠다"는 것과 "AI로 실제 도구를 만들 수 있다"는 것은 다릅니다. **AI Engineering from Scratch**는 후자를 목표로 합니다. GitHub Stars 2,300개를 달성한 이 오픈 소스 커리큘럼은 선형대수부터 자율 에이전트 스웜까지, AI 엔지니어링의 전 범위를 260개 이상의 레슨과 20개 단계로 구성했습니다.

Python, TypeScript, Rust, Julia를 모두 다루며, 각 레슨은 "프로토타입 하나를 만들고 끝"이 아니라 실제로 설치하고 사용할 수 있는 프롬프트, 스킬, 에이전트, MCP 서버를 산출물로 남깁니다. MIT 라이선스로 공개되어 있어 개인·팀·교육 기관 모두 자유롭게 활용할 수 있습니다.

---

## 주요 기능

| 특징 | 설명 |
|------|------|
| 260+ 레슨 | 20개 단계, 약 290시간 분량 |
| 다중 언어 | Python, TypeScript, Rust, Julia |
| AI 네이티브 학습 | Claude Code 스킬로 자가 퀴즈·수준 진단 |
| 실용적 산출물 | 프롬프트, 스킬, 에이전트, MCP 서버 생성 |
| 온/오프라인 웹앱 | [aiengineeringfromscratch.com](https://aiengineeringfromscratch.com/) |
| 277개 용어 사전 | 검색 가능한 AI 용어 사전 |

기존 AI 강좌와의 차별점이 명확합니다: 다른 강좌가 NLP 또는 Vision 중 하나만 다루는 동안, 이 커리큘럼은 수학, ML, DL, NLP, 비전, 음성, 트랜스포머, LLM, 에이전트, 스웜을 모두 포함합니다.

---

## 핵심 기능 1: AI 네이티브 학습 방식

이 커리큘럼의 가장 독특한 점은 AI와 함께 배운다는 것입니다.

내장된 Claude Code 스킬:

| 스킬 | 설명 |
|------|------|
| `/find-your-level` | 10개 문항으로 현재 수준 진단 → 개인화 학습 경로 생성 |
| `/check-understanding <phase>` | 단계별 8문항 퀴즈 + 복습 레슨 추천 |

레슨 구조 (6단계):

| 단계 | 설명 |
|------|------|
| Motto | 핵심 아이디어 한 줄 요약 |
| Problem | "이걸 모르면 어떤 상황에서 손해를 보는가" |
| Concept | Mermaid 다이어그램과 직관적 설명 |
| Build It | 순수 Python으로 처음부터 구현 (프레임워크 없음) |
| Use It | PyTorch, sklearn 등 실제 도구로 동일 작업 |
| Ship It | 이 레슨이 생산하는 프롬프트/스킬/에이전트 |

"Build It → Use It" 분리 구조가 핵심입니다. 프레임워크를 먼저 쓰기 전에 직접 구현해 보면 프레임워크가 내부적으로 무엇을 하는지 이해할 수 있습니다.

---

## 핵심 기능 2: 20단계 완전 커리큘럼

```
Phase  0: Setup & Tooling          (12 레슨) — Python, Node, Rust, Docker
Phase  1: Math Foundations         (22 레슨) — 선형대수, 미적분, 확률
Phase  2: ML Fundamentals          (18 레슨) — 분류, 회귀, 클러스터링
Phase  3: Deep Learning Core       (13 레슨) — 신경망 처음부터 구현
Phase  4: Computer Vision          (16 레슨) — 이미지/비디오/3D
Phase  5: NLP: Foundations→Advanced(18 레슨) — 토크나이징에서 파인튜닝까지
Phase  6: Speech & Audio           (12 레슨) — STT, TTS, 오디오 처리
Phase  7: Transformers Deep Dive   (14 레슨) — 어텐션 메커니즘 완전 분해
Phase  8: Generative AI            (14 레슨) — 이미지/비디오/오디오/3D 생성
Phase  9: Reinforcement Learning   (12 레슨) — RLHF와 게임 AI의 기초
Phase 10: LLMs from Scratch        ...
Phase 14: Agent Engineering        (에이전트 전문가 경로, ~60시간)
...
Phase 19: (고급 스웜 및 멀티에이전트 시스템)
```

이미 ML/DL을 아는 분은 Phase 10(LLM)이나 14(에이전트)에서 시작해 60~100시간으로 목표를 좁힐 수 있습니다.

---

## 기술 스택 및 아키텍처

```
phases/XX-phase-name/NN-lesson-name/
├── code/           실행 가능한 구현 (Python, TS, Rust, Julia)
├── docs/
│   └── en.md       레슨 문서
└── outputs/        이 레슨이 생산하는 산출물

outputs/
├── prompts/          모든 AI 작업용 프롬프트 템플릿
├── skills/           AI 코딩 에이전트용 SKILL.md
├── agents/           배포 가능한 에이전트 정의
└── mcp-servers/      과정 중 직접 구축한 MCP 서버
```

- **언어**: Python 76.8%, HTML 10.7%, JavaScript 6.4%, TypeScript 1.9%, Julia 1.7%
- **라이선스**: MIT
- **웹**: [aiengineeringfromscratch.com](https://aiengineeringfromscratch.com/)
- **용어 사전**: 277개 검색 가능 용어

산출물은 [SkillKit](https://github.com/rohitg00/skillkit)으로 설치해 Claude Code, Cursor, 기타 AI 에이전트에 즉시 플러그인할 수 있습니다.

---

## 설치 및 사용법

### 저장소 클론 및 실행

```bash
git clone https://github.com/rohitg00/ai-engineering-from-scratch.git
cd ai-engineering-from-scratch

# Phase 1 첫 레슨 바로 실행
python phases/01-math-foundations/01-linear-algebra-intuition/code/vectors.py
```

### 수준 진단 (추천)

```bash
# Claude Code 내에서
/find-your-level
# → 10개 문항 후 시작 단계와 시간 예상치 제공

/check-understanding 3
# → Phase 3 이해도 확인 + 복습 레슨 추천
```

### 시작 경로 가이드

| 배경 | 시작 단계 | 예상 시간 |
|------|----------|----------|
| 프로그래밍 신규 | Phase 0 | ~290시간 |
| Python 기초 | Phase 1 | ~270시간 |
| ML 알고 DL 미경험 | Phase 3 | ~200시간 |
| DL 알고 LLM 원함 | Phase 10 | ~100시간 |
| 에이전트만 원함 | Phase 14 | ~60시간 |

---

## 마치며

AI Engineering from Scratch는 "AI를 사용하는 법"이 아니라 "AI를 이해하고 만드는 법"을 가르칩니다. 각 레슨이 실용적인 도구를 산출물로 남기기 때문에, 과정을 마치면 수료증이 아니라 실제로 동작하는 프롬프트·스킬·에이전트·MCP 서버 모음을 손에 쥐게 됩니다.

84%의 학생이 이미 AI 도구를 쓰고 있지만 18%만이 전문적으로 활용할 준비가 됐다고 느낀다는 통계에 공감한다면, 이 커리큘럼이 그 격차를 메울 수 있을 것입니다.

- GitHub: [rohitg00/ai-engineering-from-scratch](https://github.com/rohitg00/ai-engineering-from-scratch)
- 라이선스: MIT
- Stars: 2.3k+
