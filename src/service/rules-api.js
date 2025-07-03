// rules-api.js - API Helper functions for Rules Management

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://192.168.20.85:5000/api/v1';

// Create axios instance for rules API
const rulesAPI = axios.create({
  baseURL: `${API_BASE_URL}/detection`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
rulesAPI.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
rulesAPI.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

/**
 * Fetch all detection rules with optional filtering
 * @param {Object} params - Query parameters for filtering
 * @returns {Promise} Rules data
 */
export const fetchDetectionRules = async (params = {}) => {
  try {
    // Loại bỏ limit nếu có, chỉ truyền all=true
    const { limit, ...rest } = params;
    const response = await rulesAPI.get('/rules', { params: { ...rest, all: true } });
    return response.data;
  } catch (error) {
    console.error('Error fetching detection rules:', error);
    throw error;
  }
};

/**
 * Create a new detection rule
 * @param {Object} ruleData - Rule data to create
 * @returns {Promise} Created rule data
 */
export const createDetectionRule = async (ruleData) => {
  try {
    // Transform frontend data to backend format (đúng key backend yêu cầu)
    const backendRuleData = {
      rule_name: ruleData.rule_name || ruleData.RuleName,
      rule_type: ruleData.rule_type || ruleData.RuleType,
      rule_condition: ruleData.rule_condition || ruleData.RuleCondition,
      alert_title: ruleData.alert_title || ruleData.AlertTitle,
      alert_severity: ruleData.alert_severity || ruleData.AlertSeverity,
      alert_type: ruleData.alert_type || ruleData.AlertType,
      platform: ruleData.platform || ruleData.Platform || 'All',
      mitre_tactic: ruleData.mitre_tactic || ruleData.MitreTactic || null,
      mitre_technique: ruleData.mitre_technique || ruleData.MitreTechnique || null,
      rule_category: ruleData.rule_category || ruleData.RuleCategory || null,
      alert_description: ruleData.alert_description || ruleData.AlertDescription || null,
      priority: ruleData.priority || ruleData.Priority || 50,
      is_active: typeof ruleData.is_active === 'boolean' ? ruleData.is_active : (typeof ruleData.IsActive === 'boolean' ? ruleData.IsActive : true),
      test_mode: typeof ruleData.test_mode === 'boolean' ? ruleData.test_mode : (typeof ruleData.TestMode === 'boolean' ? ruleData.TestMode : false),
    };

    const response = await rulesAPI.post('/rules', backendRuleData);
    return response.data;
  } catch (error) {
    console.error('Error creating detection rule:', error);
    throw error;
  }
};

/**
 * Update an existing detection rule
 * @param {string|number} ruleId - Rule ID to update
 * @param {Object} ruleData - Updated rule data
 * @returns {Promise} Updated rule data
 */
export const updateDetectionRule = async (ruleId, ruleData) => {
  try {
    const backendRuleData = {
      rule_name: ruleData.rule_name,
      rule_type: ruleData.rule_type,
      alert_title: ruleData.alert_title,
      alert_severity: ruleData.alert_severity,
      platform: ruleData.platform,
      mitre_tactic: ruleData.mitre_tactic || null,
      mitre_technique: ruleData.mitre_technique || null,
      description: ruleData.description,
      rule_content: ruleData.rule_content,
      is_active: ruleData.is_active,
      updated_at: new Date().toISOString()
    };

    const response = await rulesAPI.put(`/rules/${ruleId}`, backendRuleData);
    return response.data;
  } catch (error) {
    console.error('Error updating detection rule:', error);
    throw error;
  }
};

/**
 * Delete a detection rule
 * @param {string|number} ruleId - Rule ID to delete
 * @returns {Promise} Deletion result
 */
export const deleteDetectionRule = async (ruleId) => {
  try {
    const response = await rulesAPI.delete(`/rules/${ruleId}`, { params: { force: true } });
    return response.data;
  } catch (error) {
    console.error('Error deleting detection rule:', error);
    throw error;
  }
};

/**
 * Enable a detection rule
 * @param {string|number} ruleId - Rule ID to enable
 * @returns {Promise} Updated rule data
 */
export const enableDetectionRule = async (ruleId) => {
  try {
    const response = await rulesAPI.post(`/rules/${ruleId}/enable`);
    return response.data;
  } catch (error) {
    console.error('Error enabling detection rule:', error);
    throw error;
  }
};

/**
 * Disable a detection rule
 * @param {string|number} ruleId - Rule ID to disable
 * @returns {Promise} Updated rule data
 */
export const disableDetectionRule = async (ruleId) => {
  try {
    const response = await rulesAPI.post(`/rules/${ruleId}/disable`);
    return response.data;
  } catch (error) {
    console.error('Error disabling detection rule:', error);
    throw error;
  }
};

/**
 * Test a detection rule before saving
 * @param {Object} ruleData - Rule data to test
 * @returns {Promise} Test results
 */
export const testDetectionRule = async (ruleData) => {
  try {
    const response = await rulesAPI.post('/rules/test', {
      rule_content: ruleData.rule_content,
      rule_type: ruleData.rule_type,
      platform: ruleData.platform
    });
    return response.data;
  } catch (error) {
    console.error('Error testing detection rule:', error);
    throw error;
  }
};

/**
 * Get rule statistics and metrics
 * @returns {Promise} Rule statistics
 */
export const fetchRuleStatistics = async () => {
  try {
    const response = await rulesAPI.get('/rules/stats');
    return response.data;
  } catch (error) {
    console.error('Error fetching rule statistics:', error);
    throw error;
  }
};

/**
 * Get rule performance metrics
 * @param {string|number} ruleId - Rule ID
 * @returns {Promise} Rule performance data
 */
export const fetchRulePerformance = async (ruleId) => {
  try {
    const response = await rulesAPI.get(`/rules/${ruleId}/performance`);
    return response.data;
  } catch (error) {
    console.error('Error fetching rule performance:', error);
    throw error;
  }
};

/**
 * Duplicate an existing rule
 * @param {string|number} ruleId - Rule ID to duplicate
 * @param {Object} overrides - Fields to override in the duplicate
 * @returns {Promise} Duplicated rule data
 */
export const duplicateDetectionRule = async (ruleId, overrides = {}) => {
  try {
    const response = await rulesAPI.post(`/rules/${ruleId}/duplicate`, overrides);
    return response.data;
  } catch (error) {
    console.error('Error duplicating detection rule:', error);
    throw error;
  }
};

/**
 * Get rule templates
 * @returns {Promise} Available rule templates
 */
export const fetchRuleTemplates = async () => {
  try {
    const response = await rulesAPI.get('/templates');
    return response.data;
  } catch (error) {
    console.error('Error fetching rule templates:', error);
    // Return fallback templates if API fails
    return {
      templates: [
        {
          id: 'suspicious_powershell',
          name: 'Suspicious PowerShell Activity',
          category: 'Process Monitoring',
          description: 'Detect potentially malicious PowerShell commands',
          severity: 'high',
          mitre: 'T1059.001',
          platform: 'windows',
          rule_type: 'behavioral',
          conditions: [
            { field: 'process_name', operator: 'equals', value: 'powershell.exe' },
            { field: 'command_line', operator: 'contains', value: '-enc' }
          ]
        },
        {
          id: 'file_modification',
          name: 'System File Modification',
          category: 'File Monitoring',
          description: 'Monitor critical system file modifications',
          severity: 'medium',
          mitre: 'T1565.001',
          platform: 'all',
          rule_type: 'behavioral',
          conditions: [
            { field: 'event_type', operator: 'equals', value: 'file' },
            { field: 'file_path', operator: 'contains', value: 'System32' },
            { field: 'file_action', operator: 'equals', value: 'modify' }
          ]
        },
        {
          id: 'network_connection',
          name: 'Suspicious Network Connection',
          category: 'Network Monitoring',
          description: 'Detect connections to suspicious IPs',
          severity: 'high',
          mitre: 'T1071.001',
          platform: 'all',
          rule_type: 'behavioral',
          conditions: [
            { field: 'event_type', operator: 'equals', value: 'network' },
            { field: 'dest_port', operator: 'equals', value: '4444' }
          ]
        },
        {
          id: 'registry_persistence',
          name: 'Registry Persistence',
          category: 'Registry Monitoring',
          description: 'Detect registry modifications for persistence',
          severity: 'medium',
          mitre: 'T1547.001',
          platform: 'windows',
          rule_type: 'behavioral',
          conditions: [
            { field: 'event_type', operator: 'equals', value: 'registry' },
            { field: 'registry_key', operator: 'contains', value: 'Run' }
          ]
        },
        {
          id: 'credential_access',
          name: 'Credential Dumping',
          category: 'Credential Access',
          description: 'Detect credential dumping activities',
          severity: 'critical',
          mitre: 'T1003.001',
          platform: 'windows',
          rule_type: 'behavioral',
          conditions: [
            { field: 'process_name', operator: 'contains', value: 'mimikatz' }
          ]
        }
      ]
    };
  }
};

/**
 * Export rules to various formats
 * @param {Array} ruleIds - Array of rule IDs to export
 * @param {string} format - Export format (json, csv, yaml)
 * @returns {Promise} Export data
 */
export const exportDetectionRules = async (ruleIds, format = 'json') => {
  try {
    const response = await rulesAPI.post('/rules/export', {
      rule_ids: ruleIds,
      format: format
    });
    return response.data;
  } catch (error) {
    console.error('Error exporting detection rules:', error);
    throw error;
  }
};

/**
 * Import rules from file
 * @param {File} file - File containing rules to import
 * @param {string} format - File format (json, csv, yaml)
 * @returns {Promise} Import result
 */
export const importDetectionRules = async (file, format = 'json') => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('format', format);

    const response = await rulesAPI.post('/rules/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error importing detection rules:', error);
    throw error;
  }
};

/**
 * Validate rule syntax
 * @param {Object} ruleData - Rule data to validate
 * @returns {Promise} Validation result
 */
export const validateRuleSyntax = async (ruleData) => {
  try {
    const response = await rulesAPI.post('/rules/validate', {
      rule_content: ruleData.rule_content,
      rule_type: ruleData.rule_type,
      platform: ruleData.platform
    });
    return response.data;
  } catch (error) {
    console.error('Error validating rule syntax:', error);
    throw error;
  }
};

/**
 * Get rule execution history
 * @param {string|number} ruleId - Rule ID
 * @param {Object} params - Query parameters (limit, offset, date_range)
 * @returns {Promise} Rule execution history
 */
export const fetchRuleExecutionHistory = async (ruleId, params = {}) => {
  try {
    const response = await rulesAPI.get(`/rules/${ruleId}/history`, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching rule execution history:', error);
    throw error;
  }
};

/**
 * Bulk operations on multiple rules
 * @param {Array} ruleIds - Array of rule IDs
 * @param {string} operation - Operation to perform (enable, disable, delete)
 * @returns {Promise} Bulk operation result
 */
export const bulkRuleOperations = async (ruleIds, operation) => {
  try {
    const response = await rulesAPI.post('/rules/bulk', {
      rule_ids: ruleIds,
      operation: operation
    });
    return response.data;
  } catch (error) {
    console.error('Error performing bulk rule operations:', error);
    throw error;
  }
};

/**
 * Search rules with advanced filters
 * @param {Object} searchParams - Advanced search parameters
 * @returns {Promise} Search results
 */
export const searchDetectionRules = async (searchParams) => {
  try {
    const response = await rulesAPI.post('/rules/search', searchParams);
    return response.data;
  } catch (error) {
    console.error('Error searching detection rules:', error);
    throw error;
  }
};

/**
 * Get MITRE ATT&CK techniques for rule mapping
 * @returns {Promise} MITRE techniques data
 */
export const fetchMitreTechniques = async () => {
  try {
    const response = await rulesAPI.get('/mitre/techniques');
    return response.data;
  } catch (error) {
    console.error('Error fetching MITRE techniques:', error);
    // Return fallback data if API fails
    return {
      techniques: [
        { id: 'T1059.001', name: 'PowerShell', tactic: 'Execution' },
        { id: 'T1003.001', name: 'LSASS Memory', tactic: 'Credential Access' },
        { id: 'T1565.001', name: 'Stored Data Manipulation', tactic: 'Impact' },
        { id: 'T1071.001', name: 'Web Protocols', tactic: 'Command and Control' },
        { id: 'T1547.001', name: 'Registry Run Keys / Startup Folder', tactic: 'Persistence' },
        { id: 'T1562.001', name: 'Disable or Modify Tools', tactic: 'Defense Evasion' },
        { id: 'T1021', name: 'Remote Services', tactic: 'Lateral Movement' },
        { id: 'T1041', name: 'Exfiltration Over C2 Channel', tactic: 'Exfiltration' },
        { id: 'T1486', name: 'Data Encrypted for Impact', tactic: 'Impact' }
      ]
    };
  }
};

/**
 * Generate rule from event data
 * @param {Object} eventData - Event data to base rule on
 * @returns {Promise} Generated rule suggestion
 */
export const generateRuleFromEvent = async (eventData) => {
  try {
    const response = await rulesAPI.post('/rules/generate', eventData);
    return response.data;
  } catch (error) {
    console.error('Error generating rule from event:', error);
    throw error;
  }
};

/**
 * Rule Helper Functions for Frontend
 */

/**
 * Convert conditions array to rule content string
 * @param {Array} conditions - Array of condition objects
 * @param {string} ruleType - Type of rule (behavioral, signature, etc.)
 * @returns {string} Rule content string
 */
export const conditionsToRuleContent = (conditions, ruleType = 'behavioral') => {
  if (ruleType === 'behavioral') {
    const conditionStrings = conditions.map((condition, index) => {
      const logic = index > 0 ? ` ${condition.logic} ` : '';
      const operator = getOperatorSymbol(condition.operator);
      return `${logic}${condition.field} ${operator} "${condition.value}"`;
    });
    return conditionStrings.join('');
  }
  return '';
};

/**
 * Get operator symbol for rule generation
 * @param {string} operator - Operator name
 * @returns {string} Operator symbol
 */
const getOperatorSymbol = (operator) => {
  const operatorMap = {
    'equals': '==',
    'not_equals': '!=',
    'contains': 'contains',
    'starts_with': 'startswith',
    'ends_with': 'endswith',
    'regex': 'matches',
    'greater_than': '>',
    'less_than': '<',
    'greater_equal': '>=',
    'less_equal': '<='
  };
  return operatorMap[operator] || '==';
};

/**
 * Parse rule content to conditions array
 * @param {string} ruleContent - Rule content string
 * @param {string} ruleType - Type of rule
 * @returns {Array} Array of condition objects
 */
export const ruleContentToConditions = (ruleContent, ruleType = 'behavioral') => {
  if (ruleType !== 'behavioral' || !ruleContent) {
    return [];
  }

  // Simple parser for behavioral rules
  // This is a basic implementation - you might need a more sophisticated parser
  const conditions = [];
  const parts = ruleContent.split(/\s+(AND|OR)\s+/);
  
  for (let i = 0; i < parts.length; i += 2) {
    const conditionPart = parts[i].trim();
    const logic = i > 0 ? parts[i - 1] : 'AND';
    
    // Parse field operator "value"
    const match = conditionPart.match(/(\w+)\s+(==|!=|contains|startswith|endswith|matches|>|<|>=|<=)\s+"([^"]+)"/);
    
    if (match) {
      const [, field, operator, value] = match;
      conditions.push({
        field,
        operator: getOperatorName(operator),
        value,
        logic: i > 0 ? logic : 'AND'
      });
    }
  }
  
  return conditions;
};

/**
 * Get operator name from symbol
 * @param {string} symbol - Operator symbol
 * @returns {string} Operator name
 */
const getOperatorName = (symbol) => {
  const symbolMap = {
    '==': 'equals',
    '!=': 'not_equals',
    'contains': 'contains',
    'startswith': 'starts_with',
    'endswith': 'ends_with',
    'matches': 'regex',
    '>': 'greater_than',
    '<': 'less_than',
    '>=': 'greater_equal',
    '<=': 'less_equal'
  };
  return symbolMap[symbol] || 'equals';
};

/**
 * Validate rule data before submission
 * @param {Object} ruleData - Rule data to validate
 * @returns {Object} Validation result with errors array
 */
export const validateRuleData = (ruleData) => {
  const errors = [];
  
  // Required fields validation
  if (!ruleData.rule_name || ruleData.rule_name.trim() === '') {
    errors.push('Rule name is required');
  }
  
  if (!ruleData.alert_title || ruleData.alert_title.trim() === '') {
    errors.push('Alert title is required');
  }
  
  if (!ruleData.rule_type) {
    errors.push('Rule type is required');
  }
  
  if (!ruleData.alert_severity) {
    errors.push('Alert severity is required');
  }
  
  if (!ruleData.platform) {
    errors.push('Platform is required');
  }
  
  // Rule content validation
  if (!ruleData.rule_content || ruleData.rule_content.trim() === '') {
    errors.push('Rule content cannot be empty');
  }
  
  // MITRE technique format validation
  if (ruleData.mitre_technique && !/^T\d{4}(\.\d{3})?$/.test(ruleData.mitre_technique)) {
    errors.push('MITRE technique must be in format T1234 or T1234.001');
  }
  
  // Rule name length validation
  if (ruleData.rule_name && ruleData.rule_name.length > 255) {
    errors.push('Rule name must be less than 255 characters');
  }
  
  // Description length validation
  if (ruleData.description && ruleData.description.length > 1000) {
    errors.push('Description must be less than 1000 characters');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Format rule data for display
 * @param {Object} rule - Raw rule data from API
 * @returns {Object} Formatted rule data
 */
export const formatRuleForDisplay = (rule) => {
  return {
    ...rule,
    created_at: rule.created_at ? new Date(rule.created_at).toLocaleString() : 'Unknown',
    updated_at: rule.updated_at ? new Date(rule.updated_at).toLocaleString() : 'Never',
    last_triggered: rule.last_triggered ? new Date(rule.last_triggered).toLocaleString() : 'Never',
    trigger_count: rule.trigger_count || 0,
    platform_display: getPlatformDisplay(rule.platform),
    severity_display: getSeverityDisplay(rule.alert_severity),
    type_display: getTypeDisplay(rule.rule_type)
  };
};

/**
 * Get platform display name
 * @param {string} platform - Platform code
 * @returns {string} Display name
 */
const getPlatformDisplay = (platform) => {
  const platformMap = {
    'all': 'All Platforms',
    'windows': 'Windows',
    'linux': 'Linux',
    'macos': 'macOS',
    'android': 'Android',
    'ios': 'iOS'
  };
  return platformMap[platform] || platform;
};

/**
 * Get severity display info
 * @param {string} severity - Severity level
 * @returns {Object} Display info with color classes
 */
const getSeverityDisplay = (severity) => {
  const severityMap = {
    'critical': { label: 'Critical', color: 'text-red-600', bg: 'bg-red-100' },
    'high': { label: 'High', color: 'text-orange-600', bg: 'bg-orange-100' },
    'medium': { label: 'Medium', color: 'text-yellow-600', bg: 'bg-yellow-100' },
    'low': { label: 'Low', color: 'text-green-600', bg: 'bg-green-100' }
  };
  return severityMap[severity] || { label: severity, color: 'text-gray-600', bg: 'bg-gray-100' };
};

/**
 * Get rule type display info
 * @param {string} type - Rule type
 * @returns {Object} Display info
 */
const getTypeDisplay = (type) => {
  const typeMap = {
    'behavioral': { label: 'Behavioral', icon: 'BoltIcon' },
    'signature': { label: 'Signature', icon: 'DocumentTextIcon' },
    'threshold': { label: 'Threshold', icon: 'ChartBarIcon' },
    'correlation': { label: 'Correlation', icon: 'ShieldCheckIcon' }
  };
  return typeMap[type] || { label: type, icon: 'QuestionMarkCircleIcon' };
};

/**
 * Generate CSV content for rule export
 * @param {Array} rules - Array of rules to export
 * @returns {string} CSV content
 */
export const generateRuleCSV = (rules) => {
  const headers = [
    'Rule Name',
    'Rule Type',
    'Alert Title',
    'Severity',
    'Platform',
    'MITRE Technique',
    'Description',
    'Status',
    'Created',
    'Triggers'
  ];
  
  const rows = rules.map(rule => [
    rule.rule_name,
    rule.rule_type,
    rule.alert_title,
    rule.alert_severity,
    rule.platform,
    rule.mitre_technique || '',
    rule.description || '',
    rule.is_active ? 'Active' : 'Inactive',
    rule.created_at,
    rule.trigger_count || 0
  ]);
  
  const csvContent = [headers, ...rows]
    .map(row => row.map(field => `"${field}"`).join(','))
    .join('\n');
    
  return csvContent;
};

/**
 * Download file helper
 * @param {string} content - File content
 * @param {string} filename - File name
 * @param {string} contentType - MIME type
 */
export const downloadFile = (content, filename, contentType = 'text/plain') => {
  const blob = new Blob([content], { type: contentType });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

// Export all functions as default object
export default {
  fetchDetectionRules,
  createDetectionRule,
  updateDetectionRule,
  deleteDetectionRule,
  enableDetectionRule,
  disableDetectionRule,
  testDetectionRule,
  fetchRuleStatistics,
  fetchRulePerformance,
  duplicateDetectionRule,
  fetchRuleTemplates,
  exportDetectionRules,
  importDetectionRules,
  validateRuleSyntax,
  fetchRuleExecutionHistory,
  bulkRuleOperations,
  searchDetectionRules,
  fetchMitreTechniques,
  generateRuleFromEvent,
  conditionsToRuleContent,
  ruleContentToConditions,
  validateRuleData,
  formatRuleForDisplay,
  generateRuleCSV,
  downloadFile
};