import React, { useState } from 'react';
import Header from './Header';
import NewsCard from '../news/NewsCard';
import ArticleThread from '../news/ArticleThread';

interface Article {
  id: string;
  headline: string;
  description: string;
  content: string;
  imageUrl: string;
  date: string;
  source: string;
}

const dummyArticles: Article[] = [
  {
    id: '1',
    headline: 'Breaking: Major Tech Companies Announce AI Coalition',
    description: 'Leading tech giants form partnership to establish ethical AI guidelines...',
    content: 'Full story content here with more details about the AI coalition...',
    imageUrl: '/placeholder-1.jpg',
    date: '2025-01-15',
    source: 'Tech News'
  },
  {
    id: '2',
    headline: 'Global Climate Summit 2025 Announces Key Initiatives',
    description: 'World leaders gather to address climate change challenges...',
    content: 'Detailed coverage of the climate summit and its outcomes...',
    imageUrl: '/placeholder-2.jpg',
    date: '2025-01-14',
    source: 'Environmental News'
  }
];

const MainLayout: React.FC = () => {
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="pt-16 flex">
        {/* News Feed Sidebar */}
        <div className="w-96 h-screen overflow-y-auto fixed left-0 top-16 p-4 bg-gray-100">
          {dummyArticles.map((article) => (
            <NewsCard
              key={article.id}
              headline={article.headline}
              description={article.description}
              imageUrl={article.imageUrl}
              date={article.date}
              onClick={() => setSelectedArticle(article)}
            />
          ))}
        </div>

        {/* Main Content Area */}
        <div className="ml-96 flex-1">
          {selectedArticle ? (
            <ArticleThread
              article={selectedArticle}
              relatedArticles={dummyArticles.filter(a => a.id !== selectedArticle.id)}
              onBack={() => setSelectedArticle(null)}
            />
          ) : (
            <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
              <p className="text-gray-500 text-lg">Select an article to read</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MainLayout;