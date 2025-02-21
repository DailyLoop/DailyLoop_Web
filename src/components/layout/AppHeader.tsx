// src/components/layout/AppHeader.tsx
import React, { useState, useRef, useEffect } from "react";
import { Newspaper, LogOut, User, Bookmark } from "lucide-react"; // Added Bookmark
import SearchBar from "../common/SearchBar";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

interface AppHeaderProps {
  onLogoClick: () => void;
  onSearch?: (query: string) => void;
  // mode "landing" for non-authenticated pages, "app" for authenticated pages
  mode: "landing" | "app";
}

const AppHeader: React.FC<AppHeaderProps> = ({ onLogoClick, onSearch, mode }) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Signed out successfully");
      navigate("/auth");
    } catch (error) {
      toast.error("Error signing out");
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ease-in-out ${
        mode === "landing"
          ? "bg-secondary/30 backdrop-blur-md border-b border-secondary/20"
          : "bg-transparent backdrop-blur-sm border-b border-white/10"
      }`}
    >
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo and title */}
        <button
          onClick={onLogoClick}
          className="group flex items-center space-x-3 transition-all duration-300 ease-in-out hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-blue-500/50 rounded-lg px-3 py-1.5"
        >
          <Newspaper className="h-8 w-8 text-blue-500 transition-transform duration-300 ease-in-out group-hover:scale-110 group-hover:rotate-[-8deg]" />
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-blue-400">
            NewsFlow
          </h1>
        </button>

        {mode === "app" && user ? (
          <div className="flex items-center space-x-6">
            {onSearch && <SearchBar onSearch={onSearch} />}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center hover:bg-blue-600 transition-colors duration-300"
              >
                <span className="text-white text-lg font-semibold">
                  {user.email ? user.email[0].toUpperCase() : "U"}
                </span>
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-secondary border border-gray-700">
                  <div className="py-1">
                    <button
                      onClick={() => {
                        navigate("/profile");
                        setIsDropdownOpen(false);
                      }}
                      className="w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700/30 flex items-center space-x-2 transition-colors duration-200"
                    >
                      <User className="h-4 w-4" />
                      <span>Profile</span>
                    </button>
                    <button
                      onClick={() => {
                        navigate("/bookmarks");
                        setIsDropdownOpen(false);
                      }}
                      className="w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700/30 flex items-center space-x-2 transition-colors duration-200"
                    >
                      <Bookmark className="h-4 w-4" />
                      <span>Bookmarks</span>
                    </button>
                    <button
                      onClick={() => {
                        handleSignOut();
                        setIsDropdownOpen(false);
                      }}
                      className="w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700/30 flex items-center space-x-2 transition-colors duration-200"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          mode === "landing" && (
            <button
              onClick={() => navigate("/auth")}
              className="px-4 py-2 bg-blue-500 text-white rounded-md transition-colors duration-300 hover:bg-blue-600"
            >
              Sign In
            </button>
          )
        )}
      </div>
    </header>
  );
};

export default AppHeader;