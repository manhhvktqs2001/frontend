import React, { useEffect, useState } from 'react';
import { 
  UserGroupIcon, 
  CheckCircleIcon, 
  XCircleIcon, 
  ComputerDesktopIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowPathIcon,
  EyeIcon,
  Cog6ToothIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  ServerIcon,
  CpuChipIcon,
  WifiIcon,
  ShieldCheckIcon,
  BoltIcon
} from '@heroicons/react/24/outline';
// axios import removed - will be handled by parent component

const Agents = () => {
  const [agents, setAgents] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterPlatform, setFilterPlatform] = useState('All');
  const [selectedAgents, setSelectedAgents] = useState([]);
  const [showDetails, setShowDetails] = useState(null);

  // Fetch agents data
  const fetchAgentsData = async () => {
    setLoading(true);
    try {
      const [listRes, statsRes] = await Promise.all([
        fetch('http://192.168.20.85:5000/api/v1/agents/list').then(res => res.json()),
        fetch('http://192.168.20.85:5000/api/v1/agents/stats/summary').then(res => res.json())
      ]);

      setAgents(listRes.agents || []);
      setStats(statsRes);
      setError(null);
    } catch (err) {
      console.error('Error fetching agents data:', err);
      setError('Cannot load agents data. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgentsData();
  }, []);

  // Manual refresh
  const handleRefresh = () => {
    fetchAgentsData();
  };

  // Get status information
  const getStatusInfo = (status) => {
    const statusLower = (status || '').toLowerCase();
    
    const statusMap = {
      'active': { 
        icon: CheckCircleIcon, 
        color: 'text-green-500', 
        bg: 'bg-green-100', 
        label: 'Active',
        dot: 'bg-green-500'
      },
      'online': { 
        icon: CheckCircleIcon, 
        color: 'text-green-500', 
        bg: 'bg-green-100', 
        label: 'Online',
        dot: 'bg-green-500'
      },
      'offline': { 
        icon: XCircleIcon, 
        color: 'text-red-500', 
        bg: 'bg-red-100', 
        label: 'Offline',
        dot: 'bg-red-500'
      },
      'error': { 
        icon: ExclamationTriangleIcon, 
        color: 'text-orange-500', 
        bg: 'bg-orange-100', 
        label: 'Error',
        dot: 'bg-orange-500'
      },
      'updating': { 
        icon: ArrowPathIcon, 
        color: 'text-blue-500', 
        bg: 'bg-blue-100', 
        label: 'Updating',
        dot: 'bg-blue-500'
      }
    };

    return statusMap[statusLower] || { 
      icon: XCircleIcon, 
      color: 'text-gray-500', 
      bg: 'bg-gray-100', 
      label: 'Unknown',
      dot: 'bg-gray-500'
    };
  };

  // Get OS icon
  const getOSIcon = (os) => {
    const osLower = (os || '').toLowerCase();
    if (osLower.includes('windows')) return '🪟';
    if (osLower.includes('linux')) return '🐧';
    if (osLower.includes('mac')) return '🍎';
    return '💻';
  };

  // Filter agents
  const filteredAgents = agents.filter(agent => {
    const matchesSearch = 
      (agent.hostname || agent.HostName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (agent.ip_address || agent.IPAddress || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (agent.agent_id || agent.AgentID || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'All' || 
      (agent.status || agent.Status || '').toLowerCase() === filterStatus.toLowerCase();
    
    const matchesPlatform = filterPlatform === 'All' ||
      (agent.os_type || agent.OSType || agent.platform || '').toLowerCase().includes(filterPlatform.toLowerCase());
    
    return matchesSearch && matchesStatus && matchesPlatform;
  });

  // Get last seen time
  const getLastSeen = (timestamp) => {
    if (!timestamp) return 'Never';
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  // Select agent
  const toggleSelectAgent = (agentId) => {
    setSelectedAgents(prev => 
      prev.includes(agentId) 
        ? prev.filter(id => id !== agentId)
        : [...prev, agentId]
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-blue-200 rounded-full animate-spin"></div>
            <div className="w-20 h-20 border-4 border-blue-600 border-t-transparent rounded-full animate-spin absolute top-0"></div>
          </div>
          <h3 className="mt-6 text-xl font-semibold text-gray-700">Loading Agents</h3>
          <p className="mt-2 text-gray-500">Fetching endpoint data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50 to-pink-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <ExclamationTriangleIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-red-700 mb-2">Connection Error</h3>
          <p className="text-red-600 mb-6">{error}</p>
          <button
            onClick={handleRefresh}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-lg shadow-lg border-b border-white/20 px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg">
              <ComputerDesktopIcon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Endpoint Management
              </h1>
              <p className="text-gray-600 text-sm">Monitor and manage all connected endpoints</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50"
            >
              <ArrowPathIcon className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span className="text-sm font-medium">Refresh</span>
            </button>
            
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <ClockIcon className="w-4 h-4" />
              <span>Last updated: {new Date().toLocaleTimeString()}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-gray-900">{stats?.total_agents || agents.length}</div>
                <div className="text-sm text-gray-600 font-medium">Total Endpoints</div>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl">
                <UserGroupIcon className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-green-600">{stats?.online_agents || 0}</div>
                <div className="text-sm text-gray-600 font-medium">Online</div>
              </div>
              <div className="p-3 bg-green-100 rounded-xl">
                <CheckCircleIcon className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-red-600">{stats?.offline_agents || 0}</div>
                <div className="text-sm text-gray-600 font-medium">Offline</div>
              </div>
              <div className="p-3 bg-red-100 rounded-xl">
                <XCircleIcon className="w-8 h-8 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-yellow-600">{stats?.error_agents || 0}</div>
                <div className="text-sm text-gray-600 font-medium">Needs Attention</div>
              </div>
              <div className="p-3 bg-yellow-100 rounded-xl">
                <ExclamationTriangleIcon className="w-8 h-8 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
              {/* Search */}
              <div className="relative">
                <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search endpoints..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2.5 w-80 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
                />
              </div>

              {/* Status Filter */}
              <div className="flex items-center space-x-2">
                <FunnelIcon className="w-5 h-5 text-gray-400" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
                >
                  <option value="All">All Status</option>
                  <option value="online">Online</option>
                  <option value="offline">Offline</option>
                  <option value="active">Active</option>
                  <option value="error">Error</option>
                  <option value="updating">Updating</option>
                </select>
              </div>

              {/* Platform Filter */}
              <select
                value={filterPlatform}
                onChange={(e) => setFilterPlatform(e.target.value)}
                className="border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
              >
                <option value="All">All Platforms</option>
                <option value="windows">Windows</option>
                <option value="linux">Linux</option>
                <option value="mac">macOS</option>
              </select>
            </div>

            <div className="flex items-center space-x-4">
              {selectedAgents.length > 0 && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">{selectedAgents.length} selected</span>
                  <button className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors">
                    Actions
                  </button>
                </div>
              )}
              <div className="text-sm text-gray-500">
                Showing {filteredAgents.length} of {agents.length} endpoints
              </div>
            </div>
          </div>
        </div>

        {/* Agents Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredAgents.map((agent, index) => {
            const statusInfo = getStatusInfo(agent.status || agent.Status);
            const agentId = agent.agent_id || agent.AgentID || index;
            const hostname = agent.hostname || agent.HostName || 'Unknown';
            const ipAddress = agent.ip_address || agent.IPAddress || 'N/A';
            const osType = agent.os_type || agent.OSType || agent.platform || 'Unknown';
            const lastHeartbeat = agent.last_heartbeat || agent.LastHeartbeat;
            
            return (
              <div key={agentId} className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 group">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={selectedAgents.includes(agentId)}
                        onChange={() => toggleSelectAgent(agentId)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </div>
                    <div className="text-2xl">{getOSIcon(osType)}</div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">{hostname}</h3>
                      <p className="text-sm text-gray-500">{ipAddress}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${statusInfo.dot} animate-pulse`}></div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusInfo.bg} ${statusInfo.color}`}>
                      {statusInfo.label}
                    </span>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Agent ID:</span>
                    <span className="font-mono text-gray-900">{agentId}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Platform:</span>
                    <span className="font-medium text-gray-900">{osType}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Last Seen:</span>
                    <span className="font-medium text-gray-900">{getLastSeen(lastHeartbeat)}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Version:</span>
                    <span className="font-medium text-gray-900">{agent.agent_version || agent.AgentVersion || 'N/A'}</span>
                  </div>
                </div>

                {/* Protection Status Indicators */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="text-center p-2 bg-green-50 rounded-lg">
                    <ShieldCheckIcon className="w-5 h-5 text-green-500 mx-auto mb-1" />
                    <div className="text-xs text-green-700 font-medium">Protected</div>
                  </div>
                  <div className="text-center p-2 bg-blue-50 rounded-lg">
                    <BoltIcon className="w-5 h-5 text-blue-500 mx-auto mb-1" />
                    <div className="text-xs text-blue-700 font-medium">Updated</div>
                  </div>
                  <div className="text-center p-2 bg-purple-50 rounded-lg">
                    <WifiIcon className="w-5 h-5 text-purple-500 mx-auto mb-1" />
                    <div className="text-xs text-purple-700 font-medium">Connected</div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setShowDetails(agentId)}
                    className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium"
                  >
                    <EyeIcon className="w-4 h-4" />
                    <span>Details</span>
                  </button>
                  
                  <button className="flex items-center justify-center p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors duration-200">
                    <Cog6ToothIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredAgents.length === 0 && (
          <div className="text-center py-16">
            <ComputerDesktopIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No endpoints found</h3>
            <p className="text-gray-500">
              {agents.length === 0 
                ? "No endpoints are currently registered." 
                : "No endpoints match your search criteria."
              }
            </p>
            {searchTerm && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilterStatus('All');
                  setFilterPlatform('All');
                }}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Agent Details Modal */}
      {showDetails && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Agent Details</h2>
              <button
                onClick={() => setShowDetails(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <XCircleIcon className="w-6 h-6 text-gray-500" />
              </button>
            </div>
            
            {/* Agent details content would go here */}
            <div className="space-y-4">
              <div className="text-center py-8 text-gray-500">
                <ComputerDesktopIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Agent details view coming soon...</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Agents;