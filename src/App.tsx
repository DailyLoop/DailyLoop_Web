import React, { useState } from "react";
import AppLayout from "./components/layout/AppLayout";
import { NewsProvider } from "./context/NewsContext";
import ArticleThread from "./components/news/ArticleThread";
import LandingPage from "./components/LandingPage";

function App() {
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (query: string) => {
    try {
      // First, fetch news data
      const fetchResponse = await fetch(`localhost:8000/api/news/fetch?query=${encodeURIComponent(query)}`);
      if (!fetchResponse.ok) {
        throw new Error('Failed to fetch news');
      }
      const fetchedData = await fetchResponse.json();

      // Then, process the fetched news
      const processResponse = await fetch('/api/news/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: fetchedData }),
      });
      if (!processResponse.ok) {
        throw new Error('Failed to process news');
      }
      const processedData = await processResponse.json();

      // Update application state
      setHasSearched(true);
    } catch (error) {
      console.error('Error during news search:', error);
      // You might want to add error handling UI here
    }
  };

  const handleReset = () => {
    setHasSearched(false);
  };

  if (!hasSearched) {
    return <LandingPage onSearch={handleSearch} />;
  }

  return (
    <NewsProvider>
      <AppLayout onLogoClick={handleReset}>
        <ArticleThread />
      </AppLayout>
    </NewsProvider>
  );
}

export default App;
