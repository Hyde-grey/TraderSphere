import styles from "../candleStickChart.module.css";
import LiveIndicator from "../../marketSummaryTable/liveIndicator";

/**
 * Header component for the candlestick chart
 */
type ChartHeaderProps = {
  symbol: string;
  isLive?: boolean;
  isConnected?: boolean;
  lastUpdated?: Date;
};

const ChartHeader = ({
  symbol,
  isLive = false,
  isConnected = false,
  lastUpdated,
}: ChartHeaderProps) => {
  return (
    <div className={styles.chartHeader}>
      <span>{symbol} - Hourly Chart</span>
      <div className={styles.liveStatusContainer}>
        {isLive && <LiveIndicator isConnected={isConnected} />}
        {lastUpdated && (
          <span className={styles.lastUpdated}>
            Last update: {lastUpdated.toLocaleTimeString()}
          </span>
        )}
      </div>
    </div>
  );
};

export default ChartHeader;
