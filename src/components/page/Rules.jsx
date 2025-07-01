import React, { useEffect, useState } from 'react';
import { BoltIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import axios from 'axios';

const Rules = () => {
  const [rules, setRules] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      axios.get('http://192.168.20.85:5000/api/v1/detection/rules'),
      axios.get('http://192.168.20.85:5000/api/v1/detection/rules/stats/summary'),
    ])
      .then(([listRes, statsRes]) => {
        setRules(listRes.data.rules || []);
        setStats(statsRes.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Không thể tải danh sách rule');
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <svg className="animate-spin h-10 w-10 text-yellow-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
      </svg>
      <span className="ml-4 text-lg text-gray-600">Đang tải danh sách rule...</span>
    </div>
  );
  if (error) return <div className="text-red-500 text-center py-8">{error}</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center mb-6">
        <BoltIcon className="w-8 h-8 text-yellow-500 mr-2" />
        <h2 className="text-2xl font-bold gradient-text">Danh sách Detection Rules</h2>
      </div>
      {/* Card thống kê */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-yellow-100 to-yellow-50 rounded-xl shadow p-4 flex flex-col items-start">
          <BoltIcon className="w-6 h-6 text-yellow-500 mb-1" />
          <div className="text-xl font-bold">{stats?.total_rules ?? 0}</div>
          <div className="text-xs text-gray-600">Tổng Rule</div>
        </div>
        <div className="bg-gradient-to-br from-green-100 to-green-50 rounded-xl shadow p-4 flex flex-col items-start">
          <CheckCircleIcon className="w-6 h-6 text-green-500 mb-1" />
          <div className="text-xl font-bold">{stats?.active_rules ?? 0}</div>
          <div className="text-xs text-gray-600">Active</div>
        </div>
        <div className="bg-gradient-to-br from-gray-100 to-gray-50 rounded-xl shadow p-4 flex flex-col items-start">
          <XCircleIcon className="w-6 h-6 text-gray-500 mb-1" />
          <div className="text-xl font-bold">{stats?.inactive_rules ?? 0}</div>
          <div className="text-xs text-gray-600">Inactive</div>
        </div>
      </div>
      {/* Bảng danh sách rule */}
      <div className="overflow-x-auto rounded-xl shadow-lg bg-white">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-yellow-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Rule Name</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Rule Type</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Alert Title</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Alert Severity</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Platform</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Active</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Chi tiết</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {rules.map(rule => (
              <tr key={rule.rule_id || rule.RuleID} className="hover:bg-yellow-50 transition">
                <td className="px-4 py-2 whitespace-nowrap">{rule.rule_name || rule.RuleName}</td>
                <td className="px-4 py-2 whitespace-nowrap">{rule.rule_type || rule.RuleType}</td>
                <td className="px-4 py-2 whitespace-nowrap">{rule.alert_title || rule.AlertTitle}</td>
                <td className="px-4 py-2 whitespace-nowrap">{rule.alert_severity || rule.AlertSeverity}</td>
                <td className="px-4 py-2 whitespace-nowrap">{rule.platform || rule.Platform}</td>
                <td className="px-4 py-2 whitespace-nowrap">{(rule.is_active ?? rule.IsActive) ? <CheckCircleIcon className='w-5 h-5 text-green-500'/> : <XCircleIcon className='w-5 h-5 text-gray-400'/>}</td>
                <td className="px-4 py-2 whitespace-nowrap">
                  <a href={`/rules/${rule.rule_id || rule.RuleID}`} className="text-yellow-600 hover:underline text-sm font-medium">Xem</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Rules; 