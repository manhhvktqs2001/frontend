import React, { useState } from 'react';
import {
  Cog6ToothIcon,
  ShieldCheckIcon,
  BellIcon,
  UserGroupIcon,
  GlobeAltIcon,
  ServerIcon,
  KeyIcon,
  DocumentTextIcon,
  EyeIcon,
  EyeSlashIcon,
  CheckIcon,
  XMarkIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [showPassword, setShowPassword] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
    critical: true,
    high: true,
    medium: false,
    low: false
  });

  const [security, setSecurity] = useState({
    mfa: true,
    sessionTimeout: 30,
    passwordPolicy: 'strong',
    ipWhitelist: ['192.168.1.0/24', '10.0.0.0/8'],
    auditLogging: true
  });

  const [system, setSystem] = useState({
    autoUpdate: true,
    backupFrequency: 'daily',
    retentionPeriod: 90,
    performanceMode: 'balanced',
    debugMode: false
  });

  const tabs = [
    { id: 'general', name: 'General', icon: Cog6ToothIcon },
    { id: 'security', name: 'Security', icon: ShieldCheckIcon },
    { id: 'notifications', name: 'Notifications', icon: BellIcon },
    { id: 'system', name: 'System', icon: ServerIcon },
    { id: 'users', name: 'Users & Roles', icon: UserGroupIcon },
    { id: 'integrations', name: 'Integrations', icon: GlobeAltIcon }
  ];

  const SettingCard = ({ title, description, children }) => (
    <div className="card-modern p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-white mb-1">{title}</h3>
        <p className="text-gray-400 text-sm">{description}</p>
      </div>
      {children}
    </div>
  );

  const ToggleSwitch = ({ enabled, onChange, label }) => (
    <div className="flex items-center justify-between">
      <span className="text-gray-300 text-sm">{label}</span>
      <button
        onClick={() => onChange(!enabled)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          enabled ? 'bg-blue-600' : 'bg-gray-600'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            enabled ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <SettingCard
        title="Organization Information"
        description="Update your organization details and contact information"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-300 text-sm mb-2">Organization Name</label>
            <input
              type="text"
              defaultValue="EDR Security Corp"
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
            />
          </div>
          <div>
            <label className="block text-gray-300 text-sm mb-2">Contact Email</label>
            <input
              type="email"
              defaultValue="admin@edr-security.com"
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
            />
          </div>
          <div>
            <label className="block text-gray-300 text-sm mb-2">Phone Number</label>
            <input
              type="tel"
              defaultValue="+1 (555) 123-4567"
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
            />
          </div>
          <div>
            <label className="block text-gray-300 text-sm mb-2">Timezone</label>
            <select className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white">
              <option>UTC-05:00 Eastern Time</option>
              <option>UTC-08:00 Pacific Time</option>
              <option>UTC+00:00 GMT</option>
              <option>UTC+01:00 Central European Time</option>
            </select>
          </div>
        </div>
      </SettingCard>

      <SettingCard
        title="Display Settings"
        description="Customize the appearance and layout of the dashboard"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-gray-300 text-sm mb-2">Theme</label>
            <select className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white">
              <option>Dark (Default)</option>
              <option>Light</option>
              <option>Auto</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-300 text-sm mb-2">Language</label>
            <select className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white">
              <option>English</option>
              <option>Spanish</option>
              <option>French</option>
              <option>German</option>
            </select>
          </div>
          <ToggleSwitch
            enabled={true}
            onChange={() => {}}
            label="Show real-time updates"
          />
          <ToggleSwitch
            enabled={false}
            onChange={() => {}}
            label="Compact mode"
          />
        </div>
      </SettingCard>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <SettingCard
        title="Authentication"
        description="Configure authentication and access control settings"
      >
        <div className="space-y-4">
          <ToggleSwitch
            enabled={security.mfa}
            onChange={(enabled) => setSecurity({ ...security, mfa: enabled })}
            label="Enable Multi-Factor Authentication"
          />
          <div>
            <label className="block text-gray-300 text-sm mb-2">Session Timeout (minutes)</label>
            <input
              type="number"
              value={security.sessionTimeout}
              onChange={(e) => setSecurity({ ...security, sessionTimeout: e.target.value })}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
            />
          </div>
          <div>
            <label className="block text-gray-300 text-sm mb-2">Password Policy</label>
            <select
              value={security.passwordPolicy}
              onChange={(e) => setSecurity({ ...security, passwordPolicy: e.target.value })}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
            >
              <option value="basic">Basic (8 characters)</option>
              <option value="strong">Strong (12 characters, special chars)</option>
              <option value="very-strong">Very Strong (16 characters, complex)</option>
            </select>
          </div>
        </div>
      </SettingCard>

      <SettingCard
        title="Access Control"
        description="Manage IP whitelist and access restrictions"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-gray-300 text-sm mb-2">IP Whitelist</label>
            <textarea
              value={security.ipWhitelist.join('\n')}
              onChange={(e) => setSecurity({ ...security, ipWhitelist: e.target.value.split('\n') })}
              rows={4}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
              placeholder="Enter IP addresses or ranges (one per line)"
            />
          </div>
          <ToggleSwitch
            enabled={security.auditLogging}
            onChange={(enabled) => setSecurity({ ...security, auditLogging: enabled })}
            label="Enable audit logging"
          />
        </div>
      </SettingCard>

      <SettingCard
        title="API Security"
        description="Configure API access and rate limiting"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-gray-300 text-sm mb-2">API Key</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                defaultValue="sk-1234567890abcdef"
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 pr-10 text-white"
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showPassword ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-gray-300 text-sm mb-2">Rate Limit (requests per minute)</label>
            <input
              type="number"
              defaultValue={1000}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
            />
          </div>
          <button className="btn-secondary flex items-center gap-2">
            <ArrowPathIcon className="w-4 h-4" />
            Regenerate API Key
          </button>
        </div>
      </SettingCard>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <SettingCard
        title="Notification Channels"
        description="Configure how you receive notifications"
      >
        <div className="space-y-4">
          <ToggleSwitch
            enabled={notifications.email}
            onChange={(enabled) => setNotifications({ ...notifications, email: enabled })}
            label="Email notifications"
          />
          <ToggleSwitch
            enabled={notifications.sms}
            onChange={(enabled) => setNotifications({ ...notifications, sms: enabled })}
            label="SMS notifications"
          />
          <ToggleSwitch
            enabled={notifications.push}
            onChange={(enabled) => setNotifications({ ...notifications, push: enabled })}
            label="Push notifications"
          />
        </div>
      </SettingCard>

      <SettingCard
        title="Alert Severity"
        description="Choose which alert severities trigger notifications"
      >
        <div className="space-y-3">
          <ToggleSwitch
            enabled={notifications.critical}
            onChange={(enabled) => setNotifications({ ...notifications, critical: enabled })}
            label="Critical alerts"
          />
          <ToggleSwitch
            enabled={notifications.high}
            onChange={(enabled) => setNotifications({ ...notifications, high: enabled })}
            label="High priority alerts"
          />
          <ToggleSwitch
            enabled={notifications.medium}
            onChange={(enabled) => setNotifications({ ...notifications, medium: enabled })}
            label="Medium priority alerts"
          />
          <ToggleSwitch
            enabled={notifications.low}
            onChange={(enabled) => setNotifications({ ...notifications, low: enabled })}
            label="Low priority alerts"
          />
        </div>
      </SettingCard>
    </div>
  );

  const renderSystemSettings = () => (
    <div className="space-y-6">
      <SettingCard
        title="System Configuration"
        description="Configure system behavior and performance settings"
      >
        <div className="space-y-4">
          <ToggleSwitch
            enabled={system.autoUpdate}
            onChange={(enabled) => setSystem({ ...system, autoUpdate: enabled })}
            label="Automatic updates"
          />
          <div>
            <label className="block text-gray-300 text-sm mb-2">Backup Frequency</label>
            <select
              value={system.backupFrequency}
              onChange={(e) => setSystem({ ...system, backupFrequency: e.target.value })}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
            >
              <option value="hourly">Hourly</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-300 text-sm mb-2">Data Retention (days)</label>
            <input
              type="number"
              value={system.retentionPeriod}
              onChange={(e) => setSystem({ ...system, retentionPeriod: e.target.value })}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
            />
          </div>
          <div>
            <label className="block text-gray-300 text-sm mb-2">Performance Mode</label>
            <select
              value={system.performanceMode}
              onChange={(e) => setSystem({ ...system, performanceMode: e.target.value })}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
            >
              <option value="balanced">Balanced</option>
              <option value="performance">High Performance</option>
              <option value="power-save">Power Save</option>
            </select>
          </div>
          <ToggleSwitch
            enabled={system.debugMode}
            onChange={(enabled) => setSystem({ ...system, debugMode: enabled })}
            label="Debug mode"
          />
        </div>
      </SettingCard>

      <SettingCard
        title="Maintenance"
        description="System maintenance and troubleshooting options"
      >
        <div className="space-y-4">
          <button className="btn-secondary flex items-center gap-2">
            <ArrowPathIcon className="w-4 h-4" />
            Restart Services
          </button>
          <button className="btn-secondary flex items-center gap-2">
            <DocumentTextIcon className="w-4 h-4" />
            Export System Logs
          </button>
          <button className="btn-secondary flex items-center gap-2">
            <ExclamationTriangleIcon className="w-4 h-4" />
            Run System Diagnostics
          </button>
        </div>
      </SettingCard>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'general':
        return renderGeneralSettings();
      case 'security':
        return renderSecuritySettings();
      case 'notifications':
        return renderNotificationSettings();
      case 'system':
        return renderSystemSettings();
      default:
        return (
          <div className="text-center py-12">
            <InformationCircleIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-400">Settings for this section are coming soon.</p>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-gray-400">Configure your EDR security platform</p>
      </div>

      {/* Tabs */}
      <div className="card-modern p-2">
        <div className="flex space-x-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      {renderContent()}

      {/* Save Button */}
      <div className="flex justify-end gap-3">
        <button className="btn-secondary">Cancel</button>
        <button className="btn-primary flex items-center gap-2">
          <CheckIcon className="w-4 h-4" />
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default Settings; 