---
title: "TaskNotes: 각 태스크가 마크다운 노트인 Obsidian용 태스크 관리 플러그인"
date: "2026-04-11"
category: "생산성 도구"
tags: ["Obsidian", "태스크관리", "플러그인", "PKM", "오픈소스"]
excerpt: "각 태스크를 독립적인 마크다운 파일로 저장하고 Obsidian Bases로 쿼리하는 혁신적인 태스크 관리 플러그인으로, 1.6k 스타를 보유합니다."
author: "큐레이터"
readTime: "7분"
image: null
---

## TaskNotes란?

**TaskNotes**는 각 태스크가 YAML 프론트매터를 가진 별도 마크다운 노트이며, 모든 뷰가 Obsidian Bases 쿼리로 구동되는 혁신적인 태스크 관리 플러그인입니다. GitHub에서 1,600개 이상의 스타를 받았으며 TypeScript 93.4%로 구현되고 MIT 라이선스로 공개되어 있습니다.

핵심 철학은 **데이터 이동성**입니다. 태스크는 플러그인 전용 데이터베이스가 아닌 순수 마크다운 파일에 YAML로 저장되므로, 어떤 도구로도 읽고 스크립트로 변환하거나 다른 곳으로 마이그레이션할 수 있습니다.

[Obsidian Bases](https://help.obsidian.md/bases)는 노트를 데이터베이스처럼 활용하는 Obsidian 내장 플러그인으로, 노트 프로퍼티를 필터·정렬·그룹화할 수 있습니다. TaskNotes의 태스크 목록, 칸반, 캘린더, 아젠다 뷰는 모두 `.base` 파일입니다.

## 주요 기능

TaskNotes가 제공하는 핵심 기능들을 살펴보겠습니다.

**자연어 파싱**: "내일 #업무 장보기"라고 입력하면 마감일과 컨텍스트가 자동으로 추출됩니다. 영어, 독일어, 스페인어, 프랑스어, 일본어, 한국어 등 12개 언어의 자연어 파싱을 지원합니다.

**다양한 뷰**: 태스크 목록, 칸반 보드, 캘린더, 미니 캘린더, 아젠다의 5가지 뷰를 제공합니다. 모두 `.base` 파일로 커스터마이징 가능합니다.

**시간 추적**: 태스크별 시작/종료 타이머, 뽀모도로 타이머, 세션 이력을 지원합니다.

**반복 태스크**: RRULE 형식으로 복잡한 반복 패턴을 정의하고 인스턴스별 완료 추적을 합니다.

**캘린더 동기화**: Google 및 Microsoft 캘린더(OAuth), ICS 피드와 동기화합니다.

**의존성 관리**: 태스크 간 의존성을 정의하고 추적합니다.

## Obsidian Bases 통합

TaskNotes의 가장 독특한 측면은 **Bases와의 깊은 통합**입니다.

태스크 노트의 YAML 프론트매터:
```yaml
title: "문서 완성"
status: "in-progress"
due: "2026-04-20"
priority: "high"
contexts: ["work"]
projects: ["[[웹사이트 리디자인]]"]
timeEstimate: 120
timeEntries:
  - startTime: "2026-04-15T10:30:00Z"
    endTime: "2026-04-15T11:15:00Z"
```

Bases 내장 수식 프로퍼티:
```
daysUntilDue: if(due, ((number(date(due)) - number(today())) / 86400000).floor(), null)
isOverdue: due && date(due) < today() && status != "done"
urgencyScore: formula.priorityWeight + max(0, 10 - formula.daysUntilDue)
efficiencyRatio: (timeTracked / timeEstimate * 100).round()
```

`urgencyScore`로 정렬하거나 `isOverdue` 태스크만 필터링하는 것이 코드 없이 Bases UI에서 바로 가능합니다. `.base` 파일은 평문이므로 직접 편집하거나 복제해서 새 뷰를 만들 수 있습니다.

## 기술 스택

```
TypeScript 93.4% (Obsidian 플러그인 SDK)
CSS 5.1% (스타일링)
JavaScript 1.5% (빌드 스크립트)

테스트: Jest + Playwright (E2E)
캘린더: FullCalendar.io
날짜 파싱: chrono-node (다국어)
반복 패턴: RRULE
국제화: i18n (9개 UI 언어, 12개 NLP 언어)
```

**통합**: HTTP API, 브라우저 확장([tasknotes-browser-extension](https://github.com/callumalpass/tasknotes-browser-extension)), CLI([tasknotes-cli](https://github.com/callumalpass/tasknotes-cli)), 웹훅으로 외부 서비스에 태스크 변경 알림.

## 설치 및 사용법

**Obsidian Community Plugins에서 설치**:
1. Obsidian 설정 → 커뮤니티 플러그인 → "TaskNotes" 검색
2. 설치 후 활성화

**첫 번째 태스크 생성**:
```
명령 팔레트(Ctrl+P) → "TaskNotes: Create new task"
→ "내일 오전 회의 준비 #업무" 입력
→ 자동으로 due: tomorrow, contexts: ["업무"] 설정
```

**태스크 구조 예시**:
```markdown
---
title: "회의 자료 준비"
status: "todo"
due: "2026-04-12"
priority: "high"
contexts: ["work"]
projects: ["[[Q2 리뷰]]"]
timeEstimate: 90
recurrence: null
---

## 메모
- 슬라이드 15장 필요
- 전 분기 데이터 포함
```

**반복 태스크 (매주 월요일)**:
```yaml
recurrence: "FREQ=WEEKLY;BYDAY=MO"
complete_instances: ["2026-04-07", "2026-04-14"]
```

**모든 프로퍼티 이름 변경 가능**: `due` 대신 `deadline`을 이미 사용 중이라면 설정에서 매핑만 변경하면 됩니다.

## 마치며

TaskNotes는 "태스크 관리와 노트를 분리해야 하나?"라는 고민에 명쾌한 답을 줍니다. 태스크 자체가 노트이므로 맥락 정보를 무한히 추가할 수 있고, Bases의 강력한 쿼리 능력 덕분에 복잡한 필터링·그룹화도 코드 없이 가능합니다. 무엇보다 데이터가 순수 마크다운이므로 플러그인에 종속되지 않는다는 철학은 장기적으로 데이터를 보호합니다. Obsidian 사용자라면 반드시 시도해볼 만한 게임 체인저입니다.
