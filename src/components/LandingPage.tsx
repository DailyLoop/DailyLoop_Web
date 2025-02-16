import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";

interface LandingPageProps {
  onSearch: (query: string) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onSearch }) => {
  const [query, setQuery] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

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
      await onSearch(query);
      // Keep isSubmitting true to maintain the animation state
      // Parent component (App.tsx) will handle the transition
    } catch (error) {
      console.error('Search error:', error);
      setIsSubmitting(false);
      setQuery('');
    }
  };

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center px-4 overflow-hidden">
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
        `}
      </style>
    </div>
  );
};

export default LandingPage;
