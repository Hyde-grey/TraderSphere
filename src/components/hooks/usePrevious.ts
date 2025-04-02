import { useEffect, useRef } from "react";

/**
 * Custom hook to get the previous value of a prop or state
 * @param value The value to track
 * @returns The previous value
 */
export function usePrevious<T>(value: T): T | undefined {
  // Use undefined as type to avoid TypeScript error
  const ref = useRef<T | undefined>(undefined);

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}
