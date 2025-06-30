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
import { 
  ComputerDesktopIcon,
  ShieldExclamationIcon,
  ExclamationTriangleIcon,
  DocumentTextIcon,
  ChartBarIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

const StatCard = ({ title, value, change, icon: Icon, color, subtitle }) => (
  <div className="group relative overflow-hidden bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-400 text-sm font-medium">{title}</p>
        <p className="text-3xl font-bold text-white mt-1">{value}</p>
        {subtitle && <p className="text-sm text-gray-300 mt-1">{subtitle}</p>}
        {change && (
          <p className={`text-sm mt-2 ${change > 0 ? 'text-green-400' : 'text-red-400'}`}>
            {change > 0 ? '+' : ''}{change}% from yesterday
          </p>
        )}
      </div>
      <div className={`p-3 rounded-xl ${color} group-hover:scale-110 transition-transform duration-300`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
  </div>
);

const ActivityItem = ({ icon, title, description, time, severity }) => (
  <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
    <div className={`p-2 rounded-lg ${
      severity === 'high' ? 'bg-red-500/20 text-red-400' :
      severity === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
      'bg-blue-500/20 text-blue-400'
    }`}>
      {icon}
    </div>
    <div className="flex-1">
      <h4 className="text-white font-medium">{title}</h4>
      <p className="text-gray-400 text-sm">{description}</p>
    </div>
    <div className="text-xs text-gray-500">{time}</div>
  </div>
);

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

  useEffect(() => {
    fetchAllData();
    const interval = setInterval(fetchAllData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <div className="text-gray-400">Loading dashboard data...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-red-400 text-xl mb-2">⚠️ Error Loading Dashboard</div>
          <div className="text-gray-400 mb-4">{error}</div>
          <button 
            onClick={fetchAllData}
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
          <h1 className="text-3xl font-bold text-white">Security Dashboard</h1>
          <p className="text-gray-400 mt-1">Real-time monitoring and threat intelligence</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <ClockIcon className="w-4 h-4" />
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Active Endpoints"
          value={dashboardStats?.agents?.online || 0}
          subtitle={`${dashboardStats?.agents?.total || 0} total endpoints`}
          change={5.2}
          icon={ComputerDesktopIcon}
          color="bg-gradient-to-br from-green-500 to-emerald-600"
        />
        <StatCard
          title="Active Threats"
          value={dashboardStats?.threats?.active_indicators || 0}
          subtitle={`${dashboardStats?.threats?.detected_24h || 0} detected today`}
          change={-2.1}
          icon={ShieldExclamationIcon}
          color="bg-gradient-to-br from-red-500 to-pink-600"
        />
        <StatCard
          title="Open Alerts"
          value={dashboardStats?.alerts?.open || 0}
          subtitle={`${dashboardStats?.alerts?.critical || 0} critical alerts`}
          change={1.8}
          icon={ExclamationTriangleIcon}
          color="bg-gradient-to-br from-yellow-500 to-orange-600"
        />
        <StatCard
          title="Events Today"
          value={dashboardStats?.events?.last_24h?.toLocaleString() || 0}
          subtitle={`${dashboardStats?.events?.avg_per_hour || 0}/hour average`}
          change={12.5}
          icon={DocumentTextIcon}
          color="bg-gradient-to-br from-blue-500 to-purple-600"
        />
      </div>

      {/* Charts and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Threat Timeline Chart */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-white">Threat Detection Timeline</h3>
            <button className="text-blue-400 hover:text-blue-300 text-sm">View Details</button>
          </div>
          
          <div className="space-y-4">
            {eventsTimeline?.threat_timeline?.slice(0, 8).length > 0 ? (
              eventsTimeline.threat_timeline.slice(0, 8).map((item, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="text-xs text-gray-400 w-12">H{item.time_unit}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-300">Threats Detected</span>
                      <span className="text-sm font-medium text-white">{item.threat_count}</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-red-500 to-pink-500 h-2 rounded-full transition-all duration-1000" 
                        style={{
                          width: `${Math.min((item.threat_count / (Math.max(...eventsTimeline.threat_timeline.map(t => t.threat_count)) || 1)) * 100, 100)}%`
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-400 py-8">No threat data available</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};