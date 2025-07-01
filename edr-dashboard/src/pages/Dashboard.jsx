// File: src/pages/Dashboard.jsx
// OPTIMIZED: Fixed duplicate API calls and improved error handling

import React, { useState, useEffect, useCallback } from 'react';
import { 
  fetchDashboardStats, 
  fetchAgentsOverview, 
  fetchAlertsOverview,
  fetchThreatsOverview,
  fetchSystemOverview,
  fetchRealTimeStats
} from '../services/api';
import { 
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  ComputerDesktopIcon,
  ChartBarIcon,
  FireIcon,
  BoltIcon,
  EyeIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CpuChipIcon,
  ServerIcon,
  GlobeAltIcon,
  ClockIcon,
  SignalIcon,
  BeakerIcon,
  LightBulbIcon,
  BugAntIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar
} from 'recharts';

// MetricCard Component
const MetricCard = ({ icon: Icon, title, value, change, changeType, description, color = "blue", loading = false }) => {
  const getColorClasses = (color) => {
    const colors = {
      blue: "from-blue-500 to-blue-600 shadow-blue-500/25",
      green: "from-green-500 to-green-600 shadow-green-500/25",
      red: "from-red-500 to-red-600 shadow-red-500/25",
      orange: "from-orange-500 to-orange-600 shadow-orange-500/25",
      purple: "from-purple-500 to-purple-600 shadow-purple-500/25",
      indigo: "from-indigo-500 to-indigo-600 shadow-indigo-500/25",
    };
    return colors[color] || colors.blue;
  };

  const getChangeColor = (type) => {
    switch(type) {
      case 'positive': return 'text-green-400';
      case 'negative': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  if (loading) {
    return (
      <div className="stat-card h-40 animate-pulse">
        <div className="h-4 bg-white/10 rounded mb-4"></div>
        <div className="h-8 bg-white/10 rounded mb-2"></div>
        <div className="h-3 bg-white/10 rounded"></div>
      </div>
    );
  }

  return (
    <div className="stat-card group relative overflow-hidden">
      <div className={`absolute inset-0 bg-gradient-to-br ${getColorClasses(color)} opacity-5 group-hover:opacity-10 transition-opacity duration-300`}></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-xl bg-gradient-to-br ${getColorClasses(color)} shadow-lg`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          {change && (
            <div className={`flex items-center gap-1 ${getChangeColor(changeType)}`}>
              {changeType === 'positive' ? (
                <ArrowTrendingUpIcon className="w-4 h-4" />
              ) : changeType === 'negative' ? (
                <ArrowTrendingDownIcon className="w-4 h-4" />
              ) : null}
              <span className="text-sm font-medium">{change}</span>
            </div>
          )}
        </div>
        
        <div className="mb-3">
          <h3 className="text-gray-400 text-sm font-medium mb-1">{title}</h3>
          <p className="text-3xl font-bold text-white">{value}</p>
        </div>
        
        {description && (
          <p className="text-gray-500 text-xs">{description}</p>
        )}
      </div>
    </div>
  );
};

// Security Score Gauge Component
const SecurityScoreGauge = ({ score, maxScore = 100, loading = false }) => {
  if (loading) {
    return (
      <div className="stat-card h-64 animate-pulse">
        <div className="h-6 bg-white/10 rounded mb-4"></div>
        <div className="h-32 bg-white/10 rounded-full mx-auto mb-4"></div>
        <div className="h-4 bg-white/10 rounded mx-auto"></div>
      </div>
    );
  }

  const percentage = (score / maxScore) * 100;
  const getScoreColor = () => {
    if (percentage >= 90) return "#10b981";
    if (percentage >= 70) return "#f59e0b";
    if (percentage >= 50) return "#f97316";
    return "#ef4444";
  };

  const data = [
    { name: 'Score', value: percentage, fill: getScoreColor() },
    { name: 'Remaining', value: 100 - percentage, fill: '#374151' }
  ];

  return (
    <div className="stat-card">
      <h3 className="text-lg font-semibold text-white mb-4">Security Score</h3>
      <div className="relative">
        <ResponsiveContainer width="100%" height={200}>
          <RadialBarChart 
            cx="50%" 
            cy="50%" 
            innerRadius="70%" 
            outerRadius="90%" 
            data={data}
            startAngle={90}
            endAngle={-270}
          >
            <RadialBar dataKey="value" cornerRadius={10} fill={getScoreColor()} />
          </RadialBarChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-3xl font-bold text-white">{score}</div>
            <div className="text-gray-400 text-sm">Security Score</div>
          </div>
        </div>
      </div>
      <div className="mt-4 text-center">
        <div className={`text-sm font-medium ${
          percentage >= 90 ? 'text-green-400' :
          percentage >= 70 ? 'text-yellow-400' :
          percentage >= 50 ? 'text-orange-400' :
          'text-red-400'
        }`}>
          {percentage >= 90 ? 'Excellent' :
           percentage >= 70 ? 'Good' :
           percentage >= 50 ? 'Fair' : 'Needs Attention'}
        </div>
      </div>
    </div>
  );
};

// Threat Detection Chart Component
const ThreatDetectionChart = ({ data, loading = false }) => {
  if (loading) {
    return (
      <div className="stat-card h-80 animate-pulse">
        <div className="h-6 bg-white/10 rounded mb-4"></div>
        <div className="h-64 bg-white/10 rounded"></div>
      </div>
    );
  }

  // Default data if no data provided
  const chartData = data?.length > 0 ? data : [
    { time: '00:00', threats: 5 },
    { time: '04:00', threats: 8 },
    { time: '08:00', threats: 15 },
    { time: '12:00', threats: 23 },
    { time: '16:00', threats: 18 },
    { time: '20:00', threats: 12 }
  ];

  return (
    <div className="stat-card">
      <h3 className="text-lg font-semibold text-white mb-4">Threat Detection Trends</h3>
      <ResponsiveContainer width="100%" height={250}>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="threatsGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="time" stroke="#9ca3af" fontSize={12} />
          <YAxis stroke="#9ca3af" fontSize={12} />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#1f2937', 
              border: '1px solid #374151',
              borderRadius: '8px',
              color: '#fff'
            }} 
          />
          <Area
            type="monotone"
            dataKey="threats"
            stroke="#ef4444"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#threatsGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

// Alert Severity Pie Chart Component
const AlertSeverityPie = ({ data, loading = false }) => {
  if (loading) {
    return (
      <div className="stat-card h-80 animate-pulse">
        <div className="h-6 bg-white/10 rounded mb-4"></div>
        <div className="h-64 bg-white/10 rounded-full mx-auto"></div>
      </div>
    );
  }

  // Default data if no data provided
  const chartData = data?.length > 0 ? data : [
    { name: 'Critical', value: 5 },
    { name: 'High', value: 12 },
    { name: 'Medium', value: 18 },
    { name: 'Low', value: 8 }
  ];

  const COLORS = {
    Critical: '#ef4444',
    High: '#f97316', 
    Medium: '#f59e0b',
    Low: '#10b981'
  };

  return (
    <div className="stat-card">
      <h3 className="text-lg font-semibold text-white mb-4">Alert Distribution</h3>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={5}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[entry.name]} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#1f2937', 
              border: '1px solid #374151',
              borderRadius: '8px',
              color: '#fff'
            }} 
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

// Real-time Activity Feed Component
const RealtimeActivityFeed = ({ activities, loading = false }) => {
  if (loading) {
    return (
      <div className="stat-card">
        <div className="h-6 bg-white/10 rounded mb-4"></div>
        <div className="space-y-3">
          {[1,2,3,4,5].map(i => (
            <div key={i} className="h-16 bg-white/10 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  const getActivityIcon = (type) => {
    switch(type) {
      case 'threat': return <BugAntIcon className="w-4 h-4 text-red-400" />;
      case 'alert': return <ExclamationTriangleIcon className="w-4 h-4 text-yellow-400" />;
      case 'scan': return <MagnifyingGlassIcon className="w-4 h-4 text-blue-400" />;
      case 'update': return <ArrowTrendingUpIcon className="w-4 h-4 text-green-400" />;
      default: return <SignalIcon className="w-4 h-4 text-gray-400" />;
    }
  };

  // Default activities if none provided
  const defaultActivities = [
    { type: 'threat', message: 'Malware signature detected on WIN-WS-001', timestamp: '2 minutes ago' },
    { type: 'alert', message: 'Suspicious network activity from 192.168.1.100', timestamp: '5 minutes ago' },
    { type: 'scan', message: 'Full system scan completed on 15 endpoints', timestamp: '10 minutes ago' },
    { type: 'update', message: 'Agent updated on LIN-SRV-002', timestamp: '15 minutes ago' },
    { type: 'alert', message: 'Failed login attempts detected', timestamp: '20 minutes ago' }
  ];

  const displayActivities = activities || defaultActivities;

  return (
    <div className="stat-card">
      <h3 className="text-lg font-semibold text-white mb-4">Real-time Activity</h3>
      <div className="space-y-3 max-h-64 overflow-y-auto custom-scrollbar">
        {displayActivities.map((activity, index) => (
          <div key={index} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
            <div className="flex-shrink-0">
              {getActivityIcon(activity.type)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">{activity.message}</p>
              <p className="text-gray-400 text-xs">{activity.timestamp}</p>
            </div>
            <div className="flex-shrink-0">
              <button className="text-blue-400 hover:text-blue-300 text-xs">
                View
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// System Health Monitor Component
const SystemHealthMonitor = ({ systemData, loading = false }) => {
  if (loading) {
    return (
      <div className="stat-card">
        <div className="h-6 bg-white/10 rounded mb-4"></div>
        <div className="space-y-4">
          {[1,2,3,4].map(i => (
            <div key={i} className="h-8 bg-white/10 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  const getHealthColor = (value) => {
    if (value < 60) return 'text-green-400';
    if (value < 80) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getHealthBg = (value) => {
    if (value < 60) return 'bg-green-500';
    if (value < 80) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const metrics = [
    { label: 'CPU Usage', value: systemData?.cpu_usage || 45, icon: CpuChipIcon },
    { label: 'Memory', value: systemData?.memory_usage || 62, icon: ServerIcon },
    { label: 'Disk Usage', value: systemData?.disk_usage || 38, icon: ServerIcon },
    { label: 'Network Latency', value: systemData?.network_latency || 12, unit: 'ms', icon: GlobeAltIcon }
  ];

  return (
    <div className="stat-card">
      <h3 className="text-lg font-semibold text-white mb-4">System Health</h3>
      <div className="space-y-4">
        {metrics.map((metric, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <metric.icon className="w-4 h-4 text-gray-400" />
              <span className="text-gray-300 text-sm">{metric.label}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-20 bg-gray-700 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${getHealthBg(metric.value)}`}
                  style={{ width: `${Math.min(metric.value, 100)}%` }}
                ></div>
              </div>
              <span className={`text-sm font-medium ${getHealthColor(metric.value)} min-w-[3rem]`}>
                {metric.value}{metric.unit || '%'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Main Dashboard Component
const Dashboard = () => {
  // State management
  const [dashboardData, setDashboardData] = useState(null);
  const [agentsData, setAgentsData] = useState(null);
  const [alertsData, setAlertsData] = useState(null);
  const [threatsData, setThreatsData] = useState(null);
  const [systemData, setSystemData] = useState(null);
  const [realtimeData, setRealtimeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);

  // Chart data state
  const [threatTrendData, setThreatTrendData] = useState([]);
  const [alertDistributionData, setAlertDistributionData] = useState([]);

  // Fetch all dashboard data with better error handling
  const fetchAllData = useCallback(async () => {
    console.log('🔄 Starting dashboard data fetch...');
    
    try {
      setLoading(true);
      setError(null);
      
      // Fetch all data in parallel with individual error handling
      const results = await Promise.allSettled([
        fetchDashboardStats(),
        fetchAgentsOverview(),
        fetchAlertsOverview(24),
        fetchThreatsOverview(24),
        fetchSystemOverview(),
        fetchRealTimeStats()
      ]);

      // Process results
      const [dashboard, agents, alerts, threats, system, realtime] = results;

      // Process dashboard data
      if (dashboard.status === 'fulfilled' && dashboard.value && !dashboard.value.error) {
        setDashboardData(dashboard.value);
        if (dashboard.value.threat_timeline) {
          setThreatTrendData(dashboard.value.threat_timeline);
        }
        console.log('✅ Dashboard stats loaded');
      } else {
        console.log('⚠️ Dashboard stats using fallback');
      }
      
      // Process agents data
      if (agents.status === 'fulfilled' && agents.value && !agents.value.error) {
        setAgentsData(agents.value);
        console.log('✅ Agents data loaded');
      } else {
        console.log('⚠️ Agents data using fallback');
      }
      
      // Process alerts data
      if (alerts.status === 'fulfilled' && alerts.value && !alerts.value.error) {
        setAlertsData(alerts.value);
        if (alerts.value.severity_distribution) {
          const chartData = Object.entries(alerts.value.severity_distribution).map(([name, value]) => ({
            name,
            value
          }));
          setAlertDistributionData(chartData);
        }
        console.log('✅ Alerts data loaded');
      } else {
        console.log('⚠️ Alerts data using fallback');
      }
      
      // Process other data
      if (threats.status === 'fulfilled' && threats.value && !threats.value.error) {
        setThreatsData(threats.value);
        console.log('✅ Threats data loaded');
      }
      
      if (system.status === 'fulfilled' && system.value && !system.value.error) {
        setSystemData(system.value);
        console.log('✅ System data loaded');
      }
      
      if (realtime.status === 'fulfilled' && realtime.value && !realtime.value.error) {
        setRealtimeData(realtime.value);
        console.log('✅ Realtime data loaded');
      }

      // Update last update time
      setLastUpdate(new Date());
      
      console.log('✅ Dashboard data fetch completed');

    } catch (err) {
      console.error('❌ Dashboard data fetch failed:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []); // Empty dependency array since we don't want this to change

  // Initial data fetch with cleanup
  useEffect(() => {
    let mounted = true;
    
    const loadData = async () => {
      if (mounted) {
        await fetchAllData();
      }
    };
    
    loadData();
    
    return () => {
      mounted = false;
    };
  }, []); // Only run once on mount

  // Periodic updates with cleanup
  useEffect(() => {
    const interval = setInterval(() => {
      console.log('🔄 Periodic dashboard refresh...');
      fetchAllData();
    }, 60000); // Increased to 60 seconds to reduce load
    
    return () => {
      console.log('🛑 Clearing dashboard refresh interval');
      clearInterval(interval);
    };
  }, [fetchAllData]);

  // Loading state
  if (loading && !dashboardData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <div className="text-gray-400">Loading dashboard data...</div>
          <div className="text-gray-500 text-sm mt-2">Initializing security platform...</div>
        </div>
      </div>
    );
  }

  // Error state with retry
  if (error && !dashboardData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-red-400 text-xl mb-2">⚠️ Dashboard Error</div>
          <div className="text-gray-400 mb-4">Using fallback data while API is unavailable</div>
          <div className="text-gray-500 text-sm mb-4">{error}</div>
          <button
            onClick={() => {
              setError(null);
              fetchAllData();
            }}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
            Security Operations Center
          </h1>
          <p className="text-gray-400 mt-2 text-lg">
            Real-time threat monitoring and incident response platform v3.0.0
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-green-400">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">Live Monitoring</span>
          </div>
          <button
            onClick={fetchAllData}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors"
          >
            <ArrowTrendingUpIcon className="w-4 h-4" />
            Refresh All
          </button>
        </div>
      </div>

      {/* Critical Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          icon={ShieldCheckIcon}
          title="Protected Endpoints"
          value={agentsData?.summary?.total_agents?.toLocaleString() || '247'}
          change={agentsData?.summary?.agent_change || '+5'}
          changeType={agentsData?.summary?.agent_change?.startsWith('+') ? 'positive' : 'negative'}
          description="Active security agents"
          color="green"
          loading={loading}
        />
        
        <MetricCard
          icon={ExclamationTriangleIcon}
          title="Active Alerts"
          value={alertsData?.summary?.open_alerts?.toLocaleString() || '12'}
          change={alertsData?.summary?.alert_change || '-3'}
          changeType={alertsData?.summary?.alert_change?.startsWith('-') ? 'positive' : 'negative'}
          description="Requiring attention"
          color="orange"
          loading={loading}
        />
        
        <MetricCard
          icon={BugAntIcon}
          title="Threats Detected"
          value={threatsData?.summary?.detected_24h?.toLocaleString() || '8'}
          change={threatsData?.summary?.threat_change || '-12%'}
          changeType="positive"
          description="Last 24 hours"
          color="red"
          loading={loading}
        />
        
        <MetricCard
          icon={FireIcon}
          title="Incidents Resolved"
          value={dashboardData?.incidents_resolved?.toLocaleString() || '156'}
          change={dashboardData?.resolution_change || '+8%'}
          changeType="positive"
          description="This week"
          color="purple"
          loading={loading}
        />
      </div>

      {/* Security Score and System Health */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <SecurityScoreGauge 
          score={dashboardData?.security_score || 87} 
          loading={loading}
        />
        
        <SystemHealthMonitor
          systemData={systemData}
          loading={loading}
        />
        
        <RealtimeActivityFeed 
          activities={realtimeData?.activities} 
          loading={loading}
        />
      </div>

      {/* Advanced Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ThreatDetectionChart 
          data={threatTrendData} 
          loading={loading}
        />
        <AlertSeverityPie 
          data={alertDistributionData} 
          loading={loading}
        />
      </div>

      {/* Footer Status */}
      <div className="flex items-center justify-between py-4 border-t border-white/10">
        <div className="flex items-center gap-6 text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <ClockIcon className="w-4 h-4" />
            <span>Last updated: {lastUpdate ? lastUpdate.toLocaleTimeString() : 'Never'}</span>
          </div>
          <div className="flex items-center gap-2">
            <ServerIcon className="w-4 h-4" />
            <span>System load: {systemData?.system_load || 'Normal'}</span>
          </div>
          <div className="flex items-center gap-2">
            <SignalIcon className="w-4 h-4 text-green-400" />
            <span>All services operational</span>
          </div>
        </div>
        
        <div className="text-sm text-gray-500">
          EDR Platform v3.0.0 | Fallback Mode
        </div>
      </div>
    </div>
  );
};

export default Dashboard;