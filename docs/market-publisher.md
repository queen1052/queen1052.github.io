# 마켓노트 자동 게시

Windows에서 Python 3.11 이상, Git, curl.exe, Node.js와 npm, 인증된 Codex CLI가 필요합니다. 실행 계정에 원격 `main` 푸시 권한이 있어야 합니다. 한국어 윤문 규칙은 설치된 im-not-ai v2.0.0의 Codex 포트에서 읽습니다. 설치 경로가 다르면 `--humanize-rules`로 규칙 파일의 경로를 지정합니다.

```powershell
py -3 C:\vscode\queen1052.github.io\scripts\publish_market_brief.py --dry-run
py -3 C:\vscode\queen1052.github.io\scripts\publish_market_brief.py
```

`--dry-run`은 체결 근거, 환율, 기사 검색을 검증합니다. 최초 설치를 글과 함께 커밋할 때만 `--bootstrap`을 사용합니다. 실패한 푸시는 `--retry-push`로 기존 발행 커밋을 재사용합니다. 원격이 앞서 있으면 일반 푸시가 거부되므로 먼저 충돌을 해결해야 합니다. 실행 프로그램은 MT5 터미널을 시작하거나 계좌를 전환하지 않습니다.

## 체결 근거

Rust 프로젝트는 최근 MT5 정산 저널을 읽기 전용으로 엽니다. 가상 청산 시각과 거래 종료 관측일이 KST로 같은 날이며 관측이 5분 이내인 완료 거래만 사용합니다. 이미 있는 두 프로젝트의 결과 CSV는 가상 청산 근거입니다. 실제 체결의 전략 귀속을 확인한 로컬 발행 도구가 있으면 그 결과를 `%USERPROFILE%\.market-note\evidence\mt5.json`과 `mt5_codex1.json`에 넣을 수 있습니다. Rust의 상세 종료 시각을 증명하는 별도 자료가 있으면 같은 폴더의 `mt5_rust1.json`을 사용합니다.

파일은 객체 배열입니다. 각 항목은 입·출금이 아닌 한 닫힌 포지션의 실제 체결과 같은 전략의 가상 청산을 매핑합니다. 필요한 필드는 `symbol`, `strategy_name`, `environment`(`Live`), `dry_run`(`false`), `flat_confirmed`, `history_complete`, `virtual_profit_final`(모두 `true`), `closed_at`, `virtual_profit_at`(시간대 포함 ISO 8601), `virtual_profit_krw`, `filled`, `currency`(`USD` 또는 `KRW`)와 `mt5_deals` 배열입니다. 각 체결에는 `ticket`, `position_id`, `entry`(MT5 진입·청산 유형), `volume`, `profit`, `commission`, `swap`, `fee`가 필요합니다. 티켓은 실제 체결 ID를 그대로 사용합니다. `mt5`와 `mt5_codex1`은 매핑된 가상 청산 시각·손익을 프로젝트의 결과 CSV와 대조합니다.

확실한 전략 귀속과 완전한 체결 이력이 있는 거래만 근거 파일에 넣습니다. 전략 선택 설정, 체결가가 비슷한 기록, 공통 magic이나 공통 코멘트만으로는 귀속을 확정할 수 없습니다. 이 자료는 저장소 밖에서 관리하며, 블로그에는 종목별 공개 집계만 저장합니다.

가상 손익 보정은 같은 체결 수량에서 실제 체결가의 방향별 변동과 총손익으로 계약 손익률을 구합니다. 이 비율을 가상 진입·청산 가격 차이에 적용한 USD 추정치와 실제 순손익에 같은 FRED 환율을 적용합니다. Rust는 동일 전략의 가상 진입과 청산 CSV에서 두 가격을 읽습니다. 다른 두 프로젝트의 근거에는 선택 필드 `virtual_prices`의 `side`(`BUY` 또는 `SELL`), `entry`, `exit`와 거래의 `side`를 제공할 수 있습니다. 방향이나 계약 손익률을 확인할 수 없으면 보정 금액을 비워 둡니다. Binance BTCUSDT는 MT5 집계에 포함되지 않습니다.

## 결과와 복구

발행된 글과 성과 스냅샷은 각각 `site/posts`와 `site/src/app/data/trade-reports`에 저장됩니다. 작업 상태는 무시되는 `.market-publisher` 폴더에 있습니다. Git 전처리에 실패하면 기존 원격 게시본은 유지됩니다. 발행 완료 후 로컬 `main`이 안전하게 빨리 감기 가능하면 게시 결과를 로컬에도 반영합니다.
