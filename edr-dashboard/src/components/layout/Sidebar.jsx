import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  HomeIcon,
  UserGroupIcon,
  ExclamationTriangleIcon,
  ShieldExclamationIcon,
  ClockIcon,
  ChartBarIcon,
  SparklesIcon,
  DocumentChartBarIcon,
  Cog6ToothIcon,
  XMarkIcon,
  BellIcon,
  ServerIcon,
  GlobeAltIcon,
  LockClosedIcon
} from '@heroicons/react/24/outline';

const Sidebar = ({ isOpen, onClose, currentPath, systemStatus }) => {
  const navigation = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: HomeIcon,
      description: 'Security overview and metrics'
    },
    {
      name: 'Agents',
      href: '/agents',
      icon: UserGroupIcon,
      description: 'Endpoint management',
      badge: '247'
    },
    {
      name: 'Alerts',
      href: '/alerts',
      icon: ExclamationTriangleIcon,
      description: 'Security alerts and incidents',
      badge: '12',
      badgeColor: 'bg-red-500'
    },
    {
      name: 'Threats',
      href: '/threats',
      icon: ShieldExclamationIcon,
      description: 'Threat intelligence',
      badge: '3',
      badgeColor: 'bg-orange-500'
    },
    {
      name: 'Events',
      href: '/events',
      icon: ClockIcon,
      description: 'System events and logs'
    },
    {
      name: 'Analytics',
      href: '/analytics',
      icon: ChartBarIcon,
      description: 'Advanced analytics and reports'
    },
    {
      name: 'AI Assistant',
      href: '/ai',
      icon: SparklesIcon,
      description: 'AI-powered security insights',
      badge: 'NEW',
      badgeColor: 'bg-purple-500'
    },
    {
      name: 'Reports',
      href: '/reports',
      icon: DocumentChartBarIcon,
      description: 'Security reports and compliance'
    },
    {
      name: 'Settings',
      href: '/settings',
      icon: Cog6ToothIcon,
      description: 'System configuration'
    }
  ];

  const isActive = (path) => currentPath === path;

  return (
    <>
      {/* Desktop Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-80 bg-gray-900/95 backdrop-blur-xl border-r border-white/10 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <LockClosedIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">EDR v3.0.0</h1>
                <p className="text-xs text-gray-400">Security Platform</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>

          {/* System Status */}
          <div className="p-4 border-b border-white/10">
            <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-green-400">System Status</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-xs text-gray-400">Online</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-gray-400">Version:</span>
                  <span className="text-white ml-1">{systemStatus.version}</span>
                </div>
                <div>
                  <span className="text-gray-400">Agents:</span>
                  <span className="text-white ml-1">247 Active</span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto custom-scrollbar">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 ${
                    isActive(item.href)
                      ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 text-white shadow-lg'
                      : 'text-gray-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div className={`p-2 rounded-lg transition-colors ${
                    isActive(item.href)
                      ? 'bg-blue-500/20 text-blue-400'
                      : 'bg-gray-700/50 text-gray-400 group-hover:bg-white/10 group-hover:text-white'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{item.name}</span>
                      {item.badge && (
                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                          item.badgeColor || 'bg-blue-500'
                        } text-white`}>
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 group-hover:text-gray-300">
                      {item.description}
                    </p>
                  </div>
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-white/10">
            <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <SparklesIcon className="w-4 h-4 text-purple-400" />
                <span className="text-sm font-medium text-purple-400">AI Assistant</span>
              </div>
              <p className="text-xs text-gray-400 mb-2">
                Get instant security insights and recommendations
              </p>
              <Link
                to="/ai"
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-medium rounded-lg transition-colors"
              >
                <SparklesIcon className="w-3 h-3" />
                Ask AI
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;