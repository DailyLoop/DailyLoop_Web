// src/context/PollingContext.tsx

import React, { createContext, useState, useContext } from 'react';

interface PollingState {
  activePolls: Record<string, number>; // Maps keywords to last poll timestamps
}

interface PollingContextValue {
  canPoll: (keyword: string, minInterval: number) => boolean;
  registerPoll: (keyword: string) => void;
}

const PollingContext = createContext<PollingContextValue | undefined>(undefined);

export const PollingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [pollingState, setPollingState] = useState<PollingState>({
    activePolls: {}
  });

  /**
   * Check if polling is allowed for a specific keyword
   * @param keyword The keyword to check
   * @param minInterval Minimum time in ms between polls
   * @returns boolean indicating if polling is allowed
   */
  const canPoll = (keyword: string, minInterval: number): boolean => {
    const lastPollTime = pollingState.activePolls[keyword] || 0;
    const now = Date.now();
    return now - lastPollTime >= minInterval;
  };

  /**
   * Register a poll for a specific keyword
   * @param keyword The keyword being polled
   */
  const registerPoll = (keyword: string): void => {
    setPollingState(prev => ({
      ...prev,
      activePolls: {
        ...prev.activePolls,
        [keyword]: Date.now()
      }
    }));
  };

  return (
    <PollingContext.Provider value={{
      canPoll,
      registerPoll
    }}>
      {children}
    </PollingContext.Provider>
  );
};

/**
 * Hook to access the Polling context
 */
export const usePolling = () => {
  const context = useContext(PollingContext);
  if (!context) {
    throw new Error('usePolling must be used within a PollingProvider');
  }
  return context;
};