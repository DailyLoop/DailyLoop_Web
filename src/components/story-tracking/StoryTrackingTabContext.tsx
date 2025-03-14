// src/components/story-tracking/StoryTrackingTabContext.tsx

import React, { useEffect } from 'react';
import { useStoryTracking } from '../../context/StoryTrackingContext';
import { usePolling } from '../../context/PollingContext';
import config from '../../config/config';
import { supabase } from '../../lib/supabase';

interface StoryTrackingTabContextProps {
  keyword: string;
}

const StoryTrackingTabContext: React.FC<StoryTrackingTabContextProps> = ({ keyword }) => {
  const { trackedStories, addArticlesToStory } = useStoryTracking();
  const { canPoll, registerPoll } = usePolling();
  
  // Debug: Log component mount and props
  console.log('StoryTrackingTabContext mounted with keyword:', keyword);
  console.log('Available tracked stories:', trackedStories);
  
  // find the story object for this keyword
  const story = trackedStories.find(s => s.keyword === keyword);
  console.log('Found story for keyword:', story); // Debug: Log found story

  // Poll the backend for new articles
  useEffect(() => {
    console.log('Setting up polling for keyword:', keyword); // Debug: Log polling setup
    
    // We'll use the global polling state instead of local lastPollTime
    const POLL_INTERVAL = 30000 //180000; // 3 minutes in milliseconds
    // Cache to track already seen article URLs
    const seenArticleUrls = new Set<string>();
    
    const pollForArticles = async () => {
      // Use global polling state to check if we can poll
      if (!canPoll(keyword, POLL_INTERVAL)) {
        console.log('Skipping poll - too soon since last poll for keyword:', keyword);
        return;
      }
      
      // Register this poll in the global state
      registerPoll(keyword);

      //////////////////////////////////////////
      // FOR TESTING ONLY: Inject a fake article
      // const testArticle = {
      //   id: `test-${Date.now()}`,
      //   title: `New Article about ${keyword} - ${new Date().toLocaleTimeString()}`,
      //   summary: `This is a test article about ${keyword} generated at ${new Date().toLocaleTimeString()}`,
      //   content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. This article was generated for testing the polling mechanism.`,
      //   source: 'Test News',
      //   author: 'Test Author',
      //   publishedAt: new Date().toISOString(),
      //   url: `https://example.com/test/${Date.now()}`,
      //   image: 'https://placehold.co/600x400?text=Test+Article',
      // };
      
      // // If we have a story, add our test article to it
      // if (story) {
      //   console.log('Adding test article to story:', testArticle.title);
      //   addArticlesToStory(story.id, [testArticle]);
      // }
      
      // select random words from an array to simulate a keyword
      const randomWords = ['apple', 'banana', 'cherry', 'date', 'elderberry', 'fig', 'grape'];
      const randomKeyword = randomWords[Math.floor(Math.random() * randomWords.length)];
      // add random keyword to the keyword
      console.log('Random keyword:', randomKeyword);
      // const encodedKeyword = encodeURIComponent(`${keyword} ${randomKeyword}`).replace(/%20/g, '+');
      const encodedKeyword = encodeURIComponent(`${randomKeyword}`).replace(/%20/g, '+');

      //////////////////////////////////////////

      try {
        console.log('Polling for new articles...'); // Debug: Log polling attempt
        // const encodedKeyword = encodeURIComponent(keyword).replace(/%20/g, '+');
        const apiUrl = `${config.api.baseUrl}${config.api.endpoints.storyTracking}?keyword=${encodedKeyword}`;
        console.log('Making API call to:', apiUrl); // Log the full URL being called
        
        // Get the authentication token from Supabase
        const { data: sessionData } = await supabase.auth.getSession();
        const token = sessionData.session?.access_token;
        
        // Add a timeout to the fetch request
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
        
        const response = await fetch(
          apiUrl,
          { 
            signal: controller.signal,
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'Authorization': token ? `Bearer ${token}` : ''
            }
          }
        ).finally(() => clearTimeout(timeoutId));
        
        console.log('API response status:', response.status);
        
        if (!response.ok) {
          console.error(`HTTP error! status: ${response.status}`);
          // Add a placeholder article to show something instead of endless loading
          if (story && story.articles.length === 0) {
            addArticlesToStory(story.id, [{
              id: `error-${Date.now()}`,
              title: `Unable to fetch articles (Status: ${response.status})`,
              source: 'System Message',
              publishedAt: new Date().toISOString(),
              url: '#'
            }]);
          }
          return;
        }
        const data = await response.json();
        
        if (data?.articles && Array.isArray(data.articles)) {
          // Filter out articles we've already seen
          const newArticles = data.articles.filter((article: any) => 
            article?.url && !seenArticleUrls.has(article.url)
          );
          
          console.log(`Received ${data.articles.length} articles, ${newArticles.length} are new`);
          
          if (newArticles.length === 0) {
            console.log('No new articles to process');
            return;
          }
          
          // Add new URLs to seen set
          newArticles.forEach((article: any) => {
            if (article?.url) seenArticleUrls.add(article.url);
          });
          
          const formattedArticles = newArticles.map((article: any) => {
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
          
          if (formattedArticles.length > 0 && story) {
            addArticlesToStory(story.id, formattedArticles);
          } else if (formattedArticles.length > 0) {
            console.warn('Found articles but no story to add them to');
          } else {
            console.log('No valid articles found in the filtered response');
          }
        } else {
          console.error('Invalid response format:', data);
        }
      } catch (error) {
        console.error('Error polling new articles:', error);
        // Error handling is now managed by the PollingContext
        // The next poll will happen according to the interval
      }
    };

    // Call immediately to avoid initial delay
    pollForArticles();
    
    // Then set up interval for subsequent polls - changed back to 3 minutes
    const intervalId = setInterval(pollForArticles, POLL_INTERVAL); // Changed from 6 minutes (360000) to 3 minutes (180000)

    return () => {
      console.log('Cleaning up polling for keyword:', keyword); // Debug: Log cleanup
      clearInterval(intervalId);
    };
  }, [keyword, addArticlesToStory, canPoll, registerPoll, story]);

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