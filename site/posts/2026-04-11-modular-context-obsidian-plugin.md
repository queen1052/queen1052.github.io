---
title: "Modular Context: Obsidian 안에서 여러 AI 에이전트 터미널을 동시에 돌리는 플러그인"
date: "2026-04-11"
category: "AI 도구"
tags: ["Obsidian", "Claude Code", "AI 터미널", "지식관리", "플러그인"]
excerpt: "Obsidian에 최대 8개의 AI 에이전트 터미널을 나란히 배치한다. Claude Code·Codex 동시 실행, 스킬 사이드바, 에이전트 트래커, 3층 LLM Wiki 방법론으로 Vault가 살아있는 지식 베이스가 된다."
author: "큐레이터"
readTime: "7분"
image: null
---

## 소개: Obsidian과 AI 에이전트의 만남

AI 코딩 에이전트와 노트 앱은 서로 다른 세계에 살아왔다. 에이전트는 VSCode 터미널에서, 노트는 Obsidian에서. 프로젝트 결정은 AI 채팅에서 나오는데, 그 맥락이 Obsidian 지식베이스에 연결되지 않는다. 컨텍스트 스위칭이 끊임없이 발생한다.

**Modular Context**는 이 두 세계를 하나로 합친 Obsidian 플러그인이다. GitHub 스타 54개, JavaScript 91.9%, MIT 라이선스. Claude Code와 Codex를 Obsidian 창 안에서 직접 실행하고, 최대 8개의 터미널을 분할 레이아웃으로 동시에 운영한다.

더 특별한 것은 단순한 터미널 에뮬레이터가 아니라는 점이다. **Modular Context Methodology**를 통해 Obsidian Vault를 LLM이 읽고 이해하는 구조화된 지식 베이스(LLM Wiki)로 변환한다. Andrej Karpathy의 LLM Wiki 개념에서 영감을 받아 실제로 구현했다.

## 주요 기능

**멀티터미널 분할 레이아웃**: Single→Side-by-side→Stacked→2×2→2×3→2×4 그리드, 최대 8개의 동시 세션. 각 세션에는 고유한 기하학적 글리프(glyph)가 할당되어 시각적으로 즉시 구별된다.

**Claude Code + Codex 지원**: 설정에서 AI 제공자를 토글. 새 터미널마다 자동 실행되어 바로 작업 시작.

**스킬 사이드바**: 원클릭으로 Claude Code 에이전트 세션을 시작하는 스킬 런처. 48px 아이콘 전용 컴팩트 모드로 터미널 공간 극대화.

**에이전트 트래커**: Working(활성)/To Review(검토 대기)/Standby(대기) 3가지 상태. 여러 에이전트가 동시에 실행되어도 각 상태를 한눈에 파악.

**Vault 위키링크 자동완성**: 터미널 안에서 `[[`를 입력하면 Vault 노트 검색. AI에게 프로젝트 컨텍스트를 정확히 전달할 수 있다.

**드래그앤드롭**: Finder나 Obsidian 파일을 터미널에 드래그하면 쉘 이스케이프된 경로가 자동 붙여넣기.

**세션 영속성**: 탭 이름, 글리프, 레이아웃이 재시작 후에도 유지된다.

## Modular Context Methodology: Vault를 LLM Wiki로

이 플러그인의 진짜 가치는 터미널보다 **방법론**에 있다. 3층 아키텍처와 cadence 기반 staleness 시스템이 Vault를 실제로 유용한 AI 컨텍스트로 변환한다.

### 3층 아키텍처

**Layer 1 — Raw Sources** (`_transcripts/`, `_transcripts-backlog/`)
- 선별된 소스 자료. 불변(immutable)
- LLM이 읽기만 하고 절대 수정하지 않음

**Layer 2 — The Wiki** (프로젝트 폴더, `*_index.md` 포함)
- LLM이 생성하고 상호 연결된 지식 모듈
- 요약, 엔티티 페이지, 합성 결과물

**Layer 3 — The Schema** (`CLAUDE.md` + `_claude/`)
- LLM에게 Vault가 어떻게 작동하는지 가르치는 규칙, 템플릿, 스킬 참조
- 브랜드 보이스, 프로젝트 규칙, 처리 워크플로우

### 3가지 작업

| 작업 | 설명 | 스킬 명령 |
|------|------|---------|
| **INGEST** | 새 소스를 위키 모듈로 처리 | `/process-transcripts` |
| **QUERY** | 질문 답변, 인사이트 합성, 저장 | `/brief`, `/ideas` |
| **LINT** | 상태 점검: 오래됨/고아/깨진 링크 | `/pulse`, `/vault-audit`, `/reweave`, `/graph` |

### Frontmatter 표준과 Cadence 시스템

모든 파일에 구조화된 메타데이터:
```yaml
---
title: Module Name
updated: 2026-04-05
status: stable        # stable | draft | needs-update | stub
cadence: tactical     # hot(7d) | tactical(30d) | iron-cold(60d) | frozen
depends-on: [[related-file]]
sources: [[transcript-name]]
---
```

**Staleness 점수** = `days_since_update / cadence_days`:
- < 0.5 → 신선 (초록)
- 0.5-1 → 노화 (노랑)
- 1-2 → 오래됨 (주황)
- > 2 → 위급 (빨강)

`pipeline.md` (hot, 7일) 파일이 10일 방치됐다면 staleness = 1.4로 오래됨. `vision.md` (iron-cold, 60일) 파일이 40일 방치됐다면 = 0.67로 신선. Vault가 스스로 무엇이 필요한지 알려준다.

## 9개 내장 스킬

| 스킬 | 기능 |
|------|------|
| **Ingest Data** | 새 소스 처리 — 분류, 인사이트 추출, 위키 모듈 업데이트 |
| **Pulse** | Vault 상태 점검 — staleness 레이더, 전략적 질문, 다음 단계 |
| **Brief** | Vault 지식에서 PDF 브리프 또는 원페이저 생성 |
| **Log** | 세션 종료 — 세션 로그 생성, 변경사항 커밋 |
| **Ideas** | 창의적 트리거를 사용해 Vault 컨텍스트에서 새 아이디어 생성 |
| **Reweave** | 오래되거나 연결이 끊긴 모듈 캐스케이드 업데이트 |
| **Vault Audit** | 구조 감사 — 깨진 링크, 고아 노트, 명명 문제 |
| **Graph** | 지식 그래프 분석 — 클러스터, 브리지, 의존성 깊이 |
| **Graduate** | 묻힌 트랜스크립트 인사이트를 독립 모듈로 승격 |

`[+]` 버튼으로 커스텀 스킬 추가 가능. 각 스킬은 `.claude/skills/`의 Claude Code `/skill-name` 명령에 매핑된다.

## 설치와 사용법

### BRAT 플러그인 (권장, 자동 업데이트)

1. Obsidian 커뮤니티 플러그인에서 BRAT 설치
2. BRAT 설정 → Add Beta Plugin
3. `klemensgc/modular-context-obsidian-plugin` 입력
4. 플러그인 활성화

### 수동 설치

1. [최신 릴리즈](https://github.com/klemensgc/modular-context-obsidian-plugin/releases/latest) 다운로드
2. `.obsidian/plugins/modular-context/`에 압축 해제
3. Obsidian 재시작, 플러그인 활성화

### 요구사항

- **macOS 전용** (실제 PTY를 위해 Python PTY 사용 — 데스크톱만)
- Python 3 (macOS 기본 포함)
- Claude Code CLI 또는 Codex CLI

### 기본 사용법

```
리본 아이콘 클릭 → 터미널 열기
+ 버튼 → 새 세션 (Claude Code 자동 실행)
[[ 입력 → Vault 위키링크 자동완성
파일 드래그 → 경로 자동 붙여넣기
Cmd+Shift+S → 터미널 출력을 노트로 캡처
```

**Auto-mode**: 사이드바에서 토글. 활성화 시 `--dangerously-skip-permissions` (Claude Code) 또는 `--full-auto` (Codex)로 완전 자율 실행. 기본값 OFF — 에이전트를 신뢰할 때만 활성화.

## 마치며

Modular Context는 "AI 에이전트 + 지식 관리"라는 조합을 Obsidian 위에서 구현한 실험적이지만 영리한 도구다. 54스타는 아직 작은 숫자지만, 주 단위로 업데이트가 쏟아지고 있다 — 1주일 사이 열아홉 번의 릴리즈.

Andrej Karpathy의 LLM Wiki 아이디어를 실제 작동하는 시스템으로 만든다는 비전이 흥미롭다. AI 에이전트와의 모든 대화가 구조화된 지식으로 쌓이고, 다음 에이전트가 그 지식을 컨텍스트로 활용하는 선순환. Obsidian에서 AI 에이전트 작업을 하는 사람이라면, 지금 당장 BRAT으로 설치해볼 가치가 충분히 있다.
