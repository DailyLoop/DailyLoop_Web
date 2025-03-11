import React, { useState, useEffect } from 'react';
import AppLayout from '../components/layout/AppLayout';
import { NewsProvider } from '../context/NewsContext';
import ArticleThread from '../components/news/ArticleThread';
import LandingPage from '../components/LandingPage';
import LoadingState from '../components/common/LoadingState';
import config from '../config/config';
import SessionService from '../services/sessionService';
import { useAuth } from '../context/AuthContext'; // Import Auth context
// StoryTrackingProvider is now provided at the App level

const NewsApp: React.FC = () => {
  const { user, token } = useAuth(); // Get the current user

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
      // return Array.from(merged);

      const mergedArray = Array.from(merged);
      // Check if keywords are actually different
      if (
        mergedArray.length === prev.length &&
        mergedArray.every((kw, i) => kw === prev[i])
      ) {
        return prev; // No state update needed
      }
      return mergedArray;
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
      
      // Build the fetch URL including keyword and session_id
      const fetchUrl = `${config.api.baseUrl}${config.api.endpoints.fetchNews}?keyword=${encodeURIComponent(finalQuery)}&session_id=${sessionId}`;

      const fetchResponse = await fetch(fetchUrl);
      if (!fetchResponse.ok) {
        throw new Error("Failed to fetch news");
      }
      
      // Get the article IDs from the fetch response
      const { data: articleIds } = await fetchResponse.json();

      // Call the process endpoint with session_id in query params and article_ids in request body
      const processUrl = `${config.api.baseUrl}${config.api.endpoints.processNews}?session_id=${sessionId}`;
      
      // // Prepare request headers, including Authorization if user is logged in
      // const headers: Record<string, string> = {
      //   "Content-Type": "application/json"
      // };
      
      // // Add JWT token if user is logged in
      // if (user && localStorage.getItem('authToken')) {
      //   headers['Authorization'] = `Bearer ${localStorage.getItem('authToken')}`;
      // }
      
      // console.log("Request headers:", headers);
      // console.log(localStorage.getItem('authToken'));
      // console.log("User:", user);



      const processResponse = await fetch(processUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ article_ids: articleIds })
      });
      
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
    if (selectedKeywords.length === 0) return;
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
        <>
            <NewsProvider key={providerKey} newsData={newsData}>
              <AppLayout
                onLogoClick={handleReset}
                onSearch={handleSearch}
                toggleKeyword={toggleKeyword}
                selectedKeywords={selectedKeywords}
              >
                <ArticleThread />
              </AppLayout>
            </NewsProvider>
          {showShimmer && (
            <div className="absolute inset-0 flex items-center justify-center z-50">
              <div className="absolute inset-0 bg-gray-900 bg-opacity-75 animate-pulse"></div>
              <LoadingState type="spinner" />
            </div>
          )}
        </>
      ) : (
        <LandingPage onSearch={async (query) => await handleSearch(query)} />
      )}
    </div>
  );
};

export default NewsApp;