import { supabase } from '../lib/supabase';
import config from '../config/config';

/**
 * Article interface
 */
export interface Article {
  id: string;
  title: string;
  source: string;
  publishedAt: string;
  url: string;
}

/**
 * Tracked Story interface
 */
export interface TrackedStory {
  id: string;
  user_id: string;
  keyword: string;
  created_at: string;
  last_updated: string;
  is_polling: boolean;
  last_polled_at: string | null;
  articles: Article[];
}

/**
 * Service for interacting with the story tracking API
 */
export const storyTrackingService = {
  /**
   * Create a new tracked story
   */
  createTrackedStory: async (keyword: string, sourceArticleId?: string): Promise<TrackedStory> => {
    // Get the session first, then use the token
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    
    const response = await fetch(`${config.api.baseUrl}${config.api.endpoints.storyTracking}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
      },
      body: JSON.stringify({ keyword, sourceArticleId })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create tracked story');
    }

    const responseData = await response.json();
    return responseData.data;
  },

  /**
   * Get all tracked stories for the current user
   */
  getTrackedStories: async (): Promise<TrackedStory[]> => {
    // Get the session first, then use the token
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    
    const response = await fetch(`${config.api.baseUrl}${config.api.endpoints.storyTracking}/user`, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch tracked stories');
    }

    const responseData = await response.json();
    return responseData.data;
  },

  /**
   * Get a specific tracked story by ID
   */
  getTrackedStory: async (id: string): Promise<TrackedStory> => {
    // Get the session first, then use the token
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    
    const response = await fetch(`${config.api.baseUrl}${config.api.endpoints.storyTracking}/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch tracked story');
    }

    const responseData = await response.json();
    return responseData.data;
  },

  /**
   * Delete a tracked story
   */
  deleteTrackedStory: async (id: string): Promise<void> => {
    // Get the session first, then use the token
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    
    const response = await fetch(`${config.api.baseUrl}${config.api.endpoints.storyTracking}/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to delete tracked story');
    }
  },

  /**
   * Start polling for a tracked story
   */
  startPolling: async (storyId: string): Promise<void> => {
    // Get the session first, then use the token
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    
    const response = await fetch(`${config.api.baseUrl}${config.api.endpoints.storyTracking}/start`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
      },
      body: JSON.stringify({ story_id: storyId })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to start polling');
    }
  },

  /**
   * Stop polling for a tracked story
   */
  stopPolling: async (storyId: string): Promise<void> => {
    // Get the session first, then use the token
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    
    const response = await fetch(`${config.api.baseUrl}${config.api.endpoints.storyTracking}/stop`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
      },
      body: JSON.stringify({ story_id: storyId })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to stop polling');
    }
  }
};