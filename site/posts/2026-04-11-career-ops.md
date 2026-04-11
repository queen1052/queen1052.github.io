---
title: "Career-Ops: Claude Code 기반 AI 취업 탐색 시스템 — 740개 공고, 100개 맞춤 이력서, 드림 잡 착지"
date: "2026-04-11"
category: "AI 도구"
tags: ["취업", "Claude Code", "이력서", "ATS", "채용 자동화", "Go TUI"]
excerpt: "AI 기반 취업 파이프라인. A-F 스코어링, ATS 최적화 PDF 이력서 생성, Playwright 포탈 스캐너, 병렬 배치 처리, Go TUI 대시보드를 갖춘 14개 스킬 모드 시스템으로 740+ 공고를 효율적으로 처리한다."
author: "큐레이터"
readTime: "7분"
image: null
---

## 소개: 취업 탐색을 AI 에이전트에게 맡기다

"740개 채용 공고 평가, 100개 맞춤 이력서, 그리고 드림 잡 한 개." — Career-Ops README에 적힌 실제 사용 결과다.

**Career-Ops**는 santifer(Santiago Fernández)가 개발한 Claude Code 기반 AI 취업 탐색 시스템이다. GitHub **29.8k stars**, 28명의 기여자, MIT 라이선스로 공개되어 있다. v1.3.0 기준 14개 스킬 모드, 45개 이상 기업 포털 사전 설정, Go TUI 대시보드를 갖춘 성숙한 시스템이다.

핵심 철학은 '스프레이앤프레이(무차별 지원)'가 아니라 '필터'다. 수백 개의 공고 중 진짜 지원할 가치 있는 소수를 찾아내는 것이 목표이며, 4.0/5 이하 스코어의 공고는 강하게 비추천한다.

## 주요 기능: 6블록 평가부터 배치 처리까지

**자동 파이프라인**이 핵심이다. Job URL 하나를 붙여넣으면 전체 평가 + PDF + 트래커 등록이 자동으로 실행된다. 6블록 평가 시스템이 역할 요약, CV 매칭, 레벨 전략, 보상 리서치, 개인화, 인터뷰 준비(STAR+Reflection)를 순서대로 분석한다.

**A-F 스코어링**은 10개의 가중치 차원으로 공고를 평가한다. 기술 스택 매칭, 경력 레벨 적합성, 보상 수준, 원격 근무 옵션, 회사 재무 건전성 등을 종합적으로 고려한다. 스코어가 4.0/5 이하면 AI가 명시적으로 지원을 권고하지 않는다.

**ATS PDF 이력서 생성**은 직업 설명서에 맞춰 키워드를 자동 삽입한 PDF를 생성한다. Space Grotesk + DM Sans 폰트를 사용한 깔끔한 디자인이며, Playwright/Puppeteer로 HTML 템플릿을 PDF로 렌더링한다.

**인터뷰 スтори 뱅크**는 평가할 때마다 축적된다. STAR+Reflection 프레임워크로 5~10개의 마스터 스토리를 관리하며, 어떤 행동 면접 질문도 답변할 수 있는 범용 스토리를 준비한다.

**협상 스크립트**도 포함된다. 연봉 협상 프레임워크, 지리적 할인 반박, 경쟁 오퍼 레버리지 방법을 AI가 맞춤 제공한다.

## 포탈 스캐너와 배치 처리

**포탈 스캐너**는 45개 이상의 기업이 사전 설정되어 있다. Anthropic, OpenAI, ElevenLabs, Retool, n8n 같은 AI 회사부터 Salesforce, Twilio 같은 대기업까지 커버한다. AI Labs, Voice AI, AI 플랫폼, 컨택 센터, 엔터프라이즈, LLMOps, 자동화, 유럽 스타트업 카테고리로 분류된다.

검색되는 잡보드는 Ashby, Greenhouse, Lever, Wellfound, Workable, RemoteFront이고, 19개의 검색 쿼리가 미리 설정되어 있다. `templates/portals.example.yml`을 복사해 원하는 기업을 추가할 수 있다.

**배치 처리**는 `claude -p` 워커를 사용한 병렬 평가를 지원한다. 여러 공고를 동시에 처리하며, TSV 파일로 결과를 추적한다. `batch-runner.sh`가 오케스트레이터 역할을 해 여러 `batch-prompt.md` 워커를 병렬로 실행한다.

```
# 워크플로우 흐름
URL 붙여넣기 또는 /career-ops 실행
        │
        ▼
Archetype Detection (LLMOps/Agentic/PM/SA/FDE/Transformation 분류)
        │
        ▼
A-F 평가 (cv.md 읽어 매칭 분석)
        │
        ▼
Report(.md) + PDF(.pdf) + Tracker(.tsv) 동시 생성
```

## 14개 스킬 모드 시스템

Claude Code에서 `/career-ops` 명령어로 14개 모드를 실행한다:

- `/career-ops {JD 붙여넣기}` → 전체 자동 파이프라인
- `/career-ops scan` → 포탈에서 새 공고 스캔
- `/career-ops pdf` → ATS 최적화 이력서 생성
- `/career-ops batch` → 여러 공고 병렬 평가
- `/career-ops tracker` → 지원 현황 조회
- `/career-ops apply` → AI로 지원서 양식 작성
- `/career-ops contacto` → LinkedIn 아웃리치 메시지
- `/career-ops deep` → 심층 기업 리서치
- `/career-ops training` → 강좌/자격증 평가
- `/career-ops project` → 포트폴리오 프로젝트 평가

Job URL이나 JD를 직접 붙여넣으면 Career-Ops가 자동 감지해 전체 파이프라인을 실행한다. **Human-in-the-Loop** 원칙을 지켜 AI는 평가와 추천만 하고 실제 지원은 항상 사람이 최종 결정한다. 시스템은 절대 자동으로 지원서를 제출하지 않는다.

## Go TUI 대시보드

터미널 기반 파이프라인 뷰어를 직접 빌드해 사용한다:

```bash
cd dashboard
go build -o career-dashboard .
./career-dashboard --path ..
```

6개 필터 탭, 4개 정렬 모드, 그룹/플랫 뷰, 지연 로드 미리보기, 인라인 상태 변경을 지원한다. Bubble Tea + Lipgloss 라이브러리로 Catppuccin Mocha 테마를 사용하는 세련된 TUI다. 수십 개의 평가 결과를 한눈에 보고 비교할 수 있다.

## 기술 스택 및 설치

**기술 스택**: Claude Code(에이전트), Node.js(런타임), Playwright/Puppeteer(PDF 생성, 포털 스캔), Go + Bubble Tea + Lipgloss(TUI), 마크다운 테이블 + YAML + TSV(데이터).

**시스템은 자기 자신을 커스터마이즈할 수 있도록 설계**되었다. Claude가 자신이 사용하는 모드 파일을 읽고 수정할 수 있어, "아키타입을 백엔드 엔지니어링 역할로 변경해줘", "모드를 영어로 번역해줘" 같은 요청으로 시스템 자체를 개인화할 수 있다.

```bash
# 설치
git clone https://github.com/santifer/career-ops.git
cd career-ops && npm install
npx playwright install chromium

# 설정 확인
npm run doctor

# 프로필 설정
cp config/profile.example.yml config/profile.yml
# profile.yml 편집 (이름, 스킬, 선호도 등)

cp templates/portals.example.yml portals.yml
# 원하는 기업 추가

# CV 작성
# cv.md 파일을 프로젝트 루트에 마크다운 형식으로 작성

# Claude Code 실행
claude  # 이 디렉토리에서 실행
# 그 다음: "내 CV에 맞게 시스템을 설정해줘"
```

## 마치며

Career-Ops는 취업 탐색의 패러다임을 바꾸는 도구다. 스프레이앤프레이가 아닌 데이터 기반 선택적 지원 전략을 채용한다. 740개 공고를 AI가 평가해 진짜 지원할 가치 있는 것만 골라내고, 각 공고에 최적화된 이력서와 인터뷰 스토리를 준비한다.

6개 언어(영어, 한국어, 스페인어, 일본어, 포르투갈어, 러시아어) README를 지원하는 국제적인 프로젝트다. 한국어 README도 있어(`README.ko-KR.md`) 국내 사용자에게 친숙하다. 개인의 취업 활동에서 AI를 전략적으로 활용하고 싶다면, Career-Ops는 강력한 출발점이 될 것이다.

- GitHub: [santifer/career-ops](https://github.com/santifer/career-ops)
