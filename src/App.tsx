// src/App.tsx
import React, { useState, useEffect } from "react";
import AppLayout from "./components/layout/AppLayout";
import { NewsProvider } from "./context/NewsContext";
import ArticleThread from "./components/news/ArticleThread";
import LandingPage from "./components/LandingPage";
import config from "./config/config";
import SessionService from "./services/sessionService";

function App() {
  // Local state to track if a search has been done and the transition state
  const [hasSearched, setHasSearched] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // This state holds the raw data processed from the API responses
  const [newsData, setNewsData] = useState<any[]>([]);
  // NEW: This key will force the NewsProvider to remount when updated
  const [providerKey, setProviderKey] = useState(0);

  // Initialize session when the component mounts
  useEffect(() => {
    SessionService.initSession();
    return () => {
      SessionService.clearSession();
    };
  }, []);

  // Handles the news search: fetches and processes data then updates newsData state
  const handleSearch = async (query: string) => {
    setIsTransitioning(true);
    setError(null);
    try {
      const sessionId = SessionService.getSessionId();
      const fetchResponse = await fetch(
        `${config.api.baseUrl}${config.api.endpoints.fetchNews}?keyword=${encodeURIComponent(
          query
        )}&session_id=${sessionId}`
      );
      if (!fetchResponse.ok) {
        throw new Error("Failed to fetch news");
      }
      const fetchedData = await fetchResponse.json();

      const processResponse = await fetch(
        `${config.api.baseUrl}${config.api.endpoints.processNews}?session_id=${sessionId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data: fetchedData }),
        }
      );
      if (!processResponse.ok) {
        throw new Error("Failed to process news");
      }
      const { data: processedData } = await processResponse.json();

      // Update newsData state so that NewsProvider gets new data
      setNewsData(processedData);
      setHasSearched(true);
      // End transition after a short delay
      setTimeout(() => setIsTransitioning(false), 1000);
    } catch (err) {
      console.error("Error during news search:", err);
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
      setHasSearched(false);
      setIsTransitioning(false);
    }
  };

  // Handle reset when the logo is clicked
  const handleReset = () => {
    console.log("Logo clicked – resetting state");
    setIsTransitioning(true);
    setError(null);
    setHasSearched(false);
    setNewsData([]);
    setProviderKey((prev) => prev + 1);
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
          // Main News View
          <NewsProvider key={providerKey} newsData={newsData}>
            <AppLayout onLogoClick={handleReset} onSearch={handleSearch}>
              <ArticleThread />
            </AppLayout>
          </NewsProvider>
        ) : (
          // Landing Page
          <LandingPage onSearch={handleSearch} />
        )}
      </div>
    );
}

//   return (
//     <div className="relative w-screen h-screen overflow-hidden bg-gray-900">
//       {error && (
//         <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 bg-red-500/90 text-white px-4 py-2 rounded-lg shadow-lg backdrop-blur-sm transition-all duration-300 ease-in-out">
//           {error}
//         </div>
//       )}

//       {/* Landing Page */}
//       <div
//         className={`transition-all duration-1000 ease-in-out absolute inset-0 bg-gray-900 ${
//           hasSearched
//             ? "scale-90 opacity-0 pointer-events-none blur-md transform-gpu"
//             : "scale-100 opacity-100 transform-gpu"
//         } ${isTransitioning ? "transition-timing-function-ease-out" : ""}`}
//       >
//         <LandingPage onSearch={handleSearch} />
//       </div>

//       {/* Main News View */}
//       <div
//         className={`transition-all duration-1000 ease-in-out absolute inset-0 bg-gray-900 ${
//           hasSearched
//             ? "scale-100 opacity-100 transform-gpu"
//             : "scale-125 opacity-0 pointer-events-none blur-md transform-gpu"
//         } ${isTransitioning ? "transition-timing-function-ease-in" : ""}`}
//       >
//         {/* By using providerKey as the key, every time it changes the provider remounts */}
//         <NewsProvider key={providerKey} newsData={newsData}>
//           <AppLayout onLogoClick={handleReset} onSearch={handleSearch}>
//             <ArticleThread />
//           </AppLayout>
//         </NewsProvider>
//       </div>
//     </div>
//   );
// }

export default App;