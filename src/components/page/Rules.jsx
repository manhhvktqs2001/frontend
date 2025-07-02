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
  GlobeAltIcon
} from '@heroicons/react/24/outline';
import { fetchDetectionRules } from '../../service/api';
// axios import removed - will be handled by parent component

const severityMap = {
  critical: 'text-red-400',
  high: 'text-orange-400',
  medium: 'text-yellow-400',
  low: 'text-green-400',
};

const Rules = () => {
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

  const fetchRulesData = async () => {
    setLoading(true);
    try {
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
    fetchRulesData();
    const interval = setInterval(fetchRulesData, 30000);
    return () => clearInterval(interval);
  }, []);

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
    try {
      console.log(`Toggle rule ${ruleId} from ${currentStatus} to ${!currentStatus}`);
    } catch (err) {
      console.error('Error toggling rule status:', err);
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-purple-200 rounded-full animate-spin"></div>
            <div className="w-20 h-20 border-4 border-purple-600 border-t-transparent rounded-full animate-spin absolute top-0"></div>
          </div>
          <h3 className="mt-6 text-xl font-semibold text-gray-100">Loading Rules...</h3>
          <p className="mt-2 text-gray-400">Fetching detection rules...</p>
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
  if (filteredRules.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950">
        <BoltIcon className="w-20 h-20 text-purple-900/30 mb-6" />
        <h3 className="text-2xl font-semibold text-gray-100 mb-2">No Rules Found</h3>
        <p className="text-gray-400 mb-6">No rules match your search or filter criteria.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 text-white">
      {/* Header & Stats */}
      <div className="px-8 py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-white/10 bg-white/10 backdrop-blur-xl shadow-lg sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <BoltIcon className="w-10 h-10 text-purple-400 drop-shadow-lg" />
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent tracking-tight">Detection Rules</h1>
            <p className="text-gray-300 text-sm mt-1">Manage and configure detection rules</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={fetchRulesData}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium disabled:opacity-50 shadow-lg"
          >
            <ArrowPathIcon className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            onClick={exportRules}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium shadow-lg"
          >
            <ArrowDownTrayIcon className="w-5 h-5" />
            Export
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow-lg">
            <PlusIcon className="w-5 h-5" />
            Create Rule
          </button>
          <div className="flex items-center gap-2 text-sm text-gray-200">
            <ClockIcon className="w-4 h-4" />
            <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="p-8 grid grid-cols-2 md:grid-cols-8 gap-4">
        <div className="bg-gradient-to-br from-purple-700 to-purple-900 rounded-2xl shadow-2xl p-4 flex flex-col gap-2 hover:scale-[1.03] transition-transform duration-300 border border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <BoltIcon className="w-6 h-6 text-purple-300" />
            <span className="text-sm font-semibold text-purple-100">Total</span>
          </div>
          <div className="text-2xl font-bold text-white drop-shadow-lg">{calculatedStats.total}</div>
        </div>
        <div className="bg-gradient-to-br from-green-700 to-green-900 rounded-2xl shadow-2xl p-4 flex flex-col gap-2 hover:scale-[1.03] transition-transform duration-300 border border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircleIcon className="w-6 h-6 text-green-300" />
            <span className="text-sm font-semibold text-green-100">Active</span>
          </div>
          <div className="text-2xl font-bold text-white drop-shadow-lg">{calculatedStats.active}</div>
        </div>
        <div className="bg-gradient-to-br from-gray-700 to-gray-900 rounded-2xl shadow-2xl p-4 flex flex-col gap-2 hover:scale-[1.03] transition-transform duration-300 border border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <XCircleIcon className="w-6 h-6 text-gray-300" />
            <span className="text-sm font-semibold text-gray-100">Inactive</span>
          </div>
          <div className="text-2xl font-bold text-white drop-shadow-lg">{calculatedStats.inactive}</div>
        </div>
        <div className="bg-gradient-to-br from-blue-700 to-blue-900 rounded-2xl shadow-2xl p-4 flex flex-col gap-2 hover:scale-[1.03] transition-transform duration-300 border border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <BoltIcon className="w-6 h-6 text-blue-300" />
            <span className="text-sm font-semibold text-blue-100">Behavioral</span>
          </div>
          <div className="text-2xl font-bold text-white drop-shadow-lg">{calculatedStats.behavioral}</div>
        </div>
        <div className="bg-gradient-to-br from-green-700 to-emerald-900 rounded-2xl shadow-2xl p-4 flex flex-col gap-2 hover:scale-[1.03] transition-transform duration-300 border border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <DocumentTextIcon className="w-6 h-6 text-green-300" />
            <span className="text-sm font-semibold text-green-100">Signature</span>
          </div>
          <div className="text-2xl font-bold text-white drop-shadow-lg">{calculatedStats.signature}</div>
        </div>
        <div className="bg-gradient-to-br from-orange-700 to-yellow-900 rounded-2xl shadow-2xl p-4 flex flex-col gap-2 hover:scale-[1.03] transition-transform duration-300 border border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <BoltIcon className="w-6 h-6 text-orange-300" />
            <span className="text-sm font-semibold text-orange-100">Threshold</span>
          </div>
          <div className="text-2xl font-bold text-white drop-shadow-lg">{calculatedStats.threshold}</div>
        </div>
        <div className="bg-gradient-to-br from-purple-700 to-violet-900 rounded-2xl shadow-2xl p-4 flex flex-col gap-2 hover:scale-[1.03] transition-transform duration-300 border border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheckIcon className="w-6 h-6 text-purple-300" />
            <span className="text-sm font-semibold text-purple-100">Correlation</span>
          </div>
          <div className="text-2xl font-bold text-white drop-shadow-lg">{calculatedStats.correlation}</div>
        </div>
      </div>

      {/* Filters & Bulk Actions */}
      <div className="px-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="flex gap-2">
          <div className="relative">
            <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search rule name, title, or MITRE tactic..."
              className="pl-10 pr-4 py-2 bg-white/10 border border-white/10 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder:text-gray-400"
            />
          </div>
          <select
            value={filterType}
            onChange={e => setFilterType(e.target.value)}
            className="px-4 py-2 bg-white/10 border border-white/10 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
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
            className="px-4 py-2 bg-white/10 border border-white/10 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
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
            className="px-4 py-2 bg-white/10 border border-white/10 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
        {selectedRules.length > 0 && (
          <div className="flex gap-2 items-center bg-purple-900/60 px-4 py-2 rounded-lg shadow-lg">
            <span className="text-purple-200 font-medium">{selectedRules.length} selected</span>
            <button className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700">Export Selected</button>
            <button className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700">Delete Selected</button>
          </div>
        )}
      </div>

      {/* Rules Table */}
      <div className="px-8 overflow-x-auto rounded-2xl shadow-2xl bg-white/10 border border-white/10">
        <table className="min-w-full divide-y divide-white/10">
          <thead className="bg-white/5">
            <tr>
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  checked={selectedRules.length === filteredRules.length && filteredRules.length > 0}
                  onChange={toggleSelectAll}
                  className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">Rule</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">Severity</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">Platform</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white/5 divide-y divide-white/10">
            {filteredRules.map(rule => {
              const typeInfo = getRuleTypeInfo(rule.rule_type || rule.RuleType);
              const severityInfo = getSeverityInfo(rule.alert_severity || rule.AlertSeverity);
              const isActive = rule.is_active === true || rule.IsActive === true;
              
              return (
                <tr key={rule.rule_id || rule.RuleID} className="hover:bg-purple-900/30 transition-all">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedRules.includes(rule.rule_id || rule.RuleID)}
                      onChange={() => toggleSelectRule(rule.rule_id || rule.RuleID)}
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-white">{rule.rule_name || rule.RuleName}</div>
                      <div className="text-sm text-gray-300">{rule.alert_title || rule.AlertTitle}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${typeInfo.bg} ${typeInfo.color}`}>
                      <typeInfo.icon className="w-3 h-3 mr-1" />
                      {typeInfo.label}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${severityInfo.bg} ${severityInfo.text}`}>
                      {severityInfo.label}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => toggleRuleStatus(rule.rule_id || rule.RuleID, isActive)}
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        isActive 
                          ? 'bg-green-900/60 text-green-200 hover:bg-green-800/60' 
                          : 'bg-gray-900/60 text-gray-200 hover:bg-gray-800/60'
                      }`}
                    >
                      {isActive ? (
                        <>
                          <PlayIcon className="w-3 h-3 mr-1" />
                          Active
                        </>
                      ) : (
                        <>
                          <PauseIcon className="w-3 h-3 mr-1" />
                          Inactive
                        </>
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-200">
                    <span className="text-lg">{getPlatformIcon(rule.platform || rule.Platform)}</span>
                    <span className="ml-2 text-sm">{rule.platform || rule.Platform}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => setShowDetails(rule)}
                      className="text-purple-400 hover:text-purple-300 font-medium underline"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Rule Details Modal */}
      {showDetails && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/10 rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-white/10 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Rule Details</h2>
              <button
                onClick={() => setShowDetails(null)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <XCircleIcon className="w-6 h-6 text-gray-300" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Rule Information</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-300">Rule Name</label>
                    <p className="text-white">{showDetails.rule_name || showDetails.RuleName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-300">Alert Title</label>
                    <p className="text-white">{showDetails.alert_title || showDetails.AlertTitle}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-300">Rule Type</label>
                    <p className="text-white">{showDetails.rule_type || showDetails.RuleType}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-300">Severity</label>
                    <p className={`font-semibold ${severityMap[(showDetails.alert_severity || showDetails.AlertSeverity || '').toLowerCase()]}`}>
                      {showDetails.alert_severity || showDetails.AlertSeverity}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-300">Platform</label>
                    <p className="text-white">{showDetails.platform || showDetails.Platform}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-300">Status</label>
                    <p className={`font-semibold ${(showDetails.is_active === true || showDetails.IsActive === true) ? 'text-green-400' : 'text-gray-400'}`}>
                      {(showDetails.is_active === true || showDetails.IsActive === true) ? 'Active' : 'Inactive'}
                    </p>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Rule Details</h3>
                <div className="bg-gray-800/60 rounded-lg p-4">
                  <pre className="text-sm text-gray-200 whitespace-pre-wrap">
                    {JSON.stringify(showDetails, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Rules;