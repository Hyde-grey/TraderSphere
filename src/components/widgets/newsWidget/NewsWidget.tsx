import { useState } from "react";
import useFetchNews from "../../../hooks/useFetchNews";
import styles from "./newsWidget.module.css";
import { useSymbolContext } from "../../../contexts/SymbolContext";
import LiveIndicator from "../marketSummaryTable/liveIndicator";

export const NewsWidget = () => {
  const { selectedSymbol, setSelectedSymbol } = useSymbolContext();
  const { news, loading, error } = useFetchNews(selectedSymbol);
  const [searchInput, setSearchInput] = useState("");

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSelectedSymbol(searchInput.trim());
  };

  return (
    <div className={styles.newsWidget}>
      <div className={styles.header}>
        <h2>
          <span>Market News</span>
        </h2>
        <form onSubmit={handleSearch} className={styles.searchForm}>
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder={selectedSymbol || "Enter symbol (e.g., AAPL)"}
            className={styles.symbolInput}
          />
          <button type="submit" className={styles.searchButton}>
            Search
          </button>
        </form>
      </div>

      {!selectedSymbol && !loading && (
        <div className={styles.emptyState}>
          <p>Enter a symbol above to view related news</p>
        </div>
      )}

      {loading && <div className={styles.loading}>Loading news</div>}

      {error && (
        <div className={styles.error}>
          API call limit reached. Please try again later.
        </div>
      )}

      {!loading &&
        !error &&
        news?.articles &&
        news.articles.length === 0 &&
        selectedSymbol && (
          <div className={styles.noResults}>
            <p>No news found for {selectedSymbol}</p>
            <p className={styles.suggestion}>
              Try another symbol or check back later
            </p>
          </div>
        )}

      {!loading &&
        !error &&
        news &&
        news.articles &&
        news.articles.length > 0 && (
          <>
            <div className={styles.symbolHeader}>
              <h3>
                {selectedSymbol?.toUpperCase()} Latest News
                <span className={styles.searchInfo}>
                  ({selectedSymbol?.substring(0, 3).toUpperCase()})
                </span>
              </h3>
              <span className={styles.articleCount}>
                {news.totalArticles} articles found
              </span>
            </div>

            <div className={styles.newsList}>
              {news.articles.map((article, index) => (
                <div key={index} className={styles.newsItem}>
                  {article.image && (
                    <div className={styles.imageContainer}>
                      <img
                        src={article.image}
                        alt={article.title}
                        className={styles.thumbnail}
                      />
                    </div>
                  )}
                  <div className={styles.content}>
                    <h3 className={styles.title}>
                      <a
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {article.title}
                      </a>
                    </h3>
                    <div className={styles.sourceRow}>
                      <span className={styles.source}>
                        {article.source.name}
                      </span>
                      <span className={styles.timestamp}>
                        <span className={styles.date}>
                          {formatDate(article.publishedAt)}
                        </span>
                        <span className={styles.time}>
                          {formatTime(article.publishedAt)}
                        </span>
                      </span>
                    </div>
                    {article.description && (
                      <p className={styles.description}>
                        {article.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
    </div>
  );
};

export default NewsWidget;
