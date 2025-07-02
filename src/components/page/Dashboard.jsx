import React, { useEffect, useState } from 'react';
import { 
  UserGroupIcon, 
  ExclamationTriangleIcon, 
  ShieldCheckIcon, 
  ChartBarIcon, 
  BoltIcon, 
  HeartIcon,
  ComputerDesktopIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  EyeIcon,
  CpuChipIcon,
  ServerIcon,
  BellIcon,
  ArrowPathIcon,
  CalendarIcon,
  FunnelIcon,
  SparklesIcon,
  FireIcon,
  WifiIcon
} from '@heroicons/react/24/outline';
import { Doughnut, Line, Bar } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement } from 'chart.js';
import { 
  fetchDashboardStats, 
  fetchAlerts, 
  fetchThreats, 
  fetchEvents 
} from '../../service/api';
import { useNavigate } from 'react-router-dom';

Chart.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [timeline, setTimeline] = useState(null);
  const [alertsOverview, setAlertsOverview] = useState(null);
  const [threatsOverview, setThreatsOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState('Last 7 days');
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const navigate = useNavigate();

  // Fetch dashboard data from API
  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [statsData, eventsData, alertsData, threatsData] = await Promise.all([
        fetchDashboardStats(),
        fetchEvents(),
        fetchAlerts(),
        fetchThreats()
      ]);
      setStats(statsData);
      setTimeline(eventsData);
      setAlertsOverview(alertsData);
      setThreatsOverview(threatsData);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Cannot load dashboard data. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    
    // Auto refresh every 30 seconds
    const interval = setInterval(() => {
      fetchDashboardData();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Manual refresh function
  const handleRefresh = () => {
    fetchDashboardData();
  };

  // Chart configurations
  const protectionStatusData = stats ? {
    labels: ['Online', 'Offline', 'Error', 'Updating', 'Inactive'],
    datasets: [{
      data: [
        stats.agents?.online || 0,
        stats.agents?.offline || 0,
        stats.agents?.error || 0,
        stats.agents?.updating || 0,
        stats.agents?.inactive || 0
      ],
      backgroundColor: [
        '#10b981', // Emerald-500 - Online
        '#ef4444', // Red-500 - Offline
        '#f59e0b', // Amber-500 - Error
        '#3b82f6', // Blue-500 - Updating
        '#6b7280'  // Gray-500 - Inactive
      ],
      borderWidth: 0,
      cutout: '70%'
    }]
  } : null;

  const threatTrendData = timeline ? {
    labels: timeline.labels || [],
    datasets: [
      {
        label: 'Threats Detected',
        data: timeline.threats || [],
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#ef4444',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 6
      },
      {
        label: 'Events',
        data: timeline.events || [],
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#3b82f6',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 6
      }
    ]
  } : null;

  const alertsBarData = stats ? {
    labels: ['Critical', 'High', 'Medium', 'Low'],
    datasets: [{
      label: 'Alerts by Severity',
      data: [
        stats.alerts?.critical || 0,
        stats.alerts?.high || 0,
        stats.alerts?.medium || 0,
        stats.alerts?.low || 0
      ],
      backgroundColor: [
        '#dc2626', // Red-600
        '#ea580c', // Orange-600
        '#ca8a04', // Yellow-600
        '#16a34a'  // Green-600
      ],
      borderRadius: 8,
      borderSkipped: false,
    }]
  } : null;

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          pointStyle: 'rect',
          padding: 20,
          font: { size: 12, weight: '500' },
          color: '#374151'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.95)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#4b5563',
        borderWidth: 1,
        cornerRadius: 12,
        displayColors: true,
        padding: 12
      }
    }
  };

  const lineChartOptions = {
    ...chartOptions,
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#6b7280', font: { size: 11 } }
      },
      y: {
        grid: { color: '#f3f4f6' },
        ticks: { color: '#6b7280', font: { size: 11 } }
      }
    },
    elements: {
      point: { hoverRadius: 8 }
    }
  };

  const barChartOptions = {
    ...chartOptions,
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#6b7280', font: { size: 11 } }
      },
      y: {
        grid: { color: '#f3f4f6' },
        ticks: { color: '#6b7280', font: { size: 11 } },
        beginAtZero: true
      }
    }
  };

  // Loading state
  if (loading && !stats) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-blue-200 rounded-full animate-spin"></div>
            <div className="w-20 h-20 border-4 border-blue-600 border-t-transparent rounded-full animate-spin absolute top-0"></div>
          </div>
          <h3 className="mt-6 text-xl font-semibold text-gray-100">Loading Dashboard</h3>
          <p className="mt-2 text-gray-400">Fetching latest security data...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !stats) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-red-900 to-pink-900">
        <div className="text-center max-w-md mx-auto p-8">
          <ExclamationTriangleIcon className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-red-200 mb-2">Connection Error</h3>
          <p className="text-red-300 mb-6">{error}</p>
          <button
            onClick={handleRefresh}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white">
      {/* Header */}
      <div className="px-8 py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-white/10 bg-white/10 backdrop-blur-xl shadow-lg sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <ShieldCheckIcon className="w-10 h-10 text-blue-400 drop-shadow-lg" />
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent tracking-tight">EDR Security Dashboard</h1>
            <p className="text-gray-300 text-sm mt-1">Realtime threat monitoring & response</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50 shadow-lg"
          >
            <ArrowPathIcon className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <div className="flex items-center gap-2 text-sm text-gray-200">
            <ClockIcon className="w-4 h-4" />
            <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
          </div>
        </div>
      </div>

      <div className="p-8">
        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Agents */}
          <div className="bg-gradient-to-br from-blue-700 to-blue-900 rounded-2xl shadow-2xl p-6 flex flex-col gap-2 hover:scale-[1.03] transition-transform duration-300 border border-white/10">
            <div className="flex items-center gap-3 mb-2">
              <UserGroupIcon className="w-8 h-8 text-blue-300" />
              <span className="text-lg font-semibold text-blue-100">Total Agents</span>
            </div>
            <div className="text-4xl font-bold text-white drop-shadow-lg">{stats?.agents?.total || 0}</div>
          </div>

          {/* Online Agents */}
          <div className="bg-gradient-to-br from-green-700 to-emerald-900 rounded-2xl shadow-2xl p-6 flex flex-col gap-2 hover:scale-[1.03] transition-transform duration-300 border border-white/10">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircleIcon className="w-8 h-8 text-green-300" />
              <span className="text-lg font-semibold text-green-100">Online</span>
            </div>
            <div className="text-4xl font-bold text-white drop-shadow-lg">{stats?.agents?.online || 0}</div>
          </div>

          {/* Critical Alerts */}
          <div className="bg-gradient-to-br from-red-700 to-pink-900 rounded-2xl shadow-2xl p-6 flex flex-col gap-2 hover:scale-[1.03] transition-transform duration-300 border border-white/10">
            <div className="flex items-center gap-3 mb-2">
              <ExclamationTriangleIcon className="w-8 h-8 text-red-300" />
              <span className="text-lg font-semibold text-red-100">Critical Alerts</span>
            </div>
            <div className="text-4xl font-bold text-white drop-shadow-lg">{stats?.alerts?.critical || 0}</div>
          </div>

          {/* System Health */}
          <div className="bg-gradient-to-br from-purple-700 to-violet-900 rounded-2xl shadow-2xl p-6 flex flex-col gap-2 hover:scale-[1.03] transition-transform duration-300 border border-white/10">
            <div className="flex items-center gap-3 mb-2">
              <HeartIcon className="w-8 h-8 text-pink-200" />
              <span className="text-lg font-semibold text-pink-100">System Health</span>
            </div>
            <div className="text-4xl font-bold text-white drop-shadow-lg">{stats?.system_health?.score || 0}%</div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-8">
          {/* Protection Status Chart */}
          <div className="bg-white/10 rounded-2xl shadow-xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Agent Protection Status</h3>
              <ShieldCheckIcon className="w-6 h-6 text-blue-400" />
            </div>
            <div className="relative h-72">
              {protectionStatusData && (
                <>
                  <Doughnut data={protectionStatusData} options={chartOptions} />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-white">{stats?.agents?.total || 0}</div>
                      <div className="text-sm text-gray-200 font-medium">Total Agents</div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Threat Timeline */}
          <div className="bg-white/10 rounded-2xl shadow-xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Security Events Timeline</h3>
              <ChartBarIcon className="w-6 h-6 text-red-400" />
            </div>
            <div className="h-72">
              {threatTrendData ? (
                <Line data={threatTrendData} options={lineChartOptions} />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  <ChartBarIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No timeline data available</p>
                </div>
              )}
            </div>
          </div>

          {/* Alerts by Severity */}
          <div className="bg-white/10 rounded-2xl shadow-xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Alerts by Severity</h3>
              <ExclamationTriangleIcon className="w-6 h-6 text-orange-400" />
            </div>
            <div className="h-72">
              {alertsBarData ? (
                <Bar data={alertsBarData} options={barChartOptions} />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  <ExclamationTriangleIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No alert data available</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Recent Critical Alerts */}
          <div className="bg-white/10 rounded-2xl shadow-xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Recent Critical Alerts</h3>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-medium text-red-300">Live</span>
              </div>
            </div>
            <div className="space-y-3 max-h-72 overflow-y-auto">
              {alertsOverview?.recent_critical_alerts?.length ? 
                alertsOverview.recent_critical_alerts.slice(0, 5).map((alert, index) => (
                  <div key={alert.alert_id || index} className="p-4 bg-gradient-to-r from-red-900/60 to-pink-900/40 rounded-xl border border-red-900/30 hover:shadow-md transition-all duration-200">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-red-600 rounded-lg">
                        <ExclamationTriangleIcon className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-white text-sm">{alert.title}</h4>
                        <p className="text-xs text-gray-300 mt-1">Agent: {alert.agent_id}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="px-2 py-1 bg-red-800/60 text-red-200 rounded-full text-xs font-medium">
                            {alert.severity}
                          </span>
                          <span className="text-xs text-gray-400">
                            {new Date(alert.first_detected).toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )) : 
                <div className="text-center py-8 text-gray-400">
                  <CheckCircleIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No critical alerts at this time</p>
                </div>
              }
            </div>
          </div>

          {/* Recent Threat Detections */}
          <div className="bg-white/10 rounded-2xl shadow-xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Recent Threat Detections</h3>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-medium text-orange-200">Active</span>
              </div>
            </div>
            <div className="space-y-3 max-h-72 overflow-y-auto">
              {threatsOverview?.recent_detections?.length ? 
                threatsOverview.recent_detections.slice(0, 5).map((threat, index) => (
                  <div key={threat.threat_id || index} className="p-4 bg-gradient-to-r from-orange-900/60 to-yellow-900/40 rounded-xl border border-orange-900/30 hover:shadow-md transition-all duration-200">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-orange-600 rounded-lg">
                        <FireIcon className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-white text-sm">{threat.threat_name}</h4>
                        <p className="text-xs text-gray-300 mt-1">Category: {threat.threat_category}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="px-2 py-1 bg-orange-800/60 text-orange-200 rounded-full text-xs font-medium">
                            {threat.detection_count} detections
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )) : 
                <div className="text-center py-8 text-gray-400">
                  <ShieldCheckIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No recent threat detections</p>
                </div>
              }
            </div>
          </div>
        </div>

        {/* System Status Footer */}
        <div className="px-8 pb-8">
          <div className="bg-white/10 rounded-2xl shadow-xl p-6 border border-white/10 grid grid-cols-2 md:grid-cols-6 gap-6">
            <div className="text-center">
              <div className="p-4 bg-blue-900/60 rounded-xl mb-3">
                <UserGroupIcon className="w-8 h-8 text-blue-400 mx-auto" />
              </div>
              <div className="text-2xl font-bold text-blue-200">{stats?.agents?.total || 0}</div>
              <div className="text-xs text-gray-300 font-medium">Total Agents</div>
            </div>
            
            <div className="text-center">
              <div className="p-4 bg-green-900/60 rounded-xl mb-3">
                <CheckCircleIcon className="w-8 h-8 text-green-400 mx-auto" />
              </div>
              <div className="text-2xl font-bold text-green-200">{stats?.agents?.online || 0}</div>
              <div className="text-xs text-gray-300 font-medium">Online</div>
            </div>
            
            <div className="text-center">
              <div className="p-4 bg-red-900/60 rounded-xl mb-3">
                <XCircleIcon className="w-8 h-8 text-red-400 mx-auto" />
              </div>
              <div className="text-2xl font-bold text-red-200">{stats?.alerts?.open || 0}</div>
              <div className="text-xs text-gray-300 font-medium">Open Alerts</div>
            </div>
            
            <div className="text-center">
              <div className="p-4 bg-yellow-900/60 rounded-xl mb-3">
                <BoltIcon className="w-8 h-8 text-yellow-400 mx-auto" />
              </div>
              <div className="text-2xl font-bold text-yellow-200">{stats?.detection?.active_rules || 0}</div>
              <div className="text-xs text-gray-300 font-medium">Active Rules</div>
            </div>
            
            <div className="text-center">
              <div className="p-4 bg-purple-900/60 rounded-xl mb-3">
                <ShieldCheckIcon className="w-8 h-8 text-purple-400 mx-auto" />
              </div>
              <div className="text-2xl font-bold text-purple-200">{stats?.threats?.active_indicators || 0}</div>
              <div className="text-xs text-gray-300 font-medium">Threat Indicators</div>
            </div>
            
            <div className="text-center">
              <div className="p-4 bg-pink-900/60 rounded-xl mb-3">
                <HeartIcon className="w-8 h-8 text-pink-400 mx-auto" />
              </div>
              <div className="text-2xl font-bold text-pink-200">{stats?.system_health?.score || 0}%</div>
              <div className="text-xs text-gray-300 font-medium">Health Score</div>
            </div>
          </div>
        </div>

        {/* Alert Banner for Offline Agents */}
        {stats?.agents?.offline > 0 && (
          <div className="mx-8 mt-6 bg-gradient-to-r from-red-900/60 to-pink-900/40 border-l-4 border-red-600 p-6 rounded-xl shadow-lg">
            <div className="flex items-center">
              <div className="p-2 bg-red-600 rounded-lg mr-4">
                <ExclamationTriangleIcon className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-red-200">
                  System Alert: Offline Agents Detected
                </h4>
                <p className="text-red-300 mt-1">
                  <strong>{stats.agents.offline}</strong> computers are currently offline and not being managed by the EDR System. 
                  Immediate attention may be required to ensure full security coverage.
                </p>
              </div>
              <button
                className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium"
                onClick={() => navigate('/agents?status=offline')}
              >
                View Details
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;