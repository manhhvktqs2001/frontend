import React, { useState, useEffect } from 'react';
import {
  PlusIcon,
  CodeBracketIcon,
  DocumentTextIcon,
  ShieldCheckIcon,
  BoltIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XMarkIcon,
  EyeIcon,
  PlayIcon,
  BookmarkIcon,
  CpuChipIcon,
  DocumentIcon,
  GlobeAltIcon,
  UserIcon,
  ComputerDesktopIcon,
  WrenchScrewdriverIcon,
  CheckIcon,
  ChevronUpDownIcon
} from '@heroicons/react/24/outline';
import { Listbox } from '@headlessui/react';

const RuleCreator = ({ onClose, onSave, rule, mode }) => {
  const [activeTab, setActiveTab] = useState('wizard');
  const [ruleData, setRuleData] = useState({
    rule_name: '',
    rule_type: 'behavioral',
    alert_title: '',
    alert_severity: 'medium',
    platform: 'all',
    mitre_tactic: '',
    mitre_technique: '',
    description: '',
    rule_content: '',
    is_active: true
  });
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [conditions, setConditions] = useState([]);
  const [previewMode, setPreviewMode] = useState(false);
  const [mitreTechniques, setMitreTechniques] = useState([]);
  const [customMitreTechnique, setCustomMitreTechnique] = useState('');

  // Rule Templates
  const ruleTemplates = [
    {
      id: 'suspicious_powershell',
      name: 'Suspicious PowerShell Activity',
      category: 'Process Monitoring',
      description: 'Detect potentially malicious PowerShell commands',
      severity: 'high',
      mitre: 'T1059.001',
      platform: 'windows',
      template: {
        rule_type: 'behavioral',
        conditions: [
          { field: 'process_name', operator: 'equals', value: 'powershell.exe' },
          { field: 'command_line', operator: 'contains', value: '-enc' },
        ]
      }
    },
    {
      id: 'file_modification',
      name: 'System File Modification',
      category: 'File Monitoring',
      description: 'Monitor critical system file modifications',
      severity: 'medium',
      mitre: 'T1565.001',
      platform: 'all',
      template: {
        rule_type: 'behavioral',
        conditions: [
          { field: 'event_type', operator: 'equals', value: 'file' },
          { field: 'file_path', operator: 'contains', value: 'System32' },
          { field: 'file_action', operator: 'equals', value: 'modify' }
        ]
      }
    },
    {
      id: 'network_connection',
      name: 'Suspicious Network Connection',
      category: 'Network Monitoring',
      description: 'Detect connections to suspicious IPs',
      severity: 'high',
      mitre: 'T1071.001',
      platform: 'all',
      template: {
        rule_type: 'behavioral',
        conditions: [
          { field: 'event_type', operator: 'equals', value: 'network' },
          { field: 'dest_port', operator: 'equals', value: '4444' }
        ]
      }
    },
    {
      id: 'registry_persistence',
      name: 'Registry Persistence',
      category: 'Registry Monitoring',
      description: 'Detect registry modifications for persistence',
      severity: 'medium',
      mitre: 'T1547.001',
      platform: 'windows',
      template: {
        rule_type: 'behavioral',
        conditions: [
          { field: 'event_type', operator: 'equals', value: 'registry' },
          { field: 'registry_key', operator: 'contains', value: 'Run' }
        ]
      }
    },
    {
      id: 'credential_access',
      name: 'Credential Dumping',
      category: 'Credential Access',
      description: 'Detect credential dumping activities',
      severity: 'critical',
      mitre: 'T1003.001',
      platform: 'windows',
      template: {
        rule_type: 'behavioral',
        conditions: [
          { field: 'process_name', operator: 'contains', value: 'mimikatz' },
        ]
      }
    }
  ];

  // Available fields for conditions
  const availableFields = [
    { group: 'Process', fields: ['process_name', 'command_line', 'process_id', 'parent_process'] },
    { group: 'File', fields: ['file_path', 'file_name', 'file_action', 'file_hash'] },
    { group: 'Network', fields: ['dest_ip', 'dest_port', 'src_ip', 'src_port', 'protocol'] },
    { group: 'Registry', fields: ['registry_key', 'registry_value', 'registry_action'] },
    { group: 'User', fields: ['username', 'user_domain', 'login_type'] },
    { group: 'System', fields: ['event_type', 'timestamp', 'agent_id', 'severity'] }
  ];

  const operators = [
    { value: 'equals', label: 'Equals' },
    { value: 'contains', label: 'Contains' },
    { value: 'starts_with', label: 'Starts With' },
    { value: 'ends_with', label: 'Ends With' },
    { value: 'regex', label: 'Regex Match' },
    { value: 'greater_than', label: 'Greater Than' },
    { value: 'less_than', label: 'Less Than' },
    { value: 'not_equals', label: 'Not Equals' }
  ];

  const tabs = [
    { id: 'wizard', label: 'Rule Wizard', icon: BoltIcon },
    { id: 'templates', label: 'Templates', icon: DocumentTextIcon },
    { id: 'advanced', label: 'Advanced', icon: CodeBracketIcon }
  ];

  // Load template
  const loadTemplate = (template) => {
    setSelectedTemplate(template);
    setRuleData({
      ...ruleData,
      rule_name: template.name,
      alert_title: template.name,
      alert_severity: template.severity,
      platform: template.platform,
      mitre_technique: template.mitre,
      description: template.description,
      rule_type: template.template.rule_type
    });
    setConditions(template.template.conditions);
    setActiveTab('wizard');
  };

  // Add new condition
  const addCondition = () => {
    setConditions([
      ...conditions,
      { field: 'process_name', operator: 'equals', value: '', logic: 'AND' }
    ]);
  };

  // Update condition
  const updateCondition = (index, key, value) => {
    const newConditions = [...conditions];
    newConditions[index][key] = value;
    setConditions(newConditions);
  };

  // Remove condition
  const removeCondition = (index) => {
    setConditions(conditions.filter((_, i) => i !== index));
  };

  // Generate rule content
  const generateRuleContent = () => {
    if (ruleData.rule_type === 'behavioral') {
      const conditionStrings = conditions.map((condition, index) => {
        const logic = index > 0 ? ` ${condition.logic} ` : '';
        return `${logic}${condition.field} ${condition.operator} "${condition.value}"`;
      });
      return conditionStrings.join('');
    }
    return ruleData.rule_content;
  };

  // Test rule
  const testRule = () => {
    const ruleContent = generateRuleContent();
    console.log('Testing rule:', ruleContent);
    // Here you would call your API to test the rule
  };

  // Save rule
  const handleSave = () => {
    const finalRuleData = {
      ...ruleData,
      rule_content: generateRuleContent()
    };
    onSave?.(finalRuleData);
  };

  // Wizard Tab
  const WizardTab = () => (
    <div className="space-y-6">
      {/* Basic Information */}
      <div className="bg-white/80 rounded-xl p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <DocumentIcon className="w-5 h-5 text-blue-600" />
          Basic Information
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Rule Name *</label>
            <input
              type="text"
              value={ruleData.rule_name}
              onChange={(e) => setRuleData({...ruleData, rule_name: e.target.value})}
              placeholder="Enter rule name"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Alert Title *</label>
            <input
              type="text"
              value={ruleData.alert_title}
              onChange={(e) => setRuleData({...ruleData, alert_title: e.target.value})}
              placeholder="Alert title when rule triggers"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Rule Type</label>
            <select
              value={ruleData.rule_type}
              onChange={(e) => setRuleData({...ruleData, rule_type: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="behavioral">Behavioral</option>
              <option value="signature">Signature</option>
              <option value="threshold">Threshold</option>
              <option value="correlation">Correlation</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Severity</label>
            <select
              value={ruleData.alert_severity}
              onChange={(e) => setRuleData({...ruleData, alert_severity: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Platform</label>
            <select
              value={ruleData.platform}
              onChange={(e) => setRuleData({...ruleData, platform: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Platforms</option>
              <option value="windows">Windows</option>
              <option value="linux">Linux</option>
              <option value="macos">macOS</option>
            </select>
          </div>
          
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-purple-200 mb-1">MITRE Technique <span className="text-red-400">*</span></label>
            <div className="flex gap-2 items-center">
              <div className="flex-1">
                <Listbox value={ruleData.mitre_technique} onChange={val => setRuleData({...ruleData, mitre_technique: val})}>
                  {({ open }) => (
                    <div className="relative">
                      <Listbox.Button className="w-full px-4 py-3 rounded-xl bg-white/20 border-2 border-purple-400 text-white text-base shadow flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-purple-500">
                        {ruleData.mitre_technique || 'Chọn MITRE Technique'}
                        <ChevronUpDownIcon className="w-5 h-5 ml-2 text-purple-200" />
                      </Listbox.Button>
                      {open && (
                        <Listbox.Options className="absolute z-50 mt-1 w-full bg-black border border-purple-500 rounded-xl shadow-2xl max-h-40 overflow-auto">
                          {mitreTechniques.map(opt => (
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
              <input
                type="text"
                className="w-40 px-3 py-2 rounded-xl bg-slate-900 border-2 border-purple-400 text-white text-base focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Nhập tự do..."
                value={customMitreTechnique || ''}
                onChange={e => {
                  setCustomMitreTechnique(e.target.value);
                  setRuleData({...ruleData, mitre_technique: e.target.value || ruleData.mitre_technique});
                }}
              />
            </div>
            <span className="text-xs text-purple-300">Chọn từ danh sách hoặc nhập tự do nếu không có.</span>
          </div>
        </div>
        
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea
            value={ruleData.description}
            onChange={(e) => setRuleData({...ruleData, description: e.target.value})}
            placeholder="Describe what this rule detects"
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Rule Conditions */}
      <div className="bg-white/80 rounded-xl p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <BoltIcon className="w-5 h-5 text-orange-600" />
            Detection Conditions
          </h3>
          <button
            onClick={addCondition}
            className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
          >
            <PlusIcon className="w-4 h-4" />
            Add Condition
          </button>
        </div>
        
        <div className="space-y-3">
          {conditions.map((condition, index) => (
            <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              {index > 0 && (
                <select
                  value={condition.logic}
                  onChange={(e) => updateCondition(index, 'logic', e.target.value)}
                  className="px-2 py-1 border border-gray-300 rounded text-sm"
                >
                  <option value="AND">AND</option>
                  <option value="OR">OR</option>
                </select>
              )}
              
              <select
                value={condition.field}
                onChange={(e) => updateCondition(index, 'field', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              >
                {availableFields.map(group => (
                  <optgroup key={group.group} label={group.group}>
                    {group.fields.map(field => (
                      <option key={field} value={field}>{field}</option>
                    ))}
                  </optgroup>
                ))}
              </select>
              
              <select
                value={condition.operator}
                onChange={(e) => updateCondition(index, 'operator', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              >
                {operators.map(op => (
                  <option key={op.value} value={op.value}>{op.label}</option>
                ))}
              </select>
              
              <input
                type="text"
                value={condition.value}
                onChange={(e) => updateCondition(index, 'value', e.target.value)}
                placeholder="Value"
                className="flex-1 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              />
              
              <button
                onClick={() => removeCondition(index)}
                className="p-2 text-red-600 hover:bg-red-50 rounded"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            </div>
          ))}
          
          {conditions.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <BoltIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No conditions defined. Click "Add Condition" to start.</p>
            </div>
          )}
        </div>
      </div>

      {/* Preview */}
      {conditions.length > 0 && (
        <div className="bg-white/80 rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <EyeIcon className="w-5 h-5 text-purple-600" />
            Rule Preview
          </h3>
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
            {generateRuleContent()}
          </div>
        </div>
      )}
    </div>
  );

  // Templates Tab
  const TemplatesTab = () => (
    <div className="space-y-6">
      <div className="bg-white/80 rounded-xl p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose a Template</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ruleTemplates.map(template => (
            <div
              key={template.id}
              className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                selectedTemplate?.id === template.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => loadTemplate(template)}
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-semibold text-gray-900">{template.name}</h4>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  template.severity === 'critical' ? 'bg-red-100 text-red-800' :
                  template.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                  template.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {template.severity.toUpperCase()}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-3">{template.description}</p>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{template.category}</span>
                <span>{template.mitre}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Advanced Tab
  const AdvancedTab = () => (
    <div className="space-y-6">
      <div className="bg-white/80 rounded-xl p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <CodeBracketIcon className="w-5 h-5 text-green-600" />
          Advanced Rule Editor
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Rule Content</label>
            <textarea
              value={ruleData.rule_content}
              onChange={(e) => setRuleData({...ruleData, rule_content: e.target.value})}
              placeholder="Enter custom rule logic (KQL, YARA, or custom syntax)"
              rows={10}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
            />
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <DocumentIcon className="w-4 h-4" />
            <span>Supports KQL, YARA rules, and custom detection logic</span>
          </div>
        </div>
      </div>
    </div>
  );

  // Nếu có rule (edit), set dữ liệu vào form khi mount
  useEffect(() => {
    if (mode === 'edit' && rule) {
      setRuleData({
        rule_name: rule.rule_name || rule.RuleName || '',
        rule_type: rule.rule_type || rule.RuleType || 'behavioral',
        alert_title: rule.alert_title || rule.AlertTitle || '',
        alert_severity: rule.alert_severity || rule.AlertSeverity || 'medium',
        platform: rule.platform || rule.Platform || 'all',
        mitre_tactic: rule.mitre_tactic || rule.MitreTactic || '',
        mitre_technique: rule.mitre_technique || rule.MitreTechnique || '',
        description: rule.description || rule.Description || '',
        rule_content: rule.rule_content || rule.RuleContent || '',
        is_active: rule.is_active ?? rule.IsActive ?? true
      });
      // Nếu có conditions, set luôn
      if (rule.conditions) setConditions(rule.conditions);
    }
  }, [mode, rule]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-white dark:bg-gradient-to-br dark:from-slate-900 dark:via-indigo-950 dark:to-purple-950 border border-white/10 rounded-3xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-y-auto relative">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-white/10 bg-gradient-to-r from-purple-700/80 to-indigo-800/80 rounded-t-3xl">
          <div className="flex items-center gap-3">
            <PlusIcon className="w-8 h-8 text-white" />
            <h2 className="text-2xl font-bold text-white tracking-tight drop-shadow">{mode === 'edit' ? 'Edit Detection Rule' : 'Create Detection Rule'}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-purple-900/40 transition-colors group"
            aria-label="Close"
          >
            <XMarkIcon className="w-7 h-7 text-gray-200 group-hover:text-red-400 transition-colors" />
          </button>
        </div>
        {/* Form */}
        <form className="px-8 py-8 bg-white/80 dark:bg-transparent rounded-b-3xl" onSubmit={e => { e.preventDefault(); onSave(ruleData); }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left column */}
            <div className="space-y-6">
              <div>
                <label className="block text-base font-bold text-gray-700 dark:text-gray-200 mb-2">Rule Name <span className="text-red-400">*</span></label>
                <input type="text" required value={ruleData.rule_name} onChange={e => setRuleData(f => ({...f, rule_name: e.target.value}))} className="w-full px-5 py-4 rounded-xl bg-white/60 dark:bg-white/10 border-2 border-purple-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-400 text-gray-900 dark:text-white placeholder:text-gray-400 text-lg shadow transition-all duration-200" placeholder="Enter rule name" />
              </div>
              <div>
                <label className="block text-base font-bold text-gray-700 dark:text-gray-200 mb-2">Rule Type</label>
                <input type="text" value={ruleData.rule_type} disabled className="w-full px-5 py-4 rounded-xl bg-gray-100 dark:bg-white/10 border-2 border-gray-300 dark:border-white/20 text-gray-400 dark:text-gray-400 text-lg shadow" />
              </div>
              <div>
                <label className="block text-base font-bold text-gray-700 dark:text-gray-200 mb-2">Platform</label>
                <input type="text" value={ruleData.platform} disabled className="w-full px-5 py-4 rounded-xl bg-gray-100 dark:bg-white/10 border-2 border-gray-300 dark:border-white/20 text-gray-400 dark:text-gray-400 text-lg shadow" />
              </div>
              <div>
                <label className="block text-base font-bold text-gray-700 dark:text-gray-200 mb-2">Description</label>
                <textarea value={ruleData.description} onChange={e => setRuleData(f => ({...f, description: e.target.value}))} className="w-full px-5 py-4 rounded-xl bg-white/60 dark:bg-white/10 border-2 border-purple-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-400 text-gray-900 dark:text-white placeholder:text-gray-400 text-lg shadow transition-all duration-200" placeholder="Describe what this rule detects" rows={3} />
              </div>
            </div>
            {/* Right column */}
            <div className="space-y-6">
              <div>
                <label className="block text-base font-bold text-gray-700 dark:text-gray-200 mb-2">Alert Title <span className="text-red-400">*</span></label>
                <input type="text" required value={ruleData.alert_title} onChange={e => setRuleData(f => ({...f, alert_title: e.target.value}))} className="w-full px-5 py-4 rounded-xl bg-white/60 dark:bg-white/10 border-2 border-purple-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-400 text-gray-900 dark:text-white placeholder:text-gray-400 text-lg shadow transition-all duration-200" placeholder="Alert title when rule triggers" />
              </div>
              <div>
                <label className="block text-base font-bold text-gray-700 dark:text-gray-200 mb-2">Severity</label>
                <input type="text" value={ruleData.alert_severity} disabled className="w-full px-5 py-4 rounded-xl bg-gray-100 dark:bg-white/10 border-2 border-gray-300 dark:border-white/20 text-gray-400 dark:text-gray-400 text-lg shadow" />
              </div>
              <div>
                <label className="block text-base font-bold text-gray-700 dark:text-gray-200 mb-2">MITRE Technique <span className="text-red-400">*</span></label>
                <input type="text" required value={ruleData.mitre_technique} onChange={e => setRuleData(f => ({...f, mitre_technique: e.target.value}))} className="w-full px-5 py-4 rounded-xl bg-white/60 dark:bg-white/10 border-2 border-purple-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-400 text-gray-900 dark:text-white placeholder:text-gray-400 text-lg shadow transition-all duration-200" placeholder="Chọn MITRE Technique" />
              </div>
            </div>
          </div>
          {/* Footer */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-8 border-t border-white/10 pt-6">
            <div className="flex items-center gap-3">
              <input type="checkbox" checked={ruleData.is_active} onChange={e => setRuleData(f => ({...f, is_active: e.target.checked}))} className="w-5 h-5 rounded border-purple-400 focus:ring-purple-500" />
              <span className="text-base text-gray-700 dark:text-gray-200 font-medium">Enable rule immediately</span>
            </div>
            <div className="flex gap-3 mt-4 md:mt-0">
              <button type="button" onClick={onClose} className="px-6 py-3 rounded-xl bg-gray-200 dark:bg-white/10 text-gray-700 dark:text-white font-semibold hover:bg-gray-300 dark:hover:bg-white/20 transition-all shadow">Cancel</button>
              <button type="button" className="px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all shadow">Test Rule</button>
              <button type="submit" className="px-6 py-3 rounded-xl bg-purple-600 text-white font-bold hover:bg-purple-700 transition-all shadow">{mode === 'edit' ? 'Save Changes' : 'Create Rule'}</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RuleCreator;