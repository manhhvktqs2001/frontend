import * as React from 'react';
import { 
  MagnifyingGlassIcon, 
  BellIcon, 
  Bars3Icon,
  UserCircleIcon,
  SunIcon,
  MoonIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';

export const Header = ({ onToggleSidebar, sidebarOpen }) => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [isDarkMode, setIsDarkMode] = React.useState(true);
  const [showProfile, setShowProfile] = React.useState(false);

  return (
    <header className="bg-white/10 backdrop-blur-xl border-b border-white/20 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left side */}
        <div className="flex items-center gap-4">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors text-gray-300 hover:text-white"
          >
            <Bars3Icon className="w-5 h-5" />
          </button>

          {/* Search */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search threats, endpoints, alerts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-96 pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
            />
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {/* Theme toggle */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors text-gray-300 hover:text-white"
          >
            {isDarkMode ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
          </button>

          {/* Notifications */}
          <div className="relative">
            <button className="p-2 rounded-lg hover:bg-white/10 transition-colors text-gray-300 hover:text-white">
              <BellIcon className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[18px] h-[18px] flex items-center justify-center">
                3
              </span>
            </button>
          </div>

          {/* Settings */}
          <button className="p-2 rounded-lg hover:bg-white/10 transition-colors text-gray-300 hover:text-white">
            <Cog6ToothIcon className="w-5 h-5" />
          </button>

          {/* User Profile */}
          <div className="relative">
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/10 transition-colors"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                DM
              </div>
              <div className="text-left hidden md:block">
                <div className="text-sm font-medium text-white">DucManh</div>
                <div className="text-xs text-gray-400">Security Admin</div>
              </div>
            </button>

            {/* Profile dropdown */}
            {showProfile && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-2 shadow-xl">
                <div className="space-y-1">
                  <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/10 transition-colors text-gray-300 hover:text-white">
                    Profile
                  </button>
                  <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/10 transition-colors text-gray-300 hover:text-white">
                    Settings
                  </button>
                  <hr className="border-white/20 my-2" />
                  <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-red-500/20 transition-colors text-red-300 hover:text-red-200">
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};