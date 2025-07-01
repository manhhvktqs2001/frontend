import React, { useState, useEffect } from 'react';
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
  ChartBarIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  PlusIcon,
  EyeIcon,
  CpuChipIcon,
  GlobeAltIcon,
  DocumentTextIcon,
  FireIcon
} from '@heroicons/react/24/outline';

const Sidebar = ({ currentPath = '/', onNavigate = () => {} }) => {
  const [activeTab, setActiveTab] = useState('DASHBOARD');
  const [expandedMenus, setExpandedMenus] = useState({});
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Navigation tabs
  const navigationTabs = [
    { id: 'DASHBOARD', label: 'DASHBOARD' },
    { id: 'SECURITY', label: 'SECURITY' }, 
    { id: 'MANAGEMENT', label: 'MANAGEMENT' },
    { id: 'SETTINGS', label: 'SETTINGS' }
  ];

  // Menu items based on active tab
  const getMenuItems = () => {
    switch (activeTab) {
      case 'DASHBOARD':
        return [
          { 
            label: 'Security Overview', 
            icon: ShieldCheckIcon, 
            to: '/', 
            description: 'Main security dashboard',
            color: 'text-blue-600',
            bgColor: 'bg-blue-50'
          },
          { 
            label: 'Real-time Monitoring', 
            icon: ChartBarIcon, 
            to: '/monitoring',
            description: 'Live security metrics',
            color: 'text-green-600',
            bgColor: 'bg-green-50'
          },
          { 
            label: 'Threat Map', 
            icon: GlobeAltIcon, 
            to: '/threat-map',
            description: 'Global threat visualization',
            color: 'text-red-600',
            bgColor: 'bg-red-50'
          }
        ];
      
      case 'SECURITY':
        return [
          { 
            label: 'Security Alerts', 
            icon: ExclamationTriangleIcon, 
            to: '/alerts',
            description: 'Active security incidents',
            color: 'text-red-600',
            bgColor: 'bg-red-50',
            badge: 8
          },
          { 
            label: 'Threat Intelligence', 
            icon: FireIcon, 
            to: '/threats',
            description: 'IOCs and threat feeds',
            color: 'text-orange-600',
            bgColor: 'bg-orange-50',
            badge: 23
          },
          { 
            label: 'Detection Rules', 
            icon: BoltIcon, 
            to: '/rules',
            description: 'Security detection rules',
            color: 'text-yellow-600',
            bgColor: 'bg-yellow-50'
          },
          { 
            label: 'Threat Hunting', 
            icon: ShieldCheckIcon, 
            to: '/threat-hunt',
            description: 'Proactive threat hunting',
            color: 'text-purple-600',
            bgColor: 'bg-purple-50'
          }
        ];
      
      case 'MANAGEMENT':
        return [
          { 
            label: 'Endpoint Agents', 
            icon: ComputerDesktopIcon, 
            to: '/agents',
            description: 'Manage endpoint agents',
            color: 'text-blue-600',
            bgColor: 'bg-blue-50'
          },
          { 
            label: 'System Events', 
            icon: DocumentTextIcon, 
            to: '/events',
            description: 'System activity logs',
            color: 'text-indigo-600',
            bgColor: 'bg-indigo-50'
          },
          { 
            label: 'Network Monitoring', 
            icon: GlobeAltIcon, 
            to: '/network',
            description: 'Network traffic analysis',
            color: 'text-teal-600',
            bgColor: 'bg-teal-50'
          },
          { 
            label: 'User Management', 
            icon: UserGroupIcon, 
            to: '/users',
            description: 'Manage system users',
            color: 'text-green-600',
            bgColor: 'bg-green-50'
          }
        ];
      
      case 'SETTINGS':
        return [
          { 
            label: 'System Configuration', 
            icon: Cog6ToothIcon, 
            to: '/settings',
            description: 'System settings',
            color: 'text-gray-600',
            bgColor: 'bg-gray-50'
          },
          { 
            label: 'Integration Settings', 
            icon: CpuChipIcon, 
            to: '/integrations',
            description: 'Third-party integrations',
            color: 'text-blue-600',
            bgColor: 'bg-blue-50'
          },
          { 
            label: 'Backup & Recovery', 
            icon: ShieldCheckIcon, 
            to: '/backup',
            description: 'Data backup settings',
            color: 'text-green-600',
            bgColor: 'bg-green-50'
          }
        ];
      
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  // Set active tab based on current route
  useEffect(() => {
    const path = currentPath;
    if (path === '/' || path.includes('monitoring') || path.includes('threat-map')) {
      setActiveTab('DASHBOARD');
    } else if (path.includes('alerts') || path.includes('threats') || path.includes('rules') || path.includes('threat-hunt')) {
      setActiveTab('SECURITY');
    } else if (path.includes('agents') || path.includes('events') || path.includes('network') || path.includes('users')) {
      setActiveTab('MANAGEMENT');
    } else if (path.includes('settings') || path.includes('integrations') || path.includes('backup')) {
      setActiveTab('SETTINGS');
    }
  }, [currentPath]);

  // Check if menu item is active
  const isActive = (path) => {
    if (path === '/' && currentPath === '/') return true;
    if (path !== '/' && currentPath.includes(path)) return true;
    return false;
  };

  // Handle navigation
  const handleNavigation = (path) => {
    onNavigate(path);
  };

  // Toggle menu expansion
  const toggleMenu = (menuId) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuId]: !prev[menuId]
    }));
  };

  return (
    <aside className={`h-screen bg-white/90 backdrop-blur-lg shadow-2xl border-r border-white/20 flex flex-col transition-all duration-300 ${
      isCollapsed ? 'w-20' : 'w-80'
    }`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200/50 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className={`flex items-center space-x-3 ${isCollapsed ? 'justify-center' : ''}`}>
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-r from-red-600 to-pink-600 rounded-xl shadow-lg flex items-center justify-center">
                <ShieldCheckIcon className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
            </div>
            {!isCollapsed && (
              <div>
                <h1 className="font-bold text-gray-800 text-lg bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
                  EDR System
                </h1>
                <p className="text-xs text-gray-500 font-medium">Security Operations Center</p>
              </div>
            )}
          </div>
          {!isCollapsed && (
            <button
              onClick={() => setIsCollapsed(true)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRightIcon className="w-4 h-4 text-gray-500" />
            </button>
          )}
          {isCollapsed && (
            <button
              onClick={() => setIsCollapsed(false)}
              className="absolute top-6 -right-3 p-1 bg-white rounded-full shadow-lg border hover:shadow-xl transition-all"
            >
              <ChevronRightIcon className="w-3 h-3 text-gray-600" />
            </button>
          )}
        </div>
      </div>

      {/* Navigation Tabs */}
      {!isCollapsed && (
        <div className="border-b border-gray-200/50">
          {navigationTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full text-left px-6 py-4 text-sm font-bold transition-all duration-200 relative ${
                activeTab === tab.id 
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg' 
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              {activeTab === tab.id && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r-full"></div>
              )}
              <span className="relative z-10">{tab.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* Menu Items */}
      <div className="flex-1 overflow-y-auto py-4">
        {!isCollapsed && (
          <div className="px-4">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  {activeTab.replace('_', ' ')}
                </h3>
                {activeTab === 'SECURITY' && (
                  <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                    <PlusIcon className="w-4 h-4 text-gray-400" />
                  </button>
                )}
              </div>
              
              <nav className="space-y-2">
                {menuItems.map((item, index) => (
                  <div key={index} className="relative">
                    <button
                      onClick={() => handleNavigation(item.to)}
                      className={`w-full flex items-center px-4 py-3 text-sm rounded-xl transition-all duration-200 group ${
                        isActive(item.to)
                          ? `${item.bgColor} ${item.color} shadow-lg border border-white/50 backdrop-blur-sm` 
                          : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <div className={`p-2 rounded-lg mr-3 transition-all duration-200 ${
                        isActive(item.to) ? 'bg-white/20' : 'bg-gray-100 group-hover:bg-gray-200'
                      }`}>
                        <item.icon className={`w-5 h-5 transition-colors ${
                          isActive(item.to) ? item.color : 'text-gray-500 group-hover:text-gray-700'
                        }`} />
                      </div>
                      
                      <div className="flex-1 text-left">
                        <div className={`font-semibold ${isActive(item.to) ? item.color : 'text-gray-900'}`}>
                          {item.label}
                        </div>
                        <div className={`text-xs ${
                          isActive(item.to) ? `${item.color} opacity-80` : 'text-gray-500'
                        }`}>
                          {item.description}
                        </div>
                      </div>

                      {item.badge && (
                        <div className="ml-2">
                          <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                            isActive(item.to) 
                              ? 'bg-white/20 text-white' 
                              : 'bg-red-100 text-red-600'
                          }`}>
                            {item.badge}
                          </span>
                        </div>
                      )}

                      {isActive(item.to) && (
                        <div className="absolute -right-1 top-1/2 transform -translate-y-1/2">
                          <div className={`w-2 h-2 ${item.color.replace('text-', 'bg-')} rounded-full`}></div>
                        </div>
                      )}
                    </button>
                  </div>
                ))}
              </nav>
            </div>

            {/* Quick Actions */}
            {activeTab === 'SECURITY' && (
              <div className="mb-6">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">
                  QUICK ACTIONS
                </h3>
                <div className="space-y-2">
                  <button 
                    onClick={() => handleNavigation('/alerts/create')}
                    className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-700 rounded-xl transition-colors"
                  >
                    <ExclamationTriangleIcon className="w-4 h-4 mr-3" />
                    <span>Create Incident</span>
                  </button>
                  <button 
                    onClick={() => handleNavigation('/rules/create')}
                    className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-xl transition-colors"
                  >
                    <BoltIcon className="w-4 h-4 mr-3" />
                    <span>New Detection Rule</span>
                  </button>
                  <button 
                    onClick={() => handleNavigation('/threat-hunt')}
                    className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 rounded-xl transition-colors"
                  >
                    <ShieldCheckIcon className="w-4 h-4 mr-3" />
                    <span>Threat Hunt</span>
                  </button>
                </div>
              </div>
            )}

            {/* System Status */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 mb-4">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                SYSTEM STATUS
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Protection</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-semibold text-green-600">Active</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Agents</span>
                  <span className="text-sm font-semibold text-blue-600">247 Online</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Threats</span>
                  <span className="text-sm font-semibold text-orange-600">8 Active</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Collapsed Menu */}
        {isCollapsed && (
          <div className="px-2">
            {menuItems.slice(0, 6).map((item, index) => (
              <button
                key={index}
                onClick={() => handleNavigation(item.to)}
                className={`w-full p-3 mb-2 rounded-xl transition-all duration-200 relative group ${
                  isActive(item.to)
                    ? `${item.bgColor} ${item.color} shadow-lg` 
                    : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                }`}
                title={item.label}
              >
                <item.icon className="w-6 h-6 mx-auto" />
                {item.badge && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {item.badge > 9 ? '9+' : item.badge}
                  </div>
                )}
                
                {/* Tooltip */}
                <div className="absolute left-full ml-3 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm font-medium opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
                  {item.label}
                  <div className="absolute right-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-r-gray-900"></div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {!isCollapsed && (
        <div className="p-4 border-t border-gray-200/50 backdrop-blur-sm">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">A</span>
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold text-gray-900">Administrator</div>
              <div className="text-xs text-gray-500">Security Analyst</div>
            </div>
            <button 
              onClick={() => handleNavigation('/settings')}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
            >
              <Cog6ToothIcon className="w-4 h-4 text-gray-400" />
            </button>
          </div>
          
          <div className="text-xs text-gray-400 text-center space-y-1">
            <div>© 2025 EDR System</div>
            <div className="flex items-center justify-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>System Operational</span>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;