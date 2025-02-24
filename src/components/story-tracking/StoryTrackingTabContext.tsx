// src/components/story-tracking/StoryTrackingTabContent.tsx

import React, { useEffect } from 'react';
import { useStoryTracking } from '../../context/StoryTrackingContext';

interface StoryTrackingTabContextProps {
  keyword: string;
}

const StoryTrackingTabContext: React.FC<StoryTrackingTabContextProps> = ({ keyword }) => {
  const { trackedStories, addArticlesToStory } = useStoryTracking();
  // find the story object for this keyword
  const story = trackedStories.find(s => s.keyword === keyword);

  // Poll the backend every 30 seconds for new articles
  useEffect(() => {
    const intervalId = setInterval(async () => {
      try {
        // Example endpoint: /api/story_tracking?keyword=...
        const response = await fetch(`/api/story_tracking?keyword=${encodeURIComponent(keyword)}`);
        const data = await response.json();
        if (data.status === 'success' && Array.isArray(data.articles)) {
          addArticlesToStory(keyword, data.articles);
        }
      } catch (error) {
        console.error('Error polling new articles:', error);
      }
    }, 30000);

    return () => clearInterval(intervalId);
  }, [keyword, addArticlesToStory]);

  if (!story) {
    return <div>No story found for {keyword}</div>;
  }

  // sort articles newest -> oldest
  const sortedArticles = [...story.articles].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

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