import * as d3 from "d3";
import { Candlestick } from "../../utils/chartUtils";
import { createTooltips } from "./ChartTooltips";
import { createCrosshairLines, createMouseTracker } from "./ChartInteractions";

/**
 * Renders crosshair and tooltip components
 */
export function renderCrosshair(
  g: d3.Selection<SVGGElement, unknown, null, undefined>,
  innerWidth: number,
  innerHeight: number,
  candles: Candlestick[],
  xScale: d3.ScaleBand<string>,
  yScale: d3.ScaleLinear<number, number>
) {
  // Create crosshair group
  const crosshair = g
    .append("g")
    .attr("class", "crosshair")
    .style("display", "none");

  // Create tooltip elements
  const { priceLabel, priceLabelText, dateLabel, dateLabelText } =
    createTooltips(crosshair);

  // Create crosshair lines
  const { horizontalLine, verticalLine } = createCrosshairLines(
    crosshair,
    innerWidth,
    innerHeight
  );

  // Add mouse tracking area
  createMouseTracker(
    g,
    innerWidth,
    innerHeight,
    crosshair,
    priceLabel,
    dateLabel,
    horizontalLine,
    verticalLine,
    priceLabelText,
    dateLabelText,
    candles,
    xScale,
    yScale
  );
}
