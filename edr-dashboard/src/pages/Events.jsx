import React, { useState, useEffect } from 'react';
import { fetchEventsTimeline } from '../services/api';

export const Events = () => {
  const [eventsData, setEventsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState(24);
  const [granularity, setGranularity] = useState('hour');

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchEventsTimeline(timeRange, granularity);
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
  }, [timeRange, granularity]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
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
          <button onClick={fetchData} className="btn btn-primary">Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Security Events</h1>
        <p className="text-gray-400">Monitor and analyze security events</p>
      </div>

      {/* Controls */}
      <div className="mb-6 flex gap-4">
        <div className="flex gap-2">
          {[1, 6, 24, 48, 72].map((hours) => (
            <button
              key={hours}
              onClick={() => setTimeRange(hours)}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                timeRange === hours
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {hours}h
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          {['hour', 'minute'].map((gran) => (
            <button
              key={gran}
              onClick={() => setGranularity(gran)}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                granularity === gran
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {gran}
            </button>
          ))}
        </div>
      </div>

      {/* Event Summary Cards */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-900 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">📋</span>
            <span className="text-lg font-semibold">Total Events</span>
          </div>
          <div className="text-3xl font-bold text-blue-400">
            {eventsData?.total_events?.toLocaleString() || 0}
          </div>
        </div>

        <div className="bg-gray-900 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">🦠</span>
            <span className="text-lg font-semibold">Threat Events</span>
          </div>
          <div className="text-3xl font-bold text-red-400">
            {eventsData?.total_threats?.toLocaleString() || 0}
          </div>
        </div>

        <div className="bg-gray-900 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">⚡</span>
            <span className="text-lg font-semibold">Avg/Hour</span>
          </div>
          <div className="text-3xl font-bold text-green-400">
            {Math.round((eventsData?.total_events || 0) / timeRange)}
          </div>
        </div>

        <div className="bg-gray-900 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">📊</span>
            <span className="text-lg font-semibold">Timeline Points</span>
          </div>
          <div className="text-3xl font-bold text-purple-400">
            {eventsData?.timeline?.length || 0}
          </div>
        </div>
      </div>

      {/* Events Timeline */}
      <div className="bg-gray-900 rounded-xl p-6 mb-8">
        <div className="font-semibold text-lg mb-4">Events Timeline</div>
        <div className="space-y-4">
          {eventsData?.timeline?.length > 0 ? (
            eventsData.timeline.slice(0, 10).map((event, index) => (
              <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-gray-800">
                <div>
                  <div className="font-semibold text-base">{event.event_type}</div>
                  <div className="text-gray-300 text-sm">
                    Severity: {event.severity}
                  </div>
                  <div className="text-xs text-gray-500">
                    Time: {event.time_unit} ({granularity})
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-400">{event.count}</div>
                  <div className="text-xs text-gray-400">events</div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-400 py-8">
              No timeline data available
            </div>
          )}
        </div>
      </div>

      {/* Threat Events Timeline */}
      <div className="bg-gray-900 rounded-xl p-6">
        <div className="font-semibold text-lg mb-4">Threat Events Timeline</div>
        <div className="space-y-4">
          {eventsData?.threat_timeline?.length > 0 ? (
            eventsData.threat_timeline.slice(0, 10).map((threat, index) => (
              <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-gray-800">
                <div>
                  <div className="font-semibold text-base text-red-400">Threat Events</div>
                  <div className="text-xs text-gray-500">
                    Time: {threat.time_unit} ({granularity})
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-red-400">{threat.threat_count}</div>
                  <div className="text-xs text-gray-400">threats</div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-400 py-8">
              No threat timeline data available
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 