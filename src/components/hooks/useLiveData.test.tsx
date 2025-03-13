import { act, cleanup, renderHook } from "@testing-library/react";
import { useLiveData, LiveData } from "./useLiveData";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Mock WebSocket constructor and instance
const mockClose = vi.fn();
const mockSocketInstance = {
  close: mockClose,
};

// Make WebSocket constructor a vitest mock function
const mockWebSocketConstructor = vi.fn(() => mockSocketInstance);
global.WebSocket = mockWebSocketConstructor as unknown as typeof WebSocket;

// Helper to simulate WebSocket events by directly calling the handlers set by the hook
const simulateWebSocketEvent = (
  eventType: "open" | "message" | "error" | "close",
  data?: any
) => {
  if (eventType === "message") {
    const handlers = mockSocketInstance as any;
    if (handlers.onmessage) {
      act(() => {
        handlers.onmessage({ data: JSON.stringify(data) });
      });
    }
  } else if (eventType === "open") {
    const handlers = mockSocketInstance as any;
    if (handlers.onopen) {
      act(() => {
        handlers.onopen({});
      });
    }
  } else if (eventType === "error") {
    const handlers = mockSocketInstance as any;
    if (handlers.onerror) {
      act(() => {
        handlers.onerror(data || {});
      });
    }
  } else if (eventType === "close") {
    const handlers = mockSocketInstance as any;
    if (handlers.onclose) {
      act(() => {
        handlers.onclose({});
      });
    }
  }
};

// Use vi.useFakeTimers instead of jest.useFakeTimers
vi.useFakeTimers();

describe("useLiveData hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.clearAllTimers();
    // Reset all handlers
    Object.keys(mockSocketInstance).forEach((key) => {
      if (key !== "close") {
        delete (mockSocketInstance as any)[key];
      }
    });
  });

  afterEach(() => {
    cleanup();
  });

  it("should initialize with correct default values", () => {
    const { result } = renderHook(() => useLiveData());

    expect(result.current.liveData).toEqual([]);
    expect(result.current.isConnected).toBe(false);
    expect(result.current.error).toBeUndefined();
    expect(mockWebSocketConstructor).toHaveBeenCalledWith(
      "wss://stream.binance.com:9443/ws/!ticker@arr"
    );
  });

  it("should update connection status when WebSocket connects", () => {
    const { result } = renderHook(() => useLiveData());

    simulateWebSocketEvent("open");

    expect(result.current.isConnected).toBe(true);
    expect(result.current.error).toBeUndefined();
  });

  it("should handle incoming data with debounce", () => {
    const { result } = renderHook(() => useLiveData());

    const mockData: LiveData[] = [
      {
        e: "ticker",
        E: 123456789,
        s: "BTCUSDT",
        p: "100",
        P: "1.5",
        w: "35000",
        x: "34900",
        c: "35100",
        Q: "0.5",
        b: "35090",
        B: "2.5",
        a: "35110",
        A: "1.5",
        o: "34800",
        h: "35200",
        l: "34700",
        v: "1000",
        q: "35000000",
        O: 123456000,
        C: 123456999,
        F: 100000,
        L: 100100,
        n: 1000,
      },
    ];

    simulateWebSocketEvent("message", mockData);

    // Data shouldn't be updated immediately due to debounce
    expect(result.current.liveData).toEqual([]);

    // Fast-forward debounce timer
    act(() => {
      vi.advanceTimersByTime(500);
    });

    // Now the data should be updated
    expect(result.current.liveData).toEqual(mockData);
  });

  it("should handle WebSocket errors", () => {
    const { result } = renderHook(() => useLiveData());

    simulateWebSocketEvent("error", new Error("WebSocket error"));

    expect(result.current.isConnected).toBe(false);
    expect(result.current.error).toBeDefined();
    expect(result.current.error?.message).toBe("WebSocket connection error");
  });

  it("should handle WebSocket close", () => {
    const { result } = renderHook(() => useLiveData());

    // First connect
    simulateWebSocketEvent("open");

    expect(result.current.isConnected).toBe(true);

    // Then disconnect
    simulateWebSocketEvent("close");

    expect(result.current.isConnected).toBe(false);
  });

  it("should clean up WebSocket connection on unmount", () => {
    const { unmount } = renderHook(() => useLiveData());

    unmount();

    expect(mockClose).toHaveBeenCalled();
  });
});
