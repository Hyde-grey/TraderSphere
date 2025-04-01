import { useRef, useState, useEffect } from "react";
import { useSymbolContext } from "../../../contexts/SymbolContext";
import { useHistoricalcandles } from "./hooks/useFetchKline";
import useLiveKline from "./hooks/useLiveKline";
import { limitCandleCount } from "./utils/liveDataUtils";
import ChartHeader from "./components/ChartHeader";
import ChartStatus from "./components/ChartStatus";
import CandlestickRenderer from "./components/CandlestickRenderer";
import useDimensions from "./hooks/useDimensions";
import styles from "./candleStickChart.module.css";

/**
 * Available time intervals for the candlestick chart
 */
export type CandlestickInterval =
  | "1m" // 1 minute
  | "5m" // 5 minutes
  | "15m" // 15 minutes
  | "1h" // 1 hour
  | "4h" // 4 hours
  | "1d"; // 1 day

/**
 * Props for the candlestick chart component
 */
export type CandlestickChartProps = {
  symbol: string; // Trading pair (e.g., 'BTCUSDT')
  interval: CandlestickInterval; // Time interval
  height?: number; // Chart height in pixels
  width?: number; // Chart width in pixels
};

// Maximum number of candles to display
const MAX_CANDLES = 100;

const CandleStickChart = () => {
  const { selectedSymbol } = useSymbolContext();
  const {
    data: historicalData,
    loading,
    error: historyError,
  } = useHistoricalcandles(selectedSymbol, 50);
  const [isLiveEnabled, setIsLiveEnabled] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | undefined>(undefined);
  const chartRef = useRef<HTMLDivElement>(null);
  const dimensions = useDimensions<HTMLDivElement>(chartRef);

  // Use live data hook if enabled
  const {
    liveData,
    isConnected,
    error: liveError,
  } = useLiveKline(isLiveEnabled ? selectedSymbol : "", historicalData);

  // Determine effective error state (check both historical and live errors)
  const error = isLiveEnabled ? liveError : historyError;

  // Use historical or live data based on toggle
  const data = isLiveEnabled ? liveData : historicalData;

  // Track last update time when live data changes
  useEffect(() => {
    if (isLiveEnabled && liveData && liveData.length > 0) {
      setLastUpdated(new Date());
    }
  }, [liveData, isLiveEnabled]);

  // Limit the number of candles to prevent performance issues
  const limitedData = limitCandleCount(data || [], MAX_CANDLES);

  const toggleLiveData = () => {
    setIsLiveEnabled((prev) => !prev);
  };

  // Validate data structure before rendering
  const isDataValid = Array.isArray(limitedData) && limitedData.length > 0;

  return (
    <div className={styles.chartContainer}>
      <ChartHeader
        symbol={selectedSymbol}
        isLive={isLiveEnabled}
        isConnected={isConnected}
        lastUpdated={lastUpdated}
      />
      <div className={styles.chartControls}>
        <button
          className={`${styles.liveToggle} ${
            isLiveEnabled ? styles.liveEnabled : styles.liveDisabled
          }`}
          onClick={toggleLiveData}
          title={
            isLiveEnabled ? "Switch to historical data" : "Switch to live data"
          }
        >
          {isLiveEnabled ? "Live Data" : "Historical Data"}
        </button>
        {liveError && isLiveEnabled && (
          <div className={styles.connectionError}>
            Connection error - retrying
          </div>
        )}
      </div>
      <div className={styles.chartContent}>
        <ChartStatus
          loading={loading}
          error={error}
          symbol={selectedSymbol}
          dataLength={limitedData?.length || 0}
        />
        <div
          ref={chartRef}
          className="candlestick-chart"
          style={{
            width: "100%",
            height: "100%",
            borderRadius: "8px",
            overflow: "hidden",
          }}
        >
          {!loading && !error && isDataValid && dimensions.width > 0 && (
            <CandlestickRenderer
              data={limitedData}
              dimensions={dimensions}
              symbol={selectedSymbol}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default CandleStickChart;
