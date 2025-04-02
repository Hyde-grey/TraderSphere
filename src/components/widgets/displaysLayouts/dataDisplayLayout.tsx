import { motion } from "framer-motion";
import styles from "./dataDisplay.module.css";
import CountUp from "./countUpProps";
import { usePrevious } from "../../../components/hooks/usePrevious";
import { useMemo, useState, useEffect } from "react";

export type DataDisplayLayoutProps = {
  header: string;
  data: {
    value: string;
    trend: "up" | "down" | "neutral";
    key: number;
  };
};

function DataDisplayLayout({ header, data }: DataDisplayLayoutProps) {
  // Use usePrevious hook to track the previous value for animation
  const previousValue = usePrevious(data.value);
  // Use a unique ID for each animation cycle
  const [animationId, setAnimationId] = useState(0);

  // Convert string values to numbers for CountUp component
  const numericValue = useMemo(() => {
    // Handle percentage values or regular numbers
    const isPercentage = data.value.includes("%");
    // Remove any non-numeric characters except decimal points and negative signs
    let cleanValue = data.value.replace(/[^\d.-]/g, "");
    // Parse the numeric value
    const value = parseFloat(cleanValue);
    // Return 0 if NaN (prevents animation errors)
    return isNaN(value) ? 0 : value;
  }, [data.value]);

  // Calculate the starting value for the animation
  const startValue = useMemo(() => {
    if (previousValue) {
      const isPercentage = previousValue.includes("%");
      // Remove any non-numeric characters except decimal points
      let cleanPrevValue = previousValue.replace(/[^\d.-]/g, "");
      const prevValue = parseFloat(cleanPrevValue);
      return isNaN(prevValue) ? numericValue : prevValue;
    }

    // If no previous value, use a small delta based on trend
    // For small numbers (like prices) use smaller offsets
    if (Math.abs(numericValue) < 1) {
      return data.trend === "down"
        ? numericValue + Math.max(0.001, numericValue * 0.05)
        : numericValue - Math.max(0.001, numericValue * 0.05);
    }

    // For larger numbers use percentage offsets
    return data.trend === "down" ? numericValue * 1.02 : numericValue * 0.98;
  }, [previousValue, numericValue, data.trend]);

  // Generate a new animation ID whenever value changes
  useEffect(() => {
    // Only trigger animation if the value actually changed
    if (previousValue !== data.value) {
      setAnimationId((prev) => prev + 1);
    }
  }, [data.value, data.key, previousValue]);

  // Format based on the content (e.g., percentage vs regular number)
  const formatNumber = (value: number) => {
    if (data.value.includes("%")) {
      return `${value.toFixed(2)}%`;
    } else if (value < 0.1) {
      // For very small values like crypto prices
      return value.toFixed(6);
    } else if (value < 1) {
      return value.toFixed(4);
    } else if (value < 100) {
      return value.toFixed(2);
    } else {
      return value.toFixed(0);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0.9, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={styles.displayContainer}
    >
      <div className={styles.display}>
        <motion.h3
          initial={{ opacity: 0.9 }}
          animate={{ opacity: 1 }}
          style={{ textAlign: "center" }}
          key={header}
        >
          {header?.split("").map((char, index) => (
            <motion.span
              key={`${char}-${index}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: 0.1,
                delay: index * 0.05,
                ease: "easeInOut",
              }}
            >
              {char}
            </motion.span>
          ))}
        </motion.h3>
        <motion.span
          key={data.key}
          className={`${styles.dataDisplayData} ${styles[data.trend]}`}
          style={{ textAlign: "center" }}
        >
          <CountUp
            key={`count-${animationId}`}
            from={startValue}
            to={numericValue}
            direction={data.trend === "down" ? "down" : "up"}
            separator=","
            duration={1.5}
            decimals={
              numericValue < 0.01
                ? 6
                : numericValue < 0.1
                ? 4
                : numericValue < 1
                ? 3
                : numericValue < 100
                ? 2
                : 0
            }
            className={data.trend === "down" ? styles.down : styles.up}
            startWhen={true}
          />
          {data.value.includes("%") && "%"}
          {data.trend === "up" && <span className={styles.arrowUp}>▲</span>}
          {data.trend === "down" && <span className={styles.arrowDown}>▼</span>}
        </motion.span>
      </div>
    </motion.div>
  );
}

// Export without memo to ensure component re-renders when props change
export default DataDisplayLayout;
