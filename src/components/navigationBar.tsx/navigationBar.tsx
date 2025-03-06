import { motion } from "framer-motion";
import styles from "./navigationBar.module.css";

const NavigationBar = () => {
  return (
    <motion.div
      className={styles.navigation}
      initial={{ opacity: 0, width: "0" }}
      animate={{ opacity: 1, width: "   50%" }}
      exit={{ opacity: 0, width: "0" }}
    >
      <div className={`${styles.navigationItem} ${styles.active}`}>
        <p>Dashboard</p>
      </div>
      <div className={styles.navigationItem}>
        <p>Portfolio</p>
      </div>
      <div className={styles.navigationItem}>
        <p>History</p>
      </div>
      <div className={styles.navigationItem}>
        <p>Market</p>
      </div>
      <div className={styles.navigationItem}>
        <p>Settings</p>
      </div>
    </motion.div>
  );
};

export default NavigationBar;
