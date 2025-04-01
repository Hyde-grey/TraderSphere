import * as d3 from "d3";
import { Candlestick } from "../../utils/chartUtils";

/**
 * Highlights the current candlestick
 */
export function highlightCandle(
  g: d3.Selection<SVGGElement, unknown, null, undefined>,
  index: number,
  candles: Candlestick[]
) {
  // Reset all candlesticks
  g.selectAll(".candlestick rect.candle")
    .classed("highlighted", false)
    .classed("pulse-bullish", false)
    .classed("pulse-bearish", false);

  // Select the candlestick at the calculated index
  const candlestickElements = g.selectAll(".candlestick").nodes();
  if (candlestickElements[index]) {
    const candleSelection = d3
      .select(candlestickElements[index])
      .select("rect.candle");

    // Get candle data to determine correct pulse class
    const candleData = candles[index];
    const isRising = candleData.close > candleData.open;

    // Apply highlighting
    candleSelection
      .classed("highlighted", true)
      .classed("pulse-bullish", isRising)
      .classed("pulse-bearish", !isRising);
  }
}
