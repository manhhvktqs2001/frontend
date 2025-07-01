// File: src/pages/Alerts.jsx
// Updated Alerts component with real API integration

import React, { useState, useEffect } from 'react';
import apiService from '../services/api';
import {
  ExclamationTriangleIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ArrowPathIcon,
  UserIcon,
  ShieldExclamationIcon,
  FireIcon,
  BugAntIcon
} from '@heroicons/react/24/outline';

// Alert Card Component
const AlertCard = ({ alert, onViewDetails, onUpdateStatus, onResolve }) => {
  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'critical': return 'text-red-400 bg-red-500/20 border-red-500/50';
      case 'high': return 'text-orange-400 bg-orange-500/20 border-orange-500/50';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/50';
      case 'low': return 'text-green-400 bg-green-500/20 border-green-500/50';
      default: return 'text-blue-400 bg-blue-500/20 border-blue-500/50';
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'open': return 'text-red-400 bg-red-500/20';
      case 'investigating': return 'text-yellow-400 bg-yellow-500/20';
      case 'resolved': return 'text-green-400 bg-green-500/20';
      case 'false positive': return 'text-gray-400 bg-gray-500/20';
      case 'suppressed': return 'text-gray-400 bg-gray-500/20';
      case 'closed': return 'text-gray-400 bg-gray-500/20';
      default: return 'text-blue-400 bg-blue-500/20';
    }
  };

  const getAlertIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'malware': return <BugAntIcon className="w-5 h-5" />;
      case 'intrusion': return <ShieldExclamationIcon className="w-5 h-5" />;
      case 'suspicious': return <ExclamationTriangleIcon className="w-5 h-5" />;
      default: return <FireIcon className="w-5 h-5" />;
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-all duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className={`p-2 rounded-lg ${getSeverityColor(alert.Severity || alert.severity)}`}>
              {getAlertIcon(alert.AlertType || alert.alert_type)}
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white">{alert.Title || alert.title}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getSeverityColor(alert.Severity || alert.severity)}`}>
                  {alert.Severity || alert.severity}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(alert.Status || alert.status)}`}>
                  {alert.Status || alert.status}
                </span>
              </div>
            </div>
          </div>
          
          <p className="text-gray-400 text-sm mb-3 line-clamp-2">
            {alert.Description || alert.description || 'No description available'}
          </p>
          
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-300">
            <div>
              <span className="text-gray-400">Agent:</span>
              <div className="font-medium">{alert.AgentID || alert.agent_id || 'Unknown'}</div>
            </div>
            <div>
              <span className="text-gray-400">Detection Method:</span>
              <div className="font-medium">{alert.DetectionMethod || alert.detection_method || 'N/A'}</div>
            </div>
            <div>
              <span className="text-gray-400">First Detected:</span>
              <div className="font-medium">
                {alert.FirstDetected || alert.first_detected ? 
                  new Date(alert.FirstDetected || alert.first_detected).toLocaleString() : 
                  'Unknown'
                }
              </div>
            </div>
            <div>
              <span className="text-gray-400">Risk Score:</span>
              <div className="font-medium">{alert.RiskScore || alert.risk_score || 0}/100</div>
            </div>
          </div>

          {/* MITRE ATT&CK Info */}
          {(alert.MitreTactic || alert.mitre_tactic) && (
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded-lg text-xs">
                {alert.MitreTactic || alert.mitre_tactic}
              </span>
              {(alert.MitreTechnique || alert.mitre_technique) && (
                <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded-lg text-xs">
                  {alert.MitreTechnique || alert.mitre_technique}
                </span>
              )}
            </div>
          )}
        </div>
        
        <div className="flex flex-col gap-2">
          <button
            onClick={() => onViewDetails(alert)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-blue-400"
            title="View Details"
          >
            <EyeIcon className="w-4 h-4" />
          </button>
          
          {alert.Status !== 'Resolved' && (
            <>
              <button
                onClick={() => onUpdateStatus(alert, 'Investigating')}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-yellow-400"
                title="Mark as Investigating"
              >
                <ClockIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() => onResolve(alert)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-green-400"
                title="Resolve Alert"
              >
                <CheckCircleIcon className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// Alert Details Modal
const AlertDetailsModal = ({ alert, onClose, onUpdateStatus, onResolve }) => {
  if (!alert) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-white/20 rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Alert Details</h2>
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
            <h3 className="text-lg font-semibold text-white mb-3">Alert Information</h3>
            <div className="space-y-3">
              <div>
                <label className="text-gray-400 text-sm">Alert ID</label>
                <p className="text-white font-medium">{alert.AlertID || alert.alert_id}</p>
              </div>
              <div>
                <label className="text-gray-400 text-sm">Title</label>
                <p className="text-white font-medium">{alert.Title || alert.title}</p>
              </div>
              <div>
                <label className="text-gray-400 text-sm">Type</label>
                <p className="text-white font-medium">{alert.AlertType || alert.alert_type}</p>
              </div>
              <div>
                <label className="text-gray-400 text-sm">Severity</label>
                <p className="text-white font-medium">{alert.Severity || alert.severity}</p>
              </div>
              <div>
                <label className="text-gray-400 text-sm">Status</label>
                <p className="text-white font-medium">{alert.Status || alert.status}</p>
              </div>
              <div>
                <label className="text-gray-400 text-sm">Priority</label>
                <p className="text-white font-medium">{alert.Priority || alert.priority}</p>
              </div>
              <div>
                <label className="text-gray-400 text-sm">Risk Score</label>
                <p className="text-white font-medium">{alert.RiskScore || alert.risk_score}/100</p>
              </div>
              <div>
                <label className="text-gray-400 text-sm">Confidence</label>
                <p className="text-white font-medium">{((alert.Confidence || alert.confidence || 0) * 100).toFixed(1)}%</p>
              </div>
            </div>
          </div>

          {/* Detection Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-3">Detection Details</h3>
            <div className="space-y-3">
              <div>
                <label className="text-gray-400 text-sm">Agent ID</label>
                <p className="text-white font-medium">{alert.AgentID || alert.agent_id}</p>
              </div>
              <div>
                <label className="text-gray-400 text-sm">Detection Method</label>
                <p className="text-white font-medium">{alert.DetectionMethod || alert.detection_method}</p>
              </div>
              <div>
                <label className="text-gray-400 text-sm">First Detected</label>
                <p className="text-white font-medium">
                  {alert.FirstDetected || alert.first_detected ? 
                    new Date(alert.FirstDetected || alert.first_detected).toLocaleString() : 
                    'Unknown'
                  }
                </p>
              </div>
              <div>
                <label className="text-gray-400 text-sm">Last Detected</label>
                <p className="text-white font-medium">
                  {alert.LastDetected || alert.last_detected ? 
                    new Date(alert.LastDetected || alert.last_detected).toLocaleString() : 
                    'Unknown'
                  }
                </p>
              </div>
              <div>
                <label className="text-gray-400 text-sm">Event Count</label>
                <p className="text-white font-medium">{alert.EventCount || alert.event_count || 1}</p>
              </div>
              <div>
                <label className="text-gray-400 text-sm">Assigned To</label>
                <p className="text-white font-medium">{alert.AssignedTo || alert.assigned_to || 'Unassigned'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-white mb-3">Description</h3>
          <div className="bg-white/5 rounded-lg p-4">
            <p className="text-gray-300">
              {alert.Description || alert.description || 'No description available'}
            </p>
          </div>
        </div>

        {/* MITRE ATT&CK */}
        {(alert.MitreTactic || alert.mitre_tactic || alert.MitreTechnique || alert.mitre_technique) && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-white mb-3">MITRE ATT&CK Framework</h3>
            <div className="grid grid-cols-2 gap-4">
              {(alert.MitreTactic || alert.mitre_tactic) && (
                <div>
                  <label className="text-gray-400 text-sm">Tactic</label>
                  <p className="text-purple-400 font-medium">{alert.MitreTactic || alert.mitre_tactic}</p>
                </div>
              )}
              {(alert.MitreTechnique || alert.mitre_technique) && (
                <div>
                  <label className="text-gray-400 text-sm">Technique</label>
                  <p className="text-purple-400 font-medium">{alert.MitreTechnique || alert.mitre_technique}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Response Actions */}
        {(alert.ResponseAction || alert.response_action) && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-white mb-3">Response Actions</h3>
            <div className="bg-white/5 rounded-lg p-4">
              <p className="text-gray-300">
                {alert.ResponseAction || alert.response_action}
              </p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4 mt-8 pt-6 border-t border-white/20">
          {alert.Status !== 'Investigating' && alert.Status !== 'Resolved' && (
            <button
              onClick={() => {
                onUpdateStatus(alert, 'Investigating');
                onClose();
              }}
              className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white py-3 rounded-xl transition-colors font-medium"
            >
              Mark as Investigating
            </button>
          )}
          {alert.Status !== 'Resolved' && (
            <button
              onClick={() => {
                onResolve(alert);
                onClose();
              }}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl transition-colors font-medium"
            >
              Resolve Alert
            </button>
          )}
          <button
            onClick={onClose}
            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-xl transition-colors font-medium"
          >
            Close
          </button>
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
          <label className="block text-sm font-medium text-gray-300 mb-2">Severity</label>
          <select
            value={filters.severity}
            onChange={(e) => onFiltersChange({ ...filters, severity: e.target.value })}
            className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
          >
            <option value="">All Severities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
          <select
            value={filters.status}
            onChange={(e) => onFiltersChange({ ...filters, status: e.target.value })}
            className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
          >
            <option value="">All Status</option>
            <option value="Open">Open</option>
            <option value="Investigating">Investigating</option>
            <option value="Resolved">Resolved</option>
            <option value="False Positive">False Positive</option>
            <option value="Suppressed">Suppressed</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Time Range</label>
          <select
            value={filters.timeRange}
            onChange={(e) => onFiltersChange({ ...filters, timeRange: e.target.value })}
            className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
          >
            <option value="1">Last 1 hour</option>
            <option value="6">Last 6 hours</option>
            <option value="24">Last 24 hours</option>
            <option value="48">Last 48 hours</option>
            <option value="168">Last 7 days</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Alert Type</label>
          <select
            value={filters.alertType}
            onChange={(e) => onFiltersChange({ ...filters, alertType: e.target.value })}
            className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
          >
            <option value="">All Types</option>
            <option value="Malware">Malware</option>
            <option value="Intrusion">Intrusion</option>
            <option value="Suspicious">Suspicious Activity</option>
            <option value="Policy">Policy Violation</option>
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

// Main Alerts Component
const Alerts = () => {
  const [alertsData, setAlertsData] = useState(null);
  const [alertsList, setAlertsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    severity: '',
    status: '',
    timeRange: '24',
    alertType: ''
  });

  // Fetch alerts overview data
  const fetchOverviewData = async (timeRange = 24) => {
    try {
      const data = await apiService.getAlertsList(null, null, timeRange, 100);
      setAlertsData({
        summary: {
          total_alerts: data.total_count || 0,
          critical_alerts: data.critical_count || 0,
          high_alerts: data.alerts?.filter(a => a.severity === 'High').length || 0,
          medium_alerts: data.alerts?.filter(a => a.severity === 'Medium').length || 0,
          low_alerts: data.alerts?.filter(a => a.severity === 'Low').length || 0,
          open_alerts: data.open_count || 0
        }
      });
    } catch (err) {
      console.error('Failed to fetch alerts overview:', err);
    }
  };

  // Fetch alerts list with pagination and filters
  const fetchAlertsData = async (page = 1, searchTerm = '', appliedFilters = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const queryFilters = {
        ...appliedFilters,
        search: searchTerm
      };

      const data = await apiService.getAlertsList(page, 20, queryFilters);
      setAlertsList(data.alerts || data.data || []);
      setTotalPages(data.total_pages || Math.ceil((data.total || 0) / 20));
      setCurrentPage(page);
    } catch (err) {
      setError(err.message);
      console.error('Failed to fetch alerts data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle alert status update
  const handleUpdateStatus = async (alert, newStatus) => {
    try {
      await apiService.updateAlertStatus(alert.AlertID || alert.alert_id, newStatus);
      // Refresh the alerts list
      fetchAlertsData(currentPage, searchQuery, filters);
      fetchOverviewData(parseInt(filters.timeRange));
    } catch (err) {
      console.error('Failed to update alert status:', err);
    }
  };

  // Handle alert resolution
  const handleResolveAlert = async (alert) => {
    try {
      await apiService.updateAlertStatus(alert.AlertID || alert.alert_id, 'Resolved');
      // Refresh the alerts list
      fetchAlertsData(currentPage, searchQuery, filters);
      fetchOverviewData(parseInt(filters.timeRange));
    } catch (err) {
      console.error('Failed to resolve alert:', err);
    }
  };

  // Handle search
  const handleSearch = (query) => {
    setSearchQuery(query);
    fetchAlertsData(1, query, filters);
  };

  // Handle filter application
  const handleApplyFilters = () => {
    fetchAlertsData(1, searchQuery, filters);
    fetchOverviewData(parseInt(filters.timeRange));
  };

  // Handle filter reset
  const handleResetFilters = () => {
    const resetFilters = { severity: '', status: '', timeRange: '24', alertType: '' };
    setFilters(resetFilters);
    setSearchQuery('');
    fetchAlertsData(1, '', resetFilters);
    fetchOverviewData(24);
  };

  // Handle pagination
  const handlePageChange = (page) => {
    fetchAlertsData(page, searchQuery, filters);
  };

  // Initial data fetch
  useEffect(() => {
    fetchOverviewData(parseInt(filters.timeRange));
    fetchAlertsData();
    
    // Set up periodic refresh every 30 seconds
    const interval = setInterval(() => {
      fetchOverviewData(parseInt(filters.timeRange));
      fetchAlertsData(currentPage, searchQuery, filters);
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  // Update overview when time range filter changes
  useEffect(() => {
    if (filters.timeRange) {
      fetchOverviewData(parseInt(filters.timeRange));
    }
  }, [filters.timeRange]);

  if (loading && !alertsList.length) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <div className="text-gray-400">Loading alerts data...</div>
        </div>
      </div>
    );
  }

  if (error && !alertsList.length) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-red-400 text-xl mb-2">⚠️ Error Loading Alerts</div>
          <div className="text-gray-400 mb-4">{error}</div>
          <button 
            onClick={() => fetchAlertsData()} 
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
          <h1 className="text-3xl font-bold text-white">Security Alerts</h1>
          <p className="text-gray-400 mt-1">Monitor and respond to security incidents and threats</p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              fetchOverviewData(parseInt(filters.timeRange));
              fetchAlertsData(currentPage, searchQuery, filters);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors"
          >
            <ArrowPathIcon className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Alert Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <ExclamationTriangleIcon className="w-6 h-6 text-blue-400" />
            <span className="text-lg font-semibold text-white">Total Alerts</span>
          </div>
          <div className="text-3xl font-bold text-blue-400">
            {alertsData?.summary?.total_alerts?.toLocaleString() || 0}
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <FireIcon className="w-6 h-6 text-red-400" />
            <span className="text-lg font-semibold text-white">Critical</span>
          </div>
          <div className="text-3xl font-bold text-red-400">
            {alertsData?.summary?.critical_alerts?.toLocaleString() || 0}
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <ExclamationTriangleIcon className="w-6 h-6 text-orange-400" />
            <span className="text-lg font-semibold text-white">High</span>
          </div>
          <div className="text-3xl font-bold text-orange-400">
            {alertsData?.summary?.high_alerts?.toLocaleString() || 0}
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <ClockIcon className="w-6 h-6 text-yellow-400" />
            <span className="text-lg font-semibold text-white">Open</span>
          </div>
          <div className="text-3xl font-bold text-yellow-400">
            {alertsData?.summary?.open_alerts?.toLocaleString() || 0}
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

        {/* Alerts List */}
        <div className="lg:col-span-3 space-y-6">
          {/* Search */}
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search alerts by title, type, or agent..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
            />
          </div>

          {/* Alerts Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-white">
                Alerts ({alertsList.length} of {alertsData?.summary?.total_alerts || 0})
              </h3>
              {loading && (
                <div className="text-sm text-gray-400">Updating...</div>
              )}
            </div>

            {alertsList.length > 0 ? (
              <div className="space-y-4">
                {alertsList.map((alert, index) => (
                  <AlertCard
                    key={alert.AlertID || alert.alert_id || index}
                    alert={alert}
                    onViewDetails={setSelectedAlert}
                    onUpdateStatus={handleUpdateStatus}
                    onResolve={handleResolveAlert}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <ExclamationTriangleIcon className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                <h3 className="text-xl font-medium text-gray-400 mb-2">No alerts found</h3>
                <p className="text-gray-500">
                  {searchQuery || Object.values(filters).some(f => f && f !== '24') 
                    ? 'Try adjusting your search criteria' 
                    : 'No alerts match the current time range'
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

      {/* Alert Details Modal */}
      {selectedAlert && (
        <AlertDetailsModal
          alert={selectedAlert}
          onClose={() => setSelectedAlert(null)}
          onUpdateStatus={handleUpdateStatus}
          onResolve={handleResolveAlert}
        />
      )}
    </div>
  );
};

export default Alerts;