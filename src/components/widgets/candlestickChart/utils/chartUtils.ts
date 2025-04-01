import * as d3 from "d3";

/**
 * Represents a single candlestick in the chart
 */
export type Candlestick = {
  date: Date; // Date/time of the candle
  open: number; // Opening price
  high: number; // Highest price during the period
  low: number; // Lowest price during the period
  close: number; // Closing price
  volume: number; // Trading volume
};

/**
 * Transforms raw Binance kline data into a format suitable for D3 rendering
 * @param data - Raw kline data array
 * @returns Transformed candlestick data
 */
export function transformKlineData(data: any[]): Candlestick[] {
  return data.map((candle) => ({
    date: new Date(Number(candle[0])),
    open: Number(candle[1]),
    high: Number(candle[2]),
    low: Number(candle[3]),
    close: Number(candle[4]),
    volume: Number(candle[5]),
  }));
}

/**
 * Chart color theme
 */
export const chartColors = {
  background: "rgba(0, 0, 0, 0.2)", // Dark background
  grid: "rgba(255, 255, 255, 0.4)", // Grid lines
  text: "#a0aec0",
  axis: "rgba(255, 255, 255, 0.6)", // Axis lines
  axisText: "rgba(255, 255, 255, 0.7)",

  // Candle colors
  bullish: "rgba(123, 221, 213, 0.81)", // Cyan for bullish candles
  bearish: "rgba(148, 112, 219, 0.75)", // Purple for bearish candles
  neutral: "#718096", // Gray for no change
  bullishBorder: "rgba(123, 221, 213, 1)",
  bearishBorder: "rgba(148, 112, 219, 1)",

  // Effects
  bullishGlow: "rgba(123, 221, 213, 0.5)", // Cyan glow for bullish candles
  bearishGlow: "rgba(148, 112, 219, 0.5)", // Purple glow for bearish candles

  // Crosshair and tooltip
  crosshair: "rgba(123, 221, 213, 0.5)", // Cyan for crosshair
  tooltipBackground: "rgba(70, 80, 100, 0.5)",
  tooltipBorder: "rgba(123, 221, 213, 0.3)",

  // Legacy properties (kept for compatibility)
  gridLines: "#22334d",
  axes: "#4a5568",
  wick: "#cbd5e0",
  axisLine: "rgba(255, 255, 255, 0.2)",
  tickLine: "rgba(255, 255, 255, 0.1)",
  gridLine: "rgba(255, 255, 255, 0.05)",
};

/**
 * Format price based on its range
 * @param d - Price value
 * @returns Formatted price string
 */
export const priceFormat = (d: number | { valueOf(): number }) => {
  const value = typeof d === "number" ? d : d.valueOf();
  // For crypto, adapt decimal places based on price range
  if (value >= 1000) return d3.format("$,.0f")(value); // No decimals for large values
  if (value >= 10) return d3.format("$,.1f")(value); // 1 decimal for medium values
  return d3.format("$,.4f")(value); // 4 decimals for small values
};

/**
 * Format functions for dates
 */
export const dateFormatters = {
  full: d3.timeFormat("%b %d, %H:%M"),
  tick: d3.timeFormat("%d/%H:%M"), // Day/Hour:Minute
  short: d3.timeFormat("%H:%M"), // Hour:Minute only
  hourly: d3.timeFormat("%d/%m %H:%M"), // Simple day/month hour:minute format
  compact: d3.timeFormat("%d %H:%M"), // Day Hour:Minute (space instead of slash)
  timeOnly: d3.timeFormat("%H:%M"), // Just hours and minutes
};

/**
 * Default chart margins
 */
export const defaultMargin = { top: 20, right: 60, bottom: 60, left: 80 };
