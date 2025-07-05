import React from 'react';
import { ShieldCheckIcon, ArrowPathIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

const SecuritySettings = ({ securitySettings, setSecuritySettings, isDarkMode, onSave, loading, saved }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white/10 rounded-2xl p-6 border border-white/10 shadow-xl">
        <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
          <ShieldCheckIcon className="w-6 h-6 text-purple-400" />
          Security Settings
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Session Timeout (minutes)</label>
            <input
              type="number"
              value={securitySettings.sessionTimeout}
              onChange={(e) => setSecuritySettings({ ...securitySettings, sessionTimeout: parseInt(e.target.value) })}
              className={`w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-400 transition-all duration-200
                ${isDarkMode ? 'bg-white/10 border border-white/10 text-white placeholder:text-gray-400' : 'bg-white border border-gray-300 text-gray-800 placeholder:text-gray-500 shadow-sm hover:border-purple-400 focus:bg-white'}
              `}
            />
          </div>
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Password Policy</label>
            <select
              value={securitySettings.passwordPolicy}
              onChange={(e) => setSecuritySettings({ ...securitySettings, passwordPolicy: e.target.value })}
              className={`w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-400 transition-all duration-200
                ${isDarkMode ? 'bg-white/10 border border-white/10 text-white placeholder:text-gray-400' : 'bg-white border border-gray-300 text-gray-800 placeholder:text-gray-500 shadow-sm hover:border-purple-400 focus:bg-white'}
              `}
            >
              <option value="basic">Basic</option>
              <option value="strong">Strong</option>
              <option value="very-strong">Very Strong</option>
            </select>
          </div>
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Encryption Level</label>
            <select
              value={securitySettings.encryptionLevel}
              onChange={(e) => setSecuritySettings({ ...securitySettings, encryptionLevel: e.target.value })}
              className={`w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-400 transition-all duration-200
                ${isDarkMode ? 'bg-white/10 border border-white/10 text-white placeholder:text-gray-400' : 'bg-white border border-gray-300 text-gray-800 placeholder:text-gray-500 shadow-sm hover:border-purple-400 focus:bg-white'}
              `}
            >
              <option value="standard">Standard</option>
              <option value="high">High</option>
              <option value="military">Military Grade</option>
            </select>
          </div>
          <div className="space-y-4">
            <label className={`flex items-center gap-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <input
                type="checkbox"
                checked={securitySettings.requireMFA}
                onChange={(e) => setSecuritySettings({ ...securitySettings, requireMFA: e.target.checked })}
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <span className="text-sm font-medium text-gray-300">Require Multi-Factor Authentication</span>
            </label>
            <label className={`flex items-center gap-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <input
                type="checkbox"
                checked={securitySettings.auditLogging}
                onChange={(e) => setSecuritySettings({ ...securitySettings, auditLogging: e.target.checked })}
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <span className="text-sm font-medium text-gray-300">Enable Audit Logging</span>
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
            <ShieldCheckIcon className="w-5 h-5" />
          )}
          {loading ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
};

export default SecuritySettings; 