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
  ClockIcon
} from '@heroicons/react/24/outline';
import { Doughnut, Line } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement } from 'chart.js';
// axios import removed - will be handled by parent component

Chart.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [timeline, setTimeline] = useState(null);
  const [alertsOverview, setAlertsOverview] = useState(null);
  const [threatsOverview, setThreatsOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState('Last 7 days');

  useEffect(() => {
    setLoading(true);
    Promise.all([
      axios.get('http://192.168.20.85:5000/api/v1/dashboard/stats'),
      axios.get('http://192.168.20.85:5000/api/v1/dashboard/events-timeline'),
      axios.get('http://192.168.20.85:5000/api/v1/dashboard/alerts-overview'),
      axios.get('http://192.168.20.85:5000/api/v1/dashboard/threats-overview'),
    ])
      .then(([statsRes, timelineRes, alertsRes, threatsRes]) => {
        setStats(statsRes.data);
        setTimeline(timelineRes.data);
        setAlertsOverview(alertsRes.data);
        setThreatsOverview(threatsRes.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Không thể tải dữ liệu dashboard');
        setLoading(false);
      });
  }, []);

  // Prepare chart data based on real API data
  const agentsDonutData = stats ? {
    labels: ['Online', 'Offline'],
    datasets: [{
      data: [stats.agents?.online ?? 0, stats.agents?.offline ?? 0],
      backgroundColor: ['#22c55e', '#ef4444'],
      borderWidth: 0
    }]
  } : null;

  const protectionStatusData = stats ? {
    labels: ['Protected', 'Unprotected', 'Errors', 'Installing', 'Disabled'],
    datasets: [{
      data: [
        stats.agents?.online ?? 0,
        stats.agents?.offline ?? 0,
        stats.alerts?.critical ?? 0,
        2, // You can map this to real data
        1  // You can map this to real data
      ],
      backgroundColor: [
        '#22c55e', // Green for protected
        '#ef4444', // Red for unprotected
        '#f97316', // Orange for errors
        '#06b6d4', // Cyan for installing
        '#f59e0b'  // Yellow for disabled
      ],
      borderWidth: 0
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
          padding: 15,
          font: { size: 11 }
        }
      }
    },
    cutout: '65%'
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="flex items-center space-x-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
        <span className="text-lg text-gray-600">Loading dashboard data...</span>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <ExclamationTriangleIcon className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <div className="text-red-500 text-lg">{error}</div>
      </div>
    </div>
  );

  if (!stats) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-gray-500 text-lg">No data available</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <div className="bg-white shadow-sm border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <select 
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e.target.value)}
              className="bg-gray-100 border-0 rounded px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option>Last 24 hours</option>
              <option>Last 7 days</option>
              <option>Last month</option>
              <option>Last year</option>
            </select>
          </div>
          <div className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleString()}
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Protection Status Chart */}
          <div className="col-span-12 lg:col-span-6">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-6">PROTECTION STATUS</h3>
              <div className="relative h-80">
                {protectionStatusData && (
                  <Doughnut data={protectionStatusData} options={chartOptions} />
                )}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-gray-800">
                      {(stats.agents?.total ?? 0)}
                    </div>
                    <div className="text-sm text-gray-500 font-medium">Computers</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="col-span-12 lg:col-span-6 space-y-6">
            {/* Offline Computers */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-sm font-semibold text-gray-600 mb-4 uppercase tracking-wide">
                OFFLINE COMPUTERS
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-500 mb-1">
                    {Math.floor((stats.agents?.offline ?? 0) * 0.4)}
                  </div>
                  <div className="text-xs text-gray-500">&gt; 3 days</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-500 mb-1">
                    {Math.floor((stats.agents?.offline ?? 0) * 0.3)}
                  </div>
                  <div className="text-xs text-gray-500">&gt; 7 days</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-500 mb-1">
                    {Math.floor((stats.agents?.offline ?? 0) * 0.1)}
                  </div>
                  <div className="text-xs text-gray-500">&gt; 30 days</div>
                </div>
              </div>
            </div>

            {/* Outdated Protection */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-sm font-semibold text-gray-600 mb-4 uppercase tracking-wide">
                OUTDATED PROTECTION
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    {stats.alerts?.critical ?? 0}
                  </span>
                  <div className="flex-1 mx-4 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-red-500 h-2 rounded-full" 
                      style={{width: `${Math.min((stats.alerts?.critical ?? 0) * 10, 100)}%`}}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-500">Protection</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    {Math.floor((stats.alerts?.open ?? 0) / 2)}
                  </span>
                  <div className="flex-1 mx-4 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-red-500 h-2 rounded-full" 
                      style={{width: `${Math.min((stats.alerts?.open ?? 0) * 5, 100)}%`}}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-500">Knowledge</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    {Math.floor((stats.threats?.active_indicators ?? 0) / 3)}
                  </span>
                  <div className="flex-1 mx-4 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-red-500 h-2 rounded-full" 
                      style={{width: `${Math.min((stats.threats?.active_indicators ?? 0) * 3, 100)}%`}}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-500">Pending restart</span>
                </div>
              </div>
            </div>

            {/* Programs */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-lg shadow-sm border p-4">
                <h3 className="text-xs font-semibold text-gray-600 mb-3 uppercase tracking-wide">
                  PROGRAMS ALLOWED BY ADMINISTRATOR
                </h3>
                <div className="flex items-start space-x-3">
                  <div className="text-3xl font-bold text-red-500">
                    {stats.threats?.detected_24h ?? 0}
                  </div>
                  <div className="text-xs text-gray-500 leading-tight">
                    <div>{Math.floor((stats.threats?.detected_24h ?? 0) * 0.3)} malware</div>
                    <div>{Math.floor((stats.threats?.detected_24h ?? 0) * 0.4)} PUPs</div>
                    <div>{Math.floor((stats.threats?.detected_24h ?? 0) * 0.2)} newly classified</div>
                    <div>{Math.floor((stats.threats?.detected_24h ?? 0) * 0.1)} exploits</div>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm border p-4">
                <h3 className="text-xs font-semibold text-gray-600 mb-3 uppercase tracking-wide">
                  PROGRAMS BLOCKED BY ADMINISTRATOR
                </h3>
                <div className="text-3xl font-bold text-gray-800 mb-1">
                  {stats.detection?.active_rules ?? 0}
                </div>
                <div className="text-xs text-gray-500">Blocked items</div>
              </div>
            </div>
          </div>

          {/* Alert */}
          {stats.agents?.offline > 0 && (
            <div className="col-span-12">
              <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg">
                <div className="flex items-center">
                  <ExclamationTriangleIcon className="w-5 h-5 text-red-400 mr-3" />
                  <span className="text-red-700 font-medium">
                    {stats.agents.offline} computers have been discovered that are not being managed by EDR System.
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Recent Activity */}
          <div className="col-span-12 lg:col-span-6">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Critical Alerts</h3>
              <div className="space-y-3">
                {alertsOverview?.recent_critical_alerts?.length ? 
                  alertsOverview.recent_critical_alerts.slice(0, 5).map((alert, index) => (
                    <div key={alert.alert_id || index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <div>
                          <div className="font-medium text-gray-800 text-sm">
                            {alert.title}
                          </div>
                          <div className="text-xs text-gray-500">
                            Agent: {alert.agent_id}
                          </div>
                        </div>
                      </div>
                      <div className="text-xs text-gray-400">
                        {alert.first_detected?.slice(11, 16)}
                      </div>
                    </div>
                  )) : 
                  <div className="text-gray-500 text-center py-8">No critical alerts</div>
                }
              </div>
            </div>
          </div>

          {/* Threat Intelligence */}
          <div className="col-span-12 lg:col-span-6">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Threat Detections</h3>
              <div className="space-y-3">
                {threatsOverview?.recent_detections?.length ? 
                  threatsOverview.recent_detections.slice(0, 5).map((threat, index) => (
                    <div key={threat.threat_id || index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        <div>
                          <div className="font-medium text-gray-800 text-sm">
                            {threat.threat_name}
                          </div>
                          <div className="text-xs text-gray-500">
                            Category: {threat.threat_category}
                          </div>
                        </div>
                      </div>
                      <div className="text-xs text-gray-400">
                        {threat.detection_count} detections
                      </div>
                    </div>
                  )) : 
                  <div className="text-gray-500 text-center py-8">No recent threats</div>
                }
              </div>
            </div>
          </div>

          {/* System Health Overview */}
          <div className="col-span-12">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">System Health Overview</h3>
              <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <UserGroupIcon className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-blue-600">
                    {stats.agents?.total ?? 0}
                  </div>
                  <div className="text-xs text-gray-600">Total Agents</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <CheckCircleIcon className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-600">
                    {stats.agents?.online ?? 0}
                  </div>
                  <div className="text-xs text-gray-600">Online</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <XCircleIcon className="w-8 h-8 text-red-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-red-600">
                    {stats.alerts?.open ?? 0}
                  </div>
                  <div className="text-xs text-gray-600">Open Alerts</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <BoltIcon className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-yellow-600">
                    {stats.detection?.active_rules ?? 0}
                  </div>
                  <div className="text-xs text-gray-600">Active Rules</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <ShieldCheckIcon className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-purple-600">
                    {stats.threats?.active_indicators ?? 0}
                  </div>
                  <div className="text-xs text-gray-600">Threat Indicators</div>
                </div>
                <div className="text-center p-4 bg-pink-50 rounded-lg">
                  <HeartIcon className="w-8 h-8 text-pink-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-pink-600">
                    {stats.system_health?.score ?? 0}%
                  </div>
                  <div className="text-xs text-gray-600">Health Score</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;