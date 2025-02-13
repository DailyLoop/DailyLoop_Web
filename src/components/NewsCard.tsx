import React from "react";
import { Clock, Bookmark } from "lucide-react";

interface News {
  id: string;
  title: string;
  summary: string;
  source: string;
  image: string;
  date: string;
}

interface NewsCardProps {
  news: News;
  onClick: () => void;
  isSelected?: boolean;
}

const NewsCard: React.FC<NewsCardProps> = ({ news, onClick, isSelected }) => {
  return (
    <div
      className={`bg-primary rounded-xl overflow-hidden hover:ring-2 hover:ring-gray-600 transition-all cursor-pointer group ${
        isSelected ? "ring-2 ring-gray-500" : ""
      }`}
      onClick={onClick}
    >
      <div className="h-32 relative overflow-hidden">
        <img
          src={news.image}
          alt={news.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 to-transparent" />
        <div className="absolute bottom-2 left-3 right-3">
          <p className="text-xs text-gray-300 mb-1">{news.source}</p>
          <h2 className="text-sm font-semibold line-clamp-1">{news.title}</h2>
        </div>
      </div>
      <div className="p-3">
        <p className="text-gray-400 text-xs line-clamp-2 mb-2">
          {news.summary}
        </p>
        <div className="flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center space-x-1">
            <Clock className="h-3 w-3" />
            <span>{news.date}</span>
          </div>
          <button className="hover:text-blue-500 transition-colors">
            <Bookmark className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewsCard;
