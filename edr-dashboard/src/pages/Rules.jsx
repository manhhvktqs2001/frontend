import React, { useState, useEffect } from 'react';
import { 
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  PlayIcon,
  PauseIcon,
  DocumentDuplicateIcon,
  AdjustmentsHorizontalIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  Cog6ToothIcon,
  BellIcon,
  UserGroupIcon,
  ServerIcon,
  GlobeAltIcon,
  FireIcon,
  BoltIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

const RuleCard = ({ rule, onEdit, onDelete, onToggle, onDuplicate, onView }) => {
  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/50';
      case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/50';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'low': return 'bg-green-500/20 text-green-400 border-green-500/50';
      default: return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
    }
  };

  const getStatusColor = (status) => {
    return status ? 'text-green-400' : 'text-gray-400';
  };

  return (
    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-all duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold text-white">{rule.name}</h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getSeverityColor(rule.severity)}`}>
              {rule.severity}
            </span>
            <div className={`flex items-center gap-1 ${getStatusColor(rule.enabled)}`}>
              {rule.enabled ? (
                <CheckCircleIcon className="w-4 h-4" />
              ) : (
                <XCircleIcon className="w-4 h-4" />
              )}
              <span className="text-xs">{rule.enabled ? 'Active' : 'Disabled'}</span>
            </div>
          </div>
          <p className="text-gray-400 text-sm mb-3">{rule.description}</p>
          
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span>Type: {rule.type}</span>
            <span>Matches: {rule.matches || 0}</span>
            <span>Updated: {rule.lastUpdated}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => onView(rule)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-blue-400"
            title="View Details"
          >
            <EyeIcon className="w-4 h-4" />
          </button>
          <button
            onClick={() => onEdit(rule)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-yellow-400"
            title="Edit Rule"
          >
            <PencilIcon className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDuplicate(rule)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-green-400"
            title="Duplicate Rule"
          >
            <DocumentDuplicateIcon className="w-4 h-4" />
          </button>
          <button
            onClick={() => onToggle(rule)}
            className={`p-2 hover:bg-white/10 rounded-lg transition-colors ${
              rule.enabled ? 'text-green-400 hover:text-green-300' : 'text-gray-400 hover:text-green-400'
            }`}
            title={rule.enabled ? 'Disable Rule' : 'Enable Rule'}
          >
            {rule.enabled ? <PauseIcon className="w-4 h-4" /> : <PlayIcon className="w-4 h-4" />}
          </button>
          <button
            onClick={() => onDelete(rule)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-red-400"
            title="Delete Rule"
          >
            <TrashIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {rule.tags?.map((tag, index) => (
          <span
            key={index}
            className="px-2 py-1 bg-white/10 text-gray-300 rounded-lg text-xs"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};

const CreateRuleModal = ({ isOpen, onClose, onSave, initialRule = null }) => {
  const [rule, setRule] = useState({
    name: '',
    description: '',
    type: 'signature',
    severity: 'medium',
    enabled: true,
    conditions: '',
    actions: 'alert',
    tags: []
  });

  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    if (initialRule) {
      setRule(initialRule);
    } else {
      setRule({
        name: '',
        description: '',
        type: 'signature',
        severity: 'medium',
        enabled: true,
        conditions: '',
        actions: 'alert',
        tags: []
      });
    }
  }, [initialRule, isOpen]);

  const handleAddTag = () => {
    if (newTag.trim() && !rule.tags.includes(newTag.trim())) {
      setRule(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setRule(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSave = () => {
    if (rule.name && rule.description && rule.conditions) {
      onSave(rule);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-white/20 rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">
            {initialRule ? 'Edit Detection Rule' : 'Create New Detection Rule'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors text-2xl"
          >
            ×
          </button>
        </div>
        
        <div className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Rule Name *</label>
              <input
                type="text"
                value={rule.name}
                onChange={(e) => setRule(prev => ({ ...prev, name: e.target.value }))}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                placeholder="Enter rule name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Rule Type</label>
              <select
                value={rule.type}
                onChange={(e) => setRule(prev => ({ ...prev, type: e.target.value }))}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
              >
                <option value="signature">Signature-based</option>
                <option value="behavioral">Behavioral</option>
                <option value="anomaly">Anomaly Detection</option>
                <option value="threshold">Threshold-based</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Description *</label>
            <textarea
              value={rule.description}
              onChange={(e) => setRule(prev => ({ ...prev, description: e.target.value }))}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              placeholder="Describe what this rule detects"
              rows="3"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Severity Level</label>
              <select
                value={rule.severity}
                onChange={(e) => setRule(prev => ({ ...prev, severity: e.target.value }))}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Action</label>
              <select
                value={rule.actions}
                onChange={(e) => setRule(prev => ({ ...prev, actions: e.target.value }))}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
              >
                <option value="alert">Generate Alert</option>
                <option value="block">Block & Alert</option>
                <option value="quarantine">Quarantine & Alert</option>
                <option value="log">Log Only</option>
              </select>
            </div>
          </div>

          {/* Rule Conditions */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Rule Conditions *</label>
            <textarea
              value={rule.conditions}
              onChange={(e) => setRule(prev => ({ ...prev, conditions: e.target.value }))}
              className="w-full bg-black/50 border border-white/20 rounded-lg px-3 py-2 text-green-400 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 font-mono text-sm"
              placeholder={`Example:
process.name == "cmd.exe" AND 
network.destination.port IN [22, 23, 3389] AND
file.path CONTAINS "\\\\system32\\\\"`}
              rows="6"
            />
            <p className="text-xs text-gray-500 mt-1">
              Define conditions using field names, operators (==, !=, IN, CONTAINS), and logical operators (AND, OR, NOT)
            </p>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Tags</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                placeholder="Add tag"
              />
              <button
                onClick={handleAddTag}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {rule.tags.map((tag, index) => (
                <span
                  key={index}
                  className="flex items-center gap-1 px-2 py-1 bg-white/10 text-gray-300 rounded-lg text-sm"
                >
                  {tag}
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="text-gray-400 hover:text-red-400 ml-1"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Enable/Disable */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="enabled"
              checked={rule.enabled}
              onChange={(e) => setRule(prev => ({ ...prev, enabled: e.target.checked }))}
              className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
            />
            <label htmlFor="enabled" className="text-gray-300">
              Enable rule immediately after creation
            </label>
          </div>
        </div>

        <div className="flex gap-4 mt-8 pt-6 border-t border-white/20">
          <button
            onClick={handleSave}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl transition-colors font-medium"
          >
            {initialRule ? 'Update Rule' : 'Create Rule'}
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-xl transition-colors font-medium"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

const RuleDetailModal = ({ rule, onClose }) => {
  if (!rule) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-white/20 rounded-2xl p-6 max-w-3xl w-full max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Rule Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ×
          </button>
        </div>
        
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="text-gray-400 text-sm">Rule Name</label>
              <p className="text-white font-medium">{rule.name}</p>
            </div>
            <div>
              <label className="text-gray-400 text-sm">Type</label>
              <p className="text-white font-medium">{rule.type}</p>
            </div>
            <div>
              <label className="text-gray-400 text-sm">Severity</label>
              <p className="text-white font-medium">{rule.severity}</p>
            </div>
            <div>
              <label className="text-gray-400 text-sm">Status</label>
              <p className={`font-medium ${rule.enabled ? 'text-green-400' : 'text-red-400'}`}>
                {rule.enabled ? 'Active' : 'Disabled'}
              </p>
            </div>
          </div>

          <div>
            <label className="text-gray-400 text-sm">Description</label>
            <p className="text-white mt-1">{rule.description}</p>
          </div>

          <div>
            <label className="text-gray-400 text-sm">Rule Conditions</label>
            <div className="mt-2 bg-black/50 rounded-lg p-4 font-mono text-sm text-green-400">
              <pre className="whitespace-pre-wrap">{rule.conditions}</pre>
            </div>
          </div>

          <div>
            <label className="text-gray-400 text-sm">Tags</label>
            <div className="flex flex-wrap gap-2 mt-2">
              {rule.tags?.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-white/10 text-gray-300 rounded-lg text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/20">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">{rule.matches || 0}</div>
              <div className="text-xs text-gray-400">Total Matches</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">{rule.accuracy || '98.5'}%</div>
              <div className="text-xs text-gray-400">Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">{rule.falsePositives || 0}</div>
              <div className="text-xs text-gray-400">False Positives</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const Rules = () => {
  const [rules, setRules] = useState([
    {
      id: 1,
      name: "Suspicious PowerShell Execution",
      description: "Detects suspicious PowerShell command execution with encoded commands",
      type: "signature",
      severity: "high",
      enabled: true,
      conditions: `process.name == "powershell.exe" AND
command_line CONTAINS "-EncodedCommand"`,
      actions: "alert",
      tags: ["powershell", "encoded", "suspicious"],
      matches: 42,
      lastUpdated: "2 hours ago",
      accuracy: "96.8",
      falsePositives: 1
    },
    {
      id: 2,
      name: "Ransomware File Extension Detection",
      description: "Detects creation of files with known ransomware extensions",
      type: "behavioral",
      severity: "critical",
      enabled: true,
      conditions: `file.extension IN [".locked", ".encrypted", ".crypto"]`,
      actions: "block",
      tags: ["ransomware", "file", "malware"],
      matches: 0,
      lastUpdated: "1 day ago",
      accuracy: "99.2",
      falsePositives: 0
    },
    {
      id: 3,
      name: "Unusual Network Traffic",
      description: "Detects network connections to suspicious domains",
      type: "anomaly",
      severity: "medium",
      enabled: false,
      conditions: `network.destination.domain IN suspicious_domains AND
network.bytes > 10MB`,
      actions: "log",
      tags: ["network", "anomaly", "traffic"],
      matches: 156,
      lastUpdated: "3 days ago",
      accuracy: "87.3",
      falsePositives: 8
    }
  ]);

  const [filteredRules, setFilteredRules] = useState(rules);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    type: '',
    severity: '',
    status: ''
  });
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingRule, setEditingRule] = useState(null);
  const [viewingRule, setViewingRule] = useState(null);

  useEffect(() => {
    let filtered = rules.filter(rule => {
      if (searchQuery && !rule.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !rule.description.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      if (filters.type && rule.type !== filters.type) return false;
      if (filters.severity && rule.severity !== filters.severity) return false;
      if (filters.status === 'enabled' && !rule.enabled) return false;
      if (filters.status === 'disabled' && rule.enabled) return false;
      return true;
    });
    setFilteredRules(filtered);
  }, [rules, searchQuery, filters]);

  const handleCreateRule = (newRule) => {
    const rule = {
      ...newRule,
      id: Date.now(),
      matches: 0,
      lastUpdated: 'Just now',
      accuracy: '100',
      falsePositives: 0
    };
    setRules(prev => [...prev, rule]);
  };

  const handleEditRule = (updatedRule) => {
    setRules(prev => prev.map(rule => 
      rule.id === updatedRule.id 
        ? { ...updatedRule, lastUpdated: 'Just now' }
        : rule
    ));
    setEditingRule(null);
  };

  const handleDeleteRule = (ruleToDelete) => {
    if (window.confirm('Are you sure you want to delete this rule?')) {
      setRules(prev => prev.filter(rule => rule.id !== ruleToDelete.id));
    }
  };

  const handleToggleRule = (ruleToToggle) => {
    setRules(prev => prev.map(rule =>
      rule.id === ruleToToggle.id
        ? { ...rule, enabled: !rule.enabled, lastUpdated: 'Just now' }
        : rule
    ));
  };

  const handleDuplicateRule = (ruleToDuplicate) => {
    const duplicatedRule = {
      ...ruleToDuplicate,
      id: Date.now(),
      name: `${ruleToDuplicate.name} (Copy)`,
      enabled: false,
      matches: 0,
      lastUpdated: 'Just now'
    };
    setRules(prev => [...prev, duplicatedRule]);
  };

  const stats = {
    total: rules.length,
    active: rules.filter(r => r.enabled).length,
    inactive: rules.filter(r => !r.enabled).length,
    totalMatches: rules.reduce((sum, r) => sum + (r.matches || 0), 0)
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Detection Rules</h1>
          <p className="text-gray-400 mt-1">Create and manage security detection rules</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors font-medium"
        >
          <PlusIcon className="w-5 h-5" />
          Create Rule
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <Cog6ToothIcon className="w-6 h-6 text-blue-400" />
            <span className="text-lg font-semibold text-white">Total Rules</span>
          </div>
          <div className="text-3xl font-bold text-blue-400">{stats.total}</div>
        </div>

        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircleIcon className="w-6 h-6 text-green-400" />
            <span className="text-lg font-semibold text-white">Active</span>
          </div>
          <div className="text-3xl font-bold text-green-400">{stats.active}</div>
        </div>

        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <XCircleIcon className="w-6 h-6 text-gray-400" />
            <span className="text-lg font-semibold text-white">Inactive</span>
          </div>
          <div className="text-3xl font-bold text-gray-400">{stats.inactive}</div>
        </div>

        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <ExclamationTriangleIcon className="w-6 h-6 text-yellow-400" />
            <span className="text-lg font-semibold text-white">Total Matches</span>
          </div>
          <div className="text-3xl font-bold text-yellow-400">{stats.totalMatches}</div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search rules..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />
        </div>

        <select
          value={filters.type}
          onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
          className="bg-white/10 border border-white/20 rounded-xl px-3 py-3 text-white"
        >
          <option value="">All Types</option>
          <option value="signature">Signature-based</option>
          <option value="behavioral">Behavioral</option>
          <option value="anomaly">Anomaly Detection</option>
          <option value="threshold">Threshold-based</option>
        </select>

        <select
          value={filters.severity}
          onChange={(e) => setFilters(prev => ({ ...prev, severity: e.target.value }))}
          className="bg-white/10 border border-white/20 rounded-xl px-3 py-3 text-white"
        >
          <option value="">All Severities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="critical">Critical</option>
        </select>

        <select
          value={filters.status}
          onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
          className="bg-white/10 border border-white/20 rounded-xl px-3 py-3 text-white"
        >
          <option value="">All Status</option>
          <option value="enabled">Active</option>
          <option value="disabled">Inactive</option>
        </select>
      </div>

      {/* Rules List */}
      <div className="space-y-4">
        {filteredRules.length > 0 ? (
          filteredRules.map(rule => (
            <RuleCard
              key={rule.id}
              rule={rule}
              onEdit={setEditingRule}
              onDelete={handleDeleteRule}
              onToggle={handleToggleRule}
              onDuplicate={handleDuplicateRule}
              onView={setViewingRule}
            />
          ))
        ) : (
          <div className="text-center py-12">
            <Cog6ToothIcon className="w-16 h-16 mx-auto mb-4 text-gray-600" />
            <h3 className="text-xl font-medium text-gray-400 mb-2">No rules found</h3>
            <p className="text-gray-500">
              {searchQuery || Object.values(filters).some(f => f) 
                ? 'Try adjusting your search criteria' 
                : 'Create your first detection rule to get started'
              }
            </p>
          </div>
        )}
      </div>

      {/* Modals */}
      <CreateRuleModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSave={handleCreateRule}
      />

      <CreateRuleModal
        isOpen={!!editingRule}
        onClose={() => setEditingRule(null)}
        onSave={handleEditRule}
        initialRule={editingRule}
      />

      <RuleDetailModal
        rule={viewingRule}
        onClose={() => setViewingRule(null)}
      />
    </div>
  );
};