import { useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import { useProcessMarketData } from "../../marketSummaryTable/useProcessMarketData";

type Dimensions = {
  width: number;
  height: number;
};

type PriceHistoryItem = {
  priceChangePercent: number;
  timestamp: number;
};

type usePriceOscillatorProps = {
  dimensions: Dimensions;
  selectedSymbol?: string;
};

const TOTAL_BARS = 11;

export function usePriceOscillator({
  selectedSymbol,
  dimensions,
}: usePriceOscillatorProps) {
  const [priceChangePercent, setPriceChangePercent] = useState(0);
  const [priceHistory, setPriceHistory] = useState<PriceHistoryItem[]>(
    Array(TOTAL_BARS).fill({ priceChangePercent: 0, timestamp: Date.now() })
  );
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
  const [currentRange, setCurrentRange] = useState<[number, number]>([-2, 2]);

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
      setCurrentRange(getDynamicRange(newPriceChangePercent));

      // Update history by shifting values left and adding new value at the end
      setPriceHistory((prev) => {
        const newHistory = [
          ...prev.slice(1),
          {
            priceChangePercent: newPriceChangePercent,
            timestamp: Date.now(),
          },
        ];
        return newHistory;
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
      .domain(currentRange)
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

    updateBars(svg, yScale, chartWidth, priceHistory);
  }, [dimensions, priceHistory, currentRange]);

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

function updateBars(
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
  yScale: d3.ScaleLinear<number, number>,
  chartWidth: number,
  history: PriceHistoryItem[]
) {
  const barWidth = 30; // Thinner bars to fit all 10
  const barSpacing = 15; // Smaller spacing between bars
  const totalBarWidth = barWidth + barSpacing;
  const rightPadding = 1; // Padding from the right edge to match the margin

  const chartGroup = svg.select<SVGGElement>(".chart-group");

  // Create a group for all bars if it doesn't exist
  let barsGroup = chartGroup.select<SVGGElement>(".bars-group");
  if (barsGroup.empty()) {
    barsGroup = chartGroup.append<SVGGElement>("g").attr("class", "bars-group");
  }

  // Create bar groups with data binding
  const bars = barsGroup
    .selectAll<SVGGElement, PriceHistoryItem>(".bar-group")
    .data(history, (d: PriceHistoryItem, i: number) => i); // Use index as key to keep bars in place

  // Remove old bars
  bars.exit().remove();

  // Add new bars
  const barsEnter = bars.enter().append("g").attr("class", "bar-group");

  // Add rectangle for each new bar
  barsEnter.append("rect").attr("class", "price-bar").attr("width", barWidth);

  // Add border line for each new bar
  barsEnter
    .append("line")
    .attr("class", "price-bar-border")
    .attr("stroke", "rgba(255,255,255,0.5)")
    .attr("stroke-width", 1);

  // Update all bars (new and existing)
  const allBars = barsGroup.selectAll<SVGGElement, PriceHistoryItem>(
    ".bar-group"
  );

  allBars.each(function (d: PriceHistoryItem, i: number) {
    const group = d3.select(this);
    const bar = group.select(".price-bar");
    const border = group.select(".price-bar-border");

    const isPositive = d.priceChangePercent >= 0;
    const zeroY = yScale(0);
    const valueY = yScale(d.priceChangePercent);
    const barHeight = Math.abs(zeroY - valueY);
    const barY = isPositive ? valueY : zeroY;

    // Calculate opacity based on bar age (index)
    // Oldest (leftmost) bar has opacity 0.3, newest (rightmost) has opacity 1
    const opacity = 0.3 + (i * 0.7) / (TOTAL_BARS - 1);

    // Fixed position for each bar index from right to left
    const barX = chartWidth - rightPadding - (TOTAL_BARS - i) * totalBarWidth;

    // Update bar
    bar
      .attr("data-value", isPositive ? "positive" : "negative")
      .attr("fill", isPositive ? "url(#cyanGradient)" : "url(#purpleGradient)")
      .transition()
      .duration(500)
      .ease(d3.easeCubicInOut)
      .attr("x", barX)
      .attr("y", barY)
      .attr("height", barHeight)
      .attr("opacity", opacity);

    // Update border
    border
      .transition()
      .duration(500)
      .ease(d3.easeCubicInOut)
      .attr("x1", barX)
      .attr("x2", barX + barWidth)
      .attr("y1", valueY)
      .attr("y2", valueY)
      .attr("opacity", opacity);
  });
}

function getDynamicRange(priceChangePercent: number): [number, number] {
  const absChange = Math.abs(priceChangePercent);

  if (absChange <= 2) {
    return [-2, 2];
  } else if (absChange <= 5) {
    return [-5, 5];
  } else if (absChange <= 10) {
    return [-10, 10];
  } else {
    const ceiling = Math.ceil(absChange / 5) * 5;
    return [-ceiling, ceiling];
  }
}
