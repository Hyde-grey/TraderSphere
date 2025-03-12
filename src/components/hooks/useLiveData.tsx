import { useEffect, useState, useRef } from "react";

export const useLiveData = () => {
  const [liveData, setLiveData] = useState<any[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Define the WebSocket URL
    const wsUrl = "wss://stream.binance.com:9443/ws/!ticker@arr";

    // Create a new WebSocket connection
    const socket = new WebSocket(wsUrl);
    socketRef.current = socket;

    // Event: Connection opened
    socket.onopen = () => {
      console.log("WebSocket connection established.");
      setIsConnected(true);
      setError(null);
    };
    // Event: Message received with data processing
    socket.onmessage = (event) => {
      try {
        const rawData = JSON.parse(event.data);

        // Process data to match the format expected by your table
        const processedData = rawData.map((item: any) => ({
          symbol: item.s,
          lastPrice: item.c,
          priceChangePercent: item.P,
          volume: item.v,
        }));

        setLiveData(processedData);
      } catch (err) {
        console.error("Error processing WebSocket message:", err);
        setError(
          err instanceof Error ? err : new Error("Failed to process data")
        );
      }
    };

    // Event: Error occurred
    socket.onerror = (err) => {
      console.error("WebSocket error:", err);
      setIsConnected(false);
      setError(new Error("WebSocket connection error"));
    };
    // Event: Connection closed
    socket.onclose = () => {
      console.log("WebSocket connection closed.");
      setIsConnected(false);
    };

    // Clean up the WebSocket connection when the component unmounts
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []); // Empty dependency array means this effect runs once on mount

  // Return state instead of the raw socket
  return { liveData, isConnected, error };
};
