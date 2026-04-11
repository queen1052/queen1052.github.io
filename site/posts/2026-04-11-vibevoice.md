---
title: "VibeVoice: Microsoft 오픈소스 프론티어 음성 AI — ASR·TTS·실시간 스트리밍"
date: "2026-04-11"
category: "AI 음성"
tags: ["TTS", "ASR", "음성AI", "Microsoft", "실시간"]
excerpt: "60분 단일패스 ASR, 90분 멀티스피커 TTS, 300ms 실시간 스트리밍을 지원하는 Microsoft의 오픈소스 프론티어 음성 AI 모델 패밀리."
author: "큐레이터"
readTime: "8분"
image: null
---

## 소개

**VibeVoice**는 Microsoft가 공개한 오픈소스 프론티어 음성 AI 모델 패밀리입니다. GitHub에서 38,500개 이상의 스타를 획득했으며, Python 100%로 구현된 MIT 라이선스 프로젝트입니다.

VibeVoice는 세 가지 핵심 모델로 구성됩니다: 60분 장편 음성 인식 모델(VibeVoice-ASR-7B), 90분 멀티스피커 텍스트-음성 변환 모델(VibeVoice-TTS-1.5B), 0.5B 파라미터의 실시간 스트리밍 TTS(VibeVoice-Realtime-0.5B). 연속 음성 토크나이저를 활용한 차세대 아키텍처로, ICLR 2026 Oral로 채택되었습니다.

## 주요 기능

- **60분 단일패스 ASR**: 64K 토큰 컨텍스트로 최대 60분 오디오를 청크 없이 처리
- **화자 구분(Diarization)**: 누가(Who), 언제(When), 무엇을(What) 구조화된 트랜스크립트
- **커스텀 핫워드**: 도메인 특화 용어, 이름, 기술 용어를 사전 등록하여 인식 정확도 향상
- **50개 언어 지원**: 한국어 포함 다국어 ASR 지원
- **90분 멀티스피커 TTS**: 최대 4명 화자의 자연스러운 대화 합성
- **300ms 실시간 TTS**: 스트리밍 텍스트 입력을 처리하는 저지연 TTS

## VibeVoice-ASR 심층 분석

기존 ASR 시스템의 핵심 한계는 짧은 청크 방식입니다. Whisper 등 기존 모델은 30초 단위로 오디오를 분할하여 처리하므로, 화자 전환이나 긴 대화 문맥이 유지되지 않습니다.

VibeVoice-ASR-7B는 7B 파라미터 LLM을 음성 인코더와 결합하여 64K 토큰 컨텍스트 내에서 전체 회의나 강연을 한 번에 처리합니다. 이를 통해 화자 일관성, 장거리 참조(대명사 해소), 주제 전환 감지가 크게 개선됩니다.

vLLM 추론 지원으로 서버 규모의 배치 처리도 가능하며, 파인튜닝 코드까지 공개되어 특정 도메인(의료, 법률, 기술)에 최적화된 커스텀 ASR 모델을 학습할 수 있습니다.

## VibeVoice-TTS와 Realtime 모델

VibeVoice-TTS-1.5B는 연속 음성 토크나이저(7.5Hz 초저프레임율)를 활용합니다. LLM이 텍스트를 이해하고 대화 흐름을 파악한 후, 확산(diffusion) 헤드가 고품질 음향 세부사항을 생성합니다.

최대 4명 화자가 등장하는 45분 대화 오디오를 단일패스로 합성할 수 있으며, 영어·중국어 등 다국어를 지원합니다. ICLR 2026 Oral 선정은 이 아키텍처의 학술적 우수성을 인정받은 결과입니다.

VibeVoice-Realtime-0.5B는 0.5B 파라미터의 경량 모델로, 첫 음성 출력까지 ~300ms의 낮은 레이턴시를 달성합니다. 9개 언어(독일어, 프랑스어, 이탈리아어, 일본어, 한국어 등)와 11가지 영어 스타일 음성을 실험적으로 지원합니다.

## 기술 스택 및 아키텍처

- **언어**: Python 100%
- **라이선스**: MIT (TTS 코드는 책임있는 AI 정책으로 일부 제한)
- **베이스 모델**: Qwen2.5-1.5B (Realtime), 7B LLM (ASR)
- **음성 토크나이저**: 연속 음성 토크나이저 (7.5Hz)
- **생성 방식**: Next-token diffusion
- **추론**: 표준 Transformers + vLLM 지원 (ASR)
- **파인튜닝**: 공개 파인튜닝 코드 제공

## 설치 및 사용법

```bash
pip install transformers torch
```

VibeVoice-ASR 사용 (Transformers):
```python
from transformers import AutoModel, AutoProcessor

processor = AutoProcessor.from_pretrained("microsoft/VibeVoice-ASR")
model = AutoModel.from_pretrained("microsoft/VibeVoice-ASR")

# 오디오 파일 처리
audio, sr = librosa.load("meeting.wav", sr=16000)
inputs = processor(audio, return_tensors="pt")
outputs = model.generate(**inputs, max_new_tokens=4096)
transcript = processor.decode(outputs[0])
print(transcript)  # Who/When/What 구조화된 트랜스크립트
```

Realtime TTS 사용:
```python
# Colab 노트북: github.com/microsoft/VibeVoice/blob/main/demo/vibevoice_realtime_colab.ipynb
```

## 마치며

**VibeVoice**는 음성 AI 분야에서 Microsoft의 강력한 오픈소스 기여입니다. 60분 단일패스 ASR은 회의 자동 요약·자막 생성에 게임체인저이며, 90분 멀티스피커 TTS는 팟캐스트·오디오북 자동 제작을 뒤흔들 기술입니다. ICLR 2026 Oral 채택과 38.5k 스타는 기술과 커뮤니티 반응 모두에서 최고 수준임을 입증합니다. 음성 AI 프로젝트를 구축한다면 VibeVoice는 필수 탐색 대상입니다.
