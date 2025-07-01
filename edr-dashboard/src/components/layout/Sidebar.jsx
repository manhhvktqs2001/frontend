import React from 'react';
import { NavLink } from 'react-router-dom';
import { clsx } from 'clsx';
import {
  HomeIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  ComputerDesktopIcon,
  DocumentTextIcon,
  Cog6ToothIcon,
  ShieldCheckIcon,
  BugAntIcon,
  UserGroupIcon,
  ServerIcon,
  XMarkIcon,
  BellIcon,
  ChartPieIcon,
  DocumentChartBarIcon,
  CommandLineIcon
} from '@heroicons/react/24/outline';

const Sidebar = ({ isOpen, onClose, isMobile }) => {
  const navigation = [
    {
      name: 'Dashboard',
      href: '/',
      icon: HomeIcon,
      description: 'Overview and statistics'
    },
    {
      name: 'Analytics',
      href: '/analytics',
      icon: ChartBarIcon,
      description: 'Advanced analytics and insights'
    },
    {
      name: 'Events',
      href: '/events',
      icon: DocumentTextIcon,
      description: 'Security events and logs'
    },
    {
      name: 'Agents',
      href: '/agents',
      icon: ComputerDesktopIcon,
      description: 'Endpoint agents management'
    },
    {
      name: 'Alerts',
      href: '/alerts',
      icon: ExclamationTriangleIcon,
      description: 'Security alerts and notifications'
    },
    {
      name: 'Threats',
      href: '/threats',
      icon: BugAntIcon,
      description: 'Threat intelligence and IOCs'
    },
    {
      name: 'Rules',
      href: '/rules',
      icon: ShieldCheckIcon,
      description: 'Detection rules and policies'
    },
    {
      name: 'Reports',
      href: '/reports',
      icon: DocumentChartBarIcon,
      description: 'Security reports and compliance'
    },
    {
      name: 'AI Assistant',
      href: '/ai',
      icon: CommandLineIcon,
      description: 'AI-powered security assistant'
    },
    {
      name: 'Settings',
      href: '/settings',
      icon: Cog6ToothIcon,
      description: 'System configuration'
    }
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <div className={clsx(
        'fixed inset-y-0 left-0 z-50 w-64 bg-slate-900/95 backdrop-blur-xl border-r border-white/10 transform transition-transform duration-300 ease-in-out',
        isMobile && !isOpen && '-translate-x-full',
        'lg:translate-x-0 lg:static lg:inset-0'
      )}>
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <ShieldCheckIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">EDR Security</h1>
              <p className="text-xs text-gray-400">v3.0.0</p>
            </div>
          </div>
          
          {/* Close button for mobile */}
          {isMobile && (
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white lg:hidden"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) => clsx(
                'group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 relative overflow-hidden',
                isActive
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  : 'text-gray-300 hover:bg-white/10 hover:text-white'
              )}
              onClick={isMobile ? onClose : undefined}
            >
              {/* Icon */}
              <item.icon className="w-5 h-5 flex-shrink-0" />
              
              {/* Text */}
              <span className="flex-1">{item.name}</span>
              
              {/* Hover effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform -skew-x-12 -translate-x-full group-hover:translate-x-full" />
            </NavLink>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-white/10">
          <div className="bg-white/5 rounded-xl p-3">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-xs text-green-400 font-medium">System Online</span>
            </div>
            <p className="text-xs text-gray-400">
              All systems operational
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;