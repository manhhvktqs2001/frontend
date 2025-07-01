import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from 'react-query';
import { 
  ArrowLeftIcon, 
  PlusIcon, 
  TrashIcon,
  InformationCircleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { createDetectionRule, fetchRuleTypes } from '../services/api';
import toast from 'react-hot-toast';

const CreateRule = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    rule_name: '',
    rule_type: 'Behavioral',
    rule_category: 'Process',
    platform: 'All',
    priority: 50,
    is_active: true,
    test_mode: false,
    alert_title: '',
    alert_description: '',
    alert_severity: 'Medium',
    alert_type: 'Execution',
    mitre_tactic: '',
    mitre_technique: '',
    rule_condition: {
      logic: 'AND',
      conditions: [
        {
          field: 'process_name',
          operator: 'equals',
          value: ''
        }
      ]
    }
  });

  const [conditions, setConditions] = useState([
    { field: 'process_name', operator: 'equals', value: '', id: Date.now() }
  ]);

  const { data: ruleTypes } = useQuery('ruleTypes', fetchRuleTypes);

  const createRuleMutation = useMutation(createDetectionRule, {
    onSuccess: () => {
      toast.success('Detection rule created successfully!');
      navigate('/rules');
    },
    onError: (error) => {
      toast.error(error.response?.data?.detail || 'Failed to create rule');
    }
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleConditionChange = (id, field, value) => {
    setConditions(prev => 
      prev.map(condition => 
        condition.id === id ? { ...condition, [field]: value } : condition
      )
    );
  };

  const addCondition = () => {
    setConditions(prev => [
      ...prev,
      { field: 'process_name', operator: 'equals', value: '', id: Date.now() }
    ]);
  };

  const removeCondition = (id) => {
    if (conditions.length > 1) {
      setConditions(prev => prev.filter(condition => condition.id !== id));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Build rule condition
    const ruleCondition = {
      logic: formData.rule_condition.logic,
      conditions: conditions.map(({ id, ...condition }) => condition)
    };

    const submitData = {
      ...formData,
      rule_condition: ruleCondition
    };

    createRuleMutation.mutate(submitData);
  };

  const fieldOptions = [
    { value: 'process_name', label: 'Process Name' },
    { value: 'process_path', label: 'Process Path' },
    { value: 'command_line', label: 'Command Line' },
    { value: 'file_name', label: 'File Name' },
    { value: 'file_path', label: 'File Path' },
    { value: 'file_hash', label: 'File Hash' },
    { value: 'source_ip', label: 'Source IP' },
    { value: 'destination_ip', label: 'Destination IP' },
    { value: 'registry_key', label: 'Registry Key' },
    { value: 'login_user', label: 'Login User' }
  ];

  const operatorOptions = [
    { value: 'equals', label: 'Equals' },
    { value: 'iequals', label: 'Equals (Case Insensitive)' },
    { value: 'contains', label: 'Contains' },
    { value: 'icontains', label: 'Contains (Case Insensitive)' },
    { value: 'not_equals', label: 'Not Equals' },
    { value: 'starts_with', label: 'Starts With' },
    { value: 'ends_with', label: 'Ends With' },
    { value: 'regex', label: 'Regular Expression' }
  ];

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/rules')}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <ArrowLeftIcon className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 gradient-text">Create Detection Rule</h1>
            <p className="text-gray-600 mt-2">Define a new detection rule for your EDR system</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white/80 backdrop-blur-lg rounded-xl p-6 shadow-lg border border-gray-200/50">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <InformationCircleIcon className="w-5 h-5 mr-2 text-blue-500" />
            Basic Information
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rule Name *
              </label>
              <input
                type="text"
                required
                value={formData.rule_name}
                onChange={(e) => handleInputChange('rule_name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent form-input"
                placeholder="e.g., Suspicious Process Execution"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rule Type
              </label>
              <select
                value={formData.rule_type}
                onChange={(e) => handleInputChange('rule_type', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Behavioral">Behavioral</option>
                <option value="Signature">Signature</option>
                <option value="Threshold">Threshold</option>
                <option value="Correlation">Correlation</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={formData.rule_category}
                onChange={(e) => handleInputChange('rule_category', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Process">Process</option>
                <option value="File">File</option>
                <option value="Network">Network</option>
                <option value="Registry">Registry</option>
                <option value="Authentication">Authentication</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Platform
              </label>
              <select
                value={formData.platform}
                onChange={(e) => handleInputChange('platform', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="All">All Platforms</option>
                <option value="Windows">Windows</option>
                <option value="Linux">Linux</option>
                <option value="macOS">macOS</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority (0-100)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.priority}
                onChange={(e) => handleInputChange('priority', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent form-input"
              />
            </div>

            <div className="flex items-center space-x-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => handleInputChange('is_active', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Active</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.test_mode}
                  onChange={(e) => handleInputChange('test_mode', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Test Mode</span>
              </label>
            </div>
          </div>
        </div>

        {/* Alert Configuration */}
        <div className="bg-white/80 backdrop-blur-lg rounded-xl p-6 shadow-lg border border-gray-200/50">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <ExclamationTriangleIcon className="w-5 h-5 mr-2 text-orange-500" />
            Alert Configuration
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Alert Title *
              </label>
              <input
                type="text"
                required
                value={formData.alert_title}
                onChange={(e) => handleInputChange('alert_title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent form-input"
                placeholder="e.g., Suspicious Process Detected"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Alert Description
              </label>
              <textarea
                rows={3}
                value={formData.alert_description}
                onChange={(e) => handleInputChange('alert_description', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent form-input"
                placeholder="Describe what this alert indicates..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Severity
              </label>
              <select
                value={formData.alert_severity}
                onChange={(e) => handleInputChange('alert_severity', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Alert Type
              </label>
              <select
                value={formData.alert_type}
                onChange={(e) => handleInputChange('alert_type', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Execution">Execution</option>
                <option value="File Activity">File Activity</option>
                <option value="Network Activity">Network Activity</option>
                <option value="Registry Activity">Registry Activity</option>
                <option value="Authentication">Authentication</option>
                <option value="System Activity">System Activity</option>
              </select>
            </div>
          </div>
        </div>

        {/* MITRE ATT&CK Mapping */}
        <div className="bg-white/80 backdrop-blur-lg rounded-xl p-6 shadow-lg border border-gray-200/50">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <CheckCircleIcon className="w-5 h-5 mr-2 text-green-500" />
            MITRE ATT&CK Mapping
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                MITRE Tactic
              </label>
              <select
                value={formData.mitre_tactic}
                onChange={(e) => handleInputChange('mitre_tactic', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Tactic</option>
                <option value="Initial Access">Initial Access</option>
                <option value="Execution">Execution</option>
                <option value="Persistence">Persistence</option>
                <option value="Privilege Escalation">Privilege Escalation</option>
                <option value="Defense Evasion">Defense Evasion</option>
                <option value="Credential Access">Credential Access</option>
                <option value="Discovery">Discovery</option>
                <option value="Lateral Movement">Lateral Movement</option>
                <option value="Collection">Collection</option>
                <option value="Command and Control">Command and Control</option>
                <option value="Exfiltration">Exfiltration</option>
                <option value="Impact">Impact</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                MITRE Technique
              </label>
              <input
                type="text"
                value={formData.mitre_technique}
                onChange={(e) => handleInputChange('mitre_technique', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent form-input"
                placeholder="e.g., T1059.001"
              />
            </div>
          </div>
        </div>

        {/* Rule Conditions */}
        <div className="bg-white/80 backdrop-blur-lg rounded-xl p-6 shadow-lg border border-gray-200/50">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <CheckCircleIcon className="w-5 h-5 mr-2 text-purple-500" />
              Detection Conditions
            </h2>
            <button
              type="button"
              onClick={addCondition}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              <PlusIcon className="w-4 h-4 mr-2" />
              Add Condition
            </button>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Logic Operator
            </label>
            <select
              value={formData.rule_condition.logic}
              onChange={(e) => handleInputChange('rule_condition', { ...formData.rule_condition, logic: e.target.value })}
              className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="AND">AND</option>
              <option value="OR">OR</option>