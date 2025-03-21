import { motion } from "framer-motion";
import styles from "./dataDisplay.module.css";
import { AlignCenter } from "lucide-react";

type DataDisplayLayoutProps = {
  header?: string;
  data: string;
};

const DataDisplayLayout = ({ header, data }: DataDisplayLayoutProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0 }}
      className={styles.displayContainer}
    >
      <div className={styles.display}>
        <motion.h3
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
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
        <motion.h3 initial={{ opacity: 0 }} animate={{ opacity: 1 }} key={data}>
          {parseFloat(data).toFixed(2)}
        </motion.h3>
      </div>
    </motion.div>
  );
};

export default DataDisplayLayout;
