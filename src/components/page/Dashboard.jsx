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
import { Doughnut, Line, Bar, Pie } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement } from 'chart.js';
import { 
  fetchDashboardStats, 
  fetchAlerts, 
  fetchThreats, 
  fetchEventsTimeline 
} from '../../service/api';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';

Chart.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement);

const Dashboard = () => {
  const { isDarkMode, isTransitioning } = useTheme();
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
        fetchEventsTimeline(),
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

  // Chart configurations with theme support
  const getChartTheme = () => ({
    backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
    textColor: isDarkMode ? '#f1f5f9' : '#374151',
    gridColor: isDarkMode ? '#374151' : '#f3f4f6',
    tooltipBg: isDarkMode ? 'rgba(30, 41, 59, 0.95)' : 'rgba(255, 255, 255, 0.95)',
    tooltipBorder: isDarkMode ? '#4b5563' : '#e5e7eb'
  });

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
        backgroundColor: isDarkMode ? 'rgba(239, 68, 68, 0.2)' : 'rgba(239, 68, 68, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#ef4444',
        pointBorderColor: isDarkMode ? '#1e293b' : '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 6
      },
      {
        label: 'Events',
        data: timeline.events || [],
        borderColor: '#3b82f6',
        backgroundColor: isDarkMode ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#3b82f6',
        pointBorderColor: isDarkMode ? '#1e293b' : '#ffffff',
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

  // Event Type Breakdown
  const eventTypeCounts = timeline?.events_by_type;
  const eventTypeChartData = eventTypeCounts ? {
    labels: Object.keys(eventTypeCounts),
    datasets: [{
      data: Object.values(eventTypeCounts),
      backgroundColor: [
        '#3b82f6', // Process
        '#10b981', // File
        '#f59e0b', // Network
        '#a21caf', // Registry
        '#f43f5e', // Authentication
        '#6366f1', // System
      ],
      borderWidth: 0,
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
          color: getChartTheme().textColor
        }
      },
      tooltip: {
        backgroundColor: getChartTheme().tooltipBg,
        titleColor: getChartTheme().textColor,
        bodyColor: getChartTheme().textColor,
        borderColor: getChartTheme().tooltipBorder,
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
        grid: { 
          display: false 
        },
        ticks: { 
          color: getChartTheme().textColor, 
          font: { size: 11 } 
        }
      },
      y: {
        grid: { 
          color: getChartTheme().gridColor 
        },
        ticks: { 
          color: getChartTheme().textColor, 
          font: { size: 11 } 
        }
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
        ticks: { 
          color: getChartTheme().textColor, 
          font: { size: 11 } 
        }
      },
      y: {
        grid: { 
          color: getChartTheme().gridColor 
        },
        ticks: { 
          color: getChartTheme().textColor, 
          font: { size: 11 } 
        },
        beginAtZero: true
      }
    }
  };

  // Loading state
  if (loading && !stats) {
    return (
      <div className={`
        min-h-screen flex items-center justify-center transition-all duration-300
        ${isDarkMode 
          ? 'bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900' 
          : 'bg-gradient-to-br from-blue-50 via-white to-indigo-50'
        }
        ${isTransitioning ? 'theme-transitioning' : ''}
      `}>
        <div className="text-center">
          <div className="relative">
            <div className={`
              w-20 h-20 border-4 rounded-full animate-spin
              ${isDarkMode ? 'border-blue-200' : 'border-blue-300'}
            `}></div>
            <div className={`
              w-20 h-20 border-4 border-t-transparent rounded-full animate-spin absolute top-0
              ${isDarkMode ? 'border-blue-600' : 'border-blue-600'}
            `}></div>
          </div>
          <h3 className={`
            mt-6 text-xl font-semibold transition-colors duration-300
            ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}
          `}>
            Loading Dashboard
          </h3>
          <p className={`
            mt-2 transition-colors duration-300
            ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}
          `}>
            Fetching latest security data...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !stats) {
    return (
      <div className={`
        min-h-screen flex items-center justify-center transition-all duration-300
        ${isDarkMode 
          ? 'bg-gradient-to-br from-slate-900 via-red-900 to-pink-900' 
          : 'bg-gradient-to-br from-red-50 via-white to-pink-50'
        }
        ${isTransitioning ? 'theme-transitioning' : ''}
      `}>
        <div className="text-center max-w-md mx-auto p-8">
          <ExclamationTriangleIcon className={`
            w-16 h-16 mx-auto mb-4 transition-colors duration-300
            ${isDarkMode ? 'text-red-400' : 'text-red-500'}
          `} />
          <h3 className={`
            text-xl font-semibold mb-2 transition-colors duration-300
            ${isDarkMode ? 'text-red-200' : 'text-red-800'}
          `}>
            Connection Error
          </h3>
          <p className={`
            mb-6 transition-colors duration-300
            ${isDarkMode ? 'text-red-300' : 'text-red-600'}
          `}>
            {error}
          </p>
          <button
            onClick={handleRefresh}
            className={`
              px-6 py-3 rounded-lg font-medium transition-all duration-200
              ${isDarkMode 
                ? 'bg-red-600 text-white hover:bg-red-700' 
                : 'bg-red-600 text-white hover:bg-red-700'
              }
            `}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`
      min-h-screen transition-all duration-300
      ${isDarkMode 
        ? 'bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white' 
        : 'bg-gradient-to-br from-blue-50 via-white to-indigo-50 text-gray-900'
      }
      ${isTransitioning ? 'theme-transitioning' : ''}
    `}>
      {/* Header */}
      <div className={`
        px-8 py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 
        border-b shadow-lg sticky top-0 z-20 backdrop-blur-xl transition-all duration-300
        ${isDarkMode 
          ? 'border-white/10 bg-white/10' 
          : 'border-gray-200/50 bg-white/80'
        }
      `}>
        <div className="flex items-center gap-4">
          <ShieldCheckIcon className={`
            w-10 h-10 drop-shadow-lg transition-colors duration-300
            ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}
          `} />
          <div>
            <h1 className={`
              text-3xl font-bold tracking-tight transition-colors duration-300
              ${isDarkMode 
                ? 'bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent' 
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent'
              }
            `}>
              EDR Security Dashboard
            </h1>
            <p className={`
              text-sm mt-1 transition-colors duration-300
              ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}
            `}>
              Realtime threat monitoring & response
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={handleRefresh}
            disabled={loading}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg font-medium disabled:opacity-50 shadow-lg
              transition-all duration-200 hover:scale-105
              ${isDarkMode 
                ? 'bg-blue-600 text-white hover:bg-blue-700' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
              }
            `}
          >
            <ArrowPathIcon className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <div className={`
            flex items-center gap-2 text-sm transition-colors duration-300
            ${isDarkMode ? 'text-gray-200' : 'text-gray-600'}
          `}>
            <ClockIcon className="w-4 h-4" />
            <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
          </div>
        </div>
      </div>

      <div className="p-8">
        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Agents */}
          <div className={`
            rounded-2xl shadow-2xl p-6 flex flex-col gap-2 hover:scale-[1.03] 
            transition-all duration-300 border
            ${isDarkMode 
              ? 'bg-gradient-to-br from-blue-700 to-blue-900 border-white/10' 
              : 'bg-gradient-to-br from-blue-500 to-blue-700 border-blue-200'
            }
          `}>
            <div className="flex items-center gap-3 mb-2">
              <UserGroupIcon className={`
                w-8 h-8 transition-colors duration-300
                ${isDarkMode ? 'text-blue-300' : 'text-blue-100'}
              `} />
              <span className={`
                text-lg font-semibold transition-colors duration-300
                ${isDarkMode ? 'text-blue-100' : 'text-blue-100'}
              `}>
                Total Agents
              </span>
            </div>
            <div className="text-4xl font-bold text-white drop-shadow-lg">
              {stats?.agents?.total || 0}
            </div>
          </div>

          {/* Online Agents */}
          <div className={`
            rounded-2xl shadow-2xl p-6 flex flex-col gap-2 hover:scale-[1.03] 
            transition-all duration-300 border
            ${isDarkMode 
              ? 'bg-gradient-to-br from-green-700 to-emerald-900 border-white/10' 
              : 'bg-gradient-to-br from-green-500 to-emerald-700 border-green-200'
            }
          `}>
            <div className="flex items-center gap-3 mb-2">
              <CheckCircleIcon className={`
                w-8 h-8 transition-colors duration-300
                ${isDarkMode ? 'text-green-300' : 'text-green-100'}
              `} />
              <span className={`
                text-lg font-semibold transition-colors duration-300
                ${isDarkMode ? 'text-green-100' : 'text-green-100'}
              `}>
                Online
              </span>
            </div>
            <div className="text-4xl font-bold text-white drop-shadow-lg">
              {stats?.agents?.online || 0}
            </div>
          </div>

          {/* Critical Alerts */}
          <div className={`
            rounded-2xl shadow-2xl p-6 flex flex-col gap-2 hover:scale-[1.03] 
            transition-all duration-300 border
            ${isDarkMode 
              ? 'bg-gradient-to-br from-red-700 to-pink-900 border-white/10' 
              : 'bg-gradient-to-br from-red-500 to-pink-700 border-red-200'
            }
          `}>
            <div className="flex items-center gap-3 mb-2">
              <ExclamationTriangleIcon className={`
                w-8 h-8 transition-colors duration-300
                ${isDarkMode ? 'text-red-300' : 'text-red-100'}
              `} />
              <span className={`
                text-lg font-semibold transition-colors duration-300
                ${isDarkMode ? 'text-red-100' : 'text-red-100'}
              `}>
                Critical Alerts
              </span>
            </div>
            <div className="text-4xl font-bold text-white drop-shadow-lg">
              {stats?.alerts?.critical || 0}
            </div>
          </div>

          {/* System Health */}
          <div className={`
            rounded-2xl shadow-2xl p-6 flex flex-col gap-2 hover:scale-[1.03] 
            transition-all duration-300 border
            ${isDarkMode 
              ? 'bg-gradient-to-br from-purple-700 to-violet-900 border-white/10' 
              : 'bg-gradient-to-br from-purple-500 to-violet-700 border-purple-200'
            }
          `}>
            <div className="flex items-center gap-3 mb-2">
              <HeartIcon className={`
                w-8 h-8 transition-colors duration-300
                ${isDarkMode ? 'text-pink-200' : 'text-pink-100'}
              `} />
              <span className={`
                text-lg font-semibold transition-colors duration-300
                ${isDarkMode ? 'text-pink-100' : 'text-pink-100'}
              `}>
                System Health
              </span>
            </div>
            <div className="text-4xl font-bold text-white drop-shadow-lg">
              {stats?.system_health?.score || 0}%
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-8">
          {/* Protection Status Chart */}
          <div className={`
            rounded-2xl shadow-xl p-6 border transition-all duration-300
            ${isDarkMode 
              ? 'bg-white/10 border-white/10' 
              : 'bg-white/80 border-white/20'
            }
          `}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`
                text-lg font-bold transition-colors duration-300
                ${isDarkMode ? 'text-white' : 'text-gray-900'}
              `}>
                Agent Protection Status
              </h3>
              <ShieldCheckIcon className={`
                w-6 h-6 transition-colors duration-300
                ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}
              `} />
            </div>
            <div className="relative h-72">
              {protectionStatusData && (
                <>
                  <Doughnut data={protectionStatusData} options={chartOptions} />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="text-center">
                      <div className={`
                        text-3xl font-bold transition-colors duration-300
                        ${isDarkMode ? 'text-white' : 'text-gray-900'}
                      `}>
                        {stats?.agents?.total || 0}
                      </div>
                      <div className={`
                        text-sm font-medium transition-colors duration-300
                        ${isDarkMode ? 'text-gray-200' : 'text-gray-600'}
                      `}>
                        Total Agents
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Threat Timeline */}
          <div className={`
            rounded-2xl shadow-xl p-6 border transition-all duration-300
            ${isDarkMode 
              ? 'bg-white/10 border-white/10' 
              : 'bg-white/80 border-white/20'
            }
          `}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`
                text-lg font-bold transition-colors duration-300
                ${isDarkMode ? 'text-white' : 'text-gray-900'}
              `}>
                Security Events Timeline
              </h3>
              <ChartBarIcon className={`
                w-6 h-6 transition-colors duration-300
                ${isDarkMode ? 'text-red-400' : 'text-red-600'}
              `} />
            </div>
            <div className="h-72">
              {threatTrendData ? (
                <Line data={threatTrendData} options={lineChartOptions} />
              ) : (
                <div className={`
                  flex flex-col items-center justify-center h-full transition-colors duration-300
                  ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}
                `}>
                  <ChartBarIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No timeline data available</p>
                </div>
              )}
            </div>
          </div>

          {/* Alerts by Severity */}
          <div className={`
            rounded-2xl shadow-xl p-6 border transition-all duration-300
            ${isDarkMode 
              ? 'bg-white/10 border-white/10' 
              : 'bg-white/80 border-white/20'
            }
          `}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`
                text-lg font-bold transition-colors duration-300
                ${isDarkMode ? 'text-white' : 'text-gray-900'}
              `}>
                Alerts by Severity
              </h3>
              <ExclamationTriangleIcon className={`
                w-6 h-6 transition-colors duration-300
                ${isDarkMode ? 'text-orange-400' : 'text-orange-600'}
              `} />
            </div>
            <div className="h-72">
              {alertsBarData ? (
                <Bar data={alertsBarData} options={barChartOptions} />
              ) : (
                <div className={`
                  flex flex-col items-center justify-center h-full transition-colors duration-300
                  ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}
                `}>
                  <ExclamationTriangleIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No alert data available</p>
                </div>
              )}
            </div>
          </div>

          {/* Events by Type Breakdown */}
          <div className={`
            rounded-2xl shadow-xl p-6 border transition-all duration-300
            ${isDarkMode 
              ? 'bg-white/10 border-white/10' 
              : 'bg-white/80 border-white/20'
            }
          `}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`
                text-lg font-bold transition-colors duration-300
                ${isDarkMode ? 'text-white' : 'text-gray-900'}
              `}>
                Events by Type
              </h3>
              <ChartBarIcon className={`
                w-6 h-6 transition-colors duration-300
                ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}
              `} />
            </div>
            <div className="relative h-72">
              {eventTypeChartData ? (
                <Doughnut data={eventTypeChartData} options={chartOptions} />
              ) : (
                <div className={`
                  flex flex-col items-center justify-center h-full transition-colors duration-300
                  ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}
                `}>
                  <ChartBarIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No event type data available</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Recent Critical Alerts */}
          {alertsOverview?.recent_critical_alerts?.length > 0 && (
            <div className={`
              rounded-2xl shadow-2xl p-6 border transition-all duration-300
              ${isDarkMode 
                ? 'bg-gradient-to-br from-red-700/80 to-pink-900/80 border-red-700/30' 
                : 'bg-gradient-to-br from-red-50/80 to-pink-50/80 border-red-200/50'
              }
            `}>
              <div className="flex items-center justify-between mb-4">
                <h3 className={`
                  text-lg font-bold tracking-tight flex items-center gap-2 transition-colors duration-300
                  ${isDarkMode ? 'text-white' : 'text-red-900'}
                `}>
                  <ExclamationTriangleIcon className={`
                    w-7 h-7 transition-colors duration-300
                    ${isDarkMode ? 'text-red-300' : 'text-red-600'}
                  `} />
                  Recent Critical Alerts
                </h3>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <span className={`
                    text-xs font-medium transition-colors duration-300
                    ${isDarkMode ? 'text-red-200' : 'text-red-700'}
                  `}>
                    Live
                  </span>
                </div>
              </div>
              <div className="space-y-3 max-h-72 overflow-y-auto">
                {alertsOverview.recent_critical_alerts.slice(0, 5).map((alert, index) => (
                  <div key={alert.alert_id || index} className={`
                    p-4 rounded-xl border transition-all duration-200 hover:shadow-md
                    ${isDarkMode 
                      ? 'bg-gradient-to-r from-red-900/60 to-pink-900/40 border-red-900/30' 
                      : 'bg-gradient-to-r from-red-100/60 to-pink-100/40 border-red-200/50'
                    }
                  `}>
                    <div className="flex items-start gap-3">
                      <div className={`
                        p-2 rounded-lg transition-colors duration-300
                        ${isDarkMode ? 'bg-red-600' : 'bg-red-500'}
                      `}>
                        <ExclamationTriangleIcon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className={`
                          font-semibold text-base transition-colors duration-300
                          ${isDarkMode ? 'text-white' : 'text-red-900'}
                        `}>
                          {alert.title}
                        </h4>
                        <p className={`
                          text-xs mt-1 transition-colors duration-300
                          ${isDarkMode ? 'text-gray-300' : 'text-red-700'}
                        `}>
                          Agent: {alert.agent_id}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className={`
                            px-2 py-1 rounded-full text-xs font-medium transition-colors duration-300
                            ${isDarkMode ? 'bg-red-800/60 text-red-200' : 'bg-red-200 text-red-800'}
                          `}>
                            {alert.severity}
                          </span>
                          <span className={`
                            text-xs transition-colors duration-300
                            ${isDarkMode ? 'text-gray-400' : 'text-red-600'}
                          `}>
                            {new Date(alert.first_detected).toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent Threat Detections */}
          {threatsOverview?.recent_detections?.length > 0 && (
            <div className={`
              rounded-2xl shadow-xl p-6 border transition-all duration-300
              ${isDarkMode 
                ? 'bg-white/10 border-white/10' 
                : 'bg-white/80 border-white/20'
              }
            `}>
              <div className="flex items-center justify-between mb-4">
                <h3 className={`
                  text-lg font-bold transition-colors duration-300
                  ${isDarkMode ? 'text-white' : 'text-gray-900'}
                `}>
                  Recent Threat Detections
                </h3>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                  <span className={`
                    text-xs font-medium transition-colors duration-300
                    ${isDarkMode ? 'text-orange-200' : 'text-orange-700'}
                  `}>
                    Active
                  </span>
                </div>
              </div>
              <div className="space-y-3 max-h-72 overflow-y-auto">
                {threatsOverview.recent_detections.slice(0, 5).map((threat, index) => (
                  <div key={threat.threat_id || index} className={`
                    p-4 rounded-xl border hover:shadow-md transition-all duration-200
                    ${isDarkMode 
                      ? 'bg-gradient-to-r from-orange-900/60 to-yellow-900/40 border-orange-900/30' 
                      : 'bg-gradient-to-r from-orange-100/60 to-yellow-100/40 border-orange-200/50'
                    }
                  `}>
                    <div className="flex items-start gap-3">
                      <div className={`
                        p-2 rounded-lg transition-colors duration-300
                        ${isDarkMode ? 'bg-orange-600' : 'bg-orange-500'}
                      `}>
                        <FireIcon className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className={`
                          font-semibold text-sm transition-colors duration-300
                          ${isDarkMode ? 'text-white' : 'text-orange-900'}
                        `}>
                          {threat.threat_name}
                        </h4>
                        <p className={`
                          text-xs mt-1 transition-colors duration-300
                          ${isDarkMode ? 'text-gray-300' : 'text-orange-700'}
                        `}>
                          Category: {threat.threat_category}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className={`
                            px-2 py-1 rounded-full text-xs font-medium transition-colors duration-300
                            ${isDarkMode ? 'bg-orange-800/60 text-orange-200' : 'bg-orange-200 text-orange-800'}
                          `}>
                            {threat.detection_count} detections
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* System Status Footer */}
        <div className="px-8 pb-8">
          <div className={`
            rounded-2xl shadow-xl p-6 border grid grid-cols-2 md:grid-cols-6 gap-6 transition-all duration-300
            ${isDarkMode 
              ? 'bg-white/10 border-white/10' 
              : 'bg-white/80 border-white/20'
            }
          `}>
            <div className="text-center">
              <div className={`
                p-4 rounded-xl mb-3 transition-colors duration-300
                ${isDarkMode ? 'bg-blue-900/60' : 'bg-blue-100'}
              `}>
                <UserGroupIcon className={`
                  w-8 h-8 mx-auto transition-colors duration-300
                  ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}
                `} />
              </div>
              <div className={`
                text-2xl font-bold transition-colors duration-300
                ${isDarkMode ? 'text-blue-200' : 'text-blue-600'}
              `}>
                {stats?.agents?.total || 0}
              </div>
              <div className={`
                text-xs font-medium transition-colors duration-300
                ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}
              `}>
                Total Agents
              </div>
            </div>
            
            <div className="text-center">
              <div className={`
                p-4 rounded-xl mb-3 transition-colors duration-300
                ${isDarkMode ? 'bg-green-900/60' : 'bg-green-100'}
              `}>
                <CheckCircleIcon className={`
                  w-8 h-8 mx-auto transition-colors duration-300
                  ${isDarkMode ? 'text-green-400' : 'text-green-600'}
                `} />
              </div>
              <div className={`
                text-2xl font-bold transition-colors duration-300
                ${isDarkMode ? 'text-green-200' : 'text-green-600'}
              `}>
                {stats?.agents?.online || 0}
              </div>
              <div className={`
                text-xs font-medium transition-colors duration-300
                ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}
              `}>
                Online
              </div>
            </div>
            
            <div className="text-center">
              <div className={`
                p-4 rounded-xl mb-3 transition-colors duration-300
                ${isDarkMode ? 'bg-red-900/60' : 'bg-red-100'}
              `}>
                <XCircleIcon className={`
                  w-8 h-8 mx-auto transition-colors duration-300
                  ${isDarkMode ? 'text-red-400' : 'text-red-600'}
                `} />
              </div>
              <div className={`
                text-2xl font-bold transition-colors duration-300
                ${isDarkMode ? 'text-red-200' : 'text-red-600'}
              `}>
                {stats?.alerts?.open || 0}
              </div>
              <div className={`
                text-xs font-medium transition-colors duration-300
                ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}
              `}>
                Open Alerts
              </div>
            </div>
            
            <div className="text-center">
              <div className={`
                p-4 rounded-xl mb-3 transition-colors duration-300
                ${isDarkMode ? 'bg-yellow-900/60' : 'bg-yellow-100'}
              `}>
                <BoltIcon className={`
                  w-8 h-8 mx-auto transition-colors duration-300
                  ${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'}
                `} />
              </div>
              <div className={`
                text-2xl font-bold transition-colors duration-300
                ${isDarkMode ? 'text-yellow-200' : 'text-yellow-600'}
              `}>
                {stats?.detection?.active_rules || 0}
              </div>
              <div className={`
                text-xs font-medium transition-colors duration-300
                ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}
              `}>
                Active Rules
              </div>
            </div>
            
            <div className="text-center">
              <div className={`
                p-4 rounded-xl mb-3 transition-colors duration-300
                ${isDarkMode ? 'bg-purple-900/60' : 'bg-purple-100'}
              `}>
                <ShieldCheckIcon className={`
                  w-8 h-8 mx-auto transition-colors duration-300
                  ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}
                `} />
              </div>
              <div className={`
                text-2xl font-bold transition-colors duration-300
                ${isDarkMode ? 'text-purple-200' : 'text-purple-600'}
              `}>
                {stats?.threats?.active_indicators || 0}
              </div>
              <div className={`
                text-xs font-medium transition-colors duration-300
                ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}
              `}>
                Threat Indicators
              </div>
            </div>
            
            <div className="text-center">
              <div className={`
                p-4 rounded-xl mb-3 transition-colors duration-300
                ${isDarkMode ? 'bg-pink-900/60' : 'bg-pink-100'}
              `}>
                <HeartIcon className={`
                  w-8 h-8 mx-auto transition-colors duration-300
                  ${isDarkMode ? 'text-pink-400' : 'text-pink-600'}
                `} />
              </div>
              <div className={`
                text-2xl font-bold transition-colors duration-300
                ${isDarkMode ? 'text-pink-200' : 'text-pink-600'}
              `}>
                {stats?.system_health?.score || 0}%
              </div>
              <div className={`
                text-xs font-medium transition-colors duration-300
                ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}
              `}>
                Health Score
              </div>
            </div>
          </div>
        </div>

        {/* Alert Banner for Offline Agents */}
        {stats?.agents?.offline > 0 && (
          <div className={`
            mx-8 mt-6 border-l-4 p-6 rounded-xl shadow-lg transition-all duration-300
            ${isDarkMode 
              ? 'bg-gradient-to-r from-red-900/60 to-pink-900/40 border-red-600' 
              : 'bg-gradient-to-r from-red-50 to-pink-50 border-red-500'
            }
          `}>
            <div className="flex items-center">
              <div className={`
                p-2 rounded-lg mr-4 transition-colors duration-300
                ${isDarkMode ? 'bg-red-600' : 'bg-red-500'}
              `}>
                <ExclamationTriangleIcon className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h4 className={`
                  text-lg font-semibold transition-colors duration-300
                  ${isDarkMode ? 'text-red-200' : 'text-red-800'}
                `}>
                  System Alert: Offline Agents Detected
                </h4>
                <p className={`
                  mt-1 transition-colors duration-300
                  ${isDarkMode ? 'text-red-300' : 'text-red-700'}
                `}>
                  <strong>{stats.agents.offline}</strong> computers are currently offline and not being managed by the EDR System. 
                  Immediate attention may be required to ensure full security coverage.
                </p>
              </div>
              <button
                className={`
                  px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:scale-105
                  ${isDarkMode 
                    ? 'bg-red-600 text-white hover:bg-red-700' 
                    : 'bg-red-600 text-white hover:bg-red-700'
                  }
                `}
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