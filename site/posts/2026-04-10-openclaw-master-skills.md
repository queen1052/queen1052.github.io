---
title: "OpenClaw Master Skills: Claude를 위한 387개 마스터 스킬"
date: "2026-04-10"
category: "AI 에이전트"
tags: ["Claude", "skills", "DevOps", "marketing", "collection"]
excerpt: "LeoYeAI의 OpenClaw Master Skills — 검색/웹(21), 개발/DevOps(87), 마케팅(35), 소셜(13) 등 387개 Claude 스킬의 완결판 컬렉션."
author: "큐레이터"
readTime: "6분"
image: null
---

## 소개

OpenClaw Master Skills는 LeoYeAI가 공개한 **387개 Claude 스킬의 마스터 컬렉션**입니다. 개인이 수집·큐레이션한 가장 큰 규모의 Claude 스킬 모음으로, 검색·웹부터 DevOps, 마케팅, 소셜 콘텐츠까지 광범위한 영역을 커버합니다. 스킬 하나하나가 Claude Code가 특정 전문 역할을 수행하도록 시스템 프롬프트와 워크플로우를 정의합니다.

OpenClaw Master Skills의 규모와 다양성이 인상적입니다. 단순히 많은 것이 아니라 **카테고리별 최적화**가 되어 있습니다. DevOps 카테고리(87개)는 CI/CD, 모니터링, 컨테이너, 인프라 자동화를 세분화해 다룹니다. 마케팅 카테고리(35개)는 콘텐츠 전략부터 SEO, 이메일 마케팅, 유료 광고까지 각각 전문화된 스킬을 포함합니다.

설치 방법은 두 가지입니다: Git clone 후 전체를 가져오거나, 특정 카테고리의 스킬만 선택적으로 복사합니다. Claude Code 또는 Claude.ai에서 `/skills/[카테고리]/[스킬명]`으로 즉시 활성화합니다.

## 주요 기능

- **387개 큐레이션 스킬**: 단순 나열이 아닌 실제 업무에서 검증된 스킬들로 구성됩니다. 중복과 저품질 스킬을 제거하고 실용성을 기준으로 선별했습니다.
- **검색/웹 카테고리 (21개)**: 웹 검색, 데이터 스크래핑, API 탐색, 문서 검색 등 정보 수집 전문 스킬. Perplexity, Brave, SerpAPI 등 다양한 검색 도구를 활용합니다.
- **개발/DevOps 카테고리 (87개)**: 가장 큰 카테고리. 코드 리뷰, CI/CD 파이프라인, Docker/Kubernetes, 모니터링 설정, 데이터베이스 관리, 보안 감사를 포함합니다.
- **마케팅/성장 카테고리 (35개)**: 콘텐츠 마케팅, SEO 최적화, 이메일 캠페인, 성과 분석, A/B 테스트, 소셜 미디어 전략 스킬.
- **소셜/콘텐츠 카테고리 (13개)**: LinkedIn, Twitter, YouTube, 뉴스레터 등 플랫폼별 콘텐츠 최적화 스킬.
- **기타 카테고리 (43개)**: 법률 문서 검토, 재무 분석, 교육 자료 작성, 번역, 프로젝트 관리 등.

### 카테고리별 스킬 분포 — 387개의 전문 지식

```
개발/DevOps (87개)
  ├── 코드 품질 (리뷰, 테스트, 린팅) — 18개
  ├── CI/CD & 배포 — 15개
  ├── 컨테이너 & 오케스트레이션 — 12개
  ├── 클라우드 인프라 — 14개
  ├── 보안 & 컴플라이언스 — 11개
  └── 모니터링 & 관찰성 — 17개

마케팅/성장 (35개)
  ├── 콘텐츠 전략 — 8개
  ├── SEO & SEM — 7개
  ├── 이메일 마케팅 — 6개
  ├── 소셜 미디어 — 7개
  └── 분석 & 보고 — 7개

검색/웹 (21개)
  ├── 웹 검색 통합 — 7개
  ├── 데이터 수집 — 8개
  └── API 탐색 — 6개
```

### DevOps 스킬 하이라이트 — 인프라 자동화의 AI화

DevOps 카테고리의 87개 스킬 중 특히 인상적인 것들:

- **kubernetes-troubleshooter**: Pod 실패, CrashLoopBackOff, OOMKilled 등 Kubernetes 오류 진단
- **ci-pipeline-optimizer**: GitHub Actions, GitLab CI 파이프라인 분석 및 최적화 제안
- **terraform-reviewer**: Terraform 플랜을 분석해 보안, 비용, 베스트 프랙티스 위반 식별
- **log-analyzer**: 대용량 로그에서 오류 패턴, 이상치, 성능 병목을 자동 분석
- **incident-commander**: 장애 대응 시 진단, 영향 범위 파악, 임시 조치, 근본 원인 분석 가이

## 기술 스택 / 아키텍처

| 항목 | 내용 |
|------|------|
| 스킬 수 | 387개 |
| 카테고리 | 검색/웹(21), 개발/DevOps(87), 마케팅(35), 소셜(13), 기타(43) |
| 플랫폼 | Claude Code, Claude.ai |
| 포맷 | Markdown (.md) |
| 설치 | Git clone 또는 선택적 복사 |
| 라이선스 | MIT |

## 설치 / 사용법

```bash
# 전체 설치
git clone https://github.com/LeoYeAI/openclaw-master-skills
cd openclaw-master-skills

# 전체를 프로젝트에 복사
cp -r skills/ /path/to/project/skills/

# 특정 카테고리만 복사
cp -r skills/devops/ /path/to/project/skills/devops/

# Claude Code에서 사용
/skills/devops/kubernetes-troubleshooter
/skills/marketing/seo-optimizer
/skills/search/web-research-agent

# 스킬 목록 확인
ls skills/
# devops/  marketing/  search/  social/  other/
```

팀 환경에서는 기업 공통 `skills/` 폴더를 모노레포에 저장하고, 각 프로젝트에서 심볼릭 링크로 참조합니다.

## 활용 사례 / 사용 시나리오

1. **스타트업 올인원 AI 팀**: 87개 DevOps 스킬로 인프라를 자동화하고, 35개 마케팅 스킬로 콘텐츠를 생성하며, 13개 소셜 스킬로 채널을 운영합니다. 소규모 팀이 AI 스킬로 여러 역할을 커버합니다.

2. **DevOps 인프라 자동화**: CI/CD, Kubernetes, Terraform 관련 87개 스킬을 개발팀 공통 라이브러리로 배포합니다. 모든 팀원이 동일한 DevOps AI 어시스턴트 품질을 경험합니다.

3. **마케팅 콘텐츠 파이프라인**: 마케팅 카테고리 35개 스킬을 순서대로 적용해 트렌드 분석 → 콘텐츠 기획 → SEO 최적화 → 이메일 캠페인 작성 → 성과 분석의 전체 파이프라인을 자동화합니다.

## 결론

OpenClaw Master Skills는 Claude 사용자가 최대한 활용할 수 있는 스킬 라이브러리를 한 곳에 모았습니다. 387개의 규모와 카테고리별 전문성이 인상적이며, MIT 라이선스로 자유롭게 수정하고 팀에 맞게 커스터마이징할 수 있습니다. Claude Code를 핵심 개발 도구로 사용하는 팀이라면 이 라이브러리를 출발점으로 삼아 팀 전용 스킬 컬렉션을 구축할 수 있습니다.

---

> 원문: https://github.com/LeoYeAI/openclaw-master-skills
