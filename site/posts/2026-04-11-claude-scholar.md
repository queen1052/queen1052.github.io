---
title: "Claude Scholar: AI 연구자를 위한 반자동화 학술 연구 보조 시스템"
date: "2026-04-11"
category: "AI 도구"
tags: ["학술 연구", "Claude Code", "Zotero"]
excerpt: "컴퓨터 과학·AI 연구자 특화. Zotero MCP 통합, Obsidian 지식베이스, 7대 연구 워크플로우. 아이디어 생성부터 논문 게재 후 홍보까지 전 과정을 AI가 함께 한다."
author: "큐레이터"
readTime: "8분"
image: null
---

## 소개: 연구자의 작업 흐름 전체를 AI로

AI 코딩 도구들이 소프트웨어 개발을 혁신하고 있다면, 학술 연구는 어떨까? 코드 작성만이 아니라 문헌 검색, 실험 설계, 결과 분석, 논문 작성, 리뷰어 대응, 게재 후 발표 준비까지 — 연구자의 작업은 훨씬 다양하다.

**Claude Scholar**는 이 모든 과정을 AI와 함께 하기 위해 만들어진 반자동화 학술 연구 보조 시스템이다. GitHub 스타 3,100개, Python 63.7%+JavaScript 19.5%+Shell 16.5%, MIT 라이선스. Claude Code, OpenCode, Codex CLI를 모두 지원한다.

특히 **컴퓨터 과학과 AI 연구자**에게 최적화되어 있다. 문헌 검토와 코딩과 실험과 논문 작성을 하나의 워크플로우로 묶고, Zotero와 Obsidian을 AI 에이전트와 연결해 지식베이스가 살아 숨쉬도록 한다.

## 주요 기능

**7대 주요 워크플로우**: 연구 아이디어 생성(+Zotero 통합), ML 프로젝트 개발, 실험 분석, 학회 논문 작성, 리뷰 대응, 논문 발표, 게재 후 홍보를 체계적으로 지원한다.

**Zotero MCP 통합**: DOI/arXiv/URL 기반 논문 자동 가져오기, 컬렉션 기반 읽기 워크플로우, 전문 PDF 접근. Galaxy-Dawn/zotero-mcp와 연동한다.

**Obsidian 지식베이스**: Papers/, Experiments/, Results/, Writing/, Daily/ 폴더 구조로 프로젝트 지식을 파일시스템 기반으로 관리한다. 실험 로그, 결과 보고서가 장기 기억으로 쌓인다.

**자동화 훅**: session-start, session-summary, stop-summary, security-guard, skill-forced-eval 훅이 자동으로 관련 워크플로우를 표면화하고 위험한 명령을 차단한다.

**다국어 문서**: 영어, 중국어, 일본어 README와 CLAUDE.md를 제공한다.

## 7대 주요 워크플로우 상세

### 1. 연구 아이디어 생성 (Zotero 통합)

```
/research-init    # 문헌 검색 → Zotero 조직 → 제안서 초안까지
/zotero-review    # 기존 Zotero 컬렉션 → 구조화된 문헌 합성
/zotero-notes     # 컬렉션 일괄 읽기 → 구조화된 독서 노트
```

5W1H 브레인스토밍: 막연한 주제를 구조화된 질문(`What/Why/Who/When/Where/How`)으로 전환한다. literature-reviewer 에이전트가 논문을 검색, 분류, 합성해 실행 가능한 문헌 그림을 만든다.

### 2. ML 프로젝트 개발

```
/plan     # 코딩 전 구현 계획 수립
/commit   # 현재 변경사항에 대한 컨벤셔널 커밋 준비
/tdd      # 작은 테스트 기반 구현 단계
/code-review  # 집중 코드 리뷰
```

Factory/Registry 패턴으로 새 ML 컴포넌트 구조화, 타입 안전 config-driven 코드, 체계적인 스택 트레이스 디버깅.

### 3. 실험 분석

```
/analyze-results  # 엄격한 분석 + 최종 보고서 한번에
```

실험 로그와 메트릭 파일을 읽어 t-test/ANOVA/Wilcoxon 통계 검정, 해석 가이드가 포함된 과학적 그래프 생성, 절제 분석, 성능 트레이드오프 분석.

### 4. 논문 작성 (학회 템플릿)

```
/draft    # 섹션 초안 작성
/lit-review  # 관련 연구 작성
/rebuttal    # 리뷰어 코멘트에 대한 반박 초안
```

latex-conference-template-organizer 스킬로 학회 포맷에 맞게 LaTeX 논문을 구성한다.

### 5. 게재 후 처리

```
/presentation  # 발표 구조 + 슬라이드 가이드
/poster        # 포스터 콘텐츠 + 레이아웃 가이드
/promote       # SNS, 블로그, 트레드 홍보 콘텐츠
```

### 6. Obsidian 지식베이스 관리

```
/obsidian-ingest  # Obsidian 올바른 위치에 파일 수집
/obsidian-views   # 선택적 뷰 생성/갱신 (.base 파일)
/obsidian-note    # 단일 노트 관리 (조회/이름변경/아카이빙)
```

실험 보고서는 Results/Reports/에 저장되고, Daily/에 일일 진행률이 기록된다.

## 기술 스택과 아키텍처

- **언어**: Python 63.7%, JavaScript 19.5%, Shell 16.5%, Makefile 0.3%
- **지원 CLI**: Claude Code (주요), OpenCode, Codex CLI
- **통합**: Zotero+Galaxy-Dawn/zotero-mcp, Obsidian, Git, LaTeX
- **훅 시스템**: `session-start.js`, `session-summary.js`, `stop-summary.js`, `security-guard.js`, `skill-forced-eval.js`
- **설정 파일**: `~/.claude/CLAUDE.md`, `settings.json`, `wing_config.json`(Obsidian 언어 설정)

Obsidian 노트 언어는 우선순위로 결정된다: (1) `.claude/project-memory/registry.yaml` → `note_language`, (2) `OBSIDIAN_NOTE_LANGUAGE` 환경변수, (3) 기본값 `en`.

## 설치와 사용법

### 전체 설치 (권장)

```bash
git clone https://github.com/Galaxy-Dawn/claude-scholar.git /tmp/claude-scholar
bash /tmp/claude-scholar/scripts/setup.sh
```

인스톨러가 자동으로:
- 기존 `~/.claude/CLAUDE.md`를 보존하고 `.scholar.md`로 사이드카 설치
- 기존 훅에 새 훅 항목 추가(교체 아님)
- settings.json 백업 후 훅/MCP 항목 병합

**중요**: 이미 CLAUDE.md가 있다면 `.scholar.md` 설치 후 원하는 섹션을 직접 병합해야 한다. 사이드카 파일이 자동 적용되지는 않는다.

### 플러그인 마켓플레이스 설치

```bash
/plugin marketplace add Galaxy-Dawn/claude-scholar
/plugin install claude-scholar@claude-scholar
```

이후 rules 수동 설치:
```bash
mkdir -p .claude/rules
cp /tmp/claude-scholar/rules/*.md .claude/rules/
```

### 최소 설치 (핵심 연구 스킬만)

```bash
git clone https://github.com/Galaxy-Dawn/claude-scholar.git /tmp/claude-scholar
mkdir -p ~/.claude/hooks ~/.claude/skills
cp /tmp/claude-scholar/hooks/*.js ~/.claude/hooks/
cp -r /tmp/claude-scholar/skills/ml-paper-writing ~/.claude/skills/
cp -r /tmp/claude-scholar/skills/research-ideation ~/.claude/skills/
cp -r /tmp/claude-scholar/skills/results-analysis ~/.claude/skills/
cp -r /tmp/claude-scholar/skills/review-response ~/.claude/skills/
cp -r /tmp/claude-scholar/skills/writing-anti-ai ~/.claude/skills/  # AI 표지 제거
```

## 마치며

Claude Scholar는 학술 연구의 전 과정을 AI 에이전트와 함께 하고자 하는 연구자에게 체계적인 프레임워크를 제공한다. AI 도구를 용도 불명확하게 사용하는 것이 아니라, 각 워크플로우 단계에 맞는 스킬과 에이전트가 정의되어 있다.

특히 컴퓨터 과학과 AI 연구자라면 신뢰할 수 있는 시작점이다. Zotero MCP로 논문 관리를 자동화하고, Obsidian으로 지식베이스를 구축하며, 실험 분석부터 리뷰어 대응까지 AI의 도움을 받는 워크플로우. 연구 생산성의 새로운 기준이 될 수 있다.

학술 연구도 이제 AI와 함께 한다. Claude Scholar가 그 방법을 알려준다.
