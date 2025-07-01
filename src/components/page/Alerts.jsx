import React, { useEffect, useState } from 'react';
import { 
  ExclamationTriangleIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  BellIcon,
  ShieldExclamationIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowPathIcon,
  EyeIcon,
  ClockIcon,
  FireIcon,
  BoltIcon,
  ComputerDesktopIcon
} from '@heroicons/react/24/outline';
// axios import removed - will be handled by parent component

const Alerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSeverity, setFilterSeverity] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedAlerts, setSelectedAlerts] = useState([]);
  const [showDetails, setShowDetails] = useState(null);

  // Fetch alerts data
  const fetchAlertsData = async () => {
    setLoading(true);
    try {
      const [listRes, statsRes] = await Promise.all([
        fetch('http://192.168.20.85:5000/api/v1/alerts/list').then(res => res.json()),
        fetch('http://192.168.20.85:5000/api/v1/alerts/stats/summary').then(res => res.json())
      ]);

      setAlerts(listRes.alerts || []);
      setStats(statsRes);
      setError(null);
    } catch (err) {
      console.error('Error fetching alerts data:', err);
      setError('Cannot load alerts data. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlertsData();
  }, []);

  // Manual refresh
  const handleRefresh = () => {
    fetchAlertsData();
  };

  // Severity badge component
  const getSeverityInfo = (severity) => {
    const severityLower = (severity || '').toLowerCase();
    
    const severityMap = {
      'critical': {
        bg: 'bg-red-100',
        text: 'text-red-800',
        border: 'border-red-200',
        icon: FireIcon,
        iconColor: 'text-red-600',
        label: 'Critical'
      },
      'high': {
        bg: 'bg-orange-100',
        text: 'text-orange-800',
        border: 'border-orange-200',
        icon: ExclamationTriangleIcon,
        iconColor: 'text-orange-600',
        label: 'High'
      },
      'medium': {
        bg: 'bg-yellow-100',
        text: 'text-yellow-800',
        border: 'border-yellow-200',
        icon: BellIcon,
        iconColor: 'text-yellow-600',
        label: 'Medium'
      },
      'low': {
        bg: 'bg-green-100',
        text: 'text-green-800',
        border: 'border-green-200',
        icon: CheckCircleIcon,
        iconColor: 'text-green-600',
        label: 'Low'
      }
    };

    return severityMap[severityLower] || {
      bg: 'bg-gray-100',
      text: 'text-gray-800',
      border: 'border-gray-200',
      icon: BellIcon,
      iconColor: 'text-gray-600',
      label: severity || 'Unknown'
    };
  };

  // Status badge component
  const getStatusInfo = (status) => {
    const statusLower = (status || '').toLowerCase();
    
    const statusMap = {
      'open': {
        bg: 'bg-red-100',
        text: 'text-red-800',
        border: 'border-red-200',
        label: 'Open'
      },
      'investigating': {
        bg: 'bg-blue-100',
        text: 'text-blue-800',
        border: 'border-blue-200',
        label: 'Investigating'
      },
      'resolved': {
        bg: 'bg-green-100',
        text: 'text-green-800',
        border: 'border-green-200',
        label: 'Resolved'
      },
      'false_positive': {
        bg: 'bg-gray-100',
        text: 'text-gray-800',
        border: 'border-gray-200',
        label: 'False Positive'
      },
      'suppressed': {
        bg: 'bg-purple-100',
        text: 'text-purple-800',
        border: 'border-purple-200',
        label: 'Suppressed'
      }
    };

    return statusMap[statusLower] || {
      bg: 'bg-gray-100',
      text: 'text-gray-800',
      border: 'border-gray-200',
      label: status || 'Unknown'
    };
  };

  // Filter alerts
  const filteredAlerts = alerts.filter(alert => {
    const matchesSearch = 
      (alert.title || alert.Title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (alert.agent_id || alert.AgentID || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (alert.detection_method || alert.DetectionMethod || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSeverity = filterSeverity === 'All' || 
      (alert.severity || alert.Severity || '').toLowerCase() === filterSeverity.toLowerCase();
    
    const matchesStatus = filterStatus === 'All' ||
      (alert.status || alert.Status || '').toLowerCase() === filterStatus.toLowerCase();
    
    return matchesSearch && matchesSeverity && matchesStatus;
  });

  // Get time ago
  const getTimeAgo = (timestamp) => {
    if (!timestamp) return 'Unknown';
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

  // Select alert
  const toggleSelectAlert = (alertId) => {
    setSelectedAlerts(prev => 
      prev.includes(alertId) 
        ? prev.filter(id => id !== alertId)
        : [...prev, alertId]
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-red-200 rounded-full animate-spin"></div>
            <div className="w-20 h-20 border-4 border-red-600 border-t-transparent rounded-full animate-spin absolute top-0"></div>
          </div>
          <h3 className="mt-6 text-xl font-semibold text-gray-700">Loading Alerts</h3>
          <p className="mt-2 text-gray-500">Fetching security alerts...</p>
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50 to-pink-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-lg shadow-lg border-b border-white/20 px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-r from-red-600 to-pink-600 rounded-xl shadow-lg">
              <ExclamationTriangleIcon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
                Security Alerts
              </h1>
              <p className="text-gray-600 text-sm">Monitor and investigate security incidents</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 disabled:opacity-50"
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
                <div className="text-3xl font-bold text-gray-900">{stats?.total_alerts || alerts.length}</div>
                <div className="text-sm text-gray-600 font-medium">Total Alerts</div>
              </div>
              <div className="p-3 bg-red-100 rounded-xl">
                <ExclamationTriangleIcon className="w-8 h-8 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-red-600">{stats?.critical_alerts || 0}</div>
                <div className="text-sm text-gray-600 font-medium">Critical</div>
              </div>
              <div className="p-3 bg-red-100 rounded-xl">
                <FireIcon className="w-8 h-8 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-yellow-600">{stats?.open_alerts || 0}</div>
                <div className="text-sm text-gray-600 font-medium">Open</div>
              </div>
              <div className="p-3 bg-yellow-100 rounded-xl">
                <BellIcon className="w-8 h-8 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-green-600">{stats?.resolved_alerts || 0}</div>
                <div className="text-sm text-gray-600 font-medium">Resolved</div>
              </div>
              <div className="p-3 bg-green-100 rounded-xl">
                <CheckCircleIcon className="w-8 h-8 text-green-600" />
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
                  placeholder="Search alerts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2.5 w-80 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
                />
              </div>

              {/* Severity Filter */}
              <div className="flex items-center space-x-2">
                <FunnelIcon className="w-5 h-5 text-gray-400" />
                <select
                  value={filterSeverity}
                  onChange={(e) => setFilterSeverity(e.target.value)}
                  className="border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
                >
                  <option value="All">All Severities</option>
                  <option value="critical">Critical</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>

              {/* Status Filter */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
              >
                <option value="All">All Status</option>
                <option value="open">Open</option>
                <option value="investigating">Investigating</option>
                <option value="resolved">Resolved</option>
                <option value="false_positive">False Positive</option>
                <option value="suppressed">Suppressed</option>
              </select>
            </div>

            <div className="flex items-center space-x-4">
              {selectedAlerts.length > 0 && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">{selectedAlerts.length} selected</span>
                  <button className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition-colors">
                    Actions
                  </button>
                </div>
              )}
              <div className="text-sm text-gray-500">
                Showing {filteredAlerts.length} of {alerts.length} alerts
              </div>
            </div>
          </div>
        </div>

        {/* Alerts List */}
        <div className="space-y-4">
          {filteredAlerts.map((alert, index) => {
            const alertId = alert.alert_id || alert.AlertID || index;
            const title = alert.title || alert.Title || 'Unknown Alert';
            const severity = alert.severity || alert.Severity || 'Unknown';
            const status = alert.status || alert.Status || 'Unknown';
            const agentId = alert.agent_id || alert.AgentID || 'N/A';
            const detectionMethod = alert.detection_method || alert.DetectionMethod || alert.alert_type || alert.AlertType || 'N/A';
            const firstDetected = alert.first_detected || alert.FirstDetected;
            
            const severityInfo = getSeverityInfo(severity);
            const statusInfo = getStatusInfo(status);
            const SeverityIcon = severityInfo.icon;

            return (
              <div key={alertId} className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300">
                <div className="flex items-start space-x-4">
                  {/* Checkbox */}
                  <div className="flex items-center pt-1">
                    <input
                      type="checkbox"
                      checked={selectedAlerts.includes(alertId)}
                      onChange={() => toggleSelectAlert(alertId)}
                      className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                    />
                  </div>

                  {/* Severity Icon */}
                  <div className={`p-3 rounded-xl ${severityInfo.bg}`}>
                    <SeverityIcon className={`w-6 h-6 ${severityInfo.iconColor}`} />
                  </div>

                  {/* Alert Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 mb-1">{title}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <ComputerDesktopIcon className="w-4 h-4" />
                            <span>Agent: {agentId}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <BoltIcon className="w-4 h-4" />
                            <span>Method: {detectionMethod}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <ClockIcon className="w-4 h-4" />
                            <span>{getTimeAgo(firstDetected)}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <span className={`px-3 py-1 text-sm font-medium rounded-full ${severityInfo.bg} ${severityInfo.text} ${severityInfo.border} border`}>
                          {severityInfo.label}
                        </span>
                        <span className={`px-3 py-1 text-sm font-medium rounded-full ${statusInfo.bg} ${statusInfo.text} ${statusInfo.border} border`}>
                          {statusInfo.label}
                        </span>
                      </div>
                    </div>

                    {/* Alert Description */}
                    {(alert.description || alert.Description) && (
                      <p className="text-gray-700 mb-4 text-sm leading-relaxed">
                        {alert.description || alert.Description}
                      </p>
                    )}

                    {/* Action Buttons */}
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => setShowDetails(alertId)}
                        className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 text-sm font-medium"
                      >
                        <EyeIcon className="w-4 h-4" />
                        <span>Investigate</span>
                      </button>
                      
                      {status?.toLowerCase() === 'open' && (
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium">
                          Acknowledge
                        </button>
                      )}
                      
                      <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-200 text-sm font-medium">
                        False Positive
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredAlerts.length === 0 && (
          <div className="text-center py-16">
            <ExclamationTriangleIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No alerts found</h3>
            <p className="text-gray-500">
              {alerts.length === 0 
                ? "No security alerts at this time." 
                : "No alerts match your search criteria."
              }
            </p>
            {searchTerm && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilterSeverity('All');
                  setFilterStatus('All');
                }}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Alert Details Modal */}
      {showDetails && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Alert Investigation</h2>
              <button
                onClick={() => setShowDetails(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <XCircleIcon className="w-6 h-6 text-gray-500" />
              </button>
            </div>
            
            {/* Alert details content would go here */}
            <div className="space-y-4">
              <div className="text-center py-8 text-gray-500">
                <ExclamationTriangleIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Detailed alert investigation view coming soon...</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Alerts;