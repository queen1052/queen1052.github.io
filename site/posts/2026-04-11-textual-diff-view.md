---
title: "Textual Diff View: 터미널에서 아름다운 코드 diff를 보여주는 Python 위젯"
date: "2026-04-11"
category: "개발 도구"
tags: ["Python", "Textual", "TUI"]
excerpt: "Textual Diff View는 터미널 앱에서 아름다운 코드 diff를 렌더링하는 Textual 위젯입니다. 통합 뷰와 분할 뷰, 구문 강조, 색맹 사용자를 위한 어노테이션을 지원합니다. Toad IDE의 핵심 컴포넌트입니다."
author: "큐레이터"
readTime: "6분"
image: null
---

## Textual Diff View란 무엇인가?

터미널에서 코드 변경사항을 확인할 때 `git diff`의 텍스트 출력은 기능적이지만 읽기 불편합니다. 색상 지원이 있지만 분할 뷰, 구문 강조, 좋은 타이포그래피는 없습니다.

**Textual Diff View**는 이 문제를 해결합니다. [Textual](https://github.com/textualize/textual) 프레임워크의 위젯으로, 터미널 앱에서 시각적으로 아름다운 코드 diff를 렌더링합니다. 원래 Toad IDE를 위해 만들어졌지만 독립 라이브러리로 사용 가능합니다.

Textual을 만든 Will McGugan이 직접 개발한 이 위젯은 155개 스타, Python 99.6%, AGPL-3.0 라이선스입니다.

## 주요 기능 한눈에 보기

Textual Diff View가 제공하는 핵심 기능:

- **통합 뷰**: 두 파일을 위아래로 변경사항 강조 표시
- **분할 뷰**: 두 파일을 나란히 배치하여 비교
- **구문 강조**: 코드 언어별 색상 하이라이팅
- **삭제/추가 표시**: 삭제된 줄/문자는 빨간색, 추가된 줄/문자는 초록색
- **어노테이션**: 색맹 사용자를 위한 "+" "-" 기호 옵션
- **자동 분할**: 공간이 충분하면 자동으로 분할 뷰 활성화
- **Textual 테마**: 라이트/다크 다양한 테마 지원
- **반응형 리액티브**: `split`, `auto_split`, `annotations` 리액티브 속성

## DiffView 위젯 심층 탐구

`DiffView`의 생성자는 4가지 위치 인수를 받습니다:

| 인수 | 타입 | 설명 |
|------|------|------|
| path_original | str | 원본 코드 파일 경로 |
| path_modified | str | 수정된 코드 파일 경로 |
| code_original | str | 원본 코드 내용 (직접 전달) |
| code_modified | str | 수정된 코드 내용 (직접 전달) |

경량 대안으로 `DiffView.load` 코루틴을 사용하면 파일 경로만으로 간단히 로드할 수 있습니다:

```python
diff_view = await DiffView.load("original.py", "modified.py")
await self.query_one("VerticalScroll").mount(diff_view)
```

리액티브 속성으로 동적 제어가 가능합니다:
- `split`: True이면 분할 뷰, False이면 통합 뷰
- `auto_split`: 공간이 충분하면 자동으로 분할 뷰
- `annotations`: "+" "-" 기호 표시 (색맹 접근성)

## 실제 사용 예시

```python
from textual.app import App, ComposeResult
from textual import containers
from textual.reactive import var
from textual import widgets
from textual_diff_view import DiffView, LoadError

class DiffApp(App):
    BINDINGS = [
        ("space", "toggle('split')", "Toggle split"),
        ("a", "toggle('annotations')", "Toggle annotations"),
    ]

    split = var(True)
    annotations = var(True)

    def __init__(self, original: str, modified: str) -> None:
        self.original = original
        self.modified = modified
        super().__init__()

    def compose(self) -> ComposeResult:
        yield containers.VerticalScroll(id="diff-container")
        yield widgets.Footer()

    async def on_mount(self) -> None:
        try:
            diff_view = await DiffView.load(self.original, self.modified)
        except LoadError as error:
            self.notify(str(error), title="Failed to load code", severity="error")
        else:
            diff_view.data_bind(DiffApp.split, DiffApp.annotations)
            await self.query_one("#diff-container").mount(diff_view)

if __name__ == "__main__":
    import sys
    app = DiffApp(sys.argv[1], sys.argv[2])
    app.run()
```

`Space`로 통합/분할 뷰 전환, `a`로 어노테이션 토글이 가능합니다.

## 기술 스택 및 아키텍처

- **언어**: Python 99.6%
- **프레임워크**: Textual (Textualize 제작)
- **라이선스**: AGPL-3.0 (개인/오픈소스 무료, 상용 라이선스 문의 가능)
- **Python 버전**: 3.11+
- **차이 알고리즘**: Python의 `difflib` 사용

## 설치 및 사용법

```bash
# uv로 설치 (권장)
uv add textual-diff-view

# pip으로 설치
pip install textual-diff-view
```

명령줄 툴로 실행:
```bash
# examples/ 디렉토리의 tdiff.py 사용
uv run python tdiff.py original.py modified.py
```

기본 사용:
```python
from textual_diff_view import DiffView

# 단순 사용
class Hello(App):
    def compose(self) -> ComposeResult:
        with containers.VerticalScroll():
            yield DiffView("hello1.py", "hello2.py", HELLO1, HELLO2)
```

## 마치며

Textual Diff View는 터미널 앱 개발자에게 꼭 필요한 위젯입니다. Textual 생태계의 대표 개발자인 Will McGugan이 직접 만들었고, Toad IDE라는 실제 제품에서 검증된 컴포넌트입니다. 통합/분할 뷰, 구문 강조, 색맹 접근성 어노테이션, 리액티브 속성 등 실용적인 기능들이 잘 갖춰져 있습니다. PyPI에서 `uv add textual-diff-view` 한 줄로 바로 사용 가능합니다. 터미널 기반 코드 리뷰 툴, diff 뷰어, 또는 코드 비교 기능이 필요한 모든 TUI 앱에서 활용하세요.
