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
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
// axios import removed - will be handled by parent component

const Events = () => {
  const [events, setEvents] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [filterSeverity, setFilterSeverity] = useState('All');
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [showDetails, setShowDetails] = useState(null);

  // Fetch events data
  const fetchEventsData = async () => {
    setLoading(true);
    try {
      const [listRes, statsRes] = await Promise.all([
        fetch('http://192.168.20.85:5000/api/v1/events/list').then(res => res.json()),
        fetch('http://192.168.20.85:5000/api/v1/events/stats/summary').then(res => res.json())
      ]);

      setEvents(listRes.events || []);
      setStats(statsRes);
      setError(null);
    } catch (err) {
      console.error('Error fetching events data:', err);
      setError('Cannot load events data. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEventsData();
  }, []);

  // Manual refresh
  const handleRefresh = () => {
    fetchEventsData();
  };

  // Get event type info
  const getEventTypeInfo = (eventType) => {
    const typeLower = (eventType || '').toLowerCase();
    
    const typeMap = {
      'process': {
        icon: CpuChipIcon,
        color: 'text-blue-600',
        bg: 'bg-blue-100',
        label: 'Process',
        description: 'Process execution events'
      },
      'file': {
        icon: DocumentIcon,
        color: 'text-green-600',
        bg: 'bg-green-100',
        label: 'File',
        description: 'File system activities'
      },
      'network': {
        icon: GlobeAltIcon,
        color: 'text-purple-600',
        bg: 'bg-purple-100',
        label: 'Network',
        description: 'Network connections'
      },
      'registry': {
        icon: WrenchScrewdriverIcon,
        color: 'text-orange-600',
        bg: 'bg-orange-100',
        label: 'Registry',
        description: 'Registry modifications'
      },
      'authentication': {
        icon: UserIcon,
        color: 'text-red-600',
        bg: 'bg-red-100',
        label: 'Authentication',
        description: 'Authentication events'
      }
    };

    return typeMap[typeLower] || {
      icon: ChartBarIcon,
      color: 'text-gray-600',
      bg: 'bg-gray-100',
      label: eventType || 'Unknown',
      description: 'System event'
    };
  };

  // Get severity info
  const getSeverityInfo = (severity) => {
    const severityLower = (severity || '').toLowerCase();
    
    const severityMap = {
      'critical': {
        bg: 'bg-red-100',
        text: 'text-red-800',
        border: 'border-red-200',
        label: 'Critical'
      },
      'high': {
        bg: 'bg-orange-100',
        text: 'text-orange-800',
        border: 'border-orange-200',
        label: 'High'
      },
      'medium': {
        bg: 'bg-yellow-100',
        text: 'text-yellow-800',
        border: 'border-yellow-200',
        label: 'Medium'
      },
      'low': {
        bg: 'bg-green-100',
        text: 'text-green-800',
        border: 'border-green-200',
        label: 'Low'
      },
      'informational': {
        bg: 'bg-blue-100',
        text: 'text-blue-800',
        border: 'border-blue-200',
        label: 'Info'
      }
    };

    return severityMap[severityLower] || {
      bg: 'bg-gray-100',
      text: 'text-gray-800',
      border: 'border-gray-200',
      label: severity || 'Unknown'
    };
  };

  // Filter events
  const filteredEvents = events.filter(event => {
    const matchesSearch = 
      (event.event_type || event.EventType || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (event.event_action || event.EventAction || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (event.agent_id || event.AgentID || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'All' || 
      (event.event_type || event.EventType || '').toLowerCase() === filterType.toLowerCase();
    
    const matchesSeverity = filterSeverity === 'All' ||
      (event.severity || event.Severity || '').toLowerCase() === filterSeverity.toLowerCase();
    
    return matchesSearch && matchesType && matchesSeverity;
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

  // Select event
  const toggleSelectEvent = (eventId) => {
    setSelectedEvents(prev => 
      prev.includes(eventId) 
        ? prev.filter(id => id !== eventId)
        : [...prev, eventId]
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-indigo-200 rounded-full animate-spin"></div>
            <div className="w-20 h-20 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin absolute top-0"></div>
          </div>
          <h3 className="mt-6 text-xl font-semibold text-gray-700">Loading Events</h3>
          <p className="mt-2 text-gray-500">Fetching system events...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <ChartBarIcon className="w-16 h-16 text-indigo-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-indigo-700 mb-2">Connection Error</h3>
          <p className="text-indigo-600 mb-6">{error}</p>
          <button
            onClick={handleRefresh}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-lg shadow-lg border-b border-white/20 px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-lg">
              <ChartBarIcon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                System Events
              </h1>
              <p className="text-gray-600 text-sm">Monitor all system activities and events</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 disabled:opacity-50"
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
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-gray-900">{stats?.total_events || events.length}</div>
                <div className="text-sm text-gray-600 font-medium">Total Events</div>
              </div>
              <div className="p-3 bg-indigo-100 rounded-xl">
                <ChartBarIcon className="w-8 h-8 text-indigo-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-blue-600">{stats?.type_breakdown?.Process || 0}</div>
                <div className="text-sm text-gray-600 font-medium">Process</div>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl">
                <CpuChipIcon className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-green-600">{stats?.type_breakdown?.File || 0}</div>
                <div className="text-sm text-gray-600 font-medium">File</div>
              </div>
              <div className="p-3 bg-green-100 rounded-xl">
                <DocumentIcon className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-purple-600">{stats?.type_breakdown?.Network || 0}</div>
                <div className="text-sm text-gray-600 font-medium">Network</div>
              </div>
              <div className="p-3 bg-purple-100 rounded-xl">
                <GlobeAltIcon className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-orange-600">{stats?.type_breakdown?.Registry || 0}</div>
                <div className="text-sm text-gray-600 font-medium">Registry</div>
              </div>
              <div className="p-3 bg-orange-100 rounded-xl">
                <WrenchScrewdriverIcon className="w-8 h-8 text-orange-600" />
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
                  placeholder="Search events..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2.5 w-80 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
                />
              </div>

              {/* Type Filter */}
              <div className="flex items-center space-x-2">
                <FunnelIcon className="w-5 h-5 text-gray-400" />
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
                >
                  <option value="All">All Types</option>
                  <option value="process">Process</option>
                  <option value="file">File</option>
                  <option value="network">Network</option>
                  <option value="registry">Registry</option>
                  <option value="authentication">Authentication</option>
                </select>
              </div>

              {/* Severity Filter */}
              <select
                value={filterSeverity}
                onChange={(e) => setFilterSeverity(e.target.value)}
                className="border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
              >
                <option value="All">All Severities</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
                <option value="informational">Informational</option>
              </select>
            </div>

            <div className="flex items-center space-x-4">
              {selectedEvents.length > 0 && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">{selectedEvents.length} selected</span>
                  <button className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition-colors">
                    Export
                  </button>
                </div>
              )}
              <div className="text-sm text-gray-500">
                Showing {filteredEvents.length} of {events.length} events
              </div>
            </div>
          </div>
        </div>

        {/* Events Table */}
        <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-indigo-50/80 backdrop-blur-sm border-b border-indigo-100">
                <tr>
                  <th className="px-6 py-4 text-left">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedEvents(filteredEvents.map(event => event.event_id || event.EventID));
                        } else {
                          setSelectedEvents([]);
                        }
                      }}
                    />
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wide">
                    Event Type
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wide">
                    Action
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wide">
                    Agent
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wide">
                    Severity
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wide">
                    Timestamp
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wide">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredEvents.map((event, index) => {
                  const eventId = event.event_id || event.EventID || index;
                  const eventType = event.event_type || event.EventType || 'Unknown';
                  const eventAction = event.event_action || event.EventAction || 'N/A';
                  const agentId = event.agent_id || event.AgentID || 'N/A';
                  const severity = event.severity || event.Severity || 'Unknown';
                  const timestamp = event.event_timestamp || event.EventTimestamp;
                  
                  const typeInfo = getEventTypeInfo(eventType);
                  const severityInfo = getSeverityInfo(severity);
                  const TypeIcon = typeInfo.icon;

                  return (
                    <tr key={eventId} className="hover:bg-indigo-50/50 transition-colors duration-200">
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedEvents.includes(eventId)}
                          onChange={() => toggleSelectEvent(eventId)}
                          className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg ${typeInfo.bg}`}>
                            <TypeIcon className={`w-5 h-5 ${typeInfo.color}`} />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{typeInfo.label}</div>
                            <div className="text-sm text-gray-500">{typeInfo.description}</div>
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <span className="font-medium text-gray-900">{eventAction}</span>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <ComputerDesktopIcon className="w-4 h-4 text-gray-400" />
                          <span className="font-mono text-sm text-gray-900">{agentId}</span>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 text-sm font-medium rounded-full ${severityInfo.bg} ${severityInfo.text} ${severityInfo.border} border`}>
                          {severityInfo.label}
                        </span>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{getTimeAgo(timestamp)}</div>
                        <div className="text-xs text-gray-500">{timestamp ? new Date(timestamp).toLocaleString() : 'N/A'}</div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <button
                          onClick={() => setShowDetails(eventId)}
                          className="flex items-center space-x-1 px-3 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 text-sm font-medium"
                        >
                          <EyeIcon className="w-4 h-4" />
                          <span>View</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          {/* Empty State */}
          {filteredEvents.length === 0 && (
            <div className="text-center py-16">
              <ChartBarIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">No events found</h3>
              <p className="text-gray-500">
                {events.length === 0 
                  ? "No system events recorded yet." 
                  : "No events match your search criteria."
                }
              </p>
              {searchTerm && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setFilterType('All');
                    setFilterSeverity('All');
                  }}
                  className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
                >
                  Clear Filters
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Event Details Modal */}
      {showDetails && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Event Details</h2>
              <button
                onClick={() => setShowDetails(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <XCircleIcon className="w-6 h-6 text-gray-500" />
              </button>
            </div>
            
            {/* Event details content */}
            <div className="space-y-6">
              <div className="text-center py-8 text-gray-500">
                <ChartBarIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Detailed event analysis view coming soon...</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Events;