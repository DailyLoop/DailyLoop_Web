import React, { useState, useRef, useEffect } from "react";
import { Newspaper, LogOut, User } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

interface LandingHeaderProps {
  onLogoClick: () => void;
}

const LandingHeader: React.FC<LandingHeaderProps> = ({ onLogoClick }) => {
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

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Signed out successfully');
    } catch (error) {
      toast.error('Error signing out');
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-secondary/30 backdrop-blur-md supports-[backdrop-filter]:bg-secondary/20 border-b border-secondary/20 transition-all duration-300 ease-in-out shadow-lg">
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
          
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center hover:bg-blue-600 transition-colors duration-300"
            >
              <span className="text-white text-lg font-semibold">
                {user?.email?.[0].toUpperCase()}
              </span>
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-secondary border border-gray-700">
                <div className="py-1">
                  <button
                    className="w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 flex items-center space-x-2"
                    onClick={() => {
                      navigate('/profile');
                      setIsDropdownOpen(false);
                    }}
                  >
                    <User className="h-4 w-4" />
                    <span>Profile</span>
                  </button>
                  <button
                    className="w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 flex items-center space-x-2"
                    onClick={() => {
                      handleSignOut();
                      setIsDropdownOpen(false);
                    }}
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default LandingHeader;