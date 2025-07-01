import React from 'react';
import { HomeIcon, UserGroupIcon, BellAlertIcon, ExclamationTriangleIcon, BoltIcon, ShieldCheckIcon, Cog6ToothIcon, TableCellsIcon } from '@heroicons/react/24/outline';
import { NavLink } from 'react-router-dom';

const menu = [
  { label: 'Dashboard', icon: <HomeIcon className="w-6 h-6" />, to: '/' },
  { label: 'Agents', icon: <UserGroupIcon className="w-6 h-6" />, to: '/agents' },
  { label: 'Events', icon: <TableCellsIcon className="w-6 h-6" />, to: '/events' },
  { label: 'Alerts', icon: <BellAlertIcon className="w-6 h-6" />, to: '/alerts' },
  { label: 'Rules', icon: <BoltIcon className="w-6 h-6" />, to: '/rules' },
  { label: 'Threats', icon: <ShieldCheckIcon className="w-6 h-6" />, to: '/threats' },
  { label: 'Settings', icon: <Cog6ToothIcon className="w-6 h-6" />, to: '/settings' },
];

const Sidebar = () => (
  <aside className="h-screen w-64 bg-gradient-to-b from-blue-50 to-white border-r shadow-lg flex flex-col">
    <div className="p-6 flex items-center space-x-3">
      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center shadow-lg">
        <ShieldCheckIcon className="w-6 h-6 text-white" />
      </div>
      <div>
        <h1 className="text-xl font-bold text-blue-700">EDR System</h1>
        <p className="text-xs text-blue-400">Security Platform</p>
      </div>
    </div>
    <nav className="flex-1">
      <ul className="space-y-1 mt-4">
        {menu.map(item => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              className={({ isActive }) =>
                `flex items-center px-5 py-3 rounded-lg transition-colors duration-150 ${isActive ? 'bg-blue-100 text-blue-700 font-semibold' : 'text-gray-700 hover:bg-blue-50'}`
              }
              end={item.to === '/'}
            >
              {item.icon}
              <span className="ml-3">{item.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
    <div className="p-4 text-xs text-gray-400 border-t">© 2024 EDR System</div>
  </aside>
);

export default Sidebar;