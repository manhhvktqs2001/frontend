import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';

const navItems = [
  { label: 'Dashboard', path: '/', icon: '🏠' },
  { label: 'Endpoints', path: '/agents', icon: '💻' },
  { label: 'Alerts', path: '/alerts', icon: '🚨' },
  { label: 'Threats', path: '/threats', icon: '🦠' },
  { label: 'Investigate', path: '/events', icon: '🔍' },
  { label: 'Analytics', path: '/analytics', icon: '📊' },
  { label: 'Configuration', path: '/settings', icon: '⚙️' },
  { label: 'Reports', path: '/reports', icon: '📄' },
  { label: 'AI Assistant', path: '/ai', icon: '🤖' },
];

export const Sidebar: React.FC = () => {
  const location = useLocation();
  return (
    <aside className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col py-6 px-4">
      <div className="mb-8">
        <div className="text-2xl font-bold text-cyan-400">SecureGuard</div>
        <div className="text-xs text-gray-400 mt-1">EDR Security Platform</div>
      </div>
      <nav className="flex-1 flex flex-col gap-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-colors text-base hover:bg-gray-800/80 ${
                isActive ? 'bg-cyan-900/80 text-cyan-300' : 'text-gray-200'
              }`
            }
            end={item.path === '/'}
          >
            <span className="text-xl">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}; 