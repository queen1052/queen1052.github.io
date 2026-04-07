---
title: GitHub 블로그 만들기 기록 - 1
author: Dev
date: 2024-05-31 23:14:42 +0900
categories: [Blog]
tags: [GitHub, blog, GitHub blog]
---

## GitHub Blog 만들기
---
[GitHub 블로그 만들기 기록 - 1](/posts/first-step-new-blog/)

[GitHub 블로그 만들기 기록 - 2](/posts/second-step-new-blog/)

<br>
<br>


> 본 포스팅에서는 GitHub repository 만들기에 대해서 설명한다.
> - GitHub 블로그란?
> - GitHub 만들기

## GitHub 블로그란?

블로그를 내가 원하는 형태로 정리하고 써보고 싶은 생각이 있었다. 네이버 블로그나 티스토리 블로그를 사용 해보는데 뭔가 마음에 들지않는다. 다른 블로그를 찾던 중 GitHub에서 page를 이용해 블로그를 만들 수 있다는 정보를 보고 만들어보게 됐다.

GitHub repository를 만들어서 소스코드를 저장하고 page 기능을 통해 블로그를 만들 수 있다.
> **[GitHub Pages](https://pages.github.com/){:target="_blank"}*

1. 장점은 내 마음대로 만들 수 있다는 것 같다.
md 파일을 html로 변환해서 정적인 블로그를 제공한다.

1. 단점은 md 언어를 알아야하고 하나하나 수작업으로 해야하는 것 같다.;; 고난의 길이 예상된다.

## GitHub 만들기

1. GitHub repository 만들기

**[GitHub](https://github.com/){:target="_blank"}**에서 <kbd>Sign up for GitHub</kbd>를 눌러 회원가입하고, repository로 이동하여 repository를 생성한다.
이름은 id.github.io 로 생성한다. 그래야 블로그 도메인이 간단하게 만들어니다. id와 repository의 이름이 다르면 도메인이 id.github.io/reposotiry 이름으로 길게 생성이 된다.

![img](/assets/img/2024-06-01/2024-06-01-create-a-new-repository.png)*GitHub repository 생성*

<!-- <img
  src="/assets/img/2024-06-01/2024-06-01-create-a-new-repository.png"
  width="10%"
  height="20%"
/> -->

2. repository-settings-pages

생성된 repository에서 settings를 클릭하여 settings로 이동한다. 왼쪽을 보면 pages가 보이는데 클릭하면 아래와 같은 설정 화면이 나타난다. 별도로 손댈 곳은 없고 Branch는 main으로 하고 저장한다. 코드를 로컬에 pull 해서 이후는 코드 작성 후 commit/push 하면 시간이 좀 지나서 위에서 생성했던 repository url로 접속이 가능하다. deploy 하는데 시간이 좀 걸린다.

![img](/assets/img/2024-06-01/2024-06-01-github-pages-settings.png)*GitHub settings pages*

3. deploy 진행 보기

시간이 오래 걸려도 deploy가 안되서 강제로 진행 해보기로 했다. 아래 그림에서 action이나 Deployment를 클릭하면 deploy 상태를 볼 수 있다.

![img](/assets/img/2024-06-03/2024-06-03-github-deploy.png)*GitHub deploy*

아래와 같이 초록색이면 정상이고, 비정상이면 빨간색이 표시된다. 클릭해보면 상세하게 나온다.

![img](/assets/img/2024-06-03/2024-06-03-github-delpoy-state.png)*GitHub deploy*