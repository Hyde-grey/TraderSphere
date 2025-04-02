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
  switch (true) {
    case loading:
      return (
        <div className={styles.loading}>
          <p>Loading chart data...</p>
        </div>
      );

    case !!error:
      return (
        <div className={styles.error}>
          <p>Select a symbol in Market Overview to see its chart</p>
        </div>
      );

    case !symbol:
      return (
        <div className={styles.noData}>
          <p>Select a symbol in Market Overview to see its chart</p>
        </div>
      );

    case dataLength === 0:
      return (
        <div className={styles.noData}>
          <p>No data available for {symbol}</p>
        </div>
      );

    default:
      return null;
  }
};

export default ChartStatus;
