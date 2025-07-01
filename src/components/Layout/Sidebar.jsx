import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  HomeIcon, 
  ComputerDesktopIcon, 
  DocumentTextIcon,
  ExclamationTriangleIcon,
  ShieldCheckIcon,
  BugAntIcon,
  Cog6ToothIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Agents', href: '/agents', icon: ComputerDesktopIcon },
  { name: 'Events', href: '/events', icon: DocumentTextIcon },
  { name: 'Alerts', href: '/alerts', icon: ExclamationTriangleIcon },
  { name: 'Detection Rules', href: '/rules', icon: ShieldCheckIcon },
  { name: 'Threats', href: '/threats', icon: BugAntIcon },
  { name: 'Analytics', href: '/analytics', icon: ChartBarIcon },
  { name: 'Settings', href: '/settings', icon: Cog6ToothIcon },
];

const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-gray-900 via-blue-900 to-indigo-900 shadow-2xl">
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center px-6 py-8">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
              <ShieldCheckIcon className="w-6 h-6 text-white" />
            </div>
            <div className="ml-3">
              <h1 className="text-xl font-bold text-white">EDR System</h1>
              <p className="text-xs text-blue-200">Security Platform</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-2">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href || 
                           (item.href !== '/dashboard' && location.pathname.startsWith(item.href));
            
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform scale-105'
                    : 'text-blue-100 hover:bg-white/10 hover:text-white hover:scale-105'
                }`}
              >
                <item.icon
                  className={`mr-3 flex-shrink-0 h-5 w-5 transition-colors duration-200 ${
                    isActive ? 'text-white' : 'text-blue-300 group-hover:text-white'
                  }`}
                />
                {item.name}
                {isActive && (
                  <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Status indicator */}
        <div className="p-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="ml-2 text-xs text-white font-medium">System Online</span>
            </div>
            <div className="mt-1 text-xs text-blue-200">
              Last update: {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;