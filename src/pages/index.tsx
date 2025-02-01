import React from 'react';
import AppLayout from '../components/layout/AppLayout';
import ArticleThread from '../components/news/ArticleThread';

const Home: React.FC = () => {
  // Mock data for demonstration
  const mockArticle = {
    headline: 'Breaking: Major Tech Companies Announce AI Coalition',
    content: 'In a groundbreaking development, leading technology companies have joined forces to establish a comprehensive framework for ethical AI development and deployment. The coalition aims to address growing concerns about AI safety and ensure responsible innovation in the field...',
    imageUrl: '/news-1.jpg',
    date: '2025-01-15',
    source: 'Tech News'
  };

  const mockRelatedArticles = [
    {
      headline: 'AI Safety Measures: A Deep Dive into the New Coalition Guidelines',
      content: 'Examining the detailed safety protocols proposed by the newly formed AI coalition...',
      imageUrl: '/news-2.jpg',
      date: '2025-01-15',
      source: 'Tech Analysis'
    },
    {
      headline: 'Industry Leaders React to New AI Coalition Guidelines',
      content: 'Key figures in the technology sector share their thoughts on the newly announced AI safety framework...',
      imageUrl: '/news-3.jpg',
      date: '2025-01-15',
      source: 'Industry News'
    }
  ];

  return (
    <AppLayout>
      <ArticleThread article={mockArticle} relatedArticles={mockRelatedArticles} />
    </AppLayout>
  );
};

export default Home;