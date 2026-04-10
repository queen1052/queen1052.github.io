---
title: "TurboQuant+: LLM KV 캐시를 최대 6.4배 압축하는 오픈소스 프로젝트"
date: "2026-04-10"
category: "오픈소스"
tags: ["LLM", "양자화", "KV캐시", "llama.cpp", "Apple Silicon"]
excerpt: "ICLR 2026 논문을 구현한 TurboQuant+. llama.cpp에서 PolarQuant + Walsh-Hadamard 회전으로 KV 캐시를 최대 6.4배 압축하면서도 q8_0 수준의 속도와 품질을 유지합니다."
author: "큐레이터"
readTime: "6분"
image: null
---

## 소개

[TurboQuant+](https://github.com/TheTom/turboquant_plus)는 Google Research가 ICLR 2026에서 발표한 [TurboQuant 논문](https://arxiv.org/abs/2504.19874)의 실험적 구현체입니다. LLM 추론 시 메모리를 가장 많이 차지하는 KV(Key-Value) 캐시를 최대 6.4배 압축하여 로컬 환경에서 더 큰 모델, 더 긴 컨텍스트를 다룰 수 있게 해줍니다.

현재 GitHub에서 **6,000+ stars, 832 forks**를 받고 있으며, M1부터 M5 Max까지의 Apple Silicon, NVIDIA RTX, AMD RDNA 4에서 커뮤니티 검증을 완료한 상태입니다.

## 핵심 아이디어: KV 캐시 압축

트랜스포머 모델에서 긴 컨텍스트를 처리할 때 KV 캐시는 메모리의 상당 부분을 차지합니다. TurboQuant+는 두 가지 핵심 기법을 결합합니다.

1. **PolarQuant**: 벡터의 크기(norm)를 별도로 저장하고 방향만 양자화
2. **Walsh-Hadamard Transform (WHT)**: 회전을 통해 코디네이트를 가우시안 분포에 가깝게 만들어 양자화 오차 최소화

실제 Qwen3 모델 KV 텐서에서 회전 후 kurtosis가 **900 → 2.9** (가우시안 ≒ 3.0)으로 정규화됨을 확인했습니다.

## 주요 포맷과 성능

| 포맷 | 비트수 | 압축률 | PPL 증가 (vs q8_0) |
|------|--------|--------|---------------------|
| turbo4 | 4.25-bit | 3.8x | +0.23% |
| turbo3 | 3.5-bit | 4.6x | +1.06% |
| turbo2 | 2.5-bit | 6.4x | +6.48% |

turbo4는 q4_0보다 높은 압축률에서도 더 나은 품질을 제공합니다. M5 Max 128GB 기준 q8_0과 prefill 속도가 동일하며, 104B 모델을 128K 컨텍스트로 실행하는 데도 성공했습니다.

## 주목할 만한 추가 발견

- **V 압축은 무손실에 가깝다**: Value 캐시를 2-bit까지 압축해도 품질 손실이 거의 없음. Key 정밀도 유지가 핵심
- **Boundary V**: 첫 2개 + 마지막 2개 레이어만 q8_0으로 유지하고 나머지는 turbo2-V로 압축 → 품질 손실의 37~91% 회복
- **Sparse V**: 어텐션 가중치가 낮은 V 위치의 역양자화를 건너뜀 → 32K 컨텍스트에서 최대 **+22.8% decode 속도** 향상

## 설치 및 사용법

### Python 프로토타입 (모델 없이 테스트 가능)

```bash
git clone https://github.com/TheTom/turboquant_plus.git
cd turboquant_plus
python3 -m venv .venv && source .venv/bin/activate
pip install -e ".[dev]"

# 빠른 데모
python3 benchmarks/demo.py
```

### llama.cpp 포크 빌드 (Apple Silicon)

```bash
git clone https://github.com/TheTom/llama-cpp-turboquant.git
cd llama-cpp-turboquant
cmake -B build -DGGML_METAL=ON -DGGML_METAL_EMBED_LIBRARY=ON -DCMAKE_BUILD_TYPE=Release
cmake --build build -j
```

### 추론 실행

```bash
# turbo3 KV 캐시로 서버 모드 실행
./build/bin/llama-server \
  -m models/your-model.gguf \
  -ngl 99 -c 262144 -fa on \
  --cache-type-k turbo3 --cache-type-v turbo3

# Q4_K_M 모델에는 비대칭 설정 권장
./build/bin/llama-server -m model-Q4_K_M.gguf -ctk q8_0 -ctv turbo4 -fa 1
```

## 결론

로컬 LLM 추론 환경에서 메모리 제약 없이 더 긴 컨텍스트를 다루고 싶다면 TurboQuant+는 매우 실용적인 선택입니다. 특히 MacBook에서 대형 모델을 사용하는 개발자나 연구자에게 추천합니다. Apple Silicon, CUDA, AMD 모두 지원하며 커뮤니티가 활발하게 성장 중입니다.

---

> 원문: https://github.com/TheTom/turboquant_plus
