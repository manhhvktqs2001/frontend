import React, { useState, useEffect } from 'react';
import { fetchAgentsOverview } from '../services/api';

export const Agents = () => {
  const [agentsData, setAgentsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchAgentsOverview();
      setAgentsData(data);
    } catch (err) {
      setError(err.message);
      console.error('Failed to fetch agents data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <div className="text-gray-400">Loading agents data...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-red-400 text-xl mb-2">⚠️ Error Loading Agents</div>
          <div className="text-gray-400 mb-4">{error}</div>
          <button onClick={fetchData} className="btn btn-primary">Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Agents Management</h1>
        <p className="text-gray-400">Monitor and manage endpoint agents</p>
      </div>

      {/* Agent Summary Cards */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-white border border-gray-200 shadow-md rounded-xl p-6 text-gray-900 dark:bg-gray-900 dark:text-white dark:border-slate-700">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">💻</span>
            <span className="text-lg font-semibold">Total Agents</span>
          </div>
          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
            {agentsData?.summary?.total_agents || 0}
          </div>
        </div>

        <div className="bg-white border border-gray-200 shadow-md rounded-xl p-6 text-gray-900 dark:bg-gray-900 dark:text-white dark:border-slate-700">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">🟢</span>
            <span className="text-lg font-semibold">Active</span>
          </div>
          <div className="text-3xl font-bold text-green-600 dark:text-green-400">
            {agentsData?.summary?.active_agents || 0}
          </div>
        </div>

        <div className="bg-white border border-gray-200 shadow-md rounded-xl p-6 text-gray-900 dark:bg-gray-900 dark:text-white dark:border-slate-700">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">🔴</span>
            <span className="text-lg font-semibold">Offline</span>
          </div>
          <div className="text-3xl font-bold text-red-600 dark:text-red-400">
            {agentsData?.summary?.offline_agents || 0}
          </div>
        </div>

        <div className="bg-white border border-gray-200 shadow-md rounded-xl p-6 text-gray-900 dark:bg-gray-900 dark:text-white dark:border-slate-700">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">⚠️</span>
            <span className="text-lg font-semibold">Issues</span>
          </div>
          <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
            {agentsData?.performance_issues?.length || 0}
          </div>
        </div>
      </div>

      {/* Agent Status Distribution */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="bg-white border border-gray-200 shadow-md rounded-xl p-6 text-gray-900 dark:bg-gray-900 dark:text-white dark:border-slate-700">
          <div className="font-semibold text-lg mb-4">Status Distribution</div>
          <div className="space-y-3">
            {agentsData?.status_distribution ? (
              Object.entries(agentsData.status_distribution).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${
                      status === 'Active' ? 'bg-green-500' :
                      status === 'Offline' ? 'bg-red-500' :
                      status === 'Inactive' ? 'bg-gray-500' :
                      'bg-yellow-500'
                    }`}></div>
                    <span className="text-sm text-gray-900 dark:text-gray-300">{status}</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">{count}</span>
                </div>
              ))
            ) : (
              <div className="text-gray-400">No status data available</div>
            )}
          </div>
        </div>

        <div className="bg-white border border-gray-200 shadow-md rounded-xl p-6 text-gray-900 dark:bg-gray-900 dark:text-white dark:border-slate-700">
          <div className="font-semibold text-lg mb-4">OS Distribution</div>
          <div className="space-y-3">
            {agentsData?.os_distribution ? (
              Object.entries(agentsData.os_distribution).map(([os, count]) => (
                <div key={os} className="flex items-center justify-between">
                  <span className="text-sm text-gray-900 dark:text-gray-300">{os || 'Unknown'}</span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">{count}</span>
                </div>
              ))
            ) : (
              <div className="text-gray-400">No OS data available</div>
            )}
          </div>
        </div>
      </div>

      {/* Performance Issues */}
      <div className="bg-white border border-gray-200 shadow-md rounded-xl p-6 mb-8 text-gray-900 dark:bg-gray-900 dark:text-white dark:border-slate-700">
        <div className="font-semibold text-lg mb-4">Agents with Performance Issues</div>
        <div className="space-y-4">
          {agentsData?.performance_issues?.length > 0 ? (
            agentsData.performance_issues.map((agent, index) => (
              <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-gray-100 dark:bg-gray-800">
                <div>
                  <div className="font-semibold text-base text-gray-900 dark:text-white">{agent.hostname}</div>
                  <div className="text-gray-700 dark:text-gray-300 text-sm">Agent ID: {agent.agent_id}</div>
                  <div className="flex gap-4 mt-2 text-xs">
                    <span className={`${agent.cpu_usage > 90 ? 'text-red-600 dark:text-red-400' : 'text-gray-700 dark:text-gray-400'}`}>CPU: {agent.cpu_usage}%</span>
                    <span className={`${agent.memory_usage > 95 ? 'text-red-600 dark:text-red-400' : 'text-gray-700 dark:text-gray-400'}`}>Memory: {agent.memory_usage}%</span>
                    <span className={`${agent.disk_usage > 90 ? 'text-red-600 dark:text-red-400' : 'text-gray-700 dark:text-gray-400'}`}>Disk: {agent.disk_usage}%</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="btn btn-primary">Investigate</button>
                  <button className="btn btn-ghost">Details</button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-400 py-8">No performance issues detected</div>
          )}
        </div>
      </div>

      {/* Top Event Generators */}
      <div className="bg-white border border-gray-200 shadow-md rounded-xl p-6 text-gray-900 dark:bg-gray-900 dark:text-white dark:border-slate-700">
        <div className="font-semibold text-lg mb-4">Top Event Generators (24h)</div>
        <div className="space-y-4">
          {agentsData?.top_event_generators?.length > 0 ? (
            agentsData.top_event_generators.map((agent, index) => (
              <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-gray-100 dark:bg-gray-800">
                <div>
                  <div className="font-semibold text-base text-gray-900 dark:text-white">{agent.hostname}</div>
                  <div className="text-gray-700 dark:text-gray-300 text-sm">Agent ID: {agent.agent_id}</div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{agent.event_count}</div>
                  <div className="text-xs text-gray-700 dark:text-gray-400">events</div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-400 py-8">No event data available</div>
          )}
        </div>
      </div>
    </div>
  );
}; 