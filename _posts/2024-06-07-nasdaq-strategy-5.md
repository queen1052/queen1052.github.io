---
title: 거래를 오버해서 테스트 해보는 중 (전략1)
author: Dev
date: 2024-06-07 07:51:00 +0900
categories: [systemtrading, PT8번]
tags: [해외선물, 나스닥, nasdaq, 자동매매, system trading, 재테크, 누적수익, 전략, tradingview, webhook, 웹훅]
---
## 전략만들기 설명
---
- [Trading view를 분석해서 자동매매 만들기](/posts/nasdaq-strategy-1/)
- [Trading view 함수 오차 잡는건 어렵다.](/posts/nasdaq-strategy-2/)
- [Trading view web hook 을 이용한 자동매매 개발](/posts/nasdaq-strategy-3/)
- [Trading view web hook 을 적용한 자동매매 결과](/posts/nasdaq-strategy-4/)
- [거래를 오버해서 테스트 해보는 중](/posts/nasdaq-strategy-5/)


> 본 포스팅에서는 trading view 신호를 python 으로 변환 적용하는 방법에 대해서 개발하고 연구한다.
> - trading view 신호 분석
> - web hook 신호 처리
> - 테스트 결과

## [trading view 신호 분석]

5분 기준 발생되는 신호를 보면 횡보에서 신호가 꼬이는건 어쩔 수 없는 것 같다.

차트를 보면 추세가 발생될 때 크게 먹고, 횡보에서 손실을 감수하는 것이 유리할 것으로 생각이 된다.

over 하는 개념이 아직 적용이 안되서 매매가 새벽에 종료가 됐는데, 테스트를 좀 해보고 기능을 추가 해봐야 할 것 같다.

![img](/assets/img/2024-06-07/2024-06-07-001-str1.png)*trading view chart*

주기를 바꿔서 swing으로 가져가는건 어떨까?

6월 진입되서 한 차례 스위칭이 있었지만 계속 매수 추세 중이다.

18,383 매수 진입 -> 18,541 매도 진입 -> 18,589 매수 진입 -> 현재 19,069

대략 683pt 수익이 되는 중이다. 대략 1,800 만원 수익.

흠... 좀 더 지켜보고 추가 해야할 것 같다.

![img](/assets/img/2024-06-07/2024-06-07-004.png)*trading view chart*

## [테스트 결과]

오전 7시부터 시작한 매매는 최종 -370만원 손실 종료가 됐다.

매수 포지션에서 급락이 나오면서 스위칭이 됐고, 횡보가 심해지면서 손실이 커졌다.

오늘 아침 7시에 다시 켜서 매도 포지션을 다시 시작했는데 지표 영향을 받았을 때 어떤 결과가 나올지 봐야 할 것 같다.

![img](/assets/img/2024-06-07/2024-06-07-002.png)*매매 화면*

![img](/assets/img/2024-06-07/2024-06-07-003.png)*거래 내역*