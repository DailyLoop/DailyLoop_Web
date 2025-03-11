// src/pages/StoryTrackingPage.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import StoryTrackingTabContext from '../components/story-tracking/StoryTrackingTabContext';
import AppHeader from '../components/layout/AppHeader';
import { useStoryTracking } from '../context/StoryTrackingContext';
import LoadingState from '../components/common/LoadingState';
import { Play, Pause, RefreshCw, AlertCircle } from 'lucide-react';

const StoryTrackingPage: React.FC = () => {
  const { keyword } = useParams<{ keyword: string }>();
  const navigate = useNavigate();
  const { startTracking, stopTracking, togglePolling, trackedStories } = useStoryTracking();
  const [isLoading, setIsLoading] = useState(true);
  const [loadingTimeout, setLoadingTimeout] = useState(false);
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Find the story for this keyword
  const currentStory = keyword ? trackedStories.find(s => s.keyword === keyword) : null;
  const isPolling = currentStory?.is_polling || false;

  // Toggle polling via context
  const handleTogglePolling = async () => {
    if (!currentStory) return;
    
    setTrackingLoading(true);
    try {
      await togglePolling(currentStory.id, !isPolling);
      setStatusMessage(isPolling ? "Automatic updates paused" : "Automatic updates enabled");
    } catch (error) {
      console.error('Error toggling polling:', error);
      setStatusMessage("Failed to change update status");
    } finally {
      setTrackingLoading(false);
      
      // Clear status message after a delay
      setTimeout(() => {
        setStatusMessage(null);
      }, 3000);
    }
  };

  // Start tracking this keyword when the component mounts
  useEffect(() => {
    if (keyword) {
      console.log('Starting to track keyword:', keyword);
      
      // Set up error timeout
      const timeoutId = setTimeout(() => {
        setLoadingTimeout(true);
      }, 15000);
      
      // Start tracking and update state
      const setupTracking = async () => {
        try {
          await startTracking(keyword);
        } catch (error) {
          console.error('Error starting tracking:', error);
        }
      };
      
      setupTracking();
      
      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [keyword]);
  
  // Update loading state when articles are available
  useEffect(() => {
    if (currentStory) {
      setIsLoading(false);
    }
  }, [currentStory]);

  // Handle removing this tracked story
  const handleRemoveTracking = async () => {
    if (!currentStory) return;
    
    setTrackingLoading(true);
    try {
      await stopTracking(currentStory.id); // Fixed: Using story ID instead of keyword
      navigate('/app');
    } catch (error) {
      console.error('Error removing tracked story:', error);
    } finally {
      setTrackingLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-primary">
      <AppHeader
        onLogoClick={() => navigate('/app')}
        mode="app"
        onSearch={() => {}}
      />
      <div className="container mx-auto p-4">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">Story Tracking: {keyword}</h1>
            <p className="text-gray-400">Following news and updates about this topic</p>
            {currentStory && currentStory.last_polled_at && (
              <p className="text-xs text-gray-500 mt-1">
                Last updated: {new Date(currentStory.last_polled_at).toLocaleString()}
              </p>
            )}
          </div>
          <div className="flex items-center space-x-3">
            {/* Toggle Polling Button */}
            <button
              onClick={handleTogglePolling}
              disabled={trackingLoading || !currentStory}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors duration-300 ${
                isPolling 
                  ? "bg-blue-500/20 hover:bg-blue-500/30 text-blue-400" 
                  : "bg-gray-700/50 hover:bg-gray-700/70 text-gray-300"
              }`}
              title={isPolling ? "Disable automatic updates" : "Enable automatic updates"}
            >
              {isPolling ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Auto-updating</span>
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" />
                  <span>Auto-update</span>
                </>
              )}
            </button>
            
            {/* Remove tracking button */}
            <button
              onClick={handleRemoveTracking}
              disabled={trackingLoading}
              className="text-red-400 hover:text-red-300"
              title="Stop tracking this topic"
            >
              Remove
            </button>
          </div>
        </div>

        {/* Status message */}
        {statusMessage && (
          <div className="mb-4 p-2 bg-blue-500/10 border border-blue-500/30 rounded text-blue-400 text-sm flex items-center">
            <AlertCircle className="h-4 w-4 mr-2" />
            {statusMessage}
          </div>
        )}

        {!keyword ? (
          <div className="text-white p-4 bg-gray-800 rounded-lg">No keyword selected.</div>
        ) : currentStory ? (
          <StoryTrackingTabContext keyword={keyword} />
        ) : (
          <div className="p-8 text-center">
            <LoadingState type="spinner" />
            <p className="text-gray-400 mt-4">Fetching articles about "{keyword}"...</p>
            <p className="text-gray-500 text-sm mt-2">This may take a moment as we gather the latest news</p>
            
            {loadingTimeout && (
              <div className="mt-6 p-4 bg-gray-800 rounded-lg">
                <p className="text-yellow-400">It's taking longer than expected to load articles.</p>
                <p className="text-gray-400 mt-2">This could be due to:</p>
                <ul className="list-disc list-inside text-gray-400 mt-2">
                  <li>High server load</li>
                  <li>Network connectivity issues</li>
                  <li>The API endpoint may be unavailable</li>
                </ul>
                <p className="text-gray-400 mt-2">You can continue waiting or try again later.</p>
                <button 
                  onClick={() => navigate('/app')} 
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  Return to Home
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StoryTrackingPage;