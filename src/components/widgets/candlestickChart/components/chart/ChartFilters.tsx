import * as d3 from "d3";
import { chartColors } from "../../utils/chartUtils";

/**
 * Sets up filters and animations for the chart
 * @param svg The svg element to add filters to
 * @returns The defs element containing all filters
 */
export function setupFiltersAndAnimations(
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>
): d3.Selection<SVGDefsElement, unknown, null, undefined> {
  // Create defs element for filters and gradients
  const defs = svg.append("defs");

  // Create bullish gradient (cyan)
  defs
    .append("linearGradient")
    .attr("id", "bullishGradient")
    .attr("x1", "0%")
    .attr("y1", "0%")
    .attr("x2", "0%")
    .attr("y2", "100%")
    .selectAll("stop")
    .data([
      { offset: "0%", color: "rgba(123, 221, 213, 1)" },
      { offset: "100%", color: "rgba(123, 221, 213, 0.8)" },
    ])
    .enter()
    .append("stop")
    .attr("offset", (d) => d.offset)
    .attr("stop-color", (d) => d.color);

  // Create bearish gradient (purple)
  defs
    .append("linearGradient")
    .attr("id", "bearishGradient")
    .attr("x1", "0%")
    .attr("y1", "0%")
    .attr("x2", "0%")
    .attr("y2", "100%")
    .selectAll("stop")
    .data([
      { offset: "0%", color: "rgba(148, 112, 219, 0.8)" },
      { offset: "100%", color: "rgba(148, 112, 219, 1)" },
    ])
    .enter()
    .append("stop")
    .attr("offset", (d) => d.offset)
    .attr("stop-color", (d) => d.color);

  // Create bullish glow effect (cyan)
  const bullishFilter = defs.append("filter").attr("id", "bullishGlow");

  bullishFilter
    .append("feGaussianBlur")
    .attr("stdDeviation", "2.5")
    .attr("result", "coloredBlur");

  bullishFilter
    .append("feFlood")
    .attr("flood-color", "rgba(123, 221, 213, 0.5)")
    .attr("result", "glowColor");

  bullishFilter
    .append("feComposite")
    .attr("in", "glowColor")
    .attr("in2", "coloredBlur")
    .attr("operator", "in")
    .attr("result", "softGlow");

  const bullishMerge = bullishFilter.append("feMerge");
  bullishMerge.append("feMergeNode").attr("in", "softGlow");
  bullishMerge.append("feMergeNode").attr("in", "SourceGraphic");

  // Create bearish glow effect (purple)
  const bearishFilter = defs.append("filter").attr("id", "bearishGlow");

  bearishFilter
    .append("feGaussianBlur")
    .attr("stdDeviation", "2.5")
    .attr("result", "coloredBlur");

  bearishFilter
    .append("feFlood")
    .attr("flood-color", "rgba(148, 112, 219, 0.5)")
    .attr("result", "glowColor");

  bearishFilter
    .append("feComposite")
    .attr("in", "glowColor")
    .attr("in2", "coloredBlur")
    .attr("operator", "in")
    .attr("result", "softGlow");

  const bearishMerge = bearishFilter.append("feMerge");
  bearishMerge.append("feMergeNode").attr("in", "softGlow");
  bearishMerge.append("feMergeNode").attr("in", "SourceGraphic");

  // No longer need to add CSS animations here as they are in the module CSS

  return defs;
}
