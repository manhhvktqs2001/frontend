import React, { useEffect, useState } from 'react';
import { UserGroupIcon, CheckCircleIcon, XCircleIcon, CpuChipIcon, ArrowTrendingUpIcon } from '@heroicons/react/24/outline';
import axios from 'axios';

const statusBadge = status => {
  if (!status) return <span className="px-2 py-1 rounded bg-gray-200 text-gray-600 text-xs">Unknown</span>;
  if (status.toLowerCase() === 'active' || status.toLowerCase() === 'online')
    return <span className="px-2 py-1 rounded bg-green-100 text-green-700 text-xs flex items-center"><CheckCircleIcon className="w-4 h-4 mr-1"/>Online</span>;
  if (status.toLowerCase() === 'offline')
    return <span className="px-2 py-1 rounded bg-red-100 text-red-700 text-xs flex items-center"><XCircleIcon className="w-4 h-4 mr-1"/>Offline</span>;
  return <span className="px-2 py-1 rounded bg-yellow-100 text-yellow-700 text-xs">{status}</span>;
};

const Agents = () => {
  const [agents, setAgents] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      axios.get('http://192.168.20.85:5000/api/v1/agents/list'),
      axios.get('http://192.168.20.85:5000/api/v1/agents/stats/summary'),
    ])
      .then(([listRes, statsRes]) => {
        setAgents(listRes.data.agents || []);
        setStats(statsRes.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Không thể tải danh sách agent');
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <svg className="animate-spin h-10 w-10 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
      </svg>
      <span className="ml-4 text-lg text-gray-600">Đang tải danh sách agent...</span>
    </div>
  );
  if (error) return <div className="text-red-500 text-center py-8">{error}</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center mb-6">
        <UserGroupIcon className="w-8 h-8 text-blue-500 mr-2" />
        <h2 className="text-2xl font-bold gradient-text">Danh sách Agents</h2>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl shadow p-4 flex flex-col items-start">
          <UserGroupIcon className="w-6 h-6 text-blue-500 mb-1" />
          <div className="text-xl font-bold">{stats?.total_agents ?? 0}</div>
          <div className="text-xs text-gray-600">Tổng Agent</div>
        </div>
        <div className="bg-gradient-to-br from-green-100 to-green-50 rounded-xl shadow p-4 flex flex-col items-start">
          <CheckCircleIcon className="w-6 h-6 text-green-500 mb-1" />
          <div className="text-xl font-bold">{stats?.online_agents ?? 0}</div>
          <div className="text-xs text-gray-600">Online</div>
        </div>
        <div className="bg-gradient-to-br from-red-100 to-red-50 rounded-xl shadow p-4 flex flex-col items-start">
          <XCircleIcon className="w-6 h-6 text-red-500 mb-1" />
          <div className="text-xl font-bold">{stats?.offline_agents ?? 0}</div>
          <div className="text-xs text-gray-600">Offline</div>
        </div>
        <div className="bg-gradient-to-br from-yellow-100 to-yellow-50 rounded-xl shadow p-4 flex flex-col items-start">
          <ArrowTrendingUpIcon className="w-6 h-6 text-yellow-500 mb-1" />
          <div className="text-xl font-bold">{stats?.active_agents ?? 0}</div>
          <div className="text-xs text-gray-600">Active</div>
        </div>
      </div>
      <div className="overflow-x-auto rounded-xl shadow-lg bg-white">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-blue-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">HostName</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">IP Address</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">OS</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Status</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Last Heartbeat</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Chi tiết</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {agents.map(agent => (
              <tr key={agent.agent_id || agent.AgentID} className="hover:bg-blue-50 transition">
                <td className="px-4 py-2 whitespace-nowrap">{agent.hostname || agent.HostName}</td>
                <td className="px-4 py-2 whitespace-nowrap">{agent.ip_address || agent.IPAddress}</td>
                <td className="px-4 py-2 whitespace-nowrap">{agent.operating_system || agent.OperatingSystem}</td>
                <td className="px-4 py-2 whitespace-nowrap">{statusBadge(agent.status || agent.Status)}</td>
                <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-500">{agent.last_heartbeat || agent.LastHeartbeat}</td>
                <td className="px-4 py-2 whitespace-nowrap">
                  <a href={`/agents/${agent.agent_id || agent.AgentID}`} className="text-blue-600 hover:underline text-sm font-medium">Xem</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Agents; 