---
title: "OpenPostings: ATS 통합 채용공고 수집·지원 관리 플랫폼"
date: "2026-04-30"
category: "취업/채용"
tags: ["ATS", "React Native", "SQLite"]
excerpt: "여러 ATS 채용공고를 한곳에 모으고 지원 상태를 관리하는 OpenPostings를 소개합니다."
author: "큐레이터"
readTime: "7분"
image: null
---

## 소개

OpenPostings는 다양한 ATS 소스의 채용공고를 로컬 데이터베이스에 통합하고, 지원 상태까지 추적할 수 있게 만든 오픈소스 프로젝트입니다. README에 따르면 37,000+ 기업 소스와 일 단위 대량 공고를 대상으로 동작하는 수집·관리 흐름을 지향합니다.

특히 이 프로젝트는 단순 크롤러가 아니라, React Native 기반 클라이언트(Web/Android/Windows), Node/Express API, SQLite, MCP apply-agent 서버를 함께 제공합니다.

## 주요 기능

- **다중 ATS 동기화**: Workday, Greenhouse, Lever 등 다수 ATS 지원
- **고급 필터링**: 지역/국가/원격 여부/산업 등 다차원 필터
- **지원 파이프라인 관리**: applied/ignored 및 상태 변화 추적
- **로컬 우선 구조**: 개인 정보와 설정을 로컬 SQLite에 저장
- **MCP 연동**: 후보 선택·커버레터 초안·결과 기록 자동화

### 핵심 포인트 1 — ATS 통합 뷰

분산된 채용 사이트를 직접 순회하지 않고 한 데이터 모델로 통합해 검색·관리할 수 있는 점이 핵심입니다. 탐색 비용이 크게 줄어듭니다.

### 핵심 포인트 2 — 지원 자동화 MCP 서버

`npm run mcp:apply-agent`로 MCP 서버를 켜서 LLM과 연결하면, 지원 문서 작성과 기록 정리를 반자동으로 처리할 수 있습니다.

## 기술 스택 / 아키텍처

| 항목 | 내용 |
|------|------|
| 클라이언트 | React Native (Web/Android/Windows) |
| 서버 | Node.js + Express |
| DB | SQLite |
| 확장 | MCP apply-agent server |

## 설치 / 사용법

```bash
cd OpenPostings
npm install

# 터미널 1
npm run server

# 터미널 2
npm run web
```

Windows/Android 타깃 실행도 제공되며, 기본 Web 접속은 `http://localhost:8081`입니다.

## 활용 사례 / 사용 시나리오

1. **구직자 개인 대시보드**: 공고 수집부터 지원 추적까지 일원화
2. **집중 지원 주간 운영**: 필터+상태관리로 일일 파이프라인 관리
3. **LLM 보조 지원**: MCP로 커버레터·지원 결과 기록 자동화

## 결론

OpenPostings는 “공고 탐색 → 선별 → 지원 → 추적” 과정을 로컬 중심으로 통합해주는 실용 프로젝트입니다. 채용 탐색을 시스템적으로 관리하고 싶은 사용자에게 특히 적합합니다.

---

> 원문: https://github.com/Masterjx9/OpenPostings
