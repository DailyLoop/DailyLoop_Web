// src/components/story-tracking/StoryTrackingTabContext.tsx

import React, { useEffect, useState } from 'react';
import { useStoryTracking } from '../../context/StoryTrackingContext';
import config from '../../config/config';
import { supabase } from '../../lib/supabase';

interface StoryTrackingTabContextProps {
  keyword: string;
}

const StoryTrackingTabContext: React.FC<StoryTrackingTabContextProps> = ({ keyword }) => {
  const { trackedStories, addArticlesToStory } = useStoryTracking();
  const [isSubscribed, setIsSubscribed] = useState(false);
  
  // Debug: Log component mount and props
  console.log('StoryTrackingTabContext mounted with keyword:', keyword);
  console.log('Available tracked stories:', trackedStories);
  
  // find the story object for this keyword
  const story = trackedStories.find(s => s.keyword === keyword);
  console.log('Found story for keyword:', story); // Debug: Log found story

  // Set up Supabase real-time subscription for tracked story articles
  useEffect(() => {
    if (!story) {
      console.log('No story found for keyword, skipping subscription setup');
      return;
    }
    
    console.log('Setting up real-time subscription for story:', story.id);
    
    // Cache to track already seen article URLs
    const seenArticleIds = new Set<string>(story.articles.map(article => article.id));

    // Subscribe to tracked_story_articles table for this story
    const subscription = supabase
      .channel(`story_updates_${story.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'tracked_story_articles',
          filter: `tracked_story_id=eq.${story.id}`
        },
        async (payload) => {
          console.log('Received new article for story:', payload);
          
          try {
            // Extract the news_id from the payload
            const newsId = payload.new.news_id;
            
            // Skip if we've already seen this article
            if (seenArticleIds.has(newsId)) {
              console.log('Already have this article, skipping:', newsId);
              return;
            }
            
            // Add to seen set
            seenArticleIds.add(newsId);
            
            // Fetch the full article details from the news_articles table
            const { data: articleData, error } = await supabase
              .from('news_articles')
              .select('*')
              .eq('id', newsId)
              .single();
            
            if (error) {
              console.error('Error fetching article details:', error);
              return;
            }
            
            if (!articleData) {
              console.warn('No article found with ID:', newsId);
              return;
            }
            
            console.log('Received new article:', articleData.title);
            
            // Format the article for display
            const formattedArticle = {
              id: articleData.id,
              title: articleData.title || 'Untitled',
              source: articleData.source || 'Unknown Source',
              publishedAt: articleData.published_at || new Date().toISOString(),
              url: articleData.url || '#'
            };
            
            // Add the article to the story
            addArticlesToStory(story.id, [formattedArticle]);
          } catch (error) {
            console.error('Error processing article update:', error);
          }
        }
      )
      .subscribe((status) => {
        console.log('Subscription status:', status);
        setIsSubscribed(status === 'SUBSCRIBED');
      });

    // Cleanup: unsubscribe when component unmounts or story changes
    return () => {
      console.log('Cleaning up subscription for story:', story.id);
      subscription.unsubscribe();
    };
  }, [story?.id, addArticlesToStory]); // Only re-subscribe when story ID changes

  // Display an initial loading fallback if subscription isn't ready yet
  if (!isSubscribed && story && story.articles.length === 0) {
    return (
      <div className="p-4 text-center">
        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-400">Connecting to real-time updates...</p>
      </div>
    );
  }

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
    <div className="max-h-[60vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
      {sortedArticles.length === 0 ? (
        <div className="text-center py-6">
          <p className="text-gray-400">No articles found yet for this topic.</p>
          <p className="text-gray-500 text-sm mt-2">Articles will appear here automatically as they become available.</p>
        </div>
      ) : (
        sortedArticles.map(article => (
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
        ))
      )}
    </div>
  );
};

export default StoryTrackingTabContext;