// File: src/pages/Agents.jsx
// Updated Agents component with real API integration

import React, { useState, useEffect } from 'react';
import { 
  fetchAgentsOverview, 
  fetchAgentsList, 
  fetchAgentDetails,
  fetchAgentEvents,
  updateAgentConfig
} from '../services/api';
import {
  ComputerDesktopIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  Cog6ToothIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  CpuChipIcon,
  ArrowPathIcon,
  ChevronDownIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';

// Agent Card Component
const AgentCard = ({ agent, onViewDetails, onViewEvents, onConfigure }) => {
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'text-green-400 bg-green-500/20';
      case 'offline': return 'text-red-400 bg-red-500/20';
      case 'inactive': return 'text-gray-400 bg-gray-500/20';
      case 'updating': return 'text-blue-400 bg-blue-500/20';
      case 'error': return 'text-red-400 bg-red-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'active': return <CheckCircleIcon className="w-4 h-4" />;
      case 'offline': return <XCircleIcon className="w-4 h-4" />;
      case 'updating': return <ArrowPathIcon className="w-4 h-4 animate-spin" />;
      default: return <ClockIcon className="w-4 h-4" />;
    }
  };

  const getPerformanceColor = (value) => {
    if (value > 90) return 'text-red-400';
    if (value > 70) return 'text-yellow-400';
    return 'text-green-400';
  };

  return (
    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-all duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <ComputerDesktopIcon className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-semibold text-white">{agent.hostname || agent.HostName}</h3>
            <span className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(agent.status || agent.Status)}`}>
              {getStatusIcon(agent.status || agent.Status)}
              {agent.status || agent.Status}
            </span>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-300 mb-3">
            <div>
              <span className="text-gray-400">IP Address:</span>
              <div className="font-medium">{agent.ip_address || agent.IPAddress}</div>
            </div>
            <div>
              <span className="text-gray-400">OS:</span>
              <div className="font-medium">{agent.operating_system || agent.OperatingSystem}</div>
            </div>
            <div>
              <span className="text-gray-400">Version:</span>
              <div className="font-medium">{agent.agent_version || agent.AgentVersion}</div>
            </div>
            <div>
              <span className="text-gray-400">Last Seen:</span>
              <div className="font-medium">
                {agent.last_heartbeat ? 
                  new Date(agent.last_heartbeat || agent.LastHeartbeat).toLocaleString() : 
                  'Never'
                }
              </div>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="grid grid-cols-3 gap-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">CPU:</span>
              <span className={getPerformanceColor(agent.cpu_usage || agent.CPUUsage || 0)}>
                {(agent.cpu_usage || agent.CPUUsage || 0).toFixed(1)}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Memory:</span>
              <span className={getPerformanceColor(agent.memory_usage || agent.MemoryUsage || 0)}>
                {(agent.memory_usage || agent.MemoryUsage || 0).toFixed(1)}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Disk:</span>
              <span className={getPerformanceColor(agent.disk_usage || agent.DiskUsage || 0)}>
                {(agent.disk_usage || agent.DiskUsage || 0).toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => onViewDetails(agent)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-blue-400"
            title="View Details"
          >
            <EyeIcon className="w-4 h-4" />
          </button>
          <button
            onClick={() => onViewEvents(agent)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-yellow-400"
            title="View Events"
          >
            <ExclamationTriangleIcon className="w-4 h-4" />
          </button>
          <button
            onClick={() => onConfigure(agent)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-green-400"
            title="Configure Agent"
          >
            <Cog6ToothIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Agent Details Modal
const AgentDetailsModal = ({ agent, events, onClose, loading }) => {
  if (!agent) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-white/20 rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Agent Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors text-2xl"
          >
            ×
          </button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-3">Basic Information</h3>
            <div className="space-y-3">
              <div>
                <label className="text-gray-400 text-sm">Agent ID</label>
                <p className="text-white font-medium">{agent.agent_id || agent.AgentID}</p>
              </div>
              <div>
                <label className="text-gray-400 text-sm">Hostname</label>
                <p className="text-white font-medium">{agent.hostname || agent.HostName}</p>
              </div>
              <div>
                <label className="text-gray-400 text-sm">IP Address</label>
                <p className="text-white font-medium">{agent.ip_address || agent.IPAddress}</p>
              </div>
              <div>
                <label className="text-gray-400 text-sm">MAC Address</label>
                <p className="text-white font-medium">{agent.mac_address || agent.MACAddress || 'N/A'}</p>
              </div>
              <div>
                <label className="text-gray-400 text-sm">Operating System</label>
                <p className="text-white font-medium">{agent.operating_system || agent.OperatingSystem}</p>
              </div>
              <div>
                <label className="text-gray-400 text-sm">OS Version</label>
                <p className="text-white font-medium">{agent.os_version || agent.OSVersion || 'N/A'}</p>
              </div>
              <div>
                <label className="text-gray-400 text-sm">Architecture</label>
                <p className="text-white font-medium">{agent.architecture || agent.Architecture || 'N/A'}</p>
              </div>
              <div>
                <label className="text-gray-400 text-sm">Domain</label>
                <p className="text-white font-medium">{agent.domain || agent.Domain || 'Workgroup'}</p>
              </div>
            </div>
          </div>

          {/* Agent Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-3">Agent Information</h3>
            <div className="space-y-3">
              <div>
                <label className="text-gray-400 text-sm">Agent Version</label>
                <p className="text-white font-medium">{agent.agent_version || agent.AgentVersion}</p>
              </div>
              <div>
                <label className="text-gray-400 text-sm">Install Path</label>
                <p className="text-white font-medium">{agent.install_path || agent.InstallPath || 'Default'}</p>
              </div>
              <div>
                <label className="text-gray-400 text-sm">Status</label>
                <p className="text-white font-medium">{agent.status || agent.Status}</p>
              </div>
              <div>
                <label className="text-gray-400 text-sm">First Seen</label>
                <p className="text-white font-medium">
                  {agent.first_seen ? 
                    new Date(agent.first_seen || agent.FirstSeen).toLocaleString() : 
                    'N/A'
                  }
                </p>
              </div>
              <div>
                <label className="text-gray-400 text-sm">Last Heartbeat</label>
                <p className="text-white font-medium">
                  {agent.last_heartbeat ? 
                    new Date(agent.last_heartbeat || agent.LastHeartbeat).toLocaleString() : 
                    'Never'
                  }
                </p>
              </div>
              <div>
                <label className="text-gray-400 text-sm">Monitoring Enabled</label>
                <p className="text-white font-medium">
                  {(agent.monitoring_enabled || agent.MonitoringEnabled) ? 'Yes' : 'No'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-white mb-3">Performance Metrics</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white/5 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <CpuChipIcon className="w-4 h-4 text-blue-400" />
                <span className="text-gray-400 text-sm">CPU Usage</span>
              </div>
              <div className="text-2xl font-bold text-white">
                {(agent.cpu_usage || agent.CPUUsage || 0).toFixed(1)}%
              </div>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <CpuChipIcon className="w-4 h-4 text-green-400" />
                <span className="text-gray-400 text-sm">Memory Usage</span>
              </div>
              <div className="text-2xl font-bold text-white">
                {(agent.memory_usage || agent.MemoryUsage || 0).toFixed(1)}%
              </div>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <CpuChipIcon className="w-4 h-4 text-yellow-400" />
                <span className="text-gray-400 text-sm">Disk Usage</span>
              </div>
              <div className="text-2xl font-bold text-white">
                {(agent.disk_usage || agent.DiskUsage || 0).toFixed(1)}%
              </div>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <CpuChipIcon className="w-4 h-4 text-purple-400" />
                <span className="text-gray-400 text-sm">Network Latency</span>
              </div>
              <div className="text-2xl font-bold text-white">
                {agent.network_latency || agent.NetworkLatency || 0}ms
              </div>
            </div>
          </div>
        </div>

        {/* Recent Events */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-white mb-3">Recent Events</h3>
          <div className="bg-white/5 rounded-lg p-4 max-h-64 overflow-y-auto">
            {loading ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                <div className="text-gray-400 mt-2">Loading events...</div>
              </div>
            ) : events?.length > 0 ? (
              <div className="space-y-2">
                {events.map((event, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-white/5 rounded">
                    <div>
                      <span className="text-white text-sm font-medium">{event.EventType}</span>
                      <div className="text-xs text-gray-400">
                        {new Date(event.EventTimestamp).toLocaleString()}
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      event.Severity === 'Critical' ? 'bg-red-500/20 text-red-400' :
                      event.Severity === 'High' ? 'bg-orange-500/20 text-orange-400' :
                      event.Severity === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-green-500/20 text-green-400'
                    }`}>
                      {event.Severity}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-gray-400">
                No recent events found
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Filter Panel Component
const FilterPanel = ({ filters, onFiltersChange, onApply, onReset }) => {
  return (
    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <FunnelIcon className="w-5 h-5" />
        Filters
      </h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
          <select
            value={filters.status}
            onChange={(e) => onFiltersChange({ ...filters, status: e.target.value })}
            className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
          >
            <option value="">All Status</option>
            <option value="Active">Active</option>
            <option value="Offline">Offline</option>
            <option value="Inactive">Inactive</option>
            <option value="Error">Error</option>
            <option value="Updating">Updating</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Operating System</label>
          <select
            value={filters.os}
            onChange={(e) => onFiltersChange({ ...filters, os: e.target.value })}
            className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
          >
            <option value="">All OS</option>
            <option value="Windows">Windows</option>
            <option value="Linux">Linux</option>
            <option value="macOS">macOS</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Performance Issues</label>
          <select
            value={filters.performance}
            onChange={(e) => onFiltersChange({ ...filters, performance: e.target.value })}
            className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
          >
            <option value="">All Agents</option>
            <option value="high_cpu">High CPU Usage</option>
            <option value="high_memory">High Memory Usage</option>
            <option value="high_disk">High Disk Usage</option>
          </select>
        </div>
        
        <div className="flex gap-2 pt-4">
          <button
            onClick={onApply}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors"
          >
            Apply
          </button>
          <button
            onClick={onReset}
            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-lg transition-colors"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

// Main Agents Component
const Agents = () => {
  const [agentsData, setAgentsData] = useState(null);
  const [agentsList, setAgentsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [agentEvents, setAgentEvents] = useState(null);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    status: '',
    os: '',
    performance: ''
  });

  // Fetch agents overview data
  const fetchOverviewData = async () => {
    try {
      const data = await fetchAgentsOverview();
      setAgentsData(data);
    } catch (err) {
      console.error('Failed to fetch agents overview:', err);
    }
  };

  // Fetch agents list with pagination and filters
  const fetchAgentsData = async (page = 1, searchTerm = '', appliedFilters = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const queryFilters = {
        ...appliedFilters,
        search: searchTerm
      };

      const data = await fetchAgentsList(page, 20, queryFilters);
      setAgentsList(data.agents || data.data || []);
      setTotalPages(data.total_pages || Math.ceil((data.total || 0) / 20));
      setCurrentPage(page);
    } catch (err) {
      setError(err.message);
      console.error('Failed to fetch agents data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch agent details and events
  const handleViewDetails = async (agent) => {
    setSelectedAgent(agent);
    setEventsLoading(true);
    
    try {
      const events = await fetchAgentEvents(agent.agent_id || agent.AgentID, 24);
      setAgentEvents(events.events || events.data || []);
    } catch (err) {
      console.error('Failed to fetch agent events:', err);
      setAgentEvents([]);
    } finally {
      setEventsLoading(false);
    }
  };

  // Handle search
  const handleSearch = (query) => {
    setSearchQuery(query);
    fetchAgentsData(1, query, filters);
  };

  // Handle filter application
  const handleApplyFilters = () => {
    fetchAgentsData(1, searchQuery, filters);
  };

  // Handle filter reset
  const handleResetFilters = () => {
    const resetFilters = { status: '', os: '', performance: '' };
    setFilters(resetFilters);
    setSearchQuery('');
    fetchAgentsData(1, '', resetFilters);
  };

  // Handle pagination
  const handlePageChange = (page) => {
    fetchAgentsData(page, searchQuery, filters);
  };

  // Initial data fetch
  useEffect(() => {
    fetchOverviewData();
    fetchAgentsData();
    
    // Set up periodic refresh every 30 seconds
    const interval = setInterval(() => {
      fetchOverviewData();
      fetchAgentsData(currentPage, searchQuery, filters);
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  if (loading && !agentsList.length) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <div className="text-gray-400">Loading agents data...</div>
        </div>
      </div>
    );
  }

  if (error && !agentsList.length) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-red-400 text-xl mb-2">⚠️ Error Loading Agents</div>
          <div className="text-gray-400 mb-4">{error}</div>
          <button 
            onClick={() => fetchAgentsData()} 
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Endpoint Management</h1>
          <p className="text-gray-400 mt-1">Monitor and manage security agents across your network</p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              fetchOverviewData();
              fetchAgentsData(currentPage, searchQuery, filters);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors"
          >
            <ArrowPathIcon className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Agent Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <ComputerDesktopIcon className="w-6 h-6 text-blue-400" />
            <span className="text-lg font-semibold text-white">Total Agents</span>
          </div>
          <div className="text-3xl font-bold text-blue-400">
            {agentsData?.summary?.total_agents?.toLocaleString() || 0}
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircleIcon className="w-6 h-6 text-green-400" />
            <span className="text-lg font-semibold text-white">Active</span>
          </div>
          <div className="text-3xl font-bold text-green-400">
            {agentsData?.summary?.active_agents?.toLocaleString() || 0}
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <XCircleIcon className="w-6 h-6 text-red-400" />
            <span className="text-lg font-semibold text-white">Offline</span>
          </div>
          <div className="text-3xl font-bold text-red-400">
            {agentsData?.summary?.offline_agents?.toLocaleString() || 0}
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <ExclamationTriangleIcon className="w-6 h-6 text-yellow-400" />
            <span className="text-lg font-semibold text-white">Issues</span>
          </div>
          <div className="text-3xl font-bold text-yellow-400">
            {agentsData?.performance_issues?.length || 0}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters */}
        <div className="lg:col-span-1">
          <FilterPanel
            filters={filters}
            onFiltersChange={setFilters}
            onApply={handleApplyFilters}
            onReset={handleResetFilters}
          />
        </div>

        {/* Agents List */}
        <div className="lg:col-span-3 space-y-6">
          {/* Search */}
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search agents by hostname, IP, or OS..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
            />
          </div>

          {/* Agents Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-white">
                Agents ({agentsList.length} of {agentsData?.summary?.total_agents || 0})
              </h3>
              {loading && (
                <div className="text-sm text-gray-400">Updating...</div>
              )}
            </div>

            {agentsList.length > 0 ? (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                {agentsList.map((agent, index) => (
                  <AgentCard
                    key={agent.agent_id || agent.AgentID || index}
                    agent={agent}
                    onViewDetails={handleViewDetails}
                    onViewEvents={() => console.log('View events for:', agent)}
                    onConfigure={() => console.log('Configure agent:', agent)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <ComputerDesktopIcon className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                <h3 className="text-xl font-medium text-gray-400 mb-2">No agents found</h3>
                <p className="text-gray-500">
                  {searchQuery || Object.values(filters).some(f => f) 
                    ? 'Try adjusting your search criteria' 
                    : 'No agents are currently registered'
                  }
                </p>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-6">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-2 bg-white/10 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20 transition-colors"
                >
                  Previous
                </button>
                
                {[...Array(Math.min(5, totalPages))].map((_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-3 py-2 rounded-lg transition-colors ${
                        currentPage === pageNum
                          ? 'bg-blue-600 text-white'
                          : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 bg-white/10 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20 transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Agent Details Modal */}
      {selectedAgent && (
        <AgentDetailsModal
          agent={selectedAgent}
          events={agentEvents}
          onClose={() => {
            setSelectedAgent(null);
            setAgentEvents(null);
          }}
          loading={eventsLoading}
        />
      )}
    </div>
  );
};

export default Agents;