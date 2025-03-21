import { useRef, useState } from "react";
import LiveIndicator from "../marketSummaryTable/liveIndicator";
import { useDimensions } from "./hooks/useDimensions";
import { usePriceOscillator } from "./hooks/usePriceOscillator";
import styles from "./priceOscillator.module.css";
import stylesWidgets from "../widgets.module.css";
import DataDisplayLayout from "../displaysLayouts/dataDisplayLayout";
import { useSymbolContext } from "../../../contexts/SymbolContext";

export function PriceOscillator() {
  const { selectedSymbol, setSelectedSymbol } = useSymbolContext();
  const containerRef = useRef<HTMLDivElement>(null);
  const dimensions = useDimensions(containerRef);
  const { svgRef, filteredData } = usePriceOscillator({
    selectedSymbol,
    dimensions,
  });

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
            data={
              filteredData
                ? `${filteredData.priceChangePercent.toFixed(2)}%`
                : "0.00%"
            }
          />
          <DataDisplayLayout
            header={"PRICE"}
            data={
              filteredData
                ? Number(filteredData.lastPrice) < 0.01
                  ? filteredData.lastPrice
                  : Number(filteredData.lastPrice).toFixed(2)
                : "0.00"
            }
          />
        </div>
      </div>
    </div>
  );
}

export default PriceOscillator;
