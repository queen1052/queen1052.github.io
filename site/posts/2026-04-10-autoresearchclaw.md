---
title: "AutoResearchClaw: 아이디어 한 줄이 완성된 학술 논문으로"
date: "2026-04-10"
category: "AI 에이전트"
tags: ["research", "LaTeX", "autonomous", "academic", "Claude"]
excerpt: "aiming-lab의 AutoResearchClaw — 23단계 8페이즈 파이프라인으로 아이디어에서 LaTeX 논문까지 자동 생성. OpenAlex·S2·arXiv 인용 4중 검증."
author: "큐레이터"
readTime: "7분"
image: null
---

## 소개

AutoResearchClaw는 aiming-lab이 공개한 **자율 학술 논문 생성 시스템**입니다. "Chat an Idea. Get a Paper."라는 슬로건처럼, 연구 아이디어를 입력하면 23단계, 8페이즈의 자동화 파이프라인을 거쳐 인용이 검증된 완성된 LaTeX 논문을 생성합니다. 다국어 README를 제공하며 국제 연구 커뮤니티를 대상으로 합니다.

인상적인 점은 **4계층 인용 검증 시스템**입니다. OpenAlex, Semantic Scholar(S2), arXiv, 크로스레퍼런스에서 독립적으로 인용을 검증해 환각(hallucinated citations)을 제거합니다. AI가 존재하지 않는 논문을 인용하는 문제는 학술 AI 도구의 고질적 약점인데, AutoResearchClaw는 이를 4중 교차 검증으로 해결합니다.

하드웨어 인식 실행(Hardware-aware execution)으로 GPU 유무와 가용 메모리에 따라 자동으로 병렬화 수준을 조정합니다. 연구자가 아이디어를 입력하고 자리를 비웠다가 돌아오면 완성된 논문 초안을 받는 경험을 목표로 합니다.

## 주요 기능

- **23단계 파이프라인**: 주제 분석 → 관련 연구 수집 → 갭 분석 → 방법론 설계 → 실험 계획 → 논문 작성 → LaTeX 렌더링까지 23개의 세분화된 단계가 순차적으로 실행됩니다.
- **8페이즈 구조**: 23단계가 8개의 논리적 페이즈로 묶입니다: (1)초기화 (2)문헌 조사 (3)갭 분석 (4)연구 설계 (5)실험 (6)논문 작성 (7)검증 (8)완성
- **4계층 인용 검증**: OpenAlex API → Semantic Scholar API → arXiv API → 크로스레퍼런스 순서로 인용을 검증합니다. 4개 소스 중 하나 이상에서 확인되지 않으면 인용이 제거됩니다.
- **Gate 단계 (Human-in-the-Loop)**: 주요 결정 지점에서 인간의 승인을 요청하거나 건너뛸 수 있습니다. "방법론 선택"이나 "실험 결과 해석"에서 연구자가 직접 검토합니다.
- **하드웨어 인식 실행**: GPU와 CPU 상황에 따라 LLM 추론과 검색을 병렬화합니다. 단일 CPU 환경에서도 순차적으로 전체 파이프라인을 완료합니다.
- **LaTeX 완성 출력**: 최종 출력이 컴파일 가능한 LaTeX 파일입니다. 그림, 표, 알고리즘, 참고문헌이 모두 포함된 학술지 투고 가능한 형식의 논문입니다.

### 23단계 파이프라인 — 연구 과정의 완전한 자동화

```
Phase 1 - 초기화
  Stage 1: 주제 파싱 및 핵심 연구 질문 생성
  Stage 2: 검색 키워드 추출 및 최적화
  Stage 3: 관련 분야 식별

Phase 2 - 문헌 조사
  Stage 4: OpenAlex 1차 검색 (상위 50 논문)
  Stage 5: Semantic Scholar 보완 검색
  Stage 6: arXiv 최신 pre-print 검색
  Stage 7: 논문 필터링 및 관련성 평가

Phase 3 - 갭 분석
  Stage 8: 기존 연구 패턴 분석
  Stage 9: 미개척 영역(연구 갭) 식별
  Stage 10: 연구 기여점 정의

Phase 4 - 연구 설계
  Stage 11: 방법론 선택
  Stage 12: 실험 설계
  [GATE: 연구자 검토 요청 가능]

Phase 5 - 실험
  Stage 13: 실험 실행 또는 시뮬레이션
  Stage 14: 결과 분석 및 해석
  [GATE: 결과 검토 요청 가능]

Phase 6-8 - 논문 작성 및 검증
  Stage 15-19: 섹션별 논문 작성 (Abstract, Intro, Method, Results, Discussion)
  Stage 20-22: 인용 4중 검증, LaTeX 렌더링
  Stage 23: 최종 완성
```

### 인용 4중 검증 — 환각 없는 학술 참고문헌

```python
# 인용 검증 흐름 (의사 코드)
def verify_citation(citation):
    sources = []
    
    # 1. OpenAlex API
    if openalx.search(citation.doi or citation.title):
        sources.append("openalx")
    
    # 2. Semantic Scholar
    if s2.paper_search(citation.title):
        sources.append("semantic_scholar")
    
    # 3. arXiv
    if arxiv.search(citation.arxiv_id or citation.title):
        sources.append("arxiv")
    
    # 4. CrossRef
    if crossref.lookup(citation.doi):
        sources.append("crossref")
    
    # 하나 이상에서 확인되면 통과, 없으면 제거
    return len(sources) >= 1
```

## 기술 스택 / 아키텍처

| 항목 | 내용 |
|------|------|
| 단계 수 | 23단계 |
| 페이즈 | 8개 |
| 인용 검증 | OpenAlex + S2 + arXiv + CrossRef |
| 출력 형식 | LaTeX (.tex, .pdf) |
| 실행 | 하드웨어 인식 병렬화 |
| 라이선스 | MIT |

## 설치 / 사용법

```bash
# 저장소 클론
git clone https://github.com/aiming-lab/AutoResearchClaw
cd AutoResearchClaw

# 의존성 설치
pip install -r requirements.txt

# 환경 변수 설정
cp .env.example .env
# ANTHROPIC_API_KEY, OPENAI_API_KEY 또는 호환 API 키

# 논문 생성 실행
python run_research.py \
  --topic "Transformer 모델에서 Attention Mechanism의 효율화" \
  --output-dir ./papers/attention-optimization

# Gate 없이 완전 자동 실행
python run_research.py \
  --topic "Graph Neural Network의 시계열 예측 적용" \
  --auto-mode \
  --no-gates

# LaTeX 컴파일 (출력 디렉토리에서)
cd papers/attention-optimization
pdflatex main.tex
bibtex main
pdflatex main.tex
```

## 활용 사례 / 사용 시나리오

1. **연구 초안 빠른 작성**: 연구자가 새 아이디어를 탐색할 때, AutoResearchClaw로 기존 문헌을 자동 조사하고 연구 방향의 타당성을 평가하는 초안 논문을 생성합니다. 실제 연구의 방향 설정에 유용합니다.

2. **문헌 조사 및 관련 연구 요약**: `--stop-after-phase 3` 옵션으로 갭 분석 단계까지만 실행해 특정 주제의 관련 연구 요약과 연구 갭 분석만 추출합니다.

3. **논문 재현 및 비교**: 기존 논문을 기반으로 변형된 방법론을 시도하는 비교 연구를 자동화합니다. Gate 단계에서 방법론을 인간이 수정해 창의적인 변형을 추가합니다.

## 결론

AutoResearchClaw는 AI 논문 생성의 가장 큰 약점인 "인용 신뢰성"을 4중 검증으로 직접 해결한 야심찬 시스템입니다. 23단계 파이프라인, Gate 단계, 하드웨어 인식 실행 등 실용적인 요소들이 잘 설계되어 있습니다. 연구자의 작업을 완전히 대체하기보다 초안 작성과 문헌 조사를 자동화해 고부가가치 연구 활동에 집중할 수 있게 돕는 도구입니다.

---

> 원문: https://github.com/aiming-lab/AutoResearchClaw
