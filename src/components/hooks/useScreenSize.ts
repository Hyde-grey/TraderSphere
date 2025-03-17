import { useState, useEffect } from "react";

type Breakpoint = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

interface ScreenSize {
  width: number;
  height: number;
  breakpoint: Breakpoint;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

const breakpoints = {
  xs: 0, // Extra small devices (portrait phones)
  sm: 640, // Small devices (landscape phones)
  md: 768, // Medium devices (tablets)
  lg: 1024, // Large devices (desktops)
  xl: 1280, // Extra large devices (large desktops)
  "2xl": 1536, // 2X Extra large devices (larger desktops)
} as const;

export function useScreenSize(): ScreenSize {
  const [screenSize, setScreenSize] = useState<ScreenSize>({
    width: window.innerWidth,
    height: window.innerHeight,
    breakpoint: "xs",
    isMobile: false,
    isTablet: false,
    isDesktop: false,
  });

  useEffect(() => {
    function handleResize() {
      const width = window.innerWidth;
      const height = window.innerHeight;

      // Determine breakpoint
      let breakpoint: Breakpoint = "xs";
      if (width >= breakpoints["2xl"]) breakpoint = "2xl";
      else if (width >= breakpoints.xl) breakpoint = "xl";
      else if (width >= breakpoints.lg) breakpoint = "lg";
      else if (width >= breakpoints.md) breakpoint = "md";
      else if (width >= breakpoints.sm) breakpoint = "sm";

      setScreenSize({
        width,
        height,
        breakpoint,
        isMobile: width < breakpoints.md,
        isTablet: width >= breakpoints.md && width < breakpoints.lg,
        isDesktop: width >= breakpoints.lg,
      });
    }

    // Initial call
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return screenSize;
}
