import React, { useState, useEffect } from 'react';
import AppLayout from '../components/layout/AppLayout';
import { NewsProvider } from '../context/NewsContext';
import ArticleThread from '../components/news/ArticleThread';
import LandingPage from '../components/LandingPage';
import LoadingState from '../components/common/LoadingState';
import config from '../config/config';
import SessionService from '../services/sessionService';
import { useAuth } from '../context/AuthContext'; // Import Auth context

const NewsApp: React.FC = () => {
  const { user } = useAuth(); // Get the current user

  const [hasSearched, setHasSearched] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newsData, setNewsData] = useState<any[]>([]);
  const [providerKey, setProviderKey] = useState(0);
  const [showShimmer, setShowShimmer] = useState(false);
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);

  useEffect(() => {
    SessionService.initSession();
    return () => {
      SessionService.clearSession();
    };
  }, []);

  const mergeQueryIntoSelectedKeywords = (query: string) => {
    const tokens = query.split(/\s+/).filter(Boolean);
    setSelectedKeywords((prev) => {
      const merged = new Set([...prev, ...tokens]);
      return Array.from(merged);
    });
  };

  const toggleKeyword = (keyword: string) => {
    setSelectedKeywords(prev =>
      prev.includes(keyword)
        ? prev.filter(k => k !== keyword)
        : [...prev, keyword]
    );
  };

  const buildSearchString = (keywords: string[]) => {
    return keywords.join(" ");
  };

  const performSearch = async (keywords: string[]) => {
    const finalQuery = buildSearchString(keywords);
    if (!finalQuery.trim()) {
      setHasSearched(false);
      setNewsData([]);
      return;
    }

    setShowShimmer(true);
    setIsTransitioning(true);
    setError(null);

    try {
      const sessionId = SessionService.getSessionId();
      const userId = user?.id; // Get the current user's ID

      // Build the fetch URL including keyword, session_id, and user_id (if available)
      const fetchUrl = `${config.api.baseUrl}${config.api.endpoints.fetchNews}?keyword=${encodeURIComponent(finalQuery)}&session_id=${sessionId}${userId ? `&user_id=${userId}` : ''}`;

      const fetchResponse = await fetch(fetchUrl);
      if (!fetchResponse.ok) {
        throw new Error("Failed to fetch news");
      }
      // We don't actually need to use the fetched data here,
      // because the fetch endpoint stores articles in the DB using session_id.
      await fetchResponse.json();

      // Call the process endpoint with session_id only,
      // so that it only processes (summarizes) articles fetched in this session.
      const processResponse = await fetch(
        `${config.api.baseUrl}${config.api.endpoints.processNews}?session_id=${sessionId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" }
          // Removed body: JSON.stringify({ data: fetchedData })
        }
      );
      if (!processResponse.ok) {
        throw new Error("Failed to process news");
      }
      const { data: processedData } = await processResponse.json();

      setNewsData(processedData);
      setHasSearched(true);
      setShowShimmer(false);
      setTimeout(() => setIsTransitioning(false), 1000);
    } catch (err) {
      console.error("Error during news search:", err);
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
      setHasSearched(false);
      setShowShimmer(false);
      setIsTransitioning(false);
    }
  };

  const handleSearch = (query: string) => {
    mergeQueryIntoSelectedKeywords(query);
  };

  useEffect(() => {
    performSearch(selectedKeywords);
  }, [selectedKeywords]);

  const handleReset = () => {
    console.log("Logo clicked – resetting state");
    setIsTransitioning(true);
    setError(null);
    setHasSearched(false);
    setNewsData([]);
    setProviderKey((prev) => prev + 1);
    setSelectedKeywords([]);
    setTimeout(() => {
      setIsTransitioning(false);
    }, 500);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-gray-900">
      {error && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 bg-red-500/90 text-white px-4 py-2 rounded-lg shadow-lg backdrop-blur-sm transition-all duration-300 ease-in-out">
          {error}
        </div>
      )}

      {hasSearched ? (
        <NewsProvider key={providerKey} newsData={newsData}>
          <AppLayout
            onLogoClick={handleReset}
            onSearch={handleSearch}
            toggleKeyword={toggleKeyword}
            selectedKeywords={selectedKeywords}
          >
            <ArticleThread />
          </AppLayout>
          {showShimmer && (
            <div className="absolute inset-0 flex items-center justify-center z-50">
              <div className="absolute inset-0 bg-gray-900 bg-opacity-75 animate-pulse"></div>
              <LoadingState type="spinner" />
            </div>
          )}
        </NewsProvider>
      ) : (
        <LandingPage onSearch={handleSearch} />
      )}
    </div>
  );
};

export default NewsApp;