import React, { useState } from 'react';
import { 
  BellIcon, 
  MagnifyingGlassIcon,
  UserCircleIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';
import { useQuery } from 'react-query';
import { fetchDashboardStats } from '../../services/api';

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const { data: stats } = useQuery('dashboardStats', fetchDashboardStats, {
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  return (
    <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200/50 shadow-sm sticky top-0 z-40">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Search */}
          <div className="flex-1 max-w-lg">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search agents, events, alerts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white/50 backdrop-blur-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 form-input"
              />
            </div>
          </div>

          {/* Stats Overview */}
          <div className="hidden lg:flex items-center space-x-6 mx-8">
            <div className="flex items-center space-x-4">
              {/* Online Agents */}
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2" />
                <span className="text-sm font-medium text-gray-700">
                  {stats?.agents?.online || 0} Agents Online
                </span>
              </div>
              
              {/* Active Alerts */}
              <div className="flex items-center">
                <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse mr-2" />
                <span className="text-sm font-medium text-gray-700">
                  {stats?.alerts?.open || 0} Active Alerts
                </span>
              </div>
              
              {/* Events Rate */}
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse mr-2" />
                <span className="text-sm font-medium text-gray-700">
                  {stats?.events?.avg_per_hour || 0}/hr Events
                </span>
              </div>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200">
              <BellIcon className="h-6 w-6" />
              {stats?.alerts?.critical > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                  {stats.alerts.critical}
                </span>
              )}
            </button>

            {/* Settings */}
            <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200">
              <Cog6ToothIcon className="h-6 w-6" />
            </button>

            {/* User Profile */}
            <div className="flex items-center space-x-3">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-medium text-gray-900">Security Admin</div>
                <div className="text-xs text-gray-500">Administrator</div>
              </div>
              <button className="p-1 text-gray-600 hover:text-gray-900 transition-colors duration-200">
                <UserCircleIcon className="h-8 w-8" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;