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
    <aside className={`fixed left-0 top-0 z-50 h-full bg-white/10 backdrop-blur-xl border-r border-white/20 transition-all duration-300 ${
      isOpen ? 'w-64' : 'w-16'
    }`}>
      {/* Glass effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent"></div>
      
      <div className="relative z-10 flex flex-col h-full p-4">
        {/* Logo */}
        <div className="mb-8 flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <ShieldExclamationIcon className="w-6 h-6 text-white" />
          </div>
          {isOpen && (
            <div className="text-white">
              <div className="text-xl font-bold">SecureGuard</div>
              <div className="text-xs text-blue-200">EDR Platform</div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `
                group relative flex items-center gap-3 px-3 py-3 rounded-xl font-medium transition-all duration-200
                ${isActive 
                  ? 'bg-blue-500/20 text-blue-300 shadow-lg shadow-blue-500/25' 
                  : 'text-gray-300 hover:bg-white/10 hover:text-white'
                }
              `}
              end={item.path === '/'}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {isOpen && <span className="truncate">{item.label}</span>}
              
              {/* Active indicator */}
              <div className={`absolute right-2 w-2 h-2 rounded-full transition-all duration-200 ${
                ({ isActive }) => isActive ? 'bg-blue-400 shadow-lg shadow-blue-400/50' : 'bg-transparent'
              }`} />
              
              {/* Tooltip for collapsed state */}
              {!isOpen && (
                <div className="absolute left-16 bg-gray-900 text-white px-2 py-1 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                  {item.label}
                </div>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        {isOpen && (
          <div className="mt-auto pt-4 border-t border-white/10">
            <div className="text-xs text-gray-400 text-center">
              <div>SecureGuard v2.0</div>
              <div className="text-gray-500">by DucManh</div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};