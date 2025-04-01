import * as d3 from "d3";
import {
  chartColors,
  priceFormat,
  dateFormatters,
  Candlestick,
} from "../../utils/chartUtils";

// Chart margin type
export type Margin = {
  top: number;
  right: number;
  bottom: number;
  left: number;
};

// Chart scales type
export type ChartScales = {
  xScale: d3.ScaleBand<string>;
  yScale: d3.ScaleLinear<number, number>;
};

/**
 * Renders all chart elements including axes, grid and candlesticks
 */
export function renderChartElements(
  g: d3.Selection<SVGGElement, unknown, null, undefined>,
  candles: Candlestick[],
  innerWidth: number,
  innerHeight: number,
  margin: Margin,
  showVolume: boolean = false
): ChartScales {
  // Create scales
  const { xScale, yScale } = createScales(candles, innerWidth, innerHeight);

  // Render grid
  renderGrid(g, xScale, yScale, innerWidth, innerHeight, candles);

  // Render axes
  renderAxes(g, xScale, yScale, innerWidth, innerHeight);

  // Render candlesticks
  renderCandlesticks(g, candles, xScale, yScale);

  return { xScale, yScale };
}

/**
 * Creates scales for the chart
 */
function createScales(
  candles: Candlestick[],
  innerWidth: number,
  innerHeight: number
): ChartScales {
  // Create time scale for x-axis
  const xScale = d3
    .scaleBand<string>()
    .domain(candles.map((d) => d.date.getTime().toString()))
    .range([0, innerWidth])
    .padding(0.2);

  // Find min and max prices
  const prices = candles.flatMap((d) => [d.high, d.low, d.open, d.close]);
  const minPrice = d3.min(prices) || 0;
  const maxPrice = d3.max(prices) || 0;

  // Add some padding to y-axis
  const padding = (maxPrice - minPrice) * 0.1;

  // Create price scale for y-axis
  const yScale = d3
    .scaleLinear()
    .domain([minPrice - padding, maxPrice + padding])
    .range([innerHeight, 0])
    .nice();

  return { xScale, yScale };
}

/**
 * Renders grid lines
 */
function renderGrid(
  g: d3.Selection<SVGGElement, unknown, null, undefined>,
  xScale: d3.ScaleBand<string>,
  yScale: d3.ScaleLinear<number, number>,
  innerWidth: number,
  innerHeight: number,
  candles: Candlestick[]
) {
  // Add horizontal grid lines
  g.append("g")
    .attr("class", "grid horizontal-grid")
    .selectAll("line")
    .data(yScale.ticks(5))
    .enter()
    .append("line")
    .attr("x1", 0)
    .attr("x2", innerWidth)
    .attr("y1", (d) => yScale(d))
    .attr("y2", (d) => yScale(d));

  // Add vertical grid lines
  const xTicks = xScale
    .domain()
    .filter((_, i) => i % Math.ceil(candles.length / 10) === 0);

  g.append("g")
    .attr("class", "grid vertical-grid")
    .selectAll("line")
    .data(xTicks)
    .enter()
    .append("line")
    .attr("y1", 0)
    .attr("y2", innerHeight)
    .attr("x1", (d) => (xScale(d) || 0) + xScale.bandwidth() / 2)
    .attr("x2", (d) => (xScale(d) || 0) + xScale.bandwidth() / 2);
}

/**
 * Renders axes
 */
function renderAxes(
  g: d3.Selection<SVGGElement, unknown, null, undefined>,
  xScale: d3.ScaleBand<string>,
  yScale: d3.ScaleLinear<number, number>,
  innerWidth: number,
  innerHeight: number
) {
  // X-axis using D3's axis generator - similar to y-axis implementation
  const xAxis = g
    .append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0, ${innerHeight})`)
    .call(
      d3
        .axisBottom(xScale)
        .tickSize(6)
        .tickValues(
          xScale.domain().filter((_, i, array) => {
            // Show fewer ticks - only about 6-8 for better readability
            const step = Math.max(1, Math.floor(array.length / 6));
            return i % step === 0;
          })
        )
        .tickFormat((d) => {
          try {
            const date = new Date(parseInt(d));
            const day = date.getDate();
            const month = date.getMonth() + 1; // JavaScript months are 0-indexed
            const hours = date.getHours();
            const minutes = date.getMinutes();
            return `${day.toString().padStart(2, "0")}/${month
              .toString()
              .padStart(2, "0")} ${hours.toString().padStart(2, "0")}:${minutes
              .toString()
              .padStart(2, "0")}`;
          } catch (e) {
            console.error("Error formatting date", e);
            return "";
          }
        })
    );

  // Let the CSS handle most of the text styling
  xAxis.selectAll("text").attr("class", "x-axis-label");

  // Y-axis (left) with more ticks
  const yAxis = g
    .append("g")
    .attr("class", "y-axis")
    .call(
      d3
        .axisLeft(yScale)
        .ticks(5)
        .tickFormat((d) => priceFormat(d as number))
    );

  // Y-axis (right)
  const yAxisRight = g
    .append("g")
    .attr("class", "y-axis-right")
    .attr("transform", `translate(${innerWidth}, 0)`)
    .call(
      d3
        .axisRight(yScale)
        .ticks(5)
        .tickFormat(() => "")
    );
}

/**
 * Renders candlesticks
 */
function renderCandlesticks(
  g: d3.Selection<SVGGElement, unknown, null, undefined>,
  candles: Candlestick[],
  xScale: d3.ScaleBand<string>,
  yScale: d3.ScaleLinear<number, number>
) {
  // Create a group for candlesticks
  const candlestickGroup = g.append("g").attr("class", "candlesticks");

  // Add individual candlesticks
  const candlestick = candlestickGroup
    .selectAll(".candlestick")
    .data(candles)
    .enter()
    .append("g")
    .attr("class", "candlestick")
    .attr(
      "transform",
      (d) => `translate(${xScale(d.date.getTime().toString()) || 0}, 0)`
    );

  // Add candlestick wicks (high-low line)
  candlestick
    .append("line")
    .attr("class", "wick")
    .attr("x1", xScale.bandwidth() / 2)
    .attr("x2", xScale.bandwidth() / 2)
    .attr("y1", (d) => yScale(d.high))
    .attr("y2", (d) => yScale(d.low))
    .attr("stroke", (d) =>
      d.close >= d.open ? chartColors.bullish : chartColors.bearish
    );

  // Add candlestick bodies
  candlestick
    .append("rect")
    .attr("class", "candle")
    .attr("x", 0)
    .attr("y", (d) => yScale(Math.max(d.open, d.close)))
    .attr("width", xScale.bandwidth())
    .attr("height", (d) => {
      // Ensure minimum height for visibility
      const height = Math.abs(yScale(d.open) - yScale(d.close));
      return height < 1 ? 1 : height;
    })
    .attr("fill", (d) => {
      // Use bullish/bearish colors directly from chartColors
      return d.close >= d.open ? chartColors.bullish : chartColors.bearish;
    })
    .attr("stroke", (d) =>
      d.close >= d.open ? chartColors.bullishBorder : chartColors.bearishBorder
    )
    .attr("filter", (d) => {
      // Apply glow filter
      return d.close >= d.open ? "url(#bullishGlow)" : "url(#bearishGlow)";
    });
}
