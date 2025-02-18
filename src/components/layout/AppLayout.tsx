import React, { ReactNode, useState, useEffect } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";

interface AppLayoutProps {
  children: ReactNode;
  onLogoClick: () => void;
  onSearch: (query: string) => void;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children, onLogoClick, onSearch }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [isContentVisible, setIsContentVisible] = useState(false);

  useEffect(() => {
    // Trigger initial load animation
    setIsLoaded(true);
    
    // Stagger the animations for a smooth sequence
    const sidebarTimer = setTimeout(() => setIsSidebarVisible(true), 100);
    const contentTimer = setTimeout(() => setIsContentVisible(true), 300);

    return () => {
      clearTimeout(sidebarTimer);
      clearTimeout(contentTimer);
    };
  }, []);

  return (
    <div 
      className={`bg-primary min-h-screen text-white transition-all duration-1000 ease-in-out ${
        isLoaded ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="animate-fadeIn">
        <Header onLogoClick={onLogoClick} onSearch={onSearch} />
        <div className="flex">
          <div 
            className={`transition-all duration-700 ease-out transform ${
              isSidebarVisible ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
            }`}
          >
            <Sidebar />
          </div>
          <main 
            className={`flex-1 transition-all duration-700 ease-out transform ${
              isContentVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}
          >
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default AppLayout;
