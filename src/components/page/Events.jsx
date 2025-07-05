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
import { useTheme } from '../../contexts/ThemeContext';

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
  const { isDarkMode, isTransitioning } = useTheme();
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
      <div className={`
        min-h-screen flex items-center justify-center transition-all duration-300
        ${isDarkMode 
          ? 'bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950' 
          : 'bg-gradient-to-br from-indigo-50 via-white to-purple-50'
        }
        ${isTransitioning ? 'theme-transitioning' : ''}
      `}>
        <div className="text-center">
          <div className="relative">
            <div className={`
              w-20 h-20 border-4 rounded-full animate-spin
              ${isDarkMode ? 'border-purple-200' : 'border-purple-300'}
            `}></div>
            <div className={`
              w-20 h-20 border-4 border-t-transparent rounded-full animate-spin absolute top-0
              ${isDarkMode ? 'border-purple-600' : 'border-purple-600'}
            `}></div>
          </div>
          <h3 className={`
            mt-6 text-xl font-semibold transition-colors duration-300
            ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}
          `}>
            Loading Events...
          </h3>
          <p className={`
            mt-2 transition-colors duration-300
            ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}
          `}>
            Fetching event data...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`
        min-h-screen flex items-center justify-center transition-all duration-300
        ${isDarkMode 
          ? 'bg-gradient-to-br from-slate-900 via-red-900 to-pink-900' 
          : 'bg-gradient-to-br from-red-50 via-white to-pink-50'
        }
        ${isTransitioning ? 'theme-transitioning' : ''}
      `}>
        <div className="text-center max-w-md mx-auto p-8">
          <ExclamationTriangleIcon className={`
            w-16 h-16 mx-auto mb-4 transition-colors duration-300
            ${isDarkMode ? 'text-red-400' : 'text-red-500'}
          `} />
          <h3 className={`
            text-xl font-semibold mb-2 transition-colors duration-300
            ${isDarkMode ? 'text-red-200' : 'text-red-800'}
          `}>
            Connection Error
          </h3>
          <p className={`
            mb-6 transition-colors duration-300
            ${isDarkMode ? 'text-red-300' : 'text-red-600'}
          `}>
            {error}
          </p>
          <button
            onClick={fetchEventsData}
            className={`
              px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:scale-105
              ${isDarkMode 
                ? 'bg-red-600 text-white hover:bg-red-700' 
                : 'bg-red-600 text-white hover:bg-red-700'
              }
            `}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`
      min-h-screen transition-all duration-300
      ${isDarkMode 
        ? 'bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 text-white' 
        : 'bg-gradient-to-br from-indigo-50 via-white to-purple-50 text-gray-900'
      }
      ${isTransitioning ? 'theme-transitioning' : ''}
    `}>
      {/* Header & Stats */}
      <div className={`
        px-4 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4 
        border-b shadow-xl sticky top-0 z-30 rounded-b-2xl backdrop-blur-xl transition-all duration-300
        ${isDarkMode 
          ? 'border-white/10 bg-white/10' 
          : 'border-gray-200/50 bg-white/80'
        }
      `}>
        <div className="flex items-center gap-4">
          <ChartBarIcon className={`
            w-9 h-9 drop-shadow-lg transition-colors duration-300
            ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}
          `} />
          <div>
            <h1 className={`
              text-3xl font-extrabold tracking-tight transition-colors duration-300
              ${isDarkMode 
                ? 'bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent' 
                : 'bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent'
              }
            `}>
              Events
            </h1>
            <p className={`
              text-sm mt-1 transition-colors duration-300
              ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}
            `}>
              Monitor system events and activities
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchEventsData}
            disabled={loading}
            className={`
              flex items-center gap-2 px-5 py-2 rounded-full font-semibold shadow-lg 
              transition-all duration-200 hover:scale-105
              ${isDarkMode 
                ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:from-purple-600 hover:to-indigo-600' 
                : 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:from-purple-600 hover:to-indigo-600'
              }
              ${loading ? 'opacity-60 cursor-not-allowed' : ''}
            `}
          >
            <ArrowPathIcon className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            onClick={exportEvents}
            className={`
              flex items-center gap-2 px-5 py-2 rounded-full font-semibold shadow-lg 
              transition-all duration-200 hover:scale-105
              ${isDarkMode 
                ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600' 
                : 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600'
              }
            `}
          >
            <ArrowDownTrayIcon className="w-5 h-5" />
            Export
          </button>
          <div className={`
            flex items-center gap-2 text-sm transition-colors duration-300
            ${isDarkMode ? 'text-gray-200' : 'text-gray-600'}
          `}>
            <ClockIcon className="w-4 h-4" />
            <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="p-8 grid grid-cols-2 md:grid-cols-7 gap-4">
        <div className={`
          rounded-2xl shadow-2xl p-4 flex flex-col gap-2 hover:scale-[1.03] 
          transition-all duration-300 border
          ${isDarkMode 
            ? 'bg-gradient-to-br from-purple-700 to-purple-900 border-white/10' 
            : 'bg-gradient-to-br from-purple-500 to-purple-700 border-purple-200'
          }
        `}>
          <div className="flex items-center gap-2 mb-2">
            <ChartBarIcon className={`
              w-6 h-6 transition-colors duration-300
              ${isDarkMode ? 'text-purple-300' : 'text-purple-100'}
            `} />
            <span className={`
              text-sm font-semibold transition-colors duration-300
              ${isDarkMode ? 'text-purple-100' : 'text-purple-100'}
            `}>
              Total
            </span>
          </div>
          <div className="text-2xl font-bold text-white drop-shadow-lg">{stats.total}</div>
        </div>
        <div className={`
          rounded-2xl shadow-2xl p-4 flex flex-col gap-2 hover:scale-[1.03] 
          transition-all duration-300 border
          ${isDarkMode 
            ? 'bg-gradient-to-br from-blue-700 to-blue-900 border-white/10' 
            : 'bg-gradient-to-br from-blue-500 to-blue-700 border-blue-200'
          }
        `}>
          <div className="flex items-center gap-2 mb-2">
            <CpuChipIcon className={`
              w-6 h-6 transition-colors duration-300
              ${isDarkMode ? 'text-blue-300' : 'text-blue-100'}
            `} />
            <span className={`
              text-sm font-semibold transition-colors duration-300
              ${isDarkMode ? 'text-blue-100' : 'text-blue-100'}
            `}>
              Process
            </span>
          </div>
          <div className="text-2xl font-bold text-white drop-shadow-lg">{stats.process}</div>
        </div>
        <div className={`
          rounded-2xl shadow-2xl p-4 flex flex-col gap-2 hover:scale-[1.03] 
          transition-all duration-300 border
          ${isDarkMode 
            ? 'bg-gradient-to-br from-green-700 to-emerald-900 border-white/10' 
            : 'bg-gradient-to-br from-green-500 to-emerald-700 border-green-200'
          }
        `}>
          <div className="flex items-center gap-2 mb-2">
            <DocumentIcon className={`
              w-6 h-6 transition-colors duration-300
              ${isDarkMode ? 'text-green-300' : 'text-green-100'}
            `} />
            <span className={`
              text-sm font-semibold transition-colors duration-300
              ${isDarkMode ? 'text-green-100' : 'text-green-100'}
            `}>
              File
            </span>
          </div>
          <div className="text-2xl font-bold text-white drop-shadow-lg">{stats.file}</div>
        </div>
        <div className={`
          rounded-2xl shadow-2xl p-4 flex flex-col gap-2 hover:scale-[1.03] 
          transition-all duration-300 border
          ${isDarkMode 
            ? 'bg-gradient-to-br from-orange-700 to-yellow-900 border-white/10' 
            : 'bg-gradient-to-br from-orange-500 to-yellow-700 border-orange-200'
          }
        `}>
          <div className="flex items-center gap-2 mb-2">
            <GlobeAltIcon className={`
              w-6 h-6 transition-colors duration-300
              ${isDarkMode ? 'text-orange-300' : 'text-orange-100'}
            `} />
            <span className={`
              text-sm font-semibold transition-colors duration-300
              ${isDarkMode ? 'text-orange-100' : 'text-orange-100'}
            `}>
              Network
            </span>
          </div>
          <div className="text-2xl font-bold text-white drop-shadow-lg">{stats.network}</div>
        </div>
        <div className={`
          rounded-2xl shadow-2xl p-4 flex flex-col gap-2 hover:scale-[1.03] 
          transition-all duration-300 border
          ${isDarkMode 
            ? 'bg-gradient-to-br from-purple-700 to-violet-900 border-white/10' 
            : 'bg-gradient-to-br from-purple-500 to-violet-700 border-purple-200'
          }
        `}>
          <div className="flex items-center gap-2 mb-2">
            <WrenchScrewdriverIcon className={`
              w-6 h-6 transition-colors duration-300
              ${isDarkMode ? 'text-purple-300' : 'text-purple-100'}
            `} />
            <span className={`
              text-sm font-semibold transition-colors duration-300
              ${isDarkMode ? 'text-purple-100' : 'text-purple-100'}
            `}>
              Registry
            </span>
          </div>
          <div className="text-2xl font-bold text-white drop-shadow-lg">{stats.registry}</div>
        </div>
        <div className={`
          rounded-2xl shadow-2xl p-4 flex flex-col gap-2 hover:scale-[1.03] 
          transition-all duration-300 border
          ${isDarkMode 
            ? 'bg-gradient-to-br from-red-700 to-pink-900 border-white/10' 
            : 'bg-gradient-to-br from-red-500 to-pink-700 border-red-200'
          }
        `}>
          <div className="flex items-center gap-2 mb-2">
            <UserIcon className={`
              w-6 h-6 transition-colors duration-300
              ${isDarkMode ? 'text-red-300' : 'text-red-100'}
            `} />
            <span className={`
              text-sm font-semibold transition-colors duration-300
              ${isDarkMode ? 'text-red-100' : 'text-red-100'}
            `}>
              Auth
            </span>
          </div>
          <div className="text-2xl font-bold text-white drop-shadow-lg">{stats.authentication}</div>
        </div>
        <div className={`
          rounded-2xl shadow-2xl p-4 flex flex-col gap-2 hover:scale-[1.03] 
          transition-all duration-300 border
          ${isDarkMode 
            ? 'bg-gradient-to-br from-indigo-700 to-blue-900 border-white/10' 
            : 'bg-gradient-to-br from-indigo-500 to-blue-700 border-indigo-200'
          }
        `}>
          <div className="flex items-center gap-2 mb-2">
            <ComputerDesktopIcon className={`
              w-6 h-6 transition-colors duration-300
              ${isDarkMode ? 'text-indigo-300' : 'text-indigo-100'}
            `} />
            <span className={`
              text-sm font-semibold transition-colors duration-300
              ${isDarkMode ? 'text-indigo-100' : 'text-indigo-100'}
            `}>
              System
            </span>
          </div>
          <div className="text-2xl font-bold text-white drop-shadow-lg">{stats.system}</div>
        </div>
      </div>

      {/* Tabs chọn loại event */}
      <div className="px-4 pt-6 flex flex-wrap gap-2 mb-4">
        {EVENT_TYPES.map(type => (
          <button
            key={type.value}
            onClick={() => setActiveType(type.value)}
            className={`
              px-5 py-2 rounded-full font-semibold border shadow-md 
              transition-all duration-200 text-base hover:scale-105
              ${activeType === type.value 
                ? isDarkMode
                  ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white scale-105 shadow-xl border-white/20'
                  : 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white scale-105 shadow-xl border-purple-200'
                : isDarkMode
                  ? 'bg-white/10 text-gray-200 hover:bg-purple-800/40 border-white/10'
                  : 'bg-white/80 text-gray-700 hover:bg-purple-100 border-gray-200'
              }
            `}
          >
            {type.label}
          </button>
        ))}
      </div>

      {/* Filters & Bulk Actions */}
      <div className="px-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative w-full md:w-96">
            <MagnifyingGlassIcon className={`
              w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-300
              ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}
            `} />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search event type or action..."
              className={`
                pl-10 pr-4 py-2 w-full rounded-full shadow-md transition-all duration-300
                focus:ring-2 focus:ring-purple-500 focus:border-transparent
                ${isDarkMode 
                  ? 'bg-white/10 border-white/10 text-white placeholder:text-gray-400' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-500'
                }
              `}
            />
          </div>
        </div>
        {selectedEvents.length > 0 && (
          <div className={`
            flex gap-2 items-center px-4 py-2 rounded-lg shadow-lg transition-all duration-300
            ${isDarkMode ? 'bg-purple-900/60' : 'bg-purple-100'}
          `}>
            <span className={`
              font-medium transition-colors duration-300
              ${isDarkMode ? 'text-purple-200' : 'text-purple-800'}
            `}>
              {selectedEvents.length} selected
            </span>
            <button className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors">
              Export Selected
            </button>
            <button className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors">
              Delete Selected
            </button>
          </div>
        )}
        <div className={`
          flex items-center gap-2 text-sm transition-colors duration-300
          ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}
        `}>
          <span>Total: {filtered.length} events</span>
          <span>•</span>
          <span>Page {currentPage} of {totalPages}</span>
        </div>
      </div>

      {/* Events Table */}
      {filtered.length === 0 ? (
        <div className={`
          px-4 py-12 text-center text-lg font-semibold transition-colors duration-300
          ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}
        `}>
          <ChartBarIcon className={`
            w-12 h-12 mx-auto mb-2 opacity-30 transition-colors duration-300
            ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}
          `} />
          No events found.
        </div>
      ) : (
        <div className={`
          px-4 overflow-x-auto rounded-2xl shadow-2xl border transition-all duration-300
          ${isDarkMode 
            ? 'bg-white/10 border-white/10' 
            : 'bg-white/80 border-white/20'
          }
        `}>
          <table className="min-w-full divide-y divide-white/10 rounded-2xl overflow-hidden">
            <thead className={`
              transition-all duration-300
              ${isDarkMode ? 'bg-white/10' : 'bg-gray-50/80'}
            `}>
              <tr>
                <th className="px-4 py-3 text-left align-middle w-8">
                  <input
                    type="checkbox"
                    checked={selectedEvents.length === filtered.length && filtered.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                </th>
                <th className={`
                  px-4 py-3 text-left text-xs font-bold uppercase tracking-wider min-w-[110px] align-middle
                  transition-colors duration-300
                  ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}
                `}>
                  Type
                </th>
                <th className={`
                  px-4 py-3 text-left text-xs font-bold uppercase tracking-wider min-w-[120px] align-middle
                  transition-colors duration-300
                  ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}
                `}>
                  Action
                </th>
                <th className={`
                  px-4 py-3 text-left text-xs font-bold uppercase tracking-wider min-w-[260px] align-middle
                  transition-colors duration-300
                  ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}
                `}>
                  Agent
                </th>
                <th className={`
                  px-4 py-3 text-left text-xs font-bold uppercase tracking-wider min-w-[180px] align-middle
                  transition-colors duration-300
                  ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}
                `}>
                  Time
                </th>
                <th className={`
                  px-4 py-3 text-center text-xs font-bold uppercase tracking-wider min-w-[90px] align-middle
                  transition-colors duration-300
                  ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}
                `}>
                  Severity
                </th>
                <th className={`
                  px-4 py-3 text-center text-xs font-bold uppercase tracking-wider min-w-[100px] align-middle
                  transition-colors duration-300
                  ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}
                `}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className={`
              divide-y transition-all duration-300
              ${isDarkMode 
                ? 'bg-white/5 divide-white/10' 
                : 'bg-white/80 divide-gray-200'
              }
            `}>
              {currentEvents.map(event => (
                <tr key={event.event_id || event.EventID} className={`
                  transition-all duration-150
                  ${isDarkMode 
                    ? 'hover:bg-purple-900/30' 
                    : 'hover:bg-purple-50'
                  }
                `}>
                  <td className="px-4 py-4 align-middle">
                    <input
                      type="checkbox"
                      checked={selectedEvents.includes(event.event_id || event.EventID)}
                      onChange={() => toggleSelectEvent(event.event_id || event.EventID)}
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                  </td>
                  <td className="px-4 py-4 text-base font-medium align-middle whitespace-nowrap transition-colors duration-300
                    ${isDarkMode ? 'text-white' : 'text-gray-900'}
                  ">
                    {event.event_type}
                  </td>
                  <td className="px-4 py-4 text-base font-medium align-middle whitespace-nowrap transition-colors duration-300
                    ${isDarkMode ? 'text-white' : 'text-gray-900'}
                  ">
                    {event.event_action}
                  </td>
                  <td className="px-4 py-4 text-base font-mono align-middle whitespace-nowrap transition-colors duration-300
                    ${isDarkMode ? 'text-white' : 'text-gray-900'}
                  ">
                    {event.agent_id}
                  </td>
                  <td className="px-4 py-4 text-base font-mono align-middle whitespace-nowrap transition-colors duration-300
                    ${isDarkMode ? 'text-white' : 'text-gray-900'}
                  ">
                    {event.event_timestamp}
                  </td>
                  <td className="px-4 py-4 align-middle text-center">
                    <span className={`
                      inline-block px-3 py-1 rounded-full text-xs font-bold shadow-md 
                      transition-all duration-300
                      ${event.severity?.toLowerCase() === 'critical' 
                        ? 'bg-gradient-to-r from-red-600 to-red-900 text-white' 
                        : event.severity?.toLowerCase() === 'high' 
                        ? 'bg-gradient-to-r from-orange-500 to-orange-900 text-white' 
                        : event.severity?.toLowerCase() === 'medium' 
                        ? 'bg-gradient-to-r from-yellow-500 to-yellow-900 text-white' 
                        : event.severity?.toLowerCase() === 'low' 
                        ? 'bg-gradient-to-r from-green-500 to-green-900 text-white' 
                        : 'bg-gradient-to-r from-blue-500 to-blue-900 text-white'
                      }
                    `}>
                      {event.severity}
                    </span>
                  </td>
                  <td className="px-4 py-4 align-middle text-center">
                    <button
                      onClick={() => setShowDetails(event)}
                      className={`
                        px-3 py-1 rounded-full font-medium shadow transition-all duration-150 hover:scale-105
                        ${isDarkMode 
                          ? 'bg-purple-700 text-white hover:bg-purple-800' 
                          : 'bg-purple-600 text-white hover:bg-purple-700'
                        }
                      `}
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
        <div className={`
          px-4 py-6 flex items-center justify-between rounded-2xl shadow-xl border transition-all duration-300
          ${isDarkMode 
            ? 'bg-white/10 border-white/10' 
            : 'bg-white/80 border-white/20'
          }
        `}>
          <div className="flex items-center gap-4">
            <span className={`
              text-sm transition-colors duration-300
              ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}
            `}>
              Showing {startIndex + 1} to {Math.min(endIndex, filtered.length)} of {filtered.length} events
            </span>
            <span className={`
              text-sm transition-colors duration-300
              ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}
            `}>
              Page {currentPage} of {totalPages}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Nút Previous */}
            <button
              onClick={goToPrevPage}
              disabled={currentPage === 1}
              className={`
                px-4 py-2 rounded-lg font-medium transition-all duration-200
                ${currentPage === 1 
                  ? isDarkMode
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : isDarkMode
                    ? 'bg-purple-600 text-white hover:bg-purple-700 hover:scale-105' 
                  : 'bg-purple-600 text-white hover:bg-purple-700 hover:scale-105'
                }
              `}
            >
              Previous
            </button>
            
            {/* Các nút số trang */}
            <div className="flex gap-1">
              {/* Trang đầu */}
              {currentPage > 3 && (
                <button
                  onClick={() => goToPage(1)}
                  className={`
                    px-3 py-2 rounded-lg transition-colors duration-200
                    ${isDarkMode 
                      ? 'bg-purple-600 text-white hover:bg-purple-700' 
                      : 'bg-purple-600 text-white hover:bg-purple-700'
                    }
                  `}
                >
                  1
                </button>
              )}
              
              {/* Dấu ... */}
              {currentPage > 4 && (
                <span className={`
                  px-3 py-2 transition-colors duration-300
                  ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}
                `}>
                  ...
                </span>
              )}
              
              {/* Các trang xung quanh trang hiện tại */}
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = currentPage - 2 + i;
                if (page > 0 && page <= totalPages) {
                  return (
                    <button
                      key={page}
                      onClick={() => goToPage(page)}
                      className={`
                        px-3 py-2 rounded-lg font-medium transition-all duration-200
                        ${page === currentPage
                          ? isDarkMode
                          ? 'bg-purple-800 text-white scale-110'
                            : 'bg-purple-700 text-white scale-110'
                          : isDarkMode
                            ? 'bg-purple-600 text-white hover:bg-purple-700 hover:scale-105'
                          : 'bg-purple-600 text-white hover:bg-purple-700 hover:scale-105'
                        }
                      `}
                    >
                      {page}
                    </button>
                  );
                }
                return null;
              })}
              
              {/* Dấu ... */}
              {currentPage < totalPages - 3 && (
                <span className={`
                  px-3 py-2 transition-colors duration-300
                  ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}
                `}>
                  ...
                </span>
              )}
              
              {/* Trang cuối */}
              {currentPage < totalPages - 2 && (
                <button
                  onClick={() => goToPage(totalPages)}
                  className={`
                    px-3 py-2 rounded-lg transition-colors duration-200
                    ${isDarkMode 
                      ? 'bg-purple-600 text-white hover:bg-purple-700' 
                      : 'bg-purple-600 text-white hover:bg-purple-700'
                    }
                  `}
                >
                  {totalPages}
                </button>
              )}
            </div>
            
            {/* Nút Next */}
            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className={`
                px-4 py-2 rounded-lg font-medium transition-all duration-200
                ${currentPage === totalPages 
                  ? isDarkMode
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : isDarkMode
                    ? 'bg-purple-600 text-white hover:bg-purple-700 hover:scale-105' 
                  : 'bg-purple-600 text-white hover:bg-purple-700 hover:scale-105'
                }
              `}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Event Details Modal */}
      {showDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className={`
            rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto relative 
            border transition-all duration-300
            ${isDarkMode 
              ? 'bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 border-white/10' 
              : 'bg-gradient-to-br from-white via-indigo-50 to-purple-50 border-gray-200/50'
            }
          `}>
            <div className={`
              flex items-center justify-between p-6 border-b transition-all duration-300
              ${isDarkMode ? 'border-white/10' : 'border-gray-200'}
            `}>
              <div className="flex items-center gap-3">
                <EyeIcon className={`
                  w-8 h-8 transition-colors duration-300
                  ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}
                `} />
                <h2 className={`
                  text-2xl font-bold transition-colors duration-300
                  ${isDarkMode ? 'text-white' : 'text-gray-900'}
                `}>
                  Event Details
                </h2>
              </div>
              <button
                onClick={() => setShowDetails(null)}
                className={`
                  p-2 rounded-lg transition-colors group
                  ${isDarkMode 
                    ? 'hover:bg-purple-900/40' 
                    : 'hover:bg-purple-100'
                  }
                `}
                aria-label="Close details"
              >
                <XCircleIcon className={`
                  w-7 h-7 transition-colors group-hover:text-red-400
                  ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}
                `} />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
              {/* Thông tin chính */}
              <div className="space-y-4">
                <div>
                  <span className={`
                    block text-xs font-semibold uppercase mb-1 transition-colors duration-300
                    ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}
                  `}>
                    Type
                  </span>
                  <span className={`
                    text-lg font-bold transition-colors duration-300
                    ${isDarkMode ? 'text-purple-300' : 'text-purple-600'}
                  `}>
                    {showDetails.event_type}
                  </span>
                </div>
                <div>
                  <span className={`
                    block text-xs font-semibold uppercase mb-1 transition-colors duration-300
                    ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}
                  `}>
                    Action
                  </span>
                  <span className={`
                    text-base transition-colors duration-300
                    ${isDarkMode ? 'text-white' : 'text-gray-900'}
                  `}>
                    {showDetails.event_action}
                  </span>
                </div>
                <div>
                  <span className={`
                    block text-xs font-semibold uppercase mb-1 transition-colors duration-300
                    ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}
                  `}>
                    Agent ID
                  </span>
                  <span className={`
                    text-base break-all transition-colors duration-300
                    ${isDarkMode ? 'text-white' : 'text-gray-900'}
                  `}>
                    {showDetails.agent_id}
                  </span>
                </div>
                <div>
                  <span className={`
                    block text-xs font-semibold uppercase mb-1 transition-colors duration-300
                    ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}
                  `}>
                    Timestamp
                  </span>
                  <span className={`
                    text-base transition-colors duration-300
                    ${isDarkMode ? 'text-white' : 'text-gray-900'}
                  `}>
                    {showDetails.event_timestamp}
                  </span>
                </div>
                <div>
                  <span className={`
                    block text-xs font-semibold uppercase mb-1 transition-colors duration-300
                    ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}
                  `}>
                    Severity
                  </span>
                  <span className={`
                    inline-block px-3 py-1 rounded-full text-xs font-bold transition-all duration-300
                    ${(showDetails.severity || '').toLowerCase() === 'critical' 
                      ? 'bg-red-900/60 text-red-200' 
                      : (showDetails.severity || '').toLowerCase() === 'high' 
                      ? 'bg-orange-900/60 text-orange-200' 
                      : (showDetails.severity || '').toLowerCase() === 'medium' 
                      ? 'bg-yellow-900/60 text-yellow-200' 
                      : (showDetails.severity || '').toLowerCase() === 'low' 
                      ? 'bg-green-900/60 text-green-200' 
                      : 'bg-blue-900/60 text-blue-200'
                    }
                  `}>
                    {showDetails.severity}
                  </span>
                </div>
              </div>
              {/* Chi tiết JSON */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between mb-2">
                  <span className={`
                    text-sm font-semibold transition-colors duration-300
                    ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}
                  `}>
                    Raw Event Data
                  </span>
                  <button
                    className={`
                      px-2 py-1 text-xs rounded transition-colors duration-200
                      ${isDarkMode 
                        ? 'bg-purple-700 text-white hover:bg-purple-800' 
                        : 'bg-purple-600 text-white hover:bg-purple-700'
                      }
                    `}
                    onClick={() => {
                      navigator.clipboard.writeText(JSON.stringify(showDetails.event_details || showDetails, null, 2));
                    }}
                  >
                    Copy JSON
                  </button>
                </div>
                <div className={`
                  rounded-lg p-3 overflow-x-auto max-h-60 border transition-all duration-300
                  ${isDarkMode 
                    ? 'bg-black/60 border-white/10' 
                    : 'bg-gray-100 border-gray-200'
                  }
                `}>
                  <pre className={`
                    text-xs font-mono whitespace-pre-wrap transition-colors duration-300
                    ${isDarkMode ? 'text-purple-100' : 'text-gray-800'}
                  `}>
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