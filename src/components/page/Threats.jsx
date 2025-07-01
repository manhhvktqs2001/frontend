import React, { useEffect, useState } from 'react';
import { ShieldCheckIcon, CheckCircleIcon, EyeIcon } from '@heroicons/react/24/outline';
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

const activeBadge = isActive => {
  if (isActive === true || isActive === 1)
    return <span className="px-2 py-1 rounded bg-green-100 text-green-700 text-xs">Active</span>;
  if (isActive === false || isActive === 0)
    return <span className="px-2 py-1 rounded bg-gray-200 text-gray-600 text-xs">Inactive</span>;
  return <span className="px-2 py-1 rounded bg-yellow-100 text-yellow-700 text-xs">Unknown</span>;
};

const Threats = () => {
  const [threats, setThreats] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      axios.get('http://192.168.20.85:5000/api/v1/threats/list'),
      axios.get('http://192.168.20.85:5000/api/v1/threats/stats/summary'),
    ])
      .then(([listRes, statsRes]) => {
        setThreats(listRes.data.threats || []);
        setStats(statsRes.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Không thể tải danh sách threat');
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <svg className="animate-spin h-10 w-10 text-emerald-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
      </svg>
      <span className="ml-4 text-lg text-gray-600">Đang tải danh sách threat...</span>
    </div>
  );
  if (error) return <div className="text-red-500 text-center py-8">{error}</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center mb-6">
        <ShieldCheckIcon className="w-8 h-8 text-emerald-500 mr-2" />
        <h2 className="text-2xl font-bold gradient-text">Danh sách Threat Intelligence</h2>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-emerald-100 to-emerald-50 rounded-xl shadow p-4 flex flex-col items-start">
          <ShieldCheckIcon className="w-6 h-6 text-emerald-500 mb-1" />
          <div className="text-xl font-bold">{stats?.total_threats ?? 0}</div>
          <div className="text-xs text-gray-600">Tổng Threat</div>
        </div>
        <div className="bg-gradient-to-br from-green-100 to-green-50 rounded-xl shadow p-4 flex flex-col items-start">
          <CheckCircleIcon className="w-6 h-6 text-green-500 mb-1" />
          <div className="text-xl font-bold">{stats?.active_threats ?? 0}</div>
          <div className="text-xs text-gray-600">Active</div>
        </div>
        <div className="bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl shadow p-4 flex flex-col items-start">
          <EyeIcon className="w-6 h-6 text-blue-500 mb-1" />
          <div className="text-xl font-bold">{stats?.high_confidence_threats ?? 0}</div>
          <div className="text-xs text-gray-600">High Confidence</div>
        </div>
      </div>
      <div className="overflow-x-auto rounded-xl shadow-lg bg-white">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-emerald-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Threat Name</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Threat Type</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Threat Value</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Severity</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Platform</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Active</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Chi tiết</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {threats.map(threat => (
              <tr key={threat.threat_id || threat.ThreatID} className="hover:bg-emerald-50 transition">
                <td className="px-4 py-2 whitespace-nowrap">{threat.threat_name || threat.ThreatName}</td>
                <td className="px-4 py-2 whitespace-nowrap">{threat.threat_type || threat.ThreatType}</td>
                <td className="px-4 py-2 whitespace-nowrap">{threat.threat_value || threat.ThreatValue || threat.description || threat.Description}</td>
                <td className="px-4 py-2 whitespace-nowrap">{severityBadge(threat.severity || threat.Severity)}</td>
                <td className="px-4 py-2 whitespace-nowrap">{threat.platform || threat.Platform}</td>
                <td className="px-4 py-2 whitespace-nowrap">{activeBadge(threat.is_active ?? threat.IsActive)}</td>
                <td className="px-4 py-2 whitespace-nowrap">
                  <a href={`/threats/${threat.threat_id || threat.ThreatID}`} className="text-emerald-600 hover:underline text-sm font-medium">Xem</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Threats; 