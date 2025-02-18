// src/components/common/SearchBar.tsx
import React, { useState } from "react";
import { Search } from "lucide-react";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    onSearch(query);
  };

  return (
    <form onSubmit={handleSearch} className="relative w-96">
      <div className="flex items-center bg-secondary rounded-lg px-4 py-2">
        <Search className="h-5 w-5 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search news..."
          className="bg-transparent border-none focus:outline-none focus:ring-0 ml-2 w-full text-gray-100 placeholder-gray-400"
        />
      </div>
    </form>
  );
};

export default SearchBar;