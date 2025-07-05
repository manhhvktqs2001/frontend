import React from 'react';
import { Cog6ToothIcon, ArrowPathIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

const GeneralSettings = ({ generalSettings, setGeneralSettings, isDarkMode, onSave, loading, saved, onReset }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white/10 rounded-2xl p-6 border border-white/10 shadow-xl">
        <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
          <Cog6ToothIcon className="w-6 h-6 text-purple-400" />
          General Settings
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* System Name */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>System Name</label>
            <input
              type="text"
              value={generalSettings.systemName || ""}
              onChange={(e) => setGeneralSettings({ ...generalSettings, systemName: e.target.value })}
              className={`w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-400 transition-all duration-200
                ${isDarkMode ? 'bg-white/10 border border-white/10 text-white placeholder:text-gray-400' : 'bg-white border border-gray-300 text-gray-800 placeholder:text-gray-500 shadow-sm hover:border-purple-400 focus:bg-white'}
              `}
            />
          </div>
          {/* Time Format */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Time Format</label>
            <select
              value={generalSettings.timeFormat || "vn"}
              onChange={e => setGeneralSettings({ ...generalSettings, timeFormat: e.target.value })}
              className={`w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-400 transition-all duration-200
                ${isDarkMode ? 'bg-white/10 border border-white/10 text-white placeholder:text-gray-400' : 'bg-white border border-gray-300 text-gray-800 placeholder:text-gray-500 shadow-sm hover:border-purple-400 focus:bg-white'}
              `}
            >
              <option value="vn">Giờ Việt Nam (24h)</option>
              <option value="ampm">Giờ quốc tế AM/PM</option>
            </select>
          </div>
        </div>
      </div>
      {/* Save Button */}
      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onReset}
          className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 font-medium shadow-lg"
        >
          Reset
        </button>
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
            <Cog6ToothIcon className="w-5 h-5" />
          )}
          {loading ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
};

export default GeneralSettings; 