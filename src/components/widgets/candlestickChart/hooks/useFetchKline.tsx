import { useEffect, useState } from "react";

export const useHistoricalcandles = (symbol: string, limit?: number) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchDataFromAPI = async () => {
      const url = new URL(
        `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=1h&limit=${limit}`
      );

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
  }, [symbol, limit]);

  return { data, loading, error };
};
