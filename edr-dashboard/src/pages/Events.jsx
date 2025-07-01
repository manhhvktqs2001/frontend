import React, { useState, useEffect } from 'react';
import apiService from '../services/api';
import { 
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowPathIcon,
  EyeIcon,
  DocumentTextIcon,
  CalendarIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  ShieldCheckIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  InformationCircleIcon,
  CalendarDaysIcon
} from '@heroicons/react/24/outline';

const EventLogItem = ({ event, onViewDetails, isExpanded, onToggleExpand }) => {
  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'critical': return 'text-red-400 bg-red-500/20';
      case 'high': return 'text-orange-400 bg-orange-500/20';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20';
      case 'low': return 'text-green-400 bg-green-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getEventIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'threat': return <ExclamationTriangleIcon className="w-4 h-4 text-red-400" />;
      case 'authentication': return <InformationCircleIcon className="w-4 h-4 text-blue-400" />;
      case 'file': return <DocumentTextIcon className="w-4 h-4 text-green-400" />;
      case 'network': return <InformationCircleIcon className="w-4 h-4 text-purple-400" />;
      case 'process': return <InformationCircleIcon className="w-4 h-4 text-yellow-400" />;
      default: return <InformationCircleIcon className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1">
          {getEventIcon(event.event_type)}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <h4 className="font-medium text-white">{event.event_type || 'Unknown Event'}</h4>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(event.severity)}`}>
                {event.severity || 'Unknown'}
              </span>
            </div>
            <p className="text-sm text-gray-400 mb-2">
              {event.description || 'No description available'}
            </p>
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span>Agent: {event.agent_id || 'Unknown'}</span>
              <span>Source: {event.source || 'Unknown'}</span>
              <span>{new Date(event.event_timestamp).toLocaleString()}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onViewDetails(event)}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors"
          >
            Details
          </button>
          <button
            onClick={onToggleExpand}
            className="p-1 text-gray-400 hover:text-white transition-colors"
          >
            {isExpanded ? '−' : '+'}
          </button>
        </div>
      </div>
      
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-white/10">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-400">Event ID:</span>
              <span className="text-white ml-2">{event.event_id || 'N/A'}</span>
            </div>
            <div>
              <span className="text-gray-400">Category:</span>
              <span className="text-white ml-2">{event.category || 'N/A'}</span>
            </div>
            <div>
              <span className="text-gray-400">User:</span>
              <span className="text-white ml-2">{event.user || 'N/A'}</span>
            </div>
            <div>
              <span className="text-gray-400">Process:</span>
              <span className="text-white ml-2">{event.process_name || 'N/A'}</span>
            </div>
            <div className="col-span-2">
              <span className="text-gray-400">Raw Data:</span>
              <pre className="text-white ml-2 mt-1 text-xs bg-white/5 p-2 rounded overflow-x-auto">
                {JSON.stringify(event.raw_data || {}, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const FilterPanel = ({ filters, onFiltersChange, onApply, onReset }) => (
  <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
    <h3 className="text-lg font-semibold text-white mb-4">Filters</h3>
    <div className="space-y-4">
      <div>
        <label className="block text-gray-300 text-sm mb-2">Event Type</label>
        <select
          value={filters.eventType}
          onChange={(e) => onFiltersChange({ ...filters, eventType: e.target.value })}
          className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
        >
          <option value="">All Types</option>
          <option value="threat">Threat</option>
          <option value="authentication">Authentication</option>
          <option value="file">File</option>
          <option value="network">Network</option>
          <option value="process">Process</option>
        </select>
      </div>
      
      <div>
        <label className="block text-gray-300 text-sm mb-2">Severity</label>
        <select
          value={filters.severity}
          onChange={(e) => onFiltersChange({ ...filters, severity: e.target.value })}
          className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
        >
          <option value="">All Severities</option>
          <option value="critical">Critical</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>
      
      <div>
        <label className="block text-gray-300 text-sm mb-2">Time Range</label>
        <select
          value={filters.timeRange}
          onChange={(e) => onFiltersChange({ ...filters, timeRange: e.target.value })}
          className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
        >
          <option value="1">Last Hour</option>
          <option value="6">Last 6 Hours</option>
          <option value="24">Last 24 Hours</option>
          <option value="48">Last 48 Hours</option>
          <option value="72">Last 72 Hours</option>
        </select>
      </div>
      
      <div className="flex gap-2 pt-4">
        <button
          onClick={onApply}
          className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          Apply
        </button>
        <button
          onClick={onReset}
          className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
        >
          Reset
        </button>
      </div>
    </div>
  </div>
);

const EventDetailModal = ({ event, onClose }) => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-gray-800 rounded-xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-white">Event Details</h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white"
        >
          ×
        </button>
      </div>
      
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-gray-400 text-sm">Event ID:</span>
            <p className="text-white">{event.event_id || 'N/A'}</p>
          </div>
          <div>
            <span className="text-gray-400 text-sm">Event Type:</span>
            <p className="text-white">{event.event_type || 'N/A'}</p>
          </div>
          <div>
            <span className="text-gray-400 text-sm">Severity:</span>
            <p className="text-white">{event.severity || 'N/A'}</p>
          </div>
          <div>
            <span className="text-gray-400 text-sm">Timestamp:</span>
            <p className="text-white">{new Date(event.event_timestamp).toLocaleString()}</p>
          </div>
          <div>
            <span className="text-gray-400 text-sm">Agent ID:</span>
            <p className="text-white">{event.agent_id || 'N/A'}</p>
          </div>
          <div>
            <span className="text-gray-400 text-sm">Source:</span>
            <p className="text-white">{event.source || 'N/A'}</p>
          </div>
        </div>
        
        <div>
          <span className="text-gray-400 text-sm">Description:</span>
          <p className="text-white mt-1">{event.description || 'No description available'}</p>
        </div>
        
        <div>
          <span className="text-gray-400 text-sm">Raw Data:</span>
          <pre className="text-white mt-1 text-sm bg-white/5 p-3 rounded overflow-x-auto">
            {JSON.stringify(event.raw_data || {}, null, 2)}
          </pre>
        </div>
      </div>
      
      <div className="flex gap-3 pt-4">
        <button
          onClick={onClose}
          className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
        >
          Close
        </button>
        <button className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
          Investigate
        </button>
      </div>
    </div>
  </div>
);

const Events = () => {
  const [eventsData, setEventsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    eventType: '',
    severity: '',
    timeRange: '24'
  });
  const [expandedEvents, setExpandedEvents] = useState(new Set());
  const [selectedEvent, setSelectedEvent] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = {
        hours: parseInt(filters.timeRange),
        limit: 100,
        ...filters
      };
      
      const data = await apiService.getEvents(params);
      setEventsData(data);
    } catch (err) {
      setError(err.message);
      console.error('Failed to fetch events data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [filters.timeRange]);

  const handleToggleExpand = (index) => {
    const newExpanded = new Set(expandedEvents);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedEvents(newExpanded);
  };

  const handleViewDetails = (event) => {
    setSelectedEvent(event);
  };

  const handleApplyFilters = () => {
    fetchData();
  };

  const handleResetFilters = () => {
    setFilters({
      eventType: '',
      severity: '',
      timeRange: '24'
    });
  };

  const filteredEvents = eventsData?.timeline?.filter(event => {
    if (searchQuery && !event.event_type?.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (filters.eventType && event.event_type?.toLowerCase() !== filters.eventType.toLowerCase()) {
      return false;
    }
    if (filters.severity && event.severity?.toLowerCase() !== filters.severity.toLowerCase()) {
      return false;
    }
    return true;
  }) || [];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <div className="text-gray-400">Loading events data...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-red-400 text-xl mb-2">⚠️ Error Loading Events</div>
          <div className="text-gray-400 mb-4">{error}</div>
          <button
            onClick={fetchData}
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
          <h1 className="text-3xl font-bold text-white">Security Events & Logs</h1>
          <p className="text-gray-400 mt-1">Monitor and analyze security events in real-time</p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={fetchData}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors"
          >
            <ArrowPathIcon className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <DocumentTextIcon className="w-6 h-6 text-blue-400" />
            <span className="text-lg font-semibold text-white">Total Events</span>
          </div>
          <div className="text-3xl font-bold text-blue-400">
            {eventsData?.total_events?.toLocaleString() || 0}
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <ExclamationTriangleIcon className="w-6 h-6 text-red-400" />
            <span className="text-lg font-semibold text-white">Threat Events</span>
          </div>
          <div className="text-3xl font-bold text-red-400">
            {eventsData?.total_threats?.toLocaleString() || 0}
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <ClockIcon className="w-6 h-6 text-green-400" />
            <span className="text-lg font-semibold text-white">Events/Hour</span>
          </div>
          <div className="text-3xl font-bold text-green-400">
            {Math.round((eventsData?.total_events || 0) / parseInt(filters.timeRange))}
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <CalendarDaysIcon className="w-6 h-6 text-purple-400" />
            <span className="text-lg font-semibold text-white">Log Entries</span>
          </div>
          <div className="text-3xl font-bold text-purple-400">
            {filteredEvents.length}
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

        {/* Events List */}
        <div className="lg:col-span-3 space-y-6">
          {/* Search */}
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
            />
          </div>

          {/* Events List */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">Event Logs</h3>
              <div className="text-sm text-gray-400">
                Showing {filteredEvents.length} events
              </div>
            </div>

            <div className="space-y-4 max-h-[600px] overflow-y-auto custom-scrollbar">
              {filteredEvents.length > 0 ? (
                filteredEvents.map((event, index) => (
                  <EventLogItem
                    key={index}
                    event={event}
                    onViewDetails={handleViewDetails}
                    isExpanded={expandedEvents.has(index)}
                    onToggleExpand={() => handleToggleExpand(index)}
                  />
                ))
              ) : (
                <div className="text-center text-gray-400 py-12">
                  <DocumentTextIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No events found matching your criteria</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Event Detail Modal */}
      {selectedEvent && (
        <EventDetailModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </div>
  );
};

export default Events;