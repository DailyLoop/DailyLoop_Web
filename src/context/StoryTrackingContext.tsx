// src/context/StoryTrackingContext.tsx

import React, { createContext, useState, useContext } from 'react';

/**
 * Article interface
 * Customize fields to match your actual article shape
 */
interface Article {
  id: string;
  title: string;
  source: string;
  publishedAt: string;  // or Date
  url: string;
  // add other fields like "summary", "image", etc. if needed
}

/**
 * Each tracked story is tied to a specific keyword
 */
interface TrackedStory {
  keyword: string;
  articles: Article[];
}

/**
 * Context shape for story tracking
 */
interface StoryTrackingContextValue {
  trackedStories: TrackedStory[];
  startTracking: (keyword: string) => void;
  stopTracking: (keyword: string) => void;
  addArticlesToStory: (keyword: string, newArticles: Article[]) => void;
}

const StoryTrackingContext = createContext<StoryTrackingContextValue | undefined>(undefined);

export const StoryTrackingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [trackedStories, setTrackedStories] = useState<TrackedStory[]>([]);

  /**
   * Start tracking a new keyword/topic if not already tracked
   */
  const startTracking = (keyword: string) => {
    setTrackedStories(prev => {
      // if the keyword is already tracked, do nothing
      if (prev.some(story => story.keyword === keyword)) {
        return prev;
      }
      // otherwise add a new empty story
      return [...prev, { keyword, articles: [] }];
    });
  };

  /**
   * Stop tracking a keyword/topic
   */
  const stopTracking = (keyword: string) => {
    setTrackedStories(prev => prev.filter(story => story.keyword !== keyword));
  };

  /**
   * Merge newly fetched articles into an existing story, removing duplicates
   */
  const addArticlesToStory = (keyword: string, newArticles: Article[]) => {
    setTrackedStories(prev =>
      prev.map(story => {
        if (story.keyword === keyword) {
          const combined = [...story.articles, ...newArticles];
          // remove duplicates by ID
          const uniqueById = Array.from(new Set(combined.map(a => a.id)))
                                 .map(id => combined.find(a => a.id === id)!);
          return { ...story, articles: uniqueById };
        }
        return story;
      })
    );
  };

  return (
    <StoryTrackingContext.Provider value={{
      trackedStories,
      startTracking,
      stopTracking,
      addArticlesToStory
    }}>
      {children}
    </StoryTrackingContext.Provider>
  );
};

/**
 * Hook to access the StoryTracking context
 */
export const useStoryTracking = () => {
  const context = useContext(StoryTrackingContext);
  if (!context) {
    throw new Error('useStoryTracking must be used within a StoryTrackingProvider');
  }
  return context;
};