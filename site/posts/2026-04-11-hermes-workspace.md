---
title: "Hermes Workspace: AI 에이전트 통합 작업 인터페이스"
date: "2026-04-11"
category: "AI 도구"
tags: ["HermesWorkspace", "AI에이전트", "PWA"]
excerpt: "채팅, 파일, 메모리, 스킬, 터미널을 하나로 통합한 Hermes 에이전트용 오픈소스 워크스페이스"
author: "큐레이터"
readTime: "5분"
image: null
---

## 소개

**Hermes Workspace**는 Hermes AI 에이전트를 위한 통합 웹 작업 공간입니다. 채팅, 파일 탐색, 에이전트 메모리, 스킬 관리, 터미널을 단일 인터페이스에서 제공하며 PWA(Progressive Web App)로 모든 기기에서 네이티브 앱처럼 사용할 수 있습니다.

단순한 채팅 래퍼가 아닙니다. 에이전트를 지시하고, 메모리를 탐색하고, 스킬을 관리하고, 모든 것을 하나의 인터페이스에서 제어할 수 있는 완전한 에이전트 운영 센터입니다.

---

## 주요 기능

Hermes Workspace의 핵심 기능들:

- **실시간 SSE 스트리밍**: 툴 콜 렌더링을 포함한 실시간 에이전트 출력
- **8가지 테마**: Official, Classic, Slate, Mono — 각 라이트/다크 변형
- **보안 강화**: 모든 API 경로에 인증 미들웨어, CSP 헤더, 경로 순회 방지
- **모바일 우선 PWA**: Tailscale을 통한 모든 기기 완전한 기능 지원
- **메모리 브라우저**: 에이전트 메모리 파일 탐색, 검색, 편집
- **스킬 허브**: 2,000개 이상 스킬 탐색 및 관리
- **파일 브라우저**: Monaco 에디터 통합 전체 워크스페이스 파일 관리
- **풀 터미널**: 교차 플랫폼 PTY 터미널, 영구 셸 세션

---

## 핵심 기능 1: Enhanced Mode와 Portable Mode

Hermes Workspace는 두 가지 모드로 운영됩니다:

**Portable Mode (기본):**
- OpenAI 호환 백엔드 어디에나 즉시 연결
- Ollama 등 로컬 모델도 지원
- 세션, 메모리, 스킬은 "Not Available" 표시

```bash
HERMES_API_URL=http://127.0.0.1:11434 pnpm dev
```

**Enhanced Mode (전체 기능):**
Hermes 게이트웨이를 통해 라우팅 시 세션, 메모리, 스킬, 잡, 툴이 모두 활성화됩니다:

```yaml
# ~/.hermes/config.yaml
provider: ollama
model: qwen2.5:7b
custom_providers:
  - name: ollama
    base_url: http://127.0.0.1:11434/v1
    api_key: ollama
```

```bash
API_SERVER_ENABLED=true  # ~/.hermes/.env
hermes gateway run  # :8642에서 시작
HERMES_API_URL=http://127.0.0.1:8642 pnpm dev
```

---

## 핵심 기능 2: 보안과 모바일 접근

**보안 계층:**
- 모든 API 경로에 인증 미들웨어
- CSP 헤더 (메타 태그)
- 파일/메모리 경로의 경로 순회 방지
- 엔드포인트 레이트 제한
- 선택적 웹 UI 비밀번호 보호

**모바일 PWA 설치:**
- iOS Safari: 공유 버튼 → 홈 화면에 추가
- Android Chrome: 메뉴 → 홈 화면에 추가
- 데스크톱 (Chrome/Edge): 주소창의 설치 아이콘

**Tailscale을 통한 어디서나 접근:**
```bash
# 자신의 Tailscale IP 확인
tailscale ip
# 결과 예: 100.x.x.x

# 폰에서
http://100.x.x.x:3000
```

---

## 기술 스택 및 아키텍처

**프론트엔드:** TypeScript (97.8%), React, Vite
**기타:** CSS, JavaScript, Python (Hermes backend)

**빌드 도구:** pnpm, ESLint, Prettier

**지원 플랫폼:**
- Docker Compose로 원클릭 배포
- 개발 모드: `pnpm dev`
- 프로덕션: Dockerfile 제공

---

## 설치 및 사용법

**빠른 시작:**
```bash
git clone https://github.com/outsourc-e/hermes-workspace.git
cd hermes-workspace
pnpm install
cp .env.example .env
printf '\nHERMES_API_URL=http://127.0.0.1:8642\n' >> .env
pnpm dev  # http://localhost:3000
```

**Docker 사용:**
```bash
git clone https://github.com/outsourc-e/hermes-workspace.git
cd hermes-workspace
cp .env.example .env
# .env에 ANTHROPIC_API_KEY 설정
docker compose up
# hermes-agent → :8642, hermes-workspace → :3000
```

**환경 변수:**
```
HERMES_API_URL=http://127.0.0.1:8642
HERMES_PASSWORD=your_password  # 웹 UI 비밀번호 보호 (선택)
```

---

## 마치며

Hermes Workspace는 AI 에이전트를 단순히 사용하는 것을 넘어 에이전트의 삶을 함께 관리하는 공간을 제공합니다. 메모리를 직접 편집하고, 스킬을 탐색하고, 파일을 브라우징하며, 터미널에서 직접 명령을 실행할 수 있는 이 도구는 Hermes 에이전트 사용자에게 필수적인 동반자입니다. 오픈소스로 자체 호스팅이 가능하며, PWA로 모든 기기에서 네이티브처럼 작동합니다.

GitHub: [https://github.com/outsourc-e/hermes-workspace](https://github.com/outsourc-e/hermes-workspace)
