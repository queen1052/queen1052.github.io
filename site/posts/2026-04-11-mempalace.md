---
title: "MemPalace: 역대 최고 점수 AI 메모리 시스템, 그리고 무료"
date: "2026-04-11"
category: "AI 도구"
tags: ["AI 메모리", "LLM", "MCP"]
excerpt: "LongMemEval 96.6% R@5. 외부 API 없이 완전 로컬, 무료로 AI의 영구 메모리를 구현한다. 팰리스 아키텍처와 AAAK 언어로 수백만 토큰의 대화 기록을 170토큰으로 압축한다."
author: "큐레이터"
readTime: "9분"
image: null
---

## 소개: AI는 왜 어제 한 대화를 기억하지 못할까

6개월간 Claude, ChatGPT, Copilot과 매일 작업하면 어떤 일이 벌어질까? 누가 어떤 아키텍처 결정을 내렸는지, 왜 특정 라이브러리를 선택했는지, 어떤 버그를 디버깅했는지. 이 모든 기록이 채팅 창에 갇혀 있다가, 세션이 끝나면 사라진다.

계산해보면 하루 AI 사용량은 약 650만 토큰에 달한다. 6개월이면 1,950만 토큰. 그 어떤 컨텍스트 창도 수용할 수 없는 양이다.

**MemPalace**는 이 문제를 해결하기 위해 만들어진 오픈소스 AI 메모리 시스템이다. GitHub 스타 40,600개, MIT 라이선스, Python 99% 순수 구현. 가장 주목할 수치는 **LongMemEval 96.6% R@5** — 현재까지 알려진 것 중 가장 높은 점수다. 외부 API 없이, 무료로, 완전히 내 컴퓨터에서 실행된다.

## 주요 기능

**팰리스 아키텍처**: 기억의 궁전(Memory Palace) 은유를 실제 코드로 구현했다. 모든 프로젝트, 사람, 주제가 "날개(wing)"를 갖고, 각 날개에는 "방(room)"이 있으며, 방 안에 "옷장(closet)"과 "서랍(drawer)"이 있다. 이 계층 구조가 효율적인 검색과 조직화를 가능하게 한다.

**4레이어 메모리 스택**: L0(정체성, ~50 토큰)부터 L3(딥 시맨틱 검색)까지 4단계로 구성된다. AI는 웨이크업 시 L0+L1(~170 토큰)만 로드하므로 매우 저렴하게 작동하고, 필요할 때만 L2, L3을 호출한다.

**AAAK Dialect**: AI 에이전트가 학습하는 전용 압축 언어. 영어와 본질적으로 같지만 반복 엔티티에 대해 큰 규모에서 압축 효율을 발휘한다.

**지식 그래프**: 시간 필터링이 가능한 엔티티-관계 그래프. "1월에 누가 Clerk를 추천했지?" "지난 스프린트에 Soren이 뭘 했지?" 같은 질문에 타임라인 기반 답변을 제공한다.

**19개 MCP 도구**: Claude Code, ChatGPT, Cursor, Gemini CLI 모두에 연결 가능. `mempalace_search`, `mempalace_add_drawer`, `mempalace_kg_timeline` 등 19개의 표준화된 도구를 제공한다.

## 팰리스 구조 심층 분석

MemPalace의 핵심인 팰리스 아키텍처를 이해하면 왜 이 시스템이 효과적인지 알 수 있다.

```
Wing: person/project/topic
└── Room A: 관련 주제 (예: auth-migration)
    └── Closet → Drawer (실제 내용)
└── Room B: 다른 주제
    └── Closet → Drawer

[터널(tunnel)로 날개 간 연결]
```

같은 "auth-migration" 주제가 Kai(사람), Driftwood(프로젝트), Priya(사람) 세 날개에 동시에 존재할 수 있다. 터널이 이들을 연결한다. 결과:

```
mempalace search "Clerk 결정" --wing driftwood
→ "Kai가 Auth0보다 Clerk를 추천 — 가격+개발자 경험.
   팀 동의 2026-01-15. Maya가 마이그레이션 담당."
```

### 3가지 마이닝 모드

- **projects**: 코드, 문서, 노트 파일 처리
- **convos**: Claude, ChatGPT, Slack 익스포트 등 대화 파일 처리
- **general**: 결정, 마일스톤, 문제, 감정적 맥락으로 자동 분류

### 토큰 비용 비교

| 방법 | 토큰 수 | 연간 비용 |
|------|---------|---------|
| 전체 붙여넣기 | 19.5M (불가능) | — |
| LLM 요약 | ~650K | ~$507/년 |
| MemPalace 웨이크업 | ~170 토큰 | ~$0.70/년 |
| MemPalace + 5회 검색 | ~13,500 토큰 | ~$10/년 |

## 실전 사용 시나리오

### Claude Code용 (권장)

네이티브 마켓플레이스 설치:
```bash
claude plugin marketplace add milla-jovovich/mempalace
claude plugin install --scope user mempalace
# 재시작 후 /skills에서 "mempalace" 확인
```

이후 AI가 자동으로 `mempalace_search`를 호출한다. "지난달에 인증에 대해 뭐라고 했지?"라고 물으면 Claude가 알아서 검색하고 답해준다.

### MCP 호환 도구용 (ChatGPT, Cursor, Gemini)

```bash
# 한 번만 연결
claude mcp add mempalace -- python -m mempalace.mcp_server
```

이제 AI에게 19개 도구가 사용 가능해진다.

### 로컬 모델용

```bash
# 컨텍스트 파일로 직접 주입
mempalace wake-up > context.txt
# context.txt를 로컬 모델 시스템 프롬프트에 붙여넣기
```

## 기술 스택과 아키텍처

- **언어**: Python 99.0%, Shell 1.0%
- **벡터 저장소**: ChromaDB (>=0.4.0)
- **그래프 저장소**: SQLite (지식 그래프)
- **핵심 모듈**: `miner.py`, `convo_miner.py`, `searcher.py`, `dialect.py`, `knowledge_graph.py`, `palace_graph.py`, `layers.py`, `onboarding.py`
- **자동저장 훅**: `mempal_save_hook.sh` (N개 메시지마다 자동 저장), `mempal_precompact_hook.sh` (긴급 저장)
- **요구사항**: Python 3.9+, chromadb, pyyaml. 인터넷 불필요

벤치마크는 `benchmarks/` 폴더에서 독립 재현 가능하다. M2 Ultra에서 500개 질문을 5분 이내에 완료한다고 커뮤니티가 독립 검증했다.

## 설치와 사용법

```bash
# 설치
pip install mempalace

# 세계(world) 초기화 — 함께 일하는 사람, 프로젝트 설정
mempalace init ~/projects/myapp

# 데이터 마이닝
mempalace mine ~/projects/myapp                    # 코드/문서/노트
mempalace mine ~/chats/ --mode convos              # AI 대화 익스포트
mempalace mine ~/chats/ --mode convos --extract general  # 결정/마일스톤/문제 분류

# 검색
mempalace search "왜 GraphQL로 전환했지"
mempalace search "Clerk 결정" --wing driftwood
mempalace search "인증" --room auth-migration

# 메모리 스택
mempalace wake-up       # L0+L1 컨텍스트 로드
mempalace status        # 팰리스 현황

# MCP 서버
mempalace mcp           # MCP 설정 명령 표시
```

팰리스 설정 파일(`~/.mempalace/config.json`)에서 경로, 컬렉션명, 사람 맵을 설정할 수 있다.

## 마치며

MemPalace는 AI 메모리 문제에 대한 진지한 해결책이다. 40,600개의 GitHub 스타는 이 문제가 얼마나 고통스러운지를 방증한다.

v3.1.0까지 빠르게 발전하며 CLI, MCP 서버, 자동화 훅, 지식 그래프, 벤치마크 재현 가이드까지 갖춘 완성도 높은 시스템이 됐다. 커뮤니티가 초기 README의 실수(AAAK 토큰 계산 오류, "30x 무손실 압축" 과장)를 지적하자 그날 바로 수정하고 투명하게 해명한 개발팀의 자세도 신뢰할 수 있다.

솔로 개발자, 팀 리드, AI 에이전트 파이프라인 구축자 모두에게. AI가 6개월치 대화를 기억하는 것과 기억하지 못하는 것의 차이를 경험해보라.
