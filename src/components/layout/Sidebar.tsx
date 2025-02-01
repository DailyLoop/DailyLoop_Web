import React from 'react';
import NewsCard from '../news/NewsCard';

const Sidebar: React.FC = () => {
  // Mock data for demonstration
  const newsItems = [
    {
      id: 1,
      headline: 'Breaking: Major Tech Companies Announce AI Coalition',
      description: 'Leading tech giants form partnership to establish ethical AI guidelines...',
      imageUrl: '/news-1.jpg',
      date: '2025-01-15',
      source: 'Tech News'
    },
    {
      id: 2,
      headline: 'Global Climate Summit 2025 Announces Key Initiatives',
      description: 'World leaders gather to address climate change challenges...',
      imageUrl: '/news-2.jpg',
      date: '2025-01-15',
      source: 'Environmental News'
    }
  ];

  return (
    <aside className="w-96 border-r border-gray-200 min-h-screen bg-white overflow-y-auto">
      <div className="p-4 space-y-4">
        {newsItems.map((item) => (
          <NewsCard
            key={item.id}
            headline={item.headline}
            description={item.description}
            imageUrl={item.imageUrl}
            date={item.date}
            source={item.source}
          />
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;