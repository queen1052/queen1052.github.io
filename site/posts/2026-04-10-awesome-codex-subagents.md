---
title: "Awesome Codex Subagents: 136개 전문 서브에이전트 컬렉션"
date: "2026-04-10"
category: "AI 에이전트"
tags: ["Codex", "subagents", "CLI"]
excerpt: "VoltAgent가 엄선한 136개 이상의 OpenAI Codex 서브에이전트 — PR 리뷰, 버그 조사, 리포 탐색 등 10가지 카테고리로 즉시 활용 가능."
author: "큐레이터"
readTime: "5분"
image: null
---

## 소개

Awesome Codex Subagents는 VoltAgent 팀이 큐레이션한 **OpenAI Codex CLI 서브에이전트 컬렉션**입니다. GitHub에서 3,800개의 별을 기록하며 Codex CLI 사용자 커뮤니티에서 핵심 참조 저장소로 자리 잡았습니다. 개발자가 매번 서브에이전트를 처음부터 작성하는 대신, 검증된 서브에이전트를 즉시 가져다 쓸 수 있습니다.

Codex CLI의 서브에이전트 기능은 특정 태스크에 특화된 에이전트를 구성하고, 메인 에이전트가 복잡한 작업을 서브에이전트에 위임하는 방식으로 작동합니다. Awesome Codex Subagents는 이 패턴을 활용한 **10개 카테고리, 136개 이상의 서브에이전트**를 제공합니다. 각 서브에이전트는 명확한 목적, 입출력 형식, 예시를 포함해 바로 사용하거나 수정하기 쉽습니다.

커뮤니티 기여를 통해 지속적으로 성장하는 living collection이며, 새로운 서브에이전트 아이디어는 PR을 통해 추가할 수 있습니다.

## 주요 기능

- **10개 카테고리 분류**: Core Development, Testing & QA, Documentation, Security, DevOps & CI/CD, Data & Analytics, Code Review, Bug Investigation, Repo Exploration, Tooling으로 체계적으로 분류됩니다.
- **PR 리뷰 서브에이전트**: 코드 변경사항을 자동 분석해 잠재적 버그, 스타일 위반, 성능 이슈, 보안 취약점을 보고합니다. 리뷰어의 초안 코멘트를 자동 생성합니다.
- **버그 조사 서브에이전트**: 에러 메시지, 스택 트레이스, 로그를 입력하면 근본 원인을 분석하고 수정 제안을 제공합니다. 관련 코드 파일을 자동으로 탐색합니다.
- **리포 탐색 에이전트**: 낯선 코드베이스를 빠르게 이해하고 핵심 패턴, 아키텍처, 진입점을 요약합니다. 새 팀원 온보딩이나 오픈소스 기여 준비에 유용합니다.
- **문서화 에이전트**: 코드를 읽고 README, API 문서, 인라인 주석을 자동 생성합니다. JSDoc, docstring, OpenAPI 스펙 다양한 형식을 지원합니다.
- **보안 감사 에이전트**: OWASP Top 10 취약점, 하드코딩된 비밀키, 인젝션 취약점을 자동으로 스캔합니다.

### PR 리뷰 서브에이전트 — 자동 코드 리뷰의 현실화

```yaml
# pr-reviewer.yaml
name: PR Reviewer
description: Comprehensive code review for pull requests
instructions: |
  당신은 시니어 소프트웨어 엔지니어입니다.
  주어진 diff를 분석해 다음 항목을 검토하세요:
  1. 잠재적 버그 및 로직 오류
  2. 성능 이슈 (불필요한 루프, N+1 쿼리 등)
  3. 보안 취약점 (OWASP Top 10 기준)
  4. 코드 스타일 및 가독성
  5. 테스트 커버리지 갭
  각 이슈마다 파일명, 라인 번호, 개선 제안을 포함하세요.
tools:
  - read_file
  - search_files
```

### 버그 조사 — 체계적 근본인 분석

버그 조사 서브에이전트는 단순히 에러 메시지를 검색하는 것을 넘어서, **재현 경로 추추, 관련 코드 흐름 추적, 가설 검증**의 구조화된 탐정 방법론을 따릅니다. 에러 로그를 입력하면 에이전트가 스택 트레이스를 역방향으로 추적하고 가능한 근본 원인 목록을 생성합니다.

## 기술 스택 / 아키텍처

| 항목 | 내용 |
|------|------|
| 플랫폼 | OpenAI Codex CLI |
| 서브에이전트 수 | 136+ |
| 카테고리 수 | 10 |
| 포맷 | YAML / Markdown |
| 별 | 3,800+ |
| 라이선스 | MIT |

서브에이전트 구조:  
`agents/<category>/<agent-name>.yaml (또는 .md)` → `name + description + instructions + tools`

## 설치 / 사용법

```bash
# 저장소 클론
git clone https://github.com/VoltAgent/awesome-codex-subagents
cd awesome-codex-subagents

# 서브에이전트 목록 확인
ls agents/

# PR 리뷰 에이전트 사용
codex --agent agents/code-review/pr-reviewer.yaml \
      --input "$(git diff HEAD~1)"

# 버그 조사 에이전트
codex --agent agents/debugging/bug-investigator.yaml \
      --input "$(cat error.log)"

# 새 리포 탐색
codex --agent agents/exploration/repo-explorer.yaml \
      --input "이 코드베이스의 아키텍처를 설명해줘"
```

에이전트를 프로젝트별 `.codex/agents/` 폴더에 복사하면 해당 프로젝트에서 자동으로 인식합니다.

## 활용 사례 / 사용 시나리오

1. **CI/CD 통합 자동 리뷰**: PR이 생성되면 GitHub Actions에서 PR 리뷰 서브에이전트를 자동 실행합니다. 초안 코멘트를 생성해 인간 리뷰어의 시간을 절약하고 기초적인 버그를 사전에 차단합니다.

2. **오픈소스 기여 준비**: 처음 보는 오픈소스 프로젝트에 기여할 때, 리포 탐색 에이전트로 코드베이스 구조를 빠르게 파악합니다. "이 함수는 무엇을 하는가", "어디서 호출되는가"를 자동으로 분석합니다.

3. **레거시 코드 이해**: 문서가 없는 레거시 코드베이스를 대상으로 리포 탐색 + 문서화 에이전트를 연속 실행해 자동으로 README와 코드 주석을 생성합니다.

## 결론

Awesome Codex Subagents는 Codex CLI를 사용하는 개발자의 필수 레퍼런스 저장소입니다. 136개의 에이전트가 즉시 사용 가능하며 커뮤니티 기여로 지속 성장합니다. PR 리뷰, 버그 조사, 보안 감사 등 반복적이고 시간이 많이 드는 작업을 에이전트에게 위임해 고부가가치 작업에 집중할 수 있습니다.

---

> 원문: https://github.com/VoltAgent/awesome-codex-subagents
