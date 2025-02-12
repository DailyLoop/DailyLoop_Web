import React, { useState } from "react";
import { Search } from "lucide-react";

interface LandingPageProps {
  onSearch: (query: string) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    }
  };

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center px-4">
      <div className="w-full max-w-2xl text-center">
        <h1 className="text-5xl font-bold text-white mb-8 font-playfair">
          NewsFlow
        </h1>
        <p className="text-gray-400 text-xl mb-12 font-inter">
          Discover and analyze news from multiple sources in one place
        </p>

        <form onSubmit={handleSubmit} className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="What news are you looking for?"
            className="w-full px-6 py-4 bg-primary text-white rounded-lg border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none text-lg font-inter placeholder-grey-500"
          />
          <button
            type="submit"
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-primary text-white p-2 rounded-lg hover:bg-secondary transition-colors"
          >
            <Search className="h-5 w-5" />
          </button>
        </form>

        <div className="mt-8 text-gray-500 text-sm font-inter">
          Try searching for topics like "DeepSeek", "climate change", or "space
          exploration"
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
