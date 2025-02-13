import React from "react";
import { Newspaper } from "lucide-react";
import SearchBar from "../common/SearchBar";

interface HeaderProps {
  onLogoClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLogoClick }) => {
  return (
    <header className="sticky top-0 z-50 bg-transparent backdrop-blur supports-[backdrop-filter]:bg-transparent">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <button
            onClick={onLogoClick}
            className="flex items-center space-x-3 hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-blue-500/50 rounded-lg px-2 py-1"
          >
            <Newspaper className="h-8 w-8 text-blue-500" />
            <h1 className="text-2xl font-bold text-white">NewsFlow</h1>
          </button>
          <SearchBar />
        </div>
      </div>
    </header>
  );
};

export default Header;
