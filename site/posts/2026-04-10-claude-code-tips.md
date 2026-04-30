---
title: "45 Claude Code Tips: 에이전트 코딩 마스터 가이드"
date: "2026-04-10"
category: "개발도구"
tags: ["Claude Code", "AI", "agentic"]
excerpt: "Claude Code를 최대한 활용하는 45가지 팁. 초보부터 고급까지 실무에서 검증된 워크플로우를 총정리."
author: "큐레이터"
readTime: "7분"
image: null
---

## 소개

`claude-code-tips`는 Ykdojo(ykdojo)가 수십 개월간 Claude Code를 실전에서 사용하며 쌓은 **45가지 팁을 체계적으로 정리한 오픈소스 저장소**입니다. 기초적인 설정부터 Gemini CLI를 보조 모델로 연동하거나, Claude Code 자체를 컨테이너 안에서 실행하는 고급 기법까지 폭넓게 다룹니다. GitHub에서 7,300개 이상의 별을 받았으며, 513개의 포크와 52명의 팔로워를 보유한 실용적인 가이드입니다.

단순한 팁 나열이 아니라, 실제로 이 팁들을 활용해 **$10,000 비용을 절감하고 정규직을 구한 실제 사례**가 함께 수록되어 있어 설득력이 높습니다. 아울러 `content/` 디렉토리에 심층 스토리들이 별도 마크다운 파일로 정리되어 있어 읽는 재미도 있습니다.

특히 Claude for Chrome 통합, 컨텍스트 윈도우 활용법, CLAUDE.md 작성 전략 등 일반 문서에서 찾기 어려운 노하우가 담겨 있어, Claude Code를 본격적으로 사용하는 개발자라면 한 번은 꼭 읽어볼 만한 자료입니다.

## 주요 기능 (팁 하이라이트)

- **컨텍스트 창 1M 토큰 활용**: Sonnet 4.6과 Opus 4.6은 1M 토큰 컨텍스트를 지원합니다. `/model opus[1m]` 또는 `/model sonnet[1m]`으로 세션 중간에도 전환 가능합니다.
- **반복 수정 후 `/clear`로 초기화**: 같은 문제를 두 번 이상 수정해도 해결이 안 될 때, 누적된 실패 컨텍스트가 방해가 됩니다. `/clear` 후 더 나은 초기 프롬프트로 새 세션을 시작하는 것이 더 효과적입니다.
- **`@` 파일 참조**: `@src/auth/middleware.ts` 식으로 파일을 직접 지정하면 Claude가 코드베이스 검색 없이 바로 해당 파일을 읽어 토큰과 시간을 절약합니다.
- **CLAUDE.md 절반으로 줄이기**: `/init`으로 생성된 CLAUDE.md는 내용이 부풀려지는 경향이 있습니다. 이유를 설명하지 못하는 라인은 삭제하고 필수 항목만 남기세요.
- **훅(Hook) vs CLAUDE.md 역할 분리**: CLAUDE.md는 "권고사항"(약 80% 준수)이고, Hook은 "강제사항"(100% 실행)입니다. 반드시 실행해야 하는 포맷팅·린팅·보안 검사는 Hook으로 구성하세요.
- **출력 스타일 설정**: `/config`로 Explanatory, Concise, Technical 스타일을 선택하거나, `~/.claude/output-styles/`에 커스텀 스타일 파일을 저장할 수 있습니다.

### Claude for Chrome — 웹 UI 자동화

Claude for Chrome 통합을 활용하면 브라우저 내 요소를 접근성 트리에서 참조(ref)로 가져와 클릭·입력을 자동화할 수 있습니다. `read_page`로 요소 ref를 추출하고, `find`로 설명어로 검색한 뒤, 좌표 대신 `ref`를 사용해 안정적으로 인터랙션합니다. 스크린샷은 명시적으로 요청된 경우가 아니면 사용하지 않는 것이 권장됩니다.

### Gemini CLI를 Claude Code 부하로 활용

Tip 27에서 소개하듯, Claude Code는 네이티브 브라우저 통합과 학술 논문 검색 플러그인(`paper-search`)을 통해 리서치 도구로도 활용할 수 있습니다. Gemini CLI를 Claude Code의 "보조 에이전트"로 연동해 병렬 작업을 분산하는 패턴도 소개합니다.

## 기술 스택 / 아키텍처

이 저장소는 코드 저장소가 아닌 **지식 저장소**입니다.

| 항목 | 내용 |
|------|------|
| 형식 | Markdown 문서 |
| 주요 파일 | `README.md` (45가지 팁), `content/` (스토리, 가이드) |
| 관련 도구 | Claude Code CLI, Gemini CLI, Docker, `jq` |
| 라이선스 | 명시된 라이선스 있음 |
| 토픽 | cli, productivity, ai, developer-tools, claude, agentic-coding |

## 설치 / 사용법

```bash
# 저장소 클론
git clone https://github.com/ykdojo/claude-code-tips
cd claude-code-tips

# README.md에서 팁 읽기 (# 번호로 목차 검색)
# 특정 팁 예시: # Extract just the user messages from a conversation
cat README.md | grep -A 10 "Tip 27"
```

```bash
# 대화에서 유저 메시지만 추출 (jq 활용, Tip 예시)
cat conversation.json | jq '[.messages[] | select(.role=="user") | .content]'

# 오늘 특정 주제 대화 찾기
ls ~/.claude/projects/ | xargs -I{} grep -l "keyword" ~/.claude/projects/{}/*.json
```

## 활용 사례 / 사용 시나리오

1. **신규 Claude Code 사용자**: 팁 #1~#10의 기초 설정(컨텍스트 관리, CLAUDE.md 작성, 파일 참조)을 따라 하면 첫 세션부터 훨씬 효율적인 워크플로우를 구축할 수 있습니다.

2. **고급 개발자**: Gemini CLI 연동, 컨테이너 기반 실행, 훅 구성 같은 고급 팁으로 대형 코드베이스에서 Claude Code를 안정적으로 운용하는 체계를 구축합니다. 저자 본인은 이 방법으로 $10,000 비용 절감을 달성했습니다.

3. **로컬 라이브러리 테스트**: 저자가 소개한 실제 사례처럼, Rust 백엔드가 있는 Python 라이브러리를 Google Colab에서 테스트할 때 로컬에서 wheel을 빌드하고 업로드하는 전략을 Claude Code로 자동화할 수 있습니다.

## 결론

이 저장소는 Claude Code를 진지하게 사용하는 모든 개발자에게 실질적인 가치를 제공합니다. 45개의 팁을 한꺼번에 적용하려 하기보다, 마지막 세션에서 가장 불편했던 점 하나를 골라 관련 팁을 적용해보는 방식을 저자가 권장합니다. 꾸준히 읽으면 에이전트 코딩 역량이 점진적으로 향상됩니다. 저자의 뉴스레터 *Agentic Coding with Discipline and Skill*도 함께 구독하면 지속적인 업데이트를 받을 수 있습니다.

---

> 원문: https://github.com/ykdojo/claude-code-tips
