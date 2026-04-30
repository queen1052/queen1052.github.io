---
title: "Hermes WebUI: Hermes 에이전트를 위한 실시간 모니터링 대시보드"
date: "2026-04-10"
category: "AI 도구"
tags: ["FastAPI", "React", "TailwindCSS"]
excerpt: "sanchomuzax의 Hermes WebUI — FastAPI + React 19 + TailwindCSS 4로 구축된 Hermes 에이전트 프로세스 모니터링 및 관리 대시보드."
author: "큐레이터"
readTime: "5분"
image: null
---

## 소개

Hermes WebUI는 sanchomuzax가 개발한 **Hermes 에이전트 모니터링 및 관리 대시보드**입니다. Hermes 에이전트 프레임워크의 실행 상태를 실시간으로 시각화하고, 세션 기록을 Full-Text Search로 검색하며, cron 작업과 스킬을 관리하는 완전한 웹 인터페이스입니다.

FastAPI 백엔드, React 19 프론트엔드, TailwindCSS 4, TanStack Query의 현대적인 스택으로 구현되어 있습니다. SQLite 데이터베이스를 **읽기 전용**으로 접근해 Hermes 에이전트의 저장 데이터를 안전하게 시각화합니다. 웹소켓 기반 실시간 업데이트로 에이전트 활동을 터미널 없이 브라우저에서 모니터링합니다.

Full-Text Search(FTS5)를 활용한 세션 검색은 수백 개의 에이전트 세션에서 특정 대화나 결과를 빠르게 찾을 때 유용합니다. SQLite FTS5는 별도 검색 엔진 없이도 효율적인 텍스트 검색을 제공합니다.

## 주요 기능

- **실시간 대시보드**: WebSocket을 통해 Hermes 에이전트의 현재 실행 상태, 활성 세션 수, 최근 활동을 실시간으로 표시합니다. 터미널 없이 브라우저만으로 에이전트 상태를 파악합니다.
- **세션 관리 + FTS5 검색**: 에이전트의 모든 실행 세션을 목록으로 보고, SQLite FTS5 기반 전문 검색으로 특정 콘텐츠를 빠르게 찾습니다.
- **설정(Config) 뷰어**: Hermes 에이전트의 현재 설정값을 읽기 전용으로 확인합니다. JSON 형식의 설정을 색상 코딩된 트리 뷰로 표시합니다.
- **Cron 작업 관리**: 스케줄링된 에이전트 작업의 목록, 다음 실행 시간, 실행 이력을 확인합니다.
- **스킬 라이브러리 뷰어**: Hermes 에이전트에 등록된 스킬 목록과 각 스킬의 상세 정보를 브라우저에서 확인합니다.
- **SQLite 읽기 전용 접근**: 데이터를 수정하지 않고 안전하게 시각화합니다. 운영 중인 에이전트 데이터베이스에 부작용 없이 연결합니다.

### 기술 스택 선택의 의도 — 최신 프론트엔드 스택

Hermes WebUI는 최신 프론트엔드 기술을 적극 채택했습니다:

- **React 19**: 최신 React의 Server Components, Suspense 개선, Actions를 활용합니다.
- **TailwindCSS 4**: CSS-first 설정, 더 빠른 빌드, 향상된 디자인 토큰 시스템을 사용합니다.
- **TanStack Query**: 서버 상태 관리와 자동 캐시 무효화로 실시간 데이터가 항상 최신 상태를 유지합니다.
- **FastAPI**: Python 비동기 웹 프레임워크로 WebSocket과 REST API를 동시에 처리합니다.

이 스택 조합은 실시간 데이터가 많은 모니터링 대시보드에 이상적입니다.

### FTS5 세션 검색 — SQLite의 숨겨진 강점

```python
# FastAPI 백엔드에서 FTS5 검색
@app.get("/api/sessions/search")
async def search_sessions(q: str, limit: int = 50):
    results = db.execute("""
        SELECT s.*, bm25(sessions_fts) as relevance
        FROM sessions s
        JOIN sessions_fts ON s.rowid = sessions_fts.rowid
        WHERE sessions_fts MATCH ?
        ORDER BY relevance
        LIMIT ?
    """, [q, limit]).fetchall()
    return results
```

FTS5의 BM25 랭킹으로 검색어와 가장 관련성 높은 세션이 상단에 노출됩니다. 별도 Elasticsearch 없이 SQLite만으로 강력한 전문 검색을 구현합니다.

## 기술 스택 / 아키텍처

| 항목 | 내용 |
|------|------|
| Backend | FastAPI (Python, async) |
| Frontend | React 19, TailwindCSS 4 |
| 상태 관리 | TanStack Query |
| 실시간 | WebSocket |
| 데이터베이스 | SQLite (읽기 전용), FTS5 |
| 검색 | SQLite FTS5 (BM25) |

아키텍처:  
`React 19 (TanStack Query) ↔ FastAPI WebSocket/REST ↔ SQLite (read-only) ← Hermes Agent`

## 설치 / 사용법

```bash
# 저장소 클론
git clone https://github.com/sanchomuzax/hermes-webui
cd hermes-webui

# 백엔드 의존성
pip install -r requirements.txt

# 프론트엔드 의존성
npm install

# 환경 변수 설정
cp .env.example .env
# HERMES_DB_PATH=/path/to/hermes/database.sqlite

# 개발 서버 실행
# 백엔드 (터미널 1)
uvicorn app.main:app --reload --port 8000

# 프론트엔드 (터미널 2)
npm run dev

# 브라우저에서 http://localhost:5173 접속
```

## 활용 사례 / 사용 시나리오

1. **Hermes 에이전트 운영 모니터링**: 프로덕션에서 실행 중인 Hermes 에이전트를 터미널 없이 브라우저 대시보드로 실시간 감시합니다. 팀원들이 SSH 접근 없이도 에이전트 상태를 확인합니다.

2. **에이전트 세션 분석**: 수백 개의 에이전트 세션에서 특정 키워드나 오류 패턴을 FTS5로 검색해 문제를 진단합니다. 에이전트 행동 패턴 분석에 활용합니다.

3. **스킬/Cron 관리 UI**: Hermes 에이전트의 스킬과 스케줄 작업을 CLI 없이 웹 인터페이스에서 확인합니다. 비개발자 팀원도 에이전트 설정을 검토할 수 있습니다.

## 결론

Hermes WebUI는 Hermes 에이전트 사용자에게 필수적인 시각화 레이어를 제공합니다. React 19, TailwindCSS 4 같은 최신 기술을 과감히 채택했고, FastAPI + WebSocket을 통한 실시간 모니터링이 잘 구현되어 있습니다. SQLite FTS5 기반 검색은 별도 검색 엔진 없이 효율적인 세션 검색을 가능하게 합니다. Hermes 에이전트 스택을 운영하는 팀에게 즉시 가치를 제공하는 실용적인 도구입니다.

---

> 원문: https://github.com/sanchomuzax/hermes-webui
