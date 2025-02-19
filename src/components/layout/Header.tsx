// src/components/layout/Header.tsx
import React from "react";
import { Newspaper, LogOut } from "lucide-react";
import SearchBar from "../common/SearchBar";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

interface HeaderProps {
  onLogoClick: () => void;
  onSearch: (query: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onLogoClick, onSearch }) => {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Signed out successfully');
    } catch (error) {
      toast.error('Error signing out');
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-secondary/95 backdrop-blur supports-[backdrop-filter]:bg-secondary/75 border-b border-secondary/50 transition-all duration-300 ease-in-out">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <button
            onClick={onLogoClick}
            className="group flex items-center space-x-3 transition-all duration-300 ease-in-out hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-secondary rounded-lg px-3 py-1.5"
          >
            <Newspaper className="h-8 w-8 text-blue-500 transition-transform duration-300 ease-in-out group-hover:scale-110 group-hover:rotate-[-8deg]" />
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-blue-400 transition-colors duration-300 ease-in-out group-hover:from-blue-400 group-hover:to-blue-300">
              NewsFlow
            </h1>
          </button>
          
          <div className="flex items-center space-x-6">
            <SearchBar onSearch={onSearch} />
            <div className="flex items-center space-x-4">
              <span className="text-gray-300">{user?.email}</span>
              <button
                onClick={handleSignOut}
                className="flex items-center space-x-2 px-4 py-2 text-gray-300 hover:text-white transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;