---
title: "LlamaFactory: 100개 이상의 LLM을 제로코드 CLI와 웹 UI로 파인튜닝하는 통합 프레임워크"
date: "2026-04-11"
category: "AI 모델 학습"
tags: ["파인튜닝", "LLM", "LoRA"]
excerpt: "Amazon, NVIDIA, Alibaba Cloud가 사용하는 LLaMA·Qwen·Gemma 등 100개 이상의 LLM을 통합 파인튜닝하는 ACL 2024 논문 기반 프레임워크로 69.9k 스타를 보유합니다."
author: "큐레이터"
readTime: "9분"
image: null
---

## LlamaFactory란?

**LlamaFactory**는 "Unified Efficient Fine-Tuning of 100+ LLMs & VLMs"라는 타이틀처럼, 100개 이상의 대형 언어 모델과 비전-언어 모델을 제로 코드 CLI와 웹 UI(LLaMA Board)로 통합 파인튜닝할 수 있는 오픈소스 프레임워크입니다.

ACL 2024(계산 언어학 연례회의)에서 시스템 데모로 발표된 연구에서 출발했으며, GitHub 스타 69,900개를 보유하고 Amazon, NVIDIA, Alibaba Cloud(Aliyun) 등 대기업들이 실제 프로덕션에서 사용합니다. 265명의 기여자가 활발하게 개발 중이며 Python 99.7%로 구현되어 Apache-2.0 라이선스로 공개되었습니다.

## 주요 기능

LlamaFactory가 제공하는 핵심 기능들을 살펴보겠습니다.

**통합된 훈련 방법**: Full 파인튜닝, Freeze, LoRA, QLoRA, GaLore, APOLLO, BAdam, OFT를 단일 인터페이스로 지원합니다. 4비트 양자화(QLoRA)를 사용하면 단 6GB VRAM으로도 7B 모델을 파인튜닝할 수 있습니다.

**광범위한 모델 지원**: Llama 3~4, Qwen 2.5~3, Mistral, Gemma 3, Phi-4, GLM-4, DeepSeek V3, GPT-OSS, Claude (로컬 파인튜닝), TeleChat 등 100개 이상의 모델을 지원하며 계속 업데이트됩니다.

**실용적 트릭**: FlashAttention-2, Unsloth, Liger Kernel, KTransformers, RoPE 스케일링, NEFTune, rsLoRA 등 최신 효율화 기법을 즉시 사용 가능합니다.

**다양한 작업 유형**: 멀티턴 대화, 도구 사용, 이미지 이해, 비주얼 그라운딩, 오디오 이해, 비디오 인식 등 다양한 태스크를 지원합니다.

**실험 모니터링**: LlamaBoard, TensorBoard, Weights & Biases, MLflow, SwanLab 등 여러 실험 추적 도구와 통합됩니다.

## 지원 모델 목록 (주요)

| 모델 군 | 크기 범위 |
|---------|---------|
| LLaMA 3~4 | 1B~405B |
| Qwen 2.5~3 | 0.5B~72B |
| Mistral/Mixtral | 7B~8x22B |
| Gemma 3/3n | 270M~27B |
| Phi-4/mini | 3.8B~14B |
| GLM-4/GLM-Z1 | 9B~32B |
| DeepSeek V3/R2 | 7B~671B |
| GPT-OSS | 20B~120B |

reasoning 버전과 non-reasoning 버전이 있는 모델은 `_nothink` 접미사로 구분합니다 (예: `qwen3`, `qwen3_nothink`).

## 하드웨어 요구사항

| 방법 | 비트 | 7B | 13B | 30B | 70B |
|------|-----|----|-----|-----|-----|
| Full (bf16) | 32 | 120GB | 240GB | 600GB | 1200GB |
| LoRA/QLoRA | 16 | 16GB | 32GB | 64GB | 160GB |
| **QLoRA** | **8** | **10GB** | **20GB** | **40GB** | **80GB** |
| **QLoRA** | **4** | **6GB** | **12GB** | **24GB** | **48GB** |
| **QLoRA** | **2** | **4GB** | **8GB** | **16GB** | **24GB** |

4비트 QLoRA로 7B 모델을 단 6GB VRAM(소비자용 RTX 3060 수준)에서 파인튜닝할 수 있습니다.

## 설치 및 사용법

**설치**:
```bash
git clone --depth 1 https://github.com/hiyouga/LlamaFactory.git
cd LlamaFactory
pip install -e .
```

**LoRA 파인튜닝 (3단계)**:
```bash
# 1. 파인튜닝
llamafactory-cli train examples/train_lora/qwen3_lora_sft.yaml

# 2. 추론 (Chat)
llamafactory-cli chat examples/inference/qwen3_lora_sft.yaml

# 3. LoRA 병합 및 내보내기
llamafactory-cli export examples/merge_lora/qwen3_lora_sft.yaml
```

**웹 UI (LLaMA Board)**:
```bash
llamafactory-cli webui
```

**Docker 실행**:
```bash
# CUDA 사용자
cd docker/docker-cuda/
docker compose up -d
docker compose exec llamafactory bash
```

**OpenAI 스타일 API 배포**:
```bash
API_PORT=8000 llamafactory-cli api examples/inference/qwen3.yaml \
  infer_backend=vllm vllm_enforce_eager=true
```

**YAML 설정 예시** (`train_lora/qwen3_lora_sft.yaml`):
```yaml
model_name_or_path: Qwen/Qwen3-4B-Instruct
finetuning_type: lora
lora_target: all
dataset: alpaca_en
template: qwen3
cutoff_len: 2048
num_train_epochs: 3.0
per_device_train_batch_size: 2
gradient_accumulation_steps: 4
lr_scheduler_type: cosine
learning_rate: 1.0e-4
```

## 마치며

LlamaFactory는 LLM 파인튜닝의 높은 진입 장벽을 획기적으로 낮춥니다. 100개 이상의 다양한 모델을 단일 인터페이스로 지원하고, 6GB VRAM으로도 7B 모델을 파인튜닝할 수 있으며, 코드 없이 웹 UI에서 시각적으로 실험할 수 있습니다. Amazon, NVIDIA, Alibaba Cloud의 채택은 프로덕션 신뢰성을 입증합니다. 커스텀 도메인 LLM을 만들거나 도메인 특화 지식을 모델에 주입하고 싶은 개발자와 연구자에게 최고의 출발점입니다.
