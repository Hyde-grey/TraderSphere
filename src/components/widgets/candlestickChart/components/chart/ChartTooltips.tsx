import * as d3 from "d3";
import {
  priceFormat,
  dateFormatters,
  Candlestick,
} from "../../utils/chartUtils";

/**
 * Creates tooltip elements
 */
export function createTooltips(
  crosshair: d3.Selection<SVGGElement, unknown, null, undefined>
) {
  // Price label group
  const priceLabel = crosshair
    .append("g")
    .attr("class", "price-tooltip")
    .style("opacity", 1);

  // Price tooltip background
  priceLabel
    .append("rect")
    .attr("class", "crosshair-price-bg")
    .attr("height", 20);

  // Price tooltip text
  const priceLabelText = priceLabel
    .append("text")
    .attr("class", "crosshair-price-text");

  // Date label group
  const dateLabel = crosshair
    .append("g")
    .attr("class", "date-tooltip")
    .style("opacity", 1);

  // Date tooltip background
  const dateRect = dateLabel
    .append("rect")
    .attr("class", "crosshair-date-bg")
    .attr("height", 20);

  // Date tooltip text
  const dateLabelText = dateLabel
    .append("text")
    .attr("class", "crosshair-date-text");

  return { priceLabel, priceLabelText, dateLabel, dateLabelText, dateRect };
}

/**
 * Updates the price tooltip
 */
export function updatePriceTooltip(
  y: number,
  x: number,
  yScale: d3.ScaleLinear<number, number>,
  priceLabel: d3.Selection<SVGGElement, unknown, null, undefined>,
  priceLabelText: d3.Selection<SVGTextElement, unknown, null, undefined>,
  innerWidth: number
) {
  // Get the price at current y position
  const yValue = yScale.invert(y);

  // Format price with error handling
  let priceText = "";
  try {
    priceText = priceFormat(yValue);
    if (!priceText || priceText === "") {
      priceText = "$" + yValue.toFixed(2);
    }
  } catch (e) {
    console.error("Price formatting error:", e);
    priceText = "$" + yValue.toFixed(2);
  }

  // Calculate tooltip dimensions
  const priceTextWidth = Math.max(priceText.length * 8, 80);
  const padding = 16;
  const priceTooltipWidth = priceTextWidth + padding;

  // Position price tooltip with offset
  let priceTooltipX = x + 15;
  let priceTooltipY = y - 30;

  // Adjust tooltip position to keep it on screen
  if (priceTooltipX + priceTooltipWidth > innerWidth) {
    priceTooltipX = x - priceTooltipWidth - 15;
  }

  if (priceTooltipY < 0) {
    priceTooltipY = y + 30;
  }

  // Apply tooltip position
  priceLabel
    .attr("transform", `translate(${priceTooltipX}, ${priceTooltipY})`)
    .style("pointer-events", "none"); // Prevent tooltip from blocking mouse events

  // Update tooltip text
  priceLabelText
    .attr("x", priceTooltipWidth / 2)
    .attr("y", 9)
    .text(priceText);

  // Update tooltip background
  priceLabel.select("rect").attr("width", priceTooltipWidth).attr("x", 0);
}

/**
 * Updates the date tooltip
 */
export function updateDateTooltip(
  dataPoint: Candlestick,
  x: number,
  dateLabel: d3.Selection<SVGGElement, unknown, null, undefined>,
  dateLabelText: d3.Selection<SVGTextElement, unknown, null, undefined>,
  innerWidth: number,
  innerHeight: number
) {
  // Format date with error handling
  let dateText = "";
  try {
    dateText = dateFormatters.full(dataPoint.date);
    if (!dateText || dateText === "") {
      dateText = dataPoint.date.toLocaleString();
    }
  } catch (e) {
    console.error("Date formatting error:", e);
    dateText = dataPoint.date.toLocaleString();
  }

  // Calculate tooltip dimensions
  const dateTextWidth = Math.max(dateText.length * 8, 100);
  const padding = 16;
  const dateTooltipWidth = dateTextWidth + padding;

  // Position tooltip
  let dateTooltipX = x - dateTooltipWidth / 2;

  // Keep tooltip within chart bounds
  if (dateTooltipX < 0) {
    dateTooltipX = 0;
  } else if (dateTooltipX + dateTooltipWidth > innerWidth) {
    dateTooltipX = innerWidth - dateTooltipWidth;
  }

  const dateTooltipY = innerHeight + 5;

  // Apply tooltip position
  dateLabel
    .attr("transform", `translate(${dateTooltipX}, ${dateTooltipY})`)
    .style("pointer-events", "none");

  // Update tooltip text
  dateLabelText
    .attr("x", dateTooltipWidth / 2)
    .attr("y", 9)
    .text(dateText);

  // Update tooltip background
  dateLabel.select("rect").attr("width", dateTooltipWidth).attr("x", 0);
}
