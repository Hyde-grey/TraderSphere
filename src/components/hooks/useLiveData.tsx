export const useConnectToBinanceWebSocket = () => {
  // Define the WebSocket URL
  const wsUrl = "wss://stream.binance.com:9443/ws/!ticker@arr";

  // Create a new WebSocket connection
  const socket = new WebSocket(wsUrl);

  // Event: Connection opened
  socket.onopen = () => {
    console.log("WebSocket connection established.");
  };

  // Event: Message received
  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    console.log("Message received:", data);
  };

  // Event: Error occurred
  socket.onerror = (error) => {
    console.error("WebSocket error:", error);
  };

  // Event: Connection closed
  socket.onclose = () => {
    console.log("WebSocket connection closed.");
  };

  return socket;
};
