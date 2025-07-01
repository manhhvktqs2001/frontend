import React, { useState, useEffect } from 'react';
import { 
  ShieldCheckIcon,
  BellIcon,
  MagnifyingGlassIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  SunIcon,
  MoonIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  InformationCircleIcon,
  ChevronDownIcon,
  GlobeAltIcon,
  ComputerDesktopIcon
} from '@heroicons/react/24/outline';

const Header = ({ user = { name: 'Administrator', role: 'Security Analyst', avatar: null } }) => {
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [systemStats, setSystemStats] = useState({
    agentsOnline: 247,
    criticalAlerts: 8,
    threatLevel: 'Medium'
  });

  // Mock notifications
  useEffect(() => {
    setNotifications([
      {
        id: 1,
        type: 'critical',
        title: 'Critical Alert: Malware Detected',
        message: 'Suspicious activity detected on WIN-SRV-001',
        time: '2 minutes ago',
        unread: true
      },
      {
        id: 2,
        type: 'warning',
        title: 'Agent Offline',
        message: '5 endpoints have gone offline in the last hour',
        time: '15 minutes ago',
        unread: true
      },
      {
        id: 3,
        type: 'info',
        title: 'System Update Available',
        message: 'EDR System v2.4.1 is now available',
        time: '1 hour ago',
        unread: false
      },
      {
        id: 4,
        type: 'success',
        title: 'Threat Mitigated',
        message: 'Successfully blocked malicious domain access',
        time: '2 hours ago',
        unread: false
      }
    ]);
  }, []);

  // Get notification icon and colors
  const getNotificationStyle = (type) => {
    const styles = {
      critical: {
        icon: ExclamationTriangleIcon,
        bgColor: 'bg-red-100',
        textColor: 'text-red-600',
        iconColor: 'text-red-500'
      },
      warning: {
        icon: ExclamationTriangleIcon,
        bgColor: 'bg-orange-100',
        textColor: 'text-orange-600',
        iconColor: 'text-orange-500'
      },
      info: {
        icon: InformationCircleIcon,
        bgColor: 'bg-blue-100',
        textColor: 'text-blue-600',
        iconColor: 'text-blue-500'
      },
      success: {
        icon: CheckCircleIcon,
        bgColor: 'bg-green-100',
        textColor: 'text-green-600',
        iconColor: 'text-green-500'
      }
    };
    return styles[type] || styles.info;
  };

  // Get threat level color
  const getThreatLevelColor = (level) => {
    const colors = {
      'Low': 'text-green-600 bg-green-100',
      'Medium': 'text-yellow-600 bg-yellow-100',
      'High': 'text-orange-600 bg-orange-100',
      'Critical': 'text-red-600 bg-red-100'
    };
    return colors[level] || colors.Medium;
  };

  // Mark notification as read
  const markAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, unread: false }
          : notification
      )
    );
  };

  // Mark all as read
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, unread: false }))
    );
  };

  // Get unread count
  const unreadCount = notifications.filter(n => n.unread).length;

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log('Searching for:', searchQuery);
      // Implement search functionality
    }
  };

  return (
    <header className="w-full h-20 bg-white/80 backdrop-blur-lg shadow-lg border-b border-white/20 relative z-40">
      <div className="flex items-center justify-between h-full px-8">
        {/* Left Section - Logo & System Status */}
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg">
              <ShieldCheckIcon className="w-7 h-7 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                EDR System
              </span>
              <div className="text-xs text-gray-500 font-medium">Security Operations Center</div>
            </div>
          </div>

          {/* System Status Indicators */}
          <div className="flex items-center space-x-4 pl-6 border-l border-gray-200">
            <div className="flex items-center space-x-2">
              <ComputerDesktopIcon className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-semibold text-blue-600">{systemStats.agentsOnline}</span>
              <span className="text-xs text-gray-500">Agents</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <ExclamationTriangleIcon className="w-4 h-4 text-red-500" />
              <span className="text-sm font-semibold text-red-600">{systemStats.criticalAlerts}</span>
              <span className="text-xs text-gray-500">Alerts</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
              <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getThreatLevelColor(systemStats.threatLevel)}`}>
                {systemStats.threatLevel} Risk
              </span>
            </div>
          </div>
        </div>

        {/* Center Section - Search */}
        <div className="flex-1 max-w-md mx-8">
          <form onSubmit={handleSearch} className="relative">
            <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search agents, alerts, threats..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50/80 backdrop-blur-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <kbd className="px-2 py-1 text-xs text-gray-500 bg-gray-200 rounded border">⌘K</kbd>
            </div>
          </form>
        </div>

        {/* Right Section - Actions & User */}
        <div className="flex items-center space-x-4">
          {/* Dark Mode Toggle */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            title="Toggle Dark Mode"
          >
            {isDarkMode ? (
              <SunIcon className="w-5 h-5" />
            ) : (
              <MoonIcon className="w-5 h-5" />
            )}
          </button>

          {/* Global Settings */}
          <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200">
            <GlobeAltIcon className="w-5 h-5" />
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <BellIcon className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 top-full mt-2 w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50">
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-gray-900">Notifications</h3>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map(notification => {
                      const style = getNotificationStyle(notification.type);
                      const NotificationIcon = style.icon;
                      
                      return (
                        <div
                          key={notification.id}
                          onClick={() => markAsRead(notification.id)}
                          className={`p-4 border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors ${
                            notification.unread ? 'bg-blue-50/50' : ''
                          }`}
                        >
                          <div className="flex items-start space-x-3">
                            <div className={`p-2 rounded-lg ${style.bgColor}`}>
                              <NotificationIcon className={`w-4 h-4 ${style.iconColor}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between">
                                <h4 className={`text-sm font-semibold ${style.textColor} truncate`}>
                                  {notification.title}
                                </h4>
                                {notification.unread && (
                                  <div className="w-2 h-2 bg-blue-500 rounded-full ml-2 mt-1"></div>
                                )}
                              </div>
                              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-400 mt-2">
                                {notification.time}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="p-8 text-center text-gray-500">
                      <BellIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>No notifications</p>
                    </div>
                  )}
                </div>
                
                <div className="p-3 border-t border-gray-100">
                  <button className="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium py-2">
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200"
            >
              <div className="text-right">
                <div className="text-sm font-semibold text-gray-900">{user.name}</div>
                <div className="text-xs text-gray-500">{user.role}</div>
              </div>
              {user.avatar ? (
                <img 
                  src={user.avatar} 
                  alt={user.name}
                  className="w-10 h-10 rounded-full border-2 border-gray-200"
                />
              ) : (
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <ChevronDownIcon className="w-4 h-4 text-gray-400" />
            </button>

            {/* User Dropdown */}
            {showUserMenu && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50">
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center space-x-3">
                    {user.avatar ? (
                      <img 
                        src={user.avatar} 
                        alt={user.name}
                        className="w-12 h-12 rounded-full border-2 border-gray-200"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div>
                      <div className="font-semibold text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.role}</div>
                      <div className="text-xs text-green-600 font-medium">● Online</div>
                    </div>
                  </div>
                </div>
                
                <div className="py-2">
                  <button className="w-full flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                    <UserCircleIcon className="w-5 h-5 text-gray-400" />
                    <span>Profile Settings</span>
                  </button>
                  <button className="w-full flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                    <Cog6ToothIcon className="w-5 h-5 text-gray-400" />
                    <span>Account Preferences</span>
                  </button>
                  <button className="w-full flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                    <ShieldCheckIcon className="w-5 h-5 text-gray-400" />
                    <span>Security Settings</span>
                  </button>
                </div>
                
                <div className="border-t border-gray-100 py-2">
                  <button className="w-full flex items-center space-x-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors">
                    <ArrowRightOnRectangleIcon className="w-5 h-5 text-red-500" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Close dropdowns when clicking outside */}
      {(showNotifications || showUserMenu) && (
        <div 
          className="fixed inset-0 z-30" 
          onClick={() => {
            setShowNotifications(false);
            setShowUserMenu(false);
          }}
        />
      )}
    </header>
  );
};

export default Header;