import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Briefcase, 
  Users, 
  GitBranch, 
  BarChart2, 
  Server, 
  MessageSquare 
} from 'lucide-react';

interface SidebarProps {
  isCollapsed: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed }) => {
  const location = useLocation();

  const menuItems = [
    { path: '/', icon: Home, label: 'Dashboard' },
    { path: '/projects', icon: Briefcase, label: 'Projects' },
    { path: '/agents', icon: Users, label: 'Agents' },
    { path: '/workflows', icon: GitBranch, label: 'Workflows' },
    { path: '/analytics', icon: BarChart2, label: 'Analytics' },
    { path: '/llm-providers', icon: Server, label: 'LLM Providers' },
    { path: '/chat', icon: MessageSquare, label: 'Chat' },
  ];

  return (
    <div className="h-full bg-gray-800 text-gray-100 flex flex-col">
      <div className={`p-4 border-b border-gray-700 ${isCollapsed ? 'text-center' : ''}`}>
        {isCollapsed ? (
          <div className="text-2xl font-bold">AI</div>
        ) : (
          <h2 className="text-xl font-semibold">AI Agent Management</h2>
        )}
      </div>

      <nav className="flex-1 py-4">
        {menuItems.map(({ path, icon: Icon, label }) => (
          <Link
            key={path}
            to={path}
            className={`flex items-center px-4 py-2 my-1 transition-colors ${
              location.pathname === path ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700'
            }`}
          >
            <Icon size={20} />
            {!isCollapsed && <span className="ml-3">{label}</span>}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;