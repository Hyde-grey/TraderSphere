import { useMemo } from "react";
import { useFetchData } from "../hooks/useFetchData";
import { useLiveData } from "../hooks/useLiveData";

export const useProcessMarketData = () => {
  const { data, loading, error } = useFetchData("ticker/24hr");
  const { liveData, isConnected, error: liveError } = useLiveData();

  const formattedLiveData = useMemo(() => {
    if (!liveData.length) return [];
    return liveData.map((item: any) => ({
      symbol: item.s,
      lastPrice: item.c,
      priceChangePercent: item.P,
      volume: item.v,
    }));
  }, [liveData]);

  const combinedData = useMemo(() => {
    if (!data || !data.length) return [];
    if (!formattedLiveData.length) return data;

    const liveDataMap = new Map();
    formattedLiveData.forEach((item) => {
      liveDataMap.set(item.symbol, item);
    });

    let hasChanges = false;
    const newData = data.map((item) => {
      const liveItem = liveDataMap.get(item.symbol);
      if (liveItem) {
        if (
          liveItem.lastPrice !== item.lastPrice ||
          liveItem.priceChangePercent !== item.priceChangePercent ||
          liveItem.volume !== item.volume
        ) {
          hasChanges = true;
          return { ...item, ...liveItem };
        }
      }
      return item;
    });

    return hasChanges ? newData : data;
  }, [data, formattedLiveData]);

  return { marketData: combinedData, loading, error, isConnected, liveError };
};
