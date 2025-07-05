import React, { useState, useEffect } from 'react';
import { 
  ShieldCheckIcon, 
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  EyeIcon
} from '@heroicons/react/24/outline';

const ActionStatus = ({ agentId, isDarkMode }) => {
  const [actionStatus, setActionStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchActionStatus();
  }, [agentId]);

  const fetchActionStatus = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/v1/agents/${agentId}/action-status`);
      if (response.ok) {
        const data = await response.json();
        setActionStatus(data);
      } else {
        setError('Failed to fetch action status');
      }
    } catch (err) {
      setError('Error fetching action status');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      case 'default':
        return <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500" />;
      default:
        return <XCircleIcon className="w-5 h-5 text-red-500" />;
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'Critical':
        return 'text-red-500';
      case 'High':
        return 'text-orange-500';
      case 'Medium':
        return 'text-yellow-500';
      case 'Low':
        return 'text-green-500';
      default:
        return 'text-gray-500';
    }
  };

  if (loading) {
    return (
      <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-gray-100'}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-300 rounded w-1/4 mb-4"></div>
          <div className="space-y-2">
            <div className="h-3 bg-gray-300 rounded"></div>
            <div className="h-3 bg-gray-300 rounded w-5/6"></div>
            <div className="h-3 bg-gray-300 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`p-6 rounded-lg border border-red-200 ${isDarkMode ? 'bg-slate-800' : 'bg-red-50'}`}>
        <div className="flex items-center gap-2 text-red-600">
          <XCircleIcon className="w-5 h-5" />
          <span>{error}</span>
        </div>
      </div>
    );
  }

  if (!actionStatus) {
    return null;
  }

  return (
    <div className={`p-6 rounded-lg border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Action Settings Status
        </h3>
        <div className="flex items-center gap-2">
          {getStatusIcon(actionStatus.status)}
          <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {actionStatus.status}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {/* Global Action Mode */}
        <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheckIcon className="w-4 h-4 text-blue-500" />
            <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Global Action Mode
            </span>
          </div>
          <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {actionStatus.global_action_mode === 'alert_and_action' ? (
              <span className="text-green-600 font-medium">Alert and Action</span>
            ) : (
              <span className="text-yellow-600 font-medium">Alert Only</span>
            )}
          </div>
        </div>

        {/* Enabled Actions */}
        <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
          <div className="flex items-center gap-2 mb-2">
            <EyeIcon className="w-4 h-4 text-purple-500" />
            <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Enabled Actions ({actionStatus.enabled_actions_count})
            </span>
          </div>
          {actionStatus.enabled_actions.length > 0 ? (
            <div className="space-y-2">
              {actionStatus.enabled_actions.map((action, index) => (
                <div key={index} className={`p-2 rounded ${isDarkMode ? 'bg-slate-600' : 'bg-white'} border ${isDarkMode ? 'border-slate-600' : 'border-gray-200'}`}>
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {action.event_type} → {action.action.replace('_', ' ')}
                    </span>
                    <div className="flex gap-1">
                      {action.severity.map((sev, idx) => (
                        <span
                          key={idx}
                          className={`text-xs px-2 py-1 rounded-full ${getSeverityColor(sev)} ${isDarkMode ? 'bg-slate-600' : 'bg-gray-100'}`}
                        >
                          {sev}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              No actions enabled
            </div>
          )}
        </div>

        {/* Action Statistics */}
        <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
          <div className="flex items-center gap-2 mb-2">
            <ClockIcon className="w-4 h-4 text-green-500" />
            <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Action Statistics
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Executed:</span>
              <span className={`ml-2 font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {actionStatus.action_stats?.total_actions_executed || 0}
              </span>
            </div>
            <div>
              <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Successful:</span>
              <span className={`ml-2 font-medium text-green-600`}>
                {actionStatus.action_stats?.successful_actions || 0}
              </span>
            </div>
            <div>
              <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Failed:</span>
              <span className={`ml-2 font-medium text-red-600`}>
                {actionStatus.action_stats?.failed_actions || 0}
              </span>
            </div>
            <div>
              <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Last Action:</span>
              <span className={`ml-2 font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {actionStatus.action_stats?.last_action_executed || 'Never'}
              </span>
            </div>
          </div>
        </div>

        {/* Last Updated */}
        <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Last updated: {actionStatus.last_updated}
        </div>
      </div>
    </div>
  );
};

export default ActionStatus; 