import React, { useEffect, useState } from 'react';
import { ChartBarIcon, ArrowTrendingUpIcon } from '@heroicons/react/24/outline';
import axios from 'axios';

const severityBadge = severity => {
  if (!severity) return <span className="px-2 py-1 rounded bg-gray-200 text-gray-600 text-xs">Unknown</span>;
  if (severity.toLowerCase() === 'critical')
    return <span className="px-2 py-1 rounded bg-red-600 text-white text-xs">Critical</span>;
  if (severity.toLowerCase() === 'high')
    return <span className="px-2 py-1 rounded bg-red-200 text-red-700 text-xs">High</span>;
  if (severity.toLowerCase() === 'medium')
    return <span className="px-2 py-1 rounded bg-yellow-200 text-yellow-800 text-xs">Medium</span>;
  if (severity.toLowerCase() === 'low')
    return <span className="px-2 py-1 rounded bg-green-100 text-green-700 text-xs">Low</span>;
  return <span className="px-2 py-1 rounded bg-gray-100 text-gray-700 text-xs">{severity}</span>;
};

const Events = () => {
  const [events, setEvents] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      axios.get('http://192.168.20.85:5000/api/v1/events/list'),
      axios.get('http://192.168.20.85:5000/api/v1/events/stats/summary'),
    ])
      .then(([listRes, statsRes]) => {
        setEvents(listRes.data.events || []);
        setStats(statsRes.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Không thể tải danh sách sự kiện');
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <svg className="animate-spin h-10 w-10 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
      </svg>
      <span className="ml-4 text-lg text-gray-600">Đang tải danh sách sự kiện...</span>
    </div>
  );
  if (error) return <div className="text-red-500 text-center py-8">{error}</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center mb-6">
        <ChartBarIcon className="w-8 h-8 text-indigo-500 mr-2" />
        <h2 className="text-2xl font-bold gradient-text">Danh sách Sự kiện</h2>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-indigo-100 to-indigo-50 rounded-xl shadow p-4 flex flex-col items-start">
          <ChartBarIcon className="w-6 h-6 text-indigo-500 mb-1" />
          <div className="text-xl font-bold">{stats?.total_events ?? 0}</div>
          <div className="text-xs text-gray-600">Tổng Sự kiện</div>
        </div>
        <div className="bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl shadow p-4 flex flex-col items-start">
          <ArrowTrendingUpIcon className="w-6 h-6 text-blue-500 mb-1" />
          <div className="text-xl font-bold">{stats?.type_breakdown?.Process ?? 0}</div>
          <div className="text-xs text-gray-600">Process</div>
        </div>
        <div className="bg-gradient-to-br from-green-100 to-green-50 rounded-xl shadow p-4 flex flex-col items-start">
          <ArrowTrendingUpIcon className="w-6 h-6 text-green-500 mb-1" />
          <div className="text-xl font-bold">{stats?.type_breakdown?.File ?? 0}</div>
          <div className="text-xs text-gray-600">File</div>
        </div>
        <div className="bg-gradient-to-br from-yellow-100 to-yellow-50 rounded-xl shadow p-4 flex flex-col items-start">
          <ArrowTrendingUpIcon className="w-6 h-6 text-yellow-500 mb-1" />
          <div className="text-xl font-bold">{stats?.type_breakdown?.Network ?? 0}</div>
          <div className="text-xs text-gray-600">Network</div>
        </div>
      </div>
      <div className="overflow-x-auto rounded-xl shadow-lg bg-white">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-indigo-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Event Type</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Action</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Timestamp</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Severity</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Agent ID</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Chi tiết</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {events.map(event => (
              <tr key={event.event_id || event.EventID} className="hover:bg-indigo-50 transition">
                <td className="px-4 py-2 whitespace-nowrap">{event.event_type || event.EventType}</td>
                <td className="px-4 py-2 whitespace-nowrap">{event.event_action || event.EventAction}</td>
                <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-500">{event.event_timestamp || event.EventTimestamp}</td>
                <td className="px-4 py-2 whitespace-nowrap">{severityBadge(event.severity || event.Severity)}</td>
                <td className="px-4 py-2 whitespace-nowrap">{event.agent_id || event.AgentID}</td>
                <td className="px-4 py-2 whitespace-nowrap">
                  <a href={`/events/${event.event_id || event.EventID}`} className="text-indigo-600 hover:underline text-sm font-medium">Xem</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Events; 