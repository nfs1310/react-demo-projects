import type Coin from "../interfaces/Coin";
import type Crypto from "../interfaces/Crypto";
import type MarketChart from "../interfaces/MarketChart";

const BASE_URL = "https://api.coingecko.com/api/v3";

export const getCryptoData = async (): Promise<Crypto[]> => {
    const response = await fetch(
        `${BASE_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false`
    );

    if (!response.ok) {
        throw new Error('Failed to fetch crypto data.');
    }

    return await response.json();
}

export const getCryptoById = async (id: string): Promise<Coin> => {
    const response = await fetch(
        `${BASE_URL}/coins/${id}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`);

    if (!response.ok) {
        throw new Error('Failed to fetch crypto data.');
    }

    return await response.json();
}

export const gettDataForChart = async (id: string): Promise<MarketChart> => {
  const response = await fetch(
    `${BASE_URL}/coins/${id}/market_chart?vs_currency=usd&days=7`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch chart data");
  }
  return await response.json();
};
