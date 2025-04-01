import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { transformKlineData, Candlestick } from "../utils/chartUtils";
import { renderChartElements } from "./chart/ChartElements";
import { setupFiltersAndAnimations } from "./chart/ChartFilters";
import { renderCrosshair } from "./chart/ChartCrosshair";

// Props interface for the component
type CandlestickRendererProps = {
  data: any[];
  dimensions: { width: number; height: number };
  symbol: string;
};

/**
 * Sets up the base chart SVG with margins and filters
 */
function setupChartBase(
  svgRef: SVGSVGElement | null,
  width: number,
  height: number
) {
  if (!svgRef) return null;

  // Clear any existing chart
  d3.select(svgRef).selectAll("*").remove();

  // Define margins
  const margin = { top: 20, right: 60, bottom: 60, left: 80 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  // Create SVG with proper size
  const svg = d3.select(svgRef).attr("width", width).attr("height", height);

  // Add filters and animations
  setupFiltersAndAnimations(svg);

  // Create main chart group with margin translation
  const g = svg
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  return { svg, g, innerWidth, innerHeight, margin };
}

/**
 * Component that renders the D3 candlestick chart
 */
const CandlestickRenderer: React.FC<CandlestickRendererProps> = ({
  data,
  dimensions,
  symbol,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (
      !data ||
      data.length === 0 ||
      dimensions.width === 0 ||
      !svgRef.current
    ) {
      return;
    }

    try {
      // Transform the data
      const candles = transformKlineData(data);

      // Setup chart base elements
      const baseElements = setupChartBase(
        svgRef.current,
        dimensions.width,
        dimensions.height
      );

      if (!baseElements) return;

      const { g, innerWidth, innerHeight, margin } = baseElements;

      // Render chart elements (axes, grid, candlesticks)
      const { xScale, yScale } = renderChartElements(
        g,
        candles,
        innerWidth,
        innerHeight,
        margin
      );

      // Render crosshair and tooltip
      renderCrosshair(g, innerWidth, innerHeight, candles, xScale, yScale);
    } catch (error) {
      console.error("Error rendering candlestick chart:", error);
    }
  }, [data, dimensions, symbol]);

  // Simple SVG element
  return <svg ref={svgRef}></svg>;
};

export default CandlestickRenderer;
