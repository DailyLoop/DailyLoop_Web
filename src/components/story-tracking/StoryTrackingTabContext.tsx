// src/components/story-tracking/StoryTrackingTabContent.tsx

import React, { useEffect } from 'react';
import { useStoryTracking } from '../../context/StoryTrackingContext';
import config from '../../config/config';

interface StoryTrackingTabContextProps {
  keyword: string;
}

const StoryTrackingTabContext: React.FC<StoryTrackingTabContextProps> = ({ keyword }) => {
  const { trackedStories, addArticlesToStory } = useStoryTracking();
  
  // Debug: Log component mount and props
  console.log('StoryTrackingTabContext mounted with keyword:', keyword);
  console.log('Available tracked stories:', trackedStories);
  
  // find the story object for this keyword
  const story = trackedStories.find(s => s.keyword === keyword);
  console.log('Found story for keyword:', story); // Debug: Log found story

  // Poll the backend every 30 seconds for new articles
  useEffect(() => {
    console.log('Setting up polling for keyword:', keyword); // Debug: Log polling setup
    const intervalId = setInterval(async () => {
      try {
        console.log('Polling for new articles...'); // Debug: Log polling attempt
        const encodedKeyword = encodeURIComponent(keyword).replace(/%20/g, '+');
        const response = await fetch(`${config.api.baseUrl}${config.api.endpoints.storyTracking}?keyword=${encodedKeyword}`);
        if (!response.ok) {
          console.error(`HTTP error! status: ${response.status}`);
          return;
        }
        const data = await response.json();
        console.log('Received API response:', data);
        if (data?.articles && Array.isArray(data.articles)) {
          const formattedArticles = data.articles.map((article: any) => {
            // Validate and transform each article object
            if (!article || typeof article !== 'object') {
              console.warn('Invalid article object:', article);
              return null;
            }

            return {
              id: typeof article.id === 'string' ? article.id : 
                  typeof article.id === 'number' ? String(article.id) : 
                  String(Math.random()),
              title: typeof article.title === 'string' && article.title.trim() ? 
                     article.title.trim() : 'Untitled',
              source: typeof article.source === 'string' && article.source.trim() ? 
                      article.source.trim() : 'Unknown Source',
              publishedAt: article.publishedAt && 
                          !isNaN(new Date(article.publishedAt).getTime()) ? 
                          new Date(article.publishedAt).toISOString() : 
                          new Date().toISOString(),
              url: typeof article.url === 'string' && 
                   article.url.startsWith('http') ? article.url : '#'
            };
          }).filter(Boolean); // Remove any null values
          
          if (formattedArticles.length > 0) {
            addArticlesToStory(keyword, formattedArticles);
          } else {
            console.warn('No valid articles found in the response');
          }
        } else {
          console.error('Invalid response format:', data);
        }
      } catch (error) {
        console.error('Error polling new articles:', error);
      }
    }, 30000);

    return () => {
      console.log('Cleaning up polling for keyword:', keyword); // Debug: Log cleanup
      clearInterval(intervalId);
    };
  }, [keyword, addArticlesToStory]);

  if (!story) {
    console.log('No story found for keyword:', keyword); // Debug: Log when no story is found
    return <div>No story found for {keyword}</div>;
  }

  // sort articles newest -> oldest
  const sortedArticles = [...story.articles].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
  console.log('Sorted articles:', sortedArticles); // Debug: Log sorted articles

  return (
    <div>
      {sortedArticles.map(article => (
        <div key={article.id} className="mb-4 border-b border-gray-700 pb-2">
          <div className="text-sm text-gray-400">
            {new Date(article.publishedAt).toLocaleString()} — {article.source}
          </div>
          <div className="text-white font-semibold">{article.title}</div>
          <a
            href={article.url}
            target="_blank"
            rel="noreferrer"
            className="text-blue-400 text-sm"
          >
            Read More
          </a>
        </div>
      ))}
    </div>
  );
};

export default StoryTrackingTabContext;