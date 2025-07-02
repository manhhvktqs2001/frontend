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
  ComputerDesktopIcon,
  FireIcon,
  XCircleIcon,
  ClockIcon,
  UserIcon,
  KeyIcon,
  WrenchScrewdriverIcon
} from '@heroicons/react/24/outline';
import { fetchDashboardStats, fetchAlerts, fetchAgents } from '../../service/api';

const Header = ({ user = { name: 'Đức Mạnh', role: 'Security Analyst', avatar: null } }) => {
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [systemStats, setSystemStats] = useState({
    agentsOnline: 0,
    agentsOffline: 0,
    criticalAlerts: 0,
    threatLevel: 'Medium',
    systemStatus: 'Online',
    lastUpdate: new Date()
  });

  // Fetch system stats from backend
  useEffect(() => {
    const fetchHeaderStats = async () => {
      try {
        const [stats, alerts, agents] = await Promise.all([
          fetchDashboardStats(),
          fetchAlerts(),
          fetchAgents()
        ]);
        setSystemStats({
          agentsOnline: agents?.agents?.filter(a => a.status === 'online').length || 0,
          agentsOffline: agents?.agents?.filter(a => a.status !== 'online').length || 0,
          criticalAlerts: alerts?.alerts?.filter(a => a.severity === 'critical').length || 0,
          threatLevel: stats?.threat_level || 'Medium',
          systemStatus: stats?.status || 'Online',
          lastUpdate: new Date()
        });
      } catch (err) {
        // fallback: do not update
      }
    };
    fetchHeaderStats();
    const interval = setInterval(fetchHeaderStats, 30000);
    return () => clearInterval(interval);
  }, []);

  // Mock notifications - replace with real API call
  useEffect(() => {
    const mockNotifications = [
      {
        id: 1,
        type: 'critical',
        title: 'Critical Alert Detected',
        message: 'Suspicious process detected on Agent-001',
        time: '2 minutes ago',
        unread: true
      },
      {
        id: 2,
        type: 'warning',
        title: 'Agent Offline',
        message: 'Agent-005 has been offline for 5 minutes',
        time: '5 minutes ago',
        unread: true
      },
      {
        id: 3,
        type: 'info',
        title: 'System Update',
        message: 'New threat intelligence feed updated',
        time: '10 minutes ago',
        unread: false
      },
      {
        id: 4,
        type: 'success',
        title: 'Threat Blocked',
        message: 'Malicious file blocked on Agent-003',
        time: '15 minutes ago',
        unread: false
      }
    ];
    setNotifications(mockNotifications);
  }, []);

  // Get notification icon and colors
  const getNotificationStyle = (type) => {
    const styles = {
      critical: {
        icon: ExclamationTriangleIcon,
        bgColor: 'bg-red-900/60',
        textColor: 'text-red-200',
        iconColor: 'text-red-400'
      },
      warning: {
        icon: ExclamationTriangleIcon,
        bgColor: 'bg-orange-900/60',
        textColor: 'text-orange-200',
        iconColor: 'text-orange-400'
      },
      info: {
        icon: InformationCircleIcon,
        bgColor: 'bg-blue-900/60',
        textColor: 'text-blue-200',
        iconColor: 'text-blue-400'
      },
      success: {
        icon: CheckCircleIcon,
        bgColor: 'bg-green-900/60',
        textColor: 'text-green-200',
        iconColor: 'text-green-400'
      }
    };
    return styles[type] || styles.info;
  };

  // Get threat level color
  const getThreatLevelColor = (level) => {
    const colors = {
      'Low': 'text-green-400 bg-green-900/60',
      'Medium': 'text-yellow-400 bg-yellow-900/60',
      'High': 'text-orange-400 bg-orange-900/60',
      'Critical': 'text-red-400 bg-red-900/60'
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

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    // TODO: Implement theme switching
  };

  return (
    <header className="w-full h-20 bg-gradient-to-r from-slate-900/90 via-indigo-950/90 to-purple-950/90 backdrop-blur-xl shadow-2xl border-b border-white/10 relative z-40">
      <div className="flex items-center justify-between h-full px-8">
        {/* Left Section - Logo & System Status */}
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl shadow-lg">
              <ShieldCheckIcon className="w-7 h-7 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
                EDR System
              </span>
              <div className="text-xs text-gray-300 font-medium">Security Operations Center</div>
            </div>
          </div>

          {/* System Status Indicators */}
          <div className="flex items-center space-x-4 pl-6 border-l border-white/10">
            <div className="flex items-center space-x-2">
              <ComputerDesktopIcon className="w-4 h-4 text-green-400" />
              <span className="text-sm font-semibold text-green-400">{systemStats.agentsOnline}</span>
              <span className="text-xs text-gray-300">Online</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <ExclamationTriangleIcon className="w-4 h-4 text-red-400" />
              <span className="text-sm font-semibold text-red-400">{systemStats.criticalAlerts}</span>
              <span className="text-xs text-gray-300">Critical</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
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
              className="w-full pl-10 pr-4 py-2.5 bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder:text-gray-400 transition-all duration-200"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <kbd className="px-2 py-1 text-xs text-gray-400 bg-white/10 rounded border border-white/10">⌘K</kbd>
            </div>
          </form>
        </div>

        {/* Right Section - Actions & User */}
        <div className="flex items-center space-x-4">
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors duration-200"
            title="Toggle Dark Mode"
          >
            {isDarkMode ? (
              <SunIcon className="w-5 h-5" />
            ) : (
              <MoonIcon className="w-5 h-5" />
            )}
          </button>

          {/* Global Settings */}
          <button className="p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors duration-200">
            <GlobeAltIcon className="w-5 h-5" />
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors duration-200"
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
              <div className="absolute right-0 top-full mt-2 w-96 bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 z-50">
                <div className="p-4 border-b border-white/10">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-white">Notifications</h3>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-sm text-purple-400 hover:text-purple-300 font-medium"
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
                          className={`p-4 border-b border-white/10 hover:bg-white/5 transition-colors cursor-pointer ${
                            notification.unread ? 'bg-white/5' : ''
                          }`}
                          onClick={() => markAsRead(notification.id)}
                        >
                          <div className="flex items-start space-x-3">
                            <div className={`p-2 rounded-lg ${style.bgColor}`}>
                              <NotificationIcon className={`w-5 h-5 ${style.iconColor}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <h4 className={`text-sm font-semibold ${style.textColor}`}>
                                  {notification.title}
                                </h4>
                                {notification.unread && (
                                  <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                                )}
                              </div>
                              <p className="text-sm text-gray-300 mt-1">{notification.message}</p>
                              <div className="flex items-center space-x-2 mt-2">
                                <ClockIcon className="w-3 h-3 text-gray-400" />
                                <span className="text-xs text-gray-400">{notification.time}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="p-8 text-center">
                      <BellIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-300">No notifications</p>
                    </div>
                  )}
                </div>
                
                <div className="p-4 border-t border-white/10">
                  <button className="w-full text-center text-sm text-purple-400 hover:text-purple-300 font-medium">
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
              className="flex items-center space-x-3 p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors duration-200"
            >
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
              ) : (
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full flex items-center justify-center">
                  <UserIcon className="w-5 h-5 text-white" />
                </div>
              )}
              <div className="hidden md:block text-left">
                <div className="text-sm font-medium text-white">{user.name}</div>
                <div className="text-xs text-gray-300">{user.role}</div>
              </div>
              <ChevronDownIcon className="w-4 h-4" />
            </button>

            {/* User Dropdown */}
            {showUserMenu && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 z-50">
                <div className="p-4 border-b border-white/10">
                  <div className="flex items-center space-x-3">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full" />
                    ) : (
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full flex items-center justify-center">
                        <UserIcon className="w-6 h-6 text-white" />
                      </div>
                    )}
                    <div>
                      <div className="text-sm font-semibold text-white">{user.name}</div>
                      <div className="text-xs text-gray-300">{user.role}</div>
                    </div>
                  </div>
                </div>
                
                <div className="py-2">
                  <button className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-colors">
                    <UserIcon className="w-4 h-4" />
                    <span>Profile</span>
                  </button>
                  <button className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-colors">
                    <KeyIcon className="w-4 h-4" />
                    <span>Change Password</span>
                  </button>
                  <button className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-colors">
                    <Cog6ToothIcon className="w-4 h-4" />
                    <span>Settings</span>
                  </button>
                  <button className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-colors">
                    <WrenchScrewdriverIcon className="w-4 h-4" />
                    <span>Preferences</span>
                  </button>
                </div>
                
                <div className="p-4 border-t border-white/10">
                  <button className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-colors">
                    <ArrowRightOnRectangleIcon className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Last Update Indicator */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 opacity-50"></div>
    </header>
  );
};

export default Header;