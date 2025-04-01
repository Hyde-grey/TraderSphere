/**
 * Takes care of updating or adding a new candle to our chart data
 * @param existingData - The data we already have on the chart
 * @param newCandleData - Fresh candle data coming from the WebSocket
 * @returns Updated array with the new/updated candle
 */
export function appendLiveCandle(
  existingData: any[],
  newCandleData: any[]
): any[] {
  // Make sure we're working with valid data
  if (!Array.isArray(existingData)) {
    console.error("appendLiveCandle: existingData is not an array");
    return Array.isArray(newCandleData) ? [newCandleData] : [];
  }

  if (!Array.isArray(newCandleData) || newCandleData.length < 6) {
    console.error(
      "appendLiveCandle: Invalid newCandleData format",
      newCandleData
    );
    return [...existingData];
  }

  if (existingData.length === 0) {
    return [newCandleData];
  }

  // Convert timestamp to number for easier comparison
  const newTime = Number(newCandleData[0]);
  if (isNaN(newTime)) {
    console.error(
      "appendLiveCandle: Invalid timestamp in newCandleData",
      newCandleData[0]
    );
    return [...existingData];
  }

  try {
    const lastCandle = existingData[existingData.length - 1];
    if (!lastCandle || !Array.isArray(lastCandle)) {
      return [...existingData, newCandleData];
    }

    const lastTime = Number(lastCandle[0]);
    if (isNaN(lastTime)) {
      console.warn(
        "appendLiveCandle: Invalid timestamp in lastCandle",
        lastCandle[0]
      );
      return [...existingData, newCandleData];
    }

    // If this candle is for the same time period, just update the last one
    if (newTime === lastTime) {
      // Clone the array to avoid mutating the original
      const updatedData = [...existingData];
      // Replace the last candle with fresh data
      updatedData[updatedData.length - 1] = newCandleData;
      return updatedData;
    }

    // If this is a brand new candle for a future time, add it to the end
    if (newTime > lastTime) {
      return [...existingData, newCandleData];
    }

    // Handle the case where we need to insert or update a candle in the middle
    const updatedData = [...existingData];
    const index = updatedData.findIndex(
      (candle) => Array.isArray(candle) && Number(candle[0]) === newTime
    );

    if (index !== -1) {
      // We found a matching candle, so update it
      updatedData[index] = newCandleData;
    } else {
      // Need to insert the candle at the right spot to keep time order
      const insertIndex = updatedData.findIndex(
        (candle) => Array.isArray(candle) && Number(candle[0]) > newTime
      );

      if (insertIndex !== -1) {
        updatedData.splice(insertIndex, 0, newCandleData);
      } else {
        // Fallback - just add it to the end if we can't figure out where it goes
        updatedData.push(newCandleData);
      }
    }

    return updatedData;
  } catch (err) {
    console.error("Error in appendLiveCandle:", err);
    // Return the original data to avoid breaking the chart
    return existingData;
  }
}

/**
 * Keeps our chart from getting too crowded by limiting the number of candles
 * @param data - All our candle data
 * @param limit - How many candles we want to show max
 * @returns Trimmed array with only the most recent candles
 */
export function limitCandleCount(data: any[], limit: number): any[] {
  if (!data || data.length <= limit) {
    return data;
  }

  // Just keep the newest candles and discard older ones
  return data.slice(data.length - limit);
}

/**
 * Creates a nice status message for the connection state
 * @param isConnected - Whether we're connected to the data feed
 * @returns Text and color to show in the UI
 */
export function formatConnectionStatus(isConnected: boolean): {
  text: string;
  color: string;
} {
  return isConnected
    ? { text: "● Live", color: "rgba(123, 221, 213, 0.81)" } // Teal dot when we're connected
    : { text: "● Connecting...", color: "rgba(255, 165, 0, 0.81)" }; // Orange dot when trying to connect
}
