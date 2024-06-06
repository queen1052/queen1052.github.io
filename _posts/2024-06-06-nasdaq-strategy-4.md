---
title: Trading view web hook 을 적용한 자동매매 결과(전략1)
author: Dev
date: 2024-06-06 09:14:42 +0900
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

# [trading view 신호 분석]

전일 나스닥애 횡보와 급등/급락으로 기분이 안좋다.

저런 기분 안좋은 장에서도 좋은 성과를 낼 수 있도록 차트를 열심히 분석 중이다.

수치를 바꿔보고 어떤게 더 좋은 성과를 낼 수 있을지 고민고민 중이다.

![img](/assets/img/2024-06-05/2024-06-05-023-tradingview-chart1.png)*trading view chart*


# [web hook 신호 처리]

web hook을 만들어서 alert을 받았을 때 대략 1~10초 정도의 gap이 발생한다.

web hook은 trading view 서버에서 보내는데 오차가 좀 있을 수 있는 것 같다.

장기 추세로 신호를 만들려고 하기 때문에 이정도는 뭐... 괜찮은 것 같다.

weg hook으로 받은 신호는 websocket으로 보내던지 file로 저장하고 python 프로그램에서 파일을 읽어서 신호를 처리하던지 해야할 것 같다.

우선, file을 flask에서 쓰고, python에서 file을 읽어서 처리하려고 한다.

앞으로 trading view에서 여러가지 신호를 받을 수 있기 때문에 구분자를 만들어서 처리한다.

```python
# flask에서 file 쓰기
def webhook():
    sendmsg = f"TRV,POT,{request.data.decode('utf-8')}"
    with open('webhook_data.txt', 'w') as f:
        f.write(sendmsg)
```

```python
# python 프로그램에서 file 읽기
def read_webhook_data(self):
    try:
        with open('test.config/webhook_data.txt', 'r') as f:
            data = f.read()
        return data
    except FileNotFoundError:
        return None
```

# [테스트 결과]

횡보 구간에서 스위칭이 될 때는 100~150틱 정도 손절을 감수해야 할 것 같다.

하지만 추세를 제대로 타면 큰 수익을 볼 수 있을 것 같다.

trading view에 신호를 적용한 모습은 아래와 같다.

![img](/assets/img/2024-06-05/2024-06-05-024-tradingview-result2.png)*신호 차트*

파란색 세로 선이 진입 자리를 표시한 것인데 진입 중 현새 상태는 아래와 같다.

큰 추세가 나와준다면 매우 매력적인 모델이 될 것 같다. 

앞으로 이 버전도 테스트를 해서 결과를 지켜 볼 예정이다.

![img](/assets/img/2024-06-05/2024-06-05-024-tradingview-result1.png)*신호 테스트 결과*

17시 10분에 발생된 신호가 미장 시작 이후에도 유지되어 매수 원웨이로 됐다.

아래 차트는 trading view에서의 결과이다.

![img](/assets/img/2024-06-05/2024-06-06-013-tradingview-result3.png)*신호 테스트 결과*

자동매매 결과는 아래와 같다.

목표 금액을 700만원으로 설정했는데 700만원 달성 후 종료가 됐다.

목표 금액보다 더 높게 올려서 전부 먹지는 못했다.

이제 해당 전략은 테스트만 쭉~ 해보면 될 것 같다.

![img](/assets/img/2024-06-05/2024-06-06-013-tradingview-result4.png)*신호 테스트 결과*

![img](/assets/img/2024-06-05/2024-06-06-013-tradingview-result5.png)*신호 테스트 결과*