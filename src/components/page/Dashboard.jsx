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
import axios from 'axios';

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

  // Fetch dashboard data from API
  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [statsRes, timelineRes, alertsRes, threatsRes] = await Promise.all([
        axios.get('http://192.168.20.85:5000/api/v1/dashboard/stats'),
        axios.get('http://192.168.20.85:5000/api/v1/dashboard/events-timeline'),
        axios.get('http://192.168.20.85:5000/api/v1/dashboard/alerts-overview'),
        axios.get('http://192.168.20.85:5000/api/v1/dashboard/threats-overview')
      ]);

      setStats(statsRes.data);
      setTimeline(timelineRes.data);
      setAlertsOverview(alertsRes.data);
      setThreatsOverview(threatsRes.data);
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-blue-200 rounded-full animate-spin"></div>
            <div className="w-20 h-20 border-4 border-blue-600 border-t-transparent rounded-full animate-spin absolute top-0"></div>
          </div>
          <h3 className="mt-6 text-xl font-semibold text-gray-700">Loading Dashboard</h3>
          <p className="mt-2 text-gray-500">Fetching latest security data...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !stats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50 to-pink-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <ExclamationTriangleIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-red-700 mb-2">Connection Error</h3>
          <p className="text-red-600 mb-6">{error}</p>
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Enhanced Header */}
      <div className="bg-white/80 backdrop-blur-lg shadow-lg border-b border-white/20 px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg">
                <ShieldCheckIcon className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Security Operations Center
                </h1>
                <p className="text-gray-600 text-sm">Real-time threat monitoring & response</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 ml-8">
              <select 
                value={selectedTimeframe}
                onChange={(e) => setSelectedTimeframe(e.target.value)}
                className="bg-white/50 border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
              >
                <option>Last 24 hours</option>
                <option>Last 7 days</option>
                <option>Last month</option>
                <option>Last year</option>
              </select>
              
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowPathIcon className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                <span className="text-sm font-medium">Refresh</span>
              </button>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <ClockIcon className="w-4 h-4" />
              <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-green-600">Live</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-8">
        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Agents */}
          <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 group">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <UserGroupIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Total Agents</h3>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-gray-900">{stats?.agents?.total || 0}</div>
                  <div className="flex items-center space-x-2">
                    <ArrowTrendingUpIcon className="w-4 h-4 text-green-500" />
                    <span className="text-sm font-medium text-green-600">+12% from last week</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Online Agents */}
          <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 group">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <CheckCircleIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Online Agents</h3>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-green-600">{stats?.agents?.online || 0}</div>
                  <div className="flex items-center space-x-2">
                    <div className="text-sm text-gray-500">
                      {stats?.agents?.total ? Math.round((stats.agents.online / stats.agents.total) * 100) : 0}% availability
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Critical Alerts */}
          <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 group">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-3 bg-gradient-to-r from-red-500 to-pink-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <ExclamationTriangleIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Critical Alerts</h3>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-red-600">{stats?.alerts?.critical || 0}</div>
                  <div className="flex items-center space-x-2">
                    <BellIcon className="w-4 h-4 text-red-500" />
                    <span className="text-sm font-medium text-red-600">{stats?.alerts?.open || 0} open alerts</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* System Health */}
          <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 group">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-3 bg-gradient-to-r from-purple-500 to-violet-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <HeartIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">System Health</h3>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-purple-600">{stats?.system_health?.score || 0}%</div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-violet-600 h-2 rounded-full transition-all duration-500"
                      style={{width: `${stats?.system_health?.score || 0}%`}}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-8">
          {/* Protection Status Chart */}
          <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">Agent Protection Status</h3>
              <div className="p-2 bg-blue-100 rounded-lg">
                <ShieldCheckIcon className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <div className="relative h-80">
              {protectionStatusData && (
                <>
                  <Doughnut data={protectionStatusData} options={chartOptions} />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-gray-900">{stats?.agents?.total || 0}</div>
                      <div className="text-sm text-gray-600 font-medium">Total Agents</div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Threat Timeline */}
          <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">Security Events Timeline</h3>
              <div className="p-2 bg-red-100 rounded-lg">
                <ChartBarIcon className="w-5 h-5 text-red-600" />
              </div>
            </div>
            <div className="h-80">
              {threatTrendData ? (
                <Line data={threatTrendData} options={lineChartOptions} />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <div className="text-center">
                    <ChartBarIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No timeline data available</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Alerts by Severity */}
          <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">Alerts by Severity</h3>
              <div className="p-2 bg-orange-100 rounded-lg">
                <ExclamationTriangleIcon className="w-5 h-5 text-orange-600" />
              </div>
            </div>
            <div className="h-80">
              {alertsBarData ? (
                <Bar data={alertsBarData} options={barChartOptions} />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <div className="text-center">
                    <ExclamationTriangleIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No alert data available</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Recent Critical Alerts */}
          <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">Recent Critical Alerts</h3>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-red-600">Live</span>
              </div>
            </div>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {alertsOverview?.recent_critical_alerts?.length ? 
                alertsOverview.recent_critical_alerts.slice(0, 5).map((alert, index) => (
                  <div key={alert.alert_id || index} className="p-4 bg-gradient-to-r from-red-50 to-pink-50 rounded-xl border border-red-100 hover:shadow-md transition-all duration-200">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <div className="p-2 bg-red-500 rounded-lg">
                          <ExclamationTriangleIcon className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 text-sm">{alert.title}</h4>
                          <p className="text-xs text-gray-600 mt-1">Agent: {alert.agent_id}</p>
                          <div className="flex items-center space-x-2 mt-2">
                            <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                              {alert.severity}
                            </span>
                            <span className="text-xs text-gray-500">
                              {new Date(alert.first_detected).toLocaleTimeString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )) : 
                <div className="text-center py-8 text-gray-500">
                  <CheckCircleIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No critical alerts at this time</p>
                </div>
              }
            </div>
          </div>

          {/* Recent Threat Detections */}
          <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">Recent Threat Detections</h3>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-orange-600">Active</span>
              </div>
            </div>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {threatsOverview?.recent_detections?.length ? 
                threatsOverview.recent_detections.slice(0, 5).map((threat, index) => (
                  <div key={threat.threat_id || index} className="p-4 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl border border-orange-100 hover:shadow-md transition-all duration-200">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <div className="p-2 bg-orange-500 rounded-lg">
                          <FireIcon className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 text-sm">{threat.threat_name}</h4>
                          <p className="text-xs text-gray-600 mt-1">Category: {threat.threat_category}</p>
                          <div className="flex items-center space-x-2 mt-2">
                            <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                              {threat.detection_count} detections
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )) : 
                <div className="text-center py-8 text-gray-500">
                  <ShieldCheckIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No recent threat detections</p>
                </div>
              }
            </div>
          </div>
        </div>

        {/* System Status Footer */}
        <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20">
          <h3 className="text-lg font-bold text-gray-900 mb-6">System Overview</h3>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-6">
            <div className="text-center">
              <div className="p-4 bg-blue-50 rounded-xl mb-3">
                <UserGroupIcon className="w-8 h-8 text-blue-600 mx-auto" />
              </div>
              <div className="text-2xl font-bold text-blue-600">{stats?.agents?.total || 0}</div>
              <div className="text-xs text-gray-600 font-medium">Total Agents</div>
            </div>
            
            <div className="text-center">
              <div className="p-4 bg-green-50 rounded-xl mb-3">
                <CheckCircleIcon className="w-8 h-8 text-green-600 mx-auto" />
              </div>
              <div className="text-2xl font-bold text-green-600">{stats?.agents?.online || 0}</div>
              <div className="text-xs text-gray-600 font-medium">Online</div>
            </div>
            
            <div className="text-center">
              <div className="p-4 bg-red-50 rounded-xl mb-3">
                <XCircleIcon className="w-8 h-8 text-red-600 mx-auto" />
              </div>
              <div className="text-2xl font-bold text-red-600">{stats?.alerts?.open || 0}</div>
              <div className="text-xs text-gray-600 font-medium">Open Alerts</div>
            </div>
            
            <div className="text-center">
              <div className="p-4 bg-yellow-50 rounded-xl mb-3">
                <BoltIcon className="w-8 h-8 text-yellow-600 mx-auto" />
              </div>
              <div className="text-2xl font-bold text-yellow-600">{stats?.detection?.active_rules || 0}</div>
              <div className="text-xs text-gray-600 font-medium">Active Rules</div>
            </div>
            
            <div className="text-center">
              <div className="p-4 bg-purple-50 rounded-xl mb-3">
                <ShieldCheckIcon className="w-8 h-8 text-purple-600 mx-auto" />
              </div>
              <div className="text-2xl font-bold text-purple-600">{stats?.threats?.active_indicators || 0}</div>
              <div className="text-xs text-gray-600 font-medium">Threat Indicators</div>
            </div>
            
            <div className="text-center">
              <div className="p-4 bg-pink-50 rounded-xl mb-3">
                <HeartIcon className="w-8 h-8 text-pink-600 mx-auto" />
              </div>
              <div className="text-2xl font-bold text-pink-600">{stats?.system_health?.score || 0}%</div>
              <div className="text-xs text-gray-600 font-medium">Health Score</div>
            </div>
          </div>
        </div>

        {/* Alert Banner for Offline Agents */}
        {stats?.agents?.offline > 0 && (
          <div className="mt-6 bg-gradient-to-r from-red-50 to-pink-50 border-l-4 border-red-400 p-6 rounded-xl shadow-lg">
            <div className="flex items-center">
              <div className="p-2 bg-red-500 rounded-lg mr-4">
                <ExclamationTriangleIcon className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-red-800">
                  System Alert: Offline Agents Detected
                </h4>
                <p className="text-red-700 mt-1">
                  <strong>{stats.agents.offline}</strong> computers are currently offline and not being managed by the EDR System. 
                  Immediate attention may be required to ensure full security coverage.
                </p>
              </div>
              <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium">
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