import React, { useState, useEffect } from 'react';
import { 
  fetchDashboardStats, 
  fetchAgentsOverview, 
  fetchAlertsOverview, 
  fetchThreatsOverview, 
  fetchEventsTimeline, 
  fetchSystemOverview, 
  fetchRealTimeStats 
} from '../services/api';

export const Dashboard = () => {
  const [dashboardStats, setDashboardStats] = useState(null);
  const [agentsOverview, setAgentsOverview] = useState(null);
  const [alertsOverview, setAlertsOverview] = useState(null);
  const [threatsOverview, setThreatsOverview] = useState(null);
  const [eventsTimeline, setEventsTimeline] = useState(null);
  const [systemOverview, setSystemOverview] = useState(null);
  const [realTimeStats, setRealTimeStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all dashboard data
  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [
        stats,
        agents,
        alerts,
        threats,
        timeline,
        system,
        realtime
      ] = await Promise.all([
        fetchDashboardStats(),
        fetchAgentsOverview(),
        fetchAlertsOverview(),
        fetchThreatsOverview(),
        fetchEventsTimeline(),
        fetchSystemOverview(),
        fetchRealTimeStats()
      ]);

      setDashboardStats(stats);
      setAgentsOverview(agents);
      setAlertsOverview(alerts);
      setThreatsOverview(threats);
      setEventsTimeline(timeline);
      setSystemOverview(system);
      setRealTimeStats(realtime);
    } catch (err) {
      setError(err.message);
      console.error('Failed to fetch dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Auto-refresh data every 30 seconds
  useEffect(() => {
    fetchAllData();
    const interval = setInterval(fetchAllData, 30000);
    return () => clearInterval(interval);
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <div className="text-gray-400">Loading dashboard data...</div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-red-400 text-xl mb-2">⚠️ Error Loading Dashboard</div>
          <div className="text-gray-400 mb-4">{error}</div>
          <button 
            onClick={fetchAllData}
            className="btn btn-primary"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Top Statistics Cards */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        {/* Active Agents */}
        <div className="col-span-1 bg-gray-900 rounded-xl p-6 flex flex-col justify-between border-t-4 border-green-500">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">💻</span>
            <span className="text-lg font-semibold">Active Agents</span>
          </div>
          <div className="text-4xl font-bold">
            {dashboardStats?.agents?.online || 0}
          </div>
          <div className="text-green-400 text-sm mt-2">
            {dashboardStats?.agents?.total ? 
              `${Math.round((dashboardStats.agents.online / dashboardStats.agents.total) * 100)}% online` : 
              'No agents'
            }
          </div>
        </div>

        {/* Active Threats */}
        <div className="col-span-1 bg-gray-900 rounded-xl p-6 flex flex-col justify-between border-t-4 border-red-500">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">🦠</span>
            <span className="text-lg font-semibold">Active Threats</span>
          </div>
          <div className="text-4xl font-bold">
            {dashboardStats?.threats?.active_indicators || 0}
          </div>
          <div className="text-red-400 text-sm mt-2">
            {dashboardStats?.threats?.detected_24h || 0} detected in 24h
          </div>
        </div>

        {/* Open Alerts */}
        <div className="col-span-1 bg-gray-900 rounded-xl p-6 flex flex-col justify-between border-t-4 border-yellow-500">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">⚠️</span>
            <span className="text-lg font-semibold">Open Alerts</span>
          </div>
          <div className="text-4xl font-bold">
            {dashboardStats?.alerts?.open || 0}
          </div>
          <div className="text-yellow-400 text-sm mt-2">
            {dashboardStats?.alerts?.critical || 0} critical
          </div>
        </div>

        {/* Events Today */}
        <div className="col-span-1 bg-gray-900 rounded-xl p-6 flex flex-col justify-between border-t-4 border-cyan-500">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">📋</span>
            <span className="text-lg font-semibold">Events Today</span>
          </div>
          <div className="text-4xl font-bold">
            {dashboardStats?.events?.last_24h?.toLocaleString() || 0}
          </div>
          <div className="text-cyan-400 text-sm mt-2">
            {dashboardStats?.events?.avg_per_hour || 0}/hour avg
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        {/* Threat Detection Timeline */}
        <div className="bg-gray-900 rounded-xl p-6">
          <div className="font-semibold text-lg mb-2">Threat Detection Timeline</div>
          <div className="h-48 flex items-center justify-center text-gray-400">
            {eventsTimeline?.threat_timeline?.length > 0 ? (
              <div className="w-full">
                <div className="text-sm text-gray-400 mb-2">
                  Total threats: {eventsTimeline.total_threats}
                </div>
                <div className="space-y-1">
                  {eventsTimeline.threat_timeline.slice(0, 6).map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-8 text-xs text-gray-500">H{item.time_unit}</div>
                      <div className="flex-1 bg-gray-800 rounded h-2">
                        <div 
                          className="bg-red-500 h-2 rounded" 
                          style={{width: `${(item.threat_count / Math.max(...eventsTimeline.threat_timeline.map(t => t.threat_count))) * 100}%`}}
                        ></div>
                      </div>
                      <div className="w-8 text-xs text-gray-400">{item.threat_count}</div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div>No threat data available</div>
            )}
          </div>
        </div>

        {/* Alert Severity Distribution */}
        <div className="bg-gray-900 rounded-xl p-6">
          <div className="font-semibold text-lg mb-2">Alert Severity Distribution</div>
          <div className="h-48 flex items-center justify-center text-gray-400">
            {alertsOverview?.severity_distribution ? (
              <div className="w-full space-y-2">
                {Object.entries(alertsOverview.severity_distribution).map(([severity, count]) => (
                  <div key={severity} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${
                        severity === 'Critical' ? 'bg-red-500' :
                        severity === 'High' ? 'bg-orange-500' :
                        severity === 'Medium' ? 'bg-yellow-500' :
                        'bg-green-500'
                      }`}></div>
                      <span className="text-sm">{severity}</span>
                    </div>
                    <span className="text-sm font-semibold">{count}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div>No alert data available</div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Security Alerts */}
      <div className="bg-gray-900 rounded-xl p-6">
        <div className="font-semibold text-lg mb-4">Recent Security Alerts</div>
        <div className="space-y-4">
          {alertsOverview?.recent_critical_alerts?.length > 0 ? (
            alertsOverview.recent_critical_alerts.slice(0, 5).map((alert, index) => (
              <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-gray-800">
                <div>
                  <div className={`font-semibold text-base ${
                    alert.severity === 'Critical' ? 'text-red-400' :
                    alert.severity === 'High' ? 'text-orange-400' :
                    'text-yellow-400'
                  }`}>
                    {alert.title}
                  </div>
                  <div className="text-gray-300 text-sm">
                    Agent: {alert.agent_id}
                  </div>
                  <div className="text-xs text-gray-500">
                    {alert.age_minutes} minutes ago
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="btn btn-primary">Investigate</button>
                  <button className="btn btn-ghost">Dismiss</button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-400 py-8">
              No recent critical alerts
            </div>
          )}
        </div>
      </div>

      {/* System Health Status */}
      <div className="grid grid-cols-3 gap-6 mt-8">
        <div className="bg-gray-900 rounded-xl p-6">
          <div className="font-semibold text-lg mb-2">System Health</div>
          <div className="text-3xl font-bold text-green-400">
            {dashboardStats?.system_health?.score || 0}%
          </div>
          <div className="text-sm text-gray-400 mt-2">
            Status: {dashboardStats?.system_health?.status || 'Unknown'}
          </div>
        </div>

        <div className="bg-gray-900 rounded-xl p-6">
          <div className="font-semibold text-lg mb-2">Detection Engine</div>
          <div className="text-3xl font-bold text-blue-400">
            {dashboardStats?.detection?.active_rules || 0}
          </div>
          <div className="text-sm text-gray-400 mt-2">
            Active Rules
          </div>
        </div>

        <div className="bg-gray-900 rounded-xl p-6">
          <div className="font-semibold text-lg mb-2">Real-time Activity</div>
          <div className="text-3xl font-bold text-purple-400">
            {realTimeStats?.recent_activity?.events_last_5min || 0}
          </div>
          <div className="text-sm text-gray-400 mt-2">
            Events (5min)
          </div>
        </div>
      </div>
    </div>
  );
}; 