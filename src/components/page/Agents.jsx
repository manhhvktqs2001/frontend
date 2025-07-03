import React, { useEffect, useState } from 'react';
import { 
  UserGroupIcon, 
  CheckCircleIcon, 
  XCircleIcon, 
  ExclamationTriangleIcon, 
  ArrowPathIcon, 
  MagnifyingGlassIcon,
  EyeIcon,
  Cog6ToothIcon,
  ArrowDownTrayIcon,
  PlusIcon,
  TrashIcon,
  PlayIcon,
  PauseIcon,
  ClockIcon,
  CpuChipIcon,
  ServerIcon,
  WifiIcon,
} from '@heroicons/react/24/outline';
import { fetchAgents } from '../../service/api';
import { useTheme } from '../../contexts/ThemeContext';

const statusMap = {
  active: { label: 'Active', color: 'text-green-400', bg: 'bg-green-900/60', icon: CheckCircleIcon },
  online: { label: 'Online', color: 'text-green-400', bg: 'bg-green-900/60', icon: CheckCircleIcon },
  offline: { label: 'Offline', color: 'text-red-400', bg: 'bg-red-900/60', icon: XCircleIcon },
  error: { label: 'Error', color: 'text-orange-400', bg: 'bg-orange-900/60', icon: ExclamationTriangleIcon },
  updating: { label: 'Updating', color: 'text-blue-400', bg: 'bg-blue-900/60', icon: ArrowPathIcon },
};

const Agents = () => {
  const { isDarkMode, isTransitioning } = useTheme();
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedAgents, setSelectedAgents] = useState([]);
  const [showDetails, setShowDetails] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const fetchAgentsData = async () => {
    setLoading(true);
    try {
      const data = await fetchAgents();
      setAgents(data.agents || []);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      setError('Cannot load agents data. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgentsData();
    // Auto refresh every 10 seconds
    const interval = setInterval(fetchAgentsData, 10000);
    return () => clearInterval(interval);
  }, []);

  const filtered = agents.filter(agent => {
    const matchesSearch = (agent.hostname || '').toLowerCase().includes(search.toLowerCase()) ||
      (agent.ip_address || '').toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === 'All' || (agent.status || '').toLowerCase() === filterStatus.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: agents.length,
    online: agents.filter(a => (a.status || '').toLowerCase() === 'online' || (a.status || '').toLowerCase() === 'active').length,
    offline: agents.filter(a => (a.status || '').toLowerCase() === 'offline').length,
    error: agents.filter(a => (a.status || '').toLowerCase() === 'error').length,
    updating: agents.filter(a => (a.status || '').toLowerCase() === 'updating').length,
  };

  const toggleSelectAgent = (agentId) => {
    setSelectedAgents(prev => 
      prev.includes(agentId) 
        ? prev.filter(id => id !== agentId)
        : [...prev, agentId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedAgents.length === filtered.length) {
      setSelectedAgents([]);
    } else {
      setSelectedAgents(filtered.map(agent => agent.agent_id || agent.AgentID));
    }
  };

  const handleBulkAction = (action) => {
    console.log(`${action} for agents:`, selectedAgents);
    setSelectedAgents([]);
  };

  const exportAgents = () => {
    const csvContent = [
      ['Hostname', 'IP Address', 'OS', 'Status', 'Last Heartbeat', 'CPU', 'Memory', 'Disk', 'Network'],
      ...filtered.map(agent => [
        agent.hostname || agent.HostName,
        agent.ip_address || agent.IPAddress,
        agent.operating_system || agent.OperatingSystem,
        agent.status,
        agent.last_heartbeat || agent.LastHeartbeat,
        `${(agent.cpu_usage ?? agent.CPUUsage) || 0}%`,
        `${(agent.memory_usage ?? agent.MemoryUsage) || 0}%`,
        `${(agent.disk_usage ?? agent.DiskUsage) || 0}%`,
        `${(agent.network_latency ?? agent.NetworkLatency) || 0} ms`
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `agents_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className={`
        min-h-screen flex items-center justify-center transition-all duration-300
        ${isDarkMode 
          ? 'bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950' 
          : 'bg-gradient-to-br from-blue-50 via-white to-indigo-50'
        }
        ${isTransitioning ? 'theme-transitioning' : ''}
      `}>
        <div className="text-center">
          <div className="relative">
            <div className={`
              w-20 h-20 border-4 rounded-full animate-spin
              ${isDarkMode ? 'border-blue-200' : 'border-blue-300'}
            `}></div>
            <div className={`
              w-20 h-20 border-4 border-t-transparent rounded-full animate-spin absolute top-0
              ${isDarkMode ? 'border-blue-600' : 'border-blue-600'}
            `}></div>
          </div>
          <h3 className={`
            mt-6 text-xl font-semibold transition-colors duration-300
            ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}
          `}>
            Loading Agents...
          </h3>
          <p className={`
            mt-2 transition-colors duration-300
            ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}
          `}>
            Fetching agent data...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`
        min-h-screen flex items-center justify-center transition-all duration-300
        ${isDarkMode 
          ? 'bg-gradient-to-br from-slate-900 via-red-900 to-pink-900' 
          : 'bg-gradient-to-br from-red-50 via-white to-pink-50'
        }
        ${isTransitioning ? 'theme-transitioning' : ''}
      `}>
        <div className="text-center max-w-md mx-auto p-8">
          <ExclamationTriangleIcon className={`
            w-16 h-16 mx-auto mb-4 transition-colors duration-300
            ${isDarkMode ? 'text-red-400' : 'text-red-500'}
          `} />
          <h3 className={`
            text-xl font-semibold mb-2 transition-colors duration-300
            ${isDarkMode ? 'text-red-200' : 'text-red-800'}
          `}>
            Connection Error
          </h3>
          <p className={`
            mb-6 transition-colors duration-300
            ${isDarkMode ? 'text-red-300' : 'text-red-600'}
          `}>
            {error}
          </p>
          <button
            onClick={fetchAgentsData}
            className={`
              px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:scale-105
              ${isDarkMode 
                ? 'bg-red-600 text-white hover:bg-red-700' 
                : 'bg-red-600 text-white hover:bg-red-700'
              }
            `}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`
      min-h-screen transition-all duration-300
      ${isDarkMode 
        ? 'bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white' 
        : 'bg-gradient-to-br from-blue-50 via-white to-indigo-50 text-gray-900'
      }
      ${isTransitioning ? 'theme-transitioning' : ''}
    `}>
      {/* Header & Stats */}
      <div className={`
        px-8 py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 
        border-b shadow-lg sticky top-0 z-20 backdrop-blur-xl transition-all duration-300
        ${isDarkMode 
          ? 'border-white/10 bg-white/10' 
          : 'border-gray-200/50 bg-white/80'
        }
      `}>
        <div className="flex items-center gap-4">
          <div className={`
            p-3 rounded-xl shadow-lg transition-all duration-300
            ${isDarkMode 
              ? 'bg-gradient-to-br from-blue-600 to-indigo-600' 
              : 'bg-gradient-to-br from-blue-500 to-indigo-500'
            }
          `}>
            <UserGroupIcon className="w-8 h-8 text-white drop-shadow-lg" />
          </div>
          <div>
            <h1 className={`
              text-3xl font-bold tracking-tight transition-colors duration-300
              ${isDarkMode 
                ? 'bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent' 
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent'
              }
            `}>
              Agents
            </h1>
            <p className={`
              text-sm mt-1 transition-colors duration-300
              ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}
            `}>
              Manage and monitor endpoint agents
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={fetchAgentsData}
            disabled={loading}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg font-medium disabled:opacity-50 shadow-lg
              transition-all duration-200 hover:scale-105
              ${isDarkMode 
                ? 'bg-blue-600 text-white hover:bg-blue-700' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
              }
            `}
          >
            <ArrowPathIcon className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            onClick={exportAgents}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg font-medium shadow-lg
              transition-all duration-200 hover:scale-105
              ${isDarkMode 
                ? 'bg-green-600 text-white hover:bg-green-700' 
                : 'bg-green-600 text-white hover:bg-green-700'
              }
            `}
          >
            <ArrowDownTrayIcon className="w-5 h-5" />
            Export
          </button>
          <button className={`
            flex items-center gap-2 px-4 py-2 rounded-lg font-medium shadow-lg
            transition-all duration-200 hover:scale-105
            ${isDarkMode 
              ? 'bg-purple-600 text-white hover:bg-purple-700' 
              : 'bg-purple-600 text-white hover:bg-purple-700'
            }
          `}>
            <PlusIcon className="w-5 h-5" />
            Add Agent
          </button>
          <div className={`
            flex items-center gap-2 text-sm transition-colors duration-300
            ${isDarkMode ? 'text-gray-200' : 'text-gray-600'}
          `}>
            <ClockIcon className="w-4 h-4" />
            <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="p-8 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className={`
          rounded-2xl shadow-2xl p-6 flex flex-col gap-2 hover:scale-[1.03] 
          transition-all duration-300 border
          ${isDarkMode 
            ? 'bg-gradient-to-br from-blue-700 to-blue-900 border-white/10' 
            : 'bg-gradient-to-br from-blue-500 to-blue-700 border-blue-200'
          }
        `}>
          <div className="flex items-center gap-3 mb-2">
            <UserGroupIcon className={`
              w-8 h-8 transition-colors duration-300
              ${isDarkMode ? 'text-blue-300' : 'text-blue-100'}
            `} />
            <span className={`
              text-lg font-semibold transition-colors duration-300
              ${isDarkMode ? 'text-blue-100' : 'text-blue-100'}
            `}>
              Total
            </span>
          </div>
          <div className="text-4xl font-bold text-white drop-shadow-lg">{stats.total}</div>
        </div>
        <div className={`
          rounded-2xl shadow-2xl p-6 flex flex-col gap-2 hover:scale-[1.03] 
          transition-all duration-300 border
          ${isDarkMode 
            ? 'bg-gradient-to-br from-green-700 to-emerald-900 border-white/10' 
            : 'bg-gradient-to-br from-green-500 to-emerald-700 border-green-200'
          }
        `}>
          <div className="flex items-center gap-3 mb-2">
            <CheckCircleIcon className={`
              w-8 h-8 transition-colors duration-300
              ${isDarkMode ? 'text-green-300' : 'text-green-100'}
            `} />
            <span className={`
              text-lg font-semibold transition-colors duration-300
              ${isDarkMode ? 'text-green-100' : 'text-green-100'}
            `}>
              Online
            </span>
          </div>
          <div className="text-4xl font-bold text-white drop-shadow-lg">{stats.online}</div>
        </div>
        <div className={`
          rounded-2xl shadow-2xl p-6 flex flex-col gap-2 hover:scale-[1.03] 
          transition-all duration-300 border
          ${isDarkMode 
            ? 'bg-gradient-to-br from-red-700 to-pink-900 border-white/10' 
            : 'bg-gradient-to-br from-red-500 to-pink-700 border-red-200'
          }
        `}>
          <div className="flex items-center gap-3 mb-2">
            <XCircleIcon className={`
              w-8 h-8 transition-colors duration-300
              ${isDarkMode ? 'text-red-300' : 'text-red-100'}
            `} />
            <span className={`
              text-lg font-semibold transition-colors duration-300
              ${isDarkMode ? 'text-red-100' : 'text-red-100'}
            `}>
              Offline
            </span>
          </div>
          <div className="text-4xl font-bold text-white drop-shadow-lg">{stats.offline}</div>
        </div>
        <div className={`
          rounded-2xl shadow-2xl p-6 flex flex-col gap-2 hover:scale-[1.03] 
          transition-all duration-300 border
          ${isDarkMode 
            ? 'bg-gradient-to-br from-orange-700 to-yellow-900 border-white/10' 
            : 'bg-gradient-to-br from-orange-500 to-yellow-700 border-orange-200'
          }
        `}>
          <div className="flex items-center gap-3 mb-2">
            <ExclamationTriangleIcon className={`
              w-8 h-8 transition-colors duration-300
              ${isDarkMode ? 'text-orange-300' : 'text-orange-100'}
            `} />
            <span className={`
              text-lg font-semibold transition-colors duration-300
              ${isDarkMode ? 'text-orange-100' : 'text-orange-100'}
            `}>
              Error
            </span>
          </div>
          <div className="text-4xl font-bold text-white drop-shadow-lg">{stats.error}</div>
        </div>
      </div>

      {/* Filters & Bulk Actions */}
      <div className="px-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="flex gap-2">
          <div className="relative">
            <MagnifyingGlassIcon className={`
              w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-300
              ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}
            `} />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search hostname or IP..."
              className={`
                pl-10 pr-4 py-2 border rounded-lg transition-all duration-300
                focus:ring-2 focus:ring-blue-500 focus:border-transparent
                ${isDarkMode 
                  ? 'bg-white/10 border-white/10 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }
              `}
            />
          </div>
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className={`
              px-4 py-2 border rounded-lg transition-all duration-300
              focus:ring-2 focus:ring-blue-500 focus:border-transparent
              ${isDarkMode 
                ? 'bg-white/10 border-white/10 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
              }
            `}
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Online">Online</option>
            <option value="Offline">Offline</option>
            <option value="Error">Error</option>
            <option value="Updating">Updating</option>
          </select>
        </div>
        {selectedAgents.length > 0 && (
          <div className={`
            flex gap-2 items-center px-4 py-2 rounded-lg shadow-lg transition-all duration-300
            ${isDarkMode ? 'bg-blue-900/60' : 'bg-blue-100'}
          `}>
            <span className={`
              font-medium transition-colors duration-300
              ${isDarkMode ? 'text-blue-200' : 'text-blue-800'}
            `}>
              {selectedAgents.length} selected
            </span>
            <button className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors">
              Enable
            </button>
            <button className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors">
              Disable
            </button>
            <button className="px-3 py-1 bg-orange-600 text-white rounded text-sm hover:bg-orange-700 transition-colors">
              Restart
            </button>
          </div>
        )}
      </div>

      {/* If no agents found, show message but keep search/filter visible */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24">
          <UserGroupIcon className={`
            w-20 h-20 mb-6 opacity-30 transition-colors duration-300
            ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}
          `} />
          <h3 className={`
            text-2xl font-semibold mb-2 transition-colors duration-300
            ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}
          `}>
            No Agents Found
          </h3>
          <p className={`
            mb-6 transition-colors duration-300
            ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}
          `}>
            No endpoint agents match your search or filter criteria.
          </p>
        </div>
      ) : (
        <div className={`
          px-8 overflow-x-auto rounded-2xl shadow-2xl border transition-all duration-300
          ${isDarkMode 
            ? 'bg-white/10 border-white/10' 
            : 'bg-white/80 border-white/20'
          }
        `}>
          <table className="min-w-full divide-y divide-white/10">
            <thead className={`
              transition-all duration-300
              ${isDarkMode ? 'bg-white/5' : 'bg-gray-50/80'}
            `}>
              <tr>
                <th className="px-2 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedAgents.length === filtered.length && filtered.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className={`
                  px-2 py-3 text-left text-xs font-bold uppercase tracking-wider w-32
                  transition-colors duration-300
                  ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}
                `}>
                  Hostname
                </th>
                <th className={`
                  px-2 py-3 text-left text-xs font-bold uppercase tracking-wider w-24
                  transition-colors duration-300
                  ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}
                `}>
                  IP Address
                </th>
                <th className={`
                  px-2 py-3 text-left text-xs font-bold uppercase tracking-wider w-32
                  transition-colors duration-300
                  ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}
                `}>
                  OS
                </th>
                <th className={`
                  px-2 py-3 text-left text-xs font-bold uppercase tracking-wider w-24
                  transition-colors duration-300
                  ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}
                `}>
                  Status
                </th>
                <th className={`
                  px-2 py-3 text-left text-xs font-bold uppercase tracking-wider w-40
                  transition-colors duration-300
                  ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}
                `}>
                  Last Heartbeat
                </th>
                <th className={`
                  px-2 py-3 text-left text-xs font-bold uppercase tracking-wider min-w-40
                  transition-colors duration-300
                  ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}
                `}>
                  Performance
                </th>
                <th className={`
                  px-2 py-3 text-left text-xs font-bold uppercase tracking-wider min-w-32
                  transition-colors duration-300
                  ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}
                `}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className={`
              divide-y transition-all duration-300
              ${isDarkMode 
                ? 'bg-white/5 divide-white/10' 
                : 'bg-white/80 divide-gray-200'
              }
            `}>
              {filtered.map(agent => {
                const status = statusMap[(agent.status || '').toLowerCase()] || statusMap['offline'];
                const StatusIcon = status.icon;
                return (
                  <tr key={agent.agent_id || agent.AgentID} className={`
                    transition-all duration-200
                    ${isDarkMode 
                      ? 'hover:bg-blue-900/30' 
                      : 'hover:bg-blue-50'
                    }
                  `}>
                    <td className="px-2 py-4">
                      <input
                        type="checkbox"
                        checked={selectedAgents.includes(agent.agent_id || agent.AgentID)}
                        onChange={() => toggleSelectAgent(agent.agent_id || agent.AgentID)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className={`
                      px-2 py-4 whitespace-nowrap w-32 font-medium transition-colors duration-300
                      ${isDarkMode ? 'text-white' : 'text-gray-900'}
                    `}>
                      {agent.hostname || agent.HostName}
                    </td>
                    <td className={`
                      px-2 py-4 whitespace-nowrap w-24 transition-colors duration-300
                      ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}
                    `}>
                      {agent.ip_address || agent.IPAddress}
                    </td>
                    <td className={`
                      px-2 py-4 whitespace-nowrap w-32 transition-colors duration-300
                      ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}
                    `}>
                      {agent.operating_system || agent.OperatingSystem}
                    </td>
                    <td className="px-2 py-4 whitespace-nowrap w-24">
                      <div className={`flex items-center gap-2 px-2 py-1 rounded-lg w-fit
                        ${status.label === 'Offline'
                          ? isDarkMode
                            ? 'bg-red-900/60 border border-red-800 text-red-400'
                            : 'bg-red-100 border border-red-200 text-red-600'
                          : status.bg + ' ' + status.color
                        }
                        transition-all duration-200
                      `}>
                        <StatusIcon className={`w-5 h-5 ${status.label === 'Offline' ? (isDarkMode ? 'text-red-400' : 'text-red-600') : status.color}`} />
                        <span className={`font-semibold ${status.label === 'Offline' ? (isDarkMode ? 'text-red-400' : 'text-red-600') : status.color}`}>
                          {status.label}
                        </span>
                      </div>
                    </td>
                    <td className={`
                      px-2 py-4 whitespace-nowrap w-40 transition-colors duration-300
                      ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}
                    `}>
                      {agent.last_heartbeat || agent.LastHeartbeat}
                    </td>
                    <td className="px-2 py-4 whitespace-nowrap min-w-40">
                      <div className="flex flex-row items-center gap-2 text-xs">
                        <div className="flex flex-row items-center" title="CPU Usage">
                          <CpuChipIcon className="w-4 h-4 text-blue-400" />
                          <span className={`
                            font-medium ml-1 transition-colors duration-300
                            ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}
                          `}>
                            {(agent.cpu_usage ?? agent.CPUUsage ?? 0) !== '' ? `${agent.cpu_usage ?? agent.CPUUsage ?? 0}%` : '--'}
                          </span>
                        </div>
                        <div className="flex flex-row items-center" title="Memory Usage">
                          <ServerIcon className="w-4 h-4 text-green-400" />
                          <span className={`
                            font-medium ml-1 transition-colors duration-300
                            ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}
                          `}>
                            {(agent.memory_usage ?? agent.MemoryUsage ?? 0) !== '' ? `${agent.memory_usage ?? agent.MemoryUsage ?? 0}%` : '--'}
                          </span>
                        </div>
                        <div className="flex flex-row items-center" title="Disk Usage">
                          <ServerIcon className="w-4 h-4 text-purple-400" />
                          <span className={`
                            font-medium ml-1 transition-colors duration-300
                            ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}
                          `}>
                            {(agent.disk_usage ?? agent.DiskUsage ?? 0) !== '' ? `${agent.disk_usage ?? agent.DiskUsage ?? 0}%` : '--'}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-2 py-4 whitespace-nowrap min-w-32">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setShowDetails(agent)}
                          className={`
                            p-1 rounded transition-colors duration-200
                            ${isDarkMode 
                              ? 'text-blue-400 hover:bg-blue-900/40' 
                              : 'text-blue-600 hover:bg-blue-100'
                            }
                          `}
                          title="View Details"
                        >
                          <EyeIcon className="w-4 h-4" />
                        </button>
                        <button
                          className={`
                            p-1 rounded transition-colors duration-200
                            ${isDarkMode 
                              ? 'text-green-400 hover:bg-green-900/40' 
                              : 'text-green-600 hover:bg-green-100'
                            }
                          `}
                          title="Enable Agent"
                        >
                          <PlayIcon className="w-4 h-4" />
                        </button>
                        <button
                          className={`
                            p-1 rounded transition-colors duration-200
                            ${isDarkMode 
                              ? 'text-orange-400 hover:bg-orange-900/40' 
                              : 'text-orange-600 hover:bg-orange-100'
                            }
                          `}
                          title="Configure Agent"
                        >
                          <Cog6ToothIcon className="w-4 h-4" />
                        </button>
                        <button
                          className={`
                            p-1 rounded transition-colors duration-200
                            ${isDarkMode 
                              ? 'text-red-400 hover:bg-red-900/40' 
                              : 'text-red-600 hover:bg-red-100'
                            }
                          `}
                          title="Remove Agent"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Agent Details Modal */}
      {showDetails && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`
            rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto border shadow-2xl
            transition-all duration-300
            ${isDarkMode 
              ? 'bg-gray-900/95 border-white/10' 
              : 'bg-white/95 border-gray-200/50'
            }
          `}>
            <div className="flex items-center justify-between mb-6">
              <h2 className={`
                text-xl font-bold transition-colors duration-300
                ${isDarkMode ? 'text-white' : 'text-gray-900'}
              `}>
                Agent Details
              </h2>
              <button
                onClick={() => setShowDetails(null)}
                className={`
                  p-2 rounded-lg transition-colors duration-200
                  ${isDarkMode 
                    ? 'hover:bg-white/10 text-gray-300' 
                    : 'hover:bg-gray-100 text-gray-600'
                  }
                `}
              >
                <XCircleIcon className="w-6 h-6" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className={`
                  text-lg font-semibold mb-4 transition-colors duration-300
                  ${isDarkMode ? 'text-white' : 'text-gray-900'}
                `}>
                  Basic Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className={`
                      text-sm font-medium transition-colors duration-300
                      ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}
                    `}>
                      Hostname
                    </label>
                    <p className={`
                      transition-colors duration-300
                      ${isDarkMode ? 'text-white' : 'text-gray-900'}
                    `}>
                      {showDetails.hostname || showDetails.HostName}
                    </p>
                  </div>
                  <div>
                    <label className={`
                      text-sm font-medium transition-colors duration-300
                      ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}
                    `}>
                      IP Address
                    </label>
                    <p className={`
                      transition-colors duration-300
                      ${isDarkMode ? 'text-white' : 'text-gray-900'}
                    `}>
                      {showDetails.ip_address || showDetails.IPAddress}
                    </p>
                  </div>
                  <div>
                    <label className={`
                      text-sm font-medium transition-colors duration-300
                      ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}
                    `}>
                      Operating System
                    </label>
                    <p className={`
                      transition-colors duration-300
                      ${isDarkMode ? 'text-white' : 'text-gray-900'}
                    `}>
                      {showDetails.operating_system || showDetails.OperatingSystem}
                    </p>
                  </div>
                  <div>
                    <label className={`
                      text-sm font-medium transition-colors duration-300
                      ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}
                    `}>
                      Status
                    </label>
                    <p className={`
                      transition-colors duration-300
                      ${isDarkMode ? 'text-white' : 'text-gray-900'}
                    `}>
                      {showDetails.status}
                    </p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className={`
                  text-lg font-semibold mb-4 transition-colors duration-300
                  ${isDarkMode ? 'text-white' : 'text-gray-900'}
                `}>
                  Performance Metrics
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className={`
                      text-sm font-medium transition-colors duration-300
                      ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}
                    `}>
                      CPU Usage
                    </label>
                    <div className={`
                      w-full rounded-full h-2 transition-colors duration-300
                      ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'}
                    `}>
                      <div 
                        className="bg-blue-400 h-2 rounded-full transition-all duration-300" 
                        style={{width: `${showDetails.cpu_usage || showDetails.CPUUsage}%`}}
                      ></div>
                    </div>
                    <p className={`
                      text-sm mt-1 transition-colors duration-300
                      ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}
                    `}>
                      {showDetails.cpu_usage || showDetails.CPUUsage}%
                    </p>
                  </div>
                  <div>
                    <label className={`
                      text-sm font-medium transition-colors duration-300
                      ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}
                    `}>
                      Memory Usage
                    </label>
                    <div className={`
                      w-full rounded-full h-2 transition-colors duration-300
                      ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'}
                    `}>
                      <div 
                        className="bg-green-400 h-2 rounded-full transition-all duration-300" 
                        style={{width: `${showDetails.memory_usage || showDetails.MemoryUsage}%`}}
                      ></div>
                    </div>
                    <p className={`
                      text-sm mt-1 transition-colors duration-300
                      ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}
                    `}>
                      {showDetails.memory_usage || showDetails.MemoryUsage}%
                    </p>
                  </div>
                  <div>
                    <label className={`
                      text-sm font-medium transition-colors duration-300
                      ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}
                    `}>
                      Disk Usage
                    </label>
                    <div className={`
                      w-full rounded-full h-2 transition-colors duration-300
                      ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'}
                    `}>
                      <div 
                        className="bg-purple-400 h-2 rounded-full transition-all duration-300" 
                        style={{width: `${showDetails.disk_usage || showDetails.DiskUsage}%`}}
                      ></div>
                    </div>
                    <p className={`
                      text-sm mt-1 transition-colors duration-300
                      ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}
                    `}>
                      {showDetails.disk_usage || showDetails.DiskUsage}%
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Agents;