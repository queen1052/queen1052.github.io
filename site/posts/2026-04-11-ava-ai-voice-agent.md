---
title: "AVA AI Voice Agent: Asterisk/FreePBX를 위한 오픈소스 AI 음성 에이전트"
date: "2026-04-11"
category: "AI 개발"
tags: ["음성AI", "Asterisk", "STT", "TTS", "Docker"]
excerpt: "OpenAI Realtime, Deepgram, ElevenLabs 등 6개 골든 베이스라인을 지원하는 Asterisk/FreePBX용 오픈소스 AI 음성 에이전트."
author: "큐레이터"
readTime: "7분"
image: null
---

## 소개

**AVA(AI Voice Agent)**는 Asterisk 및 FreePBX 기반 전화 시스템에 AI 음성 에이전트를 통합하기 위한 오픈소스 프레임워크입니다. 1,100개 이상의 GitHub 스타를 획득한 이 프로젝트는 Python 62.5%와 TypeScript 28.3%로 구성된 실용적인 솔루션으로, MIT 라이선스로 공개되어 있습니다.

기존 VoIP 인프라에 최신 AI 음성 기술을 접목하려는 기업들에게 최적화된 도구로, 콜센터 자동화, IVR 시스템 고도화, 24/7 무인 고객 응대 등 다양한 활용 사례를 지원합니다.

## 주요 기능

- **6개 골든 베이스라인**: OpenAI Realtime, Deepgram, Google Live, ElevenLabs, LiteLLM, Ollama를 즉시 활용 가능한 검증된 구성으로 제공
- **모듈식 STT+LLM+TTS 파이프라인**: 각 컴포넌트를 독립적으로 교체 가능한 플러그인 아키텍처
- **2-컨테이너 도커 아키텍처**: 서비스 분리로 독립적인 스케일링 및 업데이트 가능
- **웹 Admin UI**: 브라우저 기반 관리 인터페이스로 코드 없이 설정 변경
- **CLI 툴**: `agent setup`, `agent check`, `agent update` 등 편리한 명령줄 도구

## 6개 골든 베이스라인 심층 분석

골든 베이스라인은 특정 사용 사례에 최적화된 사전 검증된 구성 조합입니다:

1. **OpenAI Realtime**: GPT-4o 등 최신 OpenAI 모델을 실시간 음성 처리에 활용, 최고 품질의 대화 경험
2. **Deepgram**: Deepgram STT + 사용자 선택 LLM + Deepgram TTS 조합, 저지연 응답에 최적화
3. **Google Live**: Google의 멀티모달 Gemini 모델과 Google TTS 통합, 한국어 등 다국어 지원 강점
4. **ElevenLabs**: 고품질 자연스러운 음성 합성을 위한 ElevenLabs TTS 중심 구성
5. **LiteLLM**: 100+ LLM 프로바이더를 단일 API로 통합, 비용 최적화에 유리
6. **Ollama**: 완전 로컬 실행 구성, 인터넷 없이 프라이빗하게 운영 가능

## 모듈식 파이프라인 아키텍처

AVA의 핵심 강점은 STT → LLM → TTS 각 단계를 독립적으로 교체할 수 있는 모듈식 설계입니다. 예를 들어 STT는 Whisper, LLM은 Claude, TTS는 ElevenLabs를 조합하는 커스텀 구성이 가능합니다.

Asterisk AGI(Asterisk Gateway Interface)를 통해 전화 호 이벤트를 수신하고, WebSocket으로 음성 스트림을 처리하는 구조입니다. 각 통화는 독립적인 세션으로 관리되어 동시 다수 통화 처리가 가능합니다.

## 기술 스택 및 아키텍처

- **언어**: Python 62.5%, TypeScript 28.3%
- **라이선스**: MIT
- **컨테이너**: Docker Compose 기반 2-컨테이너 구성
- **VoIP**: Asterisk/FreePBX AGI 통합
- **음성 처리**: WebSocket 스트리밍
- **LLM 지원**: OpenAI, Google Gemini, Anthropic Claude, Ollama(로컬), LiteLLM 호환 모든 모델
- **관리**: 웹 Admin UI + REST API

## 설치 및 사용법

```bash
# 설치 스크립트 실행
bash install.sh

# 환경 설정 (.env 파일 수정)
cp .env.example .env
# OPENAI_API_KEY, DEEPGRAM_API_KEY 등 설정

# 에이전트 설정
agent setup

# 서비스 시작
docker compose up -d

# 상태 확인
agent check
```

Admin UI 접속: http://localhost:8080

고급 설정:
```bash
# 특정 골든 베이스라인으로 전환
agent setup --baseline openai-realtime

# 에이전트 업데이트
agent update
```

## 마치며

**AVA AI Voice Agent**는 기존 Asterisk/FreePBX 인프라를 보유한 기업이 AI 음성 에이전트를 빠르게 도입할 수 있는 실용적인 솔루션입니다. 6개 골든 베이스라인 덕분에 복잡한 STT/LLM/TTS 통합 작업 없이 바로 프로덕션 수준의 AI 음성 에이전트를 배포할 수 있습니다. Ollama 기반 완전 로컬 모드는 개인정보 보호가 중요한 금융·의료 분야에서도 활용 가능합니다.
