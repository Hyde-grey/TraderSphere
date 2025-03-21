import { useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import { useFetchData } from "../../../hooks/useFetchData";
import { useProcessMarketData } from "../../marketSummaryTable/useProcessMarketData";

type Dimensions = {
  width: number;
  height: number;
};

type usePriceOscillatorProps = {
  dimensions: Dimensions;
  symbol?: string;
};

export function usePriceOscillator({
  symbol,
  dimensions,
}: usePriceOscillatorProps) {
  const [priceChangePercent, setPriceChangePercent] = useState(0);
  const [prevPriceChangePercent, setPrevPriceChangePercent] = useState(0);
  const { marketData, loading, error, isConnected, liveError } =
    useProcessMarketData();

  useEffect(() => {
    if (!marketData || !symbol || symbol.trim() === "") return;

    const filteredData =
      marketData
        .map((item) => {
          if (item.symbol.toLowerCase() === symbol.toLowerCase()) {
            return parseFloat(item.priceChangePercent);
          }
          return;
        })
        .filter(Boolean)[0] || 0;

    setPrevPriceChangePercent(priceChangePercent);
    setPriceChangePercent(filteredData);
  }, [marketData, symbol]);

  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || dimensions.width === 0 || dimensions.height === 0)
      return;

    // Clear previous content
    d3.select(svgRef.current).selectAll("*").remove();

    // Select the SVG element
    const svg = d3.select(svgRef.current);

    // Set margins for visualization
    const margin = {
      top: 20,
      right: 60,
      bottom: 30,
      left: 20,
    };

    const width = dimensions.width;
    const height = dimensions.height;

    // Set SVG viewBox
    svg
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height]);

    const yScale = d3
      .scaleLinear()
      .domain([-10, 10])
      .range([height - margin.bottom, margin.top]);

    // Create grid lines
    const yGrid = d3
      .axisRight(yScale)
      .tickSize(-width + margin.left + margin.right)
      .tickFormat(() => "")
      .ticks(10);

    // Add grid lines
    svg
      .append("g")
      .attr("class", "grid")
      .attr("transform", `translate(${width - margin.right}, 0)`)
      .call(yGrid);

    // Create and add y-axis
    const yAxis = d3
      .axisRight(yScale)
      .tickFormat((d) => `${d}%`)
      .ticks(5);

    svg
      .append("g")
      .attr("class", "y-axis")
      .attr("transform", `translate(${width - margin.right}, 0)`)
      .call(yAxis);

    // Define gradients
    defineGradients(svg);

    // Add bars
    addBars(
      svg,
      margin,
      yScale,
      width,
      priceChangePercent,
      prevPriceChangePercent
    );
  }, [dimensions, priceChangePercent, prevPriceChangePercent]);

  return svgRef;
}

function defineGradients(
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>
) {
  // Cyan gradient for positive values
  const cyanGradient = svg
    .append("defs")
    .append("linearGradient")
    .attr("id", "cyanGradient")
    .attr("x1", "0%")
    .attr("x2", "0%")
    .attr("y1", "0%")
    .attr("y2", "100%");

  cyanGradient
    .append("stop")
    .attr("offset", "0%")
    .attr("stop-color", "rgb(123, 221, 213)")
    .attr("stop-opacity", 1);

  cyanGradient
    .append("stop")
    .attr("offset", "100%")
    .attr("stop-color", "rgba(123, 221, 213, 0)")
    .attr("stop-opacity", 0);

  // Purple gradient for negative values
  const purpleGradient = svg
    .append("defs")
    .append("linearGradient")
    .attr("id", "purpleGradient")
    .attr("x1", "0%")
    .attr("x2", "0%")
    .attr("y1", "100%")
    .attr("y2", "0%");

  purpleGradient
    .append("stop")
    .attr("offset", "0%")
    .attr("stop-color", "rgb(147, 112, 219)")
    .attr("stop-opacity", 1);

  purpleGradient
    .append("stop")
    .attr("offset", "100%")
    .attr("stop-color", "rgba(147, 112, 219, 0)")
    .attr("stop-opacity", 0);
}

function addBars(
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
  margin: { top: number; right: number; bottom: number; left: number },
  yScale: d3.ScaleLinear<number, number>,
  width: number,
  priceChangePercent: number,
  prevPriceChangePercent: number
) {
  const barWidth = 30;
  const barSpacing = 50;

  // Calculate starting position from right
  const rightEdge = width - margin.right;
  const firstBarX = rightEdge - barWidth - 50; // 50px from right edge

  // Third bar: current price change (dynamic)
  const thirdBarX = firstBarX - barSpacing * 2;

  // Determine if the price change is positive or negative
  const isPositive = priceChangePercent >= 0;
  const barHeight = Math.abs(yScale(priceChangePercent) - yScale(0));
  const barY = isPositive ? yScale(priceChangePercent) : yScale(0);

  // Add the dynamic bar based on price change percent with transition
  const bar = svg
    .append("rect")
    .attr("class", "price-bar")
    .attr("data-value", isPositive ? "positive" : "negative")
    .attr("x", firstBarX)
    .attr("y", isPositive ? yScale(prevPriceChangePercent) : yScale(0))
    .attr("width", barWidth)
    .attr("height", Math.abs(yScale(prevPriceChangePercent) - yScale(0)))
    .attr("rx", 4)
    .attr("ry", 4)
    .attr("fill", isPositive ? "url(#cyanGradient)" : "url(#purpleGradient)");

  // Animate the bar
  bar
    .transition()
    .duration(500)
    .ease(d3.easeCubicInOut)
    .attr("y", barY)
    .attr("height", barHeight);

  // Add border for the dynamic bar with transition
  const border = svg
    .append("line")
    .attr("class", "price-bar-border")
    .attr("x1", firstBarX)
    .attr("y1", yScale(prevPriceChangePercent))
    .attr("x2", firstBarX + barWidth)
    .attr("y2", yScale(prevPriceChangePercent));

  // Animate the border
  border
    .transition()
    .duration(500)
    .ease(d3.easeCubicInOut)
    .attr("y1", yScale(priceChangePercent))
    .attr("y2", yScale(priceChangePercent));
}
