---
title: "Hyper-Extract: 명령 한 줄로 비정형 텍스트를 지식 그래프로 변환하는 LLM 추출 프레임워크"
date: "2026-04-11"
category: "AI 도구"
tags: ["지식그래프", "LLM", "정보추출"]
excerpt: "AI를 이용해 비정형 문서를 지식 그래프, 하이퍼그래프, 시공간 그래프로 변환하는 Python CLI 프레임워크로, 80개 이상의 도메인 템플릿을 제공합니다."
author: "큐레이터"
readTime: "7분"
image: null
---

## Hyper-Extract란?

**Hyper-Extract**는 LLM(대형 언어 모델)을 활용해 비정형 텍스트를 지속 가능하고 예측 가능한 구조화된 지식으로 변환하는 지능형 지식 추출 프레임워크입니다. "Stop reading. Start understanding."이라는 슬로건처럼, 문서를 직접 읽는 수고를 AI가 대신 처리합니다.

Python 100%로 구현되었으며 Apache-2.0 라이선스로 공개되었습니다. PyPI 패키지(`hyperextract`)로 `uv tool install hyperextract` 한 줄로 설치하면 `he` 커맨드가 설치됩니다.

단순한 리스트와 Pydantic 모델부터 복잡한 지식 그래프, 하이퍼그래프, 시공간 그래프까지 8가지 자동 타입을 지원하여 기존 GraphRAG, LightRAG보다 훨씬 풍부한 구조화 능력을 제공합니다.

## 주요 기능

Hyper-Extract의 핵심 기능들을 살펴보겠습니다.

**8가지 Auto-Types**: `AutoModel`, `AutoList`, `AutoSet`, `AutoGraph`, `AutoHypergraph`, `AutoTemporalGraph`, `AutoSpatialGraph`, `AutoSpatioTemporalGraph`의 8가지 강타입 구조를 지원합니다.

**10개 이상의 추출 엔진**: GraphRAG, LightRAG, Hyper-RAG, KG-Gen, iText2KG 등 최첨단 검색·추출 패러다임을 즉시 사용할 수 있습니다.

**80개 이상의 YAML 템플릿**: 6개 도메인(금융, 법률, 의학, 한의학, 산업, 일반)에 걸쳐 80개 이상의 사전 구성 템플릿을 제공합니다. 코드 없이 YAML만으로 추출을 정의합니다.

**증분 진화(Incremental Evolution)**: 새 문서를 on-the-fly로 공급하여 지속적으로 지식을 확장·갱신할 수 있습니다.

**시각화**: 추출된 지식 그래프를 `he show` 명령으로 즉시 시각화할 수 있습니다.

## 8가지 Auto-Types 심층 분석

Hyper-Extract를 차별화하는 핵심은 다른 라이브러리가 지원하지 못하는 고급 구조입니다.

| 타입 | 설명 | 다른 라이브러리 지원 |
|------|------|---------------------|
| AutoModel | Pydantic 기반 구조화 출력 | 일부 지원 |
| AutoList/AutoSet | 항목 모음 추출 | 일부 지원 |
| AutoGraph | 지식 그래프 | GraphRAG·LightRAG 지원 |
| AutoTemporalGraph | 시간적 지식 그래프 | 일부 지원 |
| **AutoSpatialGraph** | **공간 지식 그래프** | **Hyper-Extract만** |
| **AutoHypergraph** | **하이퍼그래프** | **Hyper-Extract만** |
| **AutoSpatioTemporalGraph** | **시공간 그래프** | **Hyper-Extract만** |

하이퍼그래프는 일반 그래프와 달리 하나의 하이퍼엣지가 두 개 이상의 노드를 연결할 수 있어 복잡한 다자간 관계를 표현합니다. 예를 들어 "A, B, C가 함께 계약을 체결했다"는 관계는 일반 그래프로 표현하기 어렵지만 하이퍼그래프로는 자연스럽게 표현됩니다.

## 3계층 아키텍처

Hyper-Extract는 명확한 3계층 아키텍처를 따릅니다.

**Auto-Types 계층**: 지식 추출의 출력 형식을 정의합니다. 8가지 강타입 구조.

**Methods 계층**: Auto-Types 위에 구축된 추출 알고리즘입니다. 전통적 방법(KG-Gen, iText2KG)과 RAG 기반 방법(GraphRAG, LightRAG, Hyper-RAG, HypergraphRAG, Cog-RAG)을 포함합니다.

**Templates 계층**: 즉시 사용 가능한 도메인별 설정을 제공합니다. 6개 도메인의 80+ 사전 템플릿으로 Auto-Types나 Methods를 직접 다루지 않고 추출 가능합니다.

CLI(`he parse`, `he search`, `he show`) 또는 Python API(`Template.create()`)로 접근할 수 있습니다.

## 설치 및 사용법

**CLI 설치**:
```bash
uv tool install hyperextract
```

**API 키 설정 및 지식 추출**:
```bash
# OpenAI API 키 설정 (기본: gpt-4o-mini + text-embedding-3-small)
he config init -k YOUR_OPENAI_API_KEY

# 문서에서 지식 추출 (전기 그래프 템플릿)
he parse examples/en/tesla.md -t general/biography_graph -o ./output/ -l en

# 지식 추상 쿼리
he search ./output/ "What are Tesla's major achievements?"

# 지식 그래프 시각화
he show ./output/

# 증분 지식 추가
he feed ./output/ examples/en/tesla_question.md
```

**Python API**:
```python
from hyperextract import Template

# 템플릿 로드 및 문서 파싱
template = Template.create("general/biography_graph")
ka = template.parse("examples/en/tesla.md", lang="en")

# 쿼리
results = ka.search("Tesla's inventions")
print(results)

# 시각화
ka.show()
```

**커스텀 YAML 템플릿**:
```yaml
name: "company_analysis"
type: "AutoGraph"
nodes:
  - type: "Company"
    properties: ["name", "founded", "revenue"]
  - type: "Person" 
    properties: ["name", "role"]
edges:
  - type: "FOUNDED_BY"
    source: "Company"
    target: "Person"
```

## 마치며

Hyper-Extract는 "정보 과부하" 시대에 문서를 읽고 이해하는 작업을 근본적으로 재정의합니다. 논문 100편, 계약서 500개, 의료 기록 1,000건을 직접 읽는 대신, `he parse` 명령 몇 번으로 구조화된 지식 그래프로 변환하고 자연어로 쿼리할 수 있습니다. 특히 하이퍼그래프와 시공간 그래프라는 독자적인 구조는 복잡한 금융·법률·의학 도메인에서 다른 어떤 도구도 포착하지 못하는 관계를 표현할 수 있습니다.
