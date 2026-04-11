---
title: "obsidian-skills: AI 에이전트를 위한 Obsidian 전용 스킬 모음"
date: "2026-04-11"
category: "생산성"
tags: ["Obsidian", "Claude Code", "AI 에이전트", "스킬", "마크다운", "지식관리"]
excerpt: "Obsidian 볼트를 AI 에이전트가 자유롭게 읽고 쓸 수 있도록 해 주는 공식 스킬 모음. Claude Code, Codex CLI, OpenCode, OpenClaw 등 모든 에이전트와 호환."
author: "큐레이터"
readTime: "5분"
image: null
---

## 소개

Obsidian은 개인 지식 관리의 강자로, 수백만 명이 노트를 연결하고 생각을 정리하는 데 사용합니다. 하지만 AI 코딩 에이전트가 Obsidian 볼트를 올바르게 다루려면 특수한 문법과 기능을 이해해야 합니다 — 위키링크, 임베드, 콜아웃, Bases, JSON Canvas 등이 그것입니다.

**obsidian-skills**는 Obsidian 제작자 Kepano가 직접 만든 에이전트 스킬 모음입니다. GitHub Stars 22,500개를 돌파한 이 저장소는 [Agent Skills 명세](https://agentskills.io/specification)를 따르므로 Claude Code, Codex CLI, OpenCode, OpenClaw 등 모든 스킬 호환 에이전트에서 사용할 수 있습니다. MIT 라이선스로 자유롭게 활용 가능합니다.

---

## 주요 기능

| 스킬 | 설명 |
|------|------|
| `obsidian-markdown` | Obsidian Flavored Markdown 작성·편집 (위키링크, 임베드, 콜아웃, Properties) |
| `obsidian-bases` | Obsidian Bases(.base) 파일 생성·편집 (뷰, 필터, 공식, 요약) |
| `json-canvas` | JSON Canvas(.canvas) 파일 작성 (노드, 엣지, 그룹, 연결) |
| `obsidian-cli` | Obsidian CLI로 볼트 제어, 플러그인·테마 개발 지원 |
| `defuddle` | 웹 페이지에서 Defuddle로 깨끗한 마크다운 추출 (토큰 절약) |

에이전트는 이 스킬들로 일반 마크다운 파일과 구분되는 Obsidian 전용 문법을 정확히 생성·수정할 수 있고, 볼트 구조를 이해하고 탐색할 수 있으며, 웹 콘텐츠를 깔끔한 노트로 변환할 수 있습니다.

---

## 핵심 기능 1: obsidian-markdown 스킬

Obsidian의 고유 문법은 표준 마크다운과 미묘하게 다릅니다. 이 스킬은 에이전트에게 다음을 가르칩니다:

```markdown
# 위키링크
[[노트 이름]]
[[노트 이름|표시 텍스트]]

# 임베드
![[파일.png]]
![[다른노트#섹션]]

# 콜아웃
> [!info] 정보
> 내용입니다.

> [!warning] 주의
> 경고 내용입니다.

# Properties (YAML 프론트매터)
---
tags: [AI, 노트]
date: 2026-04-11
aliases: [별명]
---
```

표준 마크다운 파서는 이런 문법을 올바르게 처리하지 못하지만, obsidian-markdown 스킬을 갖춘 에이전트는 Obsidian 볼트에서 의도한 대로 동작하는 노트를 정확하게 생성합니다.

---

## 핵심 기능 2: Defuddle로 웹 콘텐츠 노트화

`defuddle` 스킬은 에이전트가 웹 페이지를 Obsidian 노트로 변환할 때 토큰을 절약합니다.

웹 페이지에는 내비게이션 메뉴, 광고, 사이드바, 푸터 등 실제 내용과 무관한 HTML이 넘칩니다. Defuddle은 이런 노이즈를 제거하고 핵심 텍스트만 깔끔한 마크다운으로 추출합니다.

활용 시나리오:
- "이 URL의 내용을 Obsidian 노트로 저장해줘" → Defuddle로 정제 후 위키링크·태그를 붙여 볼트에 저장
- 여러 웹 페이지를 리서치하면서 노트를 자동 생성
- `.md` URL은 Defuddle을 건너뛰고 직접 처리 (최근 업데이트 반영)

---

## 기술 스택 및 아키텍처

```
obsidian-skills/
├── skills/
│   ├── obsidian-markdown/   SKILL.md
│   ├── obsidian-bases/      SKILL.md
│   ├── json-canvas/         SKILL.md
│   ├── obsidian-cli/        SKILL.md
│   └── defuddle/            SKILL.md
├── .claude-plugin/          Claude 플러그인 설정
├── LICENSE
└── README.md
```

- **라이선스**: MIT
- **명세**: [Agent Skills Specification](https://agentskills.io/specification)
- **호환**: Claude Code, Codex CLI, OpenCode, OpenClaw 등

---

## 설치 및 사용법

### 마켓플레이스 (Claude Code)

```
/plugin marketplace add kepano/obsidian-skills
/plugin install obsidian@obsidian-skills
```

### npx로 설치

```bash
npx skills add git@github.com:kepano/obsidian-skills.git
```

### Claude Code 수동 설치

Obsidian 볼트(또는 Claude Code 작업 폴더) 루트의 `/.claude` 폴더에 저장소 내용을 추가합니다.

### Codex CLI 수동 설치

`skills/` 디렉터리를 Codex 스킬 경로(보통 `~/.codex/skills`)에 복사합니다.

### OpenCode 수동 설치

```bash
git clone https://github.com/kepano/obsidian-skills.git ~/.opencode/skills/obsidian-skills
```

전체 저장소를 클론해야 하며, 내부 `skills/` 폴더만 복사하면 안 됩니다. OpenCode는 `~/.opencode/skills/` 아래의 모든 `SKILL.md`를 자동 검색합니다.

### 사용 예시 (Claude에게 자연어로)

```
"내 볼트에 오늘 읽은 논문 요약 노트 만들어줘"
"이 URL 내용을 Obsidian 노트로 변환해서 [[AI]] 태그 붙여줘"
"daily notes 폴더에 오늘 날짜 노트 생성하고 템플릿 채워줘"
```

---

## 마치며

obsidian-skills는 AI 에이전트와 Obsidian의 격차를 메우는 실용적인 브리지입니다. Obsidian 제작자가 직접 만들고 관리하기 때문에 Obsidian의 기능 업데이트를 빠르게 반영하며, Agent Skills 표준 명세를 따르므로 특정 에이전트에 종속되지 않습니다.

Obsidian을 지식 베이스로 사용하면서 AI 에이전트를 워크플로우에 통합하고 싶다면, 이 스킬 모음은 필수 설치 목록에 들어갑니다.

- GitHub: [kepano/obsidian-skills](https://github.com/kepano/obsidian-skills)
- 라이선스: MIT
- Stars: 22.5k+
