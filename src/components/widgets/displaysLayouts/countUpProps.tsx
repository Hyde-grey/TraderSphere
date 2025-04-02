import { useEffect, useRef } from "react";
import { useInView, useMotionValue, useSpring } from "framer-motion";

interface CountUpProps {
  to: number;
  from?: number;
  direction?: "up" | "down";
  delay?: number;
  duration?: number;
  className?: string;
  startWhen?: boolean;
  separator?: string;
  decimals?: number;
  onStart?: () => void;
  onEnd?: () => void;
}

export default function CountUp({
  to,
  from = 0,
  direction = "up",
  delay = 0,
  duration = 2, // Duration of the animation in seconds
  className = "",
  startWhen = true,
  separator = "",
  decimals,
  onStart,
  onEnd,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(direction === "down" ? to : from);

  // Calculate damping and stiffness based on duration
  const damping = 20 + 40 * (1 / duration); // Adjust this formula for finer control
  const stiffness = 100 * (1 / duration); // Adjust this formula for finer control

  const springValue = useSpring(motionValue, {
    damping,
    stiffness,
  });

  const isInView = useInView(ref, { once: true, margin: "0px" });

  // Set initial text content to the initial value based on direction
  useEffect(() => {
    if (ref.current) {
      ref.current.textContent = formatNumber(direction === "down" ? to : from);
    }
  }, [from, to, direction]);

  // Start the animation when in view and startWhen is true
  useEffect(() => {
    if (isInView && startWhen) {
      if (typeof onStart === "function") {
        onStart();
      }

      const timeoutId = setTimeout(() => {
        motionValue.set(direction === "down" ? from : to);
      }, delay * 1000);

      const durationTimeoutId = setTimeout(() => {
        if (typeof onEnd === "function") {
          onEnd();
        }
      }, delay * 1000 + duration * 1000);

      return () => {
        clearTimeout(timeoutId);
        clearTimeout(durationTimeoutId);
      };
    }
  }, [
    isInView,
    startWhen,
    motionValue,
    direction,
    from,
    to,
    delay,
    onStart,
    onEnd,
    duration,
  ]);

  // Determine decimal places based on the value range
  const getDecimalPlaces = (value: number): number => {
    if (decimals !== undefined) return decimals;

    if (Math.abs(value) < 0.01) return 6;
    if (Math.abs(value) < 0.1) return 4;
    if (Math.abs(value) < 1) return 3;
    if (Math.abs(value) < 100) return 2;
    return 0;
  };

  // Format number with appropriate decimal places
  const formatNumber = (value: number): string => {
    const decimalPlaces = getDecimalPlaces(value);

    const options = {
      useGrouping: !!separator,
      minimumFractionDigits: decimalPlaces,
      maximumFractionDigits: decimalPlaces,
    };

    const formattedNumber = Intl.NumberFormat("en-US", options).format(value);

    return separator
      ? formattedNumber.replace(/,/g, separator)
      : formattedNumber;
  };

  // Update text content with formatted number on spring value change
  useEffect(() => {
    const unsubscribe = springValue.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = formatNumber(latest);
      }
    });

    return () => unsubscribe();
  }, [springValue, separator, decimals]);

  return <span className={`${className}`} ref={ref} />;
}
