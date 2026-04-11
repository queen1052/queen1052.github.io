---
title: "SmartBot KR: 코딩 없이 5분 만에 설치하는 한국형 AI 챗봇 플랫폼"
date: "2026-04-11"
category: "AI 도구"
tags: ["챗봇", "카카오톡", "FAQ 자동화", "SmartBot", "지자체", "소상공인"]
excerpt: "지자체, 음식점, 쇼핑몰, 병원, 학원 등 어떤 조직이든 5분 설치로 운용 가능한 한국형 AI 챗봇 플랫폼. 카카오톡 연동, 홈페이지 위젯, FAQ 자동 답변, 문서 학습, 개인정보 보호 기능까지."
author: "큐레이터"
readTime: "6분"
image: null
---

## 소개: 비개발자도 5분이면 운영하는 AI 챗봇

"코딩 몰라도 됩니다. 설치부터 운영까지 한 번에." — SmartBot KR의 핵심 메시지다.

**SmartBot KR**(Gov-chat-bot)은 sinmb79(22B Labs)가 개발한 한국형 AI 챗봇 플랫폼이다. GitHub 39 stars, Python 76.3% + JavaScript 18.9%, MIT 라이선스로 공개되어 있다. 원래 지자체·공공기관용 AI 민원 챗봇으로 시작했으나, 소상공인과 일반 기업까지 아우르는 범용 플랫폼으로 확장되었다.

카카오톡 채팅과 홈페이지 위젯을 통해 고객 질문에 AI가 자동으로 답변하며, LLM 없이도 FAQ와 문서 기반으로 충분히 작동한다. 127개 테스트가 통과된 안정성을 갖추고 있다.

## 주요 기능: 다양한 조직을 위한 맞춤형 AI 상담

SmartBot KR은 다양한 업종에 적용 가능하다. **지자체·공공기관**은 민원 안내, 서류 발급 방법, 담당부서 연결을 자동화할 수 있다. **음식점·카페**는 메뉴 문의, 영업시간, 예약, 주차 안내를 처리하고, **쇼핑몰·온라인몰**은 배송 조회, 교환·환불 정책, 상품 문의를 자동화한다. **병원·의원·약국**은 진료시간, 예약, 보험 안내를, **학원·교육기관**은 수업 일정과 수강료 상담을 자동화할 수 있다.

핵심 기능은 여섯 가지다. **카카오톡 연동**: 카카오 i 오픈빌더 스킬 서버로 바로 연결해 카카오톡 채널에서 AI 챗봇을 운영한다. **홈페이지 위젯**: 코드 한 줄로 어느 홈페이지에나 챗봇 버튼을 삽입한다. **FAQ 자동 답변**: 등록한 FAQ를 AI가 유사도 매칭으로 즉시 답변한다. **문서 학습**: PDF·Word 파일을 업로드하면 AI가 자동으로 학습한다. **LLM 선택 연동**: Claude·GPT 연결 시 더 자연스러운 답변이 가능하며, 연결 없이도 잘 작동한다. **멀티 조직 지원**: 하나의 서버로 여러 매장·지점을 각각 독립적으로 운영한다.

## 3단계 답변 파이프라인

SmartBot KR의 동작 원리는 세 단계로 구성된 폭포수 방식이다.

```
고객 질문
    │
    ▼
① FAQ 검색 (등록된 FAQ와 유사도 비교)
    │ 비슷한 FAQ 있음 → 즉시 답변
    │ 없음 ↓
    ▼
② 문서 검색 (업로드한 파일에서 관련 내용 추출)
    │ 관련 내용 있음 + LLM 연결됨 → AI가 자연스럽게 재서술
    │ 관련 내용 있음 + LLM 없음   → 문서 내용 그대로 안내
    │ 없음 ↓
    ▼
③ 담당자 안내 (설정한 연락처로 안내)
```

**ChromaDB**를 벡터 데이터베이스로 활용해 FAQ와 문서의 의미론적 유사도를 검색한다. 같은 뜻이지만 다르게 표현된 질문("영업시간이요?" / "몇시에 열어요?" / "오늘 언제까지 해요?")도 같은 답변으로 매칭이 된다.

**개인정보 보호** 기능은 고객 발화에서 주민번호, 전화번호, 이메일, 카드번호를 자동 감지해 마스킹한다. 원문은 서버에 절대 저장되지 않고, 사용자 ID는 복원 불가능한 해시값으로만 저장된다. 관리자도 원문 열람이 불가능하다.

## 관리자 대시보드 및 5단계 설정

**관리자 대시보드**(`http://localhost:3000`)에서 모든 것을 관리할 수 있다. FAQ 추가·수정·삭제, 문서 업로드 및 승인, 대화 이력 확인, 통계 분석, 카카오톡/위젯 설정을 UI를 통해 쉽게 처리한다.

**홈페이지 위젯 설치**는 HTML에 스크립트 태그 하나만 추가하면 된다:

```html
<script
  src="http://내서버주소/widget/govbot-widget.js"
  data-tenant="내조직ID"
  data-api="http://내서버주소"
  data-title="AI 도우미"
  data-color="#2563eb"
></script>
```

`data-color`로 챗봇 버튼 색상, `data-title`로 제목을 커스터마이즈할 수 있다.

**LLM 연동 설정**은 `.env` 파일에서 간단히 변경한다:

```env
# Claude AI 사용 시
LLM_PROVIDER=anthropic
ANTHROPIC_API_KEY=your_api_key

# ChatGPT 사용 시
LLM_PROVIDER=openai
OPENAI_API_KEY=your_api_key
```

LLM을 사용하지 않는 경우 외부 API 호출이 전혀 없어 모든 데이터가 내 서버 안에만 존재한다.

## 기술 스택 및 아키텍처

**기술 스택**: Python, FastAPI(백엔드 API), PostgreSQL(데이터 저장), Redis(캐싱), ChromaDB(벡터 검색), React(관리자 프론트엔드), Docker(컨테이너화). 전체 서비스가 docker-compose로 구성되어 있어 단일 명령으로 모든 컴포넌트가 시작된다.

**시스템 요구사항**: Ubuntu 20.04+ / macOS 13+ / Windows 11(WSL2), RAM 4GB, 디스크 20GB, Docker 24.x 이상. 외부 인터넷은 설치 시에만 필요하고, 이후 오프라인 운영이 가능하다.

클라우드 서버가 없어도 사무실 컴퓨터에서 실행 가능하고, 외부 접속이 필요한 경우에만 공인 IP나 클라우드 서버를 사용하면 된다.

## 설치 및 사용법

**5분 설치 과정**:

```bash
# Linux / macOS
git clone https://github.com/sinmb79/Gov-chat-bot.git
cd Gov-chat-bot
chmod +x install.sh
./install.sh
```

Windows 사용자는 WSL2 가이드(`docs/WSL2_가이드.md`)를 참조한다.

설치 후 관리자 계정 생성:

```bash
docker compose exec backend python -m app.scripts.create_admin
# 조직 ID(영문), 이메일, 비밀번호 입력
```

접속 주소: 관리자 화면 `http://localhost:3000`, API 문서 `http://localhost:8000/docs`.

운영 순서: ① 관리자 계정 생성 → ② FAQ 등록 → ③ 문서 업로드(선택) → ④ 시뮬레이터에서 테스트 → ⑤ 홈페이지 위젯 코드 삽입 또는 카카오톡 연동.

멀티 조직 운영은 조직마다 별도의 조직 ID를 생성해 데이터를 완전히 분리한다: `docker compose exec backend python -m app.scripts.create_admin` 명령으로 조직별 관리자를 추가하면 된다.

## 마치며

SmartBot KR은 한국 시장의 특성(카카오톡, 한글 형태소, 개인정보 보호법)을 반영한 실용적인 AI 챗봇 프레임워크다. LLM 없이도 FAQ와 문서 기반으로 즉시 운영 가능하고, 필요 시 Claude나 GPT를 연결해 더 자연스러운 답변을 제공한다.

비개발자 소상공인도 5분 안에 설치할 수 있도록 설계된 `install.sh` 스크립트와 직관적인 관리자 대시보드가 특히 돋보인다. 127 tests passing이 검증된 안정성과 MIT 라이선스의 무료 상업적 사용이 가능하다는 점에서, 고객 응대 자동화를 고려하는 모든 조직에 시도해볼 만한 솔루션이다.

- GitHub: [sinmb79/Gov-chat-bot](https://github.com/sinmb79/Gov-chat-bot)
