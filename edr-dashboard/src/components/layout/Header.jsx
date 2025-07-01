import * as React from 'react';
import { 
  MagnifyingGlassIcon, 
  BellIcon, 
  Bars3Icon,
  SunIcon,
  MoonIcon,
  Cog6ToothIcon,
  ChevronDownIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

export const Header = ({ onToggleSidebar, sidebarOpen }) => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [isDarkMode, setIsDarkMode] = React.useState(true);
  const [showProfile, setShowProfile] = React.useState(false);
  const [showNotifications, setShowNotifications] = React.useState(false);
  const [selectedTimePeriod, setSelectedTimePeriod] = React.useState('Last 7 days');

  const timePeriods = [
    'Last 24 hours',
    'Last 7 days', 
    'Last month',
    'Last year'
  ];

  const notifications = [
    { id: 1, title: 'High risk threat detected', time: '2 min ago', type: 'critical', unread: true },
    { id: 2, title: 'New endpoint connected', time: '5 min ago', type: 'info', unread: true },
    { id: 3, title: 'Weekly report ready', time: '1 hour ago', type: 'success', unread: false }
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <header className="h-16 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl border-b border-gray-200 dark:border-gray-700 px-6 shadow-sm">
      <div className="flex items-center justify-between h-full">
        {/* Left side */}
        <div className="flex items-center gap-6">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-400"
          >
            <Bars3Icon className="w-5 h-5" />
          </button>

          {/* Search */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search threats, endpoints, alerts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-96 pl-9 pr-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all text-sm shadow-sm"
            />
          </div>

          {/* Time Period Selector - WatchGuard Style */}
          <div className="relative">
            <button 
              className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors shadow-sm"
              onClick={() => setShowProfile(!showProfile)}
            >
              <ClockIcon className="w-4 h-4" />
              <span>{selectedTimePeriod}</span>
              <ChevronDownIcon className="w-4 h-4" />
            </button>

            {/* Time period dropdown */}
            {showProfile && (
              <div className="absolute left-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-50 py-2">
                {timePeriods.map((period) => (
                  <button
                    key={period}
                    onClick={() => {
                      setSelectedTimePeriod(period);
                      setShowProfile(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                      selectedTimePeriod === period 
                        ? 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20' 
                        : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {period}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Theme toggle */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-400"
          >
            {isDarkMode ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
          </button>

          {/* Notifications */}
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-400 relative"
            >
              <BellIcon className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[18px] h-[18px] flex items-center justify-center font-medium shadow-sm">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications dropdown */}
            {showNotifications && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-50">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div key={notification.id} className="p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className={`w-2 h-2 rounded-full mt-2 ${
                          notification.type === 'critical' ? 'bg-red-500' :
                          notification.type === 'success' ? 'bg-green-500' :
                          'bg-blue-500'
                        } ${notification.unread ? 'animate-pulse' : ''}`} />
                        <div className="flex-1">
                          <p className={`text-sm ${notification.unread ? 'font-semibold text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>
                            {notification.title}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {notification.time}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-4 text-center">
                  <button className="text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium">
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Settings */}
          <button className="p-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-400">
            <Cog6ToothIcon className="w-5 h-5" />
          </button>

          {/* User Profile */}
          <div className="flex items-center gap-3 pl-3 border-l border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg p-2 transition-colors cursor-pointer">
              <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-sm">
                DM
              </div>
              <div className="text-left hidden md:block">
                <div className="text-sm font-medium text-gray-900 dark:text-white">DucManh</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Security Admin</div>
              </div>
              <ChevronDownIcon className="w-4 h-4 text-gray-400 hidden md:block" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};