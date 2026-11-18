export const tradingDays = ['11/09', '11/10', '11/11', '11/12', '11/13'];

// Fictional daily P&L in USD, using the same sample period and starting balance.
export const sampleStartingBalance = 10_000;
export const tradingSamples = {
  BTCUSD: {
    label: '비트코인',
    simulated: [80, -55, 110, 95, 190],
    live: [50, -80, 90, 75, 125],
  },
  US100Cash: {
    label: '나스닥 100',
    simulated: [110, 135, -80, 190, 195],
    live: [70, 105, -105, 155, 165],
  },
  GOLD: {
    label: '금 · XAUUSD',
    simulated: [-55, 95, 85, -25, 140],
    live: [-75, 65, 65, -35, 110],
  },
};
