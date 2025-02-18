import React, { useState } from "react";
import { Search } from "lucide-react";

interface SearchBarProps {
  onSearch: (query: string) => Promise<void>;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      await onSearch(query.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-md">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search news..."
        className="w-full px-4 py-2 pl-10 pr-4 text-sm text-white bg-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white/20"
      />
      <button
        type="submit"
        className="absolute inset-y-0 left-0 flex items-center pl-3"
      >
        <Search className="w-4 h-4 text-gray-400" />
      </button>
    </form>
  );
};

export default SearchBar;
