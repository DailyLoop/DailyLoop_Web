// src/components/layout/AppLayout.tsx
import React, { ReactNode, useState, useEffect } from "react";
import AppHeader from "./AppHeader";
import Sidebar from "./Sidebar";
import StoryTrackingTabs from "../story-tracking/StoryTrackingTabs";

interface AppLayoutProps {
  children: ReactNode;
  onLogoClick: () => void;
  onSearch: (query: string) => void;
  toggleKeyword: (kw: string) => void;
  selectedKeywords: string[];
}

const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  onLogoClick,
  onSearch,
  toggleKeyword,
  selectedKeywords
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [isContentVisible, setIsContentVisible] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
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
        isLoaded ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="animate-fadeIn">
        <AppHeader onLogoClick={onLogoClick} onSearch={onSearch} mode="app" />
        <StoryTrackingTabs />
        <div className="flex">
          <div
            className={`transition-all duration-700 ease-out transform ${
              isSidebarVisible
                ? "translate-x-0 opacity-100"
                : "-translate-x-full opacity-0"
            }`}
          >
            <Sidebar
              toggleKeyword={toggleKeyword}
              selectedKeywords={selectedKeywords}
            />
          </div>
          <main
            className={`flex-1 transition-all duration-700 ease-out transform ${
              isContentVisible
                ? "translate-x-0 opacity-100"
                : "translate-x-full opacity-0"
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