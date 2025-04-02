import {
  Responsive,
  WidthProvider,
  Layout as RGLLayout,
} from "react-grid-layout";
import { useState, useEffect } from "react";
import { useScreenSize } from "./useScreenSize";

const LAYOUT_STORAGE_KEY = "tradersphere_layout";
const MOBILE_LAYOUT_STORAGE_KEY = "tradersphere_mobile_layout";

type LayoutItem = {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
  minW?: number;
  minH?: number;
  maxW?: number;
  maxH?: number;
};

/**
 * Custom hook to manage grid layout persistence
 * @returns {Object} Layout management methods and current layout
 */
export function useSaveLayout() {
  const { isMobile } = useScreenSize();
  const storageKey = isMobile ? MOBILE_LAYOUT_STORAGE_KEY : LAYOUT_STORAGE_KEY;

  // Default layouts for desktop and mobile
  const defaultDesktopLayout: LayoutItem[] = [
    {
      i: "marketOverview",
      x: 0,
      y: 0,
      w: 14,
      h: 10,
      minH: 6,
      minW: 6,
      maxH: 18,
    },
    { i: "ocsillator", x: 14, y: 0, w: 10, h: 10, minH: 6, minW: 6 },
    {
      i: "candlestick",
      x: 0,
      y: 10,
      w: 16,
      h: 8,
      minH: 6,
      minW: 6,
      maxH: 18,
    },
    { i: "newsFeed", x: 16, y: 10, w: 8, h: 8, minH: 6, minW: 6 },
  ];

  const defaultMobileLayout: LayoutItem[] = [
    {
      i: "marketOverview",
      x: 0,
      y: 0,
      w: 24,
      h: 10,
      minH: 8,
      minW: 8,
      maxH: 18,
    },
    { i: "ocsillator", x: 0, y: 0, w: 24, h: 10, minH: 6, minW: 6 },
    {
      i: "candlestick",
      x: 0,
      y: 12,
      w: 24,
      h: 10,
      minH: 6,
      minW: 6,
      maxH: 18,
    },
    { i: "newsFeed", x: 0, y: 24, w: 24, h: 8, minH: 6, minW: 6 },
  ];

  // Initialize layout state from localStorage or default
  const [currentLayout, setCurrentLayout] = useState<LayoutItem[]>(() => {
    try {
      const savedLayout = localStorage.getItem(storageKey);
      return savedLayout
        ? JSON.parse(savedLayout)
        : isMobile
        ? defaultMobileLayout
        : defaultDesktopLayout;
    } catch (error) {
      console.error("Error loading layout from localStorage:", error);
      return isMobile ? defaultMobileLayout : defaultDesktopLayout;
    }
  });

  // Save layout to localStorage whenever it changes
  const saveLayout = (newLayout: LayoutItem[]) => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(newLayout));
      setCurrentLayout(newLayout);
    } catch (error) {
      console.error("Error saving layout to localStorage:", error);
    }
  };

  // Reset layout to default
  const resetLayout = () => {
    const defaultLayout = isMobile ? defaultMobileLayout : defaultDesktopLayout;
    localStorage.setItem(storageKey, JSON.stringify(defaultLayout));
    setCurrentLayout(defaultLayout);
  };

  // Update layout when screen size changes
  useEffect(() => {
    const savedLayout = localStorage.getItem(storageKey);
    if (savedLayout) {
      try {
        setCurrentLayout(JSON.parse(savedLayout));
      } catch (error) {
        console.error("Error parsing saved layout:", error);
        resetLayout();
      }
    } else {
      resetLayout();
    }
  }, [isMobile]); // Re-run when screen size changes

  return {
    layout: currentLayout,
    saveLayout,
    resetLayout,
  };
}
