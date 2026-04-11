---
title: "blog-writer-mcp: 창작 DNA로 나만의 목소리를 찾는 AI 블로그 자동화 MCP 서버"
date: "2026-04-11"
category: "AI 도구"
tags: ["MCP", "블로그 자동화", "창작 DNA", "Claude Desktop", "SEO", "쿠팡 파트너스"]
excerpt: "Claude Desktop과 ChatGPT에 직접 연결해 나만의 글쓰기 세계관으로 블로그를 자동 운영하는 MCP 서버. 창작 DNA 시스템, SEO/GEO 최적화, 쿠팡 파트너스 자동 링크 삽입, Blogger/WordPress 발행까지 한 번에."
author: "큐레이터"
readTime: "6분"
image: null
---

## 소개: AI 블로그 자동화의 새로운 패러다임

"당신이 사랑한 것들에서 당신만의 목소리를 찾아드립니다." — blog-writer-mcp의 철학을 한 문장으로 표현한 말이다.

**blog-writer-mcp**는 sinmb79(22B Labs)가 개발한 AI 블로그 자동화 MCP(Model Context Protocol) 서버다. GitHub 19 stars, Python 87.7% + JavaScript 10.9%, MIT 라이선스로 공개되어 있다. 단순히 글을 써주는 도구가 아니라, 사용자의 취향을 분석해 '창작 DNA'를 추출하고 그 세계관으로 콘텐츠를 생성한다는 점이 핵심이다.

Claude Desktop 또는 ChatGPT Plus/Pro에 MCP 서버로 연결하면, AI가 직접 블로그 도구를 사용해 트렌드 수집부터 발행까지 전체 파이프라인을 자동화한다. 기존 blog-writer 프로젝트의 MCP 버전으로, Streamable HTTP 방식(`:8766` 포트)을 사용한다.

## 주요 기능: 창작 DNA부터 수익화까지

**창작 DNA 시스템**이 가장 독특한 기능이다. 좋아하는 작가, 책, 영화, 애니 스타일, 키워드를 입력하면 AI가 취향을 분석해 나만의 글쓰기 세계관을 추출한다. 한 번 설정하면 이후 모든 글이 그 DNA 스타일로 작성된다. 예를 들어 파울로 코엘료, 그리스인 조르바, 인터스텔라를 좋아한다면 '자유, 여정, 인간과 기술의 공존'을 키워드로 독자적인 글쓰기 톤이 만들어진다.

**AI 글쓰기 파이프라인**은 10개 MCP 도구로 구성된다. `blog_get_trending`으로 최신 트렌드를 수집하고, `blog_write_article`로 DNA 스타일을 적용한 글을 작성한다. `blog_optimize_seo`로 SEO+GEO 최적화, `blog_generate_image`로 이미지 생성, `blog_insert_affiliate_links`로 쿠팡 파트너스 링크를 자동 삽입한다. `blog_publish`로 Blogger 또는 WordPress에 발행하고, `blog_get_analytics`로 성과를 분석한다.

**성과 피드백 루프**도 지원된다. Google Search Console 연동으로 실제 트래픽을 분석하고, 성과 좋은 글 패턴에서 다음 주제를 자동으로 추천받는다. `blog_get_performance_feedback` 도구가 이를 담당한다.

## 창작 DNA 시스템 심층 분석

창작 DNA는 단순한 문체 설정이 아니다. 사용자가 좋아하는 창작물에서 세계관, 감정, 구조적 패턴을 추출해 AI의 글쓰기 방식에 내재화하는 시스템이다.

Claude Desktop에서 설정하는 방법:

```
내 창작 DNA를 설정해줘.

좋아하는 작가: 파울로 코엘료
좋아하는 책: 그리스인 조르바
좋아하는 영화: 인터스텔라
나의 키워드: 자유, 여정, 인간과 기술의 공존
```

설정 후 `blog_set_creative_dna` 도구가 `config/creative_dna.json`에 DNA 데이터를 저장한다. 이후 `blog_write_article`이 호출될 때마다 이 DNA가 프롬프트에 주입되어 일관된 목소리로 글이 생성된다.

전체 파이프라인을 한 번에 실행하려면 `blog_full_pipeline` 도구로 트렌드 수집부터 발행까지 자동화할 수 있다. Claude가 `blog_get_trending` → `blog_write_article` → `blog_optimize_seo` → `blog_generate_image` → `blog_insert_affiliate_links` → `blog_publish`를 순서대로 실행한다.

## SEO+GEO 최적화 및 수익화 기능

**SEO+GEO 최적화**는 검색엔진과 AI 검색(GEO: Generative Engine Optimization) 양쪽을 겨냥한다. `blog_optimize_seo` 도구가 `article_parser.py`와 `seo_optimizer.py`를 조합해 키워드 밀도, 메타태그, 구조화된 데이터를 최적화한다.

**쿠팡 파트너스 자동 링크**는 `blog_insert_affiliate_links` 도구로 글 내용에 맞는 쿠팡 상품 링크를 자동으로 삽입한다. `.env`에 `COUPANG_ACCESS_KEY`와 `COUPANG_SECRET_KEY`를 설정하면 활성화된다. 관련성이 높은 상품 링크를 자동 삽입해 수익화를 지원한다.

**멀티 플랫폼 발행**은 Blogger(`publisher_bot.py`)와 WordPress(`wp_publisher_bot.py`) 두 가지를 지원한다. `blog_publish` 도구에서 `platform="blogger"`, `platform="wordpress"`, 또는 `platform="both"`를 선택할 수 있다. Blogger는 Google OAuth 인증, WordPress는 Application Password 방식을 사용한다.

pytest 22 tests passed 기준으로 안정성이 검증되어 있으며, `bots/`, `blogwriter_mcp/`, `config/`, `templates/` 구조로 깔끔하게 분리되어 있다.

## 기술 스택 및 아키텍처

프로젝트 구조는 역할별로 명확히 분리되어 있다. `bots/` 폴더에 핵심 로직이 있고, `blogwriter_mcp/server.py`가 FastMCP HTTP 서버(`localhost:8766`)를 담당한다. `config/engine.json`으로 AI 엔진(OpenAI/Anthropic/Gemini)을 설정하고, `templates/`에 프롬프트 템플릿을 보관한다.

AI 엔진은 `engine_loader.py`의 팩토리 패턴으로 교체 가능하다. 기본값은 Claude(Anthropic)이며, OpenAI GPT, Google Gemini도 지원한다. `config/engine.json`에서 변경한다.

ChatGPT Plus/Pro 연결 시에는 ngrok으로 로컬 MCP 서버를 외부에 노출한 뒤 ChatGPT Connector로 등록해야 한다. Claude Desktop은 `claude_desktop_config.json`에 `mcp-remote`를 통해 직접 연결한다.

```python
# AI 엔진 팩토리 패턴
from bots.engine_loader import get_engine
engine = get_engine()  # config/engine.json 기반으로 자동 선택
```

## 설치 및 사용법

**사전 요구사항**: Python 3.11+, Node.js 18+(프론트엔드 빌드), Claude Desktop 또는 ChatGPT Plus/Pro, Google Blogger 또는 WordPress 사이트.

```bash
# 1. 클론 및 환경 설정
git clone https://github.com/sinmb79/blog-writer_mcp.git
cd blog-writer_mcp

# Windows
scripts\setup.bat
# Mac/Linux
pip install -e .

# 2. API 키 설정
copy .env.example .env
# .env에 GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, COUPANG 키 등 입력

# 3. Google 인증
python scripts/get_token.py

# 4. MCP 서버 실행
python blogwriter_mcp/server.py
```

Claude Desktop 연결 설정(`%APPDATA%\Claude\claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "blog_writer": {
      "command": "mcp-remote",
      "args": ["http://127.0.0.1:8766/mcp"]
    }
  }
}
```

Claude Desktop을 재시작하면 입력창 하단에 도구 아이콘이 생긴다. 이후 "오늘 AI 관련 트렌드 하나 골라서 내 DNA 스타일로 블로그 글 써줘"처럼 자연어로 요청하면 된다.

## 마치며

blog-writer-mcp는 "인간(H)과 AI(A)가 함께 더 나은 것(Ω)을 향해 나아간다"는 22B Labs의 The 4th Path 철학을 담고 있다. 창작 DNA 시스템은 AI 글쓰기의 가장 큰 단점인 '획일화된 문체'를 해결하려는 시도다.

기본 기능은 Google 계정만으로 사용 가능하고, Telegram 알림, 쿠팡 파트너스, Google Search Console 연동은 모두 선택 사항이라 진입 장벽이 낮다. MIT 라이선스로 상업적 이용도 자유롭다. AI 글쓰기 도구를 찾고 있다면, 내 취향을 반영한 나만의 목소리를 만들어주는 이 MCP 서버를 주목할 만하다.

- GitHub: [sinmb79/blog-writer_mcp](https://github.com/sinmb79/blog-writer_mcp)
