import React from 'react';

interface NewsItem {
  id: string;
  headline: string;
  description: string;
  imageUrl: string;
  date: string;
  source: string;
}

const mockNews: NewsItem[] = [
  {
    id: '1',
    headline: 'Breaking: Major Tech Companies Announce AI Coalition',
    description: 'Leading tech giants form partnership to establish ethical AI guidelines...',
    imageUrl: '/placeholder.jpg',
    date: '2025-01-15',
    source: 'Tech News'
  },
  {
    id: '2',
    headline: 'Global Climate Summit 2025 Announces Key Initiatives',
    description: 'World leaders gather to address climate change challenges...',
    imageUrl: '/placeholder.jpg',
    date: '2025-01-15',
    source: 'Environmental News'
  }
];

const NewsCard: React.FC<NewsItem> = ({ headline, description, imageUrl, date, source }) => {
  return (
    <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-200 overflow-hidden">
      <div className="aspect-w-16 aspect-h-9 bg-gray-100">
        <img src={imageUrl} alt={headline} className="object-cover w-full h-full" />
      </div>
      <div className="p-4">
        <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">{headline}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{description}</p>
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span className="font-medium">{source}</span>
          <time dateTime={date}>{date}</time>
        </div>
      </div>
    </div>
  );
};

const NewsFeed: React.FC = () => {
  return (
    <div className="h-[calc(100vh-5rem)] overflow-y-auto px-4 py-6 space-y-6">
      {mockNews.map((news) => (
        <NewsCard key={news.id} {...news} />
      ))}
    </div>
  );
};

export default NewsFeed;