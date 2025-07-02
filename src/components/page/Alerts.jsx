import React, { useEffect, useState } from 'react';
import {
  BellIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowPathIcon,
  EyeIcon,
  XCircleIcon,
  ArrowDownTrayIcon,
  ShieldExclamationIcon,
  UserIcon,
  ComputerDesktopIcon,
  GlobeAltIcon,
  DocumentIcon,
  CpuChipIcon
} from '@heroicons/react/24/outline';
import { fetchAlerts } from '../../service/api';

const severityMap = {
  critical: 'text-red-400',
  high: 'text-orange-400',
  medium: 'text-yellow-400',
  low: 'text-green-400',
  info: 'text-blue-400',
};

const statusMap = {
  open: 'text-red-400',
  investigating: 'text-yellow-400',
  resolved: 'text-green-400',
  closed: 'text-gray-400',
};

const Alerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterSeverity, setFilterSeverity] = useState('All');
  const [selectedAlerts, setSelectedAlerts] = useState([]);
  const [showDetails, setShowDetails] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const fetchAlertsData = async () => {
    setLoading(true);
    try {
      const data = await fetchAlerts();
      setAlerts(data.alerts || []);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      setError('Cannot load alerts data. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlertsData();
    const interval = setInterval(fetchAlertsData, 30000);
    return () => clearInterval(interval);
  }, []);

  const filtered = alerts.filter(alert => {
    const matchesSearch = (alert.alert_type || '').toLowerCase().includes(search.toLowerCase()) ||
      (alert.description || '').toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === 'All' || (alert.status || '').toLowerCase() === filterStatus.toLowerCase();
    const matchesSeverity = filterSeverity === 'All' || (alert.severity || '').toLowerCase() === filterSeverity.toLowerCase();
    return matchesSearch && matchesStatus && matchesSeverity;
  });

  const stats = {
    total: alerts.length,
    open: alerts.filter(a => (a.status || '').toLowerCase() === 'open').length,
    investigating: alerts.filter(a => (a.status || '').toLowerCase() === 'investigating').length,
    resolved: alerts.filter(a => (a.status || '').toLowerCase() === 'resolved').length,
    critical: alerts.filter(a => (a.severity || '').toLowerCase() === 'critical').length,
    high: alerts.filter(a => (a.severity || '').toLowerCase() === 'high').length,
    medium: alerts.filter(a => (a.severity || '').toLowerCase() === 'medium').length,
  };

  const toggleSelectAlert = (alertId) => {
    setSelectedAlerts(prev =>
      prev.includes(alertId)
        ? prev.filter(id => id !== alertId)
        : [...prev, alertId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedAlerts.length === filtered.length) {
      setSelectedAlerts([]);
    } else {
      setSelectedAlerts(filtered.map(alert => alert.alert_id || alert.AlertID));
    }
  };

  const exportAlerts = () => {
    const csvContent = [
      ['Type', 'Description', 'Status', 'Severity', 'Agent', 'Time', 'Details'],
      ...filtered.map(alert => [
        alert.alert_type,
        alert.description,
        alert.status,
        alert.severity,
        alert.agent_id,
        alert.alert_timestamp,
        alert.alert_details || ''
      ])
    ].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `alerts_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-purple-200 rounded-full animate-spin"></div>
            <div className="w-20 h-20 border-4 border-purple-600 border-t-transparent rounded-full animate-spin absolute top-0"></div>
          </div>
          <h3 className="mt-6 text-xl font-semibold text-gray-100">Loading Alerts...</h3>
          <p className="mt-2 text-gray-400">Fetching alert data...</p>
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
            onClick={fetchAlertsData}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium"
          >Try Again</button>
        </div>
      </div>
    );
  }
  if (filtered.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950">
        <BellIcon className="w-20 h-20 text-purple-900/30 mb-6" />
        <h3 className="text-2xl font-semibold text-gray-100 mb-2">No Alerts Found</h3>
        <p className="text-gray-400 mb-6">No alerts match your search or filter criteria.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 text-white">
      {/* Header & Stats */}
      <div className="px-8 py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-white/10 bg-white/10 backdrop-blur-xl shadow-lg sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <BellIcon className="w-10 h-10 text-purple-400 drop-shadow-lg" />
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent tracking-tight">Alerts</h1>
            <p className="text-gray-300 text-sm mt-1">Monitor security alerts and incidents</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={fetchAlertsData}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium disabled:opacity-50 shadow-lg"
          >
            <ArrowPathIcon className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            onClick={exportAlerts}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium shadow-lg"
          >
            <ArrowDownTrayIcon className="w-5 h-5" />
            Export
          </button>
          <div className="flex items-center gap-2 text-sm text-gray-200">
            <ClockIcon className="w-4 h-4" />
            <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="p-8 grid grid-cols-2 md:grid-cols-7 gap-4">
        <div className="bg-gradient-to-br from-purple-700 to-purple-900 rounded-2xl shadow-2xl p-4 flex flex-col gap-2 hover:scale-[1.03] transition-transform duration-300 border border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <BellIcon className="w-6 h-6 text-purple-300" />
            <span className="text-sm font-semibold text-purple-100">Total</span>
          </div>
          <div className="text-2xl font-bold text-white drop-shadow-lg">{stats.total}</div>
        </div>
        <div className="bg-gradient-to-br from-red-700 to-red-900 rounded-2xl shadow-2xl p-4 flex flex-col gap-2 hover:scale-[1.03] transition-transform duration-300 border border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <ExclamationTriangleIcon className="w-6 h-6 text-red-300" />
            <span className="text-sm font-semibold text-red-100">Open</span>
          </div>
          <div className="text-2xl font-bold text-white drop-shadow-lg">{stats.open}</div>
        </div>
        <div className="bg-gradient-to-br from-yellow-700 to-yellow-900 rounded-2xl shadow-2xl p-4 flex flex-col gap-2 hover:scale-[1.03] transition-transform duration-300 border border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <ClockIcon className="w-6 h-6 text-yellow-300" />
            <span className="text-sm font-semibold text-yellow-100">Investigating</span>
          </div>
          <div className="text-2xl font-bold text-white drop-shadow-lg">{stats.investigating}</div>
        </div>
        <div className="bg-gradient-to-br from-green-700 to-green-900 rounded-2xl shadow-2xl p-4 flex flex-col gap-2 hover:scale-[1.03] transition-transform duration-300 border border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircleIcon className="w-6 h-6 text-green-300" />
            <span className="text-sm font-semibold text-green-100">Resolved</span>
          </div>
          <div className="text-2xl font-bold text-white drop-shadow-lg">{stats.resolved}</div>
        </div>
        <div className="bg-gradient-to-br from-red-700 to-pink-900 rounded-2xl shadow-2xl p-4 flex flex-col gap-2 hover:scale-[1.03] transition-transform duration-300 border border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <ShieldExclamationIcon className="w-6 h-6 text-red-300" />
            <span className="text-sm font-semibold text-red-100">Critical</span>
          </div>
          <div className="text-2xl font-bold text-white drop-shadow-lg">{stats.critical}</div>
        </div>
        <div className="bg-gradient-to-br from-orange-700 to-orange-900 rounded-2xl shadow-2xl p-4 flex flex-col gap-2 hover:scale-[1.03] transition-transform duration-300 border border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <ExclamationTriangleIcon className="w-6 h-6 text-orange-300" />
            <span className="text-sm font-semibold text-orange-100">High</span>
          </div>
          <div className="text-2xl font-bold text-white drop-shadow-lg">{stats.high}</div>
        </div>
        <div className="bg-gradient-to-br from-yellow-700 to-yellow-900 rounded-2xl shadow-2xl p-4 flex flex-col gap-2 hover:scale-[1.03] transition-transform duration-300 border border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <ExclamationTriangleIcon className="w-6 h-6 text-yellow-300" />
            <span className="text-sm font-semibold text-yellow-100">Medium</span>
          </div>
          <div className="text-2xl font-bold text-white drop-shadow-lg">{stats.medium}</div>
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
              placeholder="Search alert type or description..."
              className="pl-10 pr-4 py-2 bg-white/10 border border-white/10 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder:text-gray-400"
            />
          </div>
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="px-4 py-2 bg-white/10 border border-white/10 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
          >
            <option value="All">All Status</option>
            <option value="Open">Open</option>
            <option value="Investigating">Investigating</option>
            <option value="Resolved">Resolved</option>
            <option value="Closed">Closed</option>
          </select>
          <select
            value={filterSeverity}
            onChange={e => setFilterSeverity(e.target.value)}
            className="px-4 py-2 bg-white/10 border border-white/10 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
          >
            <option value="All">All Severity</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
            <option value="Info">Info</option>
          </select>
        </div>
        {selectedAlerts.length > 0 && (
          <div className="flex gap-2 items-center bg-purple-900/60 px-4 py-2 rounded-lg shadow-lg">
            <span className="text-purple-200 font-medium">{selectedAlerts.length} selected</span>
            <button className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700">Export Selected</button>
            <button className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700">Delete Selected</button>
          </div>
        )}
      </div>

      {/* Alerts Table */}
      <div className="px-8 overflow-x-auto rounded-2xl shadow-2xl bg-white/10 border border-white/10">
        <table className="min-w-full divide-y divide-white/10">
          <thead className="bg-white/5">
            <tr>
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  checked={selectedAlerts.length === filtered.length && filtered.length > 0}
                  onChange={toggleSelectAll}
                  className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">Severity</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">Agent</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">Time</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white/5 divide-y divide-white/10">
            {filtered.map(alert => (
              <tr key={alert.alert_id || alert.AlertID} className="hover:bg-purple-900/30 transition-all">
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedAlerts.includes(alert.alert_id || alert.AlertID)}
                    onChange={() => toggleSelectAlert(alert.alert_id || alert.AlertID)}
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap font-medium text-white">{alert.alert_type}</td>
                <td className="px-6 py-4 text-gray-200 max-w-xs truncate">{alert.description}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 bg-${(alert.status || '').toLowerCase() === 'open' ? 'red' : (alert.status || '').toLowerCase() === 'investigating' ? 'yellow' : (alert.status || '').toLowerCase() === 'resolved' ? 'green' : 'gray'}-900/60 text-${(alert.status || '').toLowerCase() === 'open' ? 'red' : (alert.status || '').toLowerCase() === 'investigating' ? 'yellow' : (alert.status || '').toLowerCase() === 'resolved' ? 'green' : 'gray'}-200 rounded-full text-xs font-medium`}>
                    {alert.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 bg-${(alert.severity || '').toLowerCase() === 'critical' ? 'red' : (alert.severity || '').toLowerCase() === 'high' ? 'orange' : (alert.severity || '').toLowerCase() === 'medium' ? 'yellow' : (alert.severity || '').toLowerCase() === 'low' ? 'green' : 'blue'}-900/60 text-${(alert.severity || '').toLowerCase() === 'critical' ? 'red' : (alert.severity || '').toLowerCase() === 'high' ? 'orange' : (alert.severity || '').toLowerCase() === 'medium' ? 'yellow' : (alert.severity || '').toLowerCase() === 'low' ? 'green' : 'blue'}-200 rounded-full text-xs font-medium`}>
                    {alert.severity}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-200">{alert.agent_id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-200">{alert.alert_timestamp}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => setShowDetails(alert)}
                    className="text-purple-400 hover:text-purple-300 font-medium underline"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Alert Details Modal */}
      {showDetails && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/10 rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-white/10 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Alert Details</h2>
              <button
                onClick={() => setShowDetails(null)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <XCircleIcon className="w-6 h-6 text-gray-300" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Alert Information</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-300">Alert Type</label>
                    <p className="text-white">{showDetails.alert_type}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-300">Description</label>
                    <p className="text-white">{showDetails.description}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-300">Status</label>
                    <p className={`font-semibold ${statusMap[(showDetails.status || '').toLowerCase()]}`}>
                      {showDetails.status}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-300">Severity</label>
                    <p className={`font-semibold ${severityMap[(showDetails.severity || '').toLowerCase()]}`}>
                      {showDetails.severity}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-300">Agent ID</label>
                    <p className="text-white">{showDetails.agent_id}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-300">Timestamp</label>
                    <p className="text-white">{showDetails.alert_timestamp}</p>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Alert Details</h3>
                <div className="bg-gray-800/60 rounded-lg p-4">
                  <pre className="text-sm text-gray-200 whitespace-pre-wrap">
                    {JSON.stringify(showDetails.alert_details || showDetails, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Alerts;