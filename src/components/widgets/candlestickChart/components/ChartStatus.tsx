import styles from "../candleStickChart.module.css";

/**
 * Component to handle various chart states (loading, error, no data)
 */
type ChartStatusProps = {
  loading: boolean;
  error: any;
  symbol: string;
  dataLength: number;
};

const ChartStatus = ({
  loading,
  error,
  symbol,
  dataLength,
}: ChartStatusProps) => {
  // Show loading state
  if (loading) {
    return (
      <div className={styles.loading}>
        <p>Loading chart data...</p>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className={styles.error}>
        <p>Select a symbol in Market Overview to see its chart</p>
      </div>
    );
  }

  // Show empty data state
  if (dataLength === 0) {
    return (
      <div className={styles.noData}>
        <p>No data available for {symbol}</p>
      </div>
    );
  }

  // Nothing to render if data is available
  return null;
};

export default ChartStatus;
