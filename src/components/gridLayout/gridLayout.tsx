import GridLayout, { WidthProvider } from "react-grid-layout";
import { motion } from "framer-motion";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import styles from "./gridLayout.module.css";
import MarketSummaryTable from "../widgets/marketSummaryTable/marketSummaryTable";
import { useScreenSize } from "../hooks/useScreenSize";
import FadeInMotion from "../motion/fadeInMotion";

const ResponsiveGridLayout = WidthProvider(GridLayout);

const DashboardLayout = () => {
  const { isMobile } = useScreenSize();

  const layout = isMobile
    ? [
        { i: "widget1", x: 0, y: 0, w: 24, h: 10, minH: 8, minW: 8, maxH: 18 },
        { i: "widget2", x: 0, y: 12, w: 24, h: 10, minH: 6, minW: 6, maxH: 18 },
        { i: "widget3", x: 0, y: 24, w: 24, h: 8, minH: 6, minW: 6 },
        { i: "widget4", x: 0, y: 34, w: 24, h: 8, minH: 6, minW: 6 },
      ]
    : [
        { i: "widget1", x: 0, y: 0, w: 8, h: 10, minH: 6, minW: 6, maxH: 18 },
        { i: "widget2", x: 8, y: 0, w: 16, h: 10, minH: 6, minW: 6, maxH: 18 },
        { i: "widget3", x: 0, y: 8, w: 12, h: 9, minH: 6, minW: 6 },
        { i: "widget4", x: 12, y: 8, w: 12, h: 9, minH: 6, minW: 6 },
      ];

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
          cols={24}
          rowHeight={50}
          bounds={{ top: 0, right: 0, bottom: 0, left: 0 }}
          draggableHandle=".dragMe"
          useCSSTransforms={true}
        >
          <FadeInMotion key="widget1" className={styles.hudPanel}>
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
          </FadeInMotion>

          <FadeInMotion key="widget2" className={styles.hudPanel}>
            <div className={styles.hudElement}>
              <div
                className={`${styles.hudElementContent} dragMe`}
                style={{ cursor: "move" }}
              >
                <h2>Candlestick Chart</h2>
              </div>
              <div className={styles.widgetContent}>
                <div>Chart content coming soon...</div>
              </div>
            </div>
          </FadeInMotion>

          <FadeInMotion key="widget3" className={styles.hudPanel}>
            <div className={styles.hudElement}>
              <div
                className={`${styles.hudElementContent} dragMe`}
                style={{ cursor: "move" }}
              >
                <h2>Recent Trades</h2>
              </div>
              <div className={styles.widgetContent}>
                <div>Trades content coming soon...</div>
              </div>
            </div>
          </FadeInMotion>

          <FadeInMotion key="widget4" className={styles.hudPanel}>
            <div className={styles.hudElement}>
              <div
                className={`${styles.hudElementContent} dragMe`}
                style={{ cursor: "move" }}
              >
                <h2>Order Book</h2>
              </div>
              <div className={styles.widgetContent}>
                <div>Order book content coming soon...</div>
              </div>
            </div>
          </FadeInMotion>
        </ResponsiveGridLayout>
      </motion.div>
      <h1 className={styles.futuristicText}>
        Trader<span>Sphere</span>
      </h1>
    </>
  );
};

export default DashboardLayout;
