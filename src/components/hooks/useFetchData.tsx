import { useState, useEffect } from "react";

export type StaticMarketData = {
  symbol: string;
  priceChange: string;
  priceChangePercent: string;
  weightedAvgPrice: string;
  prevClosePrice: string;
  lastPrice: string;
  lastQty: string;
  bidPrice: string;
  bidQty: string;
  askPrice: string;
  askQty: string;
  openPrice: string;
  highPrice: string;
  lowPrice: string;
  volume: string;
  quoteVolume: string;
  openTime: number;
  closeTime: number;
  firstId: number;
  lastId: number;
  count: number;
};

export const useFetchData = (
  endpoint: string,
  params?: Record<string, string>
) => {
  const [data, setData] = useState<StaticMarketData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    console.log(endpoint);
    const fetchDataFromAPI = async () => {
      const baseUrl = `https://api.binance.com/api/v3`;
      const url = new URL(`${baseUrl}/${endpoint}`);
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          url.searchParams.append(key, value);
        });
      }

      try {
        setLoading(true);
        const response = await fetch(url.toString());
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const result = await response.json();
        setData(result);
        setError(null);
      } catch (error) {
        console.error("API Error:", error);
        setError(
          error instanceof Error
            ? error
            : new Error("An unknown error occurred")
        );
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDataFromAPI();
  }, [endpoint, JSON.stringify(params)]);

  return { data, loading, error };
};
