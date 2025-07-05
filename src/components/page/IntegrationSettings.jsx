import React from 'react';
import { GlobeAltIcon, ArrowPathIcon, CheckCircleIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

const IntegrationSettings = ({ integrationSettings, setIntegrationSettings, isDarkMode, showPassword, setShowPassword, onSave, loading, saved }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white/10 rounded-2xl p-6 border border-white/10 shadow-xl">
        <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
          <GlobeAltIcon className="w-6 h-6 text-purple-400" />
          Integration Settings
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>API Key</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={integrationSettings.apiKey}
                onChange={(e) => setIntegrationSettings({ ...integrationSettings, apiKey: e.target.value })}
                className={`w-full px-4 py-2 pr-12 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-400 transition-all duration-200
                  ${isDarkMode ? 'bg-white/10 border border-white/10 text-white placeholder:text-gray-400' : 'bg-white border border-gray-300 text-gray-800 placeholder:text-gray-500 shadow-sm hover:border-purple-400 focus:bg-white'}
                `}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                ) : (
                  <EyeIcon className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
          </div>
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Webhook URL</label>
            <input
              type="url"
              value={integrationSettings.webhookUrl}
              onChange={(e) => setIntegrationSettings({ ...integrationSettings, webhookUrl: e.target.value })}
              placeholder="https://your-webhook-url.com"
              className={`w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-400 transition-all duration-200
                ${isDarkMode ? 'bg-white/10 border border-white/10 text-white placeholder:text-gray-400' : 'bg-white border border-gray-300 text-gray-800 placeholder:text-gray-500 shadow-sm hover:border-purple-400 focus:bg-white'}
              `}
            />
          </div>
          <div className="space-y-4">
            <label className={`flex items-center gap-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <input
                type="checkbox"
                checked={integrationSettings.apiEnabled}
                onChange={(e) => setIntegrationSettings({ ...integrationSettings, apiEnabled: e.target.checked })}
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <span className="text-sm font-medium text-gray-300">Enable API Access</span>
            </label>
            <label className={`flex items-center gap-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <input
                type="checkbox"
                checked={integrationSettings.slackIntegration}
                onChange={(e) => setIntegrationSettings({ ...integrationSettings, slackIntegration: e.target.checked })}
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <span className="text-sm font-medium text-gray-300">Slack Integration</span>
            </label>
            <label className={`flex items-center gap-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <input
                type="checkbox"
                checked={integrationSettings.teamsIntegration}
                onChange={(e) => setIntegrationSettings({ ...integrationSettings, teamsIntegration: e.target.checked })}
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <span className="text-sm font-medium text-gray-300">Microsoft Teams Integration</span>
            </label>
            <label className={`flex items-center gap-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <input
                type="checkbox"
                checked={integrationSettings.emailIntegration}
                onChange={(e) => setIntegrationSettings({ ...integrationSettings, emailIntegration: e.target.checked })}
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <span className="text-sm font-medium text-gray-300">Email Integration</span>
            </label>
          </div>
        </div>
      </div>
      <div className="flex justify-end">
        <button
          onClick={onSave}
          disabled={loading}
          className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium disabled:opacity-50 shadow-lg"
        >
          {loading ? (
            <ArrowPathIcon className="w-5 h-5 animate-spin" />
          ) : saved ? (
            <CheckCircleIcon className="w-5 h-5" />
          ) : (
            <GlobeAltIcon className="w-5 h-5" />
          )}
          {loading ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
};

export default IntegrationSettings; 