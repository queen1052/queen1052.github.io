/// <reference types="vite/client" />

import { tradingSamples } from './tradingSamples';

export type TradeSymbol = keyof typeof tradingSamples;

export interface TradeReport {
  currency: 'KRW';
  days: string[];
  coverage: Record<string, 'partial' | 'unavailable' | 'no_selection'>;
  missingFx: number;
  basis?: 'same_fill_v1';
  series: Record<TradeSymbol, ({ simulated: number | null; live: number; count: number; virtualOriginal?: number } | null)[]>;
}

const reports = import.meta.glob<TradeReport>('./trade-reports/*.json', { eager: true, import: 'default' });
const latestFile = Object.keys(reports).sort().pop();
export const latestTradeReport = latestFile ? reports[latestFile] : undefined;
export const tradeReportFor = (day: string) => reports[`./trade-reports/${day}.json`];
