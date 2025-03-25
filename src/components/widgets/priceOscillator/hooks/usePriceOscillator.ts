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
  customRange?: [number, number];
};

const TOTAL_BARS = 11;

export function usePriceOscillator({
  selectedSymbol,
  dimensions,
  customRange,
}: usePriceOscillatorProps) {
  const [priceChangePercent, setPriceChangePercent] = useState(0);
  const [priceHistory, setPriceHistory] = useState<PriceHistoryItem[]>([]);
  const [filteredData, setFilteredData] = useState<{
    priceChangePercent: number;
    lastPrice: string;
    volume: string;
  }>({
    priceChangePercent: 0,
    lastPrice: "0.00",
    volume: "0.00",
  });
  const { marketData } = useProcessMarketData();

  const svgRef = useRef<SVGSVGElement>(null);
  const isInitialRender = useRef(true);
  const [currentRange, setCurrentRange] = useState<[number, number]>([-2, 2]);

  // Initialize with empty slots when component mounts
  useEffect(() => {
    const now = Date.now();
    // Create initial empty history with small random values to make bars visible
    setPriceHistory(
      Array(TOTAL_BARS)
        .fill(null)
        .map((_, i) => ({
          // Small random values between -0.5 and 0.5 to make bars visible initially
          priceChangePercent: (Math.random() - 0.5) * 0.5,
          timestamp: now - (TOTAL_BARS - i) * 1000, // Stagger timestamps
        }))
    );
  }, []);

  // Function to update the custom range
  const setCustomRange = (range: [number, number]) => {
    setCurrentRange(range);
  };

  // Use custom range if provided
  useEffect(() => {
    if (customRange) {
      setCurrentRange(customRange);
    }
  }, [customRange]);

  // Function to update data with simulated values (for testing)
  const updateWithSimulatedData = (simulatedData: {
    priceChangePercent: number;
    lastPrice: string;
    volume: string;
  }) => {
    // Update filtered data directly
    setFilteredData(simulatedData);

    // Update price change percent
    setPriceChangePercent(simulatedData.priceChangePercent);

    // Update range if needed and not using custom range
    if (!customRange) {
      setCurrentRange(getDynamicRange(simulatedData.priceChangePercent));
    }

    // Add to history
    const newHistoryItem = {
      priceChangePercent: simulatedData.priceChangePercent,
      timestamp: Date.now(),
    };

    setPriceHistory((currentHistory) => {
      // Remove oldest item if we're at capacity
      const updatedHistory = [...currentHistory];
      if (updatedHistory.length >= TOTAL_BARS) {
        updatedHistory.shift(); // Remove oldest (first) item
      }
      // Add new item at the end
      updatedHistory.push(newHistoryItem);
      return updatedHistory;
    });
  };

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
        volume: matchingItem.volume,
      });

      // Only update range if not using custom range
      if (!customRange) {
        setCurrentRange(getDynamicRange(newPriceChangePercent));
      }

      // Add new item to history and limit length
      const newHistoryItem = {
        priceChangePercent: newPriceChangePercent,
        timestamp: Date.now(),
      };

      setPriceHistory((currentHistory) => {
        // Remove oldest item if we're at capacity
        const updatedHistory = [...currentHistory];
        if (updatedHistory.length >= TOTAL_BARS) {
          updatedHistory.shift(); // Remove oldest (first) item
        }
        // Add new item at the end
        updatedHistory.push(newHistoryItem);
        return updatedHistory;
      });
    }
  }, [marketData, selectedSymbol, customRange]);

  useEffect(() => {
    if (!svgRef.current || dimensions.width === 0 || dimensions.height === 0) {
      return;
    }

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

    // Only try to update bars if we have price history
    if (priceHistory.length > 0) {
      updateBars(svg, yScale, chartWidth, priceHistory);
    }
  }, [dimensions, priceHistory, currentRange]);

  return { svgRef, filteredData, updateWithSimulatedData, setCustomRange };
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

  // Remove existing gradients to prevent duplicates
  svg.select("defs").remove();
  const defs = svg.append("defs");

  gradients.forEach(({ id, color, direction }) => {
    const gradient = defs
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
  const barWidth = 30;
  const barSpacing = 15;
  const totalBarWidth = barWidth + barSpacing;
  const rightPadding = barSpacing;

  // Calculate start position for the rightmost bar
  const startX = chartWidth - rightPadding - barWidth;

  const chartGroup = svg.select<SVGGElement>(".chart-group");

  // Get or create the bars group
  let barsGroup = chartGroup.select<SVGGElement>(".bars-group");
  if (barsGroup.empty()) {
    barsGroup = chartGroup.append<SVGGElement>("g").attr("class", "bars-group");
  }

  // Use D3's data binding for proper animations
  const barGroups = barsGroup
    .selectAll<SVGGElement, PriceHistoryItem>(".bar-group")
    .data(history, (d) => d.timestamp.toString());

  // ENTER: Create new elements for new data points
  const enterGroups = barGroups
    .enter()
    .append("g")
    .attr("class", "bar-group")
    .attr("transform", `translate(${startX + totalBarWidth}, 0)`) // Start off-screen to the right
    .style("opacity", 0.2);

  // Add rectangle to each new group
  enterGroups
    .append("rect")
    .attr("class", "price-bar")
    .attr("width", barWidth)
    .attr("height", 0) // Start with height 0
    .attr("y", yScale(0));

  // Add border line to each new group
  enterGroups
    .append("line")
    .attr("class", "price-bar-border")
    .attr("stroke", "rgba(255,255,255,0.5)")
    .attr("stroke-width", 1)
    .attr("x1", 0)
    .attr("x2", barWidth)
    .attr("y1", yScale(0))
    .attr("y2", yScale(0));

  // Add value text to each new group (optional)
  enterGroups
    .append("text")
    .attr("class", "debug-text")
    .attr("x", barWidth / 2)
    .attr("y", yScale(0) - 5)
    .attr("text-anchor", "middle")
    .attr("font-size", "8px")
    .attr("fill", "white")
    .attr("opacity", 0.8);

  // EXIT: Remove elements that no longer have data
  barGroups
    .exit()
    .transition()
    .duration(800)
    .ease(d3.easeCubicInOut)
    .attr("transform", (d, i) => `translate(${-totalBarWidth * 2}, 0)`) // Slide left off screen
    .style("opacity", 0)
    .remove();

  // MERGE: Handle updates for both existing and new elements
  const allBarGroups = barGroups.merge(enterGroups);

  // First animate the position (slide from right for new bars, shift left for existing)
  allBarGroups
    .transition()
    .duration(800)
    .ease(d3.easeCubicInOut)
    .style("opacity", (d, i) => {
      // Calculate opacity based on index - newest bar (rightmost) is fully opaque
      return 0.2 + (i * 0.8) / Math.max(history.length - 1, 1);
    })
    .attr("transform", (d, i) => {
      const xPos = startX - (history.length - 1 - i) * totalBarWidth;
      return `translate(${xPos}, 0)`;
    });

  // Then update all the visual attributes
  allBarGroups.each(function (d, i) {
    const group = d3.select(this);

    // Calculate values for this bar
    const isPositive = d.priceChangePercent >= 0;
    const zeroY = yScale(0);
    const valueY = yScale(d.priceChangePercent);
    const barHeight = Math.abs(zeroY - valueY);
    const barY = isPositive ? valueY : zeroY;
    const opacity = 0.2 + (i * 0.8) / Math.max(history.length - 1, 1);

    // Update rectangle with animation
    group
      .select("rect")
      .transition()
      .duration(800)
      .ease(d3.easeCubicOut)
      .attr("data-value", isPositive ? "positive" : "negative")
      .attr("fill", isPositive ? "url(#cyanGradient)" : "url(#purpleGradient)")
      .attr("y", barY)
      .attr("height", barHeight)
      .attr("opacity", opacity);

    // Update border line with animation
    group
      .select("line")
      .transition()
      .duration(800)
      .ease(d3.easeCubicOut)
      .attr("y1", valueY)
      .attr("y2", valueY)
      .attr("opacity", opacity);

    // Update debug text with animation
    group
      .select("text")
      .transition()
      .duration(800)
      .ease(d3.easeCubicOut)
      .attr("y", valueY - 5)
      .text(d.priceChangePercent.toFixed(1));
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
