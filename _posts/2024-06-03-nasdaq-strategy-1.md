---
title: 전략1 - Trading view를 분석해서 자동매매 만들기
author: Dev
date: 2024-06-03 15:14:42 +0900
categories: [systemtrading, strategy]
tags: [해외선물, 나스닥, nasdaq, 자동매매, system trading, 재테크, 누적수익, 전략, tradingview]
---
## 전략만들기 설명
---
- [Trading view를 분석해서 자동매매 만들기](/posts/nasdaq-strategy-1/)
- [Trading view 함수 오차 잡는건 어렵다.](/posts/nasdaq-strategy-2/)
- [Trading view web hook 을 이용한 자동매매 개발](/posts/nasdaq-strategy-3/)
- [Trading view web hook 을 적용한 자동매매 결과](/posts/nasdaq-strategy-4/)


> 본 포스팅에서는 trading view 신호를 python 으로 변환 적용하는 방법에 대해서 개발하고 연구한다.
> - trading view 신호 분석
> - python 코드로 변환
> - 테스트 결과

# [trading view 신호 분석]

trading view 신호를 분석하고 python으로 개발 해보자.

아래는 5분 캔들 차트에 buy/sell 신호가 적용된 모습이다.

횡보 구간에서는 좋은 모습은 아니지만 장기로 봤을 때는 좋은 모습을 보여준다.

python 언어를 사용하는 이유는 데이터 처리에 매우 뛰어나고 package들이 매우 편리하게 되어 있다.

개발 실력이 없어도 chatgpt와 문법을 조금 공부하고 google 검색을 해보면 개발이 가능하다.

![img](/assets/img/2024-06-03/2024-06-03-tradingview.png)*trading view*

아래는 pine script 코드를 정리한 것 이다. pine script 코드 블럭이 없기 때문에 python 코드 블럭으로 한다.

> [trading view 조건문]
> > expr1 ? expr2 : expr3
> expr1 이 참이면 expr2, 아니면 expr3. 제로 밸류 (0, NaN, +무한, -무한) 는 거짓, 그 밖의 다른 값은 참으로 봅니다.

```python
l = 200
volrng = rngfilt_volumeadj(close,volume,smoothrng(close,l,3))
smoothrng = smoothrng(close,l,3)

basetype = volrng
hband = basetype + smoothrng
lowband = basetype - smoothrng
uprng = trendUp(basetype)
b = uprng and ta.crossover(close,hband)
s = not uprng and ta.crossunder(close,lowband)
```

# [python 코드로 변환]
```python
l = 200
smoothrng_val = self.smoothrng(data['close'], l, 3)
volrng = self.rngfilt_volumeadj(data['close'], data['volume'], smoothrng_val)
smoothrng_val = self.smoothrng(data['close'], l, 3)

basetype = volrng
hband = basetype + smoothrng_val
lowband = basetype - smoothrng_val
uprng = self.trendUp(basetype)

uprng_bool = uprng > 0
data['buy'] = np.logical_and(uprng_bool, np.roll(data['close'], 1) < hband)
data['sell'] = np.logical_and(~uprng_bool, np.roll(data['close'], 1) > lowband)
```

# [테스트 결과]

차트와 같이 결과가 나오지 않아 내부 함수를 수정 해봐야 할 것 같다.

trading view 함수와 python 함수가 차이가 나다보니 결과도 오차가 발생한다.

이런 오차를 잡아주고 수치를 맞추는게 꽤 어려운 작업인 것 같다. ㅠ.ㅠ

![img](/assets/img/2024-06-03/2024-06-03-tradingview-test1.png)*테스트 결과*