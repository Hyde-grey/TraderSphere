import GridLayout, { WidthProvider } from "react-grid-layout";
import { motion } from "framer-motion";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import styles from "./gridLayout.module.css";
import MarketSummaryTable from "../widgets/marketSummaryTable/marketSummaryTable";
import { useScreenSize } from "../hooks/useScreenSize";
import FadeInMotion from "../motion/fadeInMotion";
import PriceOscillator from "../widgets/priceOscillator/priceOscillator";
import CandleStickChart from "../widgets/candlestickChart/candleStickChart";
import { useSaveLayout } from "../hooks/useSaveLayout";

import { SymbolProvider } from "../../contexts/SymbolContext";
import NewsWidget from "../widgets/newsWidget/NewsWidget";

const ResponsiveGridLayout = WidthProvider(GridLayout);

const DashboardLayout = () => {
  const { isMobile } = useScreenSize();
  const { layout, saveLayout, resetLayout } = useSaveLayout();

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
            onLayoutChange={saveLayout}
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
                  <CandleStickChart />
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
