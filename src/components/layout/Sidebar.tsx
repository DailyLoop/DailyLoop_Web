import React, { useState, useMemo } from "react";
import { useNewsContext } from "../../context/NewsContext";
import NewsCard from "../NewsCard";
import LoadingState from "../common/LoadingState";

interface SidebarProps {
  toggleKeyword: (kw: string) => void;    // from parent, triggers a new API search
  selectedKeywords: string[];            // from parent, used in "Latest News" mode
}

const Sidebar: React.FC<SidebarProps> = ({
  toggleKeyword,
  selectedKeywords,
}) => {
  const { news, loading, selectedArticle, setSelectedArticle } = useNewsContext();

  // State for toggle mode: "latest" => API-based search, "local" => local filter
  const [mode, setMode] = useState<"latest" | "local">("latest");

  // Local filter keywords (only relevant in "local" mode)
  const [localFilterKeywords, setLocalFilterKeywords] = useState<string[]>([]);

  // Unique filter keywords from the fetched news data, sorted by frequency and limited to top 5
  const filterKeywords = useMemo(() => {
    const keywords = news.flatMap((item) => item.filter_keywords || []);
    
    // Count occurrences of each keyword
    const keywordCounts = keywords.reduce((acc, keyword) => {
      acc[keyword] = (acc[keyword] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    // Convert to array of [keyword, count] pairs, sort by count (descending), and take top 5
    return Object.entries(keywordCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([keyword]) => keyword);
  }, [news]);

  // Handle clicks on keywords
  const handleKeywordClick = (keyword: string) => {
    if (mode === "latest") {
      // "Latest News" mode => triggers a new API search in parent
      toggleKeyword(keyword);
    } else {
      // "Filtering" mode => filter locally, no API call
      setLocalFilterKeywords((prev) =>
        prev.includes(keyword)
          ? prev.filter((k) => k !== keyword)
          : [...prev, keyword]
      );
    }
  };

  // Currently active keywords for the chosen mode
  const activeKeywords = mode === "latest" ? selectedKeywords : localFilterKeywords;

  // Decide which articles to display
  const displayedNews = useMemo(() => {
    if (mode === "latest") {
      // Show whatever the parent fetched
      return news;
    }
    // In local filtering mode, only show articles that match at least one local keyword
    if (localFilterKeywords.length === 0) return news;
    return news.filter((article) =>
      article.filter_keywords?.some((kw: string) => localFilterKeywords.includes(kw))
    );
  }, [mode, news, localFilterKeywords]);

  // Toggle between "latest" and "local" mode
  const handleModeChange = () => {
    setMode((prev) => (prev === "latest" ? "local" : "latest"));
  };

  return (
    <aside className="w-[400px] border-r border-gray-800/50 h-[calc(100vh-73px)] sticky top-[73px] backdrop-blur-sm flex flex-col transition-all duration-300 ease-in-out">
      <div className="p-4 border-b border-gray-800/50 backdrop-blur-sm transition-colors duration-300">
        {/* Header row with "Latest News" | toggle | "Filtering" */}
        <div className="flex items-center justify-between mb-4">
          <div />
          <div className="flex items-center space-x-3">
            <span className={mode === "latest" ? "text-white font-semibold" : "text-gray-400"}>
              Latest News
            </span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={mode === "local"}
                onChange={handleModeChange}
              />
              <div
                className={`w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 
                rounded-full peer peer-checked:bg-blue-600 relative after:content-[''] after:absolute after:top-1
                after:left-1 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4
                after:w-4 after:transition-all peer-checked:after:translate-x-full`}
              />
            </label>
            <span className={mode === "local" ? "text-white font-semibold" : "text-gray-400"}>
              Filtering
            </span>
          </div>
          <div />
        </div>

        {/* Display active keywords as blue pills */}
        <div className="mb-4 flex flex-wrap gap-2">
          {activeKeywords.map((kw) => (
            <button
              key={kw}
              onClick={() => handleKeywordClick(kw)}
              className="px-3 py-1.5 bg-blue-600 text-white rounded-full text-sm transition-all duration-300 ease-in-out hover:scale-105"
            >
              {kw} &times;
            </button>
          ))}
        </div>

        {/* Render all possible keywords from the news data */}
        <div className="flex flex-wrap gap-2">
          {filterKeywords.map((filter) => {
            const isSelected = activeKeywords.includes(filter);
            return (
              <button
                key={filter}
                onClick={() => handleKeywordClick(filter)}
                className={`px-3 py-1.5 rounded-full text-sm transition-all duration-300 ease-in-out hover:scale-105 
                  hover:shadow-lg hover:shadow-blue-500/10 transform hover:-translate-y-0.5 
                  ${isSelected ? "bg-blue-600 text-white" : "bg-gray-800/70 text-gray-300 hover:bg-gray-700/70"}`}
              >
                {filter}
              </button>
            );
          })}
        </div>
      </div>

      {/* Articles list using flex-grow to take the remaining space */}
      <div className="p-4 space-y-4 overflow-y-auto flex-1 scrollbar scrollbar-thin scrollbar-thumb-blue-600 scrollbar-thumb-rounded-md scrollbar-track-gray-800/30 hover:scrollbar-thumb-blue-500 transition-all duration-300">
        {loading ? (
          <LoadingState type="cards" count={5} />
        ) : (
          displayedNews.map((item, index) => (
            <div
              key={item.id}
              className="transform transition-all duration-300 hover:scale-[1.02] opacity-0 animate-fadeIn"
              style={{
                animationDelay: `${index * 100}ms`,
                animationFillMode: "forwards",
              }}
            >
              <NewsCard
                news={item}
                onClick={() => setSelectedArticle(item.id)}
                isSelected={selectedArticle === item.id}
                index={index}
              />
            </div>
          ))
        )}
      </div>
    </aside>
  );
};

export default Sidebar;