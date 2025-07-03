import React, { useEffect, useState } from 'react';
import { 
  ChartBarIcon, 
  ArrowTrendingUpIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowPathIcon,
  EyeIcon,
  ClockIcon,
  ComputerDesktopIcon,
  DocumentIcon,
  GlobeAltIcon,
  WrenchScrewdriverIcon,
  UserIcon,
  CpuChipIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  ArrowDownTrayIcon,
  XCircleIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import { fetchEvents } from '../../service/api';

const severityMap = {
  critical: 'text-red-400',
  high: 'text-orange-400',
  medium: 'text-yellow-400',
  low: 'text-green-400',
  info: 'text-blue-400',
};

const EVENT_TYPES = [
  { label: 'All', value: 'All' },
  { label: 'Process', value: 'Process' },
  { label: 'File', value: 'File' },
  { label: 'Network', value: 'Network' },
  { label: 'Registry', value: 'Registry' },
  { label: 'Authentication', value: 'Authentication' },
  { label: 'System', value: 'System' },
];

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [filterSeverity, setFilterSeverity] = useState('All');
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [showDetails, setShowDetails] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [activeType, setActiveType] = useState('All');
  
  // Phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(50); // Hiển thị 50 logs mỗi trang

  const fetchEventsData = async () => {
    setLoading(true);
    try {
      const data = await fetchEvents({ hours: 0 }); // Lấy toàn bộ logs, không giới hạn thời gian
      setEvents(data.events || []);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      setError('Cannot load events data. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEventsData();
    
    // Auto refresh every 30 seconds
    const interval = setInterval(fetchEventsData, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setActiveType('All'); // Reset type khi đổi filter/search/severity
    setCurrentPage(1); // Reset về trang đầu khi thay đổi filter
  }, [search, filterSeverity]);

  const filtered = events.filter(event => {
    const matchesSearch = (event.event_type || '').toLowerCase().includes(search.toLowerCase()) ||
      (event.event_action || '').toLowerCase().includes(search.toLowerCase());
    const matchesType = activeType === 'All' || (event.event_type || '').toLowerCase() === activeType.toLowerCase();
    const matchesSeverity = filterSeverity === 'All' || (event.severity || '').toLowerCase() === filterSeverity.toLowerCase();
    return matchesSearch && matchesType && matchesSeverity;
  });

  // Tính toán phân trang
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentEvents = filtered.slice(startIndex, endIndex);

  // Hàm chuyển trang
  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const stats = {
    total: events.length,
    process: events.filter(e => (e.event_type || '').toLowerCase() === 'process').length,
    file: events.filter(e => (e.event_type || '').toLowerCase() === 'file').length,
    network: events.filter(e => (e.event_type || '').toLowerCase() === 'network').length,
    registry: events.filter(e => (e.event_type || '').toLowerCase() === 'registry').length,
    authentication: events.filter(e => (e.event_type || '').toLowerCase() === 'authentication').length,
    system: events.filter(e => (e.event_type || '').toLowerCase() === 'system').length,
  };

  const toggleSelectEvent = (eventId) => {
    setSelectedEvents(prev => 
      prev.includes(eventId) 
        ? prev.filter(id => id !== eventId)
        : [...prev, eventId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedEvents.length === filtered.length) {
      setSelectedEvents([]);
    } else {
      setSelectedEvents(filtered.map(event => event.event_id || event.EventID));
    }
  };

  const exportEvents = () => {
    const csvContent = [
      ['Type', 'Action', 'Agent', 'Time', 'Severity', 'Details'],
      ...filtered.map(event => [
        event.event_type,
        event.event_action,
        event.agent_id,
        event.event_timestamp,
        event.severity,
        event.event_details || ''
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `events_${new Date().toISOString().split('T')[0]}.csv`;
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
          <h3 className="mt-6 text-xl font-semibold text-gray-100">Loading Events...</h3>
          <p className="mt-2 text-gray-400">Fetching event data...</p>
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
            onClick={fetchEventsData}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium"
          >Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 text-white">
      {/* Header & Stats */}
      <div className="px-4 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-white/10 bg-white/10 backdrop-blur-xl shadow-xl sticky top-0 z-30 rounded-b-2xl animate-fadeInDown">
        <div className="flex items-center gap-4">
          <ChartBarIcon className="w-9 h-9 text-purple-400 drop-shadow-lg" />
          <div>
            <h1 className="text-3xl font-extrabold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent tracking-tight drop-shadow">Events</h1>
            <p className="text-gray-300 text-sm mt-1">Monitor system events and activities</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchEventsData}
            disabled={loading}
            className={`flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-semibold shadow-lg hover:scale-105 transition-all duration-200 ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
          >
            <ArrowPathIcon className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            onClick={exportEvents}
            className="flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold shadow-lg hover:scale-105 transition-all duration-200"
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
            <ChartBarIcon className="w-6 h-6 text-purple-300" />
            <span className="text-sm font-semibold text-purple-100">Total</span>
          </div>
          <div className="text-2xl font-bold text-white drop-shadow-lg">{stats.total}</div>
        </div>
        <div className="bg-gradient-to-br from-blue-700 to-blue-900 rounded-2xl shadow-2xl p-4 flex flex-col gap-2 hover:scale-[1.03] transition-transform duration-300 border border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <CpuChipIcon className="w-6 h-6 text-blue-300" />
            <span className="text-sm font-semibold text-blue-100">Process</span>
          </div>
          <div className="text-2xl font-bold text-white drop-shadow-lg">{stats.process}</div>
        </div>
        <div className="bg-gradient-to-br from-green-700 to-emerald-900 rounded-2xl shadow-2xl p-4 flex flex-col gap-2 hover:scale-[1.03] transition-transform duration-300 border border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <DocumentIcon className="w-6 h-6 text-green-300" />
            <span className="text-sm font-semibold text-green-100">File</span>
          </div>
          <div className="text-2xl font-bold text-white drop-shadow-lg">{stats.file}</div>
        </div>
        <div className="bg-gradient-to-br from-orange-700 to-yellow-900 rounded-2xl shadow-2xl p-4 flex flex-col gap-2 hover:scale-[1.03] transition-transform duration-300 border border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <GlobeAltIcon className="w-6 h-6 text-orange-300" />
            <span className="text-sm font-semibold text-orange-100">Network</span>
          </div>
          <div className="text-2xl font-bold text-white drop-shadow-lg">{stats.network}</div>
        </div>
        <div className="bg-gradient-to-br from-purple-700 to-violet-900 rounded-2xl shadow-2xl p-4 flex flex-col gap-2 hover:scale-[1.03] transition-transform duration-300 border border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <WrenchScrewdriverIcon className="w-6 h-6 text-purple-300" />
            <span className="text-sm font-semibold text-purple-100">Registry</span>
          </div>
          <div className="text-2xl font-bold text-white drop-shadow-lg">{stats.registry}</div>
        </div>
        <div className="bg-gradient-to-br from-red-700 to-pink-900 rounded-2xl shadow-2xl p-4 flex flex-col gap-2 hover:scale-[1.03] transition-transform duration-300 border border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <UserIcon className="w-6 h-6 text-red-300" />
            <span className="text-sm font-semibold text-red-100">Auth</span>
          </div>
          <div className="text-2xl font-bold text-white drop-shadow-lg">{stats.authentication}</div>
        </div>
        <div className="bg-gradient-to-br from-indigo-700 to-blue-900 rounded-2xl shadow-2xl p-4 flex flex-col gap-2 hover:scale-[1.03] transition-transform duration-300 border border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <ComputerDesktopIcon className="w-6 h-6 text-indigo-300" />
            <span className="text-sm font-semibold text-indigo-100">System</span>
          </div>
          <div className="text-2xl font-bold text-white drop-shadow-lg">{stats.system}</div>
        </div>
      </div>

      {/* Tabs chọn loại event */}
      <div className="px-4 pt-6 flex flex-wrap gap-2 mb-4 animate-fadeIn">
        {EVENT_TYPES.map(type => (
          <button
            key={type.value}
            onClick={() => setActiveType(type.value)}
            className={`px-5 py-2 rounded-full font-semibold border border-white/10 shadow-md transition-all duration-200 text-base ${activeType === type.value ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white scale-105 shadow-xl' : 'bg-white/10 text-gray-200 hover:bg-purple-800/40'}`}
          >
            {type.label}
          </button>
        ))}
      </div>

      {/* Filters & Bulk Actions */}
      <div className="px-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 animate-fadeIn">
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative w-full md:w-96">
            <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search event type or action..."
              className="pl-10 pr-4 py-2 w-full bg-white/10 border border-white/10 rounded-full focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder:text-gray-400 shadow-md"
            />
          </div>
        </div>
        {selectedEvents.length > 0 && (
          <div className="flex gap-2 items-center bg-purple-900/60 px-4 py-2 rounded-lg shadow-lg animate-fadeIn">
            <span className="text-purple-200 font-medium">{selectedEvents.length} selected</span>
            <button className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700">Export Selected</button>
            <button className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700">Delete Selected</button>
          </div>
        )}
        <div className="flex items-center gap-2 text-sm text-gray-300">
          <span>Total: {filtered.length} events</span>
          <span>•</span>
          <span>Page {currentPage} of {totalPages}</span>
        </div>
      </div>

      {/* Events Table */}
      {filtered.length === 0 ? (
        <div className="px-4 py-12 text-center text-lg text-gray-400 font-semibold animate-fadeIn">
          <ChartBarIcon className="w-12 h-12 mx-auto mb-2 opacity-30" />
          No events found.
        </div>
      ) : (
        <div className="px-4 overflow-x-auto rounded-2xl shadow-2xl bg-white/10 border border-white/10 animate-fadeInUp">
          <table className="min-w-full divide-y divide-white/10 rounded-2xl overflow-hidden">
            <thead className="bg-white/10">
              <tr>
                <th className="px-4 py-3 text-left align-middle w-8">
                  <input
                    type="checkbox"
                    checked={selectedEvents.length === filtered.length && filtered.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-300 uppercase tracking-wider min-w-[110px] align-middle">Type</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-300 uppercase tracking-wider min-w-[120px] align-middle">Action</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-300 uppercase tracking-wider min-w-[260px] align-middle">Agent</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-300 uppercase tracking-wider min-w-[180px] align-middle">Time</th>
                <th className="px-4 py-3 text-center text-xs font-bold text-gray-300 uppercase tracking-wider min-w-[90px] align-middle">Severity</th>
                <th className="px-4 py-3 text-center text-xs font-bold text-gray-300 uppercase tracking-wider min-w-[100px] align-middle">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white/5 divide-y divide-white/10">
              {currentEvents.map(event => (
                <tr key={event.event_id || event.EventID} className="hover:bg-purple-900/30 transition-all duration-150">
                  <td className="px-4 py-4 align-middle">
                    <input
                      type="checkbox"
                      checked={selectedEvents.includes(event.event_id || event.EventID)}
                      onChange={() => toggleSelectEvent(event.event_id || event.EventID)}
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap font-medium text-white align-middle">{event.event_type}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-gray-200 align-middle">{event.event_action}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-gray-200 align-middle font-mono text-xs">{event.agent_id}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-gray-200 align-middle font-mono text-xs">{event.event_timestamp}</td>
                  <td className="px-4 py-4 align-middle text-center">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold shadow-md bg-gradient-to-r ${event.severity?.toLowerCase() === 'critical' ? 'from-red-600 to-red-900' : event.severity?.toLowerCase() === 'high' ? 'from-orange-500 to-orange-900' : event.severity?.toLowerCase() === 'medium' ? 'from-yellow-500 to-yellow-900' : event.severity?.toLowerCase() === 'low' ? 'from-green-500 to-green-900' : 'from-blue-500 to-blue-900'} text-white`}>{event.severity}</span>
                  </td>
                  <td className="px-4 py-4 align-middle text-center">
                    <button
                      onClick={() => setShowDetails(event)}
                      className="px-3 py-1 rounded-full bg-purple-700 text-white font-medium shadow hover:bg-purple-800 transition-all duration-150"
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

      {/* Phân trang */}
      {totalPages > 1 && (
        <div className="px-4 py-6 flex items-center justify-between bg-white/10 rounded-2xl shadow-xl border border-white/10 animate-fadeIn">
          <div className="flex items-center gap-4">
            <span className="text-gray-300 text-sm">
              Showing {startIndex + 1} to {Math.min(endIndex, filtered.length)} of {filtered.length} events
            </span>
            <span className="text-gray-400 text-sm">
              Page {currentPage} of {totalPages}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Nút Previous */}
            <button
              onClick={goToPrevPage}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                currentPage === 1 
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
                  : 'bg-purple-600 text-white hover:bg-purple-700 hover:scale-105'
              }`}
            >
              Previous
            </button>
            
            {/* Các nút số trang */}
            <div className="flex gap-1">
              {/* Trang đầu */}
              {currentPage > 3 && (
                <button
                  onClick={() => goToPage(1)}
                  className="px-3 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors"
                >
                  1
                </button>
              )}
              
              {/* Dấu ... */}
              {currentPage > 4 && (
                <span className="px-3 py-2 text-gray-400">...</span>
              )}
              
              {/* Các trang xung quanh trang hiện tại */}
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = currentPage - 2 + i;
                if (page > 0 && page <= totalPages) {
                  return (
                    <button
                      key={page}
                      onClick={() => goToPage(page)}
                      className={`px-3 py-2 rounded-lg font-medium transition-all duration-200 ${
                        page === currentPage
                          ? 'bg-purple-800 text-white scale-110'
                          : 'bg-purple-600 text-white hover:bg-purple-700 hover:scale-105'
                      }`}
                    >
                      {page}
                    </button>
                  );
                }
                return null;
              })}
              
              {/* Dấu ... */}
              {currentPage < totalPages - 3 && (
                <span className="px-3 py-2 text-gray-400">...</span>
              )}
              
              {/* Trang cuối */}
              {currentPage < totalPages - 2 && (
                <button
                  onClick={() => goToPage(totalPages)}
                  className="px-3 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors"
                >
                  {totalPages}
                </button>
              )}
            </div>
            
            {/* Nút Next */}
            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                currentPage === totalPages 
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
                  : 'bg-purple-600 text-white hover:bg-purple-700 hover:scale-105'
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Event Details Modal */}
      {showDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 border border-white/10 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto relative animate-fadeIn">
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div className="flex items-center gap-3">
                <EyeIcon className="w-8 h-8 text-purple-400" />
                <h2 className="text-2xl font-bold text-white">Event Details</h2>
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
              {/* Thông tin chính */}
              <div className="space-y-4">
                <div>
                  <span className="block text-xs text-gray-400 font-semibold uppercase mb-1">Type</span>
                  <span className="text-lg font-bold text-purple-300">{showDetails.event_type}</span>
                </div>
                <div>
                  <span className="block text-xs text-gray-400 font-semibold uppercase mb-1">Action</span>
                  <span className="text-base text-white">{showDetails.event_action}</span>
                </div>
                <div>
                  <span className="block text-xs text-gray-400 font-semibold uppercase mb-1">Agent ID</span>
                  <span className="text-base text-white break-all">{showDetails.agent_id}</span>
                </div>
                <div>
                  <span className="block text-xs text-gray-400 font-semibold uppercase mb-1">Timestamp</span>
                  <span className="text-base text-white">{showDetails.event_timestamp}</span>
                </div>
                <div>
                  <span className="block text-xs text-gray-400 font-semibold uppercase mb-1">Severity</span>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold bg-${(showDetails.severity || '').toLowerCase() === 'critical' ? 'red' : (showDetails.severity || '').toLowerCase() === 'high' ? 'orange' : (showDetails.severity || '').toLowerCase() === 'medium' ? 'yellow' : (showDetails.severity || '').toLowerCase() === 'low' ? 'green' : 'blue'}-900/60 text-${(showDetails.severity || '').toLowerCase() === 'critical' ? 'red' : (showDetails.severity || '').toLowerCase() === 'high' ? 'orange' : (showDetails.severity || '').toLowerCase() === 'medium' ? 'yellow' : (showDetails.severity || '').toLowerCase() === 'low' ? 'green' : 'blue'}-200`}>{showDetails.severity}</span>
                </div>
              </div>
              {/* Chi tiết JSON */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-300">Raw Event Data</span>
                  <button
                    className="px-2 py-1 text-xs bg-purple-700 text-white rounded hover:bg-purple-800 transition-colors"
                    onClick={() => {
                      navigator.clipboard.writeText(JSON.stringify(showDetails.event_details || showDetails, null, 2));
                    }}
                  >Copy JSON</button>
                </div>
                <div className="bg-black/60 rounded-lg p-3 overflow-x-auto max-h-60 border border-white/10">
                  <pre className="text-xs text-purple-100 font-mono whitespace-pre-wrap">
                    {JSON.stringify(showDetails.event_details || showDetails, null, 2)}
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

export default Events;