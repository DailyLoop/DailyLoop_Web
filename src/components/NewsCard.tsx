import React from "react";
import { Clock, Bookmark, Building2, ExternalLink } from "lucide-react";

interface News {
  id: string;
  title: string;
  summary: string;
  context: string;
  source: string;
  image: string;
  date: string;
  url: string;
}

interface NewsCardProps {
  news: News;
  onClick: () => void;
  isSelected?: boolean;
  index: number;
}

const NewsCard: React.FC<NewsCardProps> = ({ news, onClick, isSelected, index }) => {
  return (
    <div 
      className={`bg-gray-800/90 backdrop-blur-sm rounded-lg p-4 hover:bg-gray-750 transition-all duration-300 ease-in-out cursor-pointer transform hover:scale-[1.02] ${
        isSelected ? 'ring-2 ring-blue-500/50 shadow-lg shadow-blue-500/10' : ''
      }`}
      onClick={onClick}
      style={{
        animationDelay: `${index * 100}ms`,
        animation: 'fadeIn 0.5s ease-out forwards',
        opacity: 0
      }}
    >
      <div className="flex items-start space-x-4">
        <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 transition-transform duration-300 ease-in-out transform group-hover:scale-105">
          <img
            src={news.image || '/placeholder-news.jpg'}
            alt={news.source}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/placeholder-news.jpg';
            }}
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <span className="text-xs text-gray-400">{news.date}</span>
            <span className="text-xs text-gray-400">•</span>
            <span className="text-xs text-blue-400">Trending</span>
          </div>
          <h2 className="text-lg font-semibold text-white mb-2 line-clamp-2 transition-colors duration-300">{news.title}</h2>
          <div className="flex items-center space-x-4 mb-3">
            <div className="flex items-center text-gray-400">
              <Building2 className="h-4 w-4 mr-1" />
              <span className="text-sm">{news.source}</span>
            </div>
            <div className="flex items-center text-gray-400">
              <Clock className="h-4 w-4 mr-1" />
              <span className="text-sm">Live Updates</span>
            </div>
          </div>
          <p className="text-gray-400 text-sm line-clamp-2 mb-4">{news.context || news.summary}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="px-2 py-1 bg-gray-700/50 backdrop-blur-sm rounded-full text-xs text-gray-300 transition-colors duration-300 hover:bg-gray-600/50">Breaking News</span>
              <span className="px-2 py-1 bg-gray-700/50 backdrop-blur-sm rounded-full text-xs text-gray-300 transition-colors duration-300 hover:bg-gray-600/50">Featured</span>
            </div>
            <div className="flex items-center space-x-2">
              <button className="text-gray-400 hover:text-blue-500 transition-colors duration-300 p-1">
                <Bookmark className="h-4 w-4" />
              </button>
              <button className="text-gray-400 hover:text-blue-500 transition-colors duration-300 p-1">
                <ExternalLink className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsCard;
