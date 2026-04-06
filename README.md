# queen1052.github.io — DevCenter 안내

이 저장소는 Jekyll 테마 "Chirpy"를 사용한 정적 사이트 소스입니다. DevCenter(로컬 작업 폴더)에서 수정 · 개발 · 배포하기 위한 간단한 안내를 아래에 정리했습니다.

요약
- 원본 레포지토리: https://github.com/queen1052/queen1052.github.io
- 위치(로컬): DevCenter/queen1052.github.io
- 주요 목적: 로컬에서 수정 → 빌드 → 배포(예: GitHub Pages)

프로젝트 구조 (주요 폴더/파일)
- _config.yml        : 사이트 전역 설정
- _posts/            : 블로그 포스트(마크다운)
- _layouts/ _includes/: Jekyll 레이아웃/템플릿
- assets/            : 정적 자산(CSS/JS/이미지)
- _data/             : 사이트 데이터(예: nav, authors)
- tools/             : 빌드/배포 도우미 스크립트(있는 경우)
- package.json       : 프론트엔드 빌드(예: gulp) 의존성
- README.md          : (이 파일) 프로젝트 설명

개발환경(권장)
- 로컬에 Ruby/Jekyll을 직접 설치할 수 있지만, 환경 충돌을 피하려면 Docker 사용을 권장합니다.
- Node.js/NPM은 assets 빌드(gulp)를 위해 필요할 수 있습니다. 필요 시 nvm/pnpm/volta로 설치하세요.

로컬 개발(빠른 시작)
1) Docker를 사용해 로컬 서버 실행 (포트 4000):
   docker run -it --rm -p 4000:4000 -v "$PWD:/srv/jekyll" jekyll/jekyll jekyll serve --watch
   브라우저: http://localhost:4000

2) 또는 Docker로 프로덕션 빌드(_site 생성):
   docker run -it --rm --env JEKYLL_ENV=production -v "$PWD:/srv/jekyll" jekyll/jekyll jekyll build
   생성 결과: ./_site/

프론트엔드(자산) 빌드
- package.json에 정의된 gulp 의존성이 있습니다. 로컬 Node 환경에서 다음을 실행하세요:
  npm install
  npm run build  # 필요에 따라 gulp 명령을 직접 사용
- Docker만으로는 일부 자산 빌드가 생략될 수 있으니, CSS/JS 변경 시 Node 빌드를 권장합니다.

검증(빌드 상태 점검)
- 빌드가 성공하면 _site/ 폴더가 생성됩니다. 내부 index.html이 있는지 확인하세요.
- 사이트 미리보기는 jekyll serve로 확인합니다.

배포
- GitHub Pages 사용 권장: 레포지토리의 GitHub Actions(.github/workflows/pages-deploy.yml.hook 또는 pages-deploy.yml)가 준비되어 있으면 이를 활성화해 자동 배포할 수 있습니다.
- 수동 배포: _site/에 생성된 파일을 gh-pages 브랜치 또는 호스팅 서버에 업로드하세요.
- tools/deploy.sh 또는 .github/workflows가 있으면 스크립트/워크플로우를 확인하고 필요 시 수정하세요.

수정 시 주의사항
- _config.yml의 url/baseurl 값을 배포 환경에 맞게 설정하세요.
- 테마(Chirpy) 파일을 직접 수정한 경우 업데이트 병합 시 충돌 가능 — 커밋/백업 권장.

문제 해결(빠른 팁)
- jekyll 명령이 없고 로컬 설치가 어렵다면 Docker 사용
- 빌드 에러 발생 시: 먼저 bundle 또는 npm 의존성 문제인지 로그를 확인
- GitHub Actions에서 빌드 실패 시 workflow 로그를 확인

내가 지금 한 일
- 레포지토리 구조를 분석하고 README.md를 이 파일로 업데이트했습니다.
- Docker를 사용해 프로덕션 빌드를 시도하여 상태를 점검했습니다. 빌드 결과는 아래에 이어집니다.

---
(아래에는 빌드 로그와 최종 상태가 자동으로 추가됩니다.)
