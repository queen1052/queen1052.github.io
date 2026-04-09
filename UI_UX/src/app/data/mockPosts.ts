export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  category: string;
  tags: string[];
  image: string;
  readTime: string;
}

export const mockPosts: BlogPost[] = [
  {
    id: "1",
    title: "모던 웹 개발의 미래",
    excerpt: "최신 웹 기술 트렌드와 함께 살펴보는 2026년 웹 개발의 방향성. React, TypeScript, 그리고 새로운 프레임워크들이 어떻게 발전하고 있는지 알아봅니다.",
    content: `
# 모던 웹 개발의 미래

웹 개발은 매년 빠르게 진화하고 있습니다. 2026년 현재, 우리는 그 어느 때보다 흥미로운 시기를 맞이하고 있습니다.

## React와 현대적 프레임워크

React는 여전히 가장 인기 있는 프론트엔드 라이브러리입니다. 최근 Server Components의 도입으로 성능과 개발자 경험이 크게 향상되었습니다.

## TypeScript의 중요성

타입 안정성은 더 이상 선택이 아닌 필수가 되었습니다. TypeScript를 사용하면 런타임 오류를 사전에 방지하고, 코드의 가독성과 유지보수성을 크게 향상시킬 수 있습니다.

## 성능 최적화

웹 성능은 사용자 경험과 직결됩니다. Core Web Vitals를 개선하고, 번들 크기를 최소화하며, 효율적인 렌더링 전략을 사용하는 것이 중요합니다.

## 결론

웹 개발의 미래는 밝습니다. 새로운 도구와 기술을 적극적으로 학습하고 적용하면서, 사용자 중심의 경험을 만드는 것이 우리의 목표입니다.
    `,
    author: "김개발",
    date: "2026-04-08",
    category: "개발",
    tags: ["React", "TypeScript", "웹개발"],
    image: "https://images.unsplash.com/photo-1764183297925-ffb20a647bef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB0ZWNoJTIwYWJzdHJhY3QlMjBkYXJrfGVufDF8fHx8MTc3NTcyNzYyNHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    readTime: "5분"
  },
  {
    id: "2",
    title: "효율적인 코드 작성 방법",
    excerpt: "클린 코드 원칙과 함께하는 실전 코딩 팁. 읽기 쉽고 유지보수하기 좋은 코드를 작성하는 방법을 배워봅시다.",
    content: `
# 효율적인 코드 작성 방법

좋은 코드는 작성하기보다 읽기 쉬운 코드입니다.

## 명확한 변수명 사용

변수명은 그 의도를 명확하게 드러내야 합니다. \`data\`나 \`temp\` 같은 모호한 이름은 피하고, \`userProfile\`이나 \`temporaryCache\` 같은 구체적인 이름을 사용하세요.

## 함수는 한 가지 일만

각 함수는 하나의 명확한 책임만 가져야 합니다. 이는 테스트와 재사용성을 크게 향상시킵니다.

## 주석보다는 코드로 설명

코드 자체가 설명이 되도록 작성하세요. 주석은 '왜'를 설명할 때만 사용하는 것이 좋습니다.

## 일관성 있는 스타일

팀 내에서 일관된 코딩 스타일을 유지하세요. ESLint와 Prettier 같은 도구를 활용하면 좋습니다.
    `,
    author: "박코더",
    date: "2026-04-07",
    category: "개발",
    tags: ["클린코드", "베스트프랙티스", "개발팁"],
    image: "https://images.unsplash.com/photo-1675495277087-10598bf7bcd1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2RlJTIwcHJvZ3JhbW1pbmclMjBsYXB0b3B8ZW58MXx8fHwxNzc1NzI3NjI0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    readTime: "7분"
  },
  {
    id: "3",
    title: "UI/UX 디자인 기초",
    excerpt: "사용자 중심의 디자인을 만드는 핵심 원칙들. 좋은 사용자 경험을 제공하는 인터페이스를 디자인하는 방법을 알아봅니다.",
    content: `
# UI/UX 디자인 기초

사용자 경험은 제품의 성공을 결정하는 핵심 요소입니다.

## 사용자 중심 사고

항상 사용자의 관점에서 생각하세요. 사용자가 무엇을 원하고, 어떤 문제를 해결하려고 하는지 이해하는 것이 중요합니다.

## 일관성

일관된 디자인 언어를 사용하면 사용자가 인터페이스를 더 쉽게 학습하고 사용할 수 있습니다.

## 피드백

사용자의 행동에 대해 명확한 피드백을 제공하세요. 버튼 클릭, 로딩 상태, 오류 메시지 등 모든 상호작용에서 피드백이 필요합니다.

## 접근성

모든 사용자가 제품을 사용할 수 있도록 접근성을 고려하세요. 색상 대비, 키보드 네비게이션, 스크린 리더 지원 등이 중요합니다.
    `,
    author: "이디자인",
    date: "2026-04-06",
    category: "디자인",
    tags: ["UI", "UX", "디자인"],
    image: "https://images.unsplash.com/photo-1613211431746-aacbe481a84b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWIlMjBkZXNpZ24lMjBkZXZlbG9wbWVudHxlbnwxfHx8fDE3NzU2Mzk0OTV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    readTime: "6분"
  },
  {
    id: "4",
    title: "생산성을 높이는 도구들",
    excerpt: "개발자의 생산성을 극대화하는 필수 도구와 설정. VS Code 확장 프로그램부터 터미널 커스터마이징까지 모든 것을 다룹니다.",
    content: `
# 생산성을 높이는 도구들

올바른 도구를 사용하면 개발 속도와 품질을 동시에 향상시킬 수 있습니다.

## VS Code 확장 프로그램

- **ESLint**: 코드 품질 유지
- **Prettier**: 자동 코드 포맷팅
- **GitLens**: Git 히스토리 시각화
- **Thunder Client**: API 테스팅

## 터미널 도구

Oh My Zsh와 같은 터미널 프레임워크를 사용하면 명령어 입력이 훨씬 편해집니다.

## 버전 관리

Git을 효과적으로 사용하는 방법을 배우세요. 의미 있는 커밋 메시지와 브랜치 전략이 중요합니다.

## 자동화

반복적인 작업은 스크립트로 자동화하세요. npm scripts, GitHub Actions 등을 활용할 수 있습니다.
    `,
    author: "최프로",
    date: "2026-04-05",
    category: "생산성",
    tags: ["도구", "생산성", "VSCode"],
    image: "https://images.unsplash.com/photo-1510873660878-bdf8de0ed851?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcmVhdGl2ZSUyMHdvcmtzcGFjZSUyMG1pbmltYWx8ZW58MXx8fHwxNzc1NjY3MDYzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    readTime: "4분"
  },
  {
    id: "5",
    title: "API 디자인 베스트 프랙티스",
    excerpt: "RESTful API를 설계할 때 고려해야 할 핵심 원칙들. 확장 가능하고 유지보수하기 쉬운 API를 만드는 방법을 배웁니다.",
    content: `
# API 디자인 베스트 프랙티스

좋은 API 설계는 개발자 경험을 크게 향상시킵니다.

## RESTful 원칙

HTTP 메서드를 올바르게 사용하세요:
- GET: 데이터 조회
- POST: 새 데이터 생성
- PUT/PATCH: 데이터 수정
- DELETE: 데이터 삭제

## 명확한 엔드포인트

URL은 리소스를 명확하게 표현해야 합니다. \`/api/users\`, \`/api/posts/:id\` 같은 형태가 좋습니다.

## 버전 관리

API 버전을 관리하여 하위 호환성을 유지하세요. \`/api/v1/users\` 형태로 버전을 명시할 수 있습니다.

## 에러 처리

명확하고 일관된 에러 메시지를 제공하세요. HTTP 상태 코드와 함께 상세한 에러 정보를 반환하는 것이 좋습니다.
    `,
    author: "정백엔드",
    date: "2026-04-04",
    category: "개발",
    tags: ["API", "백엔드", "REST"],
    image: "https://images.unsplash.com/photo-1766751462225-dea92438c6fe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWNobm9sb2d5JTIwaW5ub3ZhdGlvbiUyMGRhcmt8ZW58MXx8fHwxNzc1NzI3NjI1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    readTime: "8분"
  },
  {
    id: "6",
    title: "반응형 웹 디자인 마스터하기",
    excerpt: "모든 디바이스에서 완벽하게 작동하는 웹사이트 만들기. 모바일 퍼스트 접근법과 미디어 쿼리 활용 전략을 소개합니다.",
    content: `
# 반응형 웹 디자인 마스터하기

다양한 화면 크기에 대응하는 것은 현대 웹 개발의 필수 요소입니다.

## 모바일 퍼스트

작은 화면부터 시작해서 점차 큰 화면으로 확장하는 방식이 효율적입니다.

## Flexbox와 Grid

CSS Flexbox와 Grid를 활용하면 복잡한 레이아웃을 쉽게 구현할 수 있습니다.

## 미디어 쿼리

적절한 브레이크포인트를 설정하고, 각 화면 크기에 맞는 레이아웃을 제공하세요.

## 이미지 최적화

srcset과 picture 태그를 사용하여 화면 크기에 맞는 이미지를 제공하세요.
    `,
    author: "강반응",
    date: "2026-04-03",
    category: "디자인",
    tags: ["반응형", "CSS", "모바일"],
    image: "https://images.unsplash.com/photo-1633743252577-ccb68cbdb6ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWdpdGFsJTIwYXJ0JTIwYWJzdHJhY3R8ZW58MXx8fHwxNzc1Njg2MDI2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    readTime: "6분"
  }
];

export const categories = ["전체", "개발", "디자인", "생산성"];

export const allTags = [
  "React",
  "TypeScript",
  "웹개발",
  "클린코드",
  "베스트프랙티스",
  "개발팁",
  "UI",
  "UX",
  "디자인",
  "도구",
  "생산성",
  "VSCode",
  "API",
  "백엔드",
  "REST",
  "반응형",
  "CSS",
  "모바일"
];
