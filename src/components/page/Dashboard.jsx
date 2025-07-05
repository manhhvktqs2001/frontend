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
import { Chart, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Filler } from 'chart.js';
import { 
  fetchDashboardStats, 
  fetchAlerts, 
  fetchThreats, 
  fetchEventsTimeline,
  fetchRealTimeStats,
  fetchAlertStats
} from '../../service/api';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';

Chart.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Filler);

function formatTime(date, timeFormat) {
  if (timeFormat === 'vn') {
    // Giờ Việt Nam (GMT+7, 24h)
    const utc = date.getTime() + (date.getTimezoneOffset() * 60000);
    const vnDate = new Date(utc + 7 * 60 * 60 * 1000);
    return vnDate.toLocaleTimeString('vi-VN', { hour12: false });
  } else {
    // AM/PM theo giờ hệ thống
    return date.toLocaleTimeString('en-US', { hour12: true });
  }
}

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
  const [realTimeStats, setRealTimeStats] = useState(null);
  const [timeFormat, setTimeFormat] = useState('vn');
  const [alertStats, setAlertStats] = useState(null);
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

  const fetchAndSetRealTimeStats = async () => {
    try {
      const stats = await fetchRealTimeStats();
      setRealTimeStats(stats);
    } catch (err) {
      // Optionally handle error
    }
  };

  useEffect(() => {
    fetchDashboardData();
    fetchAlertStats({ hours: 24 }).then(data => setAlertStats(data));
    const interval = setInterval(() => {
      fetchDashboardData();
      fetchAlertStats({ hours: 24 }).then(data => setAlertStats(data));
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Ưu tiên lấy từ localStorage nếu không truyền prop
    const saved = localStorage.getItem('generalSettings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.timeFormat) setTimeFormat(parsed.timeFormat);
      } catch {}
    }
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

  console.log('DEBUG: timeline', timeline);
  console.log('DEBUG: timeline[0]', timeline?.timeline?.[0]);

  // Tổng hợp count theo event_type
  const eventTypeCounts = {};
  (timeline?.timeline || []).forEach(item => {
    if (!eventTypeCounts[item.event_type]) {
      eventTypeCounts[item.event_type] = 0;
    }
    eventTypeCounts[item.event_type] += item.count;
  });
  const labels = Object.keys(eventTypeCounts);
  const events = Object.values(eventTypeCounts);

  console.log('DEBUG: events array', events);

  const eventTypeColors = {
    Authentication: '#6366f1', // Indigo
    Process: '#3b82f6',       // Blue
    File: '#10b981',          // Emerald
    Registry: '#a21caf',      // Purple
    Network: '#f59e0b'        // Amber
  };
  const backgroundTypeColors = {
    Authentication: 'rgba(99, 102, 241, 0.2)',
    Process: 'rgba(59, 130, 246, 0.2)',
    File: 'rgba(16, 185, 129, 0.2)',
    Registry: 'rgba(162, 28, 175, 0.2)',
    Network: 'rgba(245, 158, 11, 0.2)'
  };

  const borderColors = labels.map(label => eventTypeColors[label] || '#64748b');
  const backgroundColors = labels.map(label => backgroundTypeColors[label] || 'rgba(100, 116, 139, 0.2)');

  const threatTrendData = timeline ? {
    labels,
    datasets: [
      {
        label: 'Events',
        data: events,
        borderColor: borderColors,
        backgroundColor: backgroundColors,
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: borderColors,
        pointBorderColor: isDarkMode ? '#1e293b' : '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 6
      }
    ]
  } : null;

  const severityDist = alertStats?.severity_breakdown || {};
  const getSeverityCount = (key) => {
    return severityDist[key] || severityDist[key.toLowerCase()] || 0;
  };
  const alertsBarData = {
    labels: ['Critical', 'High', 'Medium', 'Low'],
    datasets: [{
      label: 'Alerts by Severity',
      data: [
        getSeverityCount('Critical'),
        getSeverityCount('High'),
        getSeverityCount('Medium'),
        getSeverityCount('Low')
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
  };

  // Event Type Breakdown
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
            <span>Last updated: {formatTime(lastUpdated, timeFormat)}</span>
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
              {stats?.agents?.online ?? 0}
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
              {stats?.alerts?.open || 0}
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
                Events by Type
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
                </div>
              </div>
  );
}

export default Dashboard;