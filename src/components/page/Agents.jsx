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

const statusMap = {
  active: { label: 'Active', color: 'text-green-400', bg: 'bg-green-900/60', icon: CheckCircleIcon },
  online: { label: 'Online', color: 'text-green-400', bg: 'bg-green-900/60', icon: CheckCircleIcon },
  offline: { label: 'Offline', color: 'text-red-400', bg: 'bg-red-900/60', icon: XCircleIcon },
  error: { label: 'Error', color: 'text-orange-400', bg: 'bg-orange-900/60', icon: ExclamationTriangleIcon },
  updating: { label: 'Updating', color: 'text-blue-400', bg: 'bg-blue-900/60', icon: ArrowPathIcon },
};

const Agents = () => {
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
    // Auto refresh every 10 seconds (realtime hơn)
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
    // Implement bulk actions
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-blue-200 rounded-full animate-spin"></div>
            <div className="w-20 h-20 border-4 border-blue-600 border-t-transparent rounded-full animate-spin absolute top-0"></div>
          </div>
          <h3 className="mt-6 text-xl font-semibold text-gray-100">Loading Agents...</h3>
          <p className="mt-2 text-gray-400">Fetching agent data...</p>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-red-900 to-pink-900">
        <div className="text-center max-w-md mx-auto p-8">
          <ExclamationTriangleIcon className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-red-200 mb-2">Connection Error</h3>
          <p className="text-red-300 mb-6">{error}</p>
          <button
            onClick={fetchAgentsData}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium"
          >Try Again</button>
        </div>
      </div>
    );
  }

  // Always show search/filter bar, even if no data
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white">
      {/* Header & Stats */}
      <div className="px-8 py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-white/10 bg-white/10 backdrop-blur-xl shadow-lg sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <UserGroupIcon className="w-10 h-10 text-blue-400 drop-shadow-lg" />
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent tracking-tight">Agents</h1>
            <p className="text-gray-300 text-sm mt-1">Manage and monitor endpoint agents</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={fetchAgentsData}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50 shadow-lg"
          >
            <ArrowPathIcon className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            onClick={exportAgents}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium shadow-lg"
          >
            <ArrowDownTrayIcon className="w-5 h-5" />
            Export
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium shadow-lg">
            <PlusIcon className="w-5 h-5" />
            Add Agent
          </button>
          <div className="flex items-center gap-2 text-sm text-gray-200">
            <ClockIcon className="w-4 h-4" />
            <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="p-8 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="bg-gradient-to-br from-blue-700 to-blue-900 rounded-2xl shadow-2xl p-6 flex flex-col gap-2 hover:scale-[1.03] transition-transform duration-300 border border-white/10">
          <div className="flex items-center gap-3 mb-2">
            <UserGroupIcon className="w-8 h-8 text-blue-300" />
            <span className="text-lg font-semibold text-blue-100">Total</span>
          </div>
          <div className="text-4xl font-bold text-white drop-shadow-lg">{stats.total}</div>
        </div>
        <div className="bg-gradient-to-br from-green-700 to-emerald-900 rounded-2xl shadow-2xl p-6 flex flex-col gap-2 hover:scale-[1.03] transition-transform duration-300 border border-white/10">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircleIcon className="w-8 h-8 text-green-300" />
            <span className="text-lg font-semibold text-green-100">Online</span>
          </div>
          <div className="text-4xl font-bold text-white drop-shadow-lg">{stats.online}</div>
        </div>
        <div className="bg-gradient-to-br from-red-700 to-pink-900 rounded-2xl shadow-2xl p-6 flex flex-col gap-2 hover:scale-[1.03] transition-transform duration-300 border border-white/10">
          <div className="flex items-center gap-3 mb-2">
            <XCircleIcon className="w-8 h-8 text-red-300" />
            <span className="text-lg font-semibold text-red-100">Offline</span>
          </div>
          <div className="text-4xl font-bold text-white drop-shadow-lg">{stats.offline}</div>
        </div>
        <div className="bg-gradient-to-br from-orange-700 to-yellow-900 rounded-2xl shadow-2xl p-6 flex flex-col gap-2 hover:scale-[1.03] transition-transform duration-300 border border-white/10">
          <div className="flex items-center gap-3 mb-2">
            <ExclamationTriangleIcon className="w-8 h-8 text-orange-300" />
            <span className="text-lg font-semibold text-orange-100">Error</span>
          </div>
          <div className="text-4xl font-bold text-white drop-shadow-lg">{stats.error}</div>
        </div>
      </div>

      {/* Filters & Bulk Actions */}
      <div className="px-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="flex gap-2">
          <div className="relative">
            <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search hostname or IP..."
              className="pl-10 pr-4 py-2 bg-white/10 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder:text-gray-400"
            />
          </div>
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="px-4 py-2 bg-white/10 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
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
          <div className="flex gap-2 items-center bg-blue-900/60 px-4 py-2 rounded-lg shadow-lg">
            <span className="text-blue-200 font-medium">{selectedAgents.length} selected</span>
            <button className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700">Enable</button>
            <button className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700">Disable</button>
            <button className="px-3 py-1 bg-orange-600 text-white rounded text-sm hover:bg-orange-700">Restart</button>
          </div>
        )}
      </div>

      {/* If no agents found, show message but keep search/filter visible */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24">
          <UserGroupIcon className="w-20 h-20 text-blue-900/30 mb-6" />
          <h3 className="text-2xl font-semibold text-gray-100 mb-2">No Agents Found</h3>
          <p className="text-gray-400 mb-6">No endpoint agents match your search or filter criteria.</p>
        </div>
      ) : (
        <div className="px-8 overflow-x-auto rounded-2xl shadow-2xl bg-white/10 border border-white/10">
          <table className="min-w-full divide-y divide-white/10">
            <thead className="bg-white/5">
              <tr>
                <th className="px-2 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedAgents.length === filtered.length && filtered.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-2 py-3 text-left text-xs font-bold text-gray-300 uppercase tracking-wider w-32">Hostname</th>
                <th className="px-2 py-3 text-left text-xs font-bold text-gray-300 uppercase tracking-wider w-24">IP Address</th>
                <th className="px-2 py-3 text-left text-xs font-bold text-gray-300 uppercase tracking-wider w-32">OS</th>
                <th className="px-2 py-3 text-left text-xs font-bold text-gray-300 uppercase tracking-wider w-24">Status</th>
                <th className="px-2 py-3 text-left text-xs font-bold text-gray-300 uppercase tracking-wider w-40">Last Heartbeat</th>
                <th className="px-2 py-3 text-left text-xs font-bold text-gray-300 uppercase tracking-wider min-w-40">Performance</th>
                <th className="px-2 py-3 text-left text-xs font-bold text-gray-300 uppercase tracking-wider min-w-32">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white/5 divide-y divide-white/10">
              {filtered.map(agent => {
                const status = statusMap[(agent.status || '').toLowerCase()] || statusMap['offline'];
                const StatusIcon = status.icon;
                return (
                  <tr key={agent.agent_id || agent.AgentID} className="hover:bg-blue-900/30 transition-all">
                    <td className="px-2 py-4">
                      <input
                        type="checkbox"
                        checked={selectedAgents.includes(agent.agent_id || agent.AgentID)}
                        onChange={() => toggleSelectAgent(agent.agent_id || agent.AgentID)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-2 py-4 whitespace-nowrap w-32 font-medium text-white">{agent.hostname || agent.HostName}</td>
                    <td className="px-2 py-4 whitespace-nowrap w-24 text-gray-200">{agent.ip_address || agent.IPAddress}</td>
                    <td className="px-2 py-4 whitespace-nowrap w-32 text-gray-200">{agent.operating_system || agent.OperatingSystem}</td>
                    <td className="px-2 py-4 whitespace-nowrap w-24">
                      <div className={`flex items-center gap-2 ${status.bg} px-2 py-1 rounded-lg w-fit`}>
                        <StatusIcon className={`w-5 h-5 ${status.color}`} />
                        <span className={`font-semibold ${status.color}`}>{status.label}</span>
                      </div>
                    </td>
                    <td className="px-2 py-4 whitespace-nowrap w-40 text-gray-200">{agent.last_heartbeat || agent.LastHeartbeat}</td>
                    <td className="px-2 py-4 whitespace-nowrap min-w-40">
                      <div className="flex flex-row items-center gap-2 text-xs">
                        <div className="flex flex-row items-center" title="CPU Usage">
                          <CpuChipIcon className="w-4 h-4 text-blue-400" />
                          <span className="text-gray-200 font-medium ml-1">{(agent.cpu_usage ?? agent.CPUUsage ?? 0) !== '' ? `${agent.cpu_usage ?? agent.CPUUsage ?? 0}%` : '--'}</span>
                        </div>
                        <div className="flex flex-row items-center" title="Memory Usage">
                          <ServerIcon className="w-4 h-4 text-green-400" />
                          <span className="text-gray-200 font-medium ml-1">{(agent.memory_usage ?? agent.MemoryUsage ?? 0) !== '' ? `${agent.memory_usage ?? agent.MemoryUsage ?? 0}%` : '--'}</span>
                        </div>
                        <div className="flex flex-row items-center" title="Disk Usage">
                          <ServerIcon className="w-4 h-4 text-purple-400" />
                          <span className="text-gray-200 font-medium ml-1">{(agent.disk_usage ?? agent.DiskUsage ?? 0) !== '' ? `${agent.disk_usage ?? agent.DiskUsage ?? 0}%` : '--'}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-2 py-4 whitespace-nowrap min-w-32">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setShowDetails(agent)}
                          className="p-1 text-blue-400 hover:bg-blue-900/40 rounded transition-colors"
                          title="View Details"
                        >
                          <EyeIcon className="w-4 h-4" />
                        </button>
                        <button
                          className="p-1 text-green-400 hover:bg-green-900/40 rounded transition-colors"
                          title="Enable Agent"
                        >
                          <PlayIcon className="w-4 h-4" />
                        </button>
                        <button
                          className="p-1 text-orange-400 hover:bg-orange-900/40 rounded transition-colors"
                          title="Configure Agent"
                        >
                          <Cog6ToothIcon className="w-4 h-4" />
                        </button>
                        <button
                          className="p-1 text-red-400 hover:bg-red-900/40 rounded transition-colors"
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
          <div className="bg-white/10 rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-white/10 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Agent Details</h2>
              <button
                onClick={() => setShowDetails(null)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <XCircleIcon className="w-6 h-6 text-gray-300" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Basic Information</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-300">Hostname</label>
                    <p className="text-white">{showDetails.hostname || showDetails.HostName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-300">IP Address</label>
                    <p className="text-white">{showDetails.ip_address || showDetails.IPAddress}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-300">Operating System</label>
                    <p className="text-white">{showDetails.operating_system || showDetails.OperatingSystem}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-300">Status</label>
                    <p className="text-white">{showDetails.status}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Performance Metrics</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-300">CPU Usage</label>
                    <div className="w-full bg-gray-800 rounded-full h-2">
                      <div 
                        className="bg-blue-400 h-2 rounded-full" 
                        style={{width: `${showDetails.cpu_usage || showDetails.CPUUsage}%`}}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-300 mt-1">{showDetails.cpu_usage || showDetails.CPUUsage}%</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-300">Memory Usage</label>
                    <div className="w-full bg-gray-800 rounded-full h-2">
                      <div 
                        className="bg-green-400 h-2 rounded-full" 
                        style={{width: `${showDetails.memory_usage || showDetails.MemoryUsage}%`}}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-300 mt-1">{showDetails.memory_usage || showDetails.MemoryUsage}%</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-300">Disk Usage</label>
                    <div className="w-full bg-gray-800 rounded-full h-2">
                      <div 
                        className="bg-purple-400 h-2 rounded-full" 
                        style={{width: `${showDetails.disk_usage || showDetails.DiskUsage}%`}}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-300 mt-1">{showDetails.disk_usage || showDetails.DiskUsage}%</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-300">Network Latency</label>
                    <p className="text-white">{showDetails.network_latency || showDetails.NetworkLatency} ms</p>
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