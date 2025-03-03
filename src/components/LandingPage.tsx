import React, { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";
import { Waves } from "./ui/waves-background";
import AppHeader from "./layout/AppHeader";
import StoryTrackingTabs from "./story-tracking/StoryTrackingTabs";
import { useAuth } from "../context/AuthContext";

const loadingMessages = [
  "Loading... Because good things take time (and bad code takes longer).",
  "Hang tight! We're making it look like we're working hard.",
  "Loading... If only real life had progress bars.",
  "Fetching data... or maybe just grabbing a coffee.",
  "Initializing magic... and hoping for no errors.",
  "Loading… 99% done. Just kidding, we have no idea.",
  "Patience is a virtue... and also required here.",
  "Processing request… This is where we pretend to be busy.",
  "Powering up... Like a slow laptop on a Monday.",
  "Loading assets… because we don't believe in minimalism.",
  "Crunching numbers… or just randomly guessing.",
  "Warming up the engines… and your expectations.",
  "Getting things ready… but honestly, we're stalling.",
  "Connecting to the matrix… Please don't pick the red pill.",
  "Loading at the speed of light… If light had traffic jams.",
  "Finalizing setup... AKA, thinking about lunch.",
  "BRB, making things awesome… or at least functional.",
  "Unleashing the magic… or debugging the chaos.",
  "Hold on tight! We're working on it... probably.",
  "Syncing data… and regretting not backing up first."
];

interface LandingPageProps {
  onSearch: (query: string) => Promise<void>;
}

const logStyles = {
  lifecycle: 'color: #8e44ad; font-weight: bold;',
  state: 'color: #2980b9; font-weight: bold;',
  event: 'color: #16a085; font-weight: bold;',
  performance: 'color: #e67e22; font-weight: bold;',
  render: 'color: #7f8c8d; font-style: italic;',
  separator: '='.repeat(50)
};

const LandingPage: React.FC<LandingPageProps> = ({ onSearch }) => {
  const { user, loading, initialized } = useAuth();

  console.group('%c[LandingPage] 🚀 Component Initialization', logStyles.lifecycle);
  console.log('%c[LandingPage] Props received:', logStyles.lifecycle, { onSearch: !!onSearch ? 'function provided' : 'missing!' });

  const [query, setQuery] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  
  const componentMountedAt = useRef(Date.now());
  const renderCount = useRef(0);
  
  console.log('%c[LandingPage] Initial state:', logStyles.state, {
    query,
    isSubmitting,
    isVisible,
    isInputFocused,
    isLoading,
    currentMessageIndex,
    user: user ? `User logged in (id: ${user.id})` : 'No user',
    loading,
    initialized
  });
  console.groupEnd();

  useEffect(() => {
    renderCount.current++;
    const mountTime = Date.now() - componentMountedAt.current;
    console.log(`%c${logStyles.separator}`, logStyles.lifecycle);
    console.log(`%c[LandingPage] 🟢 Component MOUNTED (render #${renderCount.current}, mounted in ${mountTime}ms)`, logStyles.lifecycle);
    
    return () => {
      const lifespanMs = Date.now() - componentMountedAt.current;
      console.log(`%c[LandingPage] 🔴 Component UNMOUNTING (lifespan: ${(lifespanMs / 1000).toFixed(2)}s)`, logStyles.lifecycle);
      console.log(`%c${logStyles.separator}`, logStyles.lifecycle);
    };
  }, []);

  useEffect(() => {
    console.log('%c[LandingPage] Starting visibility timer effect', logStyles.lifecycle);
    const timer = setTimeout(() => {
      console.log('%c[LandingPage] Setting isVisible to true after timer', logStyles.state);
      setIsVisible(true);
    }, 100);
    
    return () => {
      console.log('%c[LandingPage] Clearing visibility timer', logStyles.lifecycle);
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    console.group('%c[LandingPage] Loading message effect triggered', logStyles.lifecycle);
    console.log('%c[LandingPage] isLoading:', logStyles.state, isLoading);
    
    let interval: NodeJS.Timeout;
    if (isLoading) {
      console.log('%c[LandingPage] Setting up loading message interval', logStyles.lifecycle);
      interval = setInterval(() => {
        setCurrentMessageIndex((prevIndex) => {
          const nextIndex = prevIndex === loadingMessages.length - 1 ? 0 : prevIndex + 1;
          console.log('%c[LandingPage] Rotating loading message:', logStyles.state, 
            `${prevIndex} → ${nextIndex} ("${loadingMessages[nextIndex].substring(0, 20)}...")`);
          return nextIndex;
        });
      }, 3000);
    }
    
    return () => {
      if (interval) {
        console.log('%c[LandingPage] Clearing loading message interval', logStyles.lifecycle);
        clearInterval(interval);
      }
    };
    console.groupEnd();
  }, [isLoading]);

  const trackQueryChange = (newValue: string) => {
    console.log('%c[LandingPage] Query changing:', logStyles.state, `"${query}" → "${newValue}"`);
    setQuery(newValue);
  };

  const trackSubmissionState = (newValue: boolean) => {
    console.log('%c[LandingPage] isSubmitting changing:', logStyles.state, `${isSubmitting} → ${newValue}`);
    setIsSubmitting(newValue);
  };
  
  const trackLoadingState = (newValue: boolean) => {
    console.log('%c[LandingPage] isLoading changing:', logStyles.state, `${isLoading} → ${newValue}`);
    setIsLoading(newValue);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    console.group('%c[LandingPage] 🔄 handleSubmit called', logStyles.event);
    console.log('%c[LandingPage] Form submitted with query:', logStyles.event, query);
    e.preventDefault();
    
    if (!query.trim()) {
      console.warn('%c[LandingPage] Empty query submitted - adding shake animation', logStyles.event);
      const form = e.currentTarget as HTMLFormElement;
      form.classList.add("shake");
      setTimeout(() => form.classList.remove("shake"), 500);
      console.groupEnd();
      return;
    }
    
    try {
      trackSubmissionState(true);
      trackLoadingState(true);
      
      console.time('%c[LandingPage] Search operation duration', logStyles.performance);
      console.log('%c[LandingPage] Calling onSearch with query:', logStyles.event, query);
      
      await onSearch(query);
      console.timeEnd('%c[LandingPage] Search operation duration', logStyles.performance);
      
      console.log('%c[LandingPage] onSearch completed successfully', logStyles.event);
    } catch (error) {
      console.error('%c[LandingPage] Search error:', logStyles.event, error);
      trackSubmissionState(false);
      trackLoadingState(false);
      trackQueryChange("");
    }
    console.groupEnd();
  };

  const handleLogoClick = () => {
    console.group('%c[LandingPage] 🖱️ handleLogoClick called', logStyles.event);
    console.log('%c[LandingPage] Resetting component state', logStyles.event);
    trackQueryChange("");
    trackLoadingState(false);
    trackSubmissionState(false);
    console.groupEnd();
  };

  const handleInputFocus = (focused: boolean) => {
    console.log('%c[LandingPage] Input focus changing:', logStyles.event, `${isInputFocused} → ${focused}`);
    setIsInputFocused(focused);
  };

  // App.tsx handles the initial loading guard, but we can log here for clarity
  if (!initialized) {
    console.log('%c[LandingPage] Auth not initialized, skipping render', logStyles.render);
    return null;
  }

  console.group('%c[LandingPage] 🎨 Render Phase', logStyles.render);
  console.log('%c[LandingPage] Rendering with states:', logStyles.render);
  if (user) {
    console.log('%c[LandingPage] Rendering with authenticated user UI', logStyles.render);
  } else {
    console.log('%c[LandingPage] Rendering anonymous user UI', logStyles.render);
  }
  if (isLoading) {
    console.log('%c[LandingPage] Showing loading overlay', logStyles.render);
  }
  console.groupEnd();

  return (
    <div className="min-h-screen bg-primary overflow-hidden relative">
      <AppHeader onLogoClick={handleLogoClick} mode={user ? "app" : "landing"} />
      <Waves
        lineColor="rgba(255, 255, 255, 0.1)"
        backgroundColor="transparent"
        waveSpeedX={0.02}
        waveSpeedY={0.01}
        waveAmpX={40}
        waveAmpY={20}
        friction={0.9}
        tension={0.01}
        maxCursorMove={120}
        xGap={12}
        yGap={36}
        className="z-0"
      />
      <div className="relative z-10">
        {user && <StoryTrackingTabs />}
      </div>
      <div className="flex items-center justify-center px-4 min-h-[calc(100vh-73px)] relative z-10">
        <div className={`w-full max-w-2xl text-center transition-all duration-1000 ease-out transform-gpu ${
          !isVisible ? "opacity-0 translate-y-8" : isSubmitting ? "scale-95 opacity-0 translate-y-4" : "scale-100 opacity-100 translate-y-0"
        }`}>
          <h1 className={`text-5xl font-bold mb-8 font-playfair transition-all duration-700 delay-100 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-blue-400">
              NewsFlow
            </span>
          </h1>
          <p className={`text-gray-400 text-xl mb-12 font-inter transition-all duration-700 delay-200 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}>
            Discover and analyze news from multiple sources in one place
          </p>
          <form onSubmit={handleSubmit} className={`relative transition-all duration-700 delay-300 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}>
            <input
              type="text"
              value={query}
              onChange={(e) => {
                console.log('%c[LandingPage] Input change event:', logStyles.event, e.target.value);
                trackQueryChange(e.target.value);
              }}
              placeholder="What news are you looking for?"
              onFocus={() => handleInputFocus(true)}
              onBlur={() => handleInputFocus(false)}
              className={`w-full px-6 py-4 bg-primary text-white rounded-lg border transition-all duration-300 ${
                isInputFocused ? "border-blue-500 ring-2 ring-blue-500/20 shadow-lg shadow-blue-500/10" : "border-gray-700 hover:border-gray-600"
              } focus:outline-none text-lg font-inter placeholder-grey-500`}
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className={`absolute right-3 top-1/2 -translate-y-1/2 bg-secondary text-white p-2 rounded-lg hover:bg-blue-600 transition-all duration-300 ${
                isSubmitting ? "opacity-50 cursor-not-allowed scale-95" : "hover:bg-secondary hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20"
              }`}
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </form>
          <div className={`mt-8 text-gray-500 text-sm font-inter transition-all duration-700 delay-400 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}>
            Try searching for topics like "DeepSeek", "climate change", or "space exploration"
          </div>
        </div>
      </div>
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center z-50">
          <div className="relative mb-4">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-400 rounded-full opacity-30 animate-pulse"></div>
            </div>
          </div>
          <div className="relative h-36 overflow-hidden w-full max-w-md">
            <div
              key={`prev-${currentMessageIndex === 0 ? loadingMessages.length - 1 : currentMessageIndex - 1}`}
              className="text-gray-400 text-sm font-inter text-center px-4 absolute w-full transition-all duration-1000 ease-in-out opacity-30 transform"
              style={{ top: "30%", transform: "translateY(-50%) scale(0.95)", filter: "blur(1px)", transition: "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)" }}
            >
              {loadingMessages[currentMessageIndex === 0 ? loadingMessages.length - 1 : currentMessageIndex - 1]}
            </div>
            <div
              key={`current-${currentMessageIndex}`}
              className="text-white text-xl font-inter font-medium text-center px-4 absolute w-full transition-all duration-1000 ease-in-out transform shadow-lg"
              style={{ top: "50%", transform: "translateY(-50%) scale(1)", textShadow: "0 2px 4px rgba(0,0,0,0.1)", transition: "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)" }}
            >
              {loadingMessages[currentMessageIndex]}
            </div>
            <div
              key={`next-${currentMessageIndex === loadingMessages.length - 1 ? 0 : currentMessageIndex + 1}`}
              className="text-gray-400 text-sm font-inter text-center px-4 absolute w-full transition-all duration-1000 ease-in-out opacity-30 transform"
              style={{ top: "70%", transform: "translateY(-50%) scale(0.95)", filter: "blur(1px)", transition: "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)" }}
            >
              {loadingMessages[currentMessageIndex === loadingMessages.length - 1 ? 0 : currentMessageIndex + 1]}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;