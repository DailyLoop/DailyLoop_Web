import React from "react";
import { useNewsContext } from "../../context/NewsContext";
import ArticleView from "../ArticleView";

const ArticleThread: React.FC = () => {
  const { selectedArticle, setSelectedArticle, news } = useNewsContext();
  const article = news.find((n) => n.id === selectedArticle);

  if (!selectedArticle || !article) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-73px)]">
        <p className="text-gray-400">Select an article to read</p>
      </div>
    );
  }

  return (
    <ArticleView article={article} onBack={() => setSelectedArticle(null)} />
  );
};

export default ArticleThread;
