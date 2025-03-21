import { useRef, useState } from "react";
import LiveIndicator from "../marketSummaryTable/liveIndicator";
import { useDimensions } from "./hooks/useDimensions";
import { usePriceOscillator } from "./hooks/usePriceOscillator";
import styles from "./priceOscillator.module.css";
import stylesWidgets from "../widgets.module.css";
import DataDisplayLayout from "../displaysLayouts/dataDisplayLayout";

export function PriceOscillator() {
  const [symbol, setSymbol] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const dimensions = useDimensions(containerRef);
  const svgRef = usePriceOscillator({ symbol, dimensions });

  return (
    <div className={styles.priceOscillatorContainer} ref={containerRef}>
      <LiveIndicator isConnected />
      <div className={styles.header}>
        <input
          className={stylesWidgets.searchInput}
          type="search"
          onChange={(e) => setSymbol(e.target.value)}
          placeholder="Search a SYMBOL to start monitoring it..."
        />
      </div>
      <div className={styles.chartContainer}>
        <svg ref={svgRef} />

        <DataDisplayLayout header={symbol.toUpperCase()} data={"5.345"} />
      </div>
    </div>
  );
}

export default PriceOscillator;
