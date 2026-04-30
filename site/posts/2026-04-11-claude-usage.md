---
title: "Claude Code Usage Dashboard: 토큰 사용량 완전 추적 도구"
date: "2026-04-11"
category: "개발 도구"
tags: ["Claude Code", "토큰", "사용량"]
excerpt: "Claude Code의 토큰 사용량, 비용, 세션 히스토리를 로컬에서 완벽하게 추적하는 대시보드. pip install 없이 Python 표준 라이브러리만으로 동작합니다."
author: "큐레이터"
readTime: "5분"
image: null
---

## 소개

Claude Code Usage Dashboard는 Claude Code의 토큰 사용량, 비용, 세션 히스토리를 로컬에서 추적하는 경량 대시보드 도구입니다. Pro와 Max 플랜 구독자는 진행 상황 바(progress bar)만 볼 수 있지만, 이 도구는 전체 그림을 보여줍니다.

Claude Code는 구독 유형과 상관없이 로컬 사용량 로그를 JSONL 형식으로 저장합니다. 이 도구는 그 로그를 읽어 차트와 비용 추정치로 변환합니다. API, Pro, Max 플랜 모두 지원합니다.

GitHub에서 820 스타를 획득한 이 프로젝트는 Python 100%로 구성되어 있으며, 서드파티 패키지 없이 Python 표준 라이브러리(`sqlite3`, `http.server`, `json`, `pathlib`)만 사용합니다. MIT 라이선스로 배포되며, Product Compass 뉴스레터에서 만들었습니다.

## 주요 기능

**범용 플랜 지원:** API, Pro, Max 플랜 모두 동작합니다. Claude Code CLI(`claude` 터미널 명령), VS Code 확장(Claude Code 사이드바), 디스패치된 Code 세션을 모두 캡처합니다. 단, Cowork 세션은 서버 사이드에서 실행되어 로컬 JSONL 트랜스크립트를 저장하지 않으므로 캡처되지 않습니다.

**비용 추정:** Anthropic API 가격 기준(2026년 4월)으로 비용을 계산합니다. claude-opus-4-6은 입력 $5.00/MTok, 출력 $25.00/MTok이며, claude-sonnet-4-6은 입력 $3.00/MTok, 출력 $15.00/MTok, claude-haiku-4-5는 입력 $1.00/MTok, 출력 $5.00/MTok입니다.

**증분 스캔:** 각 파일의 경로와 수정 시간을 추적하여 새 파일이나 변경된 파일만 처리합니다. 재실행 시 빠르게 동작합니다.

**유연한 스캔 경로:** 기본적으로 `~/.claude/projects/`와 Xcode Claude 통합 디렉토리(`~/Library/Developer/Xcode/CodingAssistant/...`)를 모두 확인합니다. `--projects-dir`로 커스텀 위치도 스캔 가능합니다.

## 동작 원리 심층 분석

Claude Code는 세션당 하나의 JSONL 파일을 `~/.claude/projects/`에 저장합니다. 각 줄은 JSON 레코드이며, `assistant` 타입 레코드에는 다음 필드가 포함됩니다.

- `message.usage.input_tokens` — 원시 프롬프트 토큰
- `message.usage.output_tokens` — 생성된 토큰
- `message.usage.cache_creation_input_tokens` — 프롬프트 캐시에 쓴 토큰
- `message.usage.cache_read_input_tokens` — 프롬프트 캐시에서 서빙된 토큰
- `message.model` — 사용된 모델 (예: `claude-sonnet-4-6`)

`scanner.py`가 이 파일들을 파싱하여 `~/.claude/usage.db`의 SQLite 데이터베이스에 저장합니다. `dashboard.py`는 `localhost:8080`에서 Chart.js 차트(CDN 로드)가 포함된 싱글 페이지 대시보드를 서빙하며, 30초마다 자동 갱신됩니다. 모델 필터링과 북마크 가능한 URL도 지원합니다.

## 비용 모니터링 활용

Claude Code를 Max 또는 Pro 구독으로 사용한다면 실제 비용 구조는 다르지만(구독 기반, 토큰 기반이 아님), 여전히 사용 패턴을 이해하는 데 유용합니다. API 플랜 사용자라면 정확한 비용 추정이 가능합니다.

캐시 사용 효율도 추적할 수 있습니다. `cache_read_input_tokens`가 높을수록 캐시 활용이 잘 되고 있다는 뜻이며, `cache_creation_input_tokens`는 캐시 생성에 쓰인 토큰입니다. 캐시 읽기는 쓰기의 1/10 비용으로, 반복 작업 시 큰 절감 효과를 줍니다.

## 파일 구조 및 아키텍처

```
claude-usage/
├── scanner.py    # JSONL 트랜스크립트 파싱, ~/.claude/usage.db에 저장
├── dashboard.py  # HTTP 서버 + 싱글페이지 HTML/JS 대시보드
├── cli.py        # scan, today, stats, dashboard 명령어
└── tests/        # 테스트 스위트
```

**요구 사항:**
- Python 3.8+
- 서드파티 패키지 없음 (표준 라이브러리만 사용)
- Claude Code를 이미 실행 중이라면 Python도 이미 설치되어 있습니다

## 설치 및 사용법

```bash
# 설치 (pip install 불필요)
git clone https://github.com/phuryn/claude-usage
cd claude-usage

# Windows
python cli.py dashboard

# macOS / Linux
python3 cli.py dashboard
```

**명령어:**
```bash
# JSONL 파일 스캔 및 데이터베이스 채우기
python3 cli.py scan

# 오늘 모델별 사용량 요약 (터미널)
python3 cli.py today

# 전체 통계 (터미널)
python3 cli.py stats

# 스캔 + 브라우저 대시보드 열기 (http://localhost:8080)
python3 cli.py dashboard

# 커스텀 호스트/포트
HOST=0.0.0.0 PORT=9000 python3 cli.py dashboard

# 커스텀 프로젝트 디렉토리 스캔
python3 cli.py scan --projects-dir /path/to/transcripts
```

GitHub Actions CI도 포함되어 있어 자동 테스트가 가능합니다.

## 마치며

Claude Code Usage Dashboard는 "보이지 않는 것은 관리할 수 없다"는 원칙에서 출발한 도구입니다. Anthropic의 UI가 제공하지 않는 상세한 토큰 사용 내역을 로컬에서 완전히 프라이빗하게 확인할 수 있습니다.

pip install도, 가상 환경도, 빌드 단계도 필요 없는 최대한 단순한 설계가 특징입니다. Claude Code를 적극적으로 사용하는 개발자라면 자신의 사용 패턴을 이해하고 비용을 최적화하는 데 이보다 간단한 도구는 없을 것입니다. 30초마다 자동 업데이트되는 실시간 대시보드로 언제나 최신 사용량을 확인하세요.
