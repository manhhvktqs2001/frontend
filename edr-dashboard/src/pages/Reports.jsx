import React, { useState } from 'react';
import {
  DocumentChartBarIcon,
  CalendarIcon,
  ArrowDownTrayIcon,
  EyeIcon,
  ClockIcon,
  UserGroupIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  FunnelIcon,
  DocumentTextIcon,
  TableCellsIcon,
  PresentationChartBarIcon
} from '@heroicons/react/24/outline';

const Reports = () => {
  const [selectedReport, setSelectedReport] = useState(null);
  const [dateRange, setDateRange] = useState('7d');
  const [reportType, setReportType] = useState('all');

  const reportTemplates = [
    {
      id: 1,
      name: 'Security Overview Report',
      description: 'Comprehensive security status and threat analysis',
      icon: DocumentChartBarIcon,
      category: 'security',
      duration: '5 min',
      lastGenerated: '2 hours ago',
      schedule: 'Weekly'
    },
    {
      id: 2,
      name: 'Threat Intelligence Report',
      description: 'Detailed threat analysis and intelligence summary',
      icon: ShieldCheckIcon,
      category: 'threats',
      duration: '3 min',
      lastGenerated: '1 day ago',
      schedule: 'Daily'
    },
    {
      id: 3,
      name: 'Endpoint Status Report',
      description: 'Agent health and endpoint protection status',
      icon: UserGroupIcon,
      category: 'endpoints',
      duration: '2 min',
      lastGenerated: '6 hours ago',
      schedule: 'Daily'
    },
    {
      id: 4,
      name: 'Incident Response Report',
      description: 'Security incidents and response activities',
      icon: ExclamationTriangleIcon,
      category: 'incidents',
      duration: '4 min',
      lastGenerated: '3 days ago',
      schedule: 'Weekly'
    },
    {
      id: 5,
      name: 'Compliance Report',
      description: 'Regulatory compliance and audit findings',
      icon: DocumentTextIcon,
      category: 'compliance',
      duration: '8 min',
      lastGenerated: '1 week ago',
      schedule: 'Monthly'
    },
    {
      id: 6,
      name: 'Performance Analytics',
      description: 'System performance and optimization metrics',
      icon: ChartBarIcon,
      category: 'performance',
      duration: '6 min',
      lastGenerated: '2 days ago',
      schedule: 'Weekly'
    }
  ];

  const recentReports = [
    {
      id: 1,
      name: 'Security Overview Report',
      type: 'PDF',
      size: '2.4 MB',
      generated: '2 hours ago',
      status: 'completed'
    },
    {
      id: 2,
      name: 'Threat Intelligence Report',
      type: 'PDF',
      size: '1.8 MB',
      generated: '1 day ago',
      status: 'completed'
    },
    {
      id: 3,
      name: 'Endpoint Status Report',
      type: 'Excel',
      size: '3.2 MB',
      generated: '6 hours ago',
      status: 'completed'
    },
    {
      id: 4,
      name: 'Incident Response Report',
      type: 'PDF',
      size: '4.1 MB',
      generated: '3 days ago',
      status: 'completed'
    }
  ];

  const scheduledReports = [
    {
      id: 1,
      name: 'Daily Security Summary',
      schedule: 'Daily at 8:00 AM',
      recipients: ['admin@company.com', 'security@company.com'],
      status: 'active',
      nextRun: 'Tomorrow at 8:00 AM'
    },
    {
      id: 2,
      name: 'Weekly Threat Report',
      schedule: 'Every Monday at 9:00 AM',
      recipients: ['management@company.com'],
      status: 'active',
      nextRun: 'Monday at 9:00 AM'
    },
    {
      id: 3,
      name: 'Monthly Compliance Report',
      schedule: 'First day of month at 10:00 AM',
      recipients: ['compliance@company.com'],
      status: 'paused',
      nextRun: 'February 1st at 10:00 AM'
    }
  ];

  const ReportCard = ({ report }) => (
    <div className="card-modern p-6 hover-lift cursor-pointer" onClick={() => setSelectedReport(report)}>
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl bg-blue-500/20`}>
          <report.icon className="w-6 h-6 text-blue-400" />
        </div>
        <div className="text-right">
          <span className="text-xs text-gray-400">{report.duration}</span>
          <p className="text-xs text-gray-500 mt-1">{report.schedule}</p>
        </div>
      </div>
      <h3 className="text-white font-semibold mb-2">{report.name}</h3>
      <p className="text-gray-400 text-sm mb-3">{report.description}</p>
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500">Last: {report.lastGenerated}</span>
        <button className="btn-primary text-xs px-3 py-1">
          Generate
        </button>
      </div>
    </div>
  );

  const RecentReportItem = ({ report }) => (
    <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-green-500/20">
          <DocumentChartBarIcon className="w-4 h-4 text-green-400" />
        </div>
        <div>
          <p className="text-white font-medium text-sm">{report.name}</p>
          <p className="text-gray-400 text-xs">{report.type} • {report.size}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-500">{report.generated}</span>
        <button className="p-1 text-gray-400 hover:text-white transition-colors">
          <ArrowDownTrayIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  const ScheduledReportItem = ({ report }) => (
    <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${report.status === 'active' ? 'bg-green-500/20' : 'bg-gray-500/20'}`}>
          <ClockIcon className={`w-4 h-4 ${report.status === 'active' ? 'text-green-400' : 'text-gray-400'}`} />
        </div>
        <div>
          <p className="text-white font-medium text-sm">{report.name}</p>
          <p className="text-gray-400 text-xs">{report.schedule}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-500">{report.nextRun}</span>
        <button className={`px-2 py-1 rounded text-xs font-medium ${
          report.status === 'active' 
            ? 'bg-green-500/20 text-green-400' 
            : 'bg-gray-500/20 text-gray-400'
        }`}>
          {report.status}
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Security Reports</h1>
          <p className="text-gray-400">Generate and manage comprehensive security reports</p>
        </div>
        <div className="flex items-center gap-4">
          <button className="btn-secondary flex items-center gap-2">
            <Cog6ToothIcon className="w-4 h-4" />
            Settings
          </button>
          <button className="btn-primary flex items-center gap-2">
            <DocumentChartBarIcon className="w-4 h-4" />
            New Report
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="card-modern p-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <FunnelIcon className="w-4 h-4 text-gray-400" />
            <span className="text-gray-400 text-sm">Filter:</span>
          </div>
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="bg-white/10 border border-white/20 rounded-lg px-3 py-1 text-white text-sm"
          >
            <option value="all">All Reports</option>
            <option value="security">Security</option>
            <option value="threats">Threats</option>
            <option value="endpoints">Endpoints</option>
            <option value="incidents">Incidents</option>
            <option value="compliance">Compliance</option>
            <option value="performance">Performance</option>
          </select>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="bg-white/10 border border-white/20 rounded-lg px-3 py-1 text-white text-sm"
          >
            <option value="1d">Last 24 hours</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
        </div>
      </div>

      {/* Report Templates */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">Report Templates</h2>
          <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">
            View All Templates
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reportTemplates
            .filter(report => reportType === 'all' || report.category === reportType)
            .map((report) => (
              <ReportCard key={report.id} report={report} />
            ))}
        </div>
      </div>

      {/* Recent Reports & Scheduled Reports */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Reports */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">Recent Reports</h2>
            <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">
              View All
            </button>
          </div>
          <div className="space-y-3">
            {recentReports.map((report) => (
              <RecentReportItem key={report.id} report={report} />
            ))}
          </div>
        </div>

        {/* Scheduled Reports */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">Scheduled Reports</h2>
            <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">
              Manage
            </button>
          </div>
          <div className="space-y-3">
            {scheduledReports.map((report) => (
              <ScheduledReportItem key={report.id} report={report} />
            ))}
          </div>
        </div>
      </div>

      {/* Report Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card-modern p-6 text-center">
          <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
            <DocumentChartBarIcon className="w-6 h-6 text-blue-400" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">24</h3>
          <p className="text-gray-400 text-sm">Reports Generated</p>
        </div>
        <div className="card-modern p-6 text-center">
          <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
            <ClockIcon className="w-6 h-6 text-green-400" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">3</h3>
          <p className="text-gray-400 text-sm">Scheduled Reports</p>
        </div>
        <div className="card-modern p-6 text-center">
          <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
            <ArrowDownTrayIcon className="w-6 h-6 text-purple-400" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">156</h3>
          <p className="text-gray-400 text-sm">Downloads</p>
        </div>
        <div className="card-modern p-6 text-center">
          <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
            <EyeIcon className="w-6 h-6 text-orange-400" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">89</h3>
          <p className="text-gray-400 text-sm">Views</p>
        </div>
      </div>

      {/* Report Generation Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-white">Generate Report</h3>
              <button
                onClick={() => setSelectedReport(null)}
                className="text-gray-400 hover:text-white"
              >
                ×
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 text-sm mb-2">Report Type</label>
                <input
                  type="text"
                  value={selectedReport.name}
                  readOnly
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm mb-2">Date Range</label>
                <select className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white">
                  <option>Last 24 hours</option>
                  <option>Last 7 days</option>
                  <option>Last 30 days</option>
                  <option>Custom range</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-300 text-sm mb-2">Format</label>
                <select className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white">
                  <option>PDF</option>
                  <option>Excel</option>
                  <option>CSV</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setSelectedReport(null)}
                  className="flex-1 btn-secondary"
                >
                  Cancel
                </button>
                <button className="flex-1 btn-primary">
                  Generate
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports; 