import React, { useEffect, useState } from 'react';
import { 
  ShieldCheckIcon, 
  CheckCircleIcon, 
  EyeIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowPathIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  FireIcon,
  BugAntIcon,
  GlobeAltIcon,
  DocumentIcon,
  HashtagIcon,
  XCircleIcon,
  ArrowDownTrayIcon,
  UserIcon,
  ComputerDesktopIcon,
  CpuChipIcon
} from '@heroicons/react/24/outline';
import { fetchThreats } from '../../service/api';

const severityMap = {
  critical: 'text-red-400',
  high: 'text-orange-400',
  medium: 'text-yellow-400',
  low: 'text-green-400',
};

const Threats = () => {
  const [threats, setThreats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [filterSeverity, setFilterSeverity] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedThreats, setSelectedThreats] = useState([]);
  const [showDetails, setShowDetails] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(50);

  const fetchThreatsData = async () => {
    setLoading(true);
    try {
      const data = await fetchThreats({ all: true });
      setThreats(data.threats || []);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      setError('Cannot load threats data. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchThreatsData();
    const interval = setInterval(fetchThreatsData, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => { setCurrentPage(1); }, [search, filterType, filterSeverity, filterStatus]);

  const filtered = threats.filter(threat => {
    const matchesSearch = (threat.threat_name || '').toLowerCase().includes(search.toLowerCase()) ||
      (threat.threat_value || '').toLowerCase().includes(search.toLowerCase());
    const matchesType = filterType === 'All' || (threat.threat_type || '').toLowerCase() === filterType.toLowerCase();
    const matchesSeverity = filterSeverity === 'All' || (threat.severity || '').toLowerCase() === filterSeverity.toLowerCase();
    const matchesStatus = filterStatus === 'All' || (filterStatus === 'Active' && threat.is_active) || (filterStatus === 'Inactive' && !threat.is_active);
    return matchesSearch && matchesType && matchesSeverity && matchesStatus;
  });

  // Calculate stats from filtered threats
  const calculatedStats = {
    total: threats.length,
    active: threats.filter(t => t.is_active === true || t.is_active === 1 || t.is_active === 'true').length,
    inactive: threats.filter(t => !(t.is_active === true || t.is_active === 1 || t.is_active === 'true')).length,
    hash: threats.filter(t => (t.threat_type || '').toLowerCase() === 'hash').length,
    ip: threats.filter(t => (t.threat_type || '').toLowerCase() === 'ip').length,
    domain: threats.filter(t => (t.threat_type || '').toLowerCase() === 'domain').length,
    url: threats.filter(t => (t.threat_type || '').toLowerCase() === 'url').length,
    signature: threats.filter(t => (t.threat_type || '').toLowerCase() === 'signature').length,
    yara: threats.filter(t => (t.threat_type || '').toLowerCase() === 'yara').length,
  };

  const getThreatTypeInfo = (threatType) => {
    const typeLower = (threatType || '').toLowerCase();
    
    const typeMap = {
      'hash': {
        icon: HashtagIcon,
        color: 'text-blue-400',
        bg: 'bg-blue-900/60',
        label: 'File Hash',
        description: 'Malicious file hash'
      },
      'ip': {
        icon: GlobeAltIcon,
        color: 'text-red-400',
        bg: 'bg-red-900/60',
        label: 'IP Address',
        description: 'Malicious IP address'
      },
      'domain': {
        icon: GlobeAltIcon,
        color: 'text-purple-400',
        bg: 'bg-purple-900/60',
        label: 'Domain',
        description: 'Malicious domain'
      },
      'url': {
        icon: GlobeAltIcon,
        color: 'text-orange-400',
        bg: 'bg-orange-900/60',
        label: 'URL',
        description: 'Malicious URL'
      },
      'signature': {
        icon: DocumentIcon,
        color: 'text-green-400',
        bg: 'bg-green-900/60',
        label: 'Signature',
        description: 'Malware signature'
      },
      'yara': {
        icon: BugAntIcon,
        color: 'text-yellow-400',
        bg: 'bg-yellow-900/60',
        label: 'YARA Rule',
        description: 'YARA detection rule'
      }
    };

    return typeMap[typeLower] || {
      icon: ShieldCheckIcon,
      color: 'text-gray-400',
      bg: 'bg-gray-900/60',
      label: threatType || 'Unknown',
      description: 'Threat indicator'
    };
  };

  const getSeverityInfo = (severity) => {
    const severityLower = (severity || '').toLowerCase();
    
    const severityMap = {
      'critical': {
        bg: 'bg-red-900/60',
        text: 'text-red-200',
        border: 'border-red-700',
        label: 'Critical',
        icon: FireIcon
      },
      'high': {
        bg: 'bg-orange-900/60',
        text: 'text-orange-200',
        border: 'border-orange-700',
        label: 'High',
        icon: ExclamationTriangleIcon
      },
      'medium': {
        bg: 'bg-yellow-900/60',
        text: 'text-yellow-200',
        border: 'border-yellow-700',
        label: 'Medium',
        icon: ExclamationTriangleIcon
      },
      'low': {
        bg: 'bg-green-900/60',
        text: 'text-green-200',
        border: 'border-green-700',
        label: 'Low',
        icon: CheckCircleIcon
      }
    };

    return severityMap[severityLower] || {
      bg: 'bg-gray-900/60',
      text: 'text-gray-200',
      border: 'border-gray-700',
      label: severity || 'Unknown',
      icon: ShieldCheckIcon
    };
  };

  const getStatusInfo = (isActive) => {
    if (isActive === true || isActive === 1 || isActive === 'true') {
      return {
        bg: 'bg-green-900/60',
        text: 'text-green-200',
        border: 'border-green-700',
        label: 'Active'
      };
    }
    return {
      bg: 'bg-gray-900/60',
      text: 'text-gray-200',
      border: 'border-gray-700',
      label: 'Inactive'
    };
  };

  const toggleSelectThreat = (threatId) => {
    setSelectedThreats(prev => 
      prev.includes(threatId) 
        ? prev.filter(id => id !== threatId)
        : [...prev, threatId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedThreats.length === filtered.length) {
      setSelectedThreats([]);
    } else {
      setSelectedThreats(filtered.map(threat => threat.threat_id || threat.ThreatID));
    }
  };

  const exportThreats = () => {
    const csvContent = [
      ['Name', 'Type', 'Value', 'Severity', 'Status', 'Description'],
      ...filtered.map(threat => [
        threat.threat_name,
        threat.threat_type,
        threat.threat_value,
        threat.severity,
        (threat.is_active === true || threat.is_active === 1 || threat.is_active === 'true') ? 'Active' : 'Inactive',
        threat.description || ''
      ])
    ].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `threats_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Export selected threats to CSV
  const exportSelectedThreats = () => {
    if (selectedThreats.length === 0) return;
    const selected = threats.filter(t => selectedThreats.includes(t.threat_id || t.ThreatID));
    const csvContent = [
      ['Threat Name', 'Type', 'Category', 'Severity', 'Confidence', 'Status'],
      ...selected.map(t => [
        t.threat_name,
        t.threat_type,
        t.threat_category,
        t.severity,
        (t.confidence * 100).toFixed(0) + '%',
        (t.is_active === true || t.is_active === 1 || t.is_active === 'true') ? 'Active' : 'Inactive'
      ])
    ].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `threats_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Delete selected threats (from state, with confirm)
  const deleteSelectedThreats = () => {
    if (selectedThreats.length === 0) return;
    if (!window.confirm('Are you sure you want to delete the selected threats?')) return;
    setThreats(prev => prev.filter(t => !selectedThreats.includes(t.threat_id || t.ThreatID)));
    setSelectedThreats([]);
  };

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentThreats = filtered.slice(startIndex, endIndex);
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
          <h3 className="mt-6 text-xl font-semibold text-gray-100">Loading Threats...</h3>
          <p className="mt-2 text-gray-400">Fetching threat intelligence...</p>
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
            onClick={fetchThreatsData}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium"
          >Try Again</button>
        </div>
      </div>
    );
  }

  // Always show search/filter bar, even if no data
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 text-white">
      {/* Header & Stats */}
      <div className="px-8 py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-white/10 bg-white/10 backdrop-blur-xl shadow-lg sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <ShieldCheckIcon className="w-10 h-10 text-purple-400 drop-shadow-lg" />
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent tracking-tight">Threat Intelligence</h1>
            <p className="text-gray-300 text-sm mt-1">Monitor and manage threat indicators</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={fetchThreatsData}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium disabled:opacity-50 shadow-lg"
          >
            <ArrowPathIcon className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            onClick={exportThreats}
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
      <div className="p-8 grid grid-cols-2 md:grid-cols-8 gap-4">
        <div className="bg-gradient-to-br from-purple-700 to-purple-900 rounded-2xl shadow-2xl p-4 flex flex-col gap-2 hover:scale-[1.03] transition-transform duration-300 border border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheckIcon className="w-6 h-6 text-purple-300" />
            <span className="text-sm font-semibold text-purple-100">Total</span>
          </div>
          <div className="text-2xl font-bold text-white drop-shadow-lg">{calculatedStats.total}</div>
        </div>
        <div className="bg-gradient-to-br from-green-700 to-green-900 rounded-2xl shadow-2xl p-4 flex flex-col gap-2 hover:scale-[1.03] transition-transform duration-300 border border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircleIcon className="w-6 h-6 text-green-300" />
            <span className="text-sm font-semibold text-green-100">Active</span>
          </div>
          <div className="text-2xl font-bold text-white drop-shadow-lg">{calculatedStats.active}</div>
        </div>
        <div className="bg-gradient-to-br from-gray-700 to-gray-900 rounded-2xl shadow-2xl p-4 flex flex-col gap-2 hover:scale-[1.03] transition-transform duration-300 border border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <XCircleIcon className="w-6 h-6 text-gray-300" />
            <span className="text-sm font-semibold text-gray-100">Inactive</span>
          </div>
          <div className="text-2xl font-bold text-white drop-shadow-lg">{calculatedStats.inactive}</div>
        </div>
        <div className="bg-gradient-to-br from-blue-700 to-blue-900 rounded-2xl shadow-2xl p-4 flex flex-col gap-2 hover:scale-[1.03] transition-transform duration-300 border border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <HashtagIcon className="w-6 h-6 text-blue-300" />
            <span className="text-sm font-semibold text-blue-100">Hash</span>
          </div>
          <div className="text-2xl font-bold text-white drop-shadow-lg">{calculatedStats.hash}</div>
        </div>
        <div className="bg-gradient-to-br from-red-700 to-red-900 rounded-2xl shadow-2xl p-4 flex flex-col gap-2 hover:scale-[1.03] transition-transform duration-300 border border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <GlobeAltIcon className="w-6 h-6 text-red-300" />
            <span className="text-sm font-semibold text-red-100">IP</span>
          </div>
          <div className="text-2xl font-bold text-white drop-shadow-lg">{calculatedStats.ip}</div>
        </div>
        <div className="bg-gradient-to-br from-purple-700 to-violet-900 rounded-2xl shadow-2xl p-4 flex flex-col gap-2 hover:scale-[1.03] transition-transform duration-300 border border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <GlobeAltIcon className="w-6 h-6 text-purple-300" />
            <span className="text-sm font-semibold text-purple-100">Domain</span>
          </div>
          <div className="text-2xl font-bold text-white drop-shadow-lg">{calculatedStats.domain}</div>
        </div>
        <div className="bg-gradient-to-br from-orange-700 to-yellow-900 rounded-2xl shadow-2xl p-4 flex flex-col gap-2 hover:scale-[1.03] transition-transform duration-300 border border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <GlobeAltIcon className="w-6 h-6 text-orange-300" />
            <span className="text-sm font-semibold text-orange-100">URL</span>
          </div>
          <div className="text-2xl font-bold text-white drop-shadow-lg">{calculatedStats.url}</div>
        </div>
        <div className="bg-gradient-to-br from-green-700 to-emerald-900 rounded-2xl shadow-2xl p-4 flex flex-col gap-2 hover:scale-[1.03] transition-transform duration-300 border border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <DocumentIcon className="w-6 h-6 text-green-300" />
            <span className="text-sm font-semibold text-green-100">Signature</span>
          </div>
          <div className="text-2xl font-bold text-white drop-shadow-lg">{calculatedStats.signature}</div>
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
              placeholder="Search threat name or value..."
              className="pl-10 pr-4 py-2 bg-white/10 border border-white/10 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder:text-gray-400"
            />
          </div>
        </div>
        {selectedThreats.length > 0 && (
          <div className="flex gap-2 items-center bg-purple-900/60 px-4 py-2 rounded-lg shadow-lg">
            <span className="text-purple-200 font-medium">{selectedThreats.length} selected</span>
            <button className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700" onClick={exportSelectedThreats}>Export Selected</button>
            <button className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700" onClick={deleteSelectedThreats}>Delete Selected</button>
          </div>
        )}
      </div>

      {/* Threats Table */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24">
          <ShieldCheckIcon className="w-20 h-20 text-purple-900/30 mb-6" />
          <h3 className="text-2xl font-semibold text-gray-100 mb-2">No Threats Found</h3>
          <p className="text-gray-400 mb-6">No threats match your search or filter criteria.</p>
        </div>
      ) : (
        <div className="px-8 overflow-x-auto rounded-2xl shadow-2xl bg-white/10 border border-white/10">
          <table className="min-w-full divide-y divide-white/10 table-fixed">
            <thead className="bg-white/5">
              <tr>
                <th className="px-2 py-3 text-left w-8">
                  <input
                    type="checkbox"
                    checked={selectedThreats.length === filtered.length && filtered.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                </th>
                <th className="px-2 py-3 text-left text-xs font-bold text-gray-300 uppercase tracking-wider w-56">Threat Name</th>
                <th className="px-2 py-3 text-left text-xs font-bold text-gray-300 uppercase tracking-wider w-28">Type</th>
                <th className="px-2 py-3 text-left text-xs font-bold text-gray-300 uppercase tracking-wider w-28">Category</th>
                <th className="px-2 py-3 text-left text-xs font-bold text-gray-300 uppercase tracking-wider w-20">Severity</th>
                <th className="px-2 py-3 text-left text-xs font-bold text-gray-300 uppercase tracking-wider w-20">Confidence</th>
                <th className="px-2 py-3 text-left text-xs font-bold text-gray-300 uppercase tracking-wider w-20">Status</th>
                <th className="px-2 py-3 text-left text-xs font-bold text-gray-300 uppercase tracking-wider w-28">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white/5 divide-y divide-white/10 text-sm">
              {currentThreats.map(threat => {
                const typeInfo = getThreatTypeInfo(threat.threat_type);
                const severityInfo = getSeverityInfo(threat.severity);
                const statusInfo = getStatusInfo(threat.is_active);
                return (
                  <tr key={threat.threat_id || threat.ThreatID} className="hover:bg-purple-900/30 transition-all">
                    <td className="px-2 py-2">
                      <input
                        type="checkbox"
                        checked={selectedThreats.includes(threat.threat_id || threat.ThreatID)}
                        onChange={() => toggleSelectThreat(threat.threat_id || threat.ThreatID)}
                        className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      />
                    </td>
                    <td className="px-2 py-2 whitespace-normal break-all max-w-xs">{threat.threat_name}</td>
                    <td className="px-2 py-2 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${typeInfo.bg} ${typeInfo.color}`}>{typeInfo.label}</span>
                    </td>
                    <td className="px-2 py-2 whitespace-normal break-all max-w-xs">{threat.threat_category}</td>
                    <td className="px-2 py-2 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${severityInfo.bg} ${severityInfo.text}`}>{severityInfo.label}</span>
                    </td>
                    <td className="px-2 py-2 whitespace-nowrap text-center">{(threat.confidence * 100).toFixed(0)}%</td>
                    <td className="px-2 py-2 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusInfo.bg} ${statusInfo.text}`}>{statusInfo.label}</span>
                    </td>
                    <td className="px-2 py-2 whitespace-nowrap">
                      <button
                        onClick={() => setShowDetails(threat)}
                        className="px-4 py-1 rounded-full bg-purple-700 text-white font-medium shadow hover:bg-purple-800 transition-all duration-150 border-2 border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500 text-xs"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-4 py-6 flex items-center justify-between bg-white/10 rounded-2xl shadow-xl border border-white/10 animate-fadeIn">
          <div className="flex items-center gap-4">
            <span className="text-gray-300 text-sm">
              Showing {startIndex + 1} to {Math.min(endIndex, filtered.length)} of {filtered.length} threats
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

      {/* Threat Details Modal */}
      {showDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 border border-white/10 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto relative animate-fadeIn">
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div className="flex items-center gap-3">
                <EyeIcon className="w-8 h-8 text-purple-400" />
                <h2 className="text-2xl font-bold text-white">Threat Details</h2>
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
                <div><span className="block text-xs text-gray-400 font-semibold uppercase mb-1">Name</span><span className="text-lg font-bold text-purple-300">{showDetails.threat_name}</span></div>
                <div><span className="block text-xs text-gray-400 font-semibold uppercase mb-1">Type</span><span className="text-base text-white">{showDetails.threat_type}</span></div>
                <div><span className="block text-xs text-gray-400 font-semibold uppercase mb-1">Value</span><span className="text-base text-white font-mono">{showDetails.threat_value}</span></div>
                <div><span className="block text-xs text-gray-400 font-semibold uppercase mb-1">Severity</span><span className={`inline-block px-3 py-1 rounded-full text-xs font-bold bg-${(showDetails.severity || '').toLowerCase() === 'critical' ? 'red' : (showDetails.severity || '').toLowerCase() === 'high' ? 'orange' : (showDetails.severity || '').toLowerCase() === 'medium' ? 'yellow' : (showDetails.severity || '').toLowerCase() === 'low' ? 'green' : 'blue'}-900/60 text-${(showDetails.severity || '').toLowerCase() === 'critical' ? 'red' : (showDetails.severity || '').toLowerCase() === 'high' ? 'orange' : (showDetails.severity || '').toLowerCase() === 'medium' ? 'yellow' : (showDetails.severity || '').toLowerCase() === 'low' ? 'green' : 'blue'}-200`}>{showDetails.severity}</span></div>
                <div><span className="block text-xs text-gray-400 font-semibold uppercase mb-1">Status</span><span className="text-base text-white">{(showDetails.is_active === true || showDetails.is_active === 1 || showDetails.is_active === 'true') ? 'Active' : 'Inactive'}</span></div>
                <div><span className="block text-xs text-gray-400 font-semibold uppercase mb-1">Description</span><span className="text-base text-white">{showDetails.description}</span></div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-300">Raw Threat Data</span>
                  <button
                    className="px-2 py-1 text-xs bg-purple-700 text-white rounded hover:bg-purple-800 transition-colors"
                    onClick={() => {
                      navigator.clipboard.writeText(JSON.stringify(showDetails, null, 2));
                    }}
                  >Copy JSON</button>
                </div>
                <div className="bg-black/60 rounded-lg p-3 overflow-x-auto max-h-60 border border-white/10">
                  <pre className="text-xs text-purple-100 font-mono whitespace-pre-wrap">{JSON.stringify(showDetails, null, 2)}</pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Threats;