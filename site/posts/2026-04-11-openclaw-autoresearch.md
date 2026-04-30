---
title: "openclaw-autoresearch: OpenClaw을 위한 자율 실험 루프 플러그인"
date: "2026-04-11"
category: "AI 도구"
tags: ["OpenClaw", "자동화", "실험"]
excerpt: "OpenClaw에서 코드 편집 → 벤치마크 실행 → 결과 측정 → 유지/폐기 루프를 자율 반복하는 실험 플러그인. pi-autoresearch의 충실한 포트."
author: "큐레이터"
readTime: "6분"
image: null
---

## 소개

최적화 작업은 반복적입니다. 코드를 수정하고, 테스트하고, 결과를 비교하고, 더 나은 방향을 탐색하는 사이클이 계속됩니다. **openclaw-autoresearch**는 이 반복 루프를 OpenClaw AI 에이전트가 자율적으로 수행하도록 해 주는 플러그인입니다.

GitHub Stars 162개를 기록한 이 프로젝트는 원래 Cursor용으로 만들어진 [pi-autoresearch](https://github.com/davebcn87/pi-autoresearch)를 OpenClaw에 충실히 포팅한 것입니다. 통계적 신뢰도 점수, 아이디어 백로그, 세션 간 재개 기능을 포함해 연구·최적화·벤치마킹 워크플로우에 즉시 투입할 수 있습니다.

---

## 주요 기능

openclaw-autoresearch의 핵심을 한눈에 정리합니다.

| 기능 | 설명 |
|------|------|
| 자율 실험 루프 | 에이전트가 독립적으로 코드 수정 → 실행 → 기록 반복 |
| 통계적 신뢰도 | 3회 이상 실험 후 MAD 기반 신뢰 점수 제공 |
| 중단/재개 | 파일 기반 상태로 세션 간 완벽한 재개 |
| 아이디어 백로그 | 폐기된 실험도 아이디어 노트로 보존 |
| 세션 잠금 | 활성/스테일 루프 감지로 중복 실행 방지 |
| Git 통합 | keep 시 자동 커밋, 분기 관리 |

---

## 핵심 기능 1: 3개 도구로 구동되는 실험 루프

플러그인의 핵심은 세 가지 도구입니다.

**`init_experiment`** — 세션 구성
```
name, 주요 지표, 단위, 방향(낮을수록/높을수록 좋음) 설정
기존 실행 기록이 있으면 reset: true 없이는 재초기화 불가
이전 세그먼트 최고 결과를 체크포인트 컨텍스트로 인계
```

**`run_experiment`** — 벤치마크 실행
```
셸 명령 실행 → 타이밍 측정 → stdout/stderr 캡처
METRIC name=number 형식 줄 파싱
미로깅 상태의 실험 윈도우 생성 (다음 실행 전 반드시 로깅 필요)
```

**`log_experiment`** — 결과 기록
```
keep → git 자동 커밋
discard/crash → 커밋 없이 기록 (discard는 아이디어 노트 필수)
첫 로그는 자동으로 베이스라인 태그
3회+ 실험 후 신뢰도 점수 출력
```

각 도구는 `cwd` 파라미터를 지원해 중첩 저장소도 명시적으로 타겟팅할 수 있습니다.

---

## 핵심 기능 2: 파일 기반 상태 관리

모든 상태는 저장소 루트의 6개 파일에 저장됩니다.

```
autoresearch.md           # 세션 문서 (지표, 실행 방법, 시도 내역, 체크포인트)
autoresearch.sh           # 벤치마크 스크립트 (METRIC name=number 형식 출력)
autoresearch.jsonl        # 구조화 로그 (설정 헤더 + 실험 항목)
autoresearch.ideas.md     # 유망한 아이디어 백로그 (선택적)
autoresearch.checkpoint.json  # 플러그인 관리 체크포인트
autoresearch.lock         # 세션 잠금 (PID + 타임스탬프)
```

이 **파일 우선 설계**로 어떤 에이전트든 저장소 루트 파일만 읽으면 이전 컨텍스트 없이도 루프를 재개할 수 있습니다. OpenClaw 세션이 끊겨도, 다른 에이전트 인스턴스가 이어받아도 실험이 연속성을 유지합니다.

---

## 기술 스택 및 아키텍처

```
openclaw-autoresearch/
├── extensions/openclaw-autoresearch/  # 플러그인 엔트리
├── skills/autoresearch-create/        # 스킬 정의
├── openclaw.plugin.json               # 플러그인 메타데이터
├── index.ts                           # 루트 엔트리포인트
├── docs/non-parity.md                 # 업스트림과의 차이점
└── test/                              # 로컬 타입체크 + 테스트 심
```

- **언어**: TypeScript 98.1% + JavaScript 1.9%
- **런타임**: OpenClaw 2026.3.13+
- **의존**: bash, git, git 저장소
- **라이선스**: MIT
- **업스트림**: [davebcn87/pi-autoresearch](https://github.com/davebcn87/pi-autoresearch)

---

## 설치 및 사용법

### 설치

```bash
# npm 패키지로 설치 (권장)
openclaw plugins install @gianfrancopiana/openclaw-autoresearch

# 로컬 OpenClaw 체크아웃 환경
pnpm openclaw plugins install @gianfrancopiana/openclaw-autoresearch

# 로컬 개발 시 링크 방식
openclaw plugins install --link /absolute/path/to/openclaw-autoresearch
```

설치 후 검증:
- 스킬: `autoresearch-create`
- 도구: `init_experiment`, `run_experiment`, `log_experiment`
- 명령어: `/autoresearch`

### 사용 흐름

```
1. 최적화 대상 저장소에서 플러그인 로드
2. /autoresearch 또는 /autoresearch setup <goal> 실행
3. 목표·명령·지표·범위·제약 조건을 에이전트에 전달
4. 에이전트가 autoresearch.md, autoresearch.sh 생성
5. 베이스라인 실행 (run_experiment) → 기록 (log_experiment)
6. 에이전트가 루프 자율 반복
```

### 재개

```bash
# 나중에 다시 맥락 복원
/autoresearch status
```

저장소 루트 파일이 있으면 새 에이전트도 이전 세션을 이어받습니다.

---

## 워크플로우 보장 사항

openclaw-autoresearch는 다음의 안전 장치를 내장합니다:

- 이전 실험이 미로깅 상태면 `run_experiment` 시작 거부
- `init_experiment`는 기존 기록이 있을 때 `reset: true` 없이 재초기화 불가
- `discard` 시 `idea` 노트 필수 → `autoresearch.ideas.md` 자동 추가
- 활성 autoresearch 모드에서 raw `exec`/`bash`를 통한 벤치마크 실행 차단
- `autoresearch/*` 브랜치에서 미로깅 커밋 push 경고
- MAD 기반 신뢰도 점수로 실제 개선과 노이즈 구분

---

## 마치며

openclaw-autoresearch는 성능 최적화, 알고리즘 튜닝, 파라미터 실험 등 반복적인 측정-개선 작업을 AI 에이전트에게 위임하고 싶은 개발자에게 최적의 도구입니다. 파일 기반 설계로 세션 재개가 자연스럽고, 통계적 신뢰도 점수로 노이즈와 진짜 개선을 구분할 수 있습니다.

OpenClaw 생태계를 사용한다면 즉시 설치해 활용할 수 있습니다.

- GitHub: [gianfrancopiana/openclaw-autoresearch](https://github.com/gianfrancopiana/openclaw-autoresearch)
- 라이선스: MIT
- Stars: 162
