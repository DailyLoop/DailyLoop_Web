import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import LandingHeader from "./layout/LandingHeader";

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
  onSearch: (query: string) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onSearch }) => {
  const [query, setQuery] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      interval = setInterval(() => {
        setCurrentMessageIndex((prevIndex) => 
          prevIndex === loadingMessages.length - 1 ? 0 : prevIndex + 1
        );
      }, 3000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) {
      const form = e.currentTarget as HTMLFormElement;
      form.classList.add('shake');
      setTimeout(() => form.classList.remove('shake'), 500);
      return;
    }

    try {
      setIsSubmitting(true);
      setIsLoading(true);
      await onSearch(query);
      // Keep isSubmitting true to maintain the animation state
      // Parent component (App.tsx) will handle the transition
    } catch (error) {
      console.error('Search error:', error);
      setIsSubmitting(false);
      setIsLoading(false);
      setQuery('');      
    }
  };

  const handleLogoClick = () => {
    // Reset the search if needed
    setQuery("");
    setIsLoading(false);
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-primary overflow-hidden">
      <LandingHeader onLogoClick={handleLogoClick} />
      <div className="flex items-center justify-center px-4 min-h-[calc(100vh-73px)]">
        <div className={`w-full max-w-2xl text-center transition-all duration-1000 ease-out transform-gpu ${
          !isVisible ? 'opacity-0 translate-y-8' :
          isSubmitting ? 'scale-95 opacity-0 translate-y-4' : 
          'scale-100 opacity-100 translate-y-0'
        }`}>
          <h1 className={`text-5xl font-bold mb-8 font-playfair transition-all duration-700 delay-100 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-blue-400">NewsFlow</span>
          </h1>
          <p className={`text-gray-400 text-xl mb-12 font-inter transition-all duration-700 delay-200 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            Discover and analyze news from multiple sources in one place
          </p>

          <form onSubmit={handleSubmit} className={`relative transition-all duration-700 delay-300 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="What news are you looking for?"
              onFocus={() => setIsInputFocused(true)}
              onBlur={() => setIsInputFocused(false)}
              className={`w-full px-6 py-4 bg-primary text-white rounded-lg border transition-all duration-300
                ${isInputFocused ? 
                  'border-blue-500 ring-2 ring-blue-500/20 shadow-lg shadow-blue-500/10' : 
                  'border-gray-700 hover:border-gray-600'
                } 
                focus:outline-none text-lg font-inter placeholder-grey-500`}
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className={`absolute right-3 top-1/2 -translate-y-1/2 bg-secondary text-white p-2 rounded-lg hover:bg-blue-600 transition-all duration-300
                ${isSubmitting ? 
                  'opacity-50 cursor-not-allowed scale-95' : 
                  'hover:bg-secondary hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20'
                }`}
            >
              <Search className={`h-5 w-5 transition-transform duration-300 ${isSubmitting ? 'animate-spin' : ''}`} />
            </button>
          </form>

          <div className={`mt-8 text-gray-500 text-sm font-inter transition-all duration-700 delay-400 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            Try searching for topics like "DeepSeek", "climate change", or "space
            exploration"
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
                key={`prev-${(currentMessageIndex === 0 ? loadingMessages.length - 1 : currentMessageIndex - 1)}`}
                className="text-gray-400 text-sm font-inter text-center px-4 absolute w-full transition-all duration-1000 ease-in-out opacity-30 transform"
                style={{
                  top: '30%',
                  transform: 'translateY(-50%) scale(0.95)',
                  filter: 'blur(1px)',
                  transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              >
                {loadingMessages[currentMessageIndex === 0 ? loadingMessages.length - 1 : currentMessageIndex - 1]}
              </div>
              <div 
                key={`current-${currentMessageIndex}`}
                className="text-white text-xl font-inter font-medium text-center px-4 absolute w-full transition-all duration-1000 ease-in-out transform shadow-lg"
                style={{
                  top: '50%',
                  transform: 'translateY(-50%) scale(1)',
                  textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              >
                {loadingMessages[currentMessageIndex]}
              </div>
              <div 
                key={`next-${(currentMessageIndex === loadingMessages.length - 1 ? 0 : currentMessageIndex + 1)}`}
                className="text-gray-400 text-sm font-inter text-center px-4 absolute w-full transition-all duration-1000 ease-in-out opacity-30 transform"
                style={{
                  top: '70%',
                  transform: 'translateY(-50%) scale(0.95)',
                  filter: 'blur(1px)',
                  transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              >
                {loadingMessages[currentMessageIndex === loadingMessages.length - 1 ? 0 : currentMessageIndex + 1]}
              </div>
            </div>
          </div>
        )}
      </div>
      <style>
        {`
          @keyframes shakeAnimation {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-4px); }
            75% { transform: translateX(4px); }
          }
          .shake {
            animation: shakeAnimation 0.3s ease-in-out;
          }
          @keyframes slideUp {
            0% {
              transform: translateY(100%);
              opacity: 0;
            }
            10% {
              transform: translateY(-50%);
              opacity: 1;
            }
            90% {
              transform: translateY(-50%);
              opacity: 1;
            }
            100% {
              transform: translateY(-200%);
              opacity: 0;
            }
          }
        `}
      </style>
    </div>
  );
};

export default LandingPage;
