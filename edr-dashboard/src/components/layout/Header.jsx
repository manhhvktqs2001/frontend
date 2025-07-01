import React, { useState, useEffect } from 'react';
import {
  Bars3Icon,
  BellIcon,
  MagnifyingGlassIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  InformationCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const Header = ({ onMenuClick, systemStatus, isOnline }) => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'alert',
      title: 'Critical Threat Detected',
      message: 'Malware signature detected on endpoint WIN-SRV-01',
      time: '2 minutes ago',
      read: false
    },
    {
      id: 2,
      type: 'info',
      title: 'System Update Available',
      message: 'EDR v3.0.1 is ready for deployment',
      time: '1 hour ago',
      read: false
    },
    {
      id: 3,
      type: 'success',
      title: 'Backup Completed',
      message: 'System backup completed successfully',
      time: '3 hours ago',
      read: true
    }
  ]);

  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'alert':
        return <ExclamationTriangleIcon className="w-5 h-5 text-red-400" />;
      case 'info':
        return <InformationCircleIcon className="w-5 h-5 text-blue-400" />;
      case 'success':
        return <CheckCircleIcon className="w-5 h-5 text-green-400" />;
      default:
        return <BellIcon className="w-5 h-5 text-gray-400" />;
    }
  };

  return (
    <header className="bg-gray-900/80 backdrop-blur-xl border-b border-white/10 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <Bars3Icon className="w-6 h-6" />
          </button>

          {/* Search Bar */}
          <div className="relative hidden md:block">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search threats, agents, events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-80 pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* System Status Indicator */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-2 bg-white/5 rounded-lg border border-white/10">
            <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-400' : 'bg-red-400'} animate-pulse`}></div>
            <span className="text-sm text-gray-300">
              {isOnline ? 'Connected' : 'Disconnected'}
            </span>
          </div>

          {/* Refresh Button */}
          <button className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
            <ArrowPathIcon className="w-5 h-5" />
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <BellIcon className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-gray-800 border border-white/10 rounded-lg shadow-xl z-50">
                <div className="p-4 border-b border-white/10">
                  <div className="flex items-center justify-between">
                    <h3 className="text-white font-medium">Notifications</h3>
                    <button
                      onClick={() => setShowNotifications(false)}
                      className="text-gray-400 hover:text-white"
                    >
                      <XMarkIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 border-b border-white/5 hover:bg-white/5 transition-colors ${
                          !notification.read ? 'bg-blue-500/10' : ''
                        }`}
                        onClick={() => markAsRead(notification.id)}
                      >
                        <div className="flex items-start gap-3">
                          {getNotificationIcon(notification.type)}
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h4 className="text-white font-medium text-sm">
                                {notification.title}
                              </h4>
                              {!notification.read && (
                                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                              )}
                            </div>
                            <p className="text-gray-400 text-sm mt-1">
                              {notification.message}
                            </p>
                            <p className="text-gray-500 text-xs mt-2">
                              {notification.time}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-gray-400">
                      No notifications
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-3">
            <button className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
              <Cog6ToothIcon className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 p-2 bg-white/5 rounded-lg border border-white/10">
              <UserCircleIcon className="w-6 h-6 text-gray-400" />
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-white">Admin User</p>
                <p className="text-xs text-gray-400">Security Administrator</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;