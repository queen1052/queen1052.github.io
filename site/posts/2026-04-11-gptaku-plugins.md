---
title: "GPTaku Plugins: AI Native를 위한 한국어 Claude Code 플러그인 모음"
date: "2026-04-11"
category: "개발 도구"
tags: ["Claude Code", "플러그인", "한국어"]
excerpt: "GPTaku Plugins는 AI Native가 되고 싶은 사람들을 위한 Claude Code 플러그인 모음입니다. 딥리서치, PRD 생성, 멀티 에이전트 코딩, Google Workspace 자동화 등 한국어로 특화된 9개의 플러그인을 제공합니다."
author: "큐레이터"
readTime: "6분"
image: null
---

## GPTaku Plugins란 무엇인가?

AI Native란 AI를 단순히 도구로 쓰는 게 아니라, 기획부터 실행까지 AI를 자연스럽게 녹여내는 사람을 말합니다. 그런데 그 과정은 쉽지 않습니다. 개발 경험이 없는 사람에게는 하나하나가 새로운 벽이고, AI와 협업하는 방법 자체를 배워가야 합니다.

**GPTaku Plugins**는 그 과정에서 겪는 구체적인 어려움을 하나씩 해소하기 위해 만들어진 Claude Code 플러그인 모음입니다. 167개 스타, 한국어 특화 설계, MIT 라이선스로 제공됩니다. Claude Code 전용으로 설계되었으며 직접 마켓플레이스에서 설치할 수 있습니다.

## 주요 기능 한눈에 보기

현재 제공되는 9개의 플러그인은 각각 구체적인 문제를 해결합니다:

| 플러그인 | 설명 |
|---------|------|
| **docs-guide** | 공식문서 기반 정확한 답변 — 68개+ 라이브러리 지원, llms.txt 패턴 활용 |
| **git-teacher** | 비개발자를 위한 Git/GitHub 온보딩 — 클라우드 비유로 5단계 완성 |
| **vibe-sunsang** | 바이브코더를 위한 AI 멘토 에이전트 — 대화 분석, 멘토링, 성장 리포트 |
| **deep-research** | AI 딥리서치 — 멀티에이전트 소스 검증, 7단계 파이프라인, 구조화된 리포트 생성 |
| **pumasi** | 품앗이 — Claude가 PM, Codex CLI가 병렬 외주 개발자로 대규모 코딩 병렬 처리 |
| **show-me-the-prd** | 쇼미더피알디 — 인터뷰 기반 PRD 생성, 한 문장에서 4종 디자인 문서까지 |
| **kkirikkiri** | 끼리끼리 — 자연어 한마디로 AI 에이전트 팀 자동 구성, 멀티 모델 지원 |
| **skillers-suda** | 스킬러들의 수다 — 4명의 전문가가 수다를 통해 아이디어를 동작하는 스킬로 변환 |
| **nopal** | 노팔 — Google Workspace 8개 서비스를 자연어로 오케스트레이션 |

## 핵심 플러그인 심층 탐구: pumasi와 kkirikkiri

**pumasi(품앗이)**: Claude Code가 PM(프로젝트 매니저) 역할을 맡고, Codex CLI가 병렬 외주 개발자로 실제 코딩을 수행합니다. 대규모 코딩 작업을 Claude(설계/조율) + Codex(실행/구현)의 협업으로 처리하는 독창적인 분업 설계입니다.

**kkirikkiri(끼리끼리)**: 자연어 한마디로 AI 에이전트 팀을 자동 구성합니다. "쇼핑몰 백엔드 만들어줘"라고 입력하면 DB 에이전트, API 에이전트, 테스트 에이전트 등을 자동으로 편성하고 실행합니다. 멀티 모델을 지원합니다.

**deep-research**: 멀티에이전트 소스 검증과 7단계 파이프라인으로 구조화된 리서치 리포트를 생성합니다. 단순 웹 검색이 아니라 다수의 에이전트가 각각 검색하고 교차 검증하는 방식입니다.

**show-me-the-prd(쇼미더피알디)**: 인터뷰 기반으로 PRD를 자동 생성합니다. 한 문장의 아이디어를 입력하면 PRD, ERD, API 설계서, WBS 등 4종의 디자인 문서를 생성합니다.

## nopal: Google Workspace 통합 자동화

**nopal(노팔)**은 Google Workspace의 8개 서비스(Gmail, Calendar, Docs, Sheets, Drive, Forms, Slides, Meet)를 자연어 명령으로 오케스트레이션합니다. gws CLI를 기반으로 자동화 파이프라인을 구성합니다.

v0.5.0부터 Google Meet까지 9번째 서비스로 추가되었습니다.

## 기술 스택 및 아키텍처

GPTaku Plugins는 git 서브모듈 방식으로 관리됩니다. 각 플러그인은 독립된 저장소로 관리되며, `gptaku_plugins` 저장소는 이를 서브모듈로 묶는 마켓플레이스 역할을 합니다.

- **플러그인 형식**: Claude Code 플러그인 표준
- **관리 방식**: git 서브모듈
- **요구사항**: Claude Code (Max/Pro 또는 API 키), Node.js
- **Windows**: WSL2 위에서 Claude Code 실행 필요 (`wsl --install`)
- **라이선스**: MIT

## 설치 및 사용법

```bash
# 1단계: 마켓플레이스 등록 (최초 1회)
/plugin marketplace add https://github.com/fivetaku/gptaku_plugins.git

# 2단계: 원하는 플러그인 설치
/plugin install

# 특정 플러그인 바로 설치
/plugin install show-me-the-prd
/plugin install deep-research
/plugin install pumasi
/plugin install nopal

# 업데이트
/plugin update
```

설치/업데이트 후에는 Claude Code를 재시작해야 플러그인이 활성화됩니다. 플러그인은 계속 추가되고 있으므로 저장소를 Watch해두면 새 플러그인 알림을 받을 수 있습니다.

## 마치며

GPTaku Plugins는 한국의 AI Native 커뮤니티를 위해 만들어진 실용적인 플러그인 모음입니다. docs-guide로 정확한 공식 문서 기반 답변을, pumasi로 Claude+Codex 협업 코딩을, kkirikkiri로 에이전트 팀 자동 구성을, show-me-the-prd로 인터뷰 기반 문서 생성을... 각 플러그인은 실제 현장에서 겪는 구체적인 문제를 해결합니다. Claude Code를 더 잘 활용하고 싶은 한국어 사용자에게 강력히 추천합니다.
