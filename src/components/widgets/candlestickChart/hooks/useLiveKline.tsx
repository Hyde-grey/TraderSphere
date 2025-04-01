import { useState, useEffect, useRef } from "react";
import { appendLiveCandle } from "../utils/liveDataUtils";

/**
 * Hook for fetching and managing live candlestick data via WebSocket
 * @param symbol - Trading pair symbol (e.g., 'BTCUSDT')
 * @param initialData - Initial historical data array
 * @returns Object containing live data and connection status
 */
function useLiveKline(symbol: string, initialData: any[] = []) {
  const [liveData, setLiveData] = useState<any[]>(initialData);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<number | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const MAX_RECONNECT_ATTEMPTS = 5;
  const lastUpdateRef = useRef<number>(0);
  const THROTTLE_MS = 1000; // Limit updates to once per second

  // Effect to sync liveData when initialData changes (e.g., symbol change)
  useEffect(() => {
    if (initialData?.length > 0) {
      setLiveData(initialData);
    }
  }, [initialData]);

  useEffect(() => {
    if (!symbol) return;

    // Clear any pending reconnect attempts when symbol changes
    if (reconnectTimeoutRef.current) {
      window.clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    reconnectAttemptsRef.current = 0;

    // Binance WebSocket URL for kline data
    const wsUrl = `wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@kline_1h`;

    const connectWebSocket = () => {
      try {
        // Close any existing connection first
        if (
          socketRef.current &&
          (socketRef.current.readyState === WebSocket.OPEN ||
            socketRef.current.readyState === WebSocket.CONNECTING)
        ) {
          socketRef.current.close();
        }

        const socket = new WebSocket(wsUrl);
        socketRef.current = socket;

        socket.onopen = () => {
          console.log(`WebSocket connected: ${symbol}`);
          setIsConnected(true);
          setError(null);
          reconnectAttemptsRef.current = 0; // Reset reconnect attempts on successful connection
        };

        socket.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data);

            // Validate message structure
            if (message && message.e === "kline" && message.k) {
              const kline = message.k;

              // Validate required fields exist and are numeric
              if (
                !kline.t ||
                !kline.o ||
                !kline.h ||
                !kline.l ||
                !kline.c ||
                !kline.v
              ) {
                console.warn("Received malformed kline data", kline);
                return;
              }

              // Throttle updates to prevent excessive re-renders
              const now = Date.now();
              if (now - lastUpdateRef.current < THROTTLE_MS) {
                return;
              }
              lastUpdateRef.current = now;

              // Process the kline data and append to existing data
              setLiveData((currentData) =>
                appendLiveCandle(currentData, [
                  Number(kline.t), // Ensure numeric
                  Number(kline.o),
                  Number(kline.h),
                  Number(kline.l),
                  Number(kline.c),
                  Number(kline.v),
                ])
              );
            }
          } catch (err) {
            console.error("Error processing WebSocket message:", err);
          }
        };

        socket.onerror = (event) => {
          console.error("WebSocket error:", event);
          setError(new Error("WebSocket connection error"));
        };

        socket.onclose = (event) => {
          console.log(`WebSocket connection closed: ${event.code}`);
          setIsConnected(false);

          // Implement exponential backoff for reconnection
          if (reconnectAttemptsRef.current < MAX_RECONNECT_ATTEMPTS) {
            const backoffTime = Math.min(
              1000 * Math.pow(2, reconnectAttemptsRef.current),
              30000
            );
            console.log(
              `Attempting to reconnect in ${backoffTime / 1000}s, attempt ${
                reconnectAttemptsRef.current + 1
              }/${MAX_RECONNECT_ATTEMPTS}`
            );

            reconnectTimeoutRef.current = window.setTimeout(() => {
              if (socketRef.current?.readyState === WebSocket.CLOSED) {
                reconnectAttemptsRef.current++;
                connectWebSocket();
              }
            }, backoffTime);
          } else {
            console.error("Maximum reconnection attempts reached");
            setError(new Error("Failed to connect after multiple attempts"));
          }
        };
      } catch (err) {
        console.error("Error creating WebSocket:", err);
        setError(
          err instanceof Error
            ? err
            : new Error("Failed to connect to WebSocket")
        );
      }
    };

    connectWebSocket();

    // Clean up WebSocket and any pending timeouts on unmount or symbol change
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }

      if (reconnectTimeoutRef.current) {
        window.clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
    };
  }, [symbol]);

  return { liveData, isConnected, error };
}

export default useLiveKline;
