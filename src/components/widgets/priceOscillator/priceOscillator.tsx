import { useMemo, useRef, useState, useEffect } from "react";
import LiveIndicator from "../marketSummaryTable/liveIndicator";
import { useDimensions } from "./hooks/useDimensions";
import { usePriceOscillator } from "./hooks/usePriceOscillator";
import styles from "./priceOscillator.module.css";
import stylesWidgets from "../widgets.module.css";
import DataDisplayLayout from "../displaysLayouts/dataDisplayLayout";
import { useSymbolContext } from "../../../contexts/SymbolContext";

export function PriceOscillator() {
  const { selectedSymbol, setSelectedSymbol } = useSymbolContext();
  const [currentPricePercent, setCurrentPricePercent] = useState(0);
  const [prevPricePercent, setPrevPricePercent] = useState(0);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [prevPrice, setPrevPrice] = useState(0);
  const [triggerUpdate, setTriggerUpdate] = useState(0);
  const [useManualRange, setUseManualRange] = useState(false);
  const [manualRange, setManualRange] = useState<[number, number]>([-5, 5]);
  const containerRef = useRef<HTMLDivElement>(null);
  const dimensions = useDimensions(containerRef);
  const { svgRef, filteredData, updateWithSimulatedData, setCustomRange } =
    usePriceOscillator({
      selectedSymbol,
      dimensions,
      customRange: useManualRange ? manualRange : undefined,
    });

  const handleRangeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === "auto") {
      setUseManualRange(false);
    } else {
      setUseManualRange(true);

      const [min, max] = value.split(",").map(Number);
      setManualRange([min, max]);
      setCustomRange([min, max]);
    }
  };

  useEffect(() => {
    if (!filteredData) return;

    const newPriceChangePercent = filteredData.priceChangePercent;
    if (newPriceChangePercent !== currentPricePercent) {
      setPrevPricePercent(currentPricePercent);
      setCurrentPricePercent(newPriceChangePercent);
      setTriggerUpdate(Date.now());
    }
  }, [filteredData, currentPricePercent]);

  useEffect(() => {
    if (!filteredData) return;

    const newPrice = Number(filteredData.lastPrice);
    if (newPrice !== currentPrice) {
      setPrevPrice(currentPrice);
      setCurrentPrice(newPrice);
      setTriggerUpdate(Date.now());
    }
  }, [filteredData, currentPrice]);

  const percentageData = useMemo(() => {
    if (!filteredData)
      return { value: "0.00 %", trend: "neutral" as const, key: 0 };

    const newPriceChangePercent = filteredData.priceChangePercent;
    const isIncreasing = newPriceChangePercent > prevPricePercent;
    const isDecreasing = newPriceChangePercent < prevPricePercent;
    const timestamp = triggerUpdate;

    return {
      value: `${newPriceChangePercent.toFixed(2)} %`,
      trend: isIncreasing
        ? ("up" as const)
        : isDecreasing
        ? ("down" as const)
        : ("neutral" as const),
      key: timestamp,
    };
  }, [filteredData, prevPricePercent, triggerUpdate]);

  const priceData = useMemo(() => {
    if (!filteredData)
      return { value: "0.00", trend: "neutral" as const, key: 0 };

    const newPrice = Number(filteredData.lastPrice);
    const isIncreasing = newPrice > prevPrice;
    const isDecreasing = newPrice < prevPrice;
    const timestamp = triggerUpdate + 1;

    const formattedValue =
      newPrice < 0.01
        ? `$ ${filteredData.lastPrice}`
        : `$ ${newPrice.toFixed(2)}`;

    return {
      value: formattedValue,
      trend: isIncreasing
        ? ("up" as const)
        : isDecreasing
        ? ("down" as const)
        : ("neutral" as const),
      key: timestamp,
    };
  }, [filteredData, prevPrice, triggerUpdate]);

  const volumeData = useMemo(() => {
    if (!filteredData)
      return { value: "0.00", trend: "neutral" as const, key: 0 };

    const volume = Number(filteredData.volume);
    const timestamp = triggerUpdate + 2;
    const formattedValue =
      volume < 0.01 ? filteredData.volume : volume.toFixed(2);

    return {
      value: formattedValue,
      trend: "neutral" as const,
      key: timestamp,
    };
  }, [filteredData, triggerUpdate]);

  return (
    <div className={styles.priceOscillatorContainer}>
      <LiveIndicator isConnected />
      <div className={styles.header}>
        <input
          className={stylesWidgets.searchInput}
          type="search"
          onChange={(e) => setSelectedSymbol(e.target.value)}
          placeholder="Search a SYMBOL to start monitoring it..."
        />
        <div className={styles.controls}>
          <select
            value={
              useManualRange ? `${manualRange[0]},${manualRange[1]}` : "auto"
            }
            onChange={handleRangeChange}
            className={styles.rangeSelector}
          >
            <option value="auto">Auto Range</option>
            <option value="-2,2">±2%</option>
            <option value="-5,5">±5%</option>
            <option value="-10,10">±10%</option>
            <option value="-20,20">±20%</option>
            <option value="-50,50">±50%</option>
          </select>
        </div>
      </div>
      <div className={styles.chartContainer}>
        <div className={styles.chartArea} ref={containerRef}>
          <svg ref={svgRef} />
        </div>
        <div className={styles.dataDisplays}>
          <DataDisplayLayout
            header={
              selectedSymbol
                ? selectedSymbol.toUpperCase()
                : "No Symbol Selected"
            }
            data={percentageData}
          />
          <DataDisplayLayout header={"PRICE"} data={priceData} />
          <DataDisplayLayout header={"Volume"} data={volumeData} />
        </div>
      </div>
    </div>
  );
}

export default PriceOscillator;
