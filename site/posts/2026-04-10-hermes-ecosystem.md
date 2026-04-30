---
title: "Hermes Agent 에코시스템 맵: 80개 이상의 도구·스킬·플러그인 총정리"
date: "2026-04-10"
category: "AI 에이전트"
tags: ["Hermes", "AI에이전트", "오픈소스"]
excerpt: "Nous Research의 Hermes Agent(43,700+ stars)를 중심으로 구성된 80개 이상의 스킬, 플러그인, 배포 템플릿, 통합 도구를 한 눈에 정리한 에코시스템 맵입니다."
author: "큐레이터"
readTime: "5분"
image: null
---

## 소개

[hermes-ecosystem](https://github.com/ksimback/hermes-ecosystem)은 Nous Research의 [Hermes Agent](https://github.com/NousResearch/hermes-agent)를 중심으로 형성된 커뮤니티 생태계를 종합 정리한 저장소입니다. Hermes는 영구 메모리, 자동 생성 스킬, 47개 내장 도구, 14개 메시지 플랫폼 지원을 갖춘 자기 개선형 AI 에이전트로 현재 **43,700+ stars**를 보유하고 있습니다.

이 에코시스템 맵은 품질 필터링을 거쳐 선별된 **75개 이상의 커뮤니티 저장소**를 카테고리별로 정리합니다.

## 에코시스템 통계

| 항목 | 수치 |
|------|------|
| 코어 저장소 (Nous Research 공식) | 6개 |
| 커뮤니티 저장소 (품질 필터링) | 75개 이상 |
| 전체 에코시스템 stars | 60,000+ |
| 스킬 라이브러리 | 15개 이상 |
| 지원 메시지 플랫폼 | 14개 |
| 지원 LLM 프로바이더 | 18개 이상 |
| 내장 도구 | 47개 |

## 주요 카테고리 하이라이트

### 스킬 & 스킬 레지스트리

[agentskills.io](https://agentskills.io) 오픈 표준을 따르는 스킬 생태계가 활발합니다.

- **Anthropic-Cybersecurity-Skills** — MITRE ATT&CK, NIST CSF 2.0 매핑 754개 사이버보안 스킬 (⭐ 4,132)
- **wondelai/skills** — Claude Code와 Hermes 모두에서 동작하는 크로스 플랫폼 스킬 라이브러리 (⭐ 480)
- **black-forest-labs/skills** — FLUX 공식 이미지 생성 스킬

### 메모리 & 컨텍스트

- **vectorize-io/hindsight** — 장기 메모리 파이프라인 retain/recall/reflect (⭐ 8,362)
- **greyhaven-ai/autocontext** — 재귀적 자기 개선 컨텍스트 하네스 (⭐ 711)

### 멀티에이전트 & 오케스트레이션

- **builderz-labs/mission-control** — 셀프 호스팅 AI 에이전트 오케스트레이션 (⭐ 3,875)
- **swarmclawai/swarmclaw** — 에이전트 스웜 빌더 (⭐ 285)

### 개발자 도구

- **junhoyeo/tokscale** — Claude Code, Hermes 등 토큰 사용량 추적기 (⭐ 1,690)
- **42-evey/evey-setup** — 29개 플러그인 포함 원 커맨드 Hermes 스택 설치

## 빠른 시작

```bash
# Hermes Agent 설치 (공식)
# https://hermes-agent.nousresearch.com/docs

# 스킬 탐색
hermes skills browse

# 워크스페이스 UI (웹 기반)
# https://github.com/outsourc-e/hermes-workspace
```

## 보안 참고사항

맵에 포함된 25+ stars 저장소는 모두 보안 검토를 완료했으며 **악성 저장소는 발견되지 않았습니다**. 단, `curl | bash` 형태의 인스톨러를 사용하는 저장소는 실행 전 스크립트를 직접 확인하는 것을 권장합니다.

## 결론

Hermes Agent 에코시스템은 빠르게 성장하고 있습니다. 코어 에이전트 외에도 스킬, 메모리, GUI, 배포, 도메인 애플리케이션까지 다양한 레이어가 형성되어 있어 자신의 필요에 맞는 조합을 찾기 쉽습니다. 라이브 대시보드는 [hermes-ecosystem.vercel.app](https://hermes-ecosystem.vercel.app/)에서 확인할 수 있습니다.

---

> 원문: https://github.com/ksimback/hermes-ecosystem
