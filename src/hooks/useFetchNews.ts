import { useState, useEffect } from "react";

// Define TypeScript types for the news API response
type NewsSource = {
  id: string | null;
  name: string;
};

type NewsArticle = {
  source: NewsSource;
  author: string | null;
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string | null;
};

type NewsApiResponse = {
  status: string;
  totalResults: number;
  articles: NewsArticle[];
};

/**
 * Custom hook for fetching news articles from NewsAPI related to trading symbols
 * @param {string} symbol - Trading symbol (e.g., "AAPL", "BTC")
 * @param {string} country - Country code (default: 'us')
 * @returns {Object} - News data, loading state, and error state
 */
export const useFetchNews = (symbol?: string, country: string = "us") => {
  const [news, setNews] = useState<NewsApiResponse | null>(null);
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
        const API_KEY = "66c5b5192aaa4e38b781530a7dbcb196";
        // For symbols, it's better to use the everything endpoint with the symbol as a query
        let url = `https://newsapi.org/v2/everything?apiKey=${API_KEY}`;

        // Add the symbol as a search query
        // Add company name or additional context if available (like "AAPL" + "Apple")
        const searchQuery = getExpandedSymbolQuery(symbol);
        url += `&q=${encodeURIComponent(searchQuery)}`;

        // Add additional parameters for better results
        url += `&language=en`;
        url += `&sortBy=publishedAt`; // Get the most recent news
        url += `&pageSize=10`; // Limit to 10 articles

        const response = await fetch(url);

        // Check if the request was successful
        if (!response.ok) {
          throw new Error(`News API responded with status: ${response.status}`);
        }

        const data: NewsApiResponse = await response.json();
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
  }, [symbol, country]); // Re-fetch when these dependencies change

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
