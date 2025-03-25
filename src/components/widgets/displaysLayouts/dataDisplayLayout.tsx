import { motion } from "framer-motion";
import styles from "./dataDisplay.module.css";

export type DataDisplayLayoutProps = {
  header: string;
  data: {
    value: string;
    trend: "up" | "down" | "neutral";
    key: number;
  };
};

function DataDisplayLayout({ header, data }: DataDisplayLayoutProps) {
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
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          style={{ textAlign: "center" }}
        >
          {data.value}
          {data.trend === "up" && <span className={styles.arrowUp}>▲</span>}
          {data.trend === "down" && <span className={styles.arrowDown}>▼</span>}
        </motion.span>
      </div>
    </motion.div>
  );
}

// Export without memo to ensure component re-renders when props change
export default DataDisplayLayout;
