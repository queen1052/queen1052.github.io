---
title: 전략1 - Trading view 함수 오차 잡는건 어렵다.
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

차트에서 신호가 추세 자리에서 자주 발생하지 않고, 추세를 길게 보도록 신호가 발생한다.

하지만, 코드를 변환했을 때 너무 자주 신호가 발생되는 것을 볼 수 있다.

사용하는 함수로 인한 차이 같은데 함수를 데이터로 찍어보면서 확인 해봐야 할 것 같다.

![img](/assets/img/2024-06-03/2024-06-03-tradingview.png)*trading view indicator*


# [python 코드로 변환]
> - nz는 값이 NaN이면 0을 반환하고 아니면 값을 그대로 사용한다.
## trading view function

```python
smoothrng(float source, int sampling_period = 50, float range_mult = 3)=>
    wper      = (sampling_period*2) - 1
    avrng     = ta.ema(math.abs(source - source[1]), sampling_period)
    smoothrng = ta.ema(avrng, wper)*range_mult
    smoothrng

rngfilt_volumeadj(float source1, float volume, float smoothrng)=>
    rngfilt = source1
    if volume > nz(volume[1])
        rngfilt := (source1 - smoothrng) < nz(rngfilt[1]) ? nz(rngfilt[1]) : (source1 - smoothrng)
    else
        rngfilt := (source1 + smoothrng) > nz(rngfilt[1]) ? nz(rngfilt[1]) : (source1 + smoothrng)
    rngfilt

trendUp(float source)=>
    upward   = 0.0
    upward  := source > source[1] ? nz(upward[1]) + 1 : source < source[1] ? 0 : nz(upward[1])
    upward
```

## python function
```python
def smoothrng(self, source, sampling_period=50, range_mult=3):
        wper = (sampling_period * 2) - 1
        avrng = source.diff().abs().ewm(span=sampling_period, adjust=False).mean()
        smoothrng = avrng.ewm(span=wper, adjust=False).mean() * range_mult
return smoothrng

def rngfilt_volumeadj(self, source1, volume, smoothrng):
    rngfilt = pd.Series(index=source1.index, dtype=float)
    for i in range(1, len(source1)):
        prev_volume = volume.iloc[i - 1] if i > 0 else np.nan
        prev_rngfilt = rngfilt.iloc[i - 1] if i > 0 else np.nan
        prev_rngfilt = 0 if pd.isna(prev_rngfilt) else prev_rngfilt
        if volume.iloc[i] > prev_volume:
            rngfilt.iloc[i] = (source1.iloc[i] - smoothrng.iloc[i]) if (source1.iloc[i] - smoothrng.iloc[i]) < prev_rngfilt else prev_rngfilt
        else:
            rngfilt.iloc[i] = (source1.iloc[i] + smoothrng.iloc[i]) if (source1.iloc[i] + smoothrng.iloc[i]) > prev_rngfilt else prev_rngfilt
    return rngfilt

def trendUp(self, source):
upward = np.zeros_like(source)
for i in range(1, len(source)):
        if source.iloc[i] > source.iloc[i - 1]:
        upward[i] = upward[i - 1] + 1
        elif source.iloc[i] < source.iloc[i - 1]:
        upward[i] = 0
        else:
        upward[i] = upward[i - 1]
return upward

```

# [테스트 결과]

결국 로직을 검토하면서 로직상 문제가 없는 것을 확인 했으나,,, 값은 일치 시킬 수 없었다.

추가적으로 보정값을 주거나 변수를 바꿔봐야 할 것 같다.

trading view에서 웹훅을 이용해서 개발 해보던지 해야할 것 같다.

![img](/assets/img/2024-06-04/2024-06-04-027-test-result.png)*테스트 결과*