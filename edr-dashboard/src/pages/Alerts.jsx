import React, { useState, useEffect } from 'react';
import { fetchAlertsOverview } from '../services/api';
import { Card } from '../components/ui/Card';

export const Alerts = () => {
  const [alertsData, setAlertsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState(24);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchAlertsOverview(timeRange);
      setAlertsData(data);
    } catch (err) {
      setError(err.message);
      console.error('Failed to fetch alerts data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [timeRange]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <div className="text-gray-400">Loading alerts data...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-red-400 text-xl mb-2">⚠️ Error Loading Alerts</div>
          <div className="text-gray-400 mb-4">{error}</div>
          <button onClick={fetchData} className="btn btn-primary">Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Security Alerts</h1>
        <p className="text-gray-700">Monitor and respond to security incidents.</p>
      </div>

      {/* Time Range Selector */}
      <div className="mb-6">
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
      </div>

      {/* Alert Summary Cards */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <Card className="bg-white border border-gray-200 shadow-md text-gray-900 dark:bg-slate-800 dark:border-slate-700 dark:text-white rounded-lg p-4 transition-colors duration-300">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">⚠️</span>
            <span className="text-lg font-semibold">Total Alerts</span>
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white">
            {alertsData?.summary?.total_alerts || 0}
          </div>
        </Card>

        <Card className="bg-white border border-gray-200 shadow-md text-gray-900 dark:bg-slate-800 dark:border-slate-700 dark:text-white rounded-lg p-4 transition-colors duration-300">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">🔴</span>
            <span className="text-lg font-semibold">Critical</span>
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white">
            {alertsData?.summary?.critical_alerts || 0}
          </div>
        </Card>

        <Card className="bg-white border border-gray-200 shadow-md text-gray-900 dark:bg-slate-800 dark:border-slate-700 dark:text-white rounded-lg p-4 transition-colors duration-300">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">🟠</span>
            <span className="text-lg font-semibold">High</span>
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white">
            {alertsData?.summary?.high_alerts || 0}
          </div>
        </Card>

        <Card className="bg-white border border-gray-200 shadow-md text-gray-900 dark:bg-slate-800 dark:border-slate-700 dark:text-white rounded-lg p-4 transition-colors duration-300">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">🟡</span>
            <span className="text-lg font-semibold">Open</span>
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white">
            {alertsData?.summary?.open_alerts || 0}
          </div>
        </Card>
      </div>

      {/* Alert Distribution Charts */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <Card className="bg-white border border-gray-200 shadow-md text-gray-900 dark:bg-slate-800 dark:border-slate-700 dark:text-white rounded-lg p-4 transition-colors duration-300">
          <div className="font-semibold text-lg mb-4">Severity Distribution</div>
          <div className="space-y-3">
            {alertsData?.severity_distribution ? (
              Object.entries(alertsData.severity_distribution).map(([severity, count]) => (
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
              ))
            ) : (
              <div className="text-gray-400">No severity data available</div>
            )}
          </div>
        </Card>

        <Card className="bg-white border border-gray-200 shadow-md text-gray-900 dark:bg-slate-800 dark:border-slate-700 dark:text-white rounded-lg p-4 transition-colors duration-300">
          <div className="font-semibold text-lg mb-4">Status Distribution</div>
          <div className="space-y-3">
            {alertsData?.status_distribution ? (
              Object.entries(alertsData.status_distribution).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${
                      status === 'Open' ? 'bg-red-500' :
                      status === 'Investigating' ? 'bg-yellow-500' :
                      status === 'Resolved' ? 'bg-green-500' :
                      'bg-gray-500'
                    }`}></div>
                    <span className="text-sm">{status}</span>
                  </div>
                  <span className="text-sm font-semibold">{count}</span>
                </div>
              ))
            ) : (
              <div className="text-gray-400">No status data available</div>
            )}
          </div>
        </Card>
      </div>

      {/* Top Alert Types */}
      <Card className="bg-white border border-gray-200 shadow-md text-gray-900 dark:bg-slate-800 dark:border-slate-700 dark:text-white rounded-lg p-4 transition-colors duration-300 mb-8">
        <div className="font-semibold text-lg mb-4">Top Alert Types</div>
        <div className="space-y-4">
          {alertsData?.top_alert_types?.length > 0 ? (
            alertsData.top_alert_types.map((alertType, index) => (
              <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-gray-800">
                <div>
                  <div className="font-semibold text-base">{alertType.type}</div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-400">{alertType.count}</div>
                  <div className="text-xs text-gray-400">alerts</div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-400 py-8">
              No alert type data available
            </div>
          )}
        </div>
      </Card>

      {/* MITRE Tactics */}
      <Card className="bg-white border border-gray-200 shadow-md text-gray-900 dark:bg-slate-800 dark:border-slate-700 dark:text-white rounded-lg p-4 transition-colors duration-300 mb-8">
        <div className="font-semibold text-lg mb-4">MITRE ATT&CK Tactics</div>
        <div className="space-y-4">
          {alertsData?.mitre_tactics?.length > 0 ? (
            alertsData.mitre_tactics.map((tactic, index) => (
              <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-gray-800">
                <div>
                  <div className="font-semibold text-base">{tactic.tactic}</div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-purple-400">{tactic.count}</div>
                  <div className="text-xs text-gray-400">detections</div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-400 py-8">
              No MITRE tactics data available
            </div>
          )}
        </div>
      </Card>

      {/* Recent Critical Alerts */}
      <Card className="bg-white border border-gray-200 shadow-md text-gray-900 dark:bg-slate-800 dark:border-slate-700 dark:text-white rounded-lg p-4 transition-colors duration-300">
        <div className="font-semibold text-lg mb-4">Recent Critical Alerts</div>
        <div className="space-y-4">
          {alertsData?.recent_critical_alerts?.length > 0 ? (
            alertsData.recent_critical_alerts.map((alert, index) => (
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
      </Card>
    </div>
  );
}; 