import React, { useState, useEffect } from 'react';
import {
  GlobeAltIcon,
  WifiIcon,
  ServerIcon,
  ShieldExclamationIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  ArrowPathIcon,
  EyeIcon,
  MapIcon,
  SignalIcon,
  ComputerDesktopIcon
} from '@heroicons/react/24/outline';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, ArcElement, BarElement, Title, Tooltip, Legend } from 'chart.js';

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, BarElement, Title, Tooltip, Legend);

const NetworkMonitoring = () => {
  const [networkStats, setNetworkStats] = useState({
    totalConnections: 15847,
    activeConnections: 1247,
    blockedConnections: 156,
    suspiciousActivity: 23,
    bandwidth: {
      inbound: 125.6,
      outbound: 89.3
    },
    topProtocols: [
      { name: 'HTTPS', percentage: 45, count: 7130 },
      { name: 'HTTP', percentage: 25, count: 3962 },
      { name: 'DNS', percentage: 15, count: 2377 },
      { name: 'SSH', percentage: 10, count: 1585 },
      { name: 'Other', percentage: 5, count: 793 }
    ]
  });

  const [liveConnections, setLiveConnections] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [trafficData, setTrafficData] = useState({
    labels: [],
    inbound: [],
    outbound: []
  });
  const [geoData, setGeoData] = useState([]);
  const [filters, setFilters] = useState({
    timeRange: '1h',
    protocol: 'all',
    direction: 'all',
    riskLevel: 'all'
  });

  // Generate mock real-time data
  useEffect(() => {
    const generateTrafficData = () => {
      const now = new Date();
      const labels = [];
      const inbound = [];
      const outbound = [];

      for (let i = 29; i >= 0; i--) {
        const time = new Date(now.getTime() - i * 60000);
        labels.push(time.toLocaleTimeString('en-US', { hour12: false, timeStyle: 'short' }));
        inbound.push(Math.random() * 100 + 50);
        outbound.push(Math.random() * 80 + 30);
      }

      setTrafficData({ labels, inbound, outbound });
    };

    const generateLiveConnections = () => {
      const connections = [
        {
          id: 1,
          sourceIP: '192.168.1.100',
          destIP: '8.8.8.8',
          protocol: 'DNS',
          port: 53,
          status: 'active',
          riskLevel: 'low',
          bytesTransferred: 1024,
          duration: '00:00:15',
          country: 'United States'
        },
        {
          id: 2,
          sourceIP: '192.168.1.105',
          destIP: '104.16.249.249',
          protocol: 'HTTPS',
          port: 443,
          status: 'active',
          riskLevel: 'medium',
          bytesTransferred: 15360,
          duration: '00:02:30',
          country: 'United States'
        },
        {
          id: 3,
          sourceIP: '192.168.1.110',
          destIP: '185.199.108.153',
          protocol: 'HTTPS',
          port: 443,
          status: 'blocked',
          riskLevel: 'high',
          bytesTransferred: 0,
          duration: '00:00:00',
          country: 'Russia'
        },
        {
          id: 4,
          sourceIP: '192.168.1.120',
          destIP: '151.101.193.140',
          protocol: 'HTTPS',
          port: 443,
          status: 'active',
          riskLevel: 'low',
          bytesTransferred: 8192,
          duration: '00:01:45',
          country: 'United States'
        },
        {
          id: 5,
          sourceIP: '192.168.1.115',
          destIP: '117.18.232.200',
          protocol: 'TCP',
          port: 80,
          status: 'suspicious',
          riskLevel: 'critical',
          bytesTransferred: 50000,
          duration: '00:05:20',
          country: 'China'
        }
      ];
      setLiveConnections(connections);
    };

    const generateAlerts = () => {
      setAlerts([
        {
          id: 1,
          type: 'DDoS Attempt',
          description: 'High volume of requests from 185.199.108.153',
          severity: 'critical',
          timestamp: new Date(Date.now() - 300000).toISOString(),
          sourceIP: '185.199.108.153',
          affectedAssets: 3
        },
        {
          id: 2,
          type: 'Port Scan',
          description: 'Sequential port scanning detected from 117.18.232.200',
          severity: 'high',
          timestamp: new Date(Date.now() - 600000).toISOString(),
          sourceIP: '117.18.232.200',
          affectedAssets: 1
        },
        {
          id: 3,
          type: 'Unusual Data Transfer',
          description: 'Large data transfer to external IP detected',
          severity: 'medium',
          timestamp: new Date(Date.now() - 900000).toISOString(),
          sourceIP: '192.168.1.115',
          affectedAssets: 1
        }
      ]);
    };

    const generateGeoData = () => {
      setGeoData([
        { country: 'United States', connections: 8542, percentage: 68.2, risk: 'low' },
        { country: 'Germany', connections: 1247, percentage: 9.9, risk: 'low' },
        { country: 'United Kingdom', connections: 856, percentage: 6.8, risk: 'low' },
        { country: 'China', connections: 623, percentage: 5.0, risk: 'high' },
        { country: 'Russia', connections: 445, percentage: 3.5, risk: 'high' },
        { country: 'Other', connections: 832, percentage: 6.6, risk: 'medium' }
      ]);
    };

    // Initial data generation
    generateTrafficData();
    generateLiveConnections();
    generateAlerts();
    generateGeoData();

    // Real-time updates
    const interval = setInterval(() => {
      generateTrafficData();
      generateLiveConnections();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Chart configurations
  const trafficChartData = {
    labels: trafficData.labels,
    datasets: [
      {
        label: 'Inbound (Mbps)',
        data: trafficData.inbound,
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4
      },
      {
        label: 'Outbound (Mbps)',
        data: trafficData.outbound,
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4
      }
    ]
  };

  const protocolChartData = {
    labels: networkStats.topProtocols.map(p => p.name),
    datasets: [{
      data: networkStats.topProtocols.map(p => p.percentage),
      backgroundColor: [
        '#10b981', // HTTPS - Green
        '#3b82f6', // HTTP - Blue  
        '#f59e0b', // DNS - Yellow
        '#8b5cf6', // SSH - Purple
        '#6b7280'  // Other - Gray
      ],
      borderWidth: 0
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: { size: 12 }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.95)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#4b5563',
        borderWidth: 1,
        cornerRadius: 8
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#6b7280', font: { size: 11 } }
      },
      y: {
        grid: { color: '#f3f4f6' },
        ticks: { color: '#6b7280', font: { size: 11 } }
      }
    }
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          padding: 15,
          font: { size: 11 }
        }
      }
    },
    cutout: '65%'
  };

  // Get risk level styling
  const getRiskStyling = (riskLevel) => {
    const styles = {
      low: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200' },
      medium: { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-200' },
      high: { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-200' },
      critical: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-200' }
    };
    return styles[riskLevel] || styles.low;
  };

  // Get status styling
  const getStatusStyling = (status) => {
    const styles = {
      active: { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircleIcon },
      blocked: { bg: 'bg-red-100', text: 'text-red-800', icon: ExclamationTriangleIcon },
      suspicious: { bg: 'bg-orange-100', text: 'text-orange-800', icon: ShieldExclamationIcon }
    };
    return styles[status] || styles.active;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50 to-blue-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-lg shadow-lg border-b border-white/20 px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl shadow-lg">
              <GlobeAltIcon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                Network Monitoring
              </h1>
              <p className="text-gray-600 text-sm">Real-time network traffic analysis and threat detection</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="flex items-center space-x-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors duration-200">
              <ArrowPathIcon className="w-4 h-4" />
              <span className="text-sm font-medium">Refresh</span>
            </button>
            
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <ClockIcon className="w-4 h-4" />
              <span>Last updated: {new Date().toLocaleTimeString()}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-gray-900">{networkStats.totalConnections.toLocaleString()}</div>
                <div className="text-sm text-gray-600 font-medium">Total Connections</div>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl">
                <GlobeAltIcon className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <ArrowTrendingUpIcon className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-green-600 font-medium">+12%</span>
              <span className="text-gray-500 ml-1">from last hour</span>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-green-600">{networkStats.activeConnections.toLocaleString()}</div>
                <div className="text-sm text-gray-600 font-medium">Active Connections</div>
              </div>
              <div className="p-3 bg-green-100 rounded-xl">
                <WifiIcon className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <ArrowTrendingUpIcon className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-green-600 font-medium">+5%</span>
              <span className="text-gray-500 ml-1">from last hour</span>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-red-600">{networkStats.blockedConnections}</div>
                <div className="text-sm text-gray-600 font-medium">Blocked Connections</div>
              </div>
              <div className="p-3 bg-red-100 rounded-xl">
                <ShieldExclamationIcon className="w-8 h-8 text-red-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <ArrowTrendingDownIcon className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-green-600 font-medium">-8%</span>
              <span className="text-gray-500 ml-1">from last hour</span>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-orange-600">{networkStats.suspiciousActivity}</div>
                <div className="text-sm text-gray-600 font-medium">Suspicious Activity</div>
              </div>
              <div className="p-3 bg-orange-100 rounded-xl">
                <ExclamationTriangleIcon className="w-8 h-8 text-orange-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <ArrowTrendingUpIcon className="w-4 h-4 text-red-500 mr-1" />
              <span className="text-red-600 font-medium">+3</span>
              <span className="text-gray-500 ml-1">new alerts</span>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-8">
          {/* Traffic Chart */}
          <div className="xl:col-span-2 bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">Network Traffic</h3>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <SignalIcon className="w-4 h-4 text-green-500" />
                  <span>{networkStats.bandwidth.inbound} Mbps ↓</span>
                </div>
                <div className="flex items-center space-x-1">
                  <SignalIcon className="w-4 h-4 text-blue-500" />
                  <span>{networkStats.bandwidth.outbound} Mbps ↑</span>
                </div>
              </div>
            </div>
            <div className="h-80">
              <Line data={trafficChartData} options={chartOptions} />
            </div>
          </div>

          {/* Protocol Distribution */}
          <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">Protocol Distribution</h3>
              <div className="p-2 bg-cyan-100 rounded-lg">
                <ChartBarIcon className="w-5 h-5 text-cyan-600" />
              </div>
            </div>
            <div className="h-80 relative">
              <Doughnut data={protocolChartData} options={doughnutOptions} />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{networkStats.totalConnections.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Total</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Network Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">Recent Network Alerts</h3>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-red-600">Live</span>
              </div>
            </div>
            <div className="space-y-4 max-h-80 overflow-y-auto">
              {alerts.map(alert => {
                const severity = getRiskStyling(alert.severity);
                return (
                  <div key={alert.id} className="p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-xl border border-red-100">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <div className="p-2 bg-red-500 rounded-lg">
                          <ExclamationTriangleIcon className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 text-sm">{alert.type}</h4>
                          <p className="text-sm text-gray-600 mt-1">{alert.description}</p>
                          <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                            <span>Source: {alert.sourceIP}</span>
                            <span>{alert.affectedAssets} asset(s) affected</span>
                            <span>{new Date(alert.timestamp).toLocaleTimeString()}</span>
                          </div>
                        </div>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${severity.bg} ${severity.text} ${severity.border} border`}>
                        {alert.severity.toUpperCase()}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Geographic Distribution */}
          <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">Geographic Distribution</h3>
              <div className="p-2 bg-blue-100 rounded-lg">
                <MapIcon className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {geoData.map((geo, index) => {
                const risk = getRiskStyling(geo.risk);
                return (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">
                        {geo.country === 'United States' ? '🇺🇸' :
                         geo.country === 'Germany' ? '🇩🇪' :
                         geo.country === 'United Kingdom' ? '🇬🇧' :
                         geo.country === 'China' ? '🇨🇳' :
                         geo.country === 'Russia' ? '🇷🇺' : '🌍'}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 text-sm">{geo.country}</div>
                        <div className="text-xs text-gray-500">{geo.connections.toLocaleString()} connections</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="text-right">
                        <div className="text-sm font-semibold text-gray-900">{geo.percentage}%</div>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${risk.bg} ${risk.text}`}>
                          {geo.risk}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Live Connections Table */}
        <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">Live Network Connections</h3>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-green-600">Real-time</span>
                </div>
                <div className="text-sm text-gray-500">
                  Showing {liveConnections.length} active connections
                </div>
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-cyan-50/80 backdrop-blur-sm border-b border-cyan-100">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Source IP</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Destination</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Protocol</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Risk Level</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Data Transfer</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Duration</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {liveConnections.map(connection => {
                  const statusStyle = getStatusStyling(connection.status);
                  const riskStyle = getRiskStyling(connection.riskLevel);
                  const StatusIcon = statusStyle.icon;

                  return (
                    <tr key={connection.id} className="hover:bg-cyan-50/50 transition-colors duration-200">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <ComputerDesktopIcon className="w-4 h-4 text-gray-400" />
                          <span className="font-mono text-sm text-gray-900">{connection.sourceIP}</span>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <div className="text-2xl">
                            {connection.country === 'United States' ? '🇺🇸' :
                             connection.country === 'Russia' ? '🇷🇺' :
                             connection.country === 'China' ? '🇨🇳' : '🌍'}
                          </div>
                          <div>
                            <div className="font-mono text-sm text-gray-900">{connection.destIP}</div>
                            <div className="text-xs text-gray-500">{connection.country}</div>
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            connection.protocol === 'HTTPS' ? 'bg-green-100 text-green-800' :
                            connection.protocol === 'DNS' ? 'bg-blue-100 text-blue-800' :
                            connection.protocol === 'TCP' ? 'bg-orange-100 text-orange-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {connection.protocol}
                          </span>
                          <span className="text-xs text-gray-500">:{connection.port}</span>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className={`flex items-center space-x-1 px-2 py-1 rounded-full ${statusStyle.bg} ${statusStyle.text} w-fit`}>
                          <StatusIcon className="w-3 h-3" />
                          <span className="text-xs font-medium capitalize">{connection.status}</span>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${riskStyle.bg} ${riskStyle.text} ${riskStyle.border} border`}>
                          {connection.riskLevel.toUpperCase()}
                        </span>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {connection.bytesTransferred > 0 ? `${(connection.bytesTransferred / 1024).toFixed(1)} KB` : '0 B'}
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 font-mono">{connection.duration}</div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button className="p-1 text-cyan-600 hover:text-cyan-700 hover:bg-cyan-50 rounded">
                            <EyeIcon className="w-4 h-4" />
                          </button>
                          {connection.status !== 'blocked' && (
                            <button className="p-1 text-red-600 hover:text-red-700 hover:bg-red-50 rounded">
                              <ShieldExclamationIcon className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NetworkMonitoring;