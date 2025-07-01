import React, { useState, useEffect } from 'react';
import {
  Cog6ToothIcon,
  ShieldCheckIcon,
  BellIcon,
  UserGroupIcon,
  ServerIcon,
  KeyIcon,
  CloudIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  ArrowPathIcon,
  EyeIcon,
  EyeSlashIcon,
  PlusIcon,
  TrashIcon,
  PencilIcon
} from '@heroicons/react/24/outline';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [errors, setErrors] = useState({});

  // Settings tabs
  const settingsTabs = [
    {
      id: 'general',
      label: 'General',
      icon: Cog6ToothIcon,
      description: 'Basic system configuration'
    },
    {
      id: 'security',
      label: 'Security',
      icon: ShieldCheckIcon,
      description: 'Security policies and rules'
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: BellIcon,
      description: 'Alert and notification settings'
    },
    {
      id: 'users',
      label: 'Users & Roles',
      icon: UserGroupIcon,
      description: 'User management and permissions'
    },
    {
      id: 'integrations',
      label: 'Integrations',
      icon: CloudIcon,
      description: 'Third-party service integrations'
    },
    {
      id: 'backup',
      label: 'Backup & Recovery',
      icon: ServerIcon,
      description: 'Data backup and recovery options'
    }
  ];

  // Load settings
  useEffect(() => {
    fetchSettings();
  }, [activeTab]);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://192.168.20.85:5000/api/v1/settings/${activeTab}`);
      const data = await response.json();
      setSettings(data.settings || {});
    } catch (error) {
      console.error('Failed to load settings:', error);
    } finally {
      setLoading(false);
    }
  };

  // Save settings
  const saveSettings = async () => {
    setLoading(true);
    setErrors({});
    
    try {
      const response = await fetch(`http://192.168.20.85:5000/api/v1/settings/${activeTab}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings)
      });
      
      if (response.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        const errorData = await response.json();
        setErrors(errorData.errors || {});
      }
    } catch (error) {
      console.error('Failed to save settings:', error);
      setErrors({ general: 'Failed to save settings. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  // Update setting value
  const updateSetting = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // General Settings Component
  const GeneralSettings = () => {
    const [showAdvanced, setShowAdvanced] = useState(false);

    return (
      <div className="space-y-6">
        <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20">
          <h3 className="text-lg font-bold text-gray-900 mb-4">System Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                System Name
              </label>
              <input
                type="text"
                value={settings.system_name || 'EDR Security System'}
                onChange={(e) => updateSetting('system_name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Organization
              </label>
              <input
                type="text"
                value={settings.organization || 'Security Operations Center'}
                onChange={(e) => updateSetting('organization', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time Zone
              </label>
              <select
                value={settings.timezone || 'UTC'}
                onChange={(e) => updateSetting('timezone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="UTC">UTC</option>
                <option value="America/New_York">Eastern Time</option>
                <option value="America/Los_Angeles">Pacific Time</option>
                <option value="Europe/London">London</option>
                <option value="Asia/Tokyo">Tokyo</option>
                <option value="Asia/Ho_Chi_Minh">Ho Chi Minh City</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Language
              </label>
              <select
                value={settings.language || 'en'}
                onChange={(e) => updateSetting('language', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="en">English</option>
                <option value="vi">Tiếng Việt</option>
                <option value="ja">日本語</option>
                <option value="zh">中文</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">Performance Settings</h3>
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              {showAdvanced ? 'Hide Advanced' : 'Show Advanced'}
            </button>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-900">Auto Refresh Dashboard</label>
                <p className="text-xs text-gray-500">Automatically refresh dashboard data</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.auto_refresh || false}
                  onChange={(e) => updateSetting('auto_refresh', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Refresh Interval (seconds)
              </label>
              <input
                type="number"
                min="10"
                max="300"
                value={settings.refresh_interval || 30}
                onChange={(e) => updateSetting('refresh_interval', parseInt(e.target.value))}
                className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {showAdvanced && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Events Per Page
                  </label>
                  <input
                    type="number"
                    min="10"
                    max="1000"
                    value={settings.max_events_per_page || 50}
                    onChange={(e) => updateSetting('max_events_per_page', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Data Retention (days)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="365"
                    value={settings.data_retention_days || 90}
                    onChange={(e) => updateSetting('data_retention_days', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Security Settings Component
  const SecuritySettings = () => {
    const [showApiKey, setShowApiKey] = useState(false);

    return (
      <div className="space-y-6">
        <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Authentication Settings</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-900">Two-Factor Authentication</label>
                <p className="text-xs text-gray-500">Require 2FA for all user logins</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.require_2fa || false}
                  onChange={(e) => updateSetting('require_2fa', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Session Timeout (minutes)
              </label>
              <input
                type="number"
                min="5"
                max="480"
                value={settings.session_timeout || 60}
                onChange={(e) => updateSetting('session_timeout', parseInt(e.target.value))}
                className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password Policy
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Minimum Length</label>
                  <input
                    type="number"
                    min="6"
                    max="32"
                    value={settings.min_password_length || 8}
                    onChange={(e) => updateSetting('min_password_length', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.require_uppercase || false}
                      onChange={(e) => updateSetting('require_uppercase', e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-xs text-gray-600">Require uppercase</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.require_numbers || false}
                      onChange={(e) => updateSetting('require_numbers', e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-xs text-gray-600">Require numbers</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.require_symbols || false}
                      onChange={(e) => updateSetting('require_symbols', e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-xs text-gray-600">Require symbols</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20">
          <h3 className="text-lg font-bold text-gray-900 mb-4">API Security</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                API Key
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type={showApiKey ? 'text' : 'password'}
                  value={settings.api_key || 'edr_key_*********************'}
                  onChange={(e) => updateSetting('api_key', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                />
                <button
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  {showApiKey ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                </button>
                <button className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                  Generate New
                </button>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rate Limiting (requests per minute)
              </label>
              <input
                type="number"
                min="10"
                max="10000"
                value={settings.api_rate_limit || 1000}
                onChange={(e) => updateSetting('api_rate_limit', parseInt(e.target.value))}
                className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Notifications Settings Component
  const NotificationSettings = () => {
    const [emailSettings, setEmailSettings] = useState({
      enabled: settings.email_notifications || false,
      smtp_server: settings.smtp_server || '',
      smtp_port: settings.smtp_port || 587,
      smtp_username: settings.smtp_username || '',
      smtp_password: settings.smtp_password || '',
      from_email: settings.from_email || ''
    });

    return (
      <div className="space-y-6">
        <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Alert Notifications</h3>
          
          <div className="space-y-4">
            {['Critical', 'High', 'Medium', 'Low'].map(severity => (
              <div key={severity} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    severity === 'Critical' ? 'bg-red-500' :
                    severity === 'High' ? 'bg-orange-500' :
                    severity === 'Medium' ? 'bg-yellow-500' : 'bg-green-500'
                  }`}></div>
                  <div>
                    <span className="font-medium text-gray-900">{severity} Alerts</span>
                    <p className="text-xs text-gray-500">Notify when {severity.toLowerCase()} alerts are triggered</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings[`notify_${severity.toLowerCase()}_email`] || false}
                      onChange={(e) => updateSetting(`notify_${severity.toLowerCase()}_email`, e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-600">Email</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings[`notify_${severity.toLowerCase()}_sms`] || false}
                      onChange={(e) => updateSetting(`notify_${severity.toLowerCase()}_sms`, e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-600">SMS</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings[`notify_${severity.toLowerCase()}_dashboard`] || true}
                      onChange={(e) => updateSetting(`notify_${severity.toLowerCase()}_dashboard`, e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-600">Dashboard</span>
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Email Configuration</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <label className="text-sm font-medium text-gray-900">Enable Email Notifications</label>
                <p className="text-xs text-gray-500">Send notifications via email</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={emailSettings.enabled}
                  onChange={(e) => {
                    setEmailSettings(prev => ({ ...prev, enabled: e.target.checked }));
                    updateSetting('email_notifications', e.target.checked);
                  }}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {emailSettings.enabled && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SMTP Server
                  </label>
                  <input
                    type="text"
                    value={emailSettings.smtp_server}
                    onChange={(e) => {
                      setEmailSettings(prev => ({ ...prev, smtp_server: e.target.value }));
                      updateSetting('smtp_server', e.target.value);
                    }}
                    placeholder="smtp.gmail.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SMTP Port
                  </label>
                  <input
                    type="number"
                    value={emailSettings.smtp_port}
                    onChange={(e) => {
                      setEmailSettings(prev => ({ ...prev, smtp_port: parseInt(e.target.value) }));
                      updateSetting('smtp_port', parseInt(e.target.value));
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Username
                  </label>
                  <input
                    type="text"
                    value={emailSettings.smtp_username}
                    onChange={(e) => {
                      setEmailSettings(prev => ({ ...prev, smtp_username: e.target.value }));
                      updateSetting('smtp_username', e.target.value);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    value={emailSettings.smtp_password}
                    onChange={(e) => {
                      setEmailSettings(prev => ({ ...prev, smtp_password: e.target.value }));
                      updateSetting('smtp_password', e.target.value);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    From Email Address
                  </label>
                  <input
                    type="email"
                    value={emailSettings.from_email}
                    onChange={(e) => {
                      setEmailSettings(prev => ({ ...prev, from_email: e.target.value }));
                      updateSetting('from_email', e.target.value);
                    }}
                    placeholder="noreply@yourcompany.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm">
                    Test Email Configuration
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Render active tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return <GeneralSettings />;
      case 'security':
        return <SecuritySettings />;
      case 'notifications':
        return <NotificationSettings />;
      case 'users':
        return <div className="text-center py-12 text-gray-500">User management coming soon...</div>;
      case 'integrations':
        return <div className="text-center py-12 text-gray-500">Integrations management coming soon...</div>;
      case 'backup':
        return <div className="text-center py-12 text-gray-500">Backup settings coming soon...</div>;
      default:
        return <GeneralSettings />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-lg shadow-lg border-b border-white/20 px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-r from-gray-600 to-blue-600 rounded-xl shadow-lg">
              <Cog6ToothIcon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-600 to-blue-600 bg-clip-text text-transparent">
                System Settings
              </h1>
              <p className="text-gray-600 text-sm">Configure system preferences and security settings</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {saved && (
              <div className="flex items-center space-x-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg">
                <CheckCircleIcon className="w-5 h-5" />
                <span className="text-sm font-medium">Settings saved!</span>
              </div>
            )}
            
            <button
              onClick={saveSettings}
              disabled={loading}
              className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50"
            >
              {loading ? (
                <ArrowPathIcon className="w-4 h-4 animate-spin" />
              ) : (
                <CheckCircleIcon className="w-4 h-4" />
              )}
              <span className="text-sm font-medium">Save Settings</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-80 bg-white/70 backdrop-blur-lg shadow-lg border-r border-white/20 min-h-screen">
          <div className="p-6">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">
              Configuration
            </h3>
            <nav className="space-y-2">
              {settingsTabs.map(tab => {
                const TabIcon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center p-2 rounded-lg transition-all duration-200 mb-1 ${
                      activeTab === tab.id ? 'bg-blue-100' : 'bg-gray-100'
                    }`}
                  >
                    <div className={`p-2 rounded-lg mr-3 transition-all duration-200 ${
                      activeTab === tab.id ? 'bg-blue-200' : 'bg-gray-200'
                    }`}>
                      <TabIcon className={`w-5 h-5 ${
                        activeTab === tab.id ? 'text-blue-600' : 'text-gray-500'
                      }`} />
                    </div>
                    <div className="flex-1 text-left">
                      <div className={`font-semibold ${activeTab === tab.id ? 'text-blue-700' : 'text-gray-900'}`}>{tab.label}</div>
                      <div className={`text-xs ${activeTab === tab.id ? 'text-blue-600 opacity-80' : 'text-gray-500'}`}>{tab.description}</div>
                    </div>
                    {activeTab === tab.id && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full ml-2"></div>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {/* Error Messages */}
          {Object.keys(errors).length > 0 && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />
                <h4 className="font-medium text-red-800">Configuration Errors</h4>
              </div>
              <ul className="text-sm text-red-700 space-y-1">
                {Object.entries(errors).map(([key, message]) => (
                  <li key={key}>• {message}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Tab Content */}
          {loading ? (
            <div className="space-y-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20">
                  <div className="animate-pulse">
                    <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
                    <div className="space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-10 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            renderTabContent()
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;