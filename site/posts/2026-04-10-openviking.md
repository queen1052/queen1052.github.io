---
title: "OpenViking: 다중 레이어 컨텍스트 관리 AI 에이전트 프레임워크"
date: "2026-04-10"
category: "AI 에이전트"
tags: ["Python", "Rust", "agent", "context", "framework"]
excerpt: "Volcengine이 공개한 OpenViking — L0/L1/L2 3단계 컨텍스트 아키텍처로 에이전트의 장기 기억과 단기 추론을 효율적으로 관리하는 프레임워크."
author: "큐레이터"
readTime: "5분"
image: null
---

## 소개

OpenViking은 Volcengine(ByteDance의 클라우드 플랫폼)이 공개한 **AI 에이전트 프레임워크**입니다. Python 83.4%, Rust 6.1%, C++ 5.1%로 구현되어 있으며, 핵심 혁신은 **3단계 Tiered Context Loading(계층화된 컨텍스트 로딩)** 아키텍처입니다. AGPL-3.0 라이선스로 공개되었습니다.

기존 에이전트 프레임워크의 주요 문제는 컨텍스트 관리입니다. 관련 없는 정보가 컨텍스트 윈도우를 가득 채우거나, 중요한 장기 기억이 유실됩니다. OpenViking은 이를 L0(즉각 컨텍스트), L1(세션 컨텍스트), L2(영구 지식 베이스)의 분리된 레이어로 해결합니다. 각 레이어는 서로 다른 저장소와 검색 메커니즘을 사용해 성능과 비용을 최적화합니다.

VikingBot은 OpenViking 위에 구축된 대화형 에이전트로, 이 3단계 컨텍스트 시스템의 실제 구현을 보여줍니다.

## 주요 기능

- **L0 — 즉각 컨텍스트**: 현재 대화 턴의 컨텍스트입니다. 빠른 임시 메모리로, 현재 질문 답변에 직접 관련된 정보를 담습니다.
- **L1 — 세션 컨텍스트**: 현재 세션 전체의 대화 이력, 에이전트 행동, 중간 결과물을 저장합니다. 세션 종료 시 L2로 압축·저장됩니다.
- **L2 — 영구 지식 베이스**: 사용자별, 에이전트별 장기 기억입니다. 벡터 데이터베이스에 저장되어 시맨틱 검색으로 관련 기억을 빠르게 조회합니다.
- **컨텍스트 자동 스케줄링**: 에이전트가 추론할 때 현재 태스크와 관련된 L0/L1/L2 컨텍스트를 자동으로 선택·혼합해 LLM에 주입합니다.
- **Rust/C++ 성능 최적화**: 핵심 컨텍스트 검색과 처리 로직이 Rust와 C++로 구현되어 Python 기반 프레임워크 대비 빠른 처리 속도를 제공합니다.
- **VikingBot 참조 구현**: OpenViking API를 사용한 완전한 대화형 에이전트 구현체로 프레임워크를 어떻게 활용하는지 보여줍니다.

### Tiered Context Loading — 에이전트 기억의 계층화

```
L2 장기 기억 (영구 벡터 DB)
  ↑ 세션 종료 시 압축·저장
L1 세션 컨텍스트 (현재 세션 전체)  
  ↑ 현재 턴에 필요한 정보 선택
L0 즉각 컨텍스트 (현재 턴)
  ↓ LLM에 주입
```

에이전트가 새 질문을 받으면, 스케줄러가 L0 → L1 → L2 순서로 관련 컨텍스트를 수집하고 LLM 컨텍스트 윈도우에 넣을 최적의 조합을 결정합니다. "무엇을 기억해야 하는가"를 자동화합니다.

### Rust 코어 — 고성능 컨텍스트 처리

OpenViking의 컨텍스트 검색 엔진은 Rust로 구현됩니다. 특히 L1/L2 컨텍스트에서 현재 태스크와 관련된 청크(chunk)를 찾는 작업은 많은 연산을 요구합니다. Rust의 zero-cost abstractions와 메모리 안전성 덕분에 CPython의 GIL(전역 잠금) 없이 멀티스레드 고성능 처리를 실현합니다.

## 기술 스택 / 아키텍처

| 항목 | 내용 |
|------|------|
| 언어 | Python 83.4%, Rust 6.1%, C++ 5.1% |
| 컨텍스트 레이어 | L0 (즉각), L1 (세션), L2 (장기) |
| 벡터 DB | L2 저장소 |
| 참조 구현 | VikingBot |
| 개발사 | Volcengine (ByteDance) |
| 라이선스 | AGPL-3.0 |

## 설치 / 사용법

```bash
# 저장소 클론
git clone https://github.com/volcengine/OpenViking
cd OpenViking

# Python 환경 설정
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Rust 확장 빌드 (선택)
pip install maturin
maturin develop

# 설정 파일 초기화
cp config.example.yaml config.yaml
# LLM API 키, 벡터 DB 연결 등 설정

# VikingBot 실행
python -m openviking.vikingbot

# 프레임워크 API 사용
from openviking import AgentContext, TieredContextManager
ctx = TieredContextManager(config="config.yaml")
agent = AgentContext(context_manager=ctx, llm="gpt-4o")
response = agent.run("이전 대화에서 내가 언급한 프로젝트 이름이 뭐야?")
```

## 활용 사례 / 사용 시나리오

1. **장기간 실행 개인 어시스턴트**: L2 장기 기억 덕분에 에이전트가 수개월 전 대화 내용도 기억합니다. 사용자의 선호도, 프로젝트 컨텍스트, 중요한 결정을 장기 기억에 저장해 개인화된 어시스턴트를 구축합니다.

2. **기업 지식 관리 에이전트**: 회사 문서, 회의 기록, 의사결정 이력을 L2에 저장하고 L1으로 관련 세션을 추적합니다. 새 직원이나 분기 리뷰에서 에이전트가 조직 기억을 제공합니다.

3. **연구 보조 에이전트**: 연구자가 논문 탐색, 메모, 아이디어를 L1/L2에 축적합니다. 수개월 후에도 "이전에 X에 대한 어떤 논문을 찾았지?"를 자동으로 회상합니다.

## 결론

OpenViking의 3단계 Tiered Context Loading은 에이전트의 기억 문제를 체계적으로 해결하는 우아한 아키텍처입니다. Volcengine의 대규모 서비스 운영 경험이 프레임워크 설계에 녹아 있습니다. Rust/C++ 성능 최적화와 Python 사용 편의성의 균형도 잘 잡혀 있습니다. 장기간 실행되는 컨텍스트 리치 에이전트를 구축하려는 개발자에게 강력한 기반을 제공합니다.

---

> 원문: https://github.com/volcengine/OpenViking
