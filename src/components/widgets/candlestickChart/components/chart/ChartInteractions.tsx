import * as d3 from "d3";
import { Candlestick } from "../../utils/chartUtils";
import { updatePriceTooltip, updateDateTooltip } from "./ChartTooltips";
import { highlightCandle } from "./ChartHighlighter";

/**
 * Creates crosshair lines
 */
export function createCrosshairLines(
  crosshair: d3.Selection<SVGGElement, unknown, null, undefined>,
  innerWidth: number,
  innerHeight: number
) {
  // Horizontal line
  const horizontalLine = crosshair
    .append("line")
    .attr("class", "crosshair-h")
    .attr("x1", 0)
    .attr("x2", innerWidth);

  // Vertical line
  const verticalLine = crosshair
    .append("line")
    .attr("class", "crosshair-v")
    .attr("y1", 0)
    .attr("y2", innerHeight);

  return { horizontalLine, verticalLine };
}

/**
 * Creates mouse tracking area and handlers
 */
export function createMouseTracker(
  g: d3.Selection<SVGGElement, unknown, null, undefined>,
  innerWidth: number,
  innerHeight: number,
  crosshair: d3.Selection<SVGGElement, unknown, null, undefined>,
  priceLabel: d3.Selection<SVGGElement, unknown, null, undefined>,
  dateLabel: d3.Selection<SVGGElement, unknown, null, undefined>,
  horizontalLine: d3.Selection<SVGLineElement, unknown, null, undefined>,
  verticalLine: d3.Selection<SVGLineElement, unknown, null, undefined>,
  priceLabelText: d3.Selection<SVGTextElement, unknown, null, undefined>,
  dateLabelText: d3.Selection<SVGTextElement, unknown, null, undefined>,
  candles: Candlestick[],
  xScale: d3.ScaleBand<string>,
  yScale: d3.ScaleLinear<number, number>
) {
  // Mouse tracking rectangle
  const mouseTracker = g
    .append("rect")
    .attr("width", innerWidth)
    .attr("height", innerHeight)
    .attr("fill", "none")
    .attr("pointer-events", "all");

  // Mouse enter handler
  mouseTracker.on("mouseenter", () => {
    crosshair.style("display", null);
    priceLabel.style("display", null);
    dateLabel.style("display", null);
  });

  // Mouse leave handler
  mouseTracker.on("mouseleave", () => {
    crosshair.style("display", "none");
    priceLabel.style("display", "none");
    dateLabel.style("display", "none");
  });

  // Mouse move handler
  mouseTracker.on("mousemove", function (event) {
    handleMouseMove(
      event,
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
      yScale,
      g
    );
  });

  return mouseTracker;
}

/**
 * Handles mouse movements for crosshair and tooltips
 */
function handleMouseMove(
  event: any,
  innerWidth: number,
  innerHeight: number,
  crosshair: d3.Selection<SVGGElement, unknown, null, undefined>,
  priceLabel: d3.Selection<SVGGElement, unknown, null, undefined>,
  dateLabel: d3.Selection<SVGGElement, unknown, null, undefined>,
  horizontalLine: d3.Selection<SVGLineElement, unknown, null, undefined>,
  verticalLine: d3.Selection<SVGLineElement, unknown, null, undefined>,
  priceLabelText: d3.Selection<SVGTextElement, unknown, null, undefined>,
  dateLabelText: d3.Selection<SVGTextElement, unknown, null, undefined>,
  candles: Candlestick[],
  xScale: d3.ScaleBand<string>,
  yScale: d3.ScaleLinear<number, number>,
  g: d3.Selection<SVGGElement, unknown, null, undefined>
) {
  // Get pointer coordinates
  const [mouseX, mouseY] = d3.pointer(event);

  // Ensure coordinates are within bounds
  const x = Math.max(0, Math.min(mouseX, innerWidth));
  const y = Math.max(0, Math.min(mouseY, innerHeight));

  // Update the position of the crosshair
  horizontalLine.attr("y1", y).attr("y2", y);
  verticalLine.attr("x1", x).attr("x2", x);

  // Find nearest candle
  const index = findNearestCandleIndex(x, xScale);

  // Force crosshair and tooltips to show
  crosshair.style("display", "block");
  priceLabel.style("display", "block").style("opacity", 1);
  dateLabel.style("display", "block").style("opacity", 1);

  if (index >= 0 && index < candles.length) {
    const dataPoint = candles[index];

    // Update price tooltip
    updatePriceTooltip(y, x, yScale, priceLabel, priceLabelText, innerWidth);

    // Update date tooltip
    updateDateTooltip(
      dataPoint,
      x,
      dateLabel,
      dateLabelText,
      innerWidth,
      innerHeight
    );

    // Highlight the current candlestick
    highlightCandle(g, index, candles);
  }
}

/**
 * Finds the index of the nearest candle to the mouse position
 */
export function findNearestCandleIndex(
  x: number,
  xScale: d3.ScaleBand<string>
): number {
  // Find the index in the x domain that corresponds to our mouse position
  let index = 0;
  let minDistance = Infinity;
  const domain = xScale.domain();

  for (let i = 0; i < domain.length; i++) {
    const candleX = xScale(domain[i]) || 0;
    const distance = Math.abs(candleX + xScale.bandwidth() / 2 - x);
    if (distance < minDistance) {
      minDistance = distance;
      index = i;
    }
  }

  return index;
}
