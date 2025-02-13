import React from "react";
import { useNewsContext } from "../../context/NewsContext";
import NewsCard from "../NewsCard";
import LoadingState from "../common/LoadingState";

const Sidebar: React.FC = () => {
  const { news, loading, selectedArticle, setSelectedArticle } =
    useNewsContext();

  return (
    <aside className="w-96 h-[calc(100vh-73px)] sticky top-[73px] overflow-y-auto">
      <div className="p-4 space-y-4 overflow-y-auto h-full">
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
