import GridLayout, { WidthProvider } from "react-grid-layout";
import { motion } from "framer-motion";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import styles from "./gridLayout.module.css";
import MarketSummaryTable from "../widgets/marketSummaryTable";

const ResponsiveGridLayout = WidthProvider(GridLayout);

const layout = [
  { i: "widget1", x: 0, y: 0, w: 4, h: 5.5, minH: 3, minW: 3, maxH: 9 },
  { i: "widget2", x: 4, y: 0, w: 8, h: 5.5, minH: 3, minW: 3, maxH: 9 },
  { i: "widget3", x: 0, y: 4, w: 6, h: 5, minH: 3, minW: 3 },
  { i: "widget4", x: 6, y: 4, w: 6, h: 4.5, minH: 3, minW: 3 },
];

const DashboardLayout = () => {
  return (
    <>
      <motion.div
        className={styles.container}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className={styles.componentPattern}></div>
        <ResponsiveGridLayout
          className="layout"
          layout={layout}
          cols={12}
          rowHeight={100}
          bounds={{ top: 0, right: 0, bottom: 0, left: 0 }}
          draggableHandle=".dragMe"
        >
          <motion.div
            key="widget1"
            className={styles.hudPanel}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className={styles.hudElement}>
              <div
                className={`${styles.hudElementContent} dragMe`}
                style={{ cursor: "move" }}
              >
                <h2>Market Overview</h2>
              </div>
              <div className={styles.widgetContent}>
                <MarketSummaryTable />
              </div>
            </div>
          </motion.div>

          <motion.div
            key="widget2"
            className={styles.hudPanel}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            exit={{ opacity: 0 }}
          >
            <div className={styles.hudElement}>
              <div
                className={`${styles.hudElementContent} dragMe`}
                style={{ cursor: "move" }}
              >
                <h2>Candlestick Chart</h2>
              </div>
            </div>
          </motion.div>
          <motion.div
            key="widget3"
            className={styles.hudPanel}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className={styles.hudElement}>
              <div
                className={`${styles.hudElementContent} dragMe`}
                style={{ cursor: "move" }}
              >
                <h2>Recent Trades</h2>
              </div>
            </div>
          </motion.div>
          <motion.div
            key="widget4"
            className={styles.hudPanel}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className={styles.hudElement}>
              <div
                className={`${styles.hudElementContent} dragMe`}
                style={{ cursor: "move" }}
              >
                <h2>Order Book</h2>
              </div>
            </div>
          </motion.div>
        </ResponsiveGridLayout>
      </motion.div>
      <h1 className={styles.futuristicText}>
        Trade<span>Sphere</span>
      </h1>
    </>
  );
};

export default DashboardLayout;
