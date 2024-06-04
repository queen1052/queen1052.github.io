---
title: 전략만들기 - Powertrend 3
author: Dev
date: 2024-06-04 20:14:42 +0900
categories: [systemtrading, strategy]
tags: [해외선물, 나스닥, nasdaq, 자동매매, system trading, 재테크, 누적수익, 전략, tradingview, webhook, 웹훅]
---
## 전략만들기 설명
---
- [전략만들기 - Powertrend 1](/posts/nasdaq-strategy-Powertrend/)
- [전략만들기 - Powertrend 2](/posts/nasdaq-strategy-Powertrend-func/)
- [전략만들기 - Powertrend 3](/posts/nasdaq-strategy-Powertrend-tradingview/)


> 본 포스팅에서는 trading view 신호를 python 으로 변환 적용하는 방법에 대해서 개발하고 연구한다.
> - trading view 신호 분석
> - web hook 만들기
> - 테스트 결과

# [trading view 신호 분석]

pine script 코드를 다시 들여다 보다 python에서 왜 뒤죽박죽인지 원인을 찾게 됐다. 

하지만, 그렇다고 하더라도 결국 수치가 정확하게 일치하지 않기 때문에 오차를 무시할 수 없을 것 같다.

오차를 무시하고도 문제가 없는지 적용 해보긴 해야겠다.

우선 이 신호를 web hook으로 받아서 처리 해보기로 했다. 결과가 나쁘지 않으면 모로가도 한양만 가면 되는 것 아닌가...ㅎ.ㅎ

![img](/assets/img/2024-06-03/2024-06-03-tradingview-powertrend.png)*trading vidw powertrend*


# web hook 만들기

trading view web hook을 만들기 위해 돈을 투자했다. 무료 35$...

잘 되어 교육비가 아깝지 않기를 바란다.


## trading view alert 만들기

우선 trading view에서 alert을 만들어줘야 한다.

조건에서 신호나 전략 등을 선택하고 설정하면 된다.

> 메시지를 아무리 편집 해봐도 json 형태로 안오는데 원인을 모르겠다. 검색도 해보고 chatgpt에게 물어봐도 해결이 안된다. 쩝...

![img](/assets/img/2024-06-04/2024-06-04-029-tradingview-alert1.png)*trading vidw alert 만들기 1*

알림 받을 웹훅URL을 본인 URL을 적고 만들기 누르면 된다. alert 만드는 것은 간단하다. 메시지가 안올뿐...

![img](/assets/img/2024-06-04/2024-06-04-029-tradingview-alert2.png)*trading vidw alert 만들기 2*

 
## python flask

flask로 web hook을 받은 코드를 만들었다.

여러가지 테스트를 해봤는데 json 형태로 메시지가 안오다보니 원하는 결과를 얻지 못했다.

alert message는 와서 그냥 거기에 신호명과 신호를 넣어서 받기로 했다.

```python
@app.route('/tradingview_test1', methods=['POST'])
def webhook():
    print("WEBHOOK", request)
    if request.method == 'POST':
        try:
            print(request.data.decode('utf-8'))
```

# [테스트 결과]

신호로 사용할 수 있는 메시지가 오긴 왔다. 바이너리 형태로 와서 디코드를 해서 사용하면 될 것 같다.

이제 이걸 자동매매하는 서버에 웹소켓으로 전달하면 될 것 같다.

![img](/assets/img/2024-06-04/2024-06-04-031-webhook-result.png)*web hook message 수신 결과*
