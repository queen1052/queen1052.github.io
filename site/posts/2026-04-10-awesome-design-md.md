---
title: "awesome-design-md: 100개 인기 사이트의 DESIGN.md 컬렉션"
date: "2026-04-10"
category: "디자인"
tags: ["design-system", "AI", "DESIGN.md", "branding", "frontend"]
excerpt: "VoltAgent의 awesome-design-md — Stripe, Linear, Vercel 등 100개 이상 인기 사이트의 DESIGN.md를 모은 컬렉션. AI에게 정확한 디자인 언어를 주입하는 새로운 표준."
author: "큐레이터"
readTime: "6분"
image: null
---

## 소개

awesome-design-md는 VoltAgent 팀이 공개한 **DESIGN.md 파일 컬렉션**입니다. [getdesign.md](https://getdesign.md)에서 다운로드할 수 있으며, Stripe, Linear, Vercel, Notion, GitHub, Figma 등 100개 이상의 인기 웹사이트와 앱의 디자인 시스템을 `DESIGN.md` 형식으로 문서화한 컬렉션입니다.

DESIGN.md는 VoltAgent가 제안한 새로운 컨벤션입니다. `README.md`가 코드를 설명하듯, `DESIGN.md`는 프로젝트의 시각적 언어를 정의합니다. AI 에이전트가 UI를 생성할 때 `DESIGN.md`를 참조하면 해당 브랜드의 디자인 언어와 일치하는 코드를 만들 수 있습니다.

각 DESIGN.md는 9개의 표준화된 섹션으로 구성됩니다: Visual Theme(비주얼 테마), Color Palette(색상 팔레트), Typography(타이포그래피), Components(컴포넌트), Layout(레이아웃), Depth(깊이/그림자), Do's & Don'ts(해야 할 것/하지 말아야 할 것), Responsive Design(반응형), Agent Prompt(에이전트 프롬프트). 마지막 섹션인 Agent Prompt가 특히 독특합니다 — AI가 이 브랜드 스타일로 작업할 때 참고할 구체적인 지침을 포함합니다.

## 주요 기능

- **100개+ 인기 사이트 DESIGN.md**: Stripe, Linear, Vercel, Notion, GitHub, Figma, Discord, Slack, Shopify 등 개발자와 디자이너가 자주 참조하는 브랜드의 디자인 언어를 문서화합니다.
- **9개 섹션 표준 포맷**: 모든 DESIGN.md가 동일한 구조를 따르므로 AI가 일관되게 파싱하고 활용할 수 있습니다.
- **Agent Prompt 섹션**: AI 에이전트가 해당 브랜드 스타일로 작업할 때 특별히 주의해야 할 지침과 스타일 규칙을 직접 기록합니다.
- **Do's & Don'ts**: 해당 브랜드에서 해야 하는 것과 하지 말아야 하는 것을 명시합니다. "Stripe = 과도한 애니메이션 금지", "Linear = 모든 요소에 sharp corners 금지"처럼 구체적입니다.
- **인프라/클라우드 카테고리**: AWS, Vercel, Cloudflare 등 인프라 서비스의 디자인 언어도 포함됩니다. 대시보드 UI를 만들 때 해당 플랫폼 스타일로 만드는 데 유용합니다.
- **getdesign.md 다운로드**: 웹사이트에서 원하는 브랜드의 DESIGN.md를 검색하고 다운로드합니다. CLI 도구도 지원합니다.

### DESIGN.md 표준 포맷 — 9개 섹션

```markdown
# DESIGN.md — Stripe

## 1. Visual Theme
청결하고 신뢰감 있는 금융 인터페이스.
색상 수를 최소화하고 공백을 적극 활용한다.
텍스트 위계가 최우선이다.

## 2. Color Palette
- Primary: #635BFF (Slate Purple)
- Background: #FFFFFF
- Surface: #F6F8FA
- Text: #0A2540
- ...

## 3. Typography (중략)

## 4. Components
- 버튼: 모서리 반지름 4px (subtle rounding)
- 카드: 얇은 1px 테두리, 흰 배경, 미묘한 그림자
- 폼: 라벨은 항상 위, 인라인 검증 메시지

## 5-6. Layout & Depth (중략)

## 7. Do's & Don'ts
DO:
- 많은 공백 사용
- 애니메이션은 기능적 목적으로만
- 데이터 중심 레이아웃

DON'T:
- 과도한 색상 사용
- 불필요한 장식 요소
- 버튼에 그라디언트

## 8. Responsive Design (중략)

## 9. Agent Prompt
이 사이트와 유사한 UI를 만들 때:
"미니멀리즘을 최우선으로. 여백이 디자인의 일부다.
보라색(#635BFF)은 CTA 요소에만 사용.
모든 텍스트는 정렬이 명확해야 한다."
```

### AI 기반 브랜드 일치 UI 생성

```bash
# DESIGN.md Claude에 주입해 UI 생성
claude \
  --context "$(cat stripe-DESIGN.md)" \
  "결제 폼 컴포넌트를 만들어줘"
```

이제 Claude는 Stripe의 디자인 언어(색상, 공백, 보수적인 애니메이션, 4px 모서리)를 정확히 알고 Stripe답게 코드를 작성합니다.

## 기술 스택 / 아키텍처

| 항목 | 내용 |
|------|------|
| 포맷 | Markdown (DESIGN.md) |
| 카테고리 | 인프라/클라우드, SaaS, 디자인 도구, 금융 등 |
| 브랜드 수 | 100개+ |
| 다운로드 | getdesign.md |
| 개발사 | VoltAgent |
| 라이선스 | MIT |

## 설치 / 사용법

```bash
# 저장소 클론
git clone https://github.com/VoltAgent/awesome-design-md
cd awesome-design-md

# getdesign.md CLI 설치
npm install -g getdesign.md

# 특정 브랜드 DESIGN.md 다운로드
getdesign stripe --output ./DESIGN.md
getdesign linear --output ./DESIGN.md

# 프로젝트에 직접 복사
cp designs/stripe/DESIGN.md /my-project/DESIGN.md
cp designs/linear/DESIGN.md /my-project/DESIGN.md

# Claude Code에서 참조
# 프로젝트 루트에 DESIGN.md 배치만 하면
# Claude가 자동으로 참조해 디자인 일관성 유지
```

## 활용 사례 / 사용 시나리오

1. **클라이언트 프로젝트 스타일 가이드**: 고객사가 "Stripe처럼 만들어주세요"라고 할 때, Stripe DESIGN.md를 `CLAUDE.md`에 포함하거나 직접 컨텍스트로 제공합니다. AI가 정확히 Stripe 스타일로 코드를 생성합니다.

2. **디자인 시스템 구축 참고**: 새 프로덕트의 디자인 시스템을 만들 때, 유사한 브랜드 2-3개의 DESIGN.md를 참조해 기반을 설계합니다. "Linear + Vercel의 미니멀함 + Notion의 친근함"처럼 조합합니다.

3. **팀 AI 디자인 표준화**: 팀의 자체 DESIGN.md를 작성해 프로젝트 루트에 커밋합니다. 모든 팀원의 AI 어시스턴트가 동일한 브랜드 지침을 따르므로 디자인 일관성이 자동으로 유지됩니다.

## 결론

awesome-design-md와 DESIGN.md 컨벤션은 AI 시대의 새로운 디자인 문서 표준을 제안합니다. README.md가 코드에 필수가 된 것처럼, DESIGN.md가 AI 보조 개발에서 시각적 일관성의 기반이 될 가능성이 있습니다. VoltAgent의 큐레이션된 100개+ 컬렉션이 이 컨벤션의 즉각적인 활용을 가능하게 합니다. 브랜드 일치 UI 생성이 필요한 모든 팀에게 즉시 가치 있는 도구입니다.

---

> 원문: https://github.com/VoltAgent/awesome-design-md
