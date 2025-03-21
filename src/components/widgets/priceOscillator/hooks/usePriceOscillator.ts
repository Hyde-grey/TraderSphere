import { useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import { useProcessMarketData } from "../../marketSummaryTable/useProcessMarketData";

type Dimensions = {
  width: number;
  height: number;
};

type usePriceOscillatorProps = {
  dimensions: Dimensions;
  selectedSymbol?: string;
};

export function usePriceOscillator({
  selectedSymbol,
  dimensions,
}: usePriceOscillatorProps) {
  const [priceChangePercent, setPriceChangePercent] = useState(0);
  const [filteredData, setFilteredData] = useState<{
    priceChangePercent: number;
    lastPrice: string;
  }>({
    priceChangePercent: 0,
    lastPrice: "0.00",
  });
  const { marketData } = useProcessMarketData();

  const svgRef = useRef<SVGSVGElement>(null);
  const isInitialRender = useRef(true);

  useEffect(() => {
    if (!marketData || !selectedSymbol?.trim()) return;

    const matchingItem = marketData.find(
      (item) => item.symbol.toLowerCase() === selectedSymbol.toLowerCase()
    );

    if (matchingItem) {
      const newPriceChangePercent = parseFloat(matchingItem.priceChangePercent);
      setPriceChangePercent(newPriceChangePercent);
      setFilteredData({
        priceChangePercent: newPriceChangePercent,
        lastPrice: matchingItem.lastPrice,
      });
    }
  }, [marketData, selectedSymbol]);

  useEffect(() => {
    if (!svgRef.current || dimensions.width === 0 || dimensions.height === 0)
      return;

    const svg = d3.select(svgRef.current);

    const margin = {
      top: 40,
      right: 60,
      bottom: 40,
      left: 40,
    };

    // Use numeric values for calculations
    const width = dimensions.width;
    const height = dimensions.height;
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    // Create scale with fixed domain for percentage
    const yScale = d3
      .scaleLinear()
      .domain([-10, 10])
      .range([height - margin.bottom, margin.top])
      .nice();

    // Keep SVG at 100% for responsive behavior
    svg.attr("width", "100%").attr("height", "100%");

    if (isInitialRender.current) {
      svg.selectAll("*").remove();

      // Create main chart group with proper transform
      const g = svg
        .append("g")
        .attr("class", "chart-group")
        .attr("transform", `translate(${margin.left},0)`);

      // Add grid lines
      g.append("g")
        .attr("class", "grid")
        .attr("transform", `translate(${chartWidth}, 0)`)
        .call(
          d3
            .axisRight(yScale)
            .tickSize(-chartWidth)
            .tickFormat(() => "")
            .ticks(10)
        )
        .call((g) => g.selectAll(".domain").remove());

      // Add y-axis
      g.append("g")
        .attr("class", "y-axis")
        .attr("transform", `translate(${chartWidth}, 0)`)
        .call(
          d3
            .axisRight(yScale)
            .tickFormat((d) => `${d}%`)
            .ticks(5)
        );

      // Add zero line
      g.append("line")
        .attr("class", "zero-line")
        .attr("x1", 0)
        .attr("x2", chartWidth)
        .attr("y1", yScale(0))
        .attr("y2", yScale(0))
        .attr("stroke", "rgba(255,255,255,0.2)")
        .attr("stroke-dasharray", "2,2");

      defineGradients(svg);
      isInitialRender.current = false;
    } else {
      // Update grid lines
      const grid = svg.select(".grid") as d3.Selection<
        SVGGElement,
        unknown,
        null,
        undefined
      >;
      if (!grid.empty()) {
        grid.attr("transform", `translate(${chartWidth}, 0)`).call(
          d3
            .axisRight(yScale)
            .tickSize(-chartWidth)
            .tickFormat(() => "")
            .ticks(10)
        );
        grid.selectAll(".domain").remove();
      }

      // Update y-axis
      const yAxis = svg.select(".y-axis") as d3.Selection<
        SVGGElement,
        unknown,
        null,
        undefined
      >;
      if (!yAxis.empty()) {
        yAxis.attr("transform", `translate(${chartWidth}, 0)`).call(
          d3
            .axisRight(yScale)
            .tickFormat((d) => `${d}%`)
            .ticks(5)
        );
      }

      // Update zero line
      const zeroLine = svg.select(".zero-line") as d3.Selection<
        SVGLineElement,
        unknown,
        null,
        undefined
      >;
      if (!zeroLine.empty()) {
        zeroLine
          .attr("x2", chartWidth)
          .attr("y1", yScale(0))
          .attr("y2", yScale(0));
      }
    }

    updateBar(svg, yScale, chartWidth, priceChangePercent);
  }, [dimensions, priceChangePercent]);

  return { svgRef, filteredData };
}

function defineGradients(
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>
) {
  const gradients = [
    {
      id: "cyanGradient",
      color: "rgb(123, 221, 213)",
      direction: "down",
    },
    {
      id: "purpleGradient",
      color: "rgb(147, 112, 219)",
      direction: "up",
    },
  ];

  gradients.forEach(({ id, color, direction }) => {
    const gradient = svg
      .append("defs")
      .append("linearGradient")
      .attr("id", id)
      .attr("x1", "0%")
      .attr("x2", "0%")
      .attr("y1", direction === "down" ? "0%" : "100%")
      .attr("y2", direction === "down" ? "100%" : "0%");

    gradient
      .append("stop")
      .attr("offset", "0%")
      .attr("stop-color", color)
      .attr("stop-opacity", 1);

    gradient
      .append("stop")
      .attr("offset", "100%")
      .attr("stop-color", color)
      .attr("stop-opacity", 0);
  });
}

function updateBar(
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
  yScale: d3.ScaleLinear<number, number>,
  chartWidth: number,
  priceChangePercent: number
) {
  const barWidth = 60;
  const barX = chartWidth - barWidth - 10;
  const isPositive = priceChangePercent >= 0;

  // Calculate bar dimensions relative to zero line
  const zeroY = yScale(0);
  const valueY = yScale(priceChangePercent);
  const barHeight = Math.abs(zeroY - valueY);
  const barY = isPositive ? valueY : zeroY;

  const chartGroup = svg.select<SVGGElement>(".chart-group");
  const bar = chartGroup.select<SVGRectElement>(".price-bar");

  if (bar.empty()) {
    chartGroup
      .append("rect")
      .attr("class", "price-bar")
      .attr("x", barX)
      .attr("width", barWidth)
      .attr("rx", 4)
      .attr("ry", 4)
      .attr("data-value", isPositive ? "positive" : "negative")
      .attr("fill", isPositive ? "url(#cyanGradient)" : "url(#purpleGradient)")
      .attr("y", barY)
      .attr("height", barHeight);
  } else {
    bar
      .attr("data-value", isPositive ? "positive" : "negative")
      .attr("fill", isPositive ? "url(#cyanGradient)" : "url(#purpleGradient)")
      .attr("x", barX)
      .transition()
      .duration(500)
      .ease(d3.easeCubicInOut)
      .attr("y", barY)
      .attr("height", barHeight);
  }

  // Update or create border line
  const border = chartGroup.select<SVGLineElement>(".price-bar-border");
  const borderY = yScale(priceChangePercent);

  if (border.empty()) {
    chartGroup
      .append("line")
      .attr("class", "price-bar-border")
      .attr("x1", barX)
      .attr("x2", barX + barWidth)
      .attr("y1", borderY)
      .attr("y2", borderY)
      .attr("stroke", "rgba(255,255,255,0.5)")
      .attr("stroke-width", 1);
  } else {
    border
      .attr("x1", barX)
      .attr("x2", barX + barWidth)
      .transition()
      .duration(500)
      .ease(d3.easeCubicInOut)
      .attr("y1", borderY)
      .attr("y2", borderY);
  }
}
