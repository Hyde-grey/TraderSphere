import { motion } from "framer-motion";
import { memo, useMemo } from "react";
import styles from "./dataDisplay.module.css";
import { AlignCenter } from "lucide-react";

export type DataDisplayLayoutProps = {
  header: string;
  data: string;
};

function DataDisplayLayout({ header, data }: DataDisplayLayoutProps) {
  // Process data only when it changes
  const processedData = useMemo(() => {
    // Create unique key for animation based on data
    const matches = data?.match(/key="([^"]+)"/);
    const key = matches && matches.length > 1 ? matches[1] : undefined;

    // Remove key attribute from the HTML as it's not a valid HTML attribute
    const cleanData = data?.replace(/key="[^"]+"/g, "") || "";

    return { key, cleanData };
  }, [data]);

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
        <motion.div
          key={processedData.key || Math.random()}
          className={styles.dataDisplayData}
          dangerouslySetInnerHTML={{ __html: processedData.cleanData }}
          style={{ textAlign: "center" }}
        />
      </div>
    </motion.div>
  );
}

// Export without memo to ensure component re-renders when props change
export default DataDisplayLayout;
