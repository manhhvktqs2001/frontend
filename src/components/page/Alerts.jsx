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
  CpuChipIcon,
  TrashIcon
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
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(50);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const fetchAlertsData = async () => {
    setLoading(true);
    try {
      const data = await fetchAlerts({ limit: 1000, hours: 0 });
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

  useEffect(() => { setCurrentPage(1); }, [search, filterStatus, filterSeverity]);

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

  // Export tất cả alerts
  const exportAlerts = () => {
    const csvContent = [
      ['Type', 'Title', 'Description', 'Status', 'Severity', 'Agent', 'First Detected', 'Timestamp', 'Details'],
      ...filtered.map(alert => [
        alert.alert_type || '',
        alert.title || '',
        alert.description || '',
        alert.status || '',
        alert.severity || '',
        alert.agent_id || '',
        alert.first_detected || '',
        alert.alert_timestamp || '',
        JSON.stringify(alert.alert_details || {})
      ])
    ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `all_alerts_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Export chỉ những alerts được chọn
  const exportSelectedAlerts = () => {
    if (selectedAlerts.length === 0) {
      alert('Please select at least one alert to export.');
      return;
    }

    const selectedData = alerts.filter(alert => 
      selectedAlerts.includes(alert.alert_id || alert.AlertID)
    );

    const csvContent = [
      ['Type', 'Title', 'Description', 'Status', 'Severity', 'Agent', 'First Detected', 'Timestamp', 'Details'],
      ...selectedData.map(alert => [
        alert.alert_type || '',
        alert.title || '',
        alert.description || '',
        alert.status || '',
        alert.severity || '',
        alert.agent_id || '',
        alert.first_detected || '',
        alert.alert_timestamp || '',
        JSON.stringify(alert.alert_details || {})
      ])
    ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `selected_alerts_${selectedAlerts.length}_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Delete những alerts được chọn
  const deleteSelectedAlerts = () => {
    if (selectedAlerts.length === 0) {
      alert('Please select at least one alert to delete.');
      return;
    }
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    const updatedAlerts = alerts.filter(alert => 
      !selectedAlerts.includes(alert.alert_id || alert.AlertID)
    );
    setAlerts(updatedAlerts);
    setSelectedAlerts([]);
    setShowDeleteConfirm(false);
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentAlerts = filtered.slice(startIndex, endIndex);
  const goToPage = (page) => setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  const goToNextPage = () => { if (currentPage < totalPages) setCurrentPage(currentPage + 1); };
  const goToPrevPage = () => { if (currentPage > 1) setCurrentPage(currentPage - 1); };

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
            Export All
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
        </div>
        {selectedAlerts.length > 0 && (
          <div className="flex gap-2 items-center bg-purple-900/60 px-4 py-2 rounded-lg shadow-lg animate-fadeIn">
            <span className="text-purple-200 font-medium">{selectedAlerts.length} selected</span>
            <button 
              onClick={exportSelectedAlerts}
              className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors font-medium"
            >
              <ArrowDownTrayIcon className="w-4 h-4" />
              Export Selected
            </button>
            <button 
              onClick={deleteSelectedAlerts}
              className="flex items-center gap-1 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors font-medium"
            >
              <TrashIcon className="w-4 h-4" />
              Delete Selected
            </button>
          </div>
        )}
      </div>

      {/* Alerts Table hoặc thông báo không có dữ liệu */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24">
          <BellIcon className="w-20 h-20 text-purple-900/30 mb-6" />
          <h3 className="text-2xl font-semibold text-gray-100 mb-2">No Alerts Found</h3>
          <p className="text-gray-400 mb-6">No alerts match your search or filter criteria.</p>
        </div>
      ) : (
        <div className="px-8 overflow-x-auto rounded-2xl shadow-2xl bg-white/10 border border-white/10">
          <table className="min-w-full divide-y divide-white/10 table-fixed">
            <thead className="bg-white/5">
              <tr>
                <th className="px-2 py-3 text-left w-8">
                  <input
                    type="checkbox"
                    checked={selectedAlerts.length === filtered.length && filtered.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                </th>
                <th className="px-2 py-3 text-left text-xs font-bold text-gray-300 uppercase tracking-wider w-32">Type</th>
                <th className="px-2 py-3 text-left text-xs font-bold text-gray-300 uppercase tracking-wider w-64">Title</th>
                <th className="px-2 py-3 text-left text-xs font-bold text-gray-300 uppercase tracking-wider w-20">Status</th>
                <th className="px-2 py-3 text-left text-xs font-bold text-gray-300 uppercase tracking-wider w-20">Severity</th>
                <th className="px-2 py-3 text-left text-xs font-bold text-gray-300 uppercase tracking-wider w-56">Agent</th>
                <th className="px-2 py-3 text-left text-xs font-bold text-gray-300 uppercase tracking-wider w-40">First Detected</th>
                <th className="px-2 py-3 text-left text-xs font-bold text-gray-300 uppercase tracking-wider w-28">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white/5 divide-y divide-white/10 text-sm">
              {currentAlerts.map(alert => (
                <tr key={alert.alert_id || alert.AlertID} className="hover:bg-purple-900/30 transition-all">
                  <td className="px-2 py-2">
                    <input
                      type="checkbox"
                      checked={selectedAlerts.includes(alert.alert_id || alert.AlertID)}
                      onChange={() => toggleSelectAlert(alert.alert_id || alert.AlertID)}
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                  </td>
                  <td className="px-2 py-2 whitespace-normal break-all max-w-xs">{alert.alert_type}</td>
                  <td className="px-2 py-2 whitespace-normal break-all max-w-xs">{alert.title}</td>
                  <td className="px-2 py-2 whitespace-nowrap">
                    <span className={`px-2 py-1 bg-${(alert.status || '').toLowerCase() === 'open' ? 'red' : (alert.status || '').toLowerCase() === 'investigating' ? 'yellow' : (alert.status || '').toLowerCase() === 'resolved' ? 'green' : 'gray'}-900/60 text-${(alert.status || '').toLowerCase() === 'open' ? 'red' : (alert.status || '').toLowerCase() === 'investigating' ? 'yellow' : (alert.status || '').toLowerCase() === 'resolved' ? 'green' : 'gray'}-200 rounded-full text-xs font-medium`}>
                      {alert.status}
                    </span>
                  </td>
                  <td className="px-2 py-2 whitespace-nowrap">
                    <span className={`px-2 py-1 bg-${(alert.severity || '').toLowerCase() === 'critical' ? 'red' : (alert.severity || '').toLowerCase() === 'high' ? 'orange' : (alert.severity || '').toLowerCase() === 'medium' ? 'yellow' : (alert.severity || '').toLowerCase() === 'low' ? 'green' : 'blue'}-900/60 text-${(alert.severity || '').toLowerCase() === 'critical' ? 'red' : (alert.severity || '').toLowerCase() === 'high' ? 'orange' : (alert.severity || '').toLowerCase() === 'medium' ? 'yellow' : (alert.severity || '').toLowerCase() === 'low' ? 'green' : 'blue'}-200 rounded-full text-xs font-medium`}>
                      {alert.severity}
                    </span>
                  </td>
                  <td className="px-2 py-2 whitespace-normal break-all max-w-xs">{alert.agent_id}</td>
                  <td className="px-2 py-2 whitespace-normal break-all max-w-xs">{alert.first_detected}</td>
                  <td className="px-2 py-2 whitespace-nowrap">
                    <button
                      onClick={() => setShowDetails(alert)}
                      className="px-4 py-1 rounded-full bg-purple-700 text-white font-medium shadow hover:bg-purple-800 transition-all duration-150 border-2 border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500 text-xs"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-4 py-6 flex items-center justify-between bg-white/10 rounded-2xl shadow-xl border border-white/10 animate-fadeIn">
          <div className="flex items-center gap-4">
            <span className="text-gray-300 text-sm">
              Showing {startIndex + 1} to {Math.min(endIndex, filtered.length)} of {filtered.length} alerts
            </span>
            <span className="text-gray-400 text-sm">
              Page {currentPage} of {totalPages}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={goToPrevPage} disabled={currentPage === 1} className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${currentPage === 1 ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-purple-600 text-white hover:bg-purple-700 hover:scale-105'}`}>Previous</button>
            <div className="flex gap-1">
              {currentPage > 3 && (<button onClick={() => goToPage(1)} className="px-3 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors">1</button>)}
              {currentPage > 4 && (<span className="px-3 py-2 text-gray-400">...</span>)}
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => { const page = currentPage - 2 + i; if (page > 0 && page <= totalPages) { return (<button key={page} onClick={() => goToPage(page)} className={`px-3 py-2 rounded-lg font-medium transition-all duration-200 ${page === currentPage ? 'bg-purple-800 text-white scale-110' : 'bg-purple-600 text-white hover:bg-purple-700 hover:scale-105'}`}>{page}</button>); } return null; })}
              {currentPage < totalPages - 3 && (<span className="px-3 py-2 text-gray-400">...</span>)}
              {currentPage < totalPages - 2 && (<button onClick={() => goToPage(totalPages)} className="px-3 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors">{totalPages}</button>)}
            </div>
            <button onClick={goToNextPage} disabled={currentPage === totalPages} className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${currentPage === totalPages ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-purple-600 text-white hover:bg-purple-700 hover:scale-105'}`}>Next</button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-gradient-to-br from-slate-900 via-red-950 to-purple-950 border border-red-400/20 rounded-2xl shadow-2xl max-w-md w-full relative animate-fadeIn">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <ExclamationTriangleIcon className="w-8 h-8 text-red-400" />
                <h2 className="text-xl font-bold text-white">Confirm Delete</h2>
              </div>
              <p className="text-gray-300 mb-6">
                Are you sure you want to delete {selectedAlerts.length} selected alert{selectedAlerts.length !== 1 ? 's' : ''}? This action cannot be undone.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={cancelDelete}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center gap-2"
                >
                  <TrashIcon className="w-4 h-4" />
                  Delete {selectedAlerts.length} Alert{selectedAlerts.length !== 1 ? 's' : ''}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Alert Details Modal */}
      {showDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 border border-white/10 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto relative animate-fadeIn">
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div className="flex items-center gap-3">
                <EyeIcon className="w-8 h-8 text-purple-400" />
                <h2 className="text-2xl font-bold text-white">Alert Details</h2>
              </div>
              <button
                onClick={() => setShowDetails(null)}
                className="p-2 rounded-lg hover:bg-purple-900/40 transition-colors group"
                aria-label="Close details"
              >
                <XCircleIcon className="w-7 h-7 text-gray-300 group-hover:text-red-400 transition-colors" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
              <div className="space-y-4">
                <div>
                  <span className="block text-xs text-gray-400 font-semibold uppercase mb-1">Type</span>
                  <span className="text-lg font-bold text-purple-300">{showDetails.alert_type}</span>
                </div>
                <div>
                  <span className="block text-xs text-gray-400 font-semibold uppercase mb-1">Title</span>
                  <span className="text-base text-white">{showDetails.title}</span>
                </div>
                <div>
                  <span className="block text-xs text-gray-400 font-semibold uppercase mb-1">Description</span>
                  <span className="text-base text-white">{showDetails.description}</span>
                </div>
                <div>
                  <span className="block text-xs text-gray-400 font-semibold uppercase mb-1">Status</span>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold bg-${(showDetails.status || '').toLowerCase() === 'open' ? 'red' : (showDetails.status || '').toLowerCase() === 'investigating' ? 'yellow' : (showDetails.status || '').toLowerCase() === 'resolved' ? 'green' : 'gray'}-900/60 text-${(showDetails.status || '').toLowerCase() === 'open' ? 'red' : (showDetails.status || '').toLowerCase() === 'investigating' ? 'yellow' : (showDetails.status || '').toLowerCase() === 'resolved' ? 'green' : 'gray'}-200`}>{showDetails.status}</span>
                </div>
                <div>
                  <span className="block text-xs text-gray-400 font-semibold uppercase mb-1">Severity</span>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold bg-${(showDetails.severity || '').toLowerCase() === 'critical' ? 'red' : (showDetails.severity || '').toLowerCase() === 'high' ? 'orange' : (showDetails.severity || '').toLowerCase() === 'medium' ? 'yellow' : (showDetails.severity || '').toLowerCase() === 'low' ? 'green' : 'blue'}-900/60 text-${(showDetails.severity || '').toLowerCase() === 'critical' ? 'red' : (showDetails.severity || '').toLowerCase() === 'high' ? 'orange' : (showDetails.severity || '').toLowerCase() === 'medium' ? 'yellow' : (showDetails.severity || '').toLowerCase() === 'low' ? 'green' : 'blue'}-200`}>{showDetails.severity}</span>
                </div>
                <div>
                  <span className="block text-xs text-gray-400 font-semibold uppercase mb-1">Agent ID</span>
                  <span className="text-base text-white break-all font-mono text-sm">{showDetails.agent_id}</span>
                </div>
                <div>
                  <span className="block text-xs text-gray-400 font-semibold uppercase mb-1">First Detected</span>
                  <span className="text-base text-white">{showDetails.first_detected}</span>
                </div>
                <div>
                  <span className="block text-xs text-gray-400 font-semibold uppercase mb-1">Timestamp</span>
                  <span className="text-base text-white">{showDetails.alert_timestamp}</span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-300">Raw Alert Data</span>
                  <button
                    className="px-2 py-1 text-xs bg-purple-700 text-white rounded hover:bg-purple-800 transition-colors"
                    onClick={() => {
                      navigator.clipboard.writeText(JSON.stringify(showDetails.alert_details || showDetails, null, 2));
                    }}
                  >Copy JSON</button>
                </div>
                <div className="bg-black/60 rounded-lg p-3 overflow-x-auto max-h-60 border border-white/10">
                  <pre className="text-xs text-purple-100 font-mono whitespace-pre-wrap">{JSON.stringify(showDetails.alert_details || showDetails, null, 2)}</pre>
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