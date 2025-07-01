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
  ComputerDesktopIcon
} from '@heroicons/react/24/outline';
// axios import removed - will be handled by parent component

const Rules = () => {
  const [rules, setRules] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [filterSeverity, setFilterSeverity] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedRules, setSelectedRules] = useState([]);
  const [showDetails, setShowDetails] = useState(null);

  // Fetch rules data
  const fetchRulesData = async () => {
    setLoading(true);
    try {
      const [listRes, statsRes] = await Promise.all([
        fetch('http://192.168.20.85:5000/api/v1/detection/rules').then(res => res.json()),
        fetch('http://192.168.20.85:5000/api/v1/detection/rules/stats/summary').then(res => res.json())
      ]);

      setRules(listRes.rules || []);
      setStats(statsRes);
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
  }, []);

  // Manual refresh
  const handleRefresh = () => {
    fetchRulesData();
  };

  // Get rule type info
  const getRuleTypeInfo = (ruleType) => {
    const typeLower = (ruleType || '').toLowerCase();
    
    const typeMap = {
      'behavioral': {
        icon: BoltIcon,
        color: 'text-blue-600',
        bg: 'bg-blue-100',
        label: 'Behavioral',
        description: 'Behavior-based detection'
      },
      'signature': {
        icon: DocumentTextIcon,
        color: 'text-green-600',
        bg: 'bg-green-100',
        label: 'Signature',
        description: 'Signature-based detection'
      },
      'threshold': {
        icon: BoltIcon,
        color: 'text-orange-600',
        bg: 'bg-orange-100',
        label: 'Threshold',
        description: 'Threshold-based detection'
      },
      'correlation': {
        icon: ShieldCheckIcon,
        color: 'text-purple-600',
        bg: 'bg-purple-100',
        label: 'Correlation',
        description: 'Event correlation rule'
      }
    };

    return typeMap[typeLower] || {
      icon: BoltIcon,
      color: 'text-gray-600',
      bg: 'bg-gray-100',
      label: ruleType || 'Unknown',
      description: 'Detection rule'
    };
  };

  // Get severity info
  const getSeverityInfo = (severity) => {
    const severityLower = (severity || '').toLowerCase();
    
    const severityMap = {
      'critical': {
        bg: 'bg-red-100',
        text: 'text-red-800',
        border: 'border-red-200',
        label: 'Critical'
      },
      'high': {
        bg: 'bg-orange-100',
        text: 'text-orange-800',
        border: 'border-orange-200',
        label: 'High'
      },
      'medium': {
        bg: 'bg-yellow-100',
        text: 'text-yellow-800',
        border: 'border-yellow-200',
        label: 'Medium'
      },
      'low': {
        bg: 'bg-green-100',
        text: 'text-green-800',
        border: 'border-green-200',
        label: 'Low'
      }
    };

    return severityMap[severityLower] || {
      bg: 'bg-gray-100',
      text: 'text-gray-800',
      border: 'border-gray-200',
      label: severity || 'Unknown'
    };
  };

  // Get platform icon
  const getPlatformIcon = (platform) => {
    const platformLower = (platform || '').toLowerCase();
    if (platformLower.includes('windows')) return '🪟';
    if (platformLower.includes('linux')) return '🐧';
    if (platformLower.includes('mac')) return '🍎';
    if (platformLower.includes('all')) return '🌐';
    return '💻';
  };

  // Filter rules
  const filteredRules = rules.filter(rule => {
    const matchesSearch = 
      (rule.rule_name || rule.RuleName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (rule.alert_title || rule.AlertTitle || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (rule.mitre_tactic || rule.MitreTactic || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'All' || 
      (rule.rule_type || rule.RuleType || '').toLowerCase() === filterType.toLowerCase();
    
    const matchesSeverity = filterSeverity === 'All' ||
      (rule.alert_severity || rule.AlertSeverity || '').toLowerCase() === filterSeverity.toLowerCase();
    
    const matchesStatus = filterStatus === 'All' ||
      (filterStatus === 'Active' && (rule.is_active === true || rule.IsActive === true)) ||
      (filterStatus === 'Inactive' && (rule.is_active === false || rule.IsActive === false));
    
    return matchesSearch && matchesType && matchesSeverity && matchesStatus;
  });

  // Toggle rule status
  const toggleRuleStatus = async (ruleId, currentStatus) => {
    try {
      // This would make an API call to toggle the rule
      console.log(`Toggle rule ${ruleId} from ${currentStatus} to ${!currentStatus}`);
      // await axios.put(`/api/v1/detection/rules/${ruleId}/toggle`);
      // fetchRulesData(); // Refresh data
    } catch (err) {
      console.error('Error toggling rule status:', err);
    }
  };

  // Select rule
  const toggleSelectRule = (ruleId) => {
    setSelectedRules(prev => 
      prev.includes(ruleId) 
        ? prev.filter(id => id !== ruleId)
        : [...prev, ruleId]
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-yellow-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-yellow-200 rounded-full animate-spin"></div>
            <div className="w-20 h-20 border-4 border-yellow-600 border-t-transparent rounded-full animate-spin absolute top-0"></div>
          </div>
          <h3 className="mt-6 text-xl font-semibold text-gray-700">Loading Detection Rules</h3>
          <p className="mt-2 text-gray-500">Fetching security rules...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-yellow-50 to-orange-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <BoltIcon className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-yellow-700 mb-2">Connection Error</h3>
          <p className="text-yellow-600 mb-6">{error}</p>
          <button
            onClick={handleRefresh}
            className="px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors duration-200 font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-yellow-50 to-orange-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-lg shadow-lg border-b border-white/20 px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-xl shadow-lg">
              <BoltIcon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                Detection Rules
              </h1>
              <p className="text-gray-600 text-sm">Manage security detection rules and policies</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200">
              <PlusIcon className="w-4 h-4" />
              <span className="text-sm font-medium">New Rule</span>
            </button>
            
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="flex items-center space-x-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors duration-200 disabled:opacity-50"
            >
              <ArrowPathIcon className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span className="text-sm font-medium">Refresh</span>
            </button>
            
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <ClockIcon className="w-4 h-4" />
              <span>Last updated: {new Date().toLocaleTimeString()}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-gray-900">{stats?.total_rules || rules.length}</div>
                <div className="text-sm text-gray-600 font-medium">Total Rules</div>
              </div>
              <div className="p-3 bg-yellow-100 rounded-xl">
                <BoltIcon className="w-8 h-8 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-green-600">{stats?.active_rules || 0}</div>
                <div className="text-sm text-gray-600 font-medium">Active</div>
              </div>
              <div className="p-3 bg-green-100 rounded-xl">
                <CheckCircleIcon className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-gray-600">{stats?.inactive_rules || 0}</div>
                <div className="text-sm text-gray-600 font-medium">Inactive</div>
              </div>
              <div className="p-3 bg-gray-100 rounded-xl">
                <XCircleIcon className="w-8 h-8 text-gray-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-blue-600">{stats?.triggered_today || 0}</div>
                <div className="text-sm text-gray-600 font-medium">Triggered Today</div>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl">
                <BoltIcon className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
              {/* Search */}
              <div className="relative">
                <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search rules..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2.5 w-80 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
                />
              </div>

              {/* Type Filter */}
              <div className="flex items-center space-x-2">
                <FunnelIcon className="w-5 h-5 text-gray-400" />
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
                >
                  <option value="All">All Types</option>
                  <option value="behavioral">Behavioral</option>
                  <option value="signature">Signature</option>
                  <option value="threshold">Threshold</option>
                  <option value="correlation">Correlation</option>
                </select>
              </div>

              {/* Severity Filter */}
              <select
                value={filterSeverity}
                onChange={(e) => setFilterSeverity(e.target.value)}
                className="border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
              >
                <option value="All">All Severities</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>

              {/* Status Filter */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
              >
                <option value="All">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            <div className="flex items-center space-x-4">
              {selectedRules.length > 0 && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">{selectedRules.length} selected</span>
                  <button className="px-3 py-1.5 bg-yellow-600 text-white rounded-lg text-sm hover:bg-yellow-700 transition-colors">
                    Bulk Actions
                  </button>
                </div>
              )}
              <div className="text-sm text-gray-500">
                Showing {filteredRules.length} of {rules.length} rules
              </div>
            </div>
          </div>
        </div>

        {/* Rules Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredRules.map((rule, index) => {
            const ruleId = rule.rule_id || rule.RuleID || index;
            const ruleName = rule.rule_name || rule.RuleName || 'Unknown Rule';
            const ruleType = rule.rule_type || rule.RuleType || 'Unknown';
            const alertTitle = rule.alert_title || rule.AlertTitle || 'N/A';
            const alertSeverity = rule.alert_severity || rule.AlertSeverity || 'Unknown';
            const platform = rule.platform || rule.Platform || 'All';
            const isActive = rule.is_active ?? rule.IsActive ?? false;
            const mitreTactic = rule.mitre_tactic || rule.MitreTactic || '';
            const priority = rule.priority || rule.Priority || 50;
            const testMode = rule.test_mode || rule.TestMode || false;
            
            const typeInfo = getRuleTypeInfo(ruleType);
            const severityInfo = getSeverityInfo(alertSeverity);
            const TypeIcon = typeInfo.icon;

            return (
              <div key={ruleId} className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 group">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={selectedRules.includes(ruleId)}
                      onChange={() => toggleSelectRule(ruleId)}
                      className="rounded border-gray-300 text-yellow-600 focus:ring-yellow-500"
                    />
                    <div className={`p-3 rounded-xl ${typeInfo.bg}`}>
                      <TypeIcon className={`w-6 h-6 ${typeInfo.color}`} />
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {testMode && (
                      <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                        Test Mode
                      </span>
                    )}
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${severityInfo.bg} ${severityInfo.text} ${severityInfo.border} border`}>
                      {severityInfo.label}
                    </span>
                    <button
                      onClick={() => toggleRuleStatus(ruleId, isActive)}
                      className={`p-2 rounded-lg transition-colors ${
                        isActive 
                          ? 'bg-green-100 text-green-600 hover:bg-green-200' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                      title={isActive ? 'Disable Rule' : 'Enable Rule'}
                    >
                      {isActive ? <PauseIcon className="w-4 h-4" /> : <PlayIcon className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="mb-4">
                  <h3 className="font-bold text-gray-900 text-lg mb-2">{ruleName}</h3>
                  <div className="flex items-center space-x-2 mb-3">
                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${typeInfo.bg} ${typeInfo.color}`}>
                      {typeInfo.label}
                    </span>
                    <span className="text-2xl">{getPlatformIcon(platform)}</span>
                    <span className="text-sm text-gray-500">{platform}</span>
                  </div>
                  <p className="text-sm text-gray-600">{typeInfo.description}</p>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-sm font-semibold text-gray-700 mb-1">Alert Title:</div>
                    <div className="text-sm text-gray-900">{alertTitle}</div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Priority:</span>
                      <div className="flex items-center space-x-1">
                        <div className={`w-2 h-2 rounded-full ${
                          priority >= 80 ? 'bg-red-500' : 
                          priority >= 60 ? 'bg-orange-500' : 
                          priority >= 40 ? 'bg-yellow-500' : 'bg-green-500'
                        }`}></div>
                        <span className="font-medium text-gray-900">{priority}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className={`font-medium ${isActive ? 'text-green-600' : 'text-gray-600'}`}>
                        {isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>

                  {mitreTactic && (
                    <div className="bg-purple-50 rounded-lg p-3">
                      <div className="text-sm font-semibold text-purple-700 mb-1">MITRE ATT&CK:</div>
                      <div className="text-sm text-purple-900">{mitreTactic}</div>
                    </div>
                  )}
                </div>

                {/* Rule Status Indicators */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className={`text-center p-2 rounded-lg ${isActive ? 'bg-green-50' : 'bg-gray-50'}`}>
                    {isActive ? (
                      <CheckCircleIcon className="w-4 h-4 text-green-500 mx-auto mb-1" />
                    ) : (
                      <XCircleIcon className="w-4 h-4 text-gray-500 mx-auto mb-1" />
                    )}
                    <div className={`text-xs font-medium ${isActive ? 'text-green-700' : 'text-gray-700'}`}>
                      {isActive ? 'Enabled' : 'Disabled'}
                    </div>
                  </div>
                  <div className="text-center p-2 bg-blue-50 rounded-lg">
                    <DocumentTextIcon className="w-4 h-4 text-blue-500 mx-auto mb-1" />
                    <div className="text-xs text-blue-700 font-medium">Monitored</div>
                  </div>
                  <div className="text-center p-2 bg-purple-50 rounded-lg">
                    <ShieldCheckIcon className="w-4 h-4 text-purple-500 mx-auto mb-1" />
                    <div className="text-xs text-purple-700 font-medium">Protected</div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setShowDetails(ruleId)}
                    className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors duration-200 text-sm font-medium"
                  >
                    <EyeIcon className="w-4 h-4" />
                    <span>Details</span>
                  </button>
                  
                  <button className="flex items-center justify-center p-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-200">
                    <Cog6ToothIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredRules.length === 0 && (
          <div className="text-center py-16">
            <BoltIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No detection rules found</h3>
            <p className="text-gray-500">
              {rules.length === 0 
                ? "No detection rules configured yet." 
                : "No rules match your search criteria."
              }
            </p>
            {searchTerm && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilterType('All');
                  setFilterSeverity('All');
                  setFilterStatus('All');
                }}
                className="mt-4 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors duration-200"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Rule Details Modal */}
      {showDetails && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Detection Rule Details</h2>
              <button
                onClick={() => setShowDetails(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <XCircleIcon className="w-6 h-6 text-gray-500" />
              </button>
            </div>
            
            {/* Rule details content */}
            <div className="space-y-6">
              <div className="text-center py-8 text-gray-500">
                <BoltIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Detailed rule configuration view coming soon...</p>
                <p className="text-sm mt-2">This will include rule conditions, actions, and performance metrics.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Rules;