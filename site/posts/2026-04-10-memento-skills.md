---
title: "Memento-Skills: 에이전트가 에이전트를 설계하는 자기 진화 스킬"
date: "2026-04-10"
category: "AI 에이전트"
tags: ["self-evolving", "skills", "Python", "benchmark", "GAIA"]
excerpt: "Memento-Teams의 Memento-Skills — 'Let Agents Design Agents'. HLE·GAIA 벤치마크 검증, 10개 내장 스킬로 자율 에이전트가 스스로 새 스킬을 생성하고 진화."
author: "큐레이터"
readTime: "6분"
image: null
---

## 소개

Memento-Skills는 Memento-Teams가 공개한 **자기 진화 에이전트 스킬 라이브러리 시스템**입니다. 핵심 슬로건은 "Let Agents Design Agents" — 에이전트가 스스로 새로운 스킬을 설계하고 라이브러리에 추가합니다. 이 접근법은 arXiv 논문(2603.18743)으로 발표되었으며, HLE(Hard Level Evaluation)와 GAIA 벤치마크에서 검증되었습니다.

Memento-Skills의 핵심 아이디어는 **메타 에이전트(meta-agent)**입니다. 일반 에이전트가 태스크를 수행하다가 기존 스킬로 처리할 수 없는 상황을 만나면, 메타 에이전트가 새로운 스킬 설계를 담당합니다. 이렇게 생성된 스킬은 검증 과정을 거쳐 라이브러리에 추가됩니다. 시간이 지날수록 스킬 라이브러리가 풍부해지고 에이전트 성능이 향상됩니다.

10개의 내장 스킬(filesystem, web-search, image-analysis, pdf, docx, xlsx, pptx, skill-creator, uv-pip-install, im-platform)이 시작점을 제공합니다. 특히 `skill-creator` 스킬이 자기 진화의 핵심으로, 이 스킬이 새로운 스킬을 생성하는 메타 능력을 담당합니다.

## 주요 기능

- **자기 진화 스킬 생성**: 에이전트가 기존 스킬로 해결할 수 없는 태스크를 만나면 `skill-creator` 스킬을 호출해 새로운 스킬을 자동 설계하고 추가합니다.
- **10개 내장 스킬**: filesystem(파일 시스템), web-search(웹 검색), image-analysis(이미지 분석), pdf(PDF 처리), docx/xlsx/pptx(오피스 문서), skill-creator(스킬 생성), uv-pip-install(패키지 설치), im-platform(메시징 플랫폼).
- **메타 에이전트 아키텍처**: 일반 에이전트 위에 메타 에이전트가 존재합니다. 메타 에이전트는 새 스킬 설계, 기존 스킬 개선, 스킬 간 의존성 관리를 담당합니다.
- **HLE + GAIA 벤치마크 검증**: Hard Level Evaluation(HLE)과 GAIA 벤치마크에서 성능이 검증되었습니다. 학문적 엄밀성이 프레임워크의 실효성을 뒷받침합니다.
- **스킬 버전 관리**: 각 스킬의 생성 시간, 성능 히스토리, 의존성을 추적합니다. 성능이 떨어지는 스킬은 자동으로 개선 후보가 됩니다.
- **uv 통합**: `uv-pip-install` 스킬로 에이전트가 필요한 Python 패키지를 자율적으로 설치합니다. 새로운 라이브러리가 필요한 스킬 생성 시 패키지 설치까지 자동화됩니다.

### 자기 진화 메커니즘 — "Let Agents Design Agents"

```
에이전트 → 태스크 수신
    ↓
기존 스킬 라이브러리 검색
    ↓
적합한 스킬 없음? → skill-creator 호출
    ↓            (메타 에이전트 활성화)
새 스킬 설계:
  - 태스크 분석
  - 새 스킬 코드 생성
  - uv-pip-install로 의존성 설치
  - 스킬 테스트 및 검증
    ↓
스킬 라이브러리에 추가
    ↓
새 스킬로 태스크 실행
```

이 흐름이 반복되면서 스킬 라이브러리가 점점 풍부해지고, 에이전트가 처리할 수 있는 태스크의 범위가 자동으로 확장됩니다.

### 내장 스킬 심층 살펴보기

**skill-creator** — 가장 중요한 스킬:
```python
# skill-creator의 기본 동작
def skill_creator(task_description: str, existing_skills: list) -> Skill:
    # 1. 태스크 분석
    requirements = analyze_task(task_description)
    
    # 2. 기존 스킬 재사용 여부 결정
    if can_compose(requirements, existing_skills):
        return compose_skills(requirements, existing_skills)
    
    # 3. 완전 새로운 스킬 생성
    new_skill_code = generate_skill_code(requirements)
    dependencies = extract_dependencies(new_skill_code)
    
    # 4. 의존성 설치
    for dep in dependencies:
        uv_pip_install(dep)
    
    # 5. 스킬 검증
    test_results = run_skill_tests(new_skill_code)
    
    # 6. 라이브러리 등록
    return register_skill(new_skill_code, test_results)
```

## 기술 스택 / 아키텍처

| 항목 | 내용 |
|------|------|
| 언어 | Python |
| 패키지 매니저 | uv |
| 내장 스킬 | 10개 |
| 벤치마크 | HLE, GAIA |
| 논문 | arXiv 2603.18743 |
| 라이선스 | MIT |

## 설치 / 사용법

```bash
# uv로 설치 (권장)
uv add memento-skills

# 또는 pip
pip install memento-skills

# 환경 설정
export ANTHROPIC_API_KEY=sk-ant-...  # 또는 OPENAI_API_KEY

# 기본 에이전트 실행
from memento_skills import MementoAgent

agent = MementoAgent(
    llm="claude-3-5-sonnet",
    skill_library_path="./skills/",  # 스킬 저장 경로
    auto_evolve=True,                # 자동 스킬 생성 활성화
)

# 태스크 실행 (자동으로 스킬 생성/재사용)
result = agent.run(
    "2025년 AI 논문 Top 10을 검색하고 요약 PDF를 생성해줘"
)

# 현재 스킬 라이브러리 확인
print(agent.list_skills())
```

## 활용 사례 / 사용 시나리오

1. **장기 자동화 시스템**: 처음에는 기본 10개 스킬로 시작하지만 시간이 지날수록 업무 도메인에 맞는 전문 스킬이 자동으로 쌓입니다. 6개월 후에는 해당 조직에 최적화된 스킬 라이브러리를 갖춘 에이전트가 됩니다.

2. **AI 연구 도구**: HLE, GAIA 벤치마크 기반의 학문적으로 검증된 프레임워크로 에이전트 자율화 연구를 수행합니다. 자기 진화 메커니즘을 수정하고 실험해 새로운 연구 방향을 탐색합니다.

3. **도메인 전문 에이전트 빠른 구축**: 의료, 법률, 금융 같은 전문 도메인에서 초기 태스크들을 실행하면 도메인 특화 스킬이 자동으로 생성됩니다. 수동으로 스킬을 설계하는 시간을 크게 절약합니다.

## 결론

Memento-Skills는 에이전트 자율화의 최전선에 있는 연구 기반 프로젝트입니다. "에이전트가 에이전트를 설계한다"는 메타 에이전트 아이디어는 미래 AI 시스템의 방향을 보여줍니다. HLE와 GAIA 벤치마크의 학문적 검증이 아이디어의 신뢰성을 높이며, 10개 내장 스킬로 즉시 실험을 시작할 수 있습니다. 지속적으로 성장하는 에이전트를 구축하려는 연구자와 엔지니어에게 필수 탐구 대상입니다.

---

> 원문: https://github.com/Memento-Teams/Memento-Skills
