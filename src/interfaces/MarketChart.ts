export type ChartPoint = [timestamp: number, value: number];

export default interface MarketChart {
  prices: ChartPoint[];
  market_caps: ChartPoint[];
  total_volumes: ChartPoint[];
}