---
title: "SEO Machine: Claude Code로 구동되는 장문 SEO 콘텐츠 자동화 워크플로우"
date: "2026-04-11"
category: "AI 도구"
tags: ["SEO", "콘텐츠 마케팅", "Claude Code", "WordPress", "마케팅 자동화"]
excerpt: "Castos 팟캐스트 SaaS에서 실전 검증된 SEO 콘텐츠 생성 시스템. 키워드 리서치부터 WordPress 발행까지 원스톱. 10개 전문 에이전트, 26개 마케팅 스킬, GA4/GSC/DataForSEO 통합."
author: "큐레이터"
readTime: "8분"
image: null
---

## 소개: 팟캐스트 SaaS의 SEO 팀이 오픈소스로 공개한 것

Castos라는 팟캐스트 호스팅 SaaS가 있다. 이 팀은 Claude Code를 활용해 장문 SEO 콘텐츠를 생성하는 워크플로우를 자체 개발했고, 그 결과물을 오픈소스로 공개했다. 그게 **SEO Machine**이다.

GitHub 스타 5,600개, Python 99.1%, MIT 라이선스. 단순한 글쓰기 도구가 아니라 완전한 **SEO 콘텐츠 생성 워크스테이션**이다. 경쟁사 분석, 키워드 리서치, 실제 콘텐츠 작성, SEO 최적화, 성과 분석, WordPress 자동 발행까지 하나의 Claude Code 워크스페이스에서 처리한다.

`examples/castos/` 폴더에 실제 SaaS 회사가 모든 컨텍스트 파일을 채운 완전한 실사례가 포함되어 있다. 아이디어에 그치지 않고, 실제 작동하는 시스템이다.

## 주요 기능

**커스텀 명령어 체계**: `/research`, `/write`, `/rewrite`, `/analyze-existing`, `/optimize`, `/performance-review`, `/publish-draft`, `/article`, `/priorities` 등의 워크플로우 명령어와 랜딩 페이지 전용 명령어 세트.

**10개 전문 에이전트**: 콘텐츠 분석기, SEO 최적화 에이전트, 메타 생성 에이전트, 내부 링크 에이전트, 키워드 매퍼, 편집자, 성과 분석 에이전트, 헤드라인 생성기, CRO 분석가, 랜딩 페이지 최적화 에이전트.

**26개 마케팅 스킬**: 카피라이팅, CRO, A/B 테스트, 이메일 시퀀스, 가격 전략, 론칭 전략, 프로그래매틱 SEO, 경쟁사 대안 분석까지.

**5개 고급 SEO 분석 모듈**: 검색 의도 분류기, 키워드 밀도 분석기, SEO 품질 평가기, 콘텐츠 길이 비교기(SERP 경쟁사 대비), 가독성 평가기.

**3개 데이터 소스 통합**: Google Analytics 4, Google Search Console, DataForSEO.

## 10개 전문 에이전트 심층 분석

### 콘텐츠 분석기 (신기능)

5개 전문 모듈을 조합해 포괄적인 데이터 기반 콘텐츠 분석을 수행한다:

- **검색 의도 분류**: 정보성/탐색성/거래성/상업적 의도 판별
- **키워드 밀도 분석**: 키워드 클러스터링, 섹션별 분포 히트맵, 키워드 스터핑 위험 감지
- **콘텐츠 길이 비교**: SERP 상위 10-20개 경쟁사 단어 수 집계, 중앙값/75th 퍼센타일/최적 길이 제시
- **가독성 평가**: Flesch Reading Ease, Flesch-Kincaid Grade Level, 수동태 비율, 복잡한 단어 식별
- **SEO 품질 평가**: 0-100점 종합 점수, 카테고리별 세분화(콘텐츠/키워드/메타/구조/링크/가독성)

### SEO 최적화 에이전트

키워드 최적화, 콘텐츠 구조, 내부/외부 링크, 메타 요소, 가독성, 피처드 스니펫 기회를 분석해 SEO 점수(0-100)와 구체적 개선 권고사항을 제공한다.

### 메타 생성 에이전트

5가지 메타 타이틀 변형(50-60자), 5가지 메타 설명 변형(150-160자)과 SERP 미리보기를 생성한다. A/B 테스트 권고사항 포함.

### 성과 에이전트

GA4, Google Search Console, DataForSEO를 통합해 11-20위 빠른 승리 키워드, 하락 콘텐츠, 낮은 CTR 기회를 발굴해 주간 콘텐츠 로드맵을 작성한다.

## 콘텐츠 품질 기준

SEO Machine이 내부적으로 적용하는 기준이다:

**콘텐츠**: 최소 2,000단어(2,500-3,000+ 권장), 경쟁사 대비 독특한 가치, 전문적 정확성

**SEO**: 주요 키워드 밀도 1-2%, H1에 키워드+첫 100단어+H2 2-3개에 포함, 내부 링크 3-5개(설명적 앵커 텍스트), 외부 권위 링크 2-3개

**가독성**: 8-10학년 수준, 평균 문장 길이 15-20단어, 단락 2-4문장, 300-400단어마다 소제목, 스캔 가능한 목록과 형식

## 기술 스택과 아키텍처

```
seomachine/
├── .claude/
│   ├── commands/          # 커스텀 워크플로우 명령어
│   ├── agents/            # 전문 분석 에이전트
│   └── skills/            # 26개 마케팅 스킬
├── data_sources/          # 분석 통합
│   ├── modules/          # Python 분석 모듈
│   └── config/           # API 자격증명
├── context/               # 브랜드 보이스, 스타일 가이드 등 설정 파일
├── wordpress/             # WordPress REST API 통합
├── topics/                # 원시 아이디어
├── research/              # 리서치 브리프 및 분석 보고서
├── drafts/                # 작업 중인 기사
├── published/             # 발행 준비 완료
└── rewrites/              # 기존 콘텐츠 업데이트
```

- **언어**: Python 99.1%, PHP 0.9%
- **데이터**: GA4 API, Google Search Console API, DataForSEO API
- **WordPress**: REST API + 커스텀 MU-플러그인 (Yoast SEO 필드 노출)
- **NLP 라이브러리**: nltk, textstat, scikit-learn
- **스크래핑**: beautifulsoup4

## 설치와 사용법

```bash
git clone https://github.com/TheCraigHewitt/seomachine.git
cd seomachine
pip install -r data_sources/requirements.txt
claude-code .  # Claude Code로 열기
```

**중요: 컨텍스트 파일 설정 (필수)**

```
context/brand-voice.md       # 브랜드 보이스와 메시지 정의
context/writing-examples.md  # 자사 모범 블로그 포스트 3-5개 추가
context/features.md          # 제품/서비스 기능과 이점
context/internal-links-map.md  # 주요 페이지 내부 링크 맵
context/style-guide.md       # 스타일 선호도
context/target-keywords.md   # 키워드 리서치와 토픽 클러스터
context/competitor-analysis.md  # 경쟁사 분석
context/seo-guidelines.md    # SEO 요구사항
```

**빠른 환경 테스트**:
```bash
python3 data_sources/test_dataforseo.py
```

**WordPress 설정**:
```
.env에 추가:
WP_URL=https://yoursite.com
WP_USERNAME=your_username
WP_APP_PASSWORD=your_application_password
```

**콘텐츠 생성 워크플로우**:
```
1. /research content marketing strategies
2. 리서치 브리프 검토
3. /write content marketing strategies
4. 에이전트 보고서 검토 및 개선
5. /optimize drafts/article-name.md
6. /publish-draft drafts/article-name.md
```

## 마치며

SEO Machine은 콘텐츠 마케팅을 진지하게 하는 팀에게 실질적인 도구다. 5,600개의 스타는 "나도 이런 게 필요했어"라는 공감의 표현이다.

Castos 팀이 실제로 사용한 시스템이라는 점이 신뢰를 준다. `examples/castos/` 폴더를 보면 팟캐스트 호스팅 SaaS가 브랜드 보이스, 키워드, 경쟁사 분석을 어떻게 채웠는지 전체 그림을 볼 수 있다.

SEO 콘텐츠 생성에 Claude Code를 어떻게 활용할 수 있을지 고민하는 팀이라면, SEO Machine이 6개월 시행착오를 건너뛰게 해준다.
