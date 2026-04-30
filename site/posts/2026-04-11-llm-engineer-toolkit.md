---
title: "LLM Engineer Toolkit: 120+ LLM 라이브러리 완전 가이드"
date: "2026-04-11"
category: "AI/LLM"
tags: ["LLM", "AI 에이전트", "RAG"]
excerpt: "훈련, 추론, 에이전트, RAG, 평가, 모니터링까지 120+ LLM 라이브러리를 카테고리별로 정리한 종합 가이드. Apache-2.0, 10.1k 스타."
author: "큐레이터"
readTime: "8분"
image: null
---

## 소개

LLM Engineer Toolkit은 LLM 엔지니어링의 전체 스택을 커버하는 120+ 라이브러리 큐레이션입니다. Kalyan KS NLP가 관리하는 이 저장소는 훈련/파인튜닝부터 추론, 에이전트, RAG, 평가, 모니터링, 보안까지 모든 범주를 체계적으로 분류합니다.

GitHub에서 10.1k 스타, 1.6k 포크를 달성한 이 프로젝트는 Apache-2.0 라이선스로 배포됩니다. LinkedIn에서 AIxFunda 무료 뉴스레터를 통해 매주 GenAI 업데이트와 논문 요약을 제공합니다.

## LLM 훈련 및 파인튜닝

**핵심 라이브러리:**
- **Unsloth**: LLM을 더 빠르게 적은 메모리로 파인튜닝
- **PEFT**: 최신 파라미터 효율적 파인튜닝(Parameter-Efficient Fine-Tuning)
- **TRL**: 강화학습으로 언어 모델 훈련
- **Transformers**: 수천 개의 사전학습 모델 (Hugging Face)
- **Axolotl**: 다양한 AI 모델의 포스트 트레이닝 스트림라인
- **LlamaFactory**: 쉽고 효율적인 LLM 파인튜닝
- **torchtune**: LLM 파인튜닝을 위한 PyTorch 네이티브 라이브러리
- **DeepSpeed**: 분산 훈련 및 추론 최적화 라이브러리

## LLM 애플리케이션 개발

**프레임워크:**
- **LangChain**: LLM 기반 애플리케이션 개발 프레임워크
- **LlamaIndex**: LLM 애플리케이션을 위한 데이터 프레임워크
- **Haystack**: LLM 기반 엔드투엔드 프레임워크
- **Prompt flow**: LLM 앱 개발 사이클 간소화 도구
- **Griptape**: AI 기반 애플리케이션을 위한 모듈식 Python 프레임워크

**멀티 API 접근:**
- **LiteLLM**: OpenAI 포맷으로 100+ LLM API 호출
- **AI Gateway**: 200+ LLM, 50+ AI 가드레일의 통합 고속 게이트웨이

**메모리:**
- **mem0**: AI 앱을 위한 메모리 레이어
- **Letta (MemGPT)**: 고급 추론과 투명한 장기 메모리를 가진 상태 저장형 LLM 앱 프레임워크

**인터페이스:**
- **Streamlit**: Python 스크립트를 대화형 웹 앱으로 변환
- **Gradio**: Python으로 ML 앱 빌드 및 공유
- **Chainlit**: 몇 분 안에 대화형 AI 애플리케이션 구축

## LLM 에이전트 생태계

에이전트 분야는 가장 빠르게 성장하는 영역입니다.

**오케스트레이션 프레임워크:**
- **CrewAI**: 역할 기반 자율 AI 에이전트 오케스트레이션
- **LangGraph**: 그래프로 탄력적인 언어 에이전트 구축
- **AutoGen**: AI 에이전트 시스템을 위한 오픈소스 프레임워크
- **Smolagents**: 몇 줄의 코드로 강력한 에이전트 구축
- **Pydantic AI**: 생산 등급 AI 애플리케이션 구축용 Python 에이전트 프레임워크

**도구 및 유틸리티:**
- **Composio**: AI 에이전트용 프로덕션 레디 툴셋
- **Browser Use**: AI 에이전트가 웹사이트에 접근 가능하게 하는 도구
- **Swarms**: 엔터프라이즈급 멀티 에이전트 오케스트레이션
- **AgentStack**: AI 에이전트를 빠르게 구축하는 가장 빠른 방법

## RAG 및 데이터 추출

**RAG:**
- **LangChain RAG**, **LlamaIndex RAG** 등 주요 프레임워크 RAG 기능
- **GPTCache**: LLM 쿼리용 시맨틱 캐시 라이브러리 (비용 10배 절감)

**데이터 추출:**
- **Crawl4AI**: LLM 친화적 오픈소스 웹 크롤러 & 스크래퍼
- **Docling**: 문서를 원하는 형식으로 파싱 및 내보내기
- **Llama Parse**: 복잡한 문서 데이터를 파싱하는 GenAI 네이티브 파서
- **Crawlee**: 웹 스크래핑 및 브라우저 자동화 라이브러리

## LLM 추론 및 서빙

**추론:**
- **llama.cpp**: C/C++로 LLM 추론
- **Ollama**: 로컬 LLM 추론
- **vLLM**: 고처리량 및 메모리 효율적 LLM 추론/서빙 엔진
- **TensorRT-LLM**: LLM 추론 최적화 라이브러리 (NVIDIA)

**서빙:**
- **LitServe**: FastAPI 기반 고속 AI 모델 서빙 엔진 (배칭, 스트리밍, GPU 자동 스케일링)
- **Langcorn**: FastAPI로 LangChain 앱 자동 서빙

## 평가 및 모니터링

**평가:**
- **Evals** (OpenAI): LLM 평가 프레임워크 및 오픈소스 벤치마크 레지스트리
- **Opik**: 오픈소스 엔드투엔드 LLM 개발 플랫폼 (평가 포함)
- **UQLM**: 불확실성 정량화를 통한 LLM 헬루시네이션 감지

**모니터링:**
- **MLflow**: 엔드투엔드 MLOps/LLMOps 플랫폼
- **LangSmith**: LLM 애플리케이션 로깅, 모니터링, 개선 도구
- **Helicone**: 오픈소스 LLM 관찰 가능성 플랫폼
- **Phoenix**: 실험, 평가, 트러블슈팅을 위한 AI 관찰 가능성 플랫폼

## LLM 안전성 및 보안

- **Guardrails**: LLM에 가드레일 추가
- **LLM Guard**: LLM 상호작용 보안 툴킷
- **NeMo Guardrails**: LLM 기반 대화 시스템에 프로그래밍 가능한 가드레일
- **Garak**: LLM 취약점 스캐너
- **DeepTeam**: LLM 레드 팀 프레임워크

## 구조화 출력 및 기타 도구

**구조화 출력:**
- **Instructor**: Pydantic 기반 LLM 구조화 출력 Python 라이브러리
- **Outlines**: 강건한 구조화 텍스트 생성
- **Guidance**: 언어 모델을 조종하는 효율적 프로그래밍 패러다임

**기타:**
- **pandas-ai**: 데이터베이스(SQL, CSV, pandas 등)와 채팅
- **Vanna**: LLM + RAG를 통한 정확한 Text-to-SQL
- **mergekit**: 사전학습 LLM 병합 도구
- **EasyEdit**: LLM 지식 편집 프레임워크

## 마치며

LLM Engineer Toolkit은 LLM 엔지니어링 생태계의 나침반입니다. 매주 새로운 라이브러리가 등장하는 빠른 변화 속에서, 카테고리별로 검증된 도구를 찾는 시간을 크게 줄여줍니다.

훈련부터 프로덕션 배포까지 전체 LLM 스택을 커버하며, 특히 에이전트, RAG, 평가/모니터링 카테고리는 현재 가장 활발한 개발이 이루어지고 있습니다. AIxFunda 뉴스레터(aixfunda.substack.com)를 구독하면 매주 최신 업데이트와 논문 요약을 받을 수 있습니다.
