import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Home, Package, Truck, Car, Users, BarChart3, Settings,
  Menu, X, Tag, LogOut, Wrench, Cog, Layers
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  isMobile: boolean;
  toggleSidebar: () => void;
  isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isMobile, toggleSidebar, isOpen }) => {
  const { user, logout, isLoading } = useAuth();
  const location = useLocation();
  const isAdmin = user?.role === 'admin';

  const navItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: <Home size={20} />,
      description: 'Overview and analytics'
    },
    {
      name: 'Inventory',
      path: '/inventory',
      icon: <Package size={20} />,
      description: 'Manage stock items'
    },
    {
      name: 'Categories',
      path: '/categories',
      icon: <Tag size={20} />,
      description: 'Item categories'
    },
    {
      name: 'Suppliers',
      path: '/suppliers',
      icon: <Truck size={20} />,
      description: 'Manage suppliers'
    },
    {
      name: 'Vehicles',
      path: '/vehicles',
      icon: <Car size={20} />,
      description: 'Customer vehicles'
    },
    {
      name: 'Reparations',
      path: '/reparations',
      icon: <Wrench size={20} />,
      description: 'Repair orders'
    },
    {
      name: 'Services',
      path: '/services',
      icon: <Cog size={20} />,
      description: 'Available services'
    },
    {
      name: 'Reports',
      path: '/reports',
      icon: <BarChart3 size={20} />,
      description: 'Analytics & reports'
    },
  ];

  if (isAdmin) {
    navItems.push(
      {
        name: 'Users',
        path: '/users',
        icon: <Users size={20} />,
        description: 'Manage users'
      },
      {
        name: 'Settings',
        path: '/settings',
        icon: <Settings size={20} />,
        description: 'System settings'
      }
    );
  }

  if (!isOpen && isMobile) return null;

  return (
    <div className={`${isMobile ? 'fixed inset-0 z-40 flex' : 'hidden md:flex md:flex-shrink-0'}`}>
      {isMobile && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75 backdrop-blur-sm transition-opacity"
          onClick={toggleSidebar}
        />
      )}

      <div className={`
        relative flex flex-col w-72 max-w-xs bg-white dark:bg-slate-50/5
        text-slate-900 dark:text-white border-r border-slate-100
        shadow-sm transition-all duration-300 ease-in-out backdrop-blur-xl
      `}>
        {isMobile && (
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={toggleSidebar}
            >
              <span className="sr-only">Close sidebar</span>
              <X className="h-6 w-6 text-white" />
            </button>
          </div>
        )}

        <div className="flex-1 flex flex-col min-h-0 pt-5">
          <div className="flex items-center justify-center px-4">
            <Layers className="h-8 w-8 text-sky-500" />
            <h1 className="ml-2 text-xl font-bold bg-gradient-to-r from-sky-500 to-blue-500 bg-clip-text text-transparent">
              Stock Manager
            </h1>
          </div>

          <div className="mt-6 flex-1 flex flex-col overflow-y-auto">
            <nav className="flex-1 px-3 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-600 scrollbar-track-transparent">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={`
                      group relative flex items-center px-4 py-2 text-sm font-medium rounded-lg
                      transition-all duration-200 ease-in-out
                      ${isActive
                        ? 'bg-gradient-to-r from-sky-500 to-blue-500 text-white shadow-sm'
                        : 'text-slate-600 hover:bg-sky-50 hover:text-sky-600'
                      }
                    `}
                  >
                    <span className={`
                      flex items-center justify-center mr-3
                      transition-all duration-200 ease-in-out
                      ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-sky-500'}
                    `}>
                      {item.icon}
                    </span>
                    <span className="flex flex-col">
                      {item.name}
                      <span className={`
                        text-xs font-normal truncate max-w-[150px]
                        ${isActive ? 'text-sky-100' : 'text-slate-400 group-hover:text-sky-400'}
                      `}>
                        {item.description}
                      </span>
                    </span>
                  </NavLink>
                );
              })}
            </nav>
          </div>
        </div>

        <div className="flex-shrink-0 border-t border-slate-100 p-4 mt-2 bg-white/50 backdrop-blur-xl">
          {isLoading ? (
            <div className="flex items-center justify-center p-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-sky-500"></div>
            </div>
          ) : (
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-sky-500 to-blue-500 flex items-center justify-center text-white font-bold shadow-sm">
                  {user?.name ? user.name.charAt(0).toUpperCase() : '?'}
                </div>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-slate-900 dark:text-white">
                  {user?.name || 'Loading...'}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {user?.role || 'Loading...'}
                </p>
              </div>
              <button
                onClick={logout}
                className="p-2 rounded-lg text-slate-400 hover:text-sky-500 hover:bg-sky-50 transition-colors duration-200"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;