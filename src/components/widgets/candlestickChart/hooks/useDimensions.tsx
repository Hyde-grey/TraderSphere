import { useState, useEffect, RefObject } from "react";

/**
 * Custom hook to track dimensions of a DOM element
 * @param ref - React ref to the element to track
 * @returns Current width and height of the referenced element
 */
function useDimensions<T extends HTMLElement>(ref: RefObject<T | null>) {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!ref.current) return;

    const updateDimensions = () => {
      if (ref.current) {
        const { width, height } = ref.current.getBoundingClientRect();
        setDimensions({ width, height });
      }
    };

    // Initial size calculation
    updateDimensions();

    // Add resize listener
    const resizeObserver = new ResizeObserver(updateDimensions);
    resizeObserver.observe(ref.current);

    // Cleanup
    return () => {
      if (ref.current) {
        resizeObserver.unobserve(ref.current);
      }
      resizeObserver.disconnect();
    };
  }, [ref]);

  return dimensions;
}

export default useDimensions;
