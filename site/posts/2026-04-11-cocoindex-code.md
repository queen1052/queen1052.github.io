---
title: "CocoIndex Code: 토큰 70% 절감하는 AST 기반 코드 시맨틱 검색 도구"
date: "2026-04-11"
category: "개발 도구"
tags: ["코드검색", "AST", "MCP"]
excerpt: "AST 기반 코드 파싱으로 중요 코드만 임베딩하여 토큰 70% 절감, 28개 언어 지원, Claude Code/Codex MCP 연동을 지원하는 경량 코드 검색 CLI."
author: "큐레이터"
readTime: "7분"
image: null
---

## 소개

**CocoIndex Code**(ccc)는 AST(추상 구문 트리) 기반의 초경량 코드 시맨틱 검색 도구입니다. GitHub에서 1,300개의 스타를 기록했으며, Python 98.4%로 구현된 Apache-2.0 라이선스 프로젝트입니다.

Rust로 작성된 초고성능 CocoIndex 인덱싱 엔진 위에 구축되어, 변경된 파일만 재인덱싱하는 증분 업데이트와 0-설정 즉시 사용이 특징입니다. 기본 임베딩 모델은 로컬 `sentence-transformers/all-MiniLM-L6-v2`를 사용하여 API 키 없이 완전 무료로 시작할 수 있습니다.

## 주요 기능

- **토큰 70% 즉시 절감**: AST 기반으로 의미있는 코드 청크만 임베딩하여 LLM 컨텍스트 압축
- **1분 설정**: `pipx install cocoindex-code` 후 `ccc index`만으로 즉시 사용
- **28개 이상 언어 지원**: Python, JavaScript/TypeScript, Rust, Go, Java, C/C++, C#, SQL, Shell 등
- **Claude Code Skill**: `npx skills add cocoindex-io/cocoindex-code`로 에이전트에 통합
- **MCP 서버 모드**: `ccc mcp`로 任意 MCP 호환 에이전트에 시맨틱 코드 검색 제공
- **완전 내장형**: 별도 DB 설치 없이 .cocoindex_code/ 폴더에 모든 데이터 저장

## AST 기반 코드 검색의 차별점

일반 텍스트 검색(grep)과 시맨틱 검색의 차이는 명확합니다. grep은 정확한 단어가 있어야 하지만, ccc는 "데이터베이스 연결 관리"라고 검색하면 `DatabaseConnectionPool.java`를 찾아줍니다.

핵심 혁신은 **AST 기반 청킹**입니다. 코드를 50-line 블록으로 단순 분할하는 대신, 함수·클래스·메서드 경계를 AST로 인식하여 의미 단위로 분할합니다. 이렇게 하면 함수의 절반만 포함된 의미없는 청크가 생기지 않아 검색 정확도가 높아지고, 청크 수가 줄어 토큰이 절감됩니다.

Tree-sitter를 파싱 엔진으로 사용하여 28개 이상 언어를 일관되게 지원하며, 언어별 커스텀 청커도 플러그인으로 추가할 수 있습니다.

## 코딩 에이전트 통합

Claude Code와의 Skill 통합이 특히 강력합니다:

```bash
npx skills add cocoindex-io/cocoindex-code
```

이 한 줄로 Claude Code가 자동으로 ccc 초기화, 인덱싱, 검색을 처리합니다. `/ccc` 명령으로 직접 호출하거나, "인증 로직이 어디에 구현되어 있어?"처럼 자연어로 물어보면 에이전트가 ccc를 통해 검색합니다.

MCP 모드로는 Codex, Cursor, OpenCode 등 모든 MCP 호환 에이전트에서 동일하게 사용할 수 있습니다.

## 기술 스택 및 아키텍처

- **언어**: Python 98.4%
- **라이선스**: Apache-2.0
- **인덱싱 엔진**: CocoIndex (Rust 기반)
- **코드 파싱**: Tree-sitter
- **기본 임베딩**: sentence-transformers/all-MiniLM-L6-v2 (로컬, 무료)
- **고급 임베딩**: LiteLLM 경유 100+ 클라우드 모델 지원
- **데이터베이스**: LMDB + SQLite (내장형)
- **데몬**: 백그라운드 자동 인덱싱 데몬

## 설치 및 사용법

```bash
# 설치 (pipx 권장)
pipx install cocoindex-code

# 초기화 및 인덱싱
ccc init           # 프로젝트 설정 파일 생성
ccc index          # 코드베이스 인덱싱 (ccc init 없이도 자동 실행)

# 검색
ccc search "사용자 인증 로직"
ccc search --lang python "데이터베이스 연결 풀"
ccc search --path "src/api/*" "요청 핸들러"

# 상태 확인
ccc status         # 청크 수, 파일 수, 언어 분포
ccc doctor         # 설정, 데몬, 모델 상태 진단

# MCP 서버로 실행
ccc mcp
```

Docker로 실행:
```bash
docker run -d --name cocoindex-code \
  --volume "$(pwd):/workspace" \
  --volume cocoindex-db:/db \
  ghcr.io/cocoindex-io/cocoindex-code:latest
docker exec -it cocoindex-code ccc index
```

## 마치며

**CocoIndex Code**는 "코딩 에이전트의 컨텍스트 비용을 70% 줄인다"는 명확한 가치를 전달하는 실용적인 도구입니다. 1분 설정, 로컬 임베딩으로 API 비용 없음, Claude Code·MCP 연동이라는 세 가지 특징이 즉각적인 생산성 향상을 약속합니다. 코드베이스가 커질수록 grep의 한계를 느끼는 개발자라면, ccc 한 번 시험해보면 바로 그 차이를 실감할 수 있습니다.
