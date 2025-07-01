import React, { useEffect, useState } from 'react';
import { 
  UserGroupIcon, 
  CheckCircleIcon, 
  XCircleIcon, 
  ComputerDesktopIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
// Note: axios calls will be handled by parent component

const AgentsWatchGuardStyle = () => {
  const [agents, setAgents] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  useEffect(() => {
    setLoading(true);
    // Keep your existing API calls here
    Promise.all([
      fetch('http://192.168.20.85:5000/api/v1/agents/list').then(res => res.json()),
      fetch('http://192.168.20.85:5000/api/v1/agents/stats/summary').then(res => res.json())
    ])
      .then(([listRes, statsRes]) => {
        setAgents(listRes.agents || []);
        setStats(statsRes);
        setLoading(false);
      })
      .catch(() => {
        setError('Cannot load agent data');
        setLoading(false);
      });
  }, []);

  const getStatusIcon = (status) => {
    const statusLower = (status || '').toLowerCase();
    if (statusLower === 'active' || statusLower === 'online') {
      return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
    }
    if (statusLower === 'offline') {
      return <XCircleIcon className="w-5 h-5 text-red-500" />;
    }
    return <div className="w-5 h-5 rounded-full bg-gray-300"></div>;
  };

  const getStatusBadge = (status) => {
    const statusLower = (status || '').toLowerCase();
    if (statusLower === 'active' || statusLower === 'online') {
      return <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Online</span>;
    }
    if (statusLower === 'offline') {
      return <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">Offline</span>;
    }
    return <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">Unknown</span>;
  };

  const filteredAgents = agents.filter(agent => {
    const matchesSearch = (agent.hostname || agent.HostName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (agent.ip_address || agent.IPAddress || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'All' || 
                         (agent.status || agent.Status || '').toLowerCase() === filterStatus.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="flex items-center space-x-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
        <span className="text-lg text-gray-600">Loading agents data...</span>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-red-500 text-center py-8">{error}</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-800">Computer protection status</h1>
          <div className="flex items-center space-x-4">
            <button className="flex items-center px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors">
              <ArrowPathIcon className="w-4 h-4 mr-2" />
              Refresh
            </button>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">Last updated:</span>
              <span className="text-sm text-gray-700">{new Date().toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex items-center">
              <UserGroupIcon className="w-8 h-8 text-blue-500 mr-3" />
              <div>
                <div className="text-2xl font-bold text-gray-800">
                  {stats?.total_agents ?? agents.length}
                </div>
                <div className="text-sm text-gray-600">Total Agents</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex items-center">
              <CheckCircleIcon className="w-8 h-8 text-green-500 mr-3" />
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {stats?.online_agents ?? 0}
                </div>
                <div className="text-sm text-gray-600">Online</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex items-center">
              <XCircleIcon className="w-8 h-8 text-red-500 mr-3" />
              <div>
                <div className="text-2xl font-bold text-red-600">
                  {stats?.offline_agents ?? 0}
                </div>
                <div className="text-sm text-gray-600">Offline</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex items-center">
              <CheckCircleIcon className="w-8 h-8 text-yellow-500 mr-3" />
              <div>
                <div className="text-2xl font-bold text-yellow-600">
                  {stats?.active_agents ?? 0}
                </div>
                <div className="text-sm text-gray-600">Active</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search computers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
              <div className="flex items-center space-x-2">
                <FunnelIcon className="w-5 h-5 text-gray-400" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                  <option value="All">All Status</option>
                  <option value="online">Online</option>
                  <option value="offline">Offline</option>
                  <option value="active">Active</option>
                </select>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              Showing {filteredAgents.length} of {agents.length} computers
            </div>
          </div>
        </div>

        {/* Agents Table */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Computer
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Group
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Advanced Protection
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Updated Protection
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Knowledge
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Connection to Knowledge
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Connection
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredAgents.map((agent, index) => (
                  <tr key={agent.agent_id || agent.AgentID || index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <ComputerDesktopIcon className="w-5 h-5 text-gray-400 mr-3" />
                        <div>
                          <div className="font-medium text-gray-900">
                            {agent.hostname || agent.HostName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {agent.ip_address || agent.IPAddress}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-gray-400 rounded-full mr-2"></div>
                        <span className="text-sm text-gray-900">All</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {getStatusIcon(agent.status || agent.Status)}
                    </td>
                    <td className="px-4 py-3">
                      {getStatusIcon(agent.status || agent.Status)}
                    </td>
                    <td className="px-4 py-3">
                      {getStatusIcon(agent.status || agent.Status)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="w-5 h-5"></div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-500">
                        {agent.last_heartbeat || agent.LastHeartbeat || 'Never'}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredAgents.length === 0 && (
            <div className="text-center py-12">
              <ComputerDesktopIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <div className="text-gray-500">No computers found matching your criteria</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AgentsWatchGuardStyle;