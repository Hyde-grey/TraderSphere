import { useState, useEffect } from "react";

// Define TypeScript types for the Gnews API response
type NewsSource = {
  name: string;
  url: string;
};

type NewsArticle = {
  title: string;
  description: string;
  content: string;
  url: string;
  image: string | null;
  publishedAt: string;
  source: NewsSource;
};

type GnewsApiResponse = {
  totalArticles: number;
  articles: NewsArticle[];
};

/**
 * Custom hook for fetching news articles from Gnews API related to trading symbols
 * @param {string} symbol - Trading symbol (e.g., "AAPL", "BTC")
 * @returns {Object} - News data, loading state, and error state
 */
export const useFetchNews = (symbol?: string) => {
  const [news, setNews] = useState<GnewsApiResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      // Don't fetch if no symbol is provided
      if (!symbol) {
        setNews(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Build the URL with parameters
        const API_KEY = "0eb517de1bf12d5c4199b532a0306d60"; // Replace with your Gnews API key
        const searchQuery = getExpandedSymbolQuery(symbol);

        // Gnews API endpoint
        const url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(
          searchQuery
        )}&apikey=${API_KEY}&lang=en&country=us&max=10`;

        const response = await fetch(url);

        // Check if the request was successful
        if (!response.ok) {
          throw new Error(
            `Gnews API responded with status: ${response.status}`
          );
        }

        const data: GnewsApiResponse = await response.json();
        setNews(data);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("An unknown error occurred")
        );
        console.error("Error fetching news:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [symbol]); // Re-fetch when symbol changes

  return { news, loading, error };
};

/**
 * Helper function to expand symbol queries for better news results
 * @param symbol Trading symbol
 * @returns Expanded search query
 */
function getExpandedSymbolQuery(symbol: string): string {
  // Only use the first three letters of the symbol for broader search
  const shortSymbol = symbol.substring(0, 3).toUpperCase();

  // Map of common stock symbols to their company names
  const symbolMap: Record<string, string> = {
    AAP: "Apple",
    MSF: "Microsoft",
    GOO: "Google",
    AMZ: "Amazon",
    MET: "Facebook Meta",
    TSL: "Tesla",
    BTC: "Bitcoin",
    ETH: "Ethereum",
    // Add more mappings as needed
  };

  // Check if we have a mapping for the short symbol
  const company = symbolMap[shortSymbol] || "";

  if (company) {
    // If we have a company name, include both the short symbol and company
    return `${shortSymbol} OR ${company} stock market`;
  } else {
    // Otherwise just use the short symbol with stock/crypto context
    return `${shortSymbol} stock OR ${shortSymbol} trading OR ${shortSymbol} market`;
  }
}

export default useFetchNews;
