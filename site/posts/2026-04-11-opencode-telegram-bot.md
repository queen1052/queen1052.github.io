---
title: "OpenCode Telegram Bot: 스마트폰으로 AI 코딩 에이전트 원격 제어"
date: "2026-04-11"
category: "개발 도구"
tags: ["OpenCode", "Telegram", "AI 코딩"]
excerpt: "OpenCode AI 코딩 에이전트를 Telegram으로 원격 제어. 음성 프롬프트, 예약 태스크, 실시간 에이전트 활동 모니터링. macOS/Windows/Linux 지원. 414 스타."
author: "큐레이터"
readTime: "6분"
image: null
---

## 소개

OpenCode Telegram Bot은 [OpenCode](https://opencode.ai/) CLI를 위한 안전한 Telegram 클라이언트입니다. AI 코딩 태스크를 실행하고, 진행 상황을 모니터링하고, 모델을 전환하고, 세션을 관리하는 모든 작업을 스마트폰에서 할 수 있습니다. 모든 것이 로컬 머신에서 실행됩니다.

"오픈 포트도 없고, 노출된 API도 없습니다. 봇은 로컬 OpenCode 서버 및 Telegram Bot API와만 통신합니다."

GitHub에서 414 스타를 획득한 이 프로젝트는 TypeScript 98.6%로 구성되어 있으며 MIT 라이선스로 배포됩니다. macOS, Windows, Linux 모두 지원하며, 6개 언어(영어/독일어/스페인어/프랑스어/러시아어/중국어)로 UI 현지화를 지원합니다.

## 주요 기능

**원격 코딩:** 어디서나 OpenCode에 프롬프트를 보내고, 코드가 파일로 전달된 완성된 결과를 받습니다.

**세션 관리:** TUI와 마찬가지로 새 세션 생성 또는 기존 세션 계속하기.

**실시간 상태:** 현재 프로젝트, 모델, 컨텍스트 사용량, 변경된 파일 목록이 실시간으로 업데이트되는 고정 메시지.

**모델 전환:** 채팅에서 바로 즐겨찾기와 최근 히스토리에서 모델 선택. 즐겨찾기가 먼저 표시됩니다.

**에이전트 모드:** Plan과 Build 모드를 즉석에서 전환.

**서브에이전트 활동:** 현재 태스크, 에이전트, 모델, 활성 도구 단계를 포함한 실시간 서브에이전트 진행 상황.

**음성 프롬프트:** 음성/오디오 메시지를 Whisper 호환 API로 전사하고, `/tts`로 음성 답변 활성화.

**파일 첨부:** 이미지, PDF, 텍스트 파일(코드, 로그, 설정 등)을 OpenCode에 전송.

**예약 태스크:** 나중에 실행하거나 반복 간격으로 실행할 프롬프트 예약.

**보안:** 엄격한 사용자 ID 화이트리스트. 봇을 찾더라도 다른 사용자는 접근 불가.

## 예약 태스크 심층 분석

예약 태스크는 OpenCode Telegram Bot의 독특한 기능입니다. 프롬프트를 미리 준비하여 나중에 또는 반복 일정으로 자동 실행합니다. 컴퓨터에서 떠나 있는 동안 OpenCode가 실행할 루틴 코드 유지보수나 주기적 점검에 유용합니다.

- `/task`: 예약 태스크 생성
- `/tasklist`: 기존 예약 태스크 검토 또는 삭제
- 각 태스크는 현재 선택된 OpenCode 프로젝트와 모델로 생성
- 예약 실행은 항상 `build` 에이전트로 실행
- 최소 반복 간격: 5분
- 기본 최대 10개 예약 태스크 (`TASK_LIMIT`로 변경 가능)

## 봇 명령어

```
/status        - 서버 상태, 현재 프로젝트/세션/모델 정보
/new           - 새 세션 생성
/abort         - 현재 태스크 중단
/sessions      - 최근 세션 목록 및 전환
/projects      - OpenCode 프로젝트 전환
/tts           - 오디오 답변 토글
/rename        - 현재 세션 이름 변경
/commands      - 커스텀 명령어 목록 및 실행
/task          - 예약 태스크 생성
/tasklist      - 예약 태스크 목록 및 삭제
/opencode_start - OpenCode 서버 원격 시작 (긴급용)
/opencode_stop  - OpenCode 서버 원격 중지 (긴급용)
/help          - 사용 가능한 명령어 표시
```

일반 텍스트 메시지는 차단 상호작용이 없을 때만 AI 코딩 에이전트에 프롬프트로 전송됩니다.

## 음성 및 TTS 설정

```bash
# Whisper 호환 STT 설정 (음성→텍스트)
STT_API_URL=https://api.openai.com/v1
STT_API_KEY=your-openai-key
STT_MODEL=whisper-1

# Groq 사용 시
STT_API_URL=https://api.groq.com/openai/v1
STT_MODEL=whisper-large-v3-turbo

# TTS 설정 (텍스트→음성)
TTS_API_URL=https://api.openai.com/v1
TTS_API_KEY=your-tts-api-key
TTS_MODEL=gpt-4o-mini-tts
TTS_VOICE=alloy
```

STT가 설정되면 봇이 음성/오디오 메시지를 수락하고, 인식된 텍스트를 채팅에 표시한 후 OpenCode에 일반 프롬프트로 전송합니다.

## 기술 스택 및 아키텍처

**스택:** TypeScript(98.6%), grammY(Telegram Bot 프레임워크), Node.js 20+

**통신 흐름:**
- 봇 ↔ Telegram Bot API (긴 폴링 또는 SSE)
- 봇 ↔ 로컬 OpenCode 서버 (http://localhost:4096)

외부 공격 표면이 없습니다. 봇은 로컬에서 실행되며 Telegram Bot API와 로컬 OpenCode 서버에만 연결합니다.

## 설치 및 사용법

```bash
# npx로 즉시 실행
npx @grinev/opencode-telegram-bot

# 전역 설치
npm install -g @grinev/opencode-telegram-bot
opencode-telegram start

# 재설정
opencode-telegram config
```

**설정 위치:** macOS는 `~/Library/Application Support/opencode-telegram-bot/.env`, Windows는 `%APPDATA%\opencode-telegram-bot\.env`, Linux는 `~/.config/opencode-telegram-bot/.env`.

**필수 환경 변수:**
```
TELEGRAM_BOT_TOKEN=...           # @BotFather에서 받은 봇 토큰
TELEGRAM_ALLOWED_USER_ID=...     # 자신의 Telegram 숫자 ID (@userinfobot으로 확인)
OPENCODE_API_URL=http://localhost:4096  # OpenCode 서버 URL
```

**전제 조건:** Node.js 20+, OpenCode CLI 설치, Telegram 봇 생성(@BotFather)

첫 실행 시 설정 마법사가 언어, 봇 토큰, 사용자 ID, OpenCode API URL을 단계별로 안내합니다.

## 마치며

OpenCode Telegram Bot은 경량하면서도 강력한 원격 코딩 인터페이스를 제공합니다. OpenClaw의 경량 대안으로도 포지셔닝되어 있으며, 예약 태스크 기능이 그 핵심입니다.

컴퓨터에서 떨어져 있는 동안에도 AI 코딩 에이전트를 모니터링하고 개입할 수 있다는 것은 개발자 생산성의 새로운 차원을 열어줍니다. 완전히 로컬에서 실행되어 프라이버시가 보장되고, 엄격한 사용자 ID 화이트리스트로 보안도 챙긴 실용적인 도구입니다.
