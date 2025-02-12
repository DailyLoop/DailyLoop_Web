import React from 'react';

interface LoadingStateProps {
  type: 'cards' | 'article' | 'spinner';
  count?: number;
}

const LoadingState: React.FC<LoadingStateProps> = ({ type, count = 1 }) => {
  if (type === 'spinner') {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (type === 'cards') {
    return (
      <>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="bg-gray-800 rounded-xl overflow-hidden animate-pulse">
            <div className="h-32 bg-gray-700" />
            <div className="p-4 space-y-3">
              <div className="h-4 bg-gray-700 rounded w-3/4" />
              <div className="h-4 bg-gray-700 rounded w-1/2" />
            </div>
          </div>
        ))}
      </>
    );
  }

  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-64 bg-gray-800 rounded-xl" />
      <div className="space-y-3">
        <div className="h-6 bg-gray-800 rounded w-3/4" />
        <div className="h-6 bg-gray-800 rounded w-1/2" />
      </div>
    </div>
  );
};

export default LoadingState;