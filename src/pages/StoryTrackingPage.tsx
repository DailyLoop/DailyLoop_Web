// src/pages/StoryTrackingPage.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import StoryTrackingTabContext from '../components/story-tracking/StoryTrackingTabContext';
import AppHeader from '../components/layout/AppHeader';
import { useStoryTracking } from '../context/StoryTrackingContext';
import LoadingState from '../components/common/LoadingState';
import { Play, Pause } from 'lucide-react'; // Import Play and Pause icons

const StoryTrackingPage: React.FC = () => {
  const { keyword } = useParams<{ keyword: string }>();
  const navigate = useNavigate();
  const { startTracking, stopTracking, trackedStories } = useStoryTracking();
  const [isLoading, setIsLoading] = useState(true);
  const [loadingTimeout, setLoadingTimeout] = useState(false);
  const [isTracking, setIsTracking] = useState(false); // State to manage tracking status
  const [trackingLoading, setTrackingLoading] = useState(false); // State to manage loading status

  // Handle play/pause button click
  const handleTrackClick = async () => {
    if (!keyword) return; // Ensure keyword is defined
    setTrackingLoading(true);
    try {
      if (isTracking) {
        await stopTracking(keyword);  // ❌ Same issue - passing keyword instead of ID
        setIsTracking(false);
      } else {
        await startTracking(keyword);
        setIsTracking(true);
      }
    } catch (error) {
      console.error('Error with story tracking:', error);
    } finally {
      setTrackingLoading(false);
    }
  };

  // Start tracking this keyword when the component mounts
  useEffect(() => {
    if (keyword) {
      console.log('Starting to track keyword:', keyword);
      
      // Start tracking and update state
      startTracking(keyword);
      setIsTracking(true);
      
      // Set a timeout to show a message if articles don't load within 15 seconds
      const timeoutId = setTimeout(() => {
        setLoadingTimeout(true);
      }, 15000);
      
      return () => {
        clearTimeout(timeoutId);
        // We intentionally don't stop tracking on unmount to maintain article history
        // If needed, uncomment below:
        // stopTracking(keyword);
        // setIsTracking(false);
      };
    }
  }, [keyword]); // Remove startTracking from dependencies
  
  // Update loading state when articles are available
  useEffect(() => {
    if (keyword && trackedStories.length > 0) {
      const story = trackedStories.find(s => s.keyword === keyword);
      if (story && story.articles.length > 0) {
        setIsLoading(false);
      }
    }
  }, [keyword, trackedStories]);

  // Find the story for this keyword
  const currentStory = keyword ? trackedStories.find(s => s.keyword === keyword) : null;

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
          </div>
          <button
            onClick={handleTrackClick}
            disabled={trackingLoading}
            className="transition-colors duration-300"
          >
            {isTracking ? <Pause className="h-6 w-6 text-blue-500" /> : <Play className="h-6 w-6 text-gray-400" />}
            {trackingLoading && <span className="ml-1 text-xs text-gray-400">...</span>}
          </button>
        </div>

        {!keyword ? (
          <div className="text-white p-4 bg-gray-800 rounded-lg">No keyword selected.</div>
        ) : currentStory && currentStory.articles.length > 0 ? (
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