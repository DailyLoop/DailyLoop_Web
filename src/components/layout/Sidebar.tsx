import React from "react";
import { useNewsContext } from "../../context/NewsContext";
import NewsCard from "../NewsCard";
import LoadingState from "../common/LoadingState";
import { Filter } from 'lucide-react';

const Sidebar: React.FC = () => {
  const { news, loading, selectedArticle, setSelectedArticle } =
    useNewsContext();

  return (
    <aside className="w-[400px] border-r border-gray-800 h-[calc(100vh-73px)] sticky top-[73px]">
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Latest News</h2>
          <button className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors">
            <Filter className="h-4 w-4" />
            <span className="text-sm">Filters</span>
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          <button className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 rounded-full text-sm text-gray-300">
            Breaking News
          </button>
          <button className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 rounded-full text-sm text-gray-300">
            Technology
          </button>
          <button className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 rounded-full text-sm text-gray-300">
            Politics
          </button>
          <button className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 rounded-full text-sm text-gray-300">
            Business
          </button>
        </div>
      </div>
      <div className="p-4 space-y-4 overflow-y-auto h-[calc(100%-120px)]">
        {loading ? (
          <LoadingState type="cards" count={5} />
        ) : (
          news.map((item) => (
            <NewsCard
              key={item.id}
              news={item}
              onClick={() => setSelectedArticle(item.id)}
              isSelected={selectedArticle === item.id}
            />
          ))
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
