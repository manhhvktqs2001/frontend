import React, { useState, useEffect } from 'react';
import {
  ChartBarIcon,
  CubeIcon,
  FireIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  EyeIcon,
  ArrowPathIcon,
  CalendarIcon,
  Cog6ToothIcon,
  ArrowDownTrayIcon,
  PlayIcon,
  PauseIcon,
  MapPinIcon,
  GlobeAltIcon,
  UserGroupIcon,
  ServerIcon
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
  ScatterChart,
  Scatter,
  ComposedChart,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Treemap,
  Sankey
} from 'recharts';
import apiService from '../services/api';

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const [isRealTime, setIsRealTime] = useState(false);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch analytics data from API
      const [threatAnalytics, performanceAnalytics, systemMetrics] = await Promise.all([
        apiService.getThreatAnalytics({ timeRange }),
        apiService.getPerformanceAnalytics({ timeRange }),
        apiService.getSystemMetrics()
      ]);

      setAnalyticsData({
        threatAnalytics,
        performanceAnalytics,
        systemMetrics
      });
    } catch (err) {
      setError(err.message);
      console.error('Failed to fetch analytics data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalyticsData();
    const interval = setInterval(fetchAnalyticsData, 30000);
    return () => clearInterval(interval);
  }, [timeRange]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <div className="text-gray-400">Loading analytics data...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-red-400 text-xl mb-2">⚠️ Error Loading Analytics</div>
          <div className="text-gray-400 mb-4">{error}</div>
          <button onClick={fetchAnalyticsData} className="btn btn-primary">Retry</button>
        </div>
      </div>
    );
  }

  // Use real data from API or fallback to empty data
  const threatData = analyticsData?.threatAnalytics?.threat_evolution || [];
  const attackVectorData = analyticsData?.threatAnalytics?.attack_vectors || [];
  const behavioralData = analyticsData?.performanceAnalytics?.behavioral_analysis || [];
  const mitreData = analyticsData?.threatAnalytics?.mitre_coverage || [];
  const riskMatrixData = analyticsData?.threatAnalytics?.risk_matrix || [];
  const geographicalData = analyticsData?.threatAnalytics?.geographical_threats || [];
  const performanceMetrics = analyticsData?.performanceAnalytics?.metrics || {
    mttr: { value: 0, change: 0, trend: 'down' },
    mttd: { value: 0, change: 0, trend: 'down' },
    incidents: { value: 0, change: 0, trend: 'up' },
    falsePositives: { value: 0, change: 0, trend: 'down' }
  };

  const MetricCard = ({ title, value, unit, change, trend, icon: Icon, color }) => (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-2 rounded-lg bg-${color}-500/20`}>
          <Icon className={`w-5 h-5 text-${color}-400`} />
        </div>
        <div className={`flex items-center gap-1 text-sm ${
          trend === 'up' ? 'text-green-400' : 'text-red-400'
        }`}>
          {trend === 'up' ? <ArrowTrendingUpIcon className="w-4 h-4" /> : <ArrowTrendingDownIcon className="w-4 h-4" />}
          <span>{Math.abs(change)}%</span>
        </div>
      </div>
      <div>
        <h3 className="text-gray-400 text-sm font-medium mb-1">{title}</h3>
        <p className="text-2xl font-bold text-white">
          {value}<span className="text-lg text-gray-400 ml-1">{unit}</span>
        </p>
      </div>
    </div>
  );

  const ThreatEvolutionChart = () => (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-white">Threat Evolution Timeline</h3>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm">Malware</button>
          <button className="px-3 py-1 bg-white/10 text-gray-300 rounded-lg text-sm">Phishing</button>
          <button className="px-3 py-1 bg-white/10 text-gray-300 rounded-lg text-sm">APT</button>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <ComposedChart data={threatData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="time" stroke="#9ca3af" />
          <YAxis stroke="#9ca3af" />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#1f2937', 
              border: '1px solid #374151',
              borderRadius: '8px',
              color: '#fff'
            }} 
          />
          <Area type="monotone" dataKey="total" fill="#3b82f6" fillOpacity={0.3} stroke="#3b82f6" />
          <Bar dataKey="malware" fill="#ef4444" />
          <Line type="monotone" dataKey="apt" stroke="#8b5cf6" strokeWidth={2} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );

  const AttackVectorPie = () => (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
      <h3 className="text-xl font-semibold text-white mb-6">Attack Vectors</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={attackVectorData}
            cx="50%"
            cy="50%"
            outerRadius={100}
            paddingAngle={5}
            dataKey="value"
          >
            {attackVectorData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
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
      <div className="mt-4 space-y-2">
        {attackVectorData.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
              <span className="text-gray-300 text-sm">{item.name}</span>
            </div>
            <span className="text-white font-medium">{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );

  const BehavioralAnalysis = () => (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
      <h3 className="text-xl font-semibold text-white mb-6">Behavioral Anomaly Detection</h3>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={behavioralData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="time" stroke="#9ca3af" />
          <YAxis stroke="#9ca3af" />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#1f2937', 
              border: '1px solid #374151',
              borderRadius: '8px',
              color: '#fff'
            }} 
          />
          <Area type="monotone" dataKey="normal" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.8} />
          <Area type="monotone" dataKey="suspicious" stackId="1" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.8} />
          <Area type="monotone" dataKey="malicious" stackId="1" stroke="#ef4444" fill="#ef4444" fillOpacity={0.8} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );

  const MitreCoverageRadar = () => (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
      <h3 className="text-xl font-semibold text-white mb-6">MITRE ATT&CK Coverage</h3>
      <ResponsiveContainer width="100%" height={300}>
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={mitreData}>
          <PolarGrid />
          <PolarAngleAxis dataKey="tactic" tick={{ fill: '#9ca3af', fontSize: 12 }} />
          <PolarRadiusAxis 
            angle={90} 
            domain={[0, 100]} 
            tick={{ fill: '#9ca3af', fontSize: 10 }} 
          />
          <Radar name="Detection" dataKey="detection" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
          <Radar name="Prevention" dataKey="prevention" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
          <Radar name="Response" dataKey="response" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.3} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );

  const RiskMatrix = () => (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
      <h3 className="text-xl font-semibold text-white mb-6">Risk Assessment Matrix</h3>
      <ResponsiveContainer width="100%" height={300}>
        <ScatterChart>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            type="number" 
            dataKey="x" 
            name="Likelihood" 
            stroke="#9ca3af"
            domain={[0, 100]}
          />
          <YAxis 
            type="number" 
            dataKey="y" 
            name="Impact" 
            stroke="#9ca3af"
            domain={[0, 100]}
          />
          <Tooltip 
            cursor={{ strokeDasharray: '3 3' }}
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                  <div className="bg-gray-900 border border-gray-700 rounded-lg p-3">
                    <p className="text-white font-medium">{data.risk}</p>
                    <p className="text-gray-300">Likelihood: {data.x}%</p>
                    <p className="text-gray-300">Impact: {data.y}%</p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Scatter name="Risks" data={riskMatrixData} fill="#ef4444" />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );

  const GeographicalThreats = () => (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
      <h3 className="text-xl font-semibold text-white mb-6">Global Threat Intelligence</h3>
      <div className="space-y-4">
        {geographicalData.map((country, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
            <div className="flex items-center gap-3">
              <MapPinIcon className="w-4 h-4 text-red-400" />
              <span className="text-white font-medium">{country.country}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-20 bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-red-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(country.threats / 150) * 100}%` }}
                ></div>
              </div>
              <span className="text-white text-sm font-medium">{country.threats}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Advanced Analytics</h1>
            <p className="text-gray-400">Comprehensive threat intelligence and security metrics</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsRealTime(!isRealTime)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  isRealTime 
                    ? 'bg-green-600 text-white' 
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                {isRealTime ? <PlayIcon className="w-4 h-4" /> : <PauseIcon className="w-4 h-4" />}
                {isRealTime ? 'Live' : 'Paused'}
              </button>
              <button className="p-2 bg-white/10 text-gray-300 hover:bg-white/20 rounded-lg transition-colors">
                <ArrowDownTrayIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Time Range Selector */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-gray-400" />
            <span className="text-gray-400">Time Range:</span>
          </div>
          <div className="flex gap-2">
            {['1h', '24h', '7d', '30d', '90d'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                  timeRange === range
                    ? 'bg-blue-600 text-white'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Mean Time to Response"
          value={performanceMetrics.mttr.value}
          unit="min"
          change={performanceMetrics.mttr.change}
          trend={performanceMetrics.mttr.trend}
          icon={ClockIcon}
          color="blue"
        />
        <MetricCard
          title="Mean Time to Detection"
          value={performanceMetrics.mttd.value}
          unit="min"
          change={performanceMetrics.mttd.change}
          trend={performanceMetrics.mttd.trend}
          icon={EyeIcon}
          color="green"
        />
        <MetricCard
          title="Security Incidents"
          value={performanceMetrics.incidents.value}
          unit=""
          change={performanceMetrics.incidents.change}
          trend={performanceMetrics.incidents.trend}
          icon={ExclamationTriangleIcon}
          color="red"
        />
        <MetricCard
          title="False Positive Rate"
          value={performanceMetrics.falsePositives.value}
          unit="%"
          change={performanceMetrics.falsePositives.change}
          trend={performanceMetrics.falsePositives.trend}
          icon={ShieldCheckIcon}
          color="yellow"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <ThreatEvolutionChart />
        <AttackVectorPie />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <BehavioralAnalysis />
        <MitreCoverageRadar />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RiskMatrix />
        <GeographicalThreats />
      </div>
    </div>
  );
};

export default Analytics;