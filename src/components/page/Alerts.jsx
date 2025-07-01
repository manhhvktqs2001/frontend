import React, { useEffect, useState } from 'react';
import { ExclamationTriangleIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
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

const statusBadge = status => {
  if (!status) return <span className="px-2 py-1 rounded bg-gray-200 text-gray-600 text-xs">Unknown</span>;
  if (status.toLowerCase() === 'open')
    return <span className="px-2 py-1 rounded bg-yellow-100 text-yellow-800 text-xs">Open</span>;
  if (status.toLowerCase() === 'investigating')
    return <span className="px-2 py-1 rounded bg-blue-100 text-blue-800 text-xs">Investigating</span>;
  if (status.toLowerCase() === 'resolved')
    return <span className="px-2 py-1 rounded bg-green-100 text-green-700 text-xs">Resolved</span>;
  return <span className="px-2 py-1 rounded bg-gray-100 text-gray-700 text-xs">{status}</span>;
};

const Alerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      axios.get('http://192.168.20.85:5000/api/v1/alerts/list'),
      axios.get('http://192.168.20.85:5000/api/v1/alerts/stats/summary'),
    ])
      .then(([listRes, statsRes]) => {
        setAlerts(listRes.data.alerts || []);
        setStats(statsRes.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Không thể tải danh sách cảnh báo');
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <svg className="animate-spin h-10 w-10 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
      </svg>
      <span className="ml-4 text-lg text-gray-600">Đang tải danh sách cảnh báo...</span>
    </div>
  );
  if (error) return <div className="text-red-500 text-center py-8">{error}</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center mb-6">
        <ExclamationTriangleIcon className="w-8 h-8 text-red-500 mr-2" />
        <h2 className="text-2xl font-bold gradient-text">Danh sách Cảnh báo</h2>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-red-100 to-red-50 rounded-xl shadow p-4 flex flex-col items-start">
          <ExclamationTriangleIcon className="w-6 h-6 text-red-500 mb-1" />
          <div className="text-xl font-bold">{stats?.total_alerts ?? 0}</div>
          <div className="text-xs text-gray-600">Tổng Alert</div>
        </div>
        <div className="bg-gradient-to-br from-yellow-100 to-yellow-50 rounded-xl shadow p-4 flex flex-col items-start">
          <XCircleIcon className="w-6 h-6 text-yellow-500 mb-1" />
          <div className="text-xl font-bold">{stats?.open_alerts ?? 0}</div>
          <div className="text-xs text-gray-600">Open</div>
        </div>
        <div className="bg-gradient-to-br from-pink-100 to-pink-50 rounded-xl shadow p-4 flex flex-col items-start">
          <ExclamationTriangleIcon className="w-6 h-6 text-pink-500 mb-1" />
          <div className="text-xl font-bold">{stats?.critical_alerts ?? 0}</div>
          <div className="text-xs text-gray-600">Critical</div>
        </div>
        <div className="bg-gradient-to-br from-green-100 to-green-50 rounded-xl shadow p-4 flex flex-col items-start">
          <CheckCircleIcon className="w-6 h-6 text-green-500 mb-1" />
          <div className="text-xl font-bold">{stats?.resolved_alerts ?? 0}</div>
          <div className="text-xs text-gray-600">Resolved</div>
        </div>
      </div>
      <div className="overflow-x-auto rounded-xl shadow-lg bg-white">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-red-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Title</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Severity</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Detection Method</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Status</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">First Detected</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Agent ID</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Chi tiết</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {alerts.map(alert => (
              <tr key={alert.alert_id || alert.AlertID} className="hover:bg-red-50 transition">
                <td className="px-4 py-2 whitespace-nowrap">{alert.title || alert.Title}</td>
                <td className="px-4 py-2 whitespace-nowrap">{severityBadge(alert.severity || alert.Severity)}</td>
                <td className="px-4 py-2 whitespace-nowrap">{alert.detection_method || alert.DetectionMethod || alert.alert_type || alert.AlertType}</td>
                <td className="px-4 py-2 whitespace-nowrap">{statusBadge(alert.status || alert.Status)}</td>
                <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-500">{alert.first_detected || alert.FirstDetected}</td>
                <td className="px-4 py-2 whitespace-nowrap">{alert.agent_id || alert.AgentID}</td>
                <td className="px-4 py-2 whitespace-nowrap">
                  <a href={`/alerts/${alert.alert_id || alert.AlertID}`} className="text-red-600 hover:underline text-sm font-medium">Xem</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Alerts; 