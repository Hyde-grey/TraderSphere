import GridLayout, { WidthProvider } from "react-grid-layout";
import { motion } from "framer-motion";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import styles from "./gridLayout.module.css";
import MarketSummaryTable from "../widgets/marketSummaryTable/marketSummaryTable";
import { useScreenSize } from "../hooks/useScreenSize";
import FadeInMotion from "../motion/fadeInMotion";
import PriceOscillator from "../widgets/priceOscillator/priceOscillator";

import { SymbolProvider } from "../../contexts/SymbolContext";
import NewsWidget from "../widgets/newsWidget/NewsWidget";

const ResponsiveGridLayout = WidthProvider(GridLayout);

const DashboardLayout = () => {
  const { isMobile } = useScreenSize();

  const layout = isMobile
    ? [
        {
          i: "marketOverview",
          x: 0,
          y: 0,
          w: 24,
          h: 10,
          minH: 8,
          minW: 8,
          maxH: 18,
        },
        { i: "ocsillator", x: 0, y: 0, w: 24, h: 10, minH: 6, minW: 6 },
        {
          i: "candlestick",
          x: 0,
          y: 12,
          w: 24,
          h: 10,
          minH: 6,
          minW: 6,
          maxH: 18,
        },
        { i: "newsFeed", x: 0, y: 24, w: 24, h: 8, minH: 6, minW: 6 },
      ]
    : [
        {
          i: "marketOverview",
          x: 0,
          y: 0,
          w: 14,
          h: 10,
          minH: 6,
          minW: 6,
          maxH: 18,
        },
        { i: "ocsillator", x: 14, y: 0, w: 10, h: 10, minH: 6, minW: 6 },
        {
          i: "candlestick",
          x: 0,
          y: 10,
          w: 16,
          h: 8,
          minH: 6,
          minW: 6,
          maxH: 18,
        },
        { i: "newsFeed", x: 16, y: 10, w: 8, h: 8, minH: 6, minW: 6 },
      ];

  return (
    <SymbolProvider>
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
            <FadeInMotion key="marketOverview" className={styles.hudPanel}>
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

            <FadeInMotion key="ocsillator" className={styles.hudPanel}>
              <div className={styles.hudElement}>
                <div
                  className={`${styles.hudElementContent} dragMe`}
                  style={{ cursor: "move" }}
                >
                  <h2>Price Oscillator</h2>
                </div>
                <div className={styles.widgetContent}>
                  <PriceOscillator />
                </div>
              </div>
            </FadeInMotion>

            <FadeInMotion key="candlestick" className={styles.hudPanel}>
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

            <FadeInMotion key="newsFeed" className={styles.hudPanel}>
              <div className={styles.hudElement}>
                <div
                  className={`${styles.hudElementContent} dragMe`}
                  style={{ cursor: "move" }}
                >
                  <h2>News Feed</h2>
                </div>
                <div className={styles.widgetContent}>
                  <NewsWidget />
                </div>
              </div>
            </FadeInMotion>
          </ResponsiveGridLayout>
        </motion.div>
        <h1 className={styles.futuristicText}>
          Trader<span>Sphere</span>
        </h1>
      </>
    </SymbolProvider>
  );
};

export default DashboardLayout;
