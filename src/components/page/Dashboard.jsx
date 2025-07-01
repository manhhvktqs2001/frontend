import React, { useEffect, useState } from 'react';
import { UserGroupIcon, ExclamationTriangleIcon, ShieldCheckIcon, ChartBarIcon, BoltIcon, HeartIcon } from '@heroicons/react/24/outline';
import { Doughnut, Line } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement } from 'chart.js';
import axios from 'axios';
Chart.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement);

const cardList = [
  {
    label: 'Agents',
    icon: <UserGroupIcon className="w-8 h-8 text-blue-500" />,
    value: stats => stats?.agents?.total ?? 0,
    sub: stats => `Online: ${stats?.agents?.online ?? 0} / Offline: ${stats?.agents?.offline ?? 0}`,
    color: 'from-blue-100 to-blue-50',
  },
  {
    label: 'Events (24h)',
    icon: <ChartBarIcon className="w-8 h-8 text-indigo-500" />,
    value: stats => stats?.events?.last_24h ?? 0,
    sub: stats => `Suspicious: ${stats?.events?.suspicious_24h ?? 0}`,
    color: 'from-indigo-100 to-indigo-50',
  },
  {
    label: 'Alerts',
    icon: <ExclamationTriangleIcon className="w-8 h-8 text-red-500" />,
    value: stats => stats?.alerts?.open ?? 0,
    sub: stats => `Critical: ${stats?.alerts?.critical ?? 0}`,
    color: 'from-red-100 to-red-50',
  },
  {
    label: 'Threats',
    icon: <ShieldCheckIcon className="w-8 h-8 text-emerald-500" />,
    value: stats => stats?.threats?.active_indicators ?? 0,
    sub: stats => `Detected 24h: ${stats?.threats?.detected_24h ?? 0}`,
    color: 'from-emerald-100 to-emerald-50',
  },
  {
    label: 'Rules',
    icon: <BoltIcon className="w-8 h-8 text-yellow-500" />,
    value: stats => stats?.detection?.active_rules ?? 0,
    sub: stats => `Detection Rate: ${stats?.detection?.detection_rate ?? 0}%`,
    color: 'from-yellow-100 to-yellow-50',
  },
  {
    label: 'Health',
    icon: <HeartIcon className="w-8 h-8 text-pink-500" />,
    value: stats => stats?.system_health?.score ?? 0,
    sub: stats => `Status: ${stats?.system_health?.status ?? ''}`,
    color: 'from-pink-100 to-pink-50',
  },
];

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [timeline, setTimeline] = useState(null);
  const [alertsOverview, setAlertsOverview] = useState(null);
  const [threatsOverview, setThreatsOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  // Dữ liệu cho biểu đồ Donut
  const donutData = stats ? {
    labels: ['Online', 'Offline'],
    datasets: [
      {
        data: [stats.agents?.online ?? 0, stats.agents?.offline ?? 0],
        backgroundColor: ['#22c55e', '#ef4444'],
        borderWidth: 2,
      },
    ],
  } : null;

  // Dữ liệu cho biểu đồ timeline
  const lineData = timeline ? {
    labels: timeline.timeline.map(item => `${item.time_unit}h`),
    datasets: [
      {
        label: 'Sự kiện',
        data: timeline.timeline.map(item => item.count),
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59,130,246,0.1)',
        tension: 0.4,
      },
      {
        label: 'Threat',
        data: timeline.threat_timeline.map(item => item.threat_count),
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239,68,68,0.1)',
        tension: 0.4,
      },
    ],
  } : null;

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <svg className="animate-spin h-10 w-10 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
      </svg>
      <span className="ml-4 text-lg text-gray-600">Đang tải dữ liệu...</span>
    </div>
  );
  if (error) return <div className="text-red-500 text-center py-8">{error}</div>;
  if (!stats) return <div className="text-gray-500 text-center py-8">Không có dữ liệu</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold mb-8 gradient-text">Dashboard Tổng Quan</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
        {cardList.map((card, idx) => (
          <div key={idx} className={`bg-gradient-to-br ${card.color} rounded-xl shadow-lg p-6 flex flex-col items-start card-hover transition-transform duration-200 hover:-translate-y-1`}>
            <div className="mb-2">{card.icon}</div>
            <div className="text-2xl font-bold mb-1">{card.value(stats)}</div>
            <div className="text-gray-600 text-sm mb-2">{card.label}</div>
            <div className="text-xs text-gray-500">{card.sub(stats)}</div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center">
          <h3 className="text-lg font-semibold mb-4 text-blue-700">Tỉ lệ Agent Online/Offline</h3>
          {donutData && <Doughnut key={JSON.stringify(donutData)} data={donutData} options={{ cutout: '70%', plugins: { legend: { position: 'bottom' } } }} />}
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center">
          <h3 className="text-lg font-semibold mb-4 text-indigo-700">Timeline Sự kiện & Threat</h3>
          {lineData && <Line key={JSON.stringify(lineData)} data={lineData} options={{ plugins: { legend: { position: 'bottom' } }, responsive: true, maintainAspectRatio: false, height: 300 }} />}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-red-700">Alert quan trọng gần đây</h3>
          <ul className="divide-y divide-gray-200">
            {alertsOverview?.recent_critical_alerts?.length ? alertsOverview.recent_critical_alerts.map(alert => (
              <li key={alert.alert_id} className="py-2 flex flex-col md:flex-row md:items-center justify-between">
                <span className="font-medium text-gray-800">{alert.title}</span>
                <span className="ml-2 text-xs text-red-500 font-semibold">{alert.severity}</span>
                <span className="ml-2 text-xs text-gray-500">Agent: {alert.agent_id}</span>
                <span className="ml-2 text-xs text-gray-400">{alert.first_detected?.slice(0,16).replace('T',' ')}</span>
              </li>
            )) : <li className="text-gray-400">Không có alert quan trọng gần đây</li>}
          </ul>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-emerald-700">Threat phát hiện gần đây</h3>
          <ul className="divide-y divide-gray-200">
            {threatsOverview?.recent_detections?.length ? threatsOverview.recent_detections.map(threat => (
              <li key={threat.threat_id} className="py-2 flex flex-col md:flex-row md:items-center justify-between">
                <span className="font-medium text-gray-800">{threat.threat_name}</span>
                <span className="ml-2 text-xs text-emerald-500 font-semibold">{threat.threat_category}</span>
                <span className="ml-2 text-xs text-gray-500">Số lần phát hiện: {threat.detection_count}</span>
              </li>
            )) : <li className="text-gray-400">Không có threat mới gần đây</li>}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 