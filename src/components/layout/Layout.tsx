import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import { useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Get a human-readable title from the current route
  const getTitle = () => {
    const path = location.pathname.split('/')[1];
    if (!path) return 'Dashboard';
    return path.charAt(0).toUpperCase() + path.slice(1);
  };

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100 dark:bg-gray-900">
      <Sidebar 
        isMobile={true} 
        toggleSidebar={toggleSidebar} 
        isOpen={sidebarOpen} 
      />
      
      <div className="hidden md:flex md:flex-shrink-0">
        <Sidebar 
          isMobile={false} 
          toggleSidebar={toggleSidebar} 
          isOpen={true} 
        />
      </div>
      
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <Header toggleSidebar={toggleSidebar} title={getTitle()} />
        
        <main className="flex-1 relative overflow-y-auto focus:outline-none p-4 sm:p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;