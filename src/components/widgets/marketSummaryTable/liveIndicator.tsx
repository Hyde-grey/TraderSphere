import { motion } from "framer-motion";
import styles from "../widgets.module.css";

interface LiveIndicatorProps {
  isConnected: boolean;
}

const LiveIndicator = ({ isConnected }: LiveIndicatorProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.3,
        scale: { type: "spring", visualDuration: 0.4, bounce: 0.4 },
      }}
      className={styles.liveIndicatorContainer}
    >
      {!isConnected ? (
        <>
          <div
            className={`${styles.liveIndicator} ${styles.offlineIndicator}`}
          />
          <span>
            Offline
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                repeat: Infinity,
                repeatType: "loop",
                duration: 5,
                times: [0, 0.33, 0.66, 1],
                ease: "easeInOut",
              }}
            >
              {"."
                .repeat(3)
                .split("")
                .map((dot, index) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{
                      delay: index * 0.8,
                      duration: 1.5,
                      repeat: Infinity,
                      repeatType: "reverse",
                    }}
                  >
                    {dot}
                  </motion.span>
                ))}
            </motion.span>
          </span>
        </>
      ) : (
        <>
          <div
            className={`${styles.liveIndicator} ${styles.onlineIndicator}`}
          />
          <span>Live</span>
        </>
      )}
    </motion.div>
  );
};

export default LiveIndicator;
