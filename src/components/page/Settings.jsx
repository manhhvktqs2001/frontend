import React, { useEffect, useState } from 'react';
import { 
  Cog6ToothIcon, 
  ShieldCheckIcon,
  BellIcon,
  GlobeAltIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Form states
  const [generalSettings, setGeneralSettings] = useState({
    systemName: 'EDR Security System',
    timezone: 'UTC',
    language: 'en',
    autoRefresh: true,
    refreshInterval: 30
  });
  
  const [securitySettings, setSecuritySettings] = useState({
    sessionTimeout: 30,
    requireMFA: false,
    passwordPolicy: 'strong',
    encryptionLevel: 'high',
    auditLogging: true
  });
  
  const [notificationSettings, setNotificationSettings] = useState({
    emailAlerts: true,
    smsAlerts: false,
    webhookAlerts: false,
    alertLevel: 'high',
    quietHours: false,
    quietStart: '22:00',
    quietEnd: '08:00'
  });
  
  const [integrationSettings, setIntegrationSettings] = useState({
    apiEnabled: true,
    apiKey: 'sk-••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••',
    webhookUrl: '',
    slackIntegration: false,
    teamsIntegration: false,
    emailIntegration: true
  });

  const handleSave = async (section) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'general', name: 'General', icon: Cog6ToothIcon },
    { id: 'security', name: 'Security', icon: ShieldCheckIcon },
    { id: 'notifications', name: 'Notifications', icon: BellIcon },
    { id: 'integrations', name: 'Integrations', icon: GlobeAltIcon }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 text-white">
      {/* Header */}
      <div className="px-8 py-6 border-b border-white/10 bg-white/10 backdrop-blur-xl shadow-lg">
        <div className="flex items-center gap-4">
          <Cog6ToothIcon className="w-10 h-10 text-purple-400 drop-shadow-lg" />
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent tracking-tight">Settings</h1>
            <p className="text-gray-300 text-sm mt-1">Configure system settings and preferences</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row">
        {/* Sidebar */}
        <div className="lg:w-64 p-6 border-r border-white/10 bg-white/5">
          <nav className="space-y-2">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'text-gray-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span className="font-medium">{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div className="bg-white/10 rounded-2xl p-6 border border-white/10 shadow-xl">
                <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                  <Cog6ToothIcon className="w-6 h-6 text-purple-400" />
                  General Settings
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">System Name</label>
                    <input
                      type="text"
                      value={generalSettings.systemName}
                      onChange={(e) => setGeneralSettings({...generalSettings, systemName: e.target.value})}
                      className="w-full px-4 py-2 bg-white/10 border border-white/10 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Timezone</label>
                    <select
                      value={generalSettings.timezone}
                      onChange={(e) => setGeneralSettings({...generalSettings, timezone: e.target.value})}
                      className="w-full px-4 py-2 bg-white/10 border border-white/10 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
                    >
                      <option value="UTC">UTC</option>
                      <option value="EST">Eastern Time</option>
                      <option value="PST">Pacific Time</option>
                      <option value="GMT">GMT</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Language</label>
                    <select
                      value={generalSettings.language}
                      onChange={(e) => setGeneralSettings({...generalSettings, language: e.target.value})}
                      className="w-full px-4 py-2 bg-white/10 border border-white/10 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
                    >
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Auto Refresh Interval (seconds)</label>
                    <input
                      type="number"
                      value={generalSettings.refreshInterval}
                      onChange={(e) => setGeneralSettings({...generalSettings, refreshInterval: parseInt(e.target.value)})}
                      className="w-full px-4 py-2 bg-white/10 border border-white/10 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={generalSettings.autoRefresh}
                        onChange={(e) => setGeneralSettings({...generalSettings, autoRefresh: e.target.checked})}
                        className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      />
                      <span className="text-sm font-medium text-gray-300">Enable Auto Refresh</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <div className="bg-white/10 rounded-2xl p-6 border border-white/10 shadow-xl">
                <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                  <ShieldCheckIcon className="w-6 h-6 text-purple-400" />
                  Security Settings
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Session Timeout (minutes)</label>
                    <input
                      type="number"
                      value={securitySettings.sessionTimeout}
                      onChange={(e) => setSecuritySettings({...securitySettings, sessionTimeout: parseInt(e.target.value)})}
                      className="w-full px-4 py-2 bg-white/10 border border-white/10 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Password Policy</label>
                    <select
                      value={securitySettings.passwordPolicy}
                      onChange={(e) => setSecuritySettings({...securitySettings, passwordPolicy: e.target.value})}
                      className="w-full px-4 py-2 bg-white/10 border border-white/10 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
                    >
                      <option value="basic">Basic</option>
                      <option value="strong">Strong</option>
                      <option value="very-strong">Very Strong</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Encryption Level</label>
                    <select
                      value={securitySettings.encryptionLevel}
                      onChange={(e) => setSecuritySettings({...securitySettings, encryptionLevel: e.target.value})}
                      className="w-full px-4 py-2 bg-white/10 border border-white/10 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
                    >
                      <option value="standard">Standard</option>
                      <option value="high">High</option>
                      <option value="military">Military Grade</option>
                    </select>
                  </div>
                  <div className="space-y-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={securitySettings.requireMFA}
                        onChange={(e) => setSecuritySettings({...securitySettings, requireMFA: e.target.checked})}
                        className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      />
                      <span className="text-sm font-medium text-gray-300">Require Multi-Factor Authentication</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={securitySettings.auditLogging}
                        onChange={(e) => setSecuritySettings({...securitySettings, auditLogging: e.target.checked})}
                        className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      />
                      <span className="text-sm font-medium text-gray-300">Enable Audit Logging</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div className="bg-white/10 rounded-2xl p-6 border border-white/10 shadow-xl">
                <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                  <BellIcon className="w-6 h-6 text-purple-400" />
                  Notification Settings
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Alert Level</label>
                    <select
                      value={notificationSettings.alertLevel}
                      onChange={(e) => setNotificationSettings({...notificationSettings, alertLevel: e.target.value})}
                      className="w-full px-4 py-2 bg-white/10 border border-white/10 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
                    >
                      <option value="all">All Alerts</option>
                      <option value="high">High and Critical</option>
                      <option value="critical">Critical Only</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Quiet Hours Start</label>
                    <input
                      type="time"
                      value={notificationSettings.quietStart}
                      onChange={(e) => setNotificationSettings({...notificationSettings, quietStart: e.target.value})}
                      className="w-full px-4 py-2 bg-white/10 border border-white/10 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Quiet Hours End</label>
                    <input
                      type="time"
                      value={notificationSettings.quietEnd}
                      onChange={(e) => setNotificationSettings({...notificationSettings, quietEnd: e.target.value})}
                      className="w-full px-4 py-2 bg-white/10 border border-white/10 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={notificationSettings.emailAlerts}
                        onChange={(e) => setNotificationSettings({...notificationSettings, emailAlerts: e.target.checked})}
                        className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      />
                      <span className="text-sm font-medium text-gray-300">Email Alerts</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={notificationSettings.smsAlerts}
                        onChange={(e) => setNotificationSettings({...notificationSettings, smsAlerts: e.target.checked})}
                        className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      />
                      <span className="text-sm font-medium text-gray-300">SMS Alerts</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={notificationSettings.webhookAlerts}
                        onChange={(e) => setNotificationSettings({...notificationSettings, webhookAlerts: e.target.checked})}
                        className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      />
                      <span className="text-sm font-medium text-gray-300">Webhook Alerts</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={notificationSettings.quietHours}
                        onChange={(e) => setNotificationSettings({...notificationSettings, quietHours: e.target.checked})}
                        className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      />
                      <span className="text-sm font-medium text-gray-300">Enable Quiet Hours</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'integrations' && (
            <div className="space-y-6">
              <div className="bg-white/10 rounded-2xl p-6 border border-white/10 shadow-xl">
                <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                  <GlobeAltIcon className="w-6 h-6 text-purple-400" />
                  Integration Settings
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">API Key</label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={integrationSettings.apiKey}
                        onChange={(e) => setIntegrationSettings({...integrationSettings, apiKey: e.target.value})}
                        className="w-full px-4 py-2 pr-12 bg-white/10 border border-white/10 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
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
                    <label className="block text-sm font-medium text-gray-300 mb-2">Webhook URL</label>
                    <input
                      type="url"
                      value={integrationSettings.webhookUrl}
                      onChange={(e) => setIntegrationSettings({...integrationSettings, webhookUrl: e.target.value})}
                      placeholder="https://your-webhook-url.com"
                      className="w-full px-4 py-2 bg-white/10 border border-white/10 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder:text-gray-400"
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={integrationSettings.apiEnabled}
                        onChange={(e) => setIntegrationSettings({...integrationSettings, apiEnabled: e.target.checked})}
                        className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      />
                      <span className="text-sm font-medium text-gray-300">Enable API Access</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={integrationSettings.slackIntegration}
                        onChange={(e) => setIntegrationSettings({...integrationSettings, slackIntegration: e.target.checked})}
                        className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      />
                      <span className="text-sm font-medium text-gray-300">Slack Integration</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={integrationSettings.teamsIntegration}
                        onChange={(e) => setIntegrationSettings({...integrationSettings, teamsIntegration: e.target.checked})}
                        className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      />
                      <span className="text-sm font-medium text-gray-300">Microsoft Teams Integration</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={integrationSettings.emailIntegration}
                        onChange={(e) => setIntegrationSettings({...integrationSettings, emailIntegration: e.target.checked})}
                        className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      />
                      <span className="text-sm font-medium text-gray-300">Email Integration</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              onClick={() => handleSave(activeTab)}
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
      </div>
    </div>
  );
};

export default Settings; 