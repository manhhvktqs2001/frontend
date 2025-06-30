import React from 'react';

export const Dashboard: React.FC = () => {
  return (
    <div>
      <div className="grid grid-cols-4 gap-6 mb-8">
        {/* Top cards */}
        <div className="col-span-1 bg-gray-900 rounded-xl p-6 flex flex-col justify-between border-t-4 border-green-500">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">💻</span>
            <span className="text-lg font-semibold">Active Agents</span>
          </div>
          <div className="text-4xl font-bold">1,247</div>
          <div className="text-green-400 text-sm mt-2">↑ +2.3% from last week</div>
        </div>
        <div className="col-span-1 bg-gray-900 rounded-xl p-6 flex flex-col justify-between border-t-4 border-red-500">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">🦠</span>
            <span className="text-lg font-semibold">Active Threats</span>
          </div>
          <div className="text-4xl font-bold">22</div>
          <div className="text-red-400 text-sm mt-2">↓ -12.5% from yesterday</div>
        </div>
        <div className="col-span-1 bg-gray-900 rounded-xl p-6 flex flex-col justify-between border-t-4 border-yellow-500">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">⚠️</span>
            <span className="text-lg font-semibold">Open Alerts</span>
          </div>
          <div className="text-4xl font-bold">89</div>
          <div className="text-green-400 text-sm mt-2">↑ +7.8% from last hour</div>
        </div>
        <div className="col-span-1 bg-gray-900 rounded-xl p-6 flex flex-col justify-between border-t-4 border-cyan-500">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">📋</span>
            <span className="text-lg font-semibold">Events Today</span>
          </div>
          <div className="text-4xl font-bold">15.2k</div>
          <div className="text-green-400 text-sm mt-2">↑ +15.2% from yesterday</div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-6 mb-8">
        {/* Threat Detection Timeline */}
        <div className="bg-gray-900 rounded-xl p-6">
          <div className="font-semibold text-lg mb-2">Threat Detection Timeline</div>
          <div className="h-48 flex items-center justify-center text-gray-400">[Chart Placeholder]</div>
          <div className="flex gap-4 mt-4 text-sm">
            <span className="flex items-center gap-1 text-red-400"><span className="w-3 h-3 rounded-full bg-red-500 inline-block"></span>Critical Threats</span>
            <span className="flex items-center gap-1 text-yellow-400"><span className="w-3 h-3 rounded-full bg-yellow-400 inline-block"></span>High Threats</span>
          </div>
        </div>
        {/* Alert Severity Distribution */}
        <div className="bg-gray-900 rounded-xl p-6">
          <div className="font-semibold text-lg mb-2">Alert Severity Distribution</div>
          <div className="h-48 flex items-center justify-center text-gray-400">[Pie Chart Placeholder]</div>
        </div>
      </div>
      <div className="bg-gray-900 rounded-xl p-6">
        <div className="font-semibold text-lg mb-4">Recent Security Alerts</div>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg bg-gray-800">
            <div>
              <div className="font-semibold text-base text-orange-400">Phishing Attempt Detected</div>
              <div className="text-gray-300 text-sm">New security event detected on LAPTOP-HR-052</div>
              <div className="text-xs text-gray-500">Just now</div>
            </div>
            <div className="flex gap-2">
              <button className="btn btn-primary">Investigate</button>
              <button className="btn btn-ghost">Dismiss</button>
            </div>
          </div>
          <div className="flex items-center justify-between p-4 rounded-lg bg-gray-800">
            <div>
              <div className="font-semibold text-base text-red-400">Brute Force Attack Detected</div>
              <div className="text-gray-300 text-sm">New security event detected on WORKSTATION-001</div>
              <div className="text-xs text-gray-500">Just now</div>
            </div>
            <div className="flex gap-2">
              <button className="btn btn-primary">Investigate</button>
              <button className="btn btn-ghost">Dismiss</button>
            </div>
          </div>
          <div className="flex items-center justify-between p-4 rounded-lg bg-gray-800">
            <div>
              <div className="font-semibold text-base text-pink-400">Mimikatz Credential Dumping Detected</div>
              <div className="text-gray-300 text-sm">High-confidence detection of Mimikatz tool usage on WORKSTATION-047</div>
              <div className="text-xs text-gray-500">2 minutes ago</div>
            </div>
            <div className="flex gap-2">
              <button className="btn btn-primary">Investigate</button>
              <button className="btn btn-ghost">Dismiss</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 