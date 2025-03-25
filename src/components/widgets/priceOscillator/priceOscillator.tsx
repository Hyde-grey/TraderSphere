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

  // Function to change the range preset
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

  // Function to simulate data updates for testing animations
  const simulateDataUpdate = () => {
    // Create a fake market data update
    const randomChange = Math.random() * 4 - 2; // Range from -2 to 2
    const randomPrice = 100 + Math.random() * 10; // Range from 100 to 110
    const randomVolume = 1000 + Math.random() * 500; // Range from 1000 to 1500

    // Update filter data to trigger chart update
    const newData = {
      priceChangePercent: randomChange,
      lastPrice: randomPrice.toFixed(2),
      volume: randomVolume.toFixed(2),
    };

    // Use the update function directly
    updateWithSimulatedData(newData);

    // Also trigger our component's state updates
    setPrevPricePercent(currentPricePercent);
    setCurrentPricePercent(randomChange);
    setPrevPrice(currentPrice);
    setCurrentPrice(randomPrice);
    setTriggerUpdate(Date.now());
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

  const formattedtPercentage = useMemo(() => {
    if (!filteredData) return "0.00 %";

    const newPriceChangePercent = filteredData.priceChangePercent;
    const isIncreasing = newPriceChangePercent > prevPricePercent;
    const isDecreasing = newPriceChangePercent < prevPricePercent;
    const timestamp = triggerUpdate;

    if (isIncreasing) {
      return `<span class="${styles.valueUp}" key="${timestamp}">
        ${newPriceChangePercent.toFixed(2)} % 
        <span class="${styles.arrowUp}" style="vertical-align: middle;">▲</span>
      </span>`;
    } else if (isDecreasing) {
      return `<span class="${styles.valueDown}" key="${timestamp}">
        ${newPriceChangePercent.toFixed(2)} % 
        <span class="${
          styles.arrowDown
        }" style="vertical-align: middle;">▼</span>
      </span>`;
    } else {
      return `<span class="${styles.valueNeutral}" key="${timestamp}">
        ${newPriceChangePercent.toFixed(2)} %
      </span>`;
    }
  }, [filteredData, prevPricePercent, triggerUpdate]);

  const formattedPrice = useMemo(() => {
    if (!filteredData) return "0.00";

    const newPrice = Number(filteredData.lastPrice);
    const isIncreasing = newPrice > prevPrice;
    const isDecreasing = newPrice < prevPrice;
    const timestamp = triggerUpdate + 1;

    const formattedValue =
      newPrice < 0.01
        ? `$ ${filteredData.lastPrice}`
        : `$ ${newPrice.toFixed(2)}`;

    if (isIncreasing) {
      return `<span class="${styles.valueUp}" key="${timestamp}">
        ${formattedValue} 
        <span class="${styles.arrowUp}" style="vertical-align: middle;">▲</span>
      </span>`;
    } else if (isDecreasing) {
      return `<span class="${styles.valueDown}" key="${timestamp}">
        ${formattedValue} 
        <span class="${styles.arrowDown}" style="vertical-align: middle;">▼</span>
      </span>`;
    } else {
      return `<span class="${styles.valueNeutral}" key="${timestamp}">
        ${formattedValue}
      </span>`;
    }
  }, [filteredData, prevPrice, triggerUpdate]);

  const formattedVolume = useMemo(() => {
    if (!filteredData) return "0.00";

    const volume = Number(filteredData.volume);
    const timestamp = triggerUpdate + 2;
    const formattedValue =
      volume < 0.01 ? filteredData.volume : volume.toFixed(2);

    return `<span class="${styles.valueNeutral}" key="${timestamp}">
      ${formattedValue}
    </span>`;
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
            data={formattedtPercentage}
          />
          <DataDisplayLayout header={"PRICE"} data={formattedPrice} />
          <DataDisplayLayout header={"Volume"} data={formattedVolume} />
        </div>
      </div>
    </div>
  );
}

export default PriceOscillator;
