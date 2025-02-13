import React, { useState } from "react";
import AppLayout from "./components/layout/AppLayout";
import { NewsProvider } from "./context/NewsContext";
import ArticleThread from "./components/news/ArticleThread";
import LandingPage from "./components/LandingPage";

function App() {
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (query: string) => {
    // Here you'll integrate with your Python API to fetch news based on the query
    console.log("Searching for:", query);
    setHasSearched(true);
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
