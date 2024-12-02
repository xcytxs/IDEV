import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const location = useLocation();
  const isProjectPage = location.pathname.startsWith('/projects/');

  return (
    <div className="flex h-screen bg-gray-900 overflow-hidden">
      <div 
        className={`transition-all duration-300 ease-in-out ${
          isSidebarCollapsed ? 'w-16' : 'w-64'
        } relative flex-shrink-0`}
      >
        <Sidebar isCollapsed={isSidebarCollapsed} />
        <button
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 bg-gray-700 rounded-full p-1 text-gray-300 hover:text-white hover:bg-gray-600"
        >
          {isSidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {isProjectPage ? (
          <div className="flex-1 flex flex-col overflow-hidden">
            {children}
          </div>
        ) : (
          <div className="flex-1 overflow-auto p-6">
            {children}
          </div>
        )}
      </div>
    </div>
  );
};

export default Layout;