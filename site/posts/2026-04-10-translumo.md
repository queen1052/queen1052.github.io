---
title: "Translumo: 실시간 화면 번역 도구 — 게임 자막도 즉시 번역"
date: "2026-04-10"
category: "개발도구"
tags: [".NET", "OCR", "translation", "C#", "screen"]
excerpt: "ramjke의 Translumo — EasyOCR과 Tesseract를 활용한 실시간 화면 텍스트 번역 도구. 하드코딩된 게임 자막, 앱 UI 번역에 특화된 .NET 8 오픈소스."
author: "큐레이터"
readTime: "5분"
image: null
---

## 소개

Translumo는 ramjke가 개발한 **실시간 화면 번역 도구**입니다. GitHub에서 5,200개 이상의 별을 기록하며, 공식 번역이 없거나 하드코딩된 자막의 게임, 외국어 앱 UI, 텍스트가 포함된 화면을 실시간으로 번역할 때 사용합니다.

기존 번역 도구는 텍스트 파일이나 클립보드 입력을 번역하지만, Translumo는 화면에서 직접 텍스트를 인식하고 번역합니다. **OCR → 번역 → 오버레이 표시** 파이프라인이 거의 실시간(수초 내)으로 처리됩니다. .NET 8과 C#으로 구현된 윈도우 네이티브 애플리케이션으로, Visual Studio 2022 이상에서 빌드할 수 있습니다.

OCR 엔진으로 EasyOCR(딥러닝 기반, 50개 이상 언어)과 Tesseract(전통적 OCR, 100개 이상 언어)를 모두 지원합니다. 게임의 경우 다양한 폰트와 배경 색상에서도 텍스트를 인식해야 하는데, EasyOCR의 딥러닝 기반 인식이 이런 환경에서 강점을 발휘합니다.

## 주요 기능

- **실시간 화면 텍스트 인식**: 선택한 화면 영역의 텍스트를 EasyOCR 또는 Tesseract로 실시간 인식합니다. 게임 UI, 일본어 자막, 중국어 UI 등 다양한 형식을 처리합니다.
- **다중 번역 엔진 지원**: Google Translate, DeepL, Yandex 등 여러 번역 서비스를 선택하거나 조합할 수 있습니다.
- **번역 오버레이**: 번역된 텍스트를 화면 위에 반투명 오버레이로 표시합니다. 게임을 플레이하면서 번역을 동시에 볼 수 있습니다.
- **EasyOCR 엔진**: 딥러닝 기반 OCR으로 50개 이상의 언어를 지원합니다. 일반적인 OCR이 실패하는 독특한 게임 폰트나 복잡한 배경에서도 높은 인식률을 보입니다.
- **Tesseract 엔진**: 전통적인 OCR 엔진으로 100개 이상의 언어를 지원합니다. EasyOCR보다 가볍고 CPU 사용량이 적습니다.
- **화면 영역 선택**: 전체 화면이 아닌 특정 영역만 선택해 번역할 수 있습니다. CPU/GPU 사용량을 최소화하면서 필요한 부분만 처리합니다.

### OCR 엔진 비교 — EasyOCR vs Tesseract

| 항목 | EasyOCR | Tesseract |
|------|---------|-----------|
| 방식 | 딥러닝 기반 | 전통 OCR |
| 속도 | 느림 (GPU 권장) | 빠름 |
| 정확도 | 복잡한 폰트/배경에서 우수 | 표준 텍스트에 좋음 |
| 언어 | 50개+ | 100개+ |
| 리소스 | GPU 사용 시 최적 | CPU만으로 충분 |

게임 번역에는 EasyOCR(폰트 다양성), 일반 문서 UI에는 Tesseract(속도)를 권장합니다.

### 번역 파이프라인 — 캡처부터 오버레이까지

```
화면 캡처 (Win32 API / GDI+)
    ↓
전처리 (노이즈 제거, 이진화)
    ↓
OCR (EasyOCR 또는 Tesseract)
    ↓
텍스트 정제 (오인식 수정, 언어 감지)
    ↓
번역 API 호출 (Google/DeepL/Yandex)
    ↓
오버레이 렌더링 (WPF 투명 창)
```

평균 파이프라인 시간: EasyOCR 2-4초, Tesseract 0.5-1.5초

## 기술 스택 / 아키텍처

| 항목 | 내용 |
|------|------|
| 언어 | C# |
| 프레임워크 | .NET 8, WPF |
| OCR | EasyOCR (Python 바인딩), Tesseract (C++) |
| 빌드 | Visual Studio 2022 |
| OS | Windows 10/11 |
| 별 | 5,200+ |
| 라이선스 | MIT |

## 설치 / 사용법

```bash
# 사전 요구사항
# - Windows 10/11
# - .NET 8 Runtime
# - (선택) CUDA GPU (EasyOCR 가속)

# 릴리즈 다운로드 방법
# GitHub Releases 탭에서 Translumo-v*.*.*.zip 다운로드
# 압축 해제 후 Translumo.exe 실행

# 소스 빌드
git clone https://github.com/ramjke/Translumo
cd Translumo
# Visual Studio 2022에서 Translumo.sln 열기
# Build → Build Solution (F6)
# Debug/Release 폴더에서 Translumo.exe 실행
```

사용:
1. Translumo 실행
2. "영역 선택" → 번역할 화면 영역 드래그
3. OCR 엔진 선택 (EasyOCR 권장)
4. 번역 엔진 선택 (DeepL 품질 우수)
5. "번역 시작" → 오버레이 표시

## 활용 사례 / 사용 시나리오

1. **일본어 게임 번역**: 공식 한국어 번역이 없는 일본어 게임의 대화와 UI를 실시간 번역합니다. EasyOCR이 게임 전용 폰트도 높은 정확도로 인식합니다.

2. **외국어 소프트웨어 사용**: 중국어, 러시아어 등 외국어로만 제공되는 전문 소프트웨어의 UI를 번역해 사용합니다. 전체 앱을 다시 번역 빌드하지 않아도 됩니다.

3. **동영상 하드 자막 번역**: 하드코딩된 자막이 있는 동영상을 재생하면서 Translumo로 자막 영역을 실시간 번역합니다. 공식 자막이 없는 외국어 교육 영상이나 다큐멘터리에 유용합니다.

## 결론

Translumo는 화면 텍스트 번역이라는 명확한 문제를 잘 해결한 전문 도구입니다. EasyOCR + DeepL 조합은 게임 번역에서 놀라운 정확도를 보여줍니다. .NET 8 기반의 깔끔한 C# 코드는 유지보수와 확장에 용이합니다. 외국어 콘텐츠에 접근성이 필요한 게이머, 연구자, 개발자에게 즉시 활용 가능한 도구입니다.

---

> 원문: https://github.com/ramjke/Translumo
