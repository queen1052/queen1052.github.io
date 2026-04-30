---
title: "Stealth Browser MCP: 안티봇 환경용 브라우저 자동화 MCP 서버"
date: "2026-04-30"
category: "AI 에이전트"
tags: ["MCP", "browser-automation", "Python"]
excerpt: "Cloudflare 등 보호 환경에서 동작하는 Stealth Browser MCP의 구조와 사용법을 정리합니다."
author: "큐레이터"
readTime: "7분"
image: null
---

## 소개

Stealth Browser MCP는 MCP 호환 AI 에이전트를 위한 브라우저 자동화 서버입니다. README에서 강조하는 핵심은 일반적인 자동화가 막히는 안티봇 환경(Cloudflare 등)에서 실제 브라우저 기반 동작을 통해 성공률을 높이는 점입니다.

또한 단순 탐색 자동화에 머물지 않고, 네트워크 인터셉트·CDP 함수 실행·요소 정밀 추출 같은 고급 기능을 하나의 도구셋으로 제공합니다.

## 주요 기능

- **안티봇 우회 지향 자동화**: 보호 페이지에서의 실제 브라우저 제어
- **모듈형 도구 로딩**: 최소 22개부터 최대 90개 도구까지 선택
- **CDP 기반 정밀 추출**: DOM/CSS/자산까지 요소 복원 지원
- **네트워크 디버깅/후킹**: 요청·응답 페이로드 분석 및 동적 수정
- **MCP 클라이언트 호환성**: Claude Code/Claude Desktop/Cursor 등 연계

### 핵심 포인트 1 — 도구 구성의 유연성

`--minimal` 모드로 최소 구성을 사용하거나 섹션 단위 비활성화로 복잡도를 줄일 수 있어, 프로젝트 단계별로 운영 난이도를 조절하기 쉽습니다.

### 핵심 포인트 2 — 운영 안정성 옵션

브라우저 유휴 타임아웃, orphan profile 정리, 디버그 로깅 등 운영 환경에서 필요한 수명주기 제어 옵션을 제공합니다.

## 기술 스택 / 아키텍처

| 항목 | 내용 |
|------|------|
| 주요 언어 | Python |
| 핵심 기반 | Chrome DevTools Protocol, nodriver, FastMCP |
| 실행 환경 | Windows/macOS/Linux/Docker |
| 라이선스 | MIT |

## 설치 / 사용법

```bash
git clone https://github.com/vibheksoni/stealth-browser-mcp.git
cd stealth-browser-mcp
python -m venv venv
# Windows
venv\Scripts\activate
pip install -r requirements.txt
python src/server.py --minimal
```

MCP 클라이언트에는 `src/server.py`를 stdio 서버로 등록해 연결합니다.

## 활용 사례 / 사용 시나리오

1. **리서치 자동화**: 보호된 페이지에서 데이터 수집 자동화
2. **UI 클로닝**: 특정 섹션의 스타일/구조를 고정밀 추출
3. **API 역분석**: 네트워크 요청 흐름을 채팅 기반으로 디버깅

## 결론

Stealth Browser MCP는 “보호 환경에서도 실전 자동화를 해야 하는” 팀에 초점이 맞춰진 도구입니다. MCP 생태계와 결합해 브라우저 작업을 에이전트 워크플로우로 승격시키기 좋습니다.

---

> 원문: https://github.com/vibheksoni/stealth-browser-mcp
