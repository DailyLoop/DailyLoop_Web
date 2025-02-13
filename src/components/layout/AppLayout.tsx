import React, { ReactNode } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";

interface AppLayoutProps {
  children: ReactNode;
  onLogoClick: () => void;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children, onLogoClick }) => {
  return (
    <div className="bg-primary min-h-screen text-white">
      <Header onLogoClick={onLogoClick} />
      <div className="flex">
        <Sidebar />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
};

export default AppLayout;
