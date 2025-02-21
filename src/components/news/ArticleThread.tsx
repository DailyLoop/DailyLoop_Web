import React from "react";
import { useNewsContext } from "../../context/NewsContext";
import ArticleView from "../ArticleView";

const ArticleThread: React.FC = () => {
  const { selectedArticle, setSelectedArticle, news } = useNewsContext();

  React.useEffect(() => {
    if (news.length > 0 && !selectedArticle) {
      setSelectedArticle(news[0].id);
    }
  }, [news, selectedArticle, setSelectedArticle]);

  const article = news.find((n) => n.id === selectedArticle);

  if (!article) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-73px)]">
        <p className="text-gray-400">Loading article...</p>
      </div>
    );
  }

  return (
    <ArticleView article={article} onBack={() => setSelectedArticle(null)} />
  );
};

export default ArticleThread;
