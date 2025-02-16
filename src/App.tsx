
import React, { useState, useEffect } from "react";
import AppLayout from './components/layout/AppLayout';
import { NewsProvider } from './context/NewsContext';
import ArticleThread from './components/news/ArticleThread';
import LandingPage from './components/LandingPage';
import config from './config/config';
import SessionService from "./services/sessionService";


function App() {
  const [hasSearched, setHasSearched] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newsData, setNewsData] = useState([]);
    
  useEffect(() => {
    SessionService.initSession();
    return () => {
      SessionService.clearSession();
    };
  }, []);

  const handleSearch = async (query: string) => {
    setIsTransitioning(true);
    setError(null);
    
    try {

      alert("Searching..."); 


      // First, fetch news data
      const sessionId = SessionService.getSessionId();
      const fetchResponse = await fetch(`${config.api.baseUrl}${config.api.endpoints.fetchNews}?keyword=${encodeURIComponent(query)}&session_id=${sessionId}`);
      if (!fetchResponse.ok) {
        throw new Error('Failed to fetch news');
      }
      const fetchedData = await fetchResponse.json();

      // alert("processing now...");
      // Then, process the fetched news
      const processResponse = await fetch(`${config.api.baseUrl}${config.api.endpoints.processNews}?session_id=${sessionId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: fetchedData }),
      });
      
      if (!processResponse.ok) {
        throw new Error('Failed to process news');
      }
      const { data: processedData } = await processResponse.json();


      // Update the NewsContext with the processed data
<!--       window.localStorage.setItem('newsData', JSON.stringify(processedData)); -->

      // Trigger transition animations with proper timing

      // Update application state
      setNewsData(processedData);
      setHasSearched(true);
      const transitionTimeout = setTimeout(() => {
        setIsTransitioning(false);
      }, 1000);

      return () => clearTimeout(transitionTimeout);
    } catch (error) {
      console.error('Error during news search:', error);
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
      setHasSearched(false);
      setIsTransitioning(false);
    }
  };

  const handleReset = () => {
    setIsTransitioning(true);
    setError(null);
    setHasSearched(false);
    setNewsData([]);
    
    // First trigger the fade-out animation
    setTimeout(() => {
      setHasSearched(false);
      // Then reset the transition state after the animation completes
      setTimeout(() => {
        setIsTransitioning(false);
      }, 500);
    }, 300);

  };

  return (

    <div className="relative w-screen h-screen overflow-hidden bg-gray-900">
      {error && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 bg-red-500/90 text-white px-4 py-2 rounded-lg shadow-lg backdrop-blur-sm transition-all duration-300 ease-in-out">
          {error}
        </div>
      )}
      
      <div
        className={`transition-all duration-1000 ease-in-out absolute inset-0 bg-gray-900 ${
          hasSearched 
            ? 'scale-90 opacity-0 pointer-events-none blur-md transform-gpu' 
            : 'scale-100 opacity-100 transform-gpu'
        } ${isTransitioning ? 'transition-timing-function-ease-out' : ''}`}
      >
        <LandingPage onSearch={handleSearch} />
      </div>gjb

      <div
        className={`transition-all duration-1000 ease-in-out absolute inset-0 bg-gray-900 ${
          hasSearched 
            ? 'scale-100 opacity-100 transform-gpu' 
            : 'scale-125 opacity-0 pointer-events-none blur-md transform-gpu'
        } ${isTransitioning ? 'transition-timing-function-ease-in' : ''}`}
      >
<!--         <NewsProvider> -->
        <NewsProvider newsData={newsData}>
          <AppLayout onLogoClick={handleReset} onSearch={handleSearch}>
            <ArticleThread />
          </AppLayout>
        </NewsProvider>
      </div>
    </div>

  );
}

export default App;
