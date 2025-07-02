import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  ChevronLeftIcon,
  ChevronDownIcon,
  PlusIcon,
  EyeIcon,
  CpuChipIcon,
  GlobeAltIcon,
  DocumentTextIcon,
  FireIcon,
  UsersIcon,
  CloudIcon,
  ArrowLeftOnRectangleIcon,
  LockClosedIcon
} from '@heroicons/react/24/outline';
import { fetchDashboardStats, fetchAlerts, fetchThreats, fetchAgents } from '../../service/api';

const Sidebar = ({ currentPath = '/', user = { role: 'admin' } }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('DASHBOARD');
  const [expandedMenus, setExpandedMenus] = useState({});
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [systemStats, setSystemStats] = useState({ agentsOnline: 0, agentsOffline: 0, version: '', license: 'Enterprise', status: 'Online' });
  const [alertCount, setAlertCount] = useState(0);
  const [threatCount, setThreatCount] = useState(0);
  const [agentCount, setAgentCount] = useState({ online: 0, offline: 0 });

  // Fetch system stats and counts
  useEffect(() => {
    const fetchSidebarData = async () => {
      try {
        const [stats, alerts, threats, agents] = await Promise.all([
          fetchDashboardStats(),
          fetchAlerts(),
          fetchThreats(),
          fetchAgents()
        ]);
        setSystemStats({
          agentsOnline: stats?.agents?.online || 0,
          agentsOffline: stats?.agents?.offline || 0,
          version: stats?.version || '1.0.0',
          license: stats?.license || 'Enterprise',
          status: stats?.status || 'Online'
        });
        setAlertCount(alerts?.alerts?.length || 0);
        setThreatCount(threats?.threats?.length || 0);
        setAgentCount({
          online: agents?.agents?.filter(a => a.status === 'online').length || 0,
          offline: agents?.agents?.filter(a => a.status !== 'online').length || 0
        });
      } catch (err) {
        // fallback: do not update counts
      }
    };
    fetchSidebarData();
    const interval = setInterval(fetchSidebarData, 30000);
    return () => clearInterval(interval);
  }, []);

  // Menu config
  const menuConfig = [
    {
      section: 'Main',
      items: [
        {
          label: 'Dashboard',
          icon: HomeIcon,
          to: '/',
          badge: null,
          roles: ['admin', 'analyst', 'user'],
          description: 'Security overview dashboard'
        },
        {
          label: 'Agents',
          icon: ComputerDesktopIcon,
          to: '/agents',
          badge: agentCount.online,
          badgeColor: 'bg-green-600',
          roles: ['admin', 'analyst'],
          description: 'Manage endpoint agents'
        },
        {
          label: 'Events',
          icon: DocumentTextIcon,
          to: '/events',
          badge: null,
          roles: ['admin', 'analyst'],
          description: 'System activity logs'
        },
        {
          label: 'Alerts',
          icon: ExclamationTriangleIcon,
          to: '/alerts',
          badge: alertCount,
          badgeColor: 'bg-red-600',
          roles: ['admin', 'analyst'],
          description: 'Active security incidents'
        },
        {
          label: 'Rules',
          icon: BoltIcon,
          to: '/rules',
          badge: null,
          roles: ['admin', 'analyst'],
          description: 'Detection rules management'
        },
        {
          label: 'Threats',
          icon: FireIcon,
          to: '/threats',
          badge: threatCount,
          badgeColor: 'bg-orange-600',
          roles: ['admin', 'analyst'],
          description: 'Threat intelligence feeds'
        },
        {
          label: 'Threat Hunt',
          icon: ShieldCheckIcon,
          to: '/threat-hunt',
          badge: null,
          roles: ['admin', 'analyst'],
          description: 'Proactive threat hunting'
        },
        {
          label: 'Network',
          icon: GlobeAltIcon,
          to: '/network',
          badge: null,
          roles: ['admin', 'analyst'],
          description: 'Network traffic analysis'
        },
        {
          label: 'Users',
          icon: UserGroupIcon,
          to: '/users',
          badge: null,
          roles: ['admin'],
          description: 'User management'
        },
        {
          label: 'Backup',
          icon: CloudIcon,
          to: '/backup',
          badge: null,
          roles: ['admin'],
          description: 'Backup & recovery'
        },
        {
          label: 'Integrations',
          icon: CpuChipIcon,
          to: '/integrations',
          badge: null,
          roles: ['admin'],
          description: 'Third-party integrations'
        },
        {
          label: 'Settings',
          icon: Cog6ToothIcon,
          to: '/settings',
          badge: null,
          roles: ['admin', 'analyst', 'user'],
          description: 'System settings'
        }
      ]
    }
  ];

  // Check if menu item is active
  const isActive = (path) => {
    if (path === '/' && currentPath === '/') return true;
    if (path !== '/' && currentPath.includes(path)) return true;
    return false;
  };

  // Handle navigation
  const handleNavigation = (path) => {
    navigate(path);
  };

  // Responsive: collapse on small screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) setIsCollapsed(true);
      else setIsCollapsed(false);
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <aside className={`h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 text-white shadow-2xl border-r border-white/20 flex flex-col transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-72'} z-30`}>
      {/* Header */}
      <div className="p-6 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl shadow-lg flex items-center justify-center">
            <ShieldCheckIcon className="w-6 h-6 text-white" />
          </div>
          {!isCollapsed && (
            <div>
              <h1 className="font-bold text-white text-lg bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">EDR System</h1>
              <div className="text-xs text-gray-300 font-medium">{systemStats.license} • v{systemStats.version}</div>
            </div>
          )}
        </div>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronRightIcon className="w-5 h-5" /> : <ChevronLeftIcon className="w-5 h-5" />}
        </button>
      </div>
      {/* System status */}
      {!isCollapsed && (
        <div className="px-6 py-2 flex items-center gap-3 text-xs text-gray-300 border-b border-white/10">
          <span className={`w-2 h-2 rounded-full ${systemStats.status === 'Online' ? 'bg-green-500' : 'bg-red-500'} animate-pulse`}></span>
          <span>{systemStats.status}</span>
          <span className="ml-2">Agents: <span className="text-green-400 font-bold">{systemStats.agentsOnline}</span>/<span className="text-gray-400">{systemStats.agentsOnline + systemStats.agentsOffline}</span></span>
        </div>
      )}
      {/* Menu */}
      <nav className="flex-1 overflow-y-auto py-4">
        {menuConfig.map(section => (
          <div key={section.section} className="mb-4">
            {!isCollapsed && <div className="px-6 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">{section.section}</div>}
            <ul className="space-y-1">
              {section.items.filter(item => item.roles.includes(user.role)).map(item => (
                <li key={item.label}>
                  <button
                    onClick={() => handleNavigation(item.to)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group relative ${
                      isActive(item.to)
                        ? 'bg-purple-700/80 text-white shadow-lg'
                        : 'text-gray-300 hover:bg-white/10 hover:text-white'
                    }`}
                    title={isCollapsed ? item.label : undefined}
                  >
                    <item.icon className="w-5 h-5" />
                    {!isCollapsed && <span className="font-medium flex-1 text-left">{item.label}</span>}
                    {item.badge !== null && item.badge !== undefined && item.badge > 0 && (
                      <span className={`ml-auto text-xs font-bold px-2 py-0.5 rounded-full ${item.badgeColor || 'bg-purple-600'} text-white animate-pulse`}>{item.badge}</span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
      {/* Footer */}
      <div className="p-4 border-t border-white/10 text-xs text-gray-400 flex flex-col gap-2 items-center">
        <div className="flex items-center gap-2">
          <LockClosedIcon className="w-4 h-4" />
          <span>Secured by EDR</span>
        </div>
        <div className="flex items-center gap-2">
          <ArrowLeftOnRectangleIcon className="w-4 h-4" />
          <span>Logout</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;