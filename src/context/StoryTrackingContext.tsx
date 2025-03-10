// src/context/StoryTrackingContext.tsx

import React, { createContext, useState, useContext, useEffect } from 'react';
import { storyTrackingService, TrackedStory, Article } from '../services/storyTrackingService';
import { useAuth } from './AuthContext';

/**
 * Context shape for story tracking
 */
interface StoryTrackingContextValue {
  trackedStories: TrackedStory[];
  startTracking: (keyword: string, sourceArticleId?: string) => Promise<void>;
  stopTracking: (storyId: string) => Promise<void>;
  togglePolling: (storyId: string, enable: boolean) => Promise<void>;
  addArticlesToStory: (storyId: string, newArticles: Article[]) => void;
  loading: boolean;
  error: string | null;
}

const StoryTrackingContext = createContext<StoryTrackingContextValue | undefined>(undefined);

export const StoryTrackingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [trackedStories, setTrackedStories] = useState<TrackedStory[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Fetch tracked stories when the component mounts and when user changes
  useEffect(() => {
    if (user) {
      fetchTrackedStories();
    } else {
      // Clear stories when user logs out
      setTrackedStories([]);
    }
  }, [user]);

  /**
   * Fetch all tracked stories from the backend
   */
  const fetchTrackedStories = async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const stories = await storyTrackingService.getTrackedStories();
      setTrackedStories(stories);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tracked stories');
      console.error('Error fetching tracked stories:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Start tracking a new keyword/topic
   */
  const startTracking = async (keyword: string, sourceArticleId?: string) => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Check if already tracking this keyword
      const existingStory = trackedStories.find(story => story.keyword === keyword);
      if (existingStory) {
        console.log('Already tracking this keyword:', keyword);
        return;
      }
      
      // Create a new tracked story in the backend
      const newStory = await storyTrackingService.createTrackedStory(keyword, sourceArticleId);
      
      // Update local state
      setTrackedStories(prev => [...prev, newStory]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start tracking');
      console.error('Error starting tracking:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Stop tracking a story by ID
   */
  const stopTracking = async (storyId: string) => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Delete the tracked story from the backend
      await storyTrackingService.deleteTrackedStory(storyId);
      
      // Update local state
      setTrackedStories(prev => prev.filter(story => story.id !== storyId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to stop tracking');
      console.error('Error stopping tracking:', err);
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * Toggle polling status for a story
   */
  const togglePolling = async (storyId: string, enable: boolean) => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      if (enable) {
        await storyTrackingService.startPolling(storyId);
      } else {
        await storyTrackingService.stopPolling(storyId);
      }
      
      // Update the story in local state
      setTrackedStories(prev => 
        prev.map(story => 
          story.id === storyId 
            ? { 
                ...story, 
                is_polling: enable,
                last_polled_at: enable ? new Date().toISOString() : story.last_polled_at
              } 
            : story
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to ${enable ? 'start' : 'stop'} polling`);
      console.error(`Error ${enable ? 'starting' : 'stopping'} polling:`, err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Merge newly fetched articles into an existing story, removing duplicates
   */
  const addArticlesToStory = (storyId: string, newArticles: Article[]) => {
    setTrackedStories(prev =>
      prev.map(story => {
        if (story.id === storyId) {
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
      togglePolling,
      addArticlesToStory,
      loading,
      error
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