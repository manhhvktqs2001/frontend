import * as React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  HomeIcon, 
  ComputerDesktopIcon, 
  ExclamationTriangleIcon,
  ShieldExclamationIcon,
  MagnifyingGlassIcon,
  ChartBarIcon,
  CogIcon,
  DocumentTextIcon,
  SparklesIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline';

const navItems = [
  { label: 'Dashboard', path: '/', icon: HomeIcon },
  { label: 'Endpoints', path: '/agents', icon: ComputerDesktopIcon },
  { label: 'Alerts', path: '/alerts', icon: ExclamationTriangleIcon },
  { label: 'Threats', path: '/threats', icon: ShieldExclamationIcon },
  { label: 'Events', path: '/events', icon: MagnifyingGlassIcon },
  { label: 'Rules', path: '/rules', icon: AdjustmentsHorizontalIcon },
  { label: 'Analytics', path: '/analytics', icon: ChartBarIcon },
  { label: 'Reports', path: '/reports', icon: DocumentTextIcon },
  { label: 'AI Assistant', path: '/ai', icon: SparklesIcon },
  { label: 'Settings', path: '/settings', icon: CogIcon },
];

export const Sidebar = ({ isOpen }) => {
  return (
    <aside className={`fixed left-0 top-0 z-50 h-full bg-white dark:bg-gray-800 shadow-2xl border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ${
      isOpen ? 'w-64' : 'w-16'
    }`}>
      {/* Glass effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/80 to-white/40 dark:from-gray-800/80 dark:to-gray-800/40 backdrop-blur-xl"></div>
      
      <div className="relative z-10 flex flex-col h-full">
        {/* Logo - WatchGuard Style */}
        <div className="h-16 flex items-center px-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-red-500 via-red-600 to-red-700 rounded-xl flex items-center justify-center shadow-lg">
              <ShieldExclamationIcon className="w-6 h-6 text-white" />
            </div>
            {isOpen && (
              <div>
                <div className="text-xl font-bold bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">
                  WatchGuard
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  EDR Platform v3.0.0
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `
                group relative flex items-center gap-3 px-3 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-[1.02]
                ${isActive 
                  ? 'bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/30 dark:to-red-800/30 text-red-600 dark:text-red-400 shadow-lg shadow-red-100 dark:shadow-red-900/30' 
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-white'
                }
              `}
              end={item.path === '/'}
            >
              {({ isActive }) => (
                <>
                  <div className={`p-1 rounded-lg ${isActive ? 'bg-red-100 dark:bg-red-800/50' : ''}`}>
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                  </div>
                  {isOpen && <span className="truncate">{item.label}</span>}
                  
                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute right-3 w-2 h-2 rounded-full bg-red-500 shadow-lg shadow-red-500/50" />
                  )}
                  
                  {/* Tooltip for collapsed state */}
                  {!isOpen && (
                    <div className="absolute left-16 bg-gray-900 dark:bg-gray-700 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-50 shadow-xl">
                      {item.label}
                      <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 dark:bg-gray-700 rotate-45"></div>
                    </div>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        {isOpen && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 rounded-lg p-3">
              <div className="text-center">
                <div className="text-xs font-semibold text-gray-700 dark:text-gray-200">
                  System Status
                </div>
                <div className="flex items-center justify-center gap-2 mt-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-gray-600 dark:text-gray-300">All Systems Operational</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};