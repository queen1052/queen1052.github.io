---
title: "GEO-SEO Claude: AI 검색 시대를 위한 GEO 최적화 도구"
date: "2026-04-11"
category: "SEO/GEO"
tags: ["GEO", "SEO", "Claude Code", "AI 검색", "ChatGPT", "Perplexity"]
excerpt: "ChatGPT, Claude, Perplexity, Gemini 등 AI 검색 엔진에 최적화된 GEO-first SEO 스킬. 인용성 점수화, AI 크롤러 분석, llms.txt 생성, PDF 리포트. 5.1k 스타."
author: "큐레이터"
readTime: "7분"
image: null
---

## 소개

GEO-SEO Claude는 AI 검색 엔진(ChatGPT, Claude, Perplexity, Gemini, Google AI Overviews)에 최적화하면서 전통적인 SEO 기반을 유지하는 Claude Code 스킬입니다. "AI 검색이 전통적 검색을 잠식하고 있다. 이 도구는 트래픽이 향하는 곳, 과거가 아닌 미래를 위한 최적화다."

GitHub에서 5.1k 스타를 획득한 이 프로젝트는 Python 74.2%, Shell 15.7%, HTML 10.1%로 구성되어 있으며 MIT 라이선스로 배포됩니다. 8명의 기여자가 개발하고 있으며, GEO 서비스 시장은 현재 8억 5천만 달러에서 2031년 73억 달러로 성장이 예상됩니다.

## GEO가 중요한 이유 (2026년)

| 지표 | 수치 |
|------|------|
| GEO 서비스 시장 | 8억 5천만 달러+ (2031년 73억 달러 예상) |
| AI 유입 트래픽 증가율 | 전년 대비 +527% |
| AI 트래픽 전환율 vs 오가닉 | 4.4배 높음 |
| Gartner: 2028년 검색 트래픽 감소 예측 | -50% |
| AI에서 브랜드 언급 vs 백링크 상관관계 | 3배 더 강함 |
| GEO에 투자하는 마케터 비율 | 단 23% |

전통적 SEO에서 백링크가 핵심이었다면, AI 검색에서는 브랜드 언급이 3배 더 강한 상관관계를 갖습니다. 지금이 선점 기회입니다.

## 주요 기능

**인용성 점수화(Citability Scoring):** AI가 콘텐츠를 인용하기 적합한지 분석합니다. AI가 인용하기 최적인 패시지는 134-167 단어이며, 자기완결적이고, 사실이 풍부하며, 질문에 직접 답합니다.

**AI 크롤러 분석:** GPTBot, ClaudeBot, PerplexityBot 등 14+ AI 크롤러에 대한 robots.txt를 확인하고 구체적인 허용/차단 권장 사항을 제공합니다.

**브랜드 언급 스캔:** YouTube, Reddit, Wikipedia, LinkedIn, 7+ 기타 플랫폼에서 브랜드 언급을 스캔합니다.

**플랫폼별 최적화:** 같은 쿼리에서 ChatGPT와 Google AI Overviews 둘 다 인용하는 도메인은 11%에 불과합니다. 플랫폼마다 맞춤 권장 사항을 제공합니다.

**llms.txt 생성:** AI 크롤러가 사이트 구조를 이해할 수 있게 해주는 llms.txt 표준 파일을 생성합니다.

**클라이언트용 보고서:** 마크다운 또는 PDF 형식의 전문적인 GEO 보고서를 생성합니다. PDF 보고서에는 점수 게이지, 막대 차트, 플랫폼 준비도 시각화, 색상 코딩 테이블, 우선순위 액션 플랜이 포함됩니다.

## 완전 감사 플로우

`/geo audit https://example.com` 실행 시:

1. **Discovery** — 홈페이지 가져오기, 비즈니스 유형 감지, 사이트맵 크롤링
2. **병렬 분석** — 5개 서브에이전트 동시 실행:
   - AI 가시성 (인용성, 크롤러, llms.txt, 브랜드 언급)
   - 플랫폼 분석 (ChatGPT, Perplexity, Google AIO 준비도)
   - 기술 SEO (Core Web Vitals, SSR, 보안, 모바일)
   - 콘텐츠 품질 (E-E-A-T, 가독성, 신선도)
   - 스키마 마크업 (탐지, 검증, 생성)
3. **합성** — 점수 집계, 복합 GEO 점수 생성 (0-100)
4. **보고서** — 빠른 승리 포함 우선순위 액션 플랜 출력

**점수 방법론:**
- AI 인용성 & 가시성: 25%
- 브랜드 권위 신호: 20%
- 콘텐츠 품질 & E-E-A-T: 20%
- 기술 기반: 15%
- 구조화 데이터: 10%
- 플랫폼 최적화: 10%

## 아키텍처: 13개 서브스킬

```
geo-seo-claude/
├── geo/                    # 메인 스킬 오케스트레이터
├── skills/                 # 13개 특화 서브스킬
│   ├── geo-audit/          # 전체 감사 오케스트레이션 & 점수화
│   ├── geo-citability/     # AI 인용 준비도 점수화
│   ├── geo-crawlers/       # AI 크롤러 접근 분석
│   ├── geo-llmstxt/        # llms.txt 표준 분석 & 생성
│   ├── geo-brand-mentions/ # AI 인용 플랫폼 브랜드 존재감
│   ├── geo-platform-optimizer/ # 플랫폼별 AI 검색 최적화
│   ├── geo-schema/         # 구조화 데이터 생성
│   ├── geo-technical/      # 기술 SEO 기반
│   ├── geo-content/        # 콘텐츠 품질 & E-E-A-T
│   ├── geo-report/         # 클라이언트용 마크다운 보고서
│   ├── geo-report-pdf/     # 전문 PDF 보고서 (ReportLab)
│   ├── geo-prospect/       # CRM-lite 잠재고객 파이프라인
│   ├── geo-proposal/       # 자동 클라이언트 제안서 생성
│   └── geo-compare/        # 월간 델타 추적 & 진행 보고서
└── agents/                 # 5개 병렬 서브에이전트
```

## 설치 및 사용법

```bash
# macOS/Linux - 원클릭 설치
curl -fsSL \
  https://raw.githubusercontent.com/zubair-trabzada/geo-seo-claude/main/install.sh | bash

# 수동 설치
git clone https://github.com/zubair-trabzada/geo-seo-claude.git
cd geo-seo-claude
./install.sh

# Windows (Git Bash)
./install-win.sh

# 제거
./uninstall.sh
```

**요구 사항:** Python 3.8+, Claude Code CLI, Git, 선택사항: Playwright(스크린샷)

**주요 명령어:**
```
/geo audit <url>      # 전체 GEO + SEO 감사 (병렬 서브에이전트)
/geo quick <url>      # 60초 GEO 가시성 스냅샷
/geo citability <url> # AI 인용 준비도 점수화
/geo crawlers <url>   # AI 크롤러 접근 확인
/geo llmstxt <url>    # llms.txt 분석 또는 생성
/geo brands <url>     # AI 인용 플랫폼 브랜드 언급 스캔
/geo report <url>     # 클라이언트용 GEO 보고서 생성
/geo report-pdf       # 차트 포함 전문 PDF 보고서
/geo prospect <domain> # 잠재고객 파이프라인 관리
/geo proposal <domain> # 클라이언트 제안서 자동 생성
```

## 마치며

GEO-SEO Claude는 AI 검색 시대의 새로운 SEO 패러다임을 실현하는 도구입니다. 전통적인 검색 최적화가 백링크와 키워드 밀도에 집중했다면, AI 검색 최적화는 브랜드 권위, 인용 가능성, 구조화된 정보에 집중합니다.

도구 자체는 무료이며, GEO 에이전시는 월 2,000-12,000달러를 청구합니다. 단 23%의 마케터만 GEO에 투자하는 지금이 선점 기회입니다. AI 검색이 오가닉 트래픽보다 4.4배 높은 전환율을 보이는 추세에서, 이 도구는 미래를 준비하는 강력한 출발점입니다.
