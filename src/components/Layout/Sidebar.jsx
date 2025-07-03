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
  const [wsError, setWsError] = useState(false);

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
          online: agents?.agents?.filter(a => {
            const s = (a.status || '').toLowerCase();
            return s === 'online' || s === 'active';
          }).length || 0,
          offline: agents?.agents?.filter(a => {
            const s = (a.status || '').toLowerCase();
            return s === 'offline';
          }).length || 0
        });
      } catch (err) {
        // fallback: do not update counts
      }
    };
    fetchSidebarData();
    const interval = setInterval(fetchSidebarData, 10000);

    // Tắt hoàn toàn WebSocket, chỉ dùng polling
    setWsError(true); // Luôn báo lỗi WebSocket để hiển thị cảnh báo
    // Polling 10s
    const interval2 = setInterval(() => {
      // Gọi API lấy dữ liệu agent (hoặc dữ liệu cần thiết)
      // fetchAgents() hoặc API tương ứng
    }, 10000);
    return () => {
      clearInterval(interval);
      clearInterval(interval2);
    };
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
          badgeColor: agentCount.online > 0 ? 'bg-green-600' : 'bg-gray-400',
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
          label: 'Settings',
          icon: Cog6ToothIcon,
          to: '/settings',
          badge: null,
          roles: ['admin', 'analyst', 'user'],
          description: 'System settings'
        }
      ].filter(item => !['Backup', 'Integrations', 'Users'].includes(item.label))
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
    <aside className={`h-screen bg-white dark:bg-gradient-to-br dark:from-slate-900 dark:via-indigo-950 dark:to-purple-950 text-gray-900 dark:text-white border-r border-gray-200 dark:border-white/20 shadow-lg flex flex-col transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-72'} z-30`}>
      {/* Header */}
      <div className="py-6 border-b border-gray-100 dark:border-white/10 flex flex-col items-center gap-2">
        <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg">
          <ShieldCheckIcon className="w-8 h-8 text-white" />
        </div>
        {!isCollapsed && (
          <>
            <div className="text-xl font-extrabold bg-gradient-to-r from-purple-500 to-indigo-500 bg-clip-text text-transparent drop-shadow">EDR System</div>
          </>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute top-6 right-4 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 text-gray-400 dark:text-gray-300 hover:text-purple-500 dark:hover:text-white transition-colors"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronRightIcon className="w-5 h-5" /> : <ChevronLeftIcon className="w-5 h-5" />}
        </button>
      </div>
      {/* System status */}
      {!isCollapsed && (
        <div className={`px-6 py-3 flex items-center gap-4 border-b border-white/10 transition-colors duration-200
          text-base font-semibold
          ${'text-gray-700 dark:text-gray-200'}
        `}>
          <span className={`w-3 h-3 rounded-full ${systemStats.status === 'Online' ? 'bg-green-500' : 'bg-red-500'} animate-pulse`}></span>
          <span>{systemStats.status}</span>
          <span className="ml-3">Agents: <span className={`font-bold ${'text-green-600 dark:text-green-400'}`}>{systemStats.agentsOnline}</span>/<span className="text-gray-400">{systemStats.agentsOnline + systemStats.agentsOffline}</span></span>
        </div>
      )}
      {/* Menu */}
      <nav className="flex-1 px-2 py-4">
        {menuConfig.map(section => (
          <div key={section.section} className="mb-6">
            <div className="text-xs font-bold uppercase text-gray-400 dark:text-gray-500 px-2 mb-2 tracking-wider">{section.section}</div>
            {section.items.map(item => {
              let iconColor = '';
              if (isActive(item.to)) {
                iconColor = 'text-purple-600 dark:text-white';
              } else {
                switch (item.label) {
                  case 'Dashboard': iconColor = 'text-blue-500'; break;
                  case 'Agents': iconColor = 'text-emerald-500'; break;
                  case 'Events': iconColor = 'text-cyan-500'; break;
                  case 'Alerts': iconColor = 'text-purple-500'; break;
                  case 'Rules': iconColor = 'text-yellow-500'; break;
                  case 'Threats': iconColor = 'text-orange-500'; break;
                  case 'Threat Hunt': iconColor = 'text-pink-500'; break;
                  case 'Network': iconColor = 'text-sky-500'; break;
                  case 'Settings': iconColor = 'text-gray-500'; break;
                  default: iconColor = 'text-gray-400 dark:text-gray-400';
                }
              }
              return (
                <button
                  key={item.label}
                  onClick={() => handleNavigation(item.to)}
                  className={`group flex items-center gap-3 w-full px-4 py-3 my-1 rounded-xl transition-colors duration-200 relative
                    ${isActive(item.to)
                      ? 'bg-purple-50 text-purple-700 font-bold shadow-sm border-l-4 border-purple-500 dark:bg-purple-700 dark:text-white dark:border-l-0'
                      : 'hover:bg-gray-100 text-gray-700 dark:text-gray-200 dark:hover:bg-white/10'}
                  `}
                  title={item.description}
                >
                  <item.icon className={`w-6 h-6 transition-colors duration-200 ${iconColor} group-hover:scale-110`} />
                  {!isCollapsed && <span className="flex-1 text-left font-semibold">{item.label}</span>}
                  {!isCollapsed && item.badge != null && (
                    <span
                      className={`ml-auto px-2 py-0.5 rounded-full font-bold shadow-sm text-xs transition-colors duration-200
                        ${item.badgeColor} text-white border border-gray-300 dark:border-gray-600`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </nav>
      {/* Footer */}
      <div className="p-4 border-t border-white/10 text-xs text-gray-400 flex flex-col gap-2 items-center">
        <div className={`flex items-center gap-2 text-base font-semibold transition-colors duration-200
          ${'text-gray-600 dark:text-gray-200'}
        `}>
          <LockClosedIcon className={`w-5 h-5 ${'text-gray-500 dark:text-gray-300'}`} />
          <span>Secured by EDR</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;