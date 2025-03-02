// src/components/story-tracking/StoryTrackingTabs.tsx

import React from 'react';
import { useStoryTracking } from '../../context/StoryTrackingContext';
import { useNavigate } from 'react-router-dom';

const StoryTrackingTabs: React.FC = () => {
  const { trackedStories, stopTracking } = useStoryTracking();
  const navigate = useNavigate();

  // If no tracked stories, hide the tab bar
  if (trackedStories.length === 0) return null;

  return (
    <div className="bg-transparent border-b border-gray-700 px-3 py-2">
      {/* Tab headers */}
      <div className="flex space-x-2">
        {trackedStories.map(story => (
          <div
            key={story.id}
            onClick={() => {
              // Navigate to the story tracking page for the selected keyword
              navigate(`/story-tracking/${encodeURIComponent(story.keyword)}`);
            }}
            className="px-3 py-1 rounded cursor-pointer bg-gray-700 text-gray-300 hover:bg-blue-600 hover:text-white transition-colors duration-200"
          >
            {story.keyword}
            {/* Stop tracking (close tab) button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                stopTracking(story.id);
              }}
              className="ml-2 text-red-300 hover:text-red-500"
            >
              &times;
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StoryTrackingTabs;