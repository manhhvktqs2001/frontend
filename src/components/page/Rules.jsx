import React, { useEffect, useState } from 'react';
import { 
  BoltIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowPathIcon,
  EyeIcon,
  ClockIcon,
  PlusIcon,
  Cog6ToothIcon,
  PlayIcon,
  PauseIcon,
  DocumentTextIcon,
  ShieldCheckIcon,
  ComputerDesktopIcon,
  ExclamationTriangleIcon,
  ArrowDownTrayIcon,
  WrenchScrewdriverIcon,
  UserIcon,
  GlobeAltIcon,
  PencilIcon,
  DocumentDuplicateIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import { fetchDetectionRules } from '../../service/api';
import { Listbox } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { createDetectionRule, updateDetectionRule, deleteDetectionRule } from '../../service/rules-api';
import RuleCreator from '../common/RuleCreator';
import { useTheme } from '../../contexts/ThemeContext';
// axios import removed - will be handled by parent component

const severityMap = {
  critical: 'text-red-400',
  high: 'text-orange-400',
  medium: 'text-yellow-400',
  low: 'text-green-400',
};

// Helper: insert text at cursor in textarea
function insertAtCursor(textarea, value) {
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const before = textarea.value.substring(0, start);
  const after = textarea.value.substring(end);
  textarea.value = before + value + after;
  textarea.selectionStart = textarea.selectionEnd = start + value.length;
  textarea.dispatchEvent(new Event('input', { bubbles: true }));
}

const Rules = () => {
  const { isDarkMode, isTransitioning } = useTheme();
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [filterSeverity, setFilterSeverity] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedRules, setSelectedRules] = useState([]);
  const [showDetails, setShowDetails] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(50);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState({
    RuleName: '',
    RuleType: 'Behavioral',
    RuleCondition: '',
    AlertTitle: '',
    AlertSeverity: 'Medium',
    AlertType: '',
    Platform: 'All',
    RuleCategory: '',
    AlertDescription: '',
    MitreTactic: '',
    MitreTechnique: '',
    Priority: 50,
    IsActive: true,
    TestMode: false,
  });
  const [createError, setCreateError] = useState(null);
  const [createLoading, setCreateLoading] = useState(false);
  const [ruleConditionValid, setRuleConditionValid] = useState(true);
  const [useFormBuilder, setUseFormBuilder] = useState(true);
  const [conditionFields, setConditionFields] = useState({});
  const ruleTypeSamples = {
    Behavioral: `{
  "process_name": "powershell.exe",
  "command_line_contains": ["-Enc", "-EncodedCommand"],
  "logic": "AND"
}`,
    Signature: `{
  "file_hash": "2f512b4c7de8b8482297a3894f095a9f"
}`,
    Threshold: `{
  "file_operation": "Create",
  "threshold": 50
}`,
    Correlation: `{
  "event_types": ["Process", "Network"],
  "time_window": 60
}`
  };

  const ruleTypeOptions = [
    { value: 'Behavioral', label: 'Behavioral (Hành vi)' },
    { value: 'Signature', label: 'Signature (Chữ ký)' },
    { value: 'Threshold', label: 'Threshold (Ngưỡng)' },
    { value: 'Correlation', label: 'Correlation (Liên kết sự kiện)' },
  ];
  const severityOptions = [
    { value: 'Critical', label: 'Critical' },
    { value: 'High', label: 'High' },
    { value: 'Medium', label: 'Medium' },
    { value: 'Low', label: 'Low' },
  ];
  const platformOptions = [
    { value: 'All', label: 'Tất cả' },
    { value: 'Windows', label: 'Windows' },
    { value: 'Linux', label: 'Linux' },
  ];

  const eventTypeOptions = [
    { value: '', label: 'Không chọn' },
    { value: 'Process', label: 'Process' },
    { value: 'File', label: 'File' },
    { value: 'Network', label: 'Network' },
    { value: 'Registry', label: 'Registry' },
    { value: 'Authentication', label: 'Authentication' },
    { value: 'System', label: 'System' },
  ];
  const eventFieldMap = {
    Process: [
      { label: 'process_name', value: '\n  "process_name": "powershell.exe",' },
      { label: 'command_line', value: '\n  "command_line": "-Enc",' },
      { label: 'parent_pid', value: '\n  "parent_pid": 1234,' },
      { label: 'process_user', value: '\n  "process_user": "Administrator",' },
      { label: 'process_hash', value: '\n  "process_hash": "abc123",' },
      { label: 'logic', value: '\n  "logic": "AND",' },
    ],
    File: [
      { label: 'file_path', value: '\n  "file_path": "C:/Windows/System32/calc.exe",' },
      { label: 'file_operation', value: '\n  "file_operation": "Create",' },
      { label: 'file_extension', value: '\n  "file_extension": ".exe",' },
      { label: 'file_hash', value: '\n  "file_hash": "abc123",' },
      { label: 'logic', value: '\n  "logic": "AND",' },
    ],
    Network: [
      { label: 'destination_ip', value: '\n  "destination_ip": "192.168.1.1",' },
      { label: 'destination_port', value: '\n  "destination_port": 8080,' },
      { label: 'direction', value: '\n  "direction": "Outbound",' },
      { label: 'protocol', value: '\n  "protocol": "TCP",' },
      { label: 'source_ip', value: '\n  "source_ip": "10.0.0.1",' },
      { label: 'logic', value: '\n  "logic": "AND",' },
    ],
    Registry: [
      { label: 'registry_key', value: '\n  "registry_key": "HKLM\\Software\\Microsoft",' },
      { label: 'registry_operation', value: '\n  "registry_operation": "Create",' },
      { label: 'registry_value_name', value: '\n  "registry_value_name": "Run",' },
      { label: 'logic', value: '\n  "logic": "AND",' },
    ],
    Authentication: [
      { label: 'login_user', value: '\n  "login_user": "admin",' },
      { label: 'login_type', value: '\n  "login_type": "Remote",' },
      { label: 'login_result', value: '\n  "login_result": "Success",' },
      { label: 'logic', value: '\n  "logic": "AND",' },
    ],
    System: [
      { label: 'os_version', value: '\n  "os_version": "Windows 10",' },
      { label: 'architecture', value: '\n  "architecture": "x64",' },
      { label: 'logic', value: '\n  "logic": "AND",' },
    ],
  };
  const eventSampleMap = {
    Process: `{
  "event_type": "Process",
  "process_name": "powershell.exe",
  "command_line": "-Enc",
  "logic": "AND"
}`,
    File: `{
  "event_type": "File",
  "file_path": "C:/Windows/System32/calc.exe",
  "file_operation": "Create",
  "logic": "AND"
}`,
    Network: `{
  "event_type": "Network",
  "destination_ip": "192.168.20.129",
  "destination_port": 8080,
  "direction": "Outbound",
  "logic": "AND"
}`,
    Registry: `{
  "event_type": "Registry",
  "registry_key": "HKLM\\Software\\Microsoft",
  "registry_operation": "Create",
  "logic": "AND"
}`,
    Authentication: `{
  "event_type": "Authentication",
  "login_user": "admin",
  "login_type": "Remote",
  "login_result": "Success",
  "logic": "AND"
}`,
    System: `{
  "event_type": "System",
  "os_version": "Windows 10",
  "architecture": "x64",
  "logic": "AND"
}`,
  };
  const [eventType, setEventType] = useState('');

  // Gợi ý cho dropdown
  const alertTypeOptions = [
    'Credential Access', 'Execution', 'Persistence', 'Defense Evasion', 'Discovery', 'Lateral Movement', 'Collection', 'Exfiltration', 'Command and Control', 'Impact', 'Initial Access', 'Privilege Escalation', 'Reconnaissance', 'Resource Development'
  ];
  const mitreTacticOptions = [
    'Credential Access', 'Execution', 'Persistence', 'Defense Evasion', 'Discovery', 'Lateral Movement', 'Collection', 'Exfiltration', 'Command and Control', 'Impact', 'Initial Access', 'Privilege Escalation', 'Reconnaissance', 'Resource Development'
  ];
  const mitreTechniqueOptions = [
    'T1003.001', 'T1059.001', 'T1547.001', 'T1105', 'T1059.004', 'T1486', 'T1071', 'T1566.001', 'T1021.001', 'T1027', 'T1218.011', 'T1562.001', 'T1204.002', 'T1055.001', 'T1047', 'T1110.001', 'T1041', 'T1567.002', 'T1499', 'T1190', 'T1134.001', 'T1082', 'T1016', 'T1049', 'T1087.001', 'T1018', 'T1083', 'T1518.001', 'T1069.001', 'T1082', 'T1007', 'T1012', 'T1057', 'T1087.002', 'T1033', 'T1016.001', 'T1046', 'T1135', 'T1010', 'T1016.002', 'T1040', 'T1041', 'T1567.001', 'T1567.002', 'T1048.003', 'T1102.002', 'T1095', 'T1071.001', 'T1071.002', 'T1071.003', 'T1090.001', 'T1090.002', 'T1090.003', 'T1090.004', 'T1090.005', 'T1090.006', 'T1090.007', 'T1090.008', 'T1090.009', 'T1090.010', 'T1090.011', 'T1090.012', 'T1090.013', 'T1090.014', 'T1090.015', 'T1090.016', 'T1090.017', 'T1090.018', 'T1090.019', 'T1090.020', 'T1090.021', 'T1090.022', 'T1090.023', 'T1090.024', 'T1090.025', 'T1090.026', 'T1090.027', 'T1090.028', 'T1090.029', 'T1090.030', 'T1090.031', 'T1090.032', 'T1090.033', 'T1090.034', 'T1090.035', 'T1090.036', 'T1090.037', 'T1090.038', 'T1090.039', 'T1090.040', 'T1090.041', 'T1090.042', 'T1090.043', 'T1090.044', 'T1090.045', 'T1090.046', 'T1090.047', 'T1090.048', 'T1090.049', 'T1090.050', 'T1090.051', 'T1090.052', 'T1090.053', 'T1090.054', 'T1090.055', 'T1090.056', 'T1090.057', 'T1090.058', 'T1090.059', 'T1090.060', 'T1090.061', 'T1090.062', 'T1090.063', 'T1090.064', 'T1090.065', 'T1090.066', 'T1090.067', 'T1090.068', 'T1090.069', 'T1090.070', 'T1090.071', 'T1090.072', 'T1090.073', 'T1090.074', 'T1090.075', 'T1090.076', 'T1090.077', 'T1090.078', 'T1090.079', 'T1090.080', 'T1090.081', 'T1090.082', 'T1090.083', 'T1090.084', 'T1090.085', 'T1090.086', 'T1090.087', 'T1090.088', 'T1090.089', 'T1090.090', 'T1090.091', 'T1090.092', 'T1090.093', 'T1090.094', 'T1090.095', 'T1090.096', 'T1090.097', 'T1090.098', 'T1090.099', 'T1090.100'
  ];

  const uniqueMitreTechniqueOptions = Array.from(new Set(mitreTechniqueOptions));

  const [customMitreTechnique, setCustomMitreTechnique] = useState('');
  const [isOtherMitreTechnique, setIsOtherMitreTechnique] = useState(false);

  const [toggleLoading, setToggleLoading] = useState({});

  // Thêm state cho modal chỉnh sửa Rule
  const [showEditModal, setShowEditModal] = useState(false);
  const [editRule, setEditRule] = useState(null);

  // Hàm mở modal chỉnh sửa Rule
  const handleEditRule = (rule) => {
    // Danh sách hợp lệ cho các trường dropdown
    const ruleTypes = ['Behavioral','Signature','Threshold','Correlation'];
    const platforms = ['All','Windows','Linux'];
    const severities = ['Critical','High','Medium','Low'];
    const alertTypes = ['Credential Access','Execution','Persistence','Defense Evasion','Discovery','Lateral Movement','Collection','Exfiltration','Command and Control','Impact','Initial Access','Privilege Escalation','Reconnaissance','Resource Development'];
    const mitreTactics = alertTypes;
    // Helper giữ nguyên giá trị cũ nếu hợp lệ, fallback nếu không
    const safe = (val, list, fallback) => (val && list.includes(val)) ? val : fallback;
    setEditRule({
      ...rule,
      rule_type: safe(rule.rule_type || rule.RuleType, ruleTypes, ruleTypes[0]),
      platform: safe(rule.platform || rule.Platform, platforms, platforms[0]),
      alert_severity: safe(rule.alert_severity || rule.AlertSeverity, severities, severities[1]),
      alert_type: rule.alert_type !== undefined ? rule.alert_type : (rule.AlertType !== undefined ? rule.AlertType : ''),
      mitre_tactic: rule.mitre_tactic !== undefined ? rule.mitre_tactic : (rule.MitreTactic !== undefined ? rule.MitreTactic : ''),
      mitre_technique: rule.mitre_technique !== undefined ? rule.mitre_technique : (rule.MitreTechnique !== undefined ? rule.MitreTechnique : ''),
      priority: rule.priority !== undefined ? rule.priority : (rule.Priority !== undefined ? rule.Priority : 50),
      test_mode: rule.test_mode !== undefined ? rule.test_mode : (rule.TestMode !== undefined ? rule.TestMode : false),
      is_active: rule.is_active !== undefined ? rule.is_active : (rule.IsActive !== undefined ? rule.IsActive : true),
      description: rule.description !== undefined ? rule.description : (rule.Description !== undefined ? rule.Description : ''),
      alert_title: rule.alert_title !== undefined ? rule.alert_title : (rule.AlertTitle !== undefined ? rule.AlertTitle : ''),
    });
    setShowEditModal(true);
  };

  const fetchRulesData = async () => {
    setLoading(true);
    try {
      // Lấy tối đa 1000 rule (tránh lỗi backend với limit=0)
      const rulesData = await fetchDetectionRules();
      setRules(rulesData.rules || []);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      console.error('Error fetching rules data:', err);
      setError('Cannot load detection rules data. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!showCreateModal) {
      fetchRulesData();
      const interval = setInterval(fetchRulesData, 30000);
      return () => clearInterval(interval);
    }
    // Nếu modal đang mở, không set interval
  }, [showCreateModal]);

  useEffect(() => { setCurrentPage(1); }, [search, filterType, filterSeverity, filterStatus]);

  const getRuleTypeInfo = (ruleType) => {
    const typeLower = (ruleType || '').toLowerCase();
    
    const typeMap = {
      'behavioral': {
        icon: BoltIcon,
        color: 'text-blue-400',
        bg: 'bg-blue-900/60',
        label: 'Behavioral',
        description: 'Behavior-based detection'
      },
      'signature': {
        icon: DocumentTextIcon,
        color: 'text-green-400',
        bg: 'bg-green-900/60',
        label: 'Signature',
        description: 'Signature-based detection'
      },
      'threshold': {
        icon: BoltIcon,
        color: 'text-orange-400',
        bg: 'bg-orange-900/60',
        label: 'Threshold',
        description: 'Threshold-based detection'
      },
      'correlation': {
        icon: ShieldCheckIcon,
        color: 'text-purple-400',
        bg: 'bg-purple-900/60',
        label: 'Correlation',
        description: 'Event correlation rule'
      }
    };

    return typeMap[typeLower] || {
      icon: BoltIcon,
      color: 'text-gray-400',
      bg: 'bg-gray-900/60',
      label: ruleType || 'Unknown',
      description: 'Detection rule'
    };
  };

  const getSeverityInfo = (severity) => {
    const severityLower = (severity || '').toLowerCase();
    
    const severityMap = {
      'critical': {
        bg: 'bg-red-900/60',
        text: 'text-red-200',
        border: 'border-red-700',
        label: 'Critical'
      },
      'high': {
        bg: 'bg-orange-900/60',
        text: 'text-orange-200',
        border: 'border-orange-700',
        label: 'High'
      },
      'medium': {
        bg: 'bg-yellow-900/60',
        text: 'text-yellow-200',
        border: 'border-yellow-700',
        label: 'Medium'
      },
      'low': {
        bg: 'bg-green-900/60',
        text: 'text-green-200',
        border: 'border-green-700',
        label: 'Low'
      }
    };

    return severityMap[severityLower] || {
      bg: 'bg-gray-900/60',
      text: 'text-gray-200',
      border: 'border-gray-700',
      label: severity || 'Unknown'
    };
  };

  const getPlatformIcon = (platform) => {
    const platformLower = (platform || '').toLowerCase();
    if (platformLower.includes('windows')) return '🪟';
    if (platformLower.includes('linux')) return '🐧';
    if (platformLower.includes('mac')) return '🍎';
    if (platformLower.includes('all')) return '🌐';
    return '💻';
  };

  const filteredRules = rules.filter(rule => {
    const matchesSearch = 
      (rule.rule_name || rule.RuleName || '').toLowerCase().includes(search.toLowerCase()) ||
      (rule.alert_title || rule.AlertTitle || '').toLowerCase().includes(search.toLowerCase()) ||
      (rule.mitre_tactic || rule.MitreTactic || '').toLowerCase().includes(search.toLowerCase());
    
    const matchesType = filterType === 'All' || 
      (rule.rule_type || rule.RuleType || '').toLowerCase() === filterType.toLowerCase();
    
    const matchesSeverity = filterSeverity === 'All' ||
      (rule.alert_severity || rule.AlertSeverity || '').toLowerCase() === filterSeverity.toLowerCase();
    
    const matchesStatus = filterStatus === 'All' ||
      (filterStatus === 'Active' && (rule.is_active === true || rule.IsActive === true)) ||
      (filterStatus === 'Inactive' && (rule.is_active === false || rule.IsActive === false));
    
    return matchesSearch && matchesType && matchesSeverity && matchesStatus;
  });

  // Calculate stats from filtered rules
  const calculatedStats = {
    total: filteredRules.length,
    active: filteredRules.filter(r => r.is_active === true || r.IsActive === true).length,
    inactive: filteredRules.filter(r => r.is_active === false || r.IsActive === false).length,
    behavioral: filteredRules.filter(r => (r.rule_type || r.RuleType || '').toLowerCase() === 'behavioral').length,
    signature: filteredRules.filter(r => (r.rule_type || r.RuleType || '').toLowerCase() === 'signature').length,
    threshold: filteredRules.filter(r => (r.rule_type || r.RuleType || '').toLowerCase() === 'threshold').length,
    correlation: filteredRules.filter(r => (r.rule_type || r.RuleType || '').toLowerCase() === 'correlation').length,
  };

  const toggleRuleStatus = async (ruleId, currentStatus) => {
    setToggleLoading(prev => ({ ...prev, [ruleId]: true }));
    try {
      await updateDetectionRule(ruleId, { is_active: !currentStatus });
      fetchRulesData();
    } catch (err) {
      console.error('Error toggling rule status:', err);
    } finally {
      setToggleLoading(prev => ({ ...prev, [ruleId]: false }));
    }
  };

  const toggleSelectRule = (ruleId) => {
    setSelectedRules(prev => 
      prev.includes(ruleId) 
        ? prev.filter(id => id !== ruleId)
        : [...prev, ruleId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedRules.length === filteredRules.length) {
      setSelectedRules([]);
    } else {
      setSelectedRules(filteredRules.map(rule => rule.rule_id || rule.RuleID));
    }
  };

  const exportRules = () => {
    const csvContent = [
      ['Name', 'Type', 'Severity', 'Status', 'Platform', 'Description'],
      ...filteredRules.map(rule => [
        rule.rule_name || rule.RuleName,
        rule.rule_type || rule.RuleType,
        rule.alert_severity || rule.AlertSeverity,
        (rule.is_active === true || rule.IsActive === true) ? 'Active' : 'Inactive',
        rule.platform || rule.Platform,
        rule.alert_title || rule.AlertTitle
      ])
    ].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rules_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Export only selected rules
  const exportSelectedRules = () => {
    const selected = filteredRules.filter(rule => selectedRules.includes(rule.rule_id || rule.RuleID));
    if (selected.length === 0) return;
    const csvRows = [
      ['Name', 'Type', 'Severity', 'Status', 'Platform', 'Description'],
      ...selected.map(rule => [
        rule.rule_name || rule.RuleName,
        rule.rule_type || rule.RuleType,
        rule.alert_severity || rule.AlertSeverity,
        (rule.is_active === true || rule.IsActive === true) ? 'Active' : 'Inactive',
        rule.platform || rule.Platform,
        rule.alert_title || rule.AlertTitle
      ])
    ];
    const csvContent = csvRows.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rules_selected_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Delete only selected rules
  const deleteSelectedRules = async () => {
    if (selectedRules.length === 0) return;
    if (!window.confirm(`Bạn có chắc chắn muốn xóa ${selectedRules.length} rule đã chọn?`)) return;
    try {
      await Promise.all(selectedRules.map(id => deleteDetectionRule(id)));
      setSelectedRules([]);
      fetchRulesData();
    } catch (err) {
      alert('Xóa rule thất bại!');
    }
  };

  const totalPages = Math.ceil(filteredRules.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentRules = filteredRules.slice(startIndex, endIndex);
  const goToPage = (page) => setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  const goToNextPage = () => { if (currentPage < totalPages) setCurrentPage(currentPage + 1); };
  const goToPrevPage = () => { if (currentPage > 1) setCurrentPage(currentPage - 1); };

  // Khi chọn eventType, reset các trường builder
  useEffect(() => {
    if (eventType) {
      const fields = {};
      (eventFieldMap[eventType] || []).forEach(f => {
        const key = f.label.replace(/"/g, '').replace(/[:,]/g, '').trim();
        fields[key] = '';
      });
      fields['logic'] = 'AND';
      setConditionFields(fields);
      // Nếu đang dùng builder, cập nhật JSON luôn
      if (useFormBuilder) {
        const obj = { event_type: eventType, logic: 'AND' };
        setCreateForm(f => ({...f, RuleCondition: JSON.stringify(obj, null, 2)}));
      }
      // Gán RuleCategory theo Event Type (trừ khi là 'Không chọn')
      setCreateForm(f => ({
        ...f,
        RuleCategory: eventType && eventType !== '' ? eventType : ''
      }));
    }
  }, [eventType, useFormBuilder]);

  // Khi nhập builder, tự động cập nhật JSON
  useEffect(() => {
    if (useFormBuilder && eventType) {
      const obj = { event_type: eventType };
      Object.entries(conditionFields).forEach(([k, v]) => {
        if (v && k !== 'event_type') obj[k] = v;
      });
      setCreateForm(f => ({...f, RuleCondition: JSON.stringify(obj, null, 2)}));
      setRuleConditionValid(true);
    }
  }, [conditionFields, useFormBuilder, eventType]);

  const handleDeleteRule = async (ruleId) => {
    const confirmDelete = window.confirm('Bạn có chắc chắn muốn xóa rule này không?');
    if (!confirmDelete) return;
    try {
      await deleteDetectionRule(ruleId);
      fetchRulesData();
    } catch (err) {
      console.error('Error deleting rule:', err);
      alert('Failed to delete rule. Please try again.');
    }
  };

  // Hàm lưu rule khi chỉnh sửa
  const handleSaveEditRule = async (updatedRule) => {
    try {
      await updateDetectionRule(updatedRule.rule_id || updatedRule.RuleID, updatedRule);
      setShowEditModal(false);
      setEditRule(null);
      fetchRulesData();
    } catch (err) {
      alert('Cập nhật rule thất bại!');
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center transition-all duration-300
        ${isDarkMode
          ? 'bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950'
          : 'bg-gradient-to-br from-white via-blue-50 to-purple-100'}
      `}>
        <div className="text-center">
          <div className="relative">
            <div className={`w-20 h-20 border-4 rounded-full animate-spin
              ${isDarkMode ? 'border-purple-200' : 'border-purple-300'}
            `}></div>
            <div className={`w-20 h-20 border-4 border-t-transparent rounded-full animate-spin absolute top-0
              ${isDarkMode ? 'border-purple-600' : 'border-blue-400'}
            `}></div>
          </div>
          <h3 className={`mt-6 text-xl font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-700'}`}>Loading Rules...</h3>
          <p className={`mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Fetching detection rules...</p>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-red-900 to-pink-900">
        <div className="text-center max-w-md mx-auto p-8">
          <ExclamationTriangleIcon className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-red-200 mb-2">Connection Error</h3>
          <p className="text-red-300 mb-6">{error}</p>
          <button
            onClick={fetchRulesData}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium"
          >Try Again</button>
        </div>
      </div>
    );
  }

  // Always show search/filter bar, even if no data
  return (
    <div className={`
      min-h-screen transition-all duration-300
      ${isDarkMode 
        ? 'bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 text-white' 
        : 'bg-gradient-to-br from-blue-50 via-white to-indigo-50 text-gray-900'
      }
      ${isTransitioning ? 'theme-transitioning' : ''}
    `}>
      {/* Header & Stats */}
      <div className={`
        px-8 py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 
        border-b shadow-lg sticky top-0 z-20 backdrop-blur-xl transition-all duration-300
        ${isDarkMode 
          ? 'border-white/10 bg-white/10' 
          : 'border-gray-200/50 bg-white/80'
        }
      `}>
        <div className="flex items-center gap-4">
          <BoltIcon className={`
            w-10 h-10 drop-shadow-lg transition-colors duration-300
            ${isDarkMode ? 'text-purple-400' : 'text-blue-600'}
          `} />
          <div>
            <h1 className={`
              text-3xl font-bold tracking-tight transition-colors duration-300
              ${isDarkMode 
                ? 'bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent' 
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent'
              }
            `}>
              Detection Rules
            </h1>
            <p className={`
              text-sm mt-1 transition-colors duration-300
              ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}
            `}>
              Manage and configure detection rules
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={fetchRulesData}
            disabled={loading}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg font-medium disabled:opacity-50 shadow-lg
              transition-all duration-200 hover:scale-105
              ${isDarkMode 
                ? 'bg-purple-600 text-white hover:bg-purple-700' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
              }
            `}
          >
            <ArrowPathIcon className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            onClick={exportRules}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg font-medium shadow-lg
              transition-all duration-200 hover:scale-105
              ${isDarkMode 
                ? 'bg-green-600 text-white hover:bg-green-700' 
                : 'bg-green-600 text-white hover:bg-green-700'
              }
            `}
          >
            <ArrowDownTrayIcon className="w-5 h-5" />
            Export
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg font-medium shadow-lg
              transition-all duration-200 hover:scale-105
              ${isDarkMode 
                ? 'bg-blue-600 text-white hover:bg-blue-700' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
              }
            `}
          >
            <PlusIcon className="w-5 h-5" />
            Tạo Rule
          </button>
          <div className={`
            flex items-center gap-2 text-sm transition-colors duration-300
            ${isDarkMode ? 'text-gray-200' : 'text-gray-600'}
          `}>
            <ClockIcon className="w-4 h-4" />
            <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="p-8 grid grid-cols-2 md:grid-cols-8 gap-4">
        <div className={`
          rounded-2xl shadow-2xl p-4 flex flex-col gap-2 hover:scale-[1.03] transition-transform duration-300 border
          ${isDarkMode ? 'bg-gradient-to-br from-purple-700 to-purple-900 border-white/10' : 'bg-gradient-to-br from-purple-500 to-purple-700 border-purple-200'}
        `}>
          <div className="flex items-center gap-2 mb-2">
            <BoltIcon className={`w-6 h-6 ${isDarkMode ? 'text-purple-300' : 'text-purple-100'}`} />
            <span className={`text-sm font-semibold ${isDarkMode ? 'text-purple-100' : 'text-purple-100'}`}>Total</span>
          </div>
          <div className="text-2xl font-bold text-white drop-shadow-lg">{calculatedStats.total}</div>
        </div>
        <div className={`
          rounded-2xl shadow-2xl p-4 flex flex-col gap-2 hover:scale-[1.03] transition-transform duration-300 border
          ${isDarkMode ? 'bg-gradient-to-br from-green-700 to-green-900 border-white/10' : 'bg-gradient-to-br from-green-500 to-emerald-700 border-green-200'}
        `}>
          <div className="flex items-center gap-2 mb-2">
            <CheckCircleIcon className={`w-6 h-6 ${isDarkMode ? 'text-green-300' : 'text-green-100'}`} />
            <span className={`text-sm font-semibold ${isDarkMode ? 'text-green-100' : 'text-green-100'}`}>Active</span>
          </div>
          <div className="text-2xl font-bold text-white drop-shadow-lg">{calculatedStats.active}</div>
        </div>
        <div className={`
          rounded-2xl shadow-2xl p-4 flex flex-col gap-2 hover:scale-[1.03] transition-transform duration-300 border
          ${isDarkMode ? 'bg-gradient-to-br from-gray-700 to-gray-900 border-white/10' : 'bg-gradient-to-br from-gray-400 to-gray-600 border-gray-200'}
        `}>
          <div className="flex items-center gap-2 mb-2">
            <XCircleIcon className={`w-6 h-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-100'}`} />
            <span className={`text-sm font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-100'}`}>Inactive</span>
          </div>
          <div className="text-2xl font-bold text-white drop-shadow-lg">{calculatedStats.inactive}</div>
        </div>
        <div className={`
          rounded-2xl shadow-2xl p-4 flex flex-col gap-2 hover:scale-[1.03] transition-transform duration-300 border
          ${isDarkMode ? 'bg-gradient-to-br from-blue-700 to-blue-900 border-white/10' : 'bg-gradient-to-br from-blue-500 to-blue-700 border-blue-200'}
        `}>
          <div className="flex items-center gap-2 mb-2">
            <BoltIcon className={`w-6 h-6 ${isDarkMode ? 'text-blue-300' : 'text-blue-100'}`} />
            <span className={`text-sm font-semibold ${isDarkMode ? 'text-blue-100' : 'text-blue-100'}`}>Behavioral</span>
          </div>
          <div className="text-2xl font-bold text-white drop-shadow-lg">{calculatedStats.behavioral}</div>
        </div>
        <div className={`
          rounded-2xl shadow-2xl p-4 flex flex-col gap-2 hover:scale-[1.03] transition-transform duration-300 border
          ${isDarkMode ? 'bg-gradient-to-br from-green-700 to-emerald-900 border-white/10' : 'bg-gradient-to-br from-green-500 to-emerald-700 border-green-200'}
        `}>
          <div className="flex items-center gap-2 mb-2">
            <DocumentTextIcon className={`w-6 h-6 ${isDarkMode ? 'text-green-300' : 'text-green-100'}`} />
            <span className={`text-sm font-semibold ${isDarkMode ? 'text-green-100' : 'text-green-100'}`}>Signature</span>
          </div>
          <div className="text-2xl font-bold text-white drop-shadow-lg">{calculatedStats.signature}</div>
        </div>
        <div className={`
          rounded-2xl shadow-2xl p-4 flex flex-col gap-2 hover:scale-[1.03] transition-transform duration-300 border
          ${isDarkMode ? 'bg-gradient-to-br from-orange-700 to-yellow-900 border-white/10' : 'bg-gradient-to-br from-orange-500 to-yellow-500 border-yellow-200'}
        `}>
          <div className="flex items-center gap-2 mb-2">
            <BoltIcon className={`w-6 h-6 ${isDarkMode ? 'text-orange-300' : 'text-orange-100'}`} />
            <span className={`text-sm font-semibold ${isDarkMode ? 'text-orange-100' : 'text-orange-100'}`}>Threshold</span>
          </div>
          <div className="text-2xl font-bold text-white drop-shadow-lg">{calculatedStats.threshold}</div>
        </div>
        <div className={`
          rounded-2xl shadow-2xl p-4 flex flex-col gap-2 hover:scale-[1.03] transition-transform duration-300 border
          ${isDarkMode ? 'bg-gradient-to-br from-purple-700 to-violet-900 border-white/10' : 'bg-gradient-to-br from-purple-500 to-violet-700 border-purple-200'}
        `}>
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheckIcon className={`w-6 h-6 ${isDarkMode ? 'text-purple-300' : 'text-purple-100'}`} />
            <span className={`text-sm font-semibold ${isDarkMode ? 'text-purple-100' : 'text-purple-100'}`}>Correlation</span>
          </div>
          <div className="text-2xl font-bold text-white drop-shadow-lg">{calculatedStats.correlation}</div>
        </div>
      </div>

      {/* Filters & Bulk Actions */}
      <div className="px-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="flex gap-2">
          <div className="relative">
            <MagnifyingGlassIcon className={`w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search rule name, title, or MITRE tactic..."
              className={`pl-10 pr-4 py-2 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-400 transition-all duration-200
                ${isDarkMode
                  ? 'bg-white/10 border border-white/10 text-white placeholder:text-gray-400'
                  : 'bg-white border border-gray-300 text-gray-800 placeholder:text-gray-500 shadow-sm hover:border-blue-400 focus:bg-white'
                }
              `}
            />
          </div>
          <select
            value={filterType}
            onChange={e => setFilterType(e.target.value)}
            className={`px-4 py-2 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-400 transition-all duration-200
              ${isDarkMode
                ? 'bg-white/10 border border-white/10 text-white'
                : 'bg-white border border-gray-300 text-gray-800 font-semibold shadow-sm hover:border-blue-400 focus:bg-white'
              }
            `}
          >
            <option value="All">All Types</option>
            <option value="Behavioral">Behavioral</option>
            <option value="Signature">Signature</option>
            <option value="Threshold">Threshold</option>
            <option value="Correlation">Correlation</option>
          </select>
          <select
            value={filterSeverity}
            onChange={e => setFilterSeverity(e.target.value)}
            className={`px-4 py-2 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-400 transition-all duration-200
              ${isDarkMode
                ? 'bg-white/10 border border-white/10 text-white'
                : 'bg-white border border-gray-300 text-gray-800 font-semibold shadow-sm hover:border-blue-400 focus:bg-white'
              }
            `}
          >
            <option value="All">All Severity</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className={`px-4 py-2 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-400 transition-all duration-200
              ${isDarkMode
                ? 'bg-white/10 border border-white/10 text-white'
                : 'bg-white border border-gray-300 text-gray-800 font-semibold shadow-sm hover:border-blue-400 focus:bg-white'
              }
            `}
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
        {selectedRules.length > 0 && (
          <div className="flex gap-2 items-center bg-purple-900/60 px-4 py-2 rounded-lg shadow-lg">
            <span className="text-purple-200 font-medium">{selectedRules.length} selected</span>
            <button className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700" onClick={exportSelectedRules}>Export Selected</button>
            <button className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700" onClick={deleteSelectedRules}>Delete Selected</button>
          </div>
        )}
      </div>

      {/* Rules Table */}
      {filteredRules.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24">
          <BoltIcon className="w-20 h-20 text-purple-900/30 mb-6" />
          <h3 className={`text-2xl font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'} mb-2`}>No Rules Found</h3>
          <p className={`mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>No rules match your search or filter criteria.</p>
        </div>
      ) : (
        <div className={`
          px-8 overflow-x-auto rounded-2xl shadow-2xl border transition-all duration-300
          ${isDarkMode ? 'bg-white/10 border-white/10' : 'bg-white/80 border-white/20'}
        `}>
          <table className="min-w-full divide-y divide-white/10">
            <thead className={`transition-colors duration-300 ${isDarkMode ? 'bg-white/5' : 'bg-white/40'}`}> 
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedRules.length === filteredRules.length && filteredRules.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                </th>
                <th className={`px-6 py-3 text-left text-xs font-bold uppercase tracking-wider
                  ${isDarkMode ? 'text-white' : 'text-gray-700'}
                `}>Rule</th>
                <th className={`px-6 py-3 text-left text-xs font-bold uppercase tracking-wider
                  ${isDarkMode ? 'text-white' : 'text-gray-700'}
                `}>Type</th>
                <th className={`px-6 py-3 text-left text-xs font-bold uppercase tracking-wider
                  ${isDarkMode ? 'text-white' : 'text-gray-700'}
                `}>Severity</th>
                <th className={`px-6 py-3 text-left text-xs font-bold uppercase tracking-wider
                  ${isDarkMode ? 'text-white' : 'text-gray-700'}
                `}>Status</th>
                <th className={`px-6 py-3 text-left text-xs font-bold uppercase tracking-wider
                  ${isDarkMode ? 'text-white' : 'text-gray-700'}
                `}>Platform</th>
                <th className={`px-6 py-3 text-left text-xs font-bold uppercase tracking-wider
                  ${isDarkMode ? 'text-white' : 'text-gray-700'}
                `}>Actions</th>
              </tr>
            </thead>
            <tbody className={`transition-colors duration-300 ${isDarkMode ? 'bg-white/5' : 'bg-white/10'} divide-y divide-white/10`}> 
              {currentRules.map(rule => {
                const typeInfo = getRuleTypeInfo(rule.rule_type || rule.RuleType);
                const severityInfo = getSeverityInfo(rule.alert_severity || rule.AlertSeverity);
                const isActive = rule.is_active === true || rule.IsActive === true;
                
                return (
                  <tr key={rule.rule_id || rule.RuleID} className={`transition-all hover:${isDarkMode ? 'bg-purple-900/30' : 'bg-indigo-100/60'}`}>
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedRules.includes(rule.rule_id || rule.RuleID)}
                        onChange={() => toggleSelectRule(rule.rule_id || rule.RuleID)}
                        className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      />
                    </td>
                    <td className={`px-6 py-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}> 
                      <div>
                        <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{rule.rule_name || rule.RuleName}</div>
                        <div className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} text-sm`}>{rule.alert_title || rule.AlertTitle}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold shadow-md transition-all duration-200 hover:scale-105
                        ${isDarkMode
                          ? typeInfo.bg + ' ' + typeInfo.color
                          : (typeInfo.label === 'Behavioral'
                              ? 'bg-blue-100 text-blue-700'
                              : typeInfo.label === 'Signature'
                              ? 'bg-green-100 text-green-700'
                              : typeInfo.label === 'Threshold'
                              ? 'bg-orange-100 text-orange-700'
                              : typeInfo.label === 'Correlation'
                              ? 'bg-purple-100 text-purple-700'
                              : 'bg-gray-200 text-gray-700')
                        }
                      `}>
                        <typeInfo.icon className={`w-4 h-4 mr-1 ${isDarkMode
                          ? typeInfo.color
                          : (typeInfo.label === 'Behavioral'
                              ? 'text-blue-500'
                              : typeInfo.label === 'Signature'
                              ? 'text-green-500'
                              : typeInfo.label === 'Threshold'
                              ? 'text-orange-500'
                              : typeInfo.label === 'Correlation'
                              ? 'text-purple-500'
                              : 'text-gray-400')
                        }`} />
                        {typeInfo.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold shadow-md transition-all duration-200 hover:scale-105
                        ${isDarkMode
                          ? severityInfo.bg + ' ' + severityInfo.text
                          : (severityInfo.label === 'Critical'
                              ? 'bg-red-100 text-red-700'
                              : severityInfo.label === 'High'
                              ? 'bg-orange-100 text-orange-700'
                              : severityInfo.label === 'Medium'
                              ? 'bg-yellow-100 text-yellow-700'
                              : severityInfo.label === 'Low'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-200 text-gray-700')
                        }
                      `}>
                        {severityInfo.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        type="button"
                        disabled={toggleLoading[rule.rule_id || rule.RuleID]}
                        onClick={() => {
                          const action = isActive ? 'tắt' : 'bật';
                          if (window.confirm(`Bạn có chắc chắn muốn ${action} rule này không?`)) {
                            toggleRuleStatus(rule.rule_id || rule.RuleID, isActive);
                          }
                        }}
                        className="relative w-12 h-7 focus:outline-none"
                        aria-label={isActive ? 'Tắt rule' : 'Bật rule'}
                      >
                        <span
                          className={`absolute inset-0 rounded-full transition-colors duration-200
                            ${isActive ? 'bg-green-500' : 'bg-gray-400'}
                            ${toggleLoading[rule.rule_id || rule.RuleID] ? 'opacity-60' : ''}`}
                        ></span>
                        <span
                          className={`absolute left-0 top-0 w-7 h-7 bg-white rounded-full shadow-md transform transition-transform duration-200
                            ${isActive ? 'translate-x-5' : 'translate-x-0'}
                            border-2 border-white`}
                          style={{ zIndex: 2 }}
                        >
                          {toggleLoading[rule.rule_id || rule.RuleID] && (
                            <svg className="animate-spin h-5 w-5 text-gray-400 mx-auto my-1.5" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                            </svg>
                          )}
                        </span>
                      </button>
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap transition-colors duration-300
                      ${isDarkMode ? 'text-white' : 'text-gray-700'}
                    `}>
                      <span className={`
                        text-2xl align-middle
                        ${isDarkMode ? 'drop-shadow-lg' : 'drop-shadow-sm'}
                        ${((rule.platform || rule.Platform || '').toLowerCase().includes('windows')) 
                          ? (isDarkMode ? 'text-blue-300' : 'text-blue-600') 
                          : ((rule.platform || rule.Platform || '').toLowerCase().includes('linux'))
                            ? (isDarkMode ? 'text-emerald-200' : 'text-emerald-600')
                            : (isDarkMode ? 'text-gray-200' : 'text-gray-500')
                        }
                      `}>
                        {getPlatformIcon(rule.platform || rule.Platform)}
                      </span>
                      <span className={`
                        ml-2 text-base font-semibold
                        ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}
                      `}>
                        {rule.platform || rule.Platform}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap flex gap-2">
                      <button
                        onClick={() => setShowDetails(rule)}
                        className="px-4 py-1 rounded-full bg-purple-700 text-white font-medium shadow hover:bg-purple-800 border-2 border-purple-400"
                        title="View Details"
                      >
                        <EyeIcon className="w-4 h-4 inline" />
                      </button>
                      <button
                        onClick={() => handleEditRule(rule)}
                        className="px-4 py-2 rounded-full bg-blue-700 text-white font-medium shadow hover:bg-blue-800 transition-all duration-150 border-2 border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs mx-1"
                        title="Edit Rule"
                      >
                        <PencilIcon className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => {
                          const id = rule.RuleID || rule.rule_id;
                          if (!id) {
                            console.error('Không tìm thấy ID hợp lệ để xóa rule:', rule);
                            alert('Không tìm thấy ID hợp lệ để xóa rule này!');
                            return;
                          }
                          handleDeleteRule(id);
                        }}
                        className="px-4 py-1 rounded-full bg-red-700 text-white font-medium shadow hover:bg-red-800 border-2 border-red-400"
                        title="Delete"
                      >
                        <TrashIcon className="w-4 h-4 inline" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-4 py-6 flex items-center justify-between bg-white/10 rounded-2xl shadow-xl border border-white/10 animate-fadeIn">
          <div className="flex items-center gap-4">
            <span className="text-gray-300 text-sm">
              Showing {startIndex + 1} to {Math.min(endIndex, filteredRules.length)} of {filteredRules.length} rules
            </span>
            <span className="text-gray-400 text-sm">
              Page {currentPage} of {totalPages}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={goToPrevPage} disabled={currentPage === 1} className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${currentPage === 1 ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-purple-600 text-white hover:bg-purple-700 hover:scale-105'}`}>Previous</button>
            <div className="flex gap-1">
              {currentPage > 3 && (<button onClick={() => goToPage(1)} className="px-3 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors">1</button>)}
              {currentPage > 4 && (<span className="px-3 py-2 text-gray-400">...</span>)}
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => { const page = currentPage - 2 + i; if (page > 0 && page <= totalPages) { return (<button key={page} onClick={() => goToPage(page)} className={`px-3 py-2 rounded-lg font-medium transition-all duration-200 ${page === currentPage ? 'bg-purple-800 text-white scale-110' : 'bg-purple-600 text-white hover:bg-purple-700 hover:scale-105'}`}>{page}</button>); } return null; })}
              {currentPage < totalPages - 3 && (<span className="px-3 py-2 text-gray-400">...</span>)}
              {currentPage < totalPages - 2 && (<button onClick={() => goToPage(totalPages)} className="px-3 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors">{totalPages}</button>)}
            </div>
            <button onClick={goToNextPage} disabled={currentPage === totalPages} className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${currentPage === totalPages ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-purple-600 text-white hover:bg-purple-700 hover:scale-105'}`}>Next</button>
          </div>
        </div>
      )}

      {/* Rule Details Modal */}
      {showDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className={`max-w-3xl w-full max-h-[90vh] overflow-y-auto relative animate-fadeIn
            rounded-2xl shadow-2xl border transition-all duration-300
            ${isDarkMode
              ? 'bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 border-white/10 text-white'
              : 'bg-white border-gray-200 text-gray-900'}
          `}>
            <div className={`flex items-center justify-between p-6 border-b transition-colors duration-300
              ${isDarkMode ? 'border-white/10' : 'border-gray-200'}
            `}>
              <div className="flex items-center gap-3">
                <EyeIcon className={`w-8 h-8 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Rule Details</h2>
              </div>
              <button
                onClick={() => setShowDetails(null)}
                className="p-2 rounded-lg hover:bg-purple-900/40 transition-colors group"
                aria-label="Close details"
              >
                <XCircleIcon className={`w-7 h-7 transition-colors ${isDarkMode ? 'text-gray-300 group-hover:text-red-400' : 'text-gray-400 group-hover:text-red-500'}`} />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
              <div className="space-y-4">
                <div><span className={`block text-xs font-semibold uppercase mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Name</span><span className={`text-lg font-bold ${isDarkMode ? 'text-purple-300' : 'text-purple-700'}`}>{showDetails.rule_name || showDetails.RuleName}</span></div>
                <div><span className={`block text-xs font-semibold uppercase mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Type</span><span className={`text-base ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{showDetails.rule_type || showDetails.RuleType}</span></div>
                <div><span className={`block text-xs font-semibold uppercase mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Severity</span><span className={`inline-block px-3 py-1 rounded-full text-xs font-bold shadow-md border transition-all duration-200
                  ${isDarkMode
                    ? ((showDetails.alert_severity || showDetails.AlertSeverity || '').toLowerCase() === 'critical'
                        ? 'bg-red-900/60 text-red-200 border-red-700'
                        : (showDetails.alert_severity || showDetails.AlertSeverity || '').toLowerCase() === 'high'
                        ? 'bg-orange-900/60 text-orange-200 border-orange-700'
                        : (showDetails.alert_severity || showDetails.AlertSeverity || '').toLowerCase() === 'medium'
                        ? 'bg-yellow-900/60 text-yellow-200 border-yellow-700'
                        : (showDetails.alert_severity || showDetails.AlertSeverity || '').toLowerCase() === 'low'
                        ? 'bg-green-900/60 text-green-200 border-green-700'
                        : 'bg-blue-900/60 text-blue-200 border-blue-700')
                    : ((showDetails.alert_severity || showDetails.AlertSeverity || '').toLowerCase() === 'critical'
                        ? 'bg-red-100 text-red-700 border-red-300'
                        : (showDetails.alert_severity || showDetails.AlertSeverity || '').toLowerCase() === 'high'
                        ? 'bg-orange-100 text-orange-700 border-orange-300'
                        : (showDetails.alert_severity || showDetails.AlertSeverity || '').toLowerCase() === 'medium'
                        ? 'bg-yellow-100 text-yellow-700 border-yellow-300'
                        : (showDetails.alert_severity || showDetails.AlertSeverity || '').toLowerCase() === 'low'
                        ? 'bg-green-100 text-green-700 border-green-300'
                        : 'bg-blue-100 text-blue-700 border-blue-300')
                  }
                `}>{showDetails.alert_severity || showDetails.AlertSeverity}</span></div>
                <div><span className={`block text-xs font-semibold uppercase mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Status</span><span className={`text-base font-semibold ${isDarkMode ? 'text-white' : 'text-green-700'}`}>{(showDetails.is_active === true || showDetails.IsActive === true) ? 'Active' : 'Inactive'}</span></div>
                <div><span className={`block text-xs font-semibold uppercase mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Platform</span><span className={`text-base ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{showDetails.platform || showDetails.Platform}</span></div>
                <div><span className={`block text-xs font-semibold uppercase mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Alert Title</span><span className={`text-base ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{showDetails.alert_title || showDetails.AlertTitle}</span></div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Raw Rule Data</span>
                  <button
                    className={`px-2 py-1 text-xs rounded font-semibold transition-colors
                      ${isDarkMode ? 'bg-purple-700 text-white hover:bg-purple-800' : 'bg-purple-600 text-white hover:bg-purple-700 shadow'}
                    `}
                    onClick={() => {
                      navigator.clipboard.writeText(JSON.stringify(showDetails, null, 2));
                    }}
                  >Copy JSON</button>
                </div>
                <div className={`rounded-lg p-3 overflow-x-auto max-h-60 border text-xs font-mono whitespace-pre-wrap
                  ${isDarkMode ? 'bg-black/60 border-white/10 text-purple-100' : 'bg-gray-100 border-gray-200 text-purple-900'}
                `}>
                  <pre>{JSON.stringify(showDetails, null, 2)}</pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Rule Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-[2px] p-2">
          <div className={`max-w-5xl w-full max-h-[85vh] overflow-y-auto relative animate-fadeIn rounded-3xl shadow-3xl border transition-all duration-300
            ${isDarkMode
              ? 'bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 border-white/10 text-white'
              : 'bg-white border border-gray-200 text-gray-900'}
          `}>
            <div className={`flex items-center justify-between p-6 border-b transition-colors duration-300
              ${isDarkMode ? 'border-white/10' : 'border-gray-200'}
            `}>
              <div className="flex items-center gap-3">
                <PlusIcon className={`w-8 h-8 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Tạo Rule Mới</h2>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 rounded-lg hover:bg-purple-900/40 transition-colors group"
                aria-label="Đóng"
              >
                <XCircleIcon className={`w-7 h-7 ${isDarkMode ? 'text-gray-300 group-hover:text-red-400' : 'text-gray-400 group-hover:text-red-500'} transition-colors`} />
              </button>
            </div>
            <form
              className="grid grid-cols-1 md:grid-cols-2 gap-10 p-8 bg-transparent rounded-b-3xl"
              onSubmit={async (e) => {
                e.preventDefault();
                setCreateError(null);
                setCreateLoading(true);
                try {
                  // Kiểm tra RuleCondition không được rỗng
                  if (!createForm.RuleCondition || createForm.RuleCondition.trim() === '') {
                    setCreateError('Điều kiện Rule (RuleCondition) không được để trống!');
                    setCreateLoading(false);
                    return;
                  }
                  // Kiểm tra RuleCondition là JSON hợp lệ
                  try {
                    JSON.parse(createForm.RuleCondition);
                  } catch (jsonErr) {
                    setCreateError('RuleCondition phải là JSON hợp lệ!');
                    setCreateLoading(false);
                    return;
                  }
                  // Validate alert_description không được rỗng/null/chuỗi trắng
                  if (!createForm.AlertDescription || createForm.AlertDescription.trim() === '') {
                    setCreateError('Mô tả cảnh báo (alert_description) không được để trống!');
                    setCreateLoading(false);
                    return;
                  }
                  // Chuẩn bị dữ liệu gửi lên
                  let ruleConditionObj = createForm.RuleCondition;
                  if (typeof ruleConditionObj === 'string') {
                    try {
                      ruleConditionObj = JSON.parse(ruleConditionObj);
                    } catch (e) {
                      setCreateError('RuleCondition phải là JSON hợp lệ!');
                      setCreateLoading(false);
                      return;
                    }
                  }
                  const payload = {
                    rule_name: createForm.RuleName,
                    rule_type: createForm.RuleType,
                    rule_condition: ruleConditionObj,
                    alert_title: createForm.AlertTitle,
                    alert_severity: createForm.AlertSeverity,
                    alert_type: createForm.AlertType,
                    platform: createForm.Platform || 'All',
                    mitre_tactic: createForm.MitreTactic || null,
                    mitre_technique: isOtherMitreTechnique ? customMitreTechnique : (createForm.MitreTechnique || null),
                    rule_category: createForm.RuleCategory || null,
                    alert_description: createForm.AlertDescription || null,
                    priority: createForm.Priority || 50,
                    is_active: typeof createForm.IsActive === 'boolean' ? createForm.IsActive : true,
                    test_mode: typeof createForm.TestMode === 'boolean' ? createForm.TestMode : false,
                  };
                  console.log('Payload gửi lên:', payload);
                  await createDetectionRule(payload);
                  setShowCreateModal(false);
                  setCreateForm({
                    RuleName: '', RuleType: 'Behavioral', RuleCondition: '', AlertTitle: '', AlertSeverity: 'Medium', AlertType: '', Platform: 'All', RuleCategory: '', AlertDescription: '', MitreTactic: '', MitreTechnique: '', Priority: 50, IsActive: true, TestMode: false,
                  });
                  setCustomMitreTechnique('');
                  setIsOtherMitreTechnique(false);
                  fetchRulesData();
                } catch (err) {
                  let backendDetail = '';
                  if (err?.response?.data) {
                    if (typeof err.response.data === 'object') {
                      backendDetail = err.response.data.detail || err.response.data.error || JSON.stringify(err.response.data, null, 2);
                    } else {
                      backendDetail = err.response.data;
                    }
                  } else {
                    backendDetail = err.message;
                  }
                  setCreateError('Tạo rule thất bại: ' + backendDetail);
                  console.error('Chi tiết lỗi:', JSON.stringify(err?.response?.data, null, 2));
                  alert('Chi tiết lỗi backend: ' + JSON.stringify(err?.response?.data, null, 2));
                } finally {
                  setCreateLoading(false);
                }
              }}
            >
              <div className="space-y-6">
                <div>
                  <label className={`block text-base font-bold mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Tên Rule <span className="text-red-400">*</span></label>
                  <input type="text" required value={createForm.RuleName} onChange={e => setCreateForm(f => ({...f, RuleName: e.target.value}))} className={`w-full px-5 py-4 rounded-xl text-lg shadow-sm transition-all duration-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-400
                    ${isDarkMode ? 'bg-white/20 border-2 border-purple-400 text-white placeholder:text-gray-400' : 'bg-white border border-gray-300 text-gray-800 font-semibold placeholder:text-gray-400'}`} placeholder="Ví dụ: Mimikatz Credential Dumping" />
                  <div className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Đặt tên ngắn gọn, dễ hiểu, không trùng lặp.</div>
                </div>
                <div>
                  <label className={`block text-base font-bold mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Loại Rule <span className="text-red-400">*</span></label>
                  <Listbox value={createForm.RuleType} onChange={val => { setCreateForm(f => ({...f, RuleType: val, RuleCondition: ruleTypeSamples[val] || ''})); setRuleConditionValid(true); }}>
                    {({ open }) => (
                      <div className="relative">
                        <Listbox.Button className={`w-full px-4 py-3 rounded-lg text-base shadow flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-150
                          ${isDarkMode ? 'bg-white/20 border-2 border-purple-400 text-white' : 'bg-white border-2 border-purple-400 text-gray-800 font-bold hover:bg-purple-50 hover:text-purple-700'}`}>
                          {ruleTypeOptions.find(o => o.value === createForm.RuleType)?.label || 'Chọn loại Rule'}
                          <ChevronUpDownIcon className="w-5 h-5 ml-2" />
                        </Listbox.Button>
                        <Listbox.Options className={`absolute z-50 mt-1 w-full rounded-xl shadow-2xl max-h-60 overflow-auto transition-all duration-150
                          ${isDarkMode ? 'bg-black border border-purple-500' : 'bg-white border border-purple-400'}`}>
                            {ruleTypeOptions.map(opt => (
                            <Listbox.Option key={opt.value} value={opt.value} className={({ active, selected }) =>
                              `cursor-pointer select-none px-4 py-2 transition-all duration-100
                              ${isDarkMode ? (active ? 'bg-purple-700 text-white' : 'text-white') : (active ? 'bg-purple-50 text-purple-700' : 'bg-white text-gray-800')}
                              ${selected ? (isDarkMode ? 'font-bold text-purple-300' : 'font-bold text-purple-700') : ''}`
                            }>
                                {opt.label}
                              </Listbox.Option>
                            ))}
                          </Listbox.Options>
                      </div>
                    )}
                  </Listbox>
                  <div className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Chọn loại rule phù hợp. Khi chọn sẽ tự gợi ý điều kiện mẫu.</div>
                </div>
                <div className="mb-3">
                  <label className={`block text-base font-bold mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Loại sự kiện (Event Type)</label>
                  <Listbox value={eventType} onChange={val => {
                    setEventType(val);
                    if (val) {
                      // Nếu JSON chưa có event_type hoặc khác loại, cập nhật event_type
                      let json = createForm.RuleCondition;
                      let obj = {};
                      try { obj = JSON.parse(json || '{}'); } catch { obj = {}; }
                      obj.event_type = val;
                      setCreateForm(f => ({...f, RuleCondition: JSON.stringify(obj, null, 2)}));
                      setRuleConditionValid(true);
                    }
                  }}>
                    {({ open }) => (
                      <div className="relative">
                        <Listbox.Button className={`w-full px-4 py-3 rounded-lg text-base shadow flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-150
                          ${isDarkMode ? 'bg-white/20 border-2 border-purple-400 text-white' : 'bg-white border-2 border-purple-400 text-gray-800 font-bold hover:bg-purple-50 hover:text-purple-700'}`}>
                          {eventTypeOptions.find(o => o.value === eventType)?.label || 'Chọn loại sự kiện'}
                          <ChevronUpDownIcon className="w-5 h-5 ml-2" />
                        </Listbox.Button>
                        <Listbox.Options className={`absolute z-50 mt-1 w-full rounded-xl shadow-2xl max-h-60 overflow-auto transition-all duration-150
                          ${isDarkMode ? 'bg-black border border-purple-500' : 'bg-white border border-purple-400'}`}>
                            {eventTypeOptions.map(opt => (
                            <Listbox.Option key={opt.value} value={opt.value} className={({ active, selected }) =>
                              `cursor-pointer select-none px-4 py-2 transition-all duration-100
                              ${isDarkMode ? (active ? 'bg-purple-700 text-white' : 'text-white') : (active ? 'bg-purple-50 text-purple-700' : 'bg-white text-gray-800')}
                              ${selected ? (isDarkMode ? 'font-bold text-purple-300' : 'font-bold text-purple-700') : ''}`
                            }>
                                {opt.label}
                              </Listbox.Option>
                            ))}
                          </Listbox.Options>
                      </div>
                    )}
                  </Listbox>
                  <div className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Chọn loại sự kiện để gợi ý trường và mẫu JSON phù hợp.</div>
                </div>
                <div>
                  <label className={`block text-base font-bold mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Điều kiện Rule</label>
                  {eventType ? (
                    <div className="bg-gradient-to-br from-slate-800 via-indigo-950 to-purple-950 rounded-2xl p-6 border-2 border-purple-500 shadow-2xl mb-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {(eventFieldMap[eventType] || []).filter(f => f.label !== 'logic').map(f => {
                          const key = f.label.replace(/"/g, '').replace(/[:,]/g, '').trim();
                          return (
                            <div key={key} className="flex flex-col gap-1">
                              <label className="text-sm font-semibold text-purple-200 mb-1">{key}</label>
                              <input
                                type="text"
                                className="px-4 py-3 rounded-xl bg-white/20 border-2 border-transparent focus:border-purple-400 text-white text-base shadow placeholder:text-purple-300 transition-all duration-200 focus:bg-white/30"
                                value={conditionFields[key] || ''}
                                onChange={e => setConditionFields(fields => ({...fields, [key]: e.target.value}))}
                                placeholder={`Nhập ${key}`}
                              />
                            </div>
                          );
                        })}
                        {/* Logic select: dùng Headless UI Listbox thay cho <select> */}
                        <div className="flex flex-col gap-1">
                          <label className="text-sm font-semibold text-purple-200 mb-1">Logic</label>
                          <Listbox value={conditionFields.logic || 'AND'} onChange={val => setConditionFields(fields => ({...fields, logic: val}))}>
                            {({ open }) => (
                              <div className="relative">
                                <Listbox.Button className="w-full px-4 py-3 rounded-xl bg-white/20 border-2 border-purple-400 text-white text-base shadow flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-purple-500">
                                  {conditionFields.logic || 'AND'}
                                  <ChevronUpDownIcon className="w-5 h-5 ml-2 text-purple-200" />
                                </Listbox.Button>
                                {open && (
                                  <Listbox.Options className="absolute z-50 mt-1 w-full bg-black border border-purple-500 rounded-xl shadow-2xl max-h-40 overflow-auto">
                                    {['AND', 'OR'].map(opt => (
                                      <Listbox.Option key={opt} value={opt} className={({ active, selected }) => `cursor-pointer select-none px-4 py-2 ${active ? 'bg-purple-700 text-white' : 'text-white'} ${selected ? 'font-bold' : ''}` }>
                                        {({ selected }) => (
                                          <div className="flex items-center gap-2">
                                            {selected && <CheckIcon className="w-4 h-4 text-green-400" />}
                                            {opt}
                                          </div>
                                        )}
                                      </Listbox.Option>
                                    ))}
                                  </Listbox.Options>
                                )}
                              </div>
                            )}
                          </Listbox>
                        </div>
                      </div>
                      {/* Hiển thị JSON sinh tự động */}
                      <div className="mt-6 bg-slate-900 rounded-xl p-4 border-2 border-purple-500 text-xs text-purple-100 font-mono whitespace-pre-wrap flex items-center justify-between">
                        <span>{createForm.RuleCondition}</span>
                        <button
                          className="ml-4 px-3 py-1 rounded bg-purple-700 text-white text-xs font-semibold hover:bg-purple-800 border border-purple-400 shadow"
                          onClick={() => navigator.clipboard.writeText(createForm.RuleCondition)}
                        >Copy JSON</button>
                      </div>
                    </div>
                  ) : null}
                </div>
                <div>
                  <label className={`block text-base font-bold mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Nền tảng (Platform) <span className="text-red-400">*</span></label>
                  <Listbox value={createForm.Platform} onChange={val => setCreateForm(f => ({...f, Platform: val}))}>
                    {({ open }) => (
                      <div className="relative">
                        <Listbox.Button className={`w-full px-4 py-3 rounded-lg text-base shadow flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-150
                          ${isDarkMode ? 'bg-white/20 border-2 border-purple-400 text-white' : 'bg-white border-2 border-purple-400 text-gray-800 font-bold hover:bg-purple-50 hover:text-purple-700'}`}>
                          {platformOptions.find(o => o.value === createForm.Platform)?.label || 'Chọn nền tảng'}
                          <ChevronUpDownIcon className="w-5 h-5 ml-2" />
                        </Listbox.Button>
                        <Listbox.Options className={`absolute z-50 mt-1 w-full rounded-xl shadow-2xl max-h-60 overflow-auto transition-all duration-150
                          ${isDarkMode ? 'bg-black border border-purple-500' : 'bg-white border border-purple-400'}`}>
                            {platformOptions.map(opt => (
                            <Listbox.Option key={opt.value} value={opt.value} className={({ active, selected }) =>
                              `cursor-pointer select-none px-4 py-2 transition-all duration-100
                              ${isDarkMode ? (active ? 'bg-purple-700 text-white' : 'text-white') : (active ? 'bg-purple-50 text-purple-700' : 'bg-white text-gray-800')}
                              ${selected ? (isDarkMode ? 'font-bold text-purple-300' : 'font-bold text-purple-700') : ''}`
                            }>
                                {opt.label}
                              </Listbox.Option>
                            ))}
                          </Listbox.Options>
                      </div>
                    )}
                  </Listbox>
                  <div className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Chọn hệ điều hành áp dụng rule.</div>
                </div>
                <div>
                  <label className={`block text-base font-bold mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Mô tả cảnh báo (alert_description) <span className="text-red-400">*</span></label>
                  <textarea
                    required
                    value={createForm.AlertDescription}
                    onChange={e => setCreateForm(f => ({...f, AlertDescription: e.target.value}))}
                    className={`w-full px-5 py-4 rounded-xl text-lg shadow transition-all duration-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-400
                      ${isDarkMode ? 'bg-white/20 border-2 border-purple-400 text-white placeholder:text-gray-400' : 'bg-white border border-gray-300 text-gray-800 font-semibold placeholder:text-gray-400'}`}
                    placeholder="Ví dụ: Phát hiện hành vi thực thi cmd.exe bất thường"
                    rows={3}
                  />
                  <div className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Nhập mô tả ngắn gọn về cảnh báo này.</div>
                  {createError && createError.includes('alert_description') && (
                    <div className="text-red-400 font-medium mt-1">{createError}</div>
                  )}
                </div>
              </div>
              <div className="space-y-6">
                <div>
                  <label className={`block text-base font-bold mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Tiêu đề Cảnh báo <span className="text-red-400">*</span></label>
                  <input type="text" required value={createForm.AlertTitle} onChange={e => setCreateForm(f => ({...f, AlertTitle: e.target.value}))} className={`w-full px-5 py-4 rounded-xl text-lg shadow-sm transition-all duration-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-400
                    ${isDarkMode ? 'bg-white/20 border-2 border-purple-400 text-white placeholder:text-gray-400' : 'bg-white border border-gray-300 text-gray-800 font-semibold placeholder:text-gray-400'}`} placeholder="Ví dụ: Mimikatz Credential Dumping Detected" />
                  <div className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Tiêu đề ngắn gọn cho cảnh báo khi rule khớp.</div>
                </div>
                <div>
                  <label className={`block text-base font-bold mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Mức độ (Severity) <span className="text-red-400">*</span></label>
                  <Listbox value={createForm.AlertSeverity} onChange={val => setCreateForm(f => ({...f, AlertSeverity: val}))}>
                    {({ open }) => (
                      <div className="relative">
                        <Listbox.Button className={`w-full px-4 py-3 rounded-lg text-base shadow flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-150
                          ${isDarkMode ? 'bg-white/20 border-2 border-purple-400 text-white' : 'bg-white border-2 border-purple-400 text-gray-800 font-bold hover:bg-purple-50 hover:text-purple-700'}`}>
                          {severityOptions.find(o => o.value === createForm.AlertSeverity)?.label || 'Chọn mức độ'}
                          <ChevronUpDownIcon className="w-5 h-5 ml-2" />
                        </Listbox.Button>
                        <Listbox.Options className={`absolute z-50 mt-1 w-full rounded-xl shadow-2xl max-h-60 overflow-auto transition-all duration-150
                          ${isDarkMode ? 'bg-black border border-purple-500' : 'bg-white border border-purple-400'}`}>
                            {severityOptions.map(opt => (
                            <Listbox.Option key={opt.value} value={opt.value} className={({ active, selected }) =>
                              `cursor-pointer select-none px-4 py-2 transition-all duration-100
                              ${isDarkMode ? (active ? 'bg-purple-700 text-white' : 'text-white') : (active ? 'bg-purple-50 text-purple-700' : 'bg-white text-gray-800')}
                              ${selected ? (isDarkMode ? 'font-bold text-purple-300' : 'font-bold text-purple-700') : ''}`
                            }>
                                {opt.label}
                              </Listbox.Option>
                            ))}
                          </Listbox.Options>
                      </div>
                    )}
                  </Listbox>
                  <div className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Chọn mức độ nghiêm trọng cho cảnh báo.</div>
                </div>
                <div className="mb-4">
                  <label className={`block text-base font-bold mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Loại Cảnh báo (AlertType) <span className="text-red-400">*</span></label>
                  <Listbox value={createForm.AlertType} onChange={val => setCreateForm(f => ({...f, AlertType: val}))}>
                    {({ open }) => (
                      <div className="relative">
                        <Listbox.Button className={`w-full px-4 py-3 rounded-lg text-base shadow flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-150
                          ${isDarkMode ? 'bg-white/20 border-2 border-purple-400 text-white' : 'bg-white border-2 border-purple-400 text-gray-800 font-bold hover:bg-purple-50 hover:text-purple-700'}`}>
                          {createForm.AlertType || 'Chọn loại cảnh báo...'}
                          <ChevronUpDownIcon className="w-5 h-5 ml-2" />
                        </Listbox.Button>
                        <Listbox.Options className={`absolute z-50 mt-1 w-full rounded-xl shadow-2xl max-h-60 overflow-auto transition-all duration-150
                          ${isDarkMode ? 'bg-black border border-purple-500' : 'bg-white border border-purple-400'}`}>
                            {alertTypeOptions.map(opt => (
                            <Listbox.Option key={opt} value={opt} className={({ active, selected }) =>
                              `cursor-pointer select-none px-4 py-2 transition-all duration-100
                              ${isDarkMode ? (active ? 'bg-purple-700 text-white' : 'text-white') : (active ? 'bg-purple-50 text-purple-700' : 'bg-white text-gray-800')}
                              ${selected ? (isDarkMode ? 'font-bold text-purple-300' : 'font-bold text-purple-700') : ''}`
                            }>
                                {({ selected }) => (
                                  <div className="flex items-center gap-2">
                                    {selected && <CheckIcon className="w-4 h-4 text-green-400" />}
                                    {opt}
                                  </div>
                                )}
                              </Listbox.Option>
                            ))}
                          </Listbox.Options>
                      </div>
                    )}
                  </Listbox>
                </div>
                <div className="mb-4">
                  <label className={`block text-base font-bold mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>MITRE Tactic <span className="text-red-400">*</span></label>
                  <Listbox value={createForm.MitreTactic} onChange={val => setCreateForm(f => ({...f, MitreTactic: val}))}>
                    {({ open }) => (
                      <div className="relative">
                        <Listbox.Button className={`w-full px-4 py-3 rounded-lg text-base shadow flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-150
                          ${isDarkMode ? 'bg-white/20 border-2 border-purple-400 text-white' : 'bg-white border-2 border-purple-400 text-gray-800 font-bold hover:bg-purple-50 hover:text-purple-700'}`}>
                          {createForm.MitreTactic || 'Chọn tactic...'}
                          <ChevronUpDownIcon className="w-5 h-5 ml-2" />
                        </Listbox.Button>
                        <Listbox.Options className={`absolute z-50 mt-1 w-full rounded-xl shadow-2xl max-h-60 overflow-auto transition-all duration-150
                          ${isDarkMode ? 'bg-black border border-purple-500' : 'bg-white border border-purple-400'}`}>
                            {mitreTacticOptions.map(opt => (
                            <Listbox.Option key={opt} value={opt} className={({ active, selected }) =>
                              `cursor-pointer select-none px-4 py-2 transition-all duration-100
                              ${isDarkMode ? (active ? 'bg-purple-700 text-white' : 'text-white') : (active ? 'bg-purple-50 text-purple-700' : 'bg-white text-gray-800')}
                              ${selected ? (isDarkMode ? 'font-bold text-purple-300' : 'font-bold text-purple-700') : ''}`
                            }>
                                {({ selected }) => (
                                  <div className="flex items-center gap-2">
                                    {selected && <CheckIcon className="w-4 h-4 text-green-400" />}
                                    {opt}
                                  </div>
                                )}
                              </Listbox.Option>
                            ))}
                          </Listbox.Options>
                      </div>
                    )}
                  </Listbox>
                </div>
                <div className="mb-4">
                  <label className={`block text-base font-bold mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>MITRE Technique <span className="text-red-400">*</span></label>
                  <div className="flex gap-2 items-center">
                    <div className="flex-1 min-w-0">
                      <Listbox value={isOtherMitreTechnique ? 'Khác' : createForm.MitreTechnique} onChange={val => {
                        if (val === 'Khác') {
                          setIsOtherMitreTechnique(true);
                          setCreateForm(f => ({...f, MitreTechnique: ''}));
                        } else {
                          setIsOtherMitreTechnique(false);
                          setCreateForm(f => ({...f, MitreTechnique: val}));
                          setCustomMitreTechnique('');
                        }
                      }}>
                        {({ open }) => (
                          <div className="relative">
                            <Listbox.Button className={`w-full px-4 py-3 rounded-lg text-base shadow flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-150
                              ${isDarkMode ? 'bg-white/20 border-2 border-purple-400 text-white' : 'bg-white border-2 border-purple-400 text-gray-800 font-bold hover:bg-purple-50 hover:text-purple-700'}`}>
                              {isOtherMitreTechnique ? 'Khác' : (createForm.MitreTechnique || 'Chọn technique...')}
                              <ChevronUpDownIcon className="w-5 h-5 ml-2" />
                            </Listbox.Button>
                            <Listbox.Options className={`absolute z-50 mt-1 w-full rounded-xl shadow-2xl max-h-60 overflow-auto transition-all duration-150
                              ${isDarkMode ? 'bg-black border border-purple-500' : 'bg-white border border-purple-400'}`}>
                                {['Khác', ...uniqueMitreTechniqueOptions].map(opt => (
                                <Listbox.Option key={opt} value={opt} className={({ active, selected }) =>
                                  `cursor-pointer select-none px-4 py-2 transition-all duration-100
                                  ${isDarkMode ? (active ? 'bg-purple-700 text-white' : 'text-white') : (active ? 'bg-purple-50 text-purple-700' : 'bg-white text-gray-800')}
                                  ${selected ? (isDarkMode ? 'font-bold text-purple-300' : 'font-bold text-purple-700') : ''}`
                                }>
                                    {({ selected }) => (
                                      <div className="flex items-center gap-2">
                                        {selected && <CheckIcon className="w-4 h-4 text-green-400" />}
                                        {opt}
                                      </div>
                                    )}
                                  </Listbox.Option>
                                ))}
                              </Listbox.Options>
                          </div>
                        )}
                      </Listbox>
                    </div>
                    {isOtherMitreTechnique && (
                      <input
                        type="text"
                        className="ml-2 flex-1 px-4 py-3 rounded-xl bg-slate-900 border-2 border-purple-400 text-white text-base focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder:text-gray-400 transition-all duration-150"
                        style={{ minWidth: 0 }}
                        placeholder="Nhập MITRE technique..."
                        value={customMitreTechnique}
                        onChange={e => setCustomMitreTechnique(e.target.value)}
                        onBlur={() => setCreateForm(f => ({...f, MitreTechnique: customMitreTechnique}))}
                        onKeyDown={e => { if (e.key === 'Enter') setCreateForm(f => ({...f, MitreTechnique: customMitreTechnique})); }}
                        autoFocus
                      />
                    )}
                  </div>
                  <span className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Chọn từ danh sách hoặc chọn 'Khác' để nhập tự do.</span>
                </div>
              </div>
              <div className={`col-span-full md:col-span-2 rounded-2xl p-6 mt-8 mb-4 shadow-xl border transition-all duration-300
                ${isDarkMode ? 'bg-gray-800 border-white/10 text-gray-100' : 'bg-gray-100 border border-gray-300 text-gray-800'}
                w-full max-w-none min-w-0
              `}>
                <h3 className={`text-2xl mb-4 font-bold ${isDarkMode ? 'text-purple-300' : 'text-purple-600'}`}>Hướng dẫn tạo Rule phát hiện (Detection Rule)</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li><span className="font-bold">Tên Rule:</span> Đặt tên ngắn gọn, dễ hiểu, không trùng lặp.</li>
                  <li><span className="font-bold">Loại Rule:</span> Chọn 1 trong các loại: <span className="font-bold">Behavioral</span> (hành vi), <span className="font-bold">Signature</span> (chữ ký), <span className="font-bold">Threshold</span> (ngưỡng), <span className="font-bold">Correlation</span> (liên kết sự kiện).</li>
                  <li><span className="font-bold">Điều kiện Rule (JSON):</span> Mô tả điều kiện phát hiện, ví dụ:</li>
                  <li>
                    <pre className={`rounded-lg p-4 text-sm overflow-x-auto mt-2 mb-2 font-mono
                      ${isDarkMode ? 'bg-slate-900 text-purple-100' : 'bg-gray-200 text-gray-900'}`}>{`{
  "process_name": "powershell.exe",
  "command_line_contains": ["-Enc", "-EncodedCommand"],
  "logic": "AND"
}`}</pre>
                  </li>
                  <li><span className="font-bold">Tiêu đề Cảnh báo:</span> Tiêu đề ngắn gọn cho cảnh báo khi rule khớp.</li>
                  <li><span className="font-bold">Mức độ (Severity):</span> Chọn mức độ nghiêm trọng: <span className="font-bold">Critical</span>, <span className="font-bold">High</span>, <span className="font-bold">Medium</span>, <span className="font-bold">Low</span>.</li>
                  <li><span className="font-bold">Loại Cảnh báo (AlertType):</span> Phân loại cảnh báo, ví dụ: <span className="font-bold">Credential Access</span>, <span className="font-bold">Execution</span>, <span className="font-bold">Persistence</span>, ...</li>
                  <li><span className="font-bold">Nền tảng (Platform):</span> Chọn <span className="font-bold">Windows</span>, <span className="font-bold">Linux</span> hoặc <span className="font-bold">All</span>.</li>
                  <li><span className="font-bold">MITRE Tactic/Technique:</span> (Không bắt buộc) – Tham khảo <a href="https://attack.mitre.org/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">MITRE ATT&CK</a> để điền đúng tactic/technique.</li>
                </ul>
              </div>
              <div className="md:col-span-2 flex flex-col gap-2 mt-2">
                {createError && <div className="text-red-400 font-medium">{createError}</div>}
                <button type="submit" disabled={createLoading || !ruleConditionValid} className="w-full py-3 rounded-lg bg-blue-600 text-white font-bold text-lg hover:bg-blue-700 transition-colors disabled:opacity-50 shadow-lg">{createLoading ? 'Đang tạo...' : 'Tạo Rule'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal chỉnh sửa Rule - FIX TEXT VISIBILITY */}
      {showEditModal && editRule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className={`max-w-3xl w-full max-h-[90vh] overflow-y-auto relative animate-fadeIn
            rounded-2xl shadow-2xl border transition-all duration-300
            ${isDarkMode
              ? 'bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 border-white/10 text-white'
              : 'bg-white border-gray-200 text-gray-900'}
          `}>
            <div className={`flex items-center justify-between p-6 border-b transition-colors duration-300
              ${isDarkMode ? 'border-white/10' : 'border-gray-200'}
            `}>
              <div className="flex items-center gap-3">
                <PencilIcon className={`w-8 h-8 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Edit Detection Rule</h2>
              </div>
              <button
                onClick={() => { setShowEditModal(false); setEditRule(null); }}
                className="p-2 rounded-lg hover:bg-purple-900/40 transition-colors group"
                aria-label="Close edit"
              >
                <XCircleIcon className={`w-7 h-7 transition-colors ${isDarkMode ? 'text-gray-300 group-hover:text-red-400' : 'text-gray-400 group-hover:text-red-500'}`} />
              </button>
            </div>
            <form className="px-8 py-8" onSubmit={async (e) => {
              e.preventDefault();
              await handleSaveEditRule(editRule);
            }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <label className={`block text-base font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Rule Name <span className="text-red-400">*</span></label>
                    <input 
                      type="text" 
                      required 
                      value={editRule.rule_name || ''} 
                      onChange={e => setEditRule(r => ({...r, rule_name: e.target.value}))}
                      className={`w-full px-5 py-4 rounded-xl text-lg shadow-sm transition-all duration-200
                        focus:ring-2 focus:ring-purple-500 focus:border-purple-400
                        ${isDarkMode
                          ? 'bg-white/20 border-2 border-purple-400 text-white placeholder:text-gray-300'
                          : 'bg-white border border-gray-300 text-gray-900 font-semibold placeholder:text-gray-500'}
                      `}
                      placeholder="Enter rule name"
                    />
                  </div>
                  <div>
                    <label className={`block text-base font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Rule Type</label>
                    <Listbox value={editRule.rule_type || editRule.RuleType || ''} onChange={val => setEditRule(r => ({...r, rule_type: val}))}>
                      {({ open }) => (
                        <div className="relative">
                          <Listbox.Button className={`w-full px-4 py-3 rounded-lg border-2 text-base shadow flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-purple-500
                            ${isDarkMode 
                              ? 'bg-white/20 border-purple-400 text-white' 
                              : 'bg-white border-gray-300 text-gray-900 font-semibold'}
                          `}>
                            {editRule.rule_type || editRule.RuleType || 'Chọn loại Rule'}
                            <ChevronUpDownIcon className={`w-5 h-5 ml-2 ${isDarkMode ? 'text-purple-200' : 'text-gray-500'}`} />
                          </Listbox.Button>
                          {open && (
                            <Listbox.Options className={`absolute z-50 mt-1 w-full border rounded-xl shadow-2xl max-h-60 overflow-auto
                              ${isDarkMode ? 'bg-slate-900 border-purple-500' : 'bg-white border-gray-300'}
                            `}>
                              {['Behavioral','Signature','Threshold','Correlation'].map(opt => (
                                <Listbox.Option key={opt} value={opt} className={({ active, selected }) => `cursor-pointer select-none px-4 py-2 
                                  ${active ? (isDarkMode ? 'bg-purple-700 text-white' : 'bg-blue-100 text-blue-900') : (isDarkMode ? 'text-white' : 'text-gray-900')} 
                                  ${selected ? 'font-bold' : ''}` 
                                }>
                                  {({ selected }) => (
                                    <div className="flex items-center gap-2">
                                      {selected && <CheckIcon className="w-4 h-4 text-green-400" />}
                                      {opt}
                                    </div>
                                  )}
                                </Listbox.Option>
                              ))}
                            </Listbox.Options>
                          )}
                        </div>
                      )}
                    </Listbox>
                  </div>
                  <div>
                    <label className={`block text-base font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Platform</label>
                    <Listbox value={editRule.platform || editRule.Platform || ''} onChange={val => setEditRule(r => ({...r, platform: val}))}>
                      {({ open }) => (
                        <div className="relative">
                          <Listbox.Button className={`w-full px-4 py-3 rounded-lg border-2 text-base shadow flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-purple-500
                            ${isDarkMode 
                              ? 'bg-white/20 border-purple-400 text-white' 
                              : 'bg-white border-gray-300 text-gray-900 font-semibold'}
                          `}>
                            {editRule.platform || editRule.Platform || 'Chọn nền tảng'}
                            <ChevronUpDownIcon className={`w-5 h-5 ml-2 ${isDarkMode ? 'text-purple-200' : 'text-gray-500'}`} />
                          </Listbox.Button>
                          {open && (
                            <Listbox.Options className={`absolute z-50 mt-1 w-full border rounded-xl shadow-2xl max-h-60 overflow-auto
                              ${isDarkMode ? 'bg-slate-900 border-purple-500' : 'bg-white border-gray-300'}
                            `}>
                              {['All','Windows','Linux'].map(opt => (
                                <Listbox.Option key={opt} value={opt} className={({ active, selected }) => `cursor-pointer select-none px-4 py-2 
                                  ${active ? (isDarkMode ? 'bg-purple-700 text-white' : 'bg-blue-100 text-blue-900') : (isDarkMode ? 'text-white' : 'text-gray-900')} 
                                  ${selected ? 'font-bold' : ''}` 
                                }>
                                  {({ selected }) => (
                                    <div className="flex items-center gap-2">
                                      {selected && <CheckIcon className="w-4 h-4 text-green-400" />}
                                      {opt}
                                    </div>
                                  )}
                                </Listbox.Option>
                              ))}
                            </Listbox.Options>
                          )}
                        </div>
                      )}
                    </Listbox>
                  </div>
                  <div>
                    <label className={`block text-base font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Description</label>
                    <textarea 
                      value={editRule.description || ''} 
                      onChange={e => setEditRule(r => ({...r, description: e.target.value}))} 
                      className={`w-full px-5 py-4 rounded-xl text-lg shadow transition-all duration-200
                        focus:ring-2 focus:ring-purple-500 focus:border-purple-400
                        ${isDarkMode
                          ? 'bg-white/20 border-2 border-purple-400 text-white placeholder:text-gray-300'
                          : 'bg-white border border-gray-300 text-gray-900 placeholder:text-gray-500'}
                      `} 
                      placeholder="Describe what this rule detects" 
                      rows={3} 
                    />
                  </div>
                  <div>
                    <label className={`block text-base font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Priority</label>
                    <input 
                      type="number" 
                      min={1} 
                      max={100} 
                      value={editRule.priority || editRule.Priority || 50} 
                      onChange={e => setEditRule(r => ({...r, priority: Number(e.target.value)}))} 
                      className={`w-full px-5 py-4 rounded-xl text-lg shadow transition-all duration-200
                        focus:ring-2 focus:ring-purple-500 focus:border-purple-400
                        ${isDarkMode
                          ? 'bg-white/20 border-2 border-purple-400 text-white placeholder:text-gray-300'
                          : 'bg-white border border-gray-300 text-gray-900 placeholder:text-gray-500'}
                      `} 
                      placeholder="Priority (1-100)" 
                    />
                  </div>
                  <div>
                    <label className={`block text-base font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Test Mode</label>
                    <div className="flex items-center gap-3">
                      <input 
                        type="checkbox" 
                        checked={editRule.test_mode === true || editRule.TestMode === true} 
                        onChange={e => setEditRule(r => ({...r, test_mode: e.target.checked}))} 
                        className="w-5 h-5 rounded border-purple-400 focus:ring-purple-500" 
                      />
                      <span className={`text-base font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Enable test mode</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-6">
                  <div>
                    <label className={`block text-base font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Alert Title <span className="text-red-400">*</span></label>
                    <input 
                      type="text" 
                      required 
                      value={editRule.alert_title || ''} 
                      onChange={e => setEditRule(r => ({...r, alert_title: e.target.value}))} 
                      className={`w-full px-5 py-4 rounded-xl text-lg shadow transition-all duration-200
                        focus:ring-2 focus:ring-purple-500 focus:border-purple-400
                        ${isDarkMode
                          ? 'bg-white/20 border-2 border-purple-400 text-white placeholder:text-gray-300'
                          : 'bg-white border border-gray-300 text-gray-900 placeholder:text-gray-500'}
                      `} 
                      placeholder="Alert title when rule triggers" 
                    />
                  </div>
                  <div>
                    <label className={`block text-base font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Severity</label>
                    <Listbox value={editRule.alert_severity || editRule.AlertSeverity || ''} onChange={val => setEditRule(r => ({...r, alert_severity: val}))}>
                      {({ open }) => (
                        <div className="relative">
                          <Listbox.Button className={`w-full px-4 py-3 rounded-lg border-2 text-base shadow flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-purple-500
                            ${isDarkMode 
                              ? 'bg-white/20 border-purple-400 text-white' 
                              : 'bg-white border-gray-300 text-gray-900 font-semibold'}
                          `}>
                            {editRule.alert_severity || editRule.AlertSeverity || 'Chọn mức độ'}
                            <ChevronUpDownIcon className={`w-5 h-5 ml-2 ${isDarkMode ? 'text-purple-200' : 'text-gray-500'}`} />
                          </Listbox.Button>
                          {open && (
                            <Listbox.Options className={`absolute z-50 mt-1 w-full border rounded-xl shadow-2xl max-h-60 overflow-auto
                              ${isDarkMode ? 'bg-slate-900 border-purple-500' : 'bg-white border-gray-300'}
                            `}>
                              {['Critical','High','Medium','Low'].map(opt => (
                                <Listbox.Option key={opt} value={opt} className={({ active, selected }) => `cursor-pointer select-none px-4 py-2 
                                  ${active ? (isDarkMode ? 'bg-purple-700 text-white' : 'bg-blue-100 text-blue-900') : (isDarkMode ? 'text-white' : 'text-gray-900')} 
                                  ${selected ? 'font-bold' : ''}` 
                                }>
                                  {({ selected }) => (
                                    <div className="flex items-center gap-2">
                                      {selected && <CheckIcon className="w-4 h-4 text-green-400" />}
                                      {opt}
                                    </div>
                                  )}
                                </Listbox.Option>
                              ))}
                            </Listbox.Options>
                          )}
                        </div>
                      )}
                    </Listbox>
                  </div>
                  <div>
                    <label className={`block text-base font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Alert Type</label>
                    <Listbox value={editRule.alert_type || editRule.AlertType || ''} onChange={val => setEditRule(r => ({...r, alert_type: val}))}>
                      {({ open }) => (
                        <div className="relative">
                          <Listbox.Button className={`w-full px-4 py-3 rounded-lg border-2 text-base shadow flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-purple-500
                            ${isDarkMode 
                              ? 'bg-white/20 border-purple-400 text-white' 
                              : 'bg-white border-gray-300 text-gray-900 font-semibold'}
                          `}>
                            {editRule.alert_type || editRule.AlertType || 'Chọn loại cảnh báo...'}
                            <ChevronUpDownIcon className={`w-5 h-5 ml-2 ${isDarkMode ? 'text-purple-200' : 'text-gray-500'}`} />
                          </Listbox.Button>
                          {open && (
                            <Listbox.Options className={`absolute z-50 mt-1 w-full border rounded-xl shadow-2xl max-h-60 overflow-auto
                              ${isDarkMode ? 'bg-slate-900 border-purple-500' : 'bg-white border-gray-300'}
                            `}>
                              {['Credential Access','Execution','Persistence','Defense Evasion','Discovery','Lateral Movement','Collection','Exfiltration','Command and Control','Impact','Initial Access','Privilege Escalation','Reconnaissance','Resource Development'].map(opt => (
                                <Listbox.Option key={opt} value={opt} className={({ active, selected }) => `cursor-pointer select-none px-4 py-2 
                                  ${active ? (isDarkMode ? 'bg-purple-700 text-white' : 'bg-blue-100 text-blue-900') : (isDarkMode ? 'text-white' : 'text-gray-900')} 
                                  ${selected ? 'font-bold' : ''}` 
                                }>
                                  {({ selected }) => (
                                    <div className="flex items-center gap-2">
                                      {selected && <CheckIcon className="w-4 h-4 text-green-400" />}
                                      {opt}
                                    </div>
                                  )}
                                </Listbox.Option>
                              ))}
                            </Listbox.Options>
                          )}
                        </div>
                      )}
                    </Listbox>
                  </div>
                  <div>
                    <label className={`block text-base font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>MITRE Tactic</label>
                    <Listbox value={editRule.mitre_tactic || editRule.MitreTactic || ''} onChange={val => setEditRule(r => ({...r, mitre_tactic: val}))}>
                      {({ open }) => (
                        <div className="relative">
                          <Listbox.Button className={`w-full px-4 py-3 rounded-lg border-2 text-base shadow flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-purple-500
                            ${isDarkMode 
                              ? 'bg-white/20 border-purple-400 text-white' 
                              : 'bg-white border-gray-300 text-gray-900 font-semibold'}
                          `}>
                            {editRule.mitre_tactic || editRule.MitreTactic || 'Chọn tactic...'}
                            <ChevronUpDownIcon className={`w-5 h-5 ml-2 ${isDarkMode ? 'text-purple-200' : 'text-gray-500'}`} />
                          </Listbox.Button>
                          {open && (
                            <Listbox.Options className={`absolute z-50 mt-1 w-full border rounded-xl shadow-2xl max-h-60 overflow-auto
                              ${isDarkMode ? 'bg-slate-900 border-purple-500' : 'bg-white border-gray-300'}
                            `}>
                              {['Credential Access','Execution','Persistence','Defense Evasion','Discovery','Lateral Movement','Collection','Exfiltration','Command and Control','Impact','Initial Access','Privilege Escalation','Reconnaissance','Resource Development'].map(opt => (
                                <Listbox.Option key={opt} value={opt} className={({ active, selected }) => `cursor-pointer select-none px-4 py-2 
                                  ${active ? (isDarkMode ? 'bg-purple-700 text-white' : 'bg-blue-100 text-blue-900') : (isDarkMode ? 'text-white' : 'text-gray-900')} 
                                  ${selected ? 'font-bold' : ''}` 
                                }>
                                  {({ selected }) => (
                                    <div className="flex items-center gap-2">
                                      {selected && <CheckIcon className="w-4 h-4 text-green-400" />}
                                      {opt}
                                    </div>
                                  )}
                                </Listbox.Option>
                              ))}
                            </Listbox.Options>
                          )}
                        </div>
                      )}
                    </Listbox>
                  </div>
                  <div>
                    <label className={`block text-base font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>MITRE Technique <span className="text-red-400">*</span></label>
                    <input 
                      type="text" 
                      required 
                      value={editRule.mitre_technique || editRule.MitreTechnique || ''} 
                      onChange={e => setEditRule(r => ({...r, mitre_technique: e.target.value}))} 
                      className={`w-full px-5 py-4 rounded-xl text-lg shadow transition-all duration-200
                        focus:ring-2 focus:ring-purple-500 focus:border-purple-400
                        ${isDarkMode
                          ? 'bg-white/20 border-2 border-purple-400 text-white placeholder:text-gray-300'
                          : 'bg-white border border-gray-300 text-gray-900 placeholder:text-gray-500'}
                      `} 
                      placeholder="Chọn MITRE Technique hoặc nhập tự do" 
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-8 border-t border-white/10 pt-6">
                <div className="flex items-center gap-3">
                  <input 
                    type="checkbox" 
                    checked={editRule.is_active === true || editRule.IsActive === true} 
                    onChange={e => setEditRule(r => ({...r, is_active: e.target.checked}))} 
                    className="w-5 h-5 rounded border-purple-400 focus:ring-purple-500" 
                  />
                  <span className={`text-base font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Enable rule immediately</span>
                </div>
                <div className="flex gap-3 mt-4 md:mt-0">
                  <button 
                    type="button" 
                    onClick={() => { setShowEditModal(false); setEditRule(null); }} 
                    className={`px-6 py-3 rounded-xl font-semibold transition-all shadow
                      ${isDarkMode 
                        ? 'bg-gray-600 text-white hover:bg-gray-700' 
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}
                    `}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className={`px-6 py-3 rounded-xl font-bold transition-all shadow
                      ${isDarkMode 
                        ? 'bg-purple-600 text-white hover:bg-purple-700' 
                        : 'bg-purple-600 text-white hover:bg-purple-700'}
                    `}
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Rules;