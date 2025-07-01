// File: src/pages/Dashboard.jsx
// Updated Dashboard component with real API integration

import React, { useState, useEffect } from 'react';
import { 
  fetchDashboardStats, 
  fetchAgentsOverview, 
  fetchAlertsOverview,
  fetchThreatsOverview,
  fetchSystemOverview,
  fetchRealTimeStats,
  EDRWebSocket
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

  return (
    <div className="stat-card">
      <h3 className="text-lg font-semibold text-white mb-4">Threat Detection Trends</h3>
      <ResponsiveContainer width="100%" height={250}>
        <AreaChart data={data}>
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
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
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

  return (
    <div className="stat-card">
      <h3 className="text-lg font-semibold text-white mb-4">Real-time Activity</h3>
      <div className="space-y-3 max-h-64 overflow-y-auto custom-scrollbar">
        {activities?.map((activity, index) => (
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

// Main Dashboard Component
export const Dashboard = () => {
  // State management
  const [dashboardData, setDashboardData] = useState(null);
  const [agentsData, setAgentsData] = useState(null);
  const [alertsData, setAlertsData] = useState(null);
  const [threatsData, setThreatsData] = useState(null);
  const [systemData, setSystemData] = useState(null);
  const [realtimeData, setRealtimeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [webSocket, setWebSocket] = useState(null);

  // Chart data state
  const [threatTrendData, setThreatTrendData] = useState([]);
  const [alertDistributionData, setAlertDistributionData] = useState([]);

  // Fetch all dashboard data
  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch all data in parallel with error handling
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

      if (dashboard.status === 'fulfilled') {
        setDashboardData(dashboard.value);
        // Update chart data from API response
        if (dashboard.value.threat_timeline) {
          setThreatTrendData(dashboard.value.threat_timeline);
        }
      }
      
      if (agents.status === 'fulfilled') setAgentsData(agents.value);
      
      if (alerts.status === 'fulfilled') {
        setAlertsData(alerts.value);
        // Update alert distribution chart
        if (alerts.value.severity_distribution) {
          const chartData = Object.entries(alerts.value.severity_distribution).map(([name, value]) => ({
            name,
            value
          }));
          setAlertDistributionData(chartData);
        }
      }
      
      if (threats.status === 'fulfilled') setThreatsData(threats.value);
      if (system.status === 'fulfilled') setSystemData(system.value);
      if (realtime.status === 'fulfilled') setRealtimeData(realtime.value);

      // Handle any errors
      const errors = results.filter(result => result.status === 'rejected');
      if (errors.length > 0) {
        console.error('Some API calls failed:', errors);
      }

    } catch (err) {
      setError(err.message);
      console.error('Failed to fetch dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  // WebSocket connection for real-time updates
  useEffect(() => {
    const ws = new EDRWebSocket(
      (data) => {
        // Handle real-time updates
        switch (data.type) {
          case 'new_alert':
            setRealtimeData(prev => ({
              ...prev,
              activities: [data.payload, ...(prev?.activities || []).slice(0, 9)]
            }));
            break;
          case 'agent_status':
            setAgentsData(prev => prev ? {
              ...prev,
              summary: { ...prev.summary, ...data.payload }
            } : null);
            break;
          case 'threat_detected':
            setRealtimeData(prev => ({
              ...prev,
              activities: [data.payload, ...(prev?.activities || []).slice(0, 9)]
            }));
            break;
          default:
            break;
        }
      },
      (error) => {
        console.error('WebSocket error:', error);
      }
    );

    ws.connect();
    setWebSocket(ws);

    return () => {
      ws.disconnect();
    };
  }, []);

  // Initial data fetch and periodic updates
  useEffect(() => {
    fetchAllData();
    
    // Set up periodic updates every 30 seconds
    const interval = setInterval(fetchAllData, 30000);
    
    return () => clearInterval(interval);
  }, []);

  // Loading state
  if (loading && !dashboardData) {
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
  if (error && !dashboardData) {
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
          value={agentsData?.summary?.total_agents?.toLocaleString() || '---'}
          change={agentsData?.summary?.agent_change || null}
          changeType={agentsData?.summary?.agent_change?.startsWith('+') ? 'positive' : 'negative'}
          description="Active security agents"
          color="green"
          loading={loading}
        />
        
        <MetricCard
          icon={ExclamationTriangleIcon}
          title="Active Alerts"
          value={alertsData?.summary?.open_alerts?.toLocaleString() || '---'}
          change={alertsData?.summary?.alert_change || null}
          changeType={alertsData?.summary?.alert_change?.startsWith('-') ? 'positive' : 'negative'}
          description="Requiring attention"
          color="orange"
          loading={loading}
        />
        
        <MetricCard
          icon={BugAntIcon}
          title="Threats Detected"
          value={threatsData?.summary?.detected_24h?.toLocaleString() || '---'}
          change={threatsData?.summary?.threat_change || null}
          changeType="negative"
          description="Last 24 hours"
          color="red"
          loading={loading}
        />
        
        <MetricCard
          icon={FireIcon}
          title="Incidents Resolved"
          value={dashboardData?.incidents_resolved?.toLocaleString() || '---'}
          change={dashboardData?.resolution_change || null}
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

      {/* Detailed Intelligence */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TopThreatsTable 
          threats={threatsData?.top_threats} 
          loading={loading}
        />
        
        <MitreCoveragePanel 
          coverage={dashboardData?.mitre_coverage}
          loading={loading}
        />
      </div>

      {/* AI Insights Panel */}
      <AIInsightsPanel 
        insights={dashboardData?.ai_insights}
        loading={loading}
      />

      {/* Footer Status */}
      <div className="flex items-center justify-between py-4 border-t border-white/10">
        <div className="flex items-center gap-6 text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <ClockIcon className="w-4 h-4" />
            <span>Last updated: {dashboardData?.last_updated || new Date().toLocaleTimeString()}</span>
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
          WatchGuard EDR Platform v3.0.0
        </div>
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
    { label: 'CPU Usage', value: systemData?.cpu_usage || 0, icon: CpuChipIcon },
    { label: 'Memory', value: systemData?.memory_usage || 0, icon: ServerIcon },
    { label: 'Disk Usage', value: systemData?.disk_usage || 0, icon: ServerIcon },
    { label: 'Network Latency', value: systemData?.network_latency || 0, unit: 'ms', icon: GlobeAltIcon }
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

// Top Threats Table Component
const TopThreatsTable = ({ threats, loading = false }) => {
  if (loading) {
    return (
      <div className="stat-card">
        <div className="h-6 bg-white/10 rounded mb-4"></div>
        <div className="space-y-4">
          {[1,2,3,4].map(i => (
            <div key={i} className="h-16 bg-white/10 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="stat-card">
      <h3 className="text-lg font-semibold text-white mb-4">Top Threats</h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="text-left text-gray-400 text-xs font-medium uppercase tracking-wider py-2">Threat</th>
              <th className="text-left text-gray-400 text-xs font-medium uppercase tracking-wider py-2">Severity</th>
              <th className="text-left text-gray-400 text-xs font-medium uppercase tracking-wider py-2">Count</th>
              <th className="text-left text-gray-400 text-xs font-medium uppercase tracking-wider py-2">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {threats?.map((threat, index) => (
              <tr key={index} className="hover:bg-white/5">
                <td className="py-3">
                  <div className="flex items-center gap-2">
                    <BugAntIcon className="w-4 h-4 text-red-400" />
                    <span className="text-white text-sm font-medium">{threat.threat_name || threat.name}</span>
                  </div>
                </td>
                <td className="py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    threat.severity === 'Critical' ? 'bg-red-500/20 text-red-400' :
                    threat.severity === 'High' ? 'bg-orange-500/20 text-orange-400' :
                    threat.severity === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-green-500/20 text-green-400'
                  }`}>
                    {threat.severity}
                  </span>
                </td>
                <td className="py-3">
                  <span className="text-white text-sm">{threat.count || threat.detections}</span>
                </td>
                <td className="py-3">
                  <button className="text-blue-400 hover:text-blue-300 text-sm">
                    Investigate
                  </button>
                </td>
              </tr>
            )) || (
              <tr>
                <td colSpan="4" className="py-8 text-center text-gray-400">
                  No threat data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// MITRE Coverage Panel Component
const MitreCoveragePanel = ({ coverage, loading = false }) => {
  if (loading) {
    return (
      <div className="stat-card">
        <div className="h-6 bg-white/10 rounded mb-4"></div>
        <div className="space-y-4">
          {[1,2,3,4,5].map(i => (
            <div key={i} className="h-8 bg-white/10 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  const defaultCoverage = [
    { tactic: 'Initial Access', coverage: 92, count: 15 },
    { tactic: 'Execution', coverage: 88, count: 22 },
    { tactic: 'Persistence', coverage: 94, count: 18 },
    { tactic: 'Defense Evasion', coverage: 76, count: 31 },
    { tactic: 'Credential Access', coverage: 85, count: 12 }
  ];

  const tactics = coverage || defaultCoverage;

  return (
    <div className="stat-card">
      <h3 className="text-lg font-semibold text-white mb-4">MITRE ATT&CK Coverage</h3>
      <div className="space-y-4">
        {tactics.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <div>
              <span className="text-white text-sm font-medium">{item.tactic}</span>
              <span className="text-gray-400 text-xs ml-2">({item.count || item.technique_count} techniques)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-20 bg-gray-700 rounded-full h-2">
                <div 
                  className="h-2 rounded-full bg-blue-500"
                  style={{ width: `${item.coverage}%` }}
                ></div>
              </div>
              <span className="text-blue-400 text-sm font-medium min-w-[3rem]">
                {item.coverage}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// AI Insights Panel Component
const AIInsightsPanel = ({ insights, loading = false }) => {
  if (loading) {
    return (
      <div className="stat-card">
        <div className="h-6 bg-white/10 rounded mb-4"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1,2,3].map(i => (
            <div key={i} className="h-24 bg-white/10 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  const defaultInsights = [
    {
      type: 'anomaly',
      title: 'Anomaly Detection',
      message: 'Unusual network traffic patterns detected in subnet 192.168.1.0/24 suggesting potential lateral movement.',
      color: 'blue'
    },
    {
      type: 'risk',
      title: 'Risk Assessment', 
      message: 'Endpoint WIN-WS-045 shows signs of compromise. Recommend immediate isolation and forensic analysis.',
      color: 'yellow'
    },
    {
      type: 'optimization',
      title: 'Optimization',
      message: 'Security posture improved by 12% this week. Consider implementing advanced behavioral analytics.',
      color: 'green'
    }
  ];

  const aiInsights = insights || defaultInsights;

  return (
    <div className="stat-card">
      <div className="flex items-center gap-2 mb-4">
        <LightBulbIcon className="w-6 h-6 text-yellow-400" />
        <h3 className="text-lg font-semibold text-white">AI Security Insights</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {aiInsights.map((insight, index) => (
          <div key={index} className={`bg-${insight.color}-500/10 border border-${insight.color}-500/30 rounded-lg p-4`}>
            <h4 className={`text-${insight.color}-400 font-medium mb-2`}>{insight.title}</h4>
            <p className="text-gray-300 text-sm">
              {insight.message}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};