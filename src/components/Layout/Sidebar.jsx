import React, { useState } from 'react';
import { 
  HomeIcon, 
  UserGroupIcon, 
  BellAlertIcon, 
  ExclamationTriangleIcon, 
  BoltIcon, 
  ShieldCheckIcon, 
  Cog6ToothIcon, 
  TableCellsIcon,
  ComputerDesktopIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
// NavLink will be handled by parent component routing

const Sidebar = () => {
  const [activeTab, setActiveTab] = useState('STATUS');

  const navigationTabs = [
    { id: 'STATUS', label: 'STATUS' },
    { id: 'COMPUTERS', label: 'COMPUTERS' }, 
    { id: 'SETTINGS', label: 'SETTINGS' },
    { id: 'TASKS', label: 'TASKS' }
  ];

  const dashboardMenu = [
    { 
      label: 'Security', 
      icon: ShieldCheckIcon, 
      to: '/', 
      active: true 
    },
    { 
      label: 'Risks', 
      icon: ExclamationTriangleIcon, 
      to: '/alerts' 
    },
    { 
      label: 'Web access', 
      icon: ChartBarIcon, 
      to: '/events' 
    },
    { 
      label: 'Indicators of attack (IOA)', 
      icon: BellAlertIcon, 
      to: '/threats' 
    },
    { 
      label: 'Patch Management', 
      icon: BoltIcon, 
      to: '/rules' 
    },
    { 
      label: 'Full Encryption', 
      icon: ShieldCheckIcon, 
      to: '/agents' 
    },
    { 
      label: 'Endpoint Access Enforcement', 
      icon: ComputerDesktopIcon, 
      to: '/settings' 
    }
  ];

  return (
    <aside className="h-screen w-64 bg-white shadow-lg flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center">
            <ShieldCheckIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-gray-800 text-lg">Endpoints</h1>
            <p className="text-xs text-gray-500">(WatchGuard EDR)</p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        {navigationTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`w-full text-left px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === tab.id 
                ? 'bg-teal-600 text-white border-r-2 border-teal-800' 
                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Dashboard Menu */}
      <div className="flex-1 p-4">
        <div className="mb-6">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
            DASHBOARDS
          </h3>
          <nav className="space-y-1">
            {dashboardMenu.map((item, index) => (
              <a
                key={index}
                href={item.to}
                className={`flex items-center px-3 py-2.5 text-sm rounded-lg transition-colors duration-150 ${
                  item.active
                    ? 'bg-teal-600 text-white shadow-sm' 
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <item.icon className="w-5 h-5 mr-3 flex-shrink-0" />
                <span className="truncate">{item.label}</span>
              </a>
            ))}
          </nav>
        </div>

        {/* My Lists Section */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              MY LISTS
            </h3>
            <button className="text-teal-600 text-sm font-medium hover:text-teal-700 transition-colors">
              Add
            </button>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center px-3 py-2.5 text-sm text-gray-700 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors">
              <ComputerDesktopIcon className="w-5 h-5 mr-3 text-gray-400" />
              <span>Hardware</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="text-xs text-gray-400 text-center">
          © 2024 EDR System
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;