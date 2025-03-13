import { cleanup, renderHook } from "@testing-library/react";
import { useProcessMarketData } from "./useProcessMarketData";
import { useFetchData, StaticMarketData } from "../../hooks/useFetchData";
import { useLiveData } from "../../hooks/useLiveData";
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
  type MockedFunction,
} from "vitest";

vi.mock("../hooks/useFetchData");
vi.mock("../hooks/useLiveData");

const mockFetchData = useFetchData as MockedFunction<typeof useFetchData>;
const mockLiveData = useLiveData as MockedFunction<typeof useLiveData>;

describe("useProcessMarketData hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockFetchData.mockReturnValue({
      data: [],
      loading: false,
      error: null,
    });

    mockLiveData.mockReturnValue({
      liveData: [],
      isConnected: false,
      error: undefined,
    });
  });

  afterEach(() => {
    cleanup();
  });

  it("should return empty data when no fetch data and no live data", () => {
    mockFetchData.mockReturnValue({
      data: [],
      loading: false,
      error: null,
    });

    mockLiveData.mockReturnValue({
      liveData: [],
      isConnected: true,
      error: undefined,
    });

    const { result } = renderHook(() => useProcessMarketData());

    expect(result.current.marketData).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.isConnected).toBe(true);
  });

  it("should return fetched data when no live data available", () => {
    const mockData: StaticMarketData[] = [
      {
        symbol: "BTCUSDT",
        priceChange: "100",
        priceChangePercent: "1.5",
        weightedAvgPrice: "35500",
        prevClosePrice: "34900",
        lastPrice: "35000",
        lastQty: "0.5",
        bidPrice: "34990",
        bidQty: "2.0",
        askPrice: "35010",
        askQty: "1.5",
        openPrice: "34800",
        highPrice: "35200",
        lowPrice: "34700",
        volume: "1000",
        quoteVolume: "35000000",
        openTime: 123456000,
        closeTime: 123456999,
        firstId: 100000,
        lastId: 100100,
        count: 1000,
      },
    ];

    mockFetchData.mockReturnValue({
      data: mockData,
      loading: false,
      error: null,
    });

    mockLiveData.mockReturnValue({
      liveData: [],
      isConnected: true,
      error: undefined,
    });

    const { result } = renderHook(() => useProcessMarketData());

    expect(result.current.marketData).toEqual(mockData);
  });

  it("should combine fetch data with live data when both are available", () => {
    const fetchedData: StaticMarketData[] = [
      {
        symbol: "BTCUSDT",
        priceChange: "100",
        priceChangePercent: "1.5",
        weightedAvgPrice: "35500",
        prevClosePrice: "34900",
        lastPrice: "35000",
        lastQty: "0.5",
        bidPrice: "34990",
        bidQty: "2.0",
        askPrice: "35010",
        askQty: "1.5",
        openPrice: "34800",
        highPrice: "35200",
        lowPrice: "34700",
        volume: "1000",
        quoteVolume: "35000000",
        openTime: 123456000,
        closeTime: 123456999,
        firstId: 100000,
        lastId: 100100,
        count: 1000,
      },
      {
        symbol: "ETHUSDT",
        priceChange: "50",
        priceChangePercent: "0.5",
        weightedAvgPrice: "2050",
        prevClosePrice: "1950",
        lastPrice: "2000",
        lastQty: "1.0",
        bidPrice: "1990",
        bidQty: "5.0",
        askPrice: "2010",
        askQty: "3.0",
        openPrice: "1980",
        highPrice: "2100",
        lowPrice: "1950",
        volume: "5000",
        quoteVolume: "10000000",
        openTime: 123456000,
        closeTime: 123456999,
        firstId: 200000,
        lastId: 200100,
        count: 1000,
      },
    ];

    mockFetchData.mockReturnValue({
      data: fetchedData,
      loading: false,
      error: null,
    });

    const liveData = [
      {
        e: "ticker",
        E: 123456789,
        s: "BTCUSDT",
        p: "200",
        P: "2.5",
        w: "36000",
        x: "35900",
        c: "36100",
        Q: "0.5",
        b: "36090",
        B: "2.5",
        a: "36110",
        A: "1.5",
        o: "35800",
        h: "36200",
        l: "35700",
        v: "1200",
        q: "36000000",
        O: 123456000,
        C: 123456999,
        F: 100000,
        L: 100100,
        n: 1000,
      },
    ];

    mockLiveData.mockReturnValue({
      liveData: liveData,
      isConnected: true,
      error: undefined,
    });

    const { result } = renderHook(() => useProcessMarketData());

    expect(result.current.marketData).toEqual([
      {
        ...fetchedData[0],
        lastPrice: "36100",
        priceChangePercent: "2.5",
        volume: "1200",
      },
      fetchedData[1],
    ]);
  });

  it("should handle loading state", () => {
    mockFetchData.mockReturnValue({
      data: [],
      loading: true,
      error: null,
    });

    const { result } = renderHook(() => useProcessMarketData());

    expect(result.current.loading).toBe(true);
  });

  it("should handle fetch errors", () => {
    const error = new Error("Fetch error");

    mockFetchData.mockReturnValue({
      data: [],
      loading: false,
      error: error,
    });

    const { result } = renderHook(() => useProcessMarketData());

    expect(result.current.error).toBe(error);
  });

  it("should handle live data errors", () => {
    const error = new Error("WebSocket error");

    mockLiveData.mockReturnValue({
      liveData: [],
      isConnected: false,
      error: error,
    });

    const { result } = renderHook(() => useProcessMarketData());

    expect(result.current.liveError).toBe(error);
  });
});
