// src/components/NewsCard.tsx
import React from "react";
import { Clock, Bookmark, Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNewsContext } from "../context/NewsContext";

interface News {
  id: string;
  title: string;
  summary: string;
  context: string;
  source: string;
  image: string;
  date: string;
  url: string;
  // Optionally, if the article is already bookmarked, bookmarkId is provided:
  bookmark_id?: string;
}

interface NewsCardProps {
  news: News;
  onClick: () => void;
  isSelected?: boolean;
  index: number;
  onBookmarkRemoved?: (articleId: string) => void;  // Add this prop
}

const NewsCard: React.FC<NewsCardProps> = ({ news, onClick, isSelected, index, onBookmarkRemoved }) => {
  const { user } = useAuth();
  // Use context-based bookmark management
  const { isBookmarked, toggleBookmark, bookmarkLoading } = useNewsContext();
  
  const handleBookmarkClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) return;
    
    await toggleBookmark(news.id);
    
    // If this is a bookmarks page and the bookmark was removed, notify the parent
    if (onBookmarkRemoved && isBookmarked(news.id)) {
      onBookmarkRemoved(news.id);
    }
  };

  return (
    <div
      className={`bg-gray-800/90 backdrop-blur-sm rounded-lg p-4 hover:bg-gray-750 transition-all duration-300 ease-in-out cursor-pointer transform hover:scale-[1.02] ${
        isSelected ? "ring-2 ring-blue-500/50 shadow-lg shadow-blue-500/10" : ""
      }`}
      onClick={onClick}
      style={{
        animationDelay: `${index * 100}ms`,
        animation: "fadeIn 0.5s ease-out forwards",
        opacity: 0,
      }}
    >
      <div className="flex items-start space-x-4">
        <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 transition-transform duration-300 ease-in-out transform group-hover:scale-105">
          <img
            src={news.image || "/placeholder-news.jpg"}
            alt={news.source}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/placeholder-news.jpg";
            }}
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <span className="text-xs text-gray-400">{news.date}</span>
            <span className="text-xs text-gray-400">•</span>
            <span className="text-xs text-blue-400">Trending</span>
          </div>
          <h2 className="text-lg font-semibold text-white mb-2 line-clamp-2 transition-colors duration-300">
            {news.title}
          </h2>
          <div className="flex items-center space-x-4 mb-3">
            <div className="flex items-center text-gray-400">
              <span className="text-sm">{news.source}</span>
            </div>
            <div className="flex items-center text-gray-400">
              <Clock className="h-4 w-4 mr-1" />
              <span className="text-sm">Live Updates</span>
            </div>
          </div>
          <p className="text-gray-400 text-sm line-clamp-2 mb-4">
            {news.context || news.summary}
          </p>
          <div className="flex items-center justify-between">
            {/* Other tags can go here */}
            <div className="flex items-center space-x-2">
              <span className="px-2 py-1 bg-gray-700/50 backdrop-blur-sm rounded-full text-xs text-gray-300 transition-colors duration-300 hover:bg-gray-600/50">
                Breaking News
              </span>
            </div>
            {/* Bookmark button */}
            <div className="flex items-center space-x-2">
              <button
                onClick={handleBookmarkClick}
                disabled={bookmarkLoading}
                className="p-1 transition-colors duration-300"
              >
                {bookmarkLoading ? (
                  <Loader2 className="h-5 w-5 text-gray-400 animate-spin" />
                ) : (
                  <Bookmark
                    className={`h-5 w-5 ${isBookmarked(news.id) ? "text-blue-500" : "text-gray-400"}`}
                  />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsCard;