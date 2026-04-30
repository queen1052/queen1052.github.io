---
title: "Workshop Agentic Search: 컨텍스트 엔지니어링을 위한 에이전틱 검색 실습"
date: "2026-04-11"
category: "AI 학습"
tags: ["에이전틱 검색", "컨텍스트 엔지니어링", "LangChain"]
excerpt: "Leonie Monigatti의 에이전틱 검색 실습 워크숍. Elasticsearch, 쉘 도구, DB 쿼리 도구로 각기 다른 컨텍스트 소스를 탐색하는 3가지 검색 패턴을 직접 경험한다."
author: "큐레이터"
readTime: "6분"
image: null
---

## 소개: 에이전틱 검색이 왜 컨텍스트 엔지니어링의 핵심인가

대규모 언어 모델에게 좋은 답을 얻으려면 좋은 컨텍스트가 필요하다. 그런데 실제 작업에서 필요한 정보는 여러 곳에 흩어져 있다. 데이터베이스에도 있고, 파일 시스템에도 있고, 벡터 저장소에도 있다. AI 에이전트가 이 다양한 소스에서 적절한 컨텍스트를 자동으로 검색할 수 있다면?

**Workshop: Agentic Search for Context Engineering**은 Weaviate Developer Relations Engineer Leonie Monigatti가 제작한 실습형 워크숍이다. GitHub 스타 113개, Jupyter Notebook 100%, Apache-2.0 라이선스. AI Engineer Europe Conference 일정 데이터를 실제 예시로 사용해 3가지 에이전틱 검색 패턴을 단계별로 실습한다.

## 주요 기능

**3가지 검색 패턴 비교 학습**:
1. **바닐라 에이전틱 검색**: Elasticsearch의 시맨틱 검색 도구를 에이전트에 연결
2. **DB 쿼리 도구 추가**: ESQL 쿼리 실행 도구 + 에이전트 스킬
3. **쉘 도구 사용**: 로컬 파일 시스템을 jina-grep-cli와 쉘 도구로 탐색

**실제 데이터 사용**: AI Engineer Europe Conference 세션 스케줄(`session.json`)을 데이터로 사용해 현실적인 시나리오를 다룬다.

**도구 트레이드오프 이해**: 각 검색 방법이 왜 다른지, 어떤 상황에 어떤 도구가 적합한지에 대한 직관을 키운다.

**에이전트 스킬 확장**: DB 쿼리 도구에 에이전트 스킬을 추가해 능력을 확장하는 패턴을 배운다.

## 3가지 에이전틱 검색 패턴

### 노트북 1: 바닐라 에이전틱 검색

가장 기본적인 패턴. Elasticsearch 클러스터를 시맨틱 검색 도구로 에이전트에 연결한다. 에이전트는 사용자 질문을 받아 자동으로 Elasticsearch에 시맨틱 쿼리를 실행하고 결과를 반환한다.

이를 통해 배우는 것:
- LangChain으로 Elasticsearch를 도구로 감싸는 방법
- 에이전트가 도구 호출을 결정하는 방식
- 시맨틱 검색의 한계(구조화된 쿼리 불가)

### 노트북 2: DB 쿼리 도구 추가

시맨틱 검색만으로는 "4월 12일 오후 세션 목록"처럼 구조화된 질문에 답하기 어렵다. 이 노트북에서는 Elasticsearch Query Language(ESQL) 실행 도구를 추가한다.

에이전트가 이제 두 가지 도구를 갖는다:
- **시맨틱 검색 도구**: 의미 기반 검색
- **ESQL 쿼리 도구**: 날짜, 필터, 집계 등 구조화된 쿼리

**에이전트 스킬 추가**: Elastic의 공개 agent-skills를 활용해 ESQL 생성 능력을 도구에 주입한다. 에이전트가 자연어를 적절한 ESQL로 변환하는 능력이 향상된다.

### 노트북 3: 쉘 도구

컨텍스트 소스가 데이터베이스가 아니라 로컬 파일 시스템이라면? 쉘 도구를 에이전트에게 주면 `grep`, `find`, `cat` 등의 명령으로 파일 시스템을 탐색할 수 있다.

**jina-grep-cli 통합**: Jina AI의 `jina-grep-cli` 도구는 일반 grep보다 시맨틱하게 파일을 검색할 수 있다. 고전적 키워드 매칭이 아니라 의미 기반으로 파일 내용을 검색한다.

이 노트북에서 배우는 트레이드오프:
- 쉘 도구는 강력하지만 "은탄환이 아니다" (Elastic 블로그에 관련 포스트)
- 파일 시스템 검색의 접근용이성 대비 정확성

## 기술 스택과 아키텍처

- **언어**: Jupyter Notebook 100% (Python 커널)
- **핵심 라이브러리**: LangChain v1.2.12, langchain-openai v1.1.11
- **벡터/검색 저장소**: Elasticsearch(로컬 Docker)
- **LLM**: LiteLLM을 통한 OpenAI 모델 (호환되는 다른 도구 사용LLM 사용 가능)
- **검색 CLI**: jina-grep-cli
- **라이선스**: Apache-2.0

## 설치와 사용법

### 환경 설정

```bash
# 가상 환경 생성
python3 -m venv .venv
source .venv/bin/activate

# 의존성 설치
pip install -r requirements.txt
```

### Elasticsearch 로컬 실행 (Docker)

```bash
# Elastic 공식 one-liner
curl -fsSL https://elastic.co/start-local | sh

# 서비스 시작
cd elastic-start-local
./start.sh
```

예상 출력:
```
✔ Container es-local-dev    Healthy
✔ Container kibana-local-dev    Healthy
```

### 환경 변수 설정

`.env.example`을 참고해 `.env` 파일 생성:
```
# LLM API 키 (LiteLLM 통해 OpenAI 또는 호환 LLM)
OPENAI_API_KEY=...

# Jina API 키 (무료, 등록 없이 획득 가능)
JINA_API_KEY=...

# Elasticsearch 자격증명
ELASTICSEARCH_URL=http://localhost:9200
ELASTICSEARCH_USERNAME=elastic
ELASTICSEARCH_PASSWORD=...
```

### 데이터 준비

```bash
# 데이터 준비 노트북 실행
jupyter notebook notebooks/00_prepare_data.ipynb
```

AI Engineer Europe Conference 세션 데이터를 Elasticsearch에 인덱싱하고 로컬 파일 시스템에 저장한다.

### 워크숍 진행

```
01_vanilla_agentic_search.ipynb     # 기본 에이전틱 검색
02_advanced_agentic_search.ipynb    # ESQL 도구 + 에이전트 스킬
03_agentic_search_with_bash_tool.ipynb  # 쉘 도구
```

## 추가 학습 자료

워크숍 제작자가 작성한 관련 블로그 포스트들:
- [쉘 도구는 컨텍스트 엔지니어링의 은탄환이 아니다](https://www.elastic.co/search-labs/blog/search-tools-context-engineering)
- [컨텍스트 엔지니어링을 위한 효과적인 DB 검색 도구 구축](https://www.elastic.co/search-labs/blog/database-retrieval-tools-context-engineering)
- [Elasticsearch Quickstart (Python)](https://www.elastic.co/docs/reference/elasticsearch/clients/python/getting-started)

## 마치며

에이전틱 검색은 단순히 "AI가 검색한다"가 아니다. 어떤 소스에서, 어떤 도구로, 어떤 전략으로 컨텍스트를 가져올지 설계하는 것이다. 시맨틱 검색, 구조화 쿼리, 파일 시스템 탐색 — 세 가지 방법 모두 장단점이 있고, 실제 시스템에서는 조합해 사용하게 된다.

이 워크숍은 그 결정을 내릴 때 필요한 직관을 단 세 개의 Jupyter 노트북으로 압축해서 제공한다. Weaviate에서 개발자 리소스를 책임지는 Leonie Monigatti의 교육 콘텐츠 제작 능력이 돋보이는 실용적인 자료다.

컨텍스트 엔지니어링과 에이전틱 검색을 직접 손으로 배우고 싶다면, 이 워크숍이 최선의 출발점이다.
