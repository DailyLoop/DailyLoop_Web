// src/components/story-tracking/StoryTrackingTabs.tsx

import React, { useState } from 'react';
import { useStoryTracking } from '../../context/StoryTrackingContext';
import StoryTrackingTabContext from './StoryTrackingTabContext';

const StoryTrackingTabs: React.FC = () => {
  const { trackedStories, stopTracking } = useStoryTracking();
  const [activeKeyword, setActiveKeyword] = useState<string | null>(null);

  // Debug: Log tracked stories and active keyword
  console.log('Tracked Stories:', trackedStories);
  console.log('Active Keyword:', activeKeyword);

  // If no tracked stories, hide the tab bar
  if (trackedStories.length === 0) return null;

  return (
    <div className="bg-transparent border-b border-gray-700 px-3 py-2">
      {/* Tab headers */}
      <div className="flex space-x-2">
        {trackedStories.map(story => {
          console.log('Rendering tab for keyword:', story.keyword); // Debug: Log each story being rendered
          return (
            <div
              key={story.keyword}
              onClick={() => {
                console.log('Tab clicked:', story.keyword); // Debug: Log tab clicks
                setActiveKeyword(story.keyword);
              }}
              className={`px-3 py-1 rounded cursor-pointer
                ${activeKeyword === story.keyword ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'}
              `}
            >
              {story.keyword}
              {/* Stop tracking (close tab) button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  console.log('Stop tracking clicked for:', story.keyword); // Debug: Log stop tracking clicks
                  stopTracking(story.keyword);
                  if (activeKeyword === story.keyword) {
                    setActiveKeyword(null);
                  }
                }}
                className="ml-2 text-red-300 hover:text-red-500"
              >
                &times;
              </button>
            </div>
          );
        })}
      </div>

      {/* Active tab content */}
      {activeKeyword && (
        <div className="mt-4">
          <StoryTrackingTabContext keyword={activeKeyword} />
        </div>
      )}
    </div>
  );
};

export default StoryTrackingTabs;