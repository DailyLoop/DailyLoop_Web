// src/components/NewsCard.tsx
import React, { useState } from "react";
import { Clock, Bookmark } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { addBookmark, removeBookmark } from "../services/bookmarkService";

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
  const { user, token } = useAuth();
  // Initialize state based on whether the article is already bookmarked.
  const [isBookmarked, setIsBookmarked] = useState(!!news.bookmark_id);
  const [bookmarkId, setBookmarkId] = useState<string | null>(news.bookmark_id || null);
  const [loading, setLoading] = useState(false);

  const handleBookmarkClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user || !token) return;

    setLoading(true);
    try {
      if (isBookmarked) {
        await removeBookmark(bookmarkId as string, token);
        setIsBookmarked(false);
        setBookmarkId(null);
        onBookmarkRemoved?.(news.id);  // Add this line
      } else {
        // Add bookmark if not bookmarked.
        const data = await addBookmark(user.id, news.id, token);
        // Assume API returns an object containing the created bookmark's id.
        setIsBookmarked(true);
        setBookmarkId(data.data.id);
      }
    } catch (error) {
      console.error("Bookmark error:", error);
    }
    setLoading(false);
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
                disabled={loading}
                className="p-1 transition-colors duration-300"
              >
                <Bookmark
                  className={`h-5 w-5 ${isBookmarked ? "text-blue-500" : "text-gray-400"}`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsCard;