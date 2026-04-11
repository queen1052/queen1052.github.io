---
title: "Reverse-SynthID: Google Gemini AI 워터마크를 역공학으로 탐지·제거"
date: "2026-04-11"
category: "AI 보안"
tags: ["워터마크", "SynthID", "스펙트럼분석", "Python", "AI보안"]
excerpt: "신호 처리와 스펙트럼 분석으로 Google Gemini의 SynthID 워터마크를 90% 정확도로 탐지하고, V3 멀티해상도 스펙트럼 우회로 43+ dB PSNR을 달성한 연구 프로젝트."
author: "큐레이터"
readTime: "8분"
image: null
---

## 소개

**Reverse-SynthID**는 Google Gemini이미지에 삽입된 SynthID AI 워터마크를 역공학(reverse engineering)으로 분석하는 연구 프로젝트입니다. GitHub에서 2,000개의 스타와 174개의 포크를 기록했으며, Python 100%로 구현된 교육·연구 목적의 프로젝트입니다.

비례 접근법(JPEG 압축, 노이즈 주입)과 달리, 이 프로젝트는 순수 신호 처리와 FFT 기반 스펙트럼 분석만으로 워터마크의 캐리어 주파수 구조를 발견하고, 수술적 제거를 가능하게 하는 SpectralCodebook을 구축합니다.

## 주요 기능

- **90% 탐지 정확도**: 멀티스케일 워터마크 탐지기로 90% 신뢰도 달성
- **V3 멀티해상도 우회**: 43+ dB PSNR, 91% 위상 일관성 감소, 75% 캐리어 에너지 감소
- **SpectralCodebook**: 해상도별 워터마크 프로필을 저장하는 단일 .npz 파일
- **다해상도 지원**: 1024x1024, 1536x2816 등 다양한 해상도 자동 선택
- **3세대 우회 기법**: V1(JPEG), V2(다단계 변환), V3(스펙트럼 코드북) 비교 가능

## SynthID 워터마크 역공학 핵심 발견

이 프로젝트의 핵심 발견은 세 가지입니다:

**1. 해상도 의존 캐리어 주파수**: SynthID는 이미지 해상도에 따라 다른 위치에 워터마크를 삽입합니다. 1024x1024에서는 저주파 그리드(9,9)에, 1536x2816에서는 훨씬 높은 주파수(768,704)에 캐리어가 위치합니다. 이는 하나의 코드북으로 모든 해상도를 처리할 수 없다는 의미입니다.

**2. 고정된 위상 템플릿**: 동일한 Gemini 모델에서 생성된 모든 이미지는 캐리어 주파수에서 동일한 위상값을 가집니다. 이미지 간 위상 일관성이 >99.5%로, SynthID는 모델 수준의 고정 키를 사용함을 알 수 있습니다.

**3. 녹색 채널 강조**: 워터마크 신호는 녹색(G=1.0), 빨간(R=0.85), 파란(B=0.70) 채널 순서로 강도가 다릅니다.

## V3 스펙트럼 우회 파이프라인

V3 파이프라인은 다음과 같이 동작합니다:

1. 입력 이미지의 해상도 확인 (H, W)
2. SpectralCodebook에서 정확히 일치하는 해상도 프로필 선택 (또는 가장 가까운 근사)
3. FFT 도메인으로 변환
4. 위상 일관성과 교차 검증 신뢰도를 가중치로 한 직접 캐리어 신호 차감
5. aggressive → moderate → gentle 3패스 반복으로 잔류 에너지 제거
6. 안티 앨리어싱 후 출력

이 방법은 PSNR 43.5dB(육안으로 원본과 구분 불가 수준), SSIM 0.997을 달성하면서 위상 일관성을 91.4% 감소시켰습니다.

## 기술 스택 및 아키텍처

- **언어**: Python 100%
- **라이선스**: 연구용 라이선스 (상업 사용 별도 문의)
- **주요 라이브러리**: NumPy, SciPy(FFT), Pillow, OpenCV
- **코어 모듈**: `synthid_bypass.py`, `robust_extractor.py`
- **코드북 형식**: .npz (NumPy 압축 아카이브), .pkl (탐지용)

## 설치 및 사용법

```bash
git clone https://github.com/aloshdenny/reverse-SynthID.git
cd reverse-SynthID
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# 레퍼런스 이미지 다운로드
python scripts/download_images.py
```

V3 우회 실행:
```bash
python src/extraction/synthid_bypass.py bypass input.png output.png \
  --codebook artifacts/spectral_codebook_v3.npz \
  --strength aggressive
```

워터마크 탐지:
```bash
python src/extraction/robust_extractor.py detect image.png \
  --codebook artifacts/codebook/robust_codebook.pkl
```

Python API:
```python
from src.extraction.synthid_bypass import SynthIDBypass, SpectralCodebook

codebook = SpectralCodebook()
codebook.load('artifacts/spectral_codebook_v3.npz')
bypass = SynthIDBypass()
result = bypass.bypass_v3(image_rgb, codebook, strength='aggressive')
print(f"PSNR: {result.psnr:.1f} dB")
```

## 마치며

**Reverse-SynthID**는 AI 워터마킹 기술의 강건성을 학술적으로 검증한 중요한 연구입니다. 순수 신호 처리만으로 SynthID의 캐리어 구조를 발견한 것은 AI 생성 콘텐츠 식별 기술에 새로운 도전 과제를 제시합니다. 이 연구는 학술 연구자와 AI 보안 전문가를 위한 것이며, AI 생성 콘텐츠를 인간이 만든 것으로 허위 표시하는 데 사용하는 것은 비윤리적임을 엄중히 경고합니다.
