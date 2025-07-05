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
import { useTheme } from '../../contexts/ThemeContext';
import GeneralSettings from './GeneralSettings';
import ActionSettings from './ActionSettings';
import Select from 'react-select';

const Settings = () => {
  const { isDarkMode, isTransitioning } = useTheme();
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingSection, setPendingSection] = useState(null);
  const [globalActionMode, setGlobalActionMode] = useState('alert_and_action');
  
  // Form states
  const [defaultGeneralSettings, setDefaultGeneralSettings] = useState({
    systemName: 'EDR Security System',
    timeFormat: 'vn',
  });
  const [generalSettings, setGeneralSettings] = useState(defaultGeneralSettings);

  const [actionSettings, setActionSettings] = useState({
    killProcess: {
      enabled: true,
      requiresApproval: false,
      severityLevel: 'high',
      riskThreshold: 80,
      notifyAdmin: true,
      notifyUser: false,
      parameters: {
        forceKill: true,
        timeoutSeconds: 30
      }
    },
    isolateHost: {
      enabled: true,
      requiresApproval: true,
      severityLevel: 'critical',
      riskThreshold: 90,
      notifyAdmin: true,
      notifyUser: true,
      parameters: {
        blockAllConnections: true,
        allowAdminAccess: true,
        isolationDurationHours: 24
      }
    },
    quarantineFile: {
      enabled: true,
      requiresApproval: false,
      severityLevel: 'medium',
      riskThreshold: 60,
      notifyAdmin: true,
      notifyUser: false,
      parameters: {
        quarantineLocation: '/var/quarantine',
        backupOriginal: true,
        scanQuarantined: true
      }
    },
    blockIP: {
      enabled: true,
      requiresApproval: false,
      severityLevel: 'high',
      riskThreshold: 75,
      notifyAdmin: true,
      notifyUser: false,
      parameters: {
        blockDurationHours: 24,
        blockDirection: 'both',
        firewallRuleName: 'edr_blocked_ip'
      }
    },
    disableUser: {
      enabled: true,
      requiresApproval: true,
      severityLevel: 'critical',
      riskThreshold: 85,
      notifyAdmin: true,
      notifyUser: true,
      parameters: {
        disableDurationHours: 24,
        forceLogout: true,
        preventLogin: true
      }
    },
    restartService: {
      enabled: false,
      requiresApproval: true,
      severityLevel: 'medium',
      riskThreshold: 70,
      notifyAdmin: true,
      notifyUser: false,
      parameters: {
        serviceName: '',
        restartDelaySeconds: 5,
        maxRestartAttempts: 3
      }
    }
  });

  // Thêm các constant cho event types, action types, severity levels
  const EVENT_TYPES = [
    { key: 'Process', label: 'Process' },
    { key: 'Network', label: 'Network' },
    { key: 'File', label: 'File' }
  ];
  const ACTION_TYPES = {
    Process: [
      { key: 'kill_process', label: 'Kill Process' }
    ],
    Network: [
      { key: 'block_network', label: 'Block Network' }
    ],
    File: [
      { key: 'quarantine_file', label: 'Quarantine File' }
    ]
  };
  const SEVERITY_OPTIONS = [
    { value: 'Low', label: 'Low', color: '#22c55e' },
    { value: 'Medium', label: 'Medium', color: '#eab308' },
    { value: 'High', label: 'High', color: '#f97316' },
    { value: 'Critical', label: 'Critical', color: '#ef4444' }
  ];

  // State cho cấu hình actions theo event type
  const [eventActions, setEventActions] = useState(() =>
    EVENT_TYPES.map(evt => ({
      event_type: evt.key,
      enabled: false,
      action: ACTION_TYPES[evt.key][0].key,
      severity: ['High', 'Critical'],
      config: {}
    }))
  );

  const AGENT_ID = localStorage.getItem('agent_id') || 'demo-agent-001'; // Thay bằng agent_id thực tế nếu có

  const handleSave = async (section) => {
    setLoading(true);
    try {
      let endpoint = '';
      let data = {};
      switch (section) {
        case 'general':
          endpoint = '/api/v1/settings/general';
          data = { ...generalSettings };
          break;
        case 'actions':
          endpoint = '/api/v1/actions';
          let saveEventActions;
          if (globalActionMode === 'alert_only') {
            // Nếu chỉ gửi cảnh báo, reset eventActions về mặc định
            saveEventActions = EVENT_TYPES.map(evt => ({
              event_type: evt.key,
              enabled: false,
              action: ACTION_TYPES[evt.key][0].key,
              severity: ['High', 'Critical'],
              config: {}
            }));
          } else {
            // Nếu là alert_and_action, gửi đầy đủ eventActions theo lựa chọn
            saveEventActions = eventActions;
          }
          data = { globalActionMode, eventActions: saveEventActions };
          console.log('Dữ liệu gửi lên server:', data);
          localStorage.setItem('actionSettingsV2', JSON.stringify(data));
          await fetch(`/api/v1/agents/${AGENT_ID}/action-settings`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
          });
          break;
        default:
          endpoint = '/api/v1/settings';
          data = { generalSettings, globalActionMode, eventActions };
      }
      
      // Simulate API call
      console.log(`Saving ${section} settings:`, data);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Lưu generalSettings vào localStorage nếu là tab General
      if (section === 'general') {
        localStorage.setItem('generalSettings', JSON.stringify(generalSettings));
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveClick = (section) => {
    setPendingSection(section);
    setShowConfirm(true);
  };

  const handleConfirmYes = () => {
    setShowConfirm(false);
    if (pendingSection) handleSave(pendingSection);
    setPendingSection(null);
  };

  const handleConfirmNo = () => {
    setShowConfirm(false);
    setPendingSection(null);
  };

  const handleEventActionChange = (idx, field, value) => {
    setEventActions(prev => prev.map((item, i) =>
      i === idx ? { ...item, [field]: value } : item
    ));
  };
  const handleSeverityChange = (idx, value) => {
    setEventActions(prev => prev.map((item, i) =>
      i === idx ? { ...item, severity: value } : item
    ));
  };
  const handleConfigChange = (idx, key, value) => {
    setEventActions(prev => prev.map((item, i) =>
      i === idx ? { ...item, config: { ...item.config, [key]: value } } : item
    ));
  };

  const tabs = [
    { id: 'general', name: 'General', icon: Cog6ToothIcon },
    { id: 'actions', name: 'Actions', icon: ShieldCheckIcon }
  ];

  useEffect(() => {
    if (generalSettings && generalSettings.systemName) {
      document.title = generalSettings.systemName;
    } else {
      document.title = 'EDR System Dashboard';
    }
  }, [generalSettings.systemName]);

  useEffect(() => {
    const saved = localStorage.getItem('generalSettings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (!parsed.systemName) parsed.systemName = 'EDR Security System';
        delete parsed.autoRefresh;
        delete parsed.refreshInterval;
        setDefaultGeneralSettings(parsed);
        setGeneralSettings(parsed);
        if (parsed.eventActions) setEventActions(Array.isArray(parsed.eventActions) ? parsed.eventActions : []);
        return;
      } catch {}
    }
    async function fetchDefaultSettings() {
      try {
        const res = await fetch('/api/v1/settings/general/default');
        const data = await res.json();
        if (!data.systemName) data.systemName = 'EDR Security System';
        delete data.autoRefresh;
        delete data.refreshInterval;
        setDefaultGeneralSettings(data);
        setGeneralSettings(data);
        if (data.eventActions) setEventActions(Array.isArray(data.eventActions) ? data.eventActions : []);
      } catch (e) {
        setDefaultGeneralSettings({
          systemName: 'EDR Security System',
          timeFormat: 'vn',
        });
        setGeneralSettings({
          systemName: 'EDR Security System',
          timeFormat: 'vn',
        });
      }
    }
    fetchDefaultSettings();
  }, []);

  useEffect(() => {
    if (activeTab === 'general') {
      if (JSON.stringify(generalSettings) !== JSON.stringify(defaultGeneralSettings)) {
        setGeneralSettings(defaultGeneralSettings);
      }
    }
    // eslint-disable-next-line
  }, [activeTab, defaultGeneralSettings]);

  // Khi vào tab actions, ưu tiên lấy localStorage trước, sau đó mới gọi backend
  useEffect(() => {
    if (activeTab === 'actions') {
      // Ưu tiên lấy localStorage trước để giữ UI
      const saved = localStorage.getItem('actionSettingsV2');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed.globalActionMode) setGlobalActionMode(parsed.globalActionMode);
          if (parsed.eventActions) setEventActions(Array.isArray(parsed.eventActions) ? parsed.eventActions : []);
          console.log('LocalStorage actionSettingsV2:', parsed);
        } catch {}
      }
      // Gọi backend để lấy dữ liệu mới nhất (nếu có)
      const fetchSettings = async () => {
        try {
          const res = await fetch(`/api/v1/agents/${AGENT_ID}/action-settings`);
          if (res.ok) {
            const data = await res.json();
            console.log('API action-settings:', data);
            if (
              data &&
              typeof data.globalActionMode === 'string' &&
              Array.isArray(data.eventActions) &&
              data.eventActions.length > 0
            ) {
              // Nếu API trả về đúng mặc định (alert_only + 4 eventActions mặc định), bỏ qua không set state
              const isDefault =
                data.globalActionMode === 'alert_only' &&
                data.eventActions.length === 4 &&
                data.eventActions.every(ea =>
                  ['Process', 'Network', 'File', 'Registry'].includes(ea.event_type) &&
                  ea.enabled === false
                );
              if (!isDefault) {
                setGlobalActionMode(data.globalActionMode);
                setEventActions(data.eventActions);
              }
            }
          }
        } catch {}
      };
      fetchSettings();
    }
  }, [activeTab]);

  return (
    <div className={`
      min-h-screen transition-all duration-300
      ${isDarkMode 
        ? 'bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 text-white' 
        : 'bg-gradient-to-br from-indigo-50 via-white to-purple-50 text-gray-900'
      }
      ${isTransitioning ? 'theme-transitioning' : ''}
    `}>
      {/* Header */}
      <div className={`
        px-8 py-6 border-b shadow-lg backdrop-blur-xl transition-all duration-300
        ${isDarkMode 
          ? 'border-white/10 bg-white/10' 
          : 'border-gray-200/50 bg-white/80'
        }
      `}>
        <div className="flex items-center gap-4">
          <Cog6ToothIcon className={`
            w-10 h-10 drop-shadow-lg transition-colors duration-300
            ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}
          `} />
          <div>
            <h1 className={`
              text-3xl font-bold tracking-tight transition-colors duration-300
              ${isDarkMode 
                ? 'bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent' 
                : 'bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent'
              }
            `}>
              Settings
            </h1>
            <p className={`
              text-sm mt-1 transition-colors duration-300
              ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}
            `}>
              Configure system settings and preferences
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row">
        {/* Sidebar */}
        <div className="lg:w-64 p-6 border-r border-white/10 bg-white/5">
          <nav className="space-y-2">
            {tabs.map(tab => {
              let tabIconColor = '';
              let tabTextColor = '';
              if (activeTab === tab.id) {
                tabIconColor = 'text-white';
                tabTextColor = 'text-white';
              } else {
                switch (tab.id) {
                  case 'general': tabIconColor = 'text-purple-500'; break;
                  case 'actions': tabIconColor = 'text-blue-500'; break;
                  default: tabIconColor = 'text-gray-400';
                }
                tabTextColor = isDarkMode ? 'text-gray-200' : 'text-gray-700';
              }
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200
                    ${activeTab === tab.id
                      ? 'bg-purple-600 text-white shadow-lg font-semibold'
                      : `bg-white/5 font-semibold hover:bg-purple-50 hover:text-purple-700 border border-gray-200/20 ${tabTextColor}`}
                  `}
                >
                  <tab.icon className={`w-5 h-5 ${tabIconColor} transition-colors duration-200`} />
                  <span className={`font-medium ${tabTextColor}`}>{tab.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {activeTab === 'general' && (
            <GeneralSettings
              generalSettings={generalSettings}
              setGeneralSettings={setGeneralSettings}
              isDarkMode={isDarkMode}
              onSave={() => handleSaveClick('general')}
              loading={loading}
              saved={saved}
            />
          )}

          {activeTab === 'actions' && (
            <div className={`
              bg-white/10 dark:bg-slate-900 rounded-2xl p-6 border border-white/10 shadow-xl
              transition-all duration-300
            `}>
              <h2 className={`
                text-2xl font-bold mb-6 flex items-center gap-3
                ${isDarkMode ? 'text-white' : 'text-gray-900'}
              `}>
                <span className="inline-block w-8 h-8 bg-purple-500 dark:bg-purple-400 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" /></svg>
                </span>
                Action Settings
                </h2>
              <div className="mb-6 flex gap-8 items-center">
                <label className="inline-flex items-center">
                    <input
                    type="radio"
                    name="global-action-mode"
                    value="alert_only"
                    checked={globalActionMode === 'alert_only'}
                    onChange={() => setGlobalActionMode('alert_only')}
                    className="accent-blue-500"
                  />
                  <span className="ml-2 text-base">Chỉ gửi cảnh báo</span>
                    </label>
                <label className="inline-flex items-center">
                      <input
                    type="radio"
                    name="global-action-mode"
                    value="alert_and_action"
                    checked={globalActionMode === 'alert_and_action'}
                    onChange={() => setGlobalActionMode('alert_and_action')}
                    className="accent-purple-600"
                  />
                  <span className="ml-2 text-base">Gửi cảnh báo và ngăn chặn</span>
                    </label>
                  </div>
              {globalActionMode === 'alert_and_action' ? (
                <>
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm rounded-xl overflow-hidden shadow border border-white/10">
                      <thead>
                        <tr className={isDarkMode ? "bg-slate-800 text-gray-200" : "bg-gray-100 text-gray-700"}>
                          <th className="p-3 font-semibold">Event Type</th>
                          <th className="p-3 font-semibold">Enable</th>
                          <th className="p-3 font-semibold">Action</th>
                          <th className="p-3 font-semibold">Severity</th>
                          <th className="p-3 font-semibold">Config</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(Array.isArray(eventActions) ? eventActions : []).map((item, idx) => (
                          <tr key={item.event_type} className={isDarkMode ? "border-b border-white/10" : "border-b border-gray-200"}>
                            <td className="p-3 font-medium">{item.event_type}</td>
                            <td className="p-3">
                      <input
                        type="checkbox"
                                checked={item.enabled}
                                onChange={e => handleEventActionChange(idx, 'enabled', e.target.checked)}
                                className="w-5 h-5 accent-purple-600"
                              />
                            </td>
                            <td className="p-3">
                              {ACTION_TYPES[item.event_type].length === 1 ? (
                                <span className={`inline-block px-3 py-1 rounded-full font-semibold text-sm shadow
                                  ${isDarkMode ? 'bg-purple-700 text-white' : 'bg-purple-100 text-purple-700'}`}
                                >
                                  {ACTION_TYPES[item.event_type][0].label}
                                </span>
                              ) : (
                        <select
                                  className={`
                                    rounded px-2 py-1
                                    ${isDarkMode ? 'bg-slate-800 text-white border-white/20' : 'bg-white text-gray-900 border-gray-300'}
                                    border focus:ring-2 focus:ring-purple-400
                                    transition-all
                                  `}
                                  value={item.action}
                                  onChange={e => handleEventActionChange(idx, 'action', e.target.value)}
                                  disabled={!item.enabled}
                                >
                                  {ACTION_TYPES[item.event_type].map(opt => (
                                    <option key={opt.key} value={opt.key}>{opt.label}</option>
                                  ))}
                        </select>
                              )}
                            </td>
                            <td className="p-3">
                              <Select
                                isMulti
                                value={SEVERITY_OPTIONS.filter(opt => item.severity.includes(opt.value))}
                                onChange={opts => handleSeverityChange(idx, opts.map(o => o.value))}
                                options={SEVERITY_OPTIONS}
                                className="min-w-[160px] text-sm"
                                styles={{
                                  multiValue: (base, state) => ({
                                    ...base,
                                    backgroundColor: state.data.color + '22',
                                    color: state.data.color,
                                    borderRadius: 6,
                                    padding: '0 4px'
                                  }),
                                  multiValueLabel: (base, state) => ({
                                    ...base,
                                    color: state.data.color,
                                    fontWeight: 600
                                  }),
                                  multiValueRemove: (base, state) => ({
                                    ...base,
                                    color: state.data.color,
                                    ':hover': { backgroundColor: state.data.color, color: 'white' }
                                  }),
                                  control: (base, state) => ({
                                    ...base,
                                    backgroundColor: isDarkMode ? '#1e293b' : '#fff',
                                    borderColor: isDarkMode ? '#6366f1' : '#a5b4fc',
                                    minHeight: 36,
                                    boxShadow: state.isFocused ? '0 0 0 2px #a78bfa' : base.boxShadow
                                  }),
                                  menu: (base) => ({
                                    ...base,
                                    backgroundColor: isDarkMode ? '#1e293b' : '#fff',
                                    color: isDarkMode ? '#fff' : '#000',
                                  }),
                                  option: (base, state) => ({
                                    ...base,
                                    backgroundColor: state.isSelected ? state.data.color + '22' : state.isFocused ? '#ede9fe' : 'inherit',
                                    color: state.data.color,
                                    fontWeight: state.isSelected ? 700 : 500
                                  })
                                }}
                                isDisabled={!item.enabled}
                                theme={theme => ({
                                  ...theme,
                                  borderRadius: 6,
                                  colors: {
                                    ...theme.colors,
                                    primary25: '#ede9fe',
                                    primary: '#a78bfa',
                                    neutral0: isDarkMode ? '#1e293b' : '#fff',
                                    neutral80: isDarkMode ? '#fff' : '#000',
                                  }
                                })}
                              />
                            </td>
                            <td className="p-3">
                              {/* Config phụ thuộc action */}
                              {item.enabled && item.action === 'kill_process' && (
                                <label className="flex items-center gap-2 group cursor-not-allowed select-none">
                                  <span className="relative inline-block w-6 h-6 align-middle">
                          <input
                            type="checkbox"
                                      checked={true}
                                      disabled
                                      className="opacity-0 absolute w-6 h-6 cursor-not-allowed"
                                      tabIndex={-1}
                                      readOnly
                                    />
                                    <span className="absolute inset-0 rounded bg-white/10 flex items-center justify-center">
                                      <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none">
                                        <path d="M5 10.5L9 15L15 7" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                                      </svg>
                                    </span>
                                  </span>
                                  <span className="text-sm font-semibold text-red-500 group-hover:text-red-400 transition-colors">Force Kill</span>
                        </label>
                              )}
                              {item.enabled && item.action === 'block_network' && (
                                <label className="flex items-center gap-2">
                                  <span className="text-sm">Block Duration (h):</span>
                                  <input type="number" min={1} className="w-16 rounded px-1 py-0.5 bg-slate-800 text-white border border-white/20" value={item.config.block_duration_hours || 24} onChange={e => handleConfigChange(idx, 'block_duration_hours', Number(e.target.value))} />
                    </label>
                              )}
                              {item.enabled && item.action === 'quarantine_file' && (
                                <label className="flex items-center gap-2">
                                  <input type="checkbox" checked={item.config.backup || false} onChange={e => handleConfigChange(idx, 'backup', e.target.checked)} className="accent-green-600" />
                                  <span className="text-sm">Backup File</span>
                        </label>
                              )}
                              {item.enabled && item.action === 'block_registry' && (
                                <span className="text-sm text-yellow-400">Block Registry Change</span>
                              )}
                              {item.enabled && item.action === 'disable_user' && (
                                <label className="flex items-center gap-2">
                                  <span className="text-sm">Duration (h):</span>
                                  <input type="number" min={1} className="w-16 rounded px-1 py-0.5 bg-slate-800 text-white border border-white/20" value={item.config.disable_duration_hours || 24} onChange={e => handleConfigChange(idx, 'disable_duration_hours', Number(e.target.value))} />
                    </label>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="mt-6 flex justify-end">
                    <button
                      className={`
                        px-6 py-2 rounded-lg font-semibold shadow-lg transition-all
                        ${isDarkMode
                          ? 'bg-purple-600 text-white hover:bg-purple-700'
                          : 'bg-purple-600 text-white hover:bg-purple-700'}
                      `}
                      onClick={() => handleSaveClick('actions')}
                      disabled={loading}
                    >
                      Save Actions
                    </button>
                    {saved && (
                      <span className="ml-4 text-green-400 font-medium flex items-center gap-2"><CheckCircleIcon className="w-5 h-5" /> Saved!</span>
                   )}
                 </div>
                </>
              ) : (
                <>
                  <div className="p-6 text-lg text-blue-400 font-semibold">
                    Server sẽ chỉ gửi cảnh báo, không thực hiện hành động tự động nào.
                       </div>
                  <div className="mt-6 flex justify-end">
                    <button
                      className={`
                        px-6 py-2 rounded-lg font-semibold shadow-lg transition-all
                        ${isDarkMode
                          ? 'bg-purple-600 text-white hover:bg-purple-700'
                          : 'bg-purple-600 text-white hover:bg-purple-700'}
                      `}
                      onClick={() => handleSaveClick('actions')}
                      disabled={loading}
                    >
                      Save Actions
                    </button>
                    {saved && (
                      <span className="ml-4 text-green-400 font-medium flex items-center gap-2"><CheckCircleIcon className="w-5 h-5" /> Saved!</span>
                    )}
                       </div>
                </>
              )}
                     </div>
                   )}
                 </div>
                   </div>
                   
      {/* Modal xác nhận */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-xl flex flex-col items-center gap-6">
            <div className="text-lg font-semibold text-gray-900 dark:text-white">Bạn có muốn thay đổi không?</div>
            <div className="flex gap-4">
              <button onClick={handleConfirmYes} className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium">Yes</button>
              <button onClick={handleConfirmNo} className="px-6 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 font-medium">No</button>
                       </div>
                       </div>
                     </div>
                   )}
                 </div>
  );
};

// Thông báo Saved! chỉ hiển thị một lần duy nhất
export default function SettingsWrapper(props) {
  const settings = Settings(props);
  const [saved, setSaved] = React.useState(false);
  // ... existing code ...
  return (
    <>
      {settings}
      {saved && (
        <div className="fixed bottom-8 right-8 bg-purple-500 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-2 z-50">
                <CheckCircleIcon className="w-5 h-5" />
          Saved
          </div>
      )}
    </>
  );
} 
