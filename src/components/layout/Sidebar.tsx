import React from 'react';
import { useNewsContext } from '../../context/NewsContext';
import NewsCard from '../NewsCard';
import LoadingState from '../common/LoadingState';
import { Filter } from 'lucide-react';

const Sidebar: React.FC = () => {
  const { news, loading, selectedArticle, setSelectedArticle } = useNewsContext();
  
  // Extract unique filter keywords from news data
  const filterKeywords = React.useMemo(() => {
    const keywords = news.flatMap(item => item.filter_keywords || []);
    return Array.from(new Set(keywords));
  }, [news]);

  return (
    <aside className="w-[400px] border-r border-gray-800/50 h-[calc(100vh-73px)] sticky top-[73px] backdrop-blur-sm transition-all duration-300 ease-in-out">
      <div className="p-4 border-b border-gray-800/50 backdrop-blur-sm bg-gray-900/50 transition-colors duration-300">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white transition-opacity duration-300 hover:opacity-80">Latest News</h2>
          <button className="flex items-center space-x-2 text-gray-400 hover:text-white transition-all duration-300 hover:scale-105 transform">
            <Filter className="h-4 w-4 transition-transform duration-300 hover:rotate-180" />
            <span className="text-sm">Filters</span>
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {filterKeywords.map((filter) => (
            <button
              key={filter}
              className="px-3 py-1.5 bg-gray-800/70 hover:bg-gray-700/70 rounded-full text-sm text-gray-300 transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg hover:shadow-blue-500/10 transform hover:-translate-y-0.5"
            >
              {filter}
            </button>
          ))}
        </div>
      </div>
      <div className="p-4 space-y-4 overflow-y-auto h-[calc(100%-120px)] scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent transition-all duration-300">
        {loading ? (
          <LoadingState type="cards" count={5} />
        ) : (
          news.map((item, index) => (
            <div
              key={item.id}
              className="transform transition-all duration-300 hover:scale-[1.02] opacity-0 animate-fadeIn"
              style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards' }}
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
