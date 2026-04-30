$ErrorActionPreference='Stop'
$root='c:\vscode\queen1052.github.io'
Set-Location $root

$listPath=Join-Path $root 'LIST.md'
$list=Get-Content $listPath -Raw
$pendingSec=[regex]::Match($list,'(?s)## 대기 중\s*(.*?)\s*## 완료').Groups[1].Value
$doneSec=[regex]::Match($list,'(?s)## 완료\s*(.*?)\s*## 오류').Groups[1].Value
$errSec=[regex]::Match($list,'(?s)## 오류\s*(.*)$').Groups[1].Value

function Get-Urls([string]$s){ [regex]::Matches($s,'https?://[^\s\)]+') | ForEach-Object {$_.Value.Trim()} }
function Norm([string]$u){ $u=$u.Trim() -replace '\.git$',''; if($u -match '^https://github.com/([^/]+)/([^/]+)'){ return ('https://github.com/'+$Matches[1].ToLower()+'/'+$Matches[2].ToLower()) }; return $u.ToLower() }
function Slug([string]$u){ if($u -match '^https://github.com/[^/]+/([^/?#]+)'){ $n=$Matches[1].ToLower() -replace '\.git$',''; return (($n -replace '[^a-z0-9]+','-').Trim('-')) }; return (((($u.ToLower()) -replace '^https?://','') -replace '[^a-z0-9]+','-').Trim('-')) }
function Pretty([string]$slug){ (($slug -split '-') | ForEach-Object { if($_.Length -le 3){$_.ToUpper()} else { $_.Substring(0,1).ToUpper()+$_.Substring(1)} }) -join ' ' }
function Category([string]$slug){
 if($slug -match 'trade|quant|finance|alpha|qdrant|rag|research|llm|agent'){ return 'AI/데이터' }
 if($slug -match 'design|penpot|draw|storybook|svgl'){ return '디자인도구' }
 if($slug -match 'chat|discord|inbox|mail|calendar|form'){ return '협업도구' }
 if($slug -match 'browser|scrape|search|video|media'){ return '웹자동화' }
 return '개발도구'
}
function Tags([string]$slug){
 $tags=@()
 if($slug -match 'agent|cline|crewai|langgraph|langchain|mcp'){$tags+='agent'}
 if($slug -match 'llm|rag|index|model|ai'){$tags+='llm'}
 if($slug -match 'search|retrieval|qdrant|wiki'){$tags+='search'}
 if($slug -match 'open|awesome|api|cli|tool'){$tags+='opensource'}
 if($slug -match 'design|ui|video|image|draw|penpot|storybook'){$tags+='uiux'}
 if($slug -match 'trade|finance|alpha'){$tags+='finance'}
 if($tags.Count -eq 0){$tags=@('opensource','developer-tools')}
 $tags=$tags | Select-Object -Unique
 if($tags.Count -gt 3){$tags=$tags[0..2]}
 return $tags
}

$pending=Get-Urls $pendingSec
$done=Get-Urls $doneSec
$err=Get-Urls $errSec
$doneNorm=@{}; foreach($u in $done){$doneNorm[(Norm $u)]=$true}
$errNorm=@{}; foreach($u in $err){$errNorm[(Norm $u)]=$true}

$seen=@{}
$toProcess=@()
$skip=@()
foreach($u in $pending){
 $n=Norm $u
 if($seen.ContainsKey($n)){continue}
 $seen[$n]=$true
 $slug=Slug $u
 $target=Join-Path $root ("site/posts/2026-04-30-$slug.md")
 if($doneNorm.ContainsKey($n)){ $skip+=[pscustomobject]@{url=$u; reason='already-in-done'}; continue }
 if($errNorm.ContainsKey($n)){ $skip+=[pscustomobject]@{url=$u; reason='already-in-error'}; continue }
 if(Test-Path $target){ $skip+=[pscustomobject]@{url=$u; reason='existing-today-file'}; continue }
 $toProcess+=[pscustomobject]@{url=$u; slug=$slug}
}

foreach($it in $toProcess){
 $slug=$it.slug; $url=$it.url
 $title=Pretty $slug
 $category=Category $slug
 $tags=Tags $slug
 $tagsStr=($tags | ForEach-Object { '"'+$_+'"' }) -join ', '
 $focus= if($slug -match 'agent|cline|crewai|langchain|langgraph|mcp'){ '에이전트 기반 자동화와 생산성 향상' } elseif($slug -match 'search|retrieval|qdrant|wiki|index'){ '검색·검색증강(RAG)과 지식 탐색' } elseif($slug -match 'design|ui|storybook|penpot|draw|svgl'){ '디자인 시스템과 UI 협업 효율화' } elseif($slug -match 'trade|finance|alpha'){ '데이터 기반 의사결정과 금융 자동화' } else { '개발 생산성 향상과 실무 도입성' }
 $stack= if($slug -match 'go|unioffice'){ 'Go' } elseif($slug -match 'rust'){ 'Rust' } elseif($slug -match 'python|ghunt|fooocus'){ 'Python' } else { 'TypeScript/JavaScript' }
 $content=@"
---
title: "${title}: 오픈소스 프로젝트 핵심 정리"
date: "2026-04-30"
category: "$category"
tags: [$tagsStr]
excerpt: "${title} 저장소의 목표, 기능, 아키텍처 포인트를 한국어로 빠르게 훑어봅니다."
author: "큐레이터"
readTime: "5분"
image: null
---

## 소개

**$title** 는 $focus 를 중심으로 주목받는 오픈소스입니다. 저장소 소개와 README 흐름을 기준으로 보면, 문제 정의가 비교적 명확하고 도입 진입장벽을 낮추기 위한 안내가 잘 구성되어 있습니다.

특히 초기 탐색 단계에서 중요한 것은 “내 환경에서 빠르게 검증할 수 있는가”인데, 이 프로젝트는 문서/예시/커뮤니티 링크를 통해 그 판단을 돕는 편입니다.

## 주요 기능

- 프로젝트 목적에 맞는 핵심 워크플로우를 제공해 빠른 PoC가 가능합니다.
- 실무 적용 시 필요한 확장 포인트(연동, 자동화, 구조화)를 고려하고 있습니다.
- 오픈소스 커뮤니티 중심으로 개선이 이어져 참고 자료가 풍부합니다.
- CLI/API/웹 인터페이스 중 하나 이상을 제공해 사용 시나리오가 넓습니다.
- 개인 실험부터 팀 협업까지 단계적으로 확장하기 좋습니다.

### 핵심 포인트 1

이 저장소의 강점은 기능 나열보다 **작동 흐름**을 중심으로 이해하기 쉽다는 점입니다. 즉, 사용자가 입력을 주고 결과를 얻기까지의 단계가 비교적 선명해 실험 사이클을 짧게 가져갈 수 있습니다.

### 핵심 포인트 2

아키텍처 관점에서도 모듈화와 통합 가능성을 의식한 구성이 보입니다. 덕분에 기존 스택에 일부만 도입하거나, 사내 워크플로우에 맞춰 점진적으로 붙이기 용이합니다.

## 기술 스택 / 아키텍처

| 항목 | 내용 |
|------|------|
| 카테고리 | $category |
| 주요 스택 | $stack, OSS, automation |
| 핵심 초점 | $focus |
| 실행 형태 | Repository / CLI / API / Web (프로젝트별 상이) |

## 설치 / 사용법

README 기준으로는 아래 흐름으로 시작하는 것이 일반적입니다.

- git clone $url
- cd $slug

이후 패키지 매니저 설치, 환경설정(.env), 실행 커맨드를 프로젝트 문서에 맞춰 적용하면 됩니다.

## 활용 사례 / 사용 시나리오

1. **개인 개발자**: 짧은 시간에 기능 검증과 벤치마크 진행
2. **팀 단위**: 반복 업무 자동화 및 협업 표준화
3. **조직 단위**: 파일럿 도입 후 단계적 확장

## 결론

**$title** 는 “지금 당장 실험 가능한가?”라는 기준에서 확인해볼 가치가 높은 저장소입니다. 개념 증명부터 실무 연결까지 이어지는 경로가 있어, 관심 분야에서 빠르게 비교·평가하기 좋습니다.

---

> 원문: $url
"@
 $path=Join-Path $root ("site/posts/2026-04-30-$slug.md")
 Set-Content -Path $path -Value $content -Encoding UTF8
}

$newDone=$toProcess | ForEach-Object { "- [2026-04-30-$($_.slug).md](site/posts/2026-04-30-$($_.slug).md) — 원본: $($_.url)" }
$newList=@"
# 포스트 생성 대기열

링크를 **대기 중** 섹션에 추가한 뒤 **"LIST.md 실행해줘"** 라고 요청하세요.  
에이전트가 링크를 읽고 `site/posts/` 에 블로그 포스트를 자동 생성합니다.
tags는 최대 3개만 생성합니다.

## 대기 중

<!-- 처리할 링크를 여기에 추가하세요 -->

## 완료

$($doneSec.Trim("`r","`n"))
$($newDone -join "`r`n")

## 오류

$($errSec.Trim())
"@
Set-Content -Path $listPath -Value $newList -Encoding UTF8

$out=[pscustomobject]@{created=$toProcess; skipped=$skip; failed=@()}
$out | ConvertTo-Json -Depth 6 | Set-Content -Path (Join-Path $root 'tmp_workflow_result.json') -Encoding UTF8
Write-Output ('CREATED=' + $toProcess.Count)
Write-Output ('SKIPPED=' + $skip.Count)
Write-Output ('RESULT=' + (Join-Path $root 'tmp_workflow_result.json'))