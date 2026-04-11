---
title: "LanguageTool: 25개 이상 언어를 지원하는 오픈소스 문법 교정 도구"
date: "2026-04-11"
category: "생산성 도구"
tags: ["NLP", "Grammar", "Spellcheck", "Java", "OpenSource", "Writing", "Proofreading"]
excerpt: "LanguageTool은 영어, 스페인어, 프랑스어, 독일어 등 25개 이상 언어의 문법, 스타일, 철자를 교정하는 오픈소스 교정 소프트웨어입니다. LGPL 2.1 라이선스로 자유롭게 사용할 수 있습니다."
author: "큐레이터"
readTime: "5분"
image: null
---

## 소개

[LanguageTool](https://github.com/languagetool-org/languagetool)은 영어, 스페인어, 프랑스어, 독일어, 포르투갈어, 폴란드어, 네덜란드어를 포함해 25개 이상의 언어를 지원하는 오픈소스 교정 소프트웨어입니다. LGPL 2.1 라이선스로 배포되어 자유롭게 사용, 수정, 배포할 수 있습니다.

GitHub에서 14.4k 스타를 기록하고 214명의 컨트리뷰터가 활발히 기여 중인 이 프로젝트는 단순한 철자 검사기를 넘어 문맥을 이해하는 문법 및 스타일 검사기입니다. 일반 철자 검사기가 찾지 못하는 오류들—맥락에 따른 단어 사용, 문법 구조, 스타일 일관성—을 포착합니다.

## 주요 기능

LanguageTool은 다층 오류 탐지 시스템을 제공합니다:

- **25개+ 언어 지원**: 영어, 스페인어, 프랑스어, 독일어, 포르투갈어, 폴란드어, 네덜란드어 등
- **문맥 기반 오류 탐지**: 단순 철자 오류를 넘어 문법 구조와 문맥 이해
- **HTTP API**: 자체 인프라에서 HTTP 서버로 실행. REST API 제공
- **자바 API**: Java 애플리케이션에 직접 통합 가능 (JLanguageTool)
- **LibreOffice 익스텐션**: 오피스 문서에서 직접 사용
- **커맨드라인 도구**: CLI로 파일 일괄 교정
- **Docker 지원**: 커뮤니티 제공 Docker 이미지들

## 핵심 기능 심층 분석: HTTP API 서버로 운영

LanguageTool을 자체 서버에서 HTTP API로 실행하는 것이 대부분의 통합 시나리오에서 가장 효율적입니다:

공식 공개 API(`https://languagetool.org/api/v2/check`)를 사용하거나, 자체 서버를 실행할 수 있습니다. 자체 서버는 제한 없는 API 호출, 내부 데이터 보안, 커스텀 규칙 추가가 가능합니다.

**API 사용 예시:**
```bash
curl -d "language=en-US&text=A sentence with a error in the Hitchhiker's Guide tot he Galaxy" \
  https://languagetool.org/api/v2/check
```

반환된 JSON에는 오류 위치, 제안 수정안, 오류 유형(문법/철자/스타일)이 포함됩니다.

Java API(`JLanguageTool`)를 사용하면 Java 애플리케이션에 직접 교정 기능을 내장할 수 있어, 문서 처리 시스템이나 CMS에 통합하기 적합합니다.

## 핵심 기능 심층 분석: 커스텀 규칙과 언어 확장

LanguageTool의 오류 탐지 규칙은 XML 형식으로 정의되어 있어 누구나 수정하고 확장할 수 있습니다. 개발 개요(dev.languagetool.org/development-overview)에 규칙 작성 방법이 상세히 설명되어 있습니다.

기업 환경에서는 내부 스타일가이드에 맞는 커스텀 규칙을 추가할 수 있습니다:
- 회사 제품명 올바른 표기 강제
- 내부 문서 형식 기준 준수
- 특정 용어 사용 규칙

언어별 전문 컨트리뷰터들이 지속적으로 규칙을 업데이트하며, 카탈루냐어, 폴란드어 등 특화 언어도 활발히 개선되고 있습니다.

## 기술 스택 및 아키텍처

- **언어**: Java (91.5%) - 핵심 엔진 및 규칙
- **규칙 정의**: XML 기반 패턴 매칭
- **빌드 도구**: Apache Maven
- **Java 요구사항**: Java 17+
- **Docker**: 커뮤니티 제공 이미지 (meyayl, Erikvl87, silvio 등)

## 설치 및 사용법

**스크립트로 설치:**
```bash
curl -L https://raw.githubusercontent.com/languagetool-org/languagetool/master/install.sh | sudo bash
```

**소스에서 빌드 (얕은 클론):**
```bash
git clone --depth 5 https://github.com/languagetool-org/languagetool.git
cd languagetool
mvn clean test
./build.sh languagetool-standalone package -DskipTests
```

**Docker로 실행:**
```bash
# 커뮤니티 이미지 사용
docker pull erikvl87/languagetool
docker run -p 8010:8010 erikvl87/languagetool
```

**HTTP API 테스트:**
```bash
curl -d "language=en-US&text=This is an test." http://localhost:8010/v2/check
```

## 마치며

LanguageTool은 25개 이상의 언어를 지원하는 성숙한 오픈소스 교정 엔진입니다. LGPL 라이선스로 상업 애플리케이션에도 자유롭게 통합할 수 있으며, HTTP API와 Java API의 이중 인터페이스는 다양한 통합 시나리오를 커버합니다. AI 기반 작문 도구들이 주목받는 시대에도 규칙 기반의 정확한 문법 검사는 여전히 고유한 가치를 가지며, LanguageTool은 이 분야에서 독보적인 오픈소스 솔루션입니다.
