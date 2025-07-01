import React, { useEffect, useState } from 'react';
import { 
  ShieldCheckIcon, 
  CheckCircleIcon, 
  EyeIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowPathIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  FireIcon,
  BugAntIcon,
  GlobeAltIcon,
  DocumentIcon,
  HashtagIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
// axios import removed - will be handled by parent component

const Threats = () => {
  const [threats, setThreats] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [filterSeverity, setFilterSeverity] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedThreats, setSelectedThreats] = useState([]);
  const [showDetails, setShowDetails] = useState(null);

  // Fetch threats data
  const fetchThreatsData = async () => {
    setLoading(true);
    try {
      const [listRes, statsRes] = await Promise.all([
        fetch('http://192.168.20.85:5000/api/v1/threats/list').then(res => res.json()),
        fetch('http://192.168.20.85:5000/api/v1/threats/stats/summary').then(res => res.json())
      ]);

      setThreats(listRes.threats || []);
      setStats(statsRes);
      setError(null);
    } catch (err) {
      console.error('Error fetching threats data:', err);
      setError('Cannot load threats data. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchThreatsData();
  }, []);

  // Manual refresh
  const handleRefresh = () => {
    fetchThreatsData();
  };

  // Get threat type info
  const getThreatTypeInfo = (threatType) => {
    const typeLower = (threatType || '').toLowerCase();
    
    const typeMap = {
      'hash': {
        icon: HashtagIcon,
        color: 'text-blue-600',
        bg: 'bg-blue-100',
        label: 'File Hash',
        description: 'Malicious file hash'
      },
      'ip': {
        icon: GlobeAltIcon,
        color: 'text-red-600',
        bg: 'bg-red-100',
        label: 'IP Address',
        description: 'Malicious IP address'
      },
      'domain': {
        icon: GlobeAltIcon,
        color: 'text-purple-600',
        bg: 'bg-purple-100',
        label: 'Domain',
        description: 'Malicious domain'
      },
      'url': {
        icon: GlobeAltIcon,
        color: 'text-orange-600',
        bg: 'bg-orange-100',
        label: 'URL',
        description: 'Malicious URL'
      },
      'signature': {
        icon: DocumentIcon,
        color: 'text-green-600',
        bg: 'bg-green-100',
        label: 'Signature',
        description: 'Malware signature'
      },
      'yara': {
        icon: BugAntIcon,
        color: 'text-yellow-600',
        bg: 'bg-yellow-100',
        label: 'YARA Rule',
        description: 'YARA detection rule'
      }
    };

    return typeMap[typeLower] || {
      icon: ShieldCheckIcon,
      color: 'text-gray-600',
      bg: 'bg-gray-100',
      label: threatType || 'Unknown',
      description: 'Threat indicator'
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
        label: 'Critical',
        icon: FireIcon
      },
      'high': {
        bg: 'bg-orange-100',
        text: 'text-orange-800',
        border: 'border-orange-200',
        label: 'High',
        icon: ExclamationTriangleIcon
      },
      'medium': {
        bg: 'bg-yellow-100',
        text: 'text-yellow-800',
        border: 'border-yellow-200',
        label: 'Medium',
        icon: ExclamationTriangleIcon
      },
      'low': {
        bg: 'bg-green-100',
        text: 'text-green-800',
        border: 'border-green-200',
        label: 'Low',
        icon: CheckCircleIcon
      }
    };

    return severityMap[severityLower] || {
      bg: 'bg-gray-100',
      text: 'text-gray-800',
      border: 'border-gray-200',
      label: severity || 'Unknown',
      icon: ShieldCheckIcon
    };
  };

  // Get status info
  const getStatusInfo = (isActive) => {
    if (isActive === true || isActive === 1 || isActive === 'true') {
      return {
        bg: 'bg-green-100',
        text: 'text-green-800',
        border: 'border-green-200',
        label: 'Active'
      };
    }
    return {
      bg: 'bg-gray-100',
      text: 'text-gray-800',
      border: 'border-gray-200',
      label: 'Inactive'
    };
  };

  // Filter threats
  const filteredThreats = threats.filter(threat => {
    const matchesSearch = 
      (threat.threat_name || threat.ThreatName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (threat.threat_value || threat.ThreatValue || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (threat.description || threat.Description || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'All' || 
      (threat.threat_type || threat.ThreatType || '').toLowerCase() === filterType.toLowerCase();
    
    const matchesSeverity = filterSeverity === 'All' ||
      (threat.severity || threat.Severity || '').toLowerCase() === filterSeverity.toLowerCase();
    
    const matchesStatus = filterStatus === 'All' ||
      (filterStatus === 'Active' && (threat.is_active === true || threat.IsActive === true)) ||
      (filterStatus === 'Inactive' && (threat.is_active === false || threat.IsActive === false));
    
    return matchesSearch && matchesType && matchesSeverity && matchesStatus;
  });

  // Select threat
  const toggleSelectThreat = (threatId) => {
    setSelectedThreats(prev => 
      prev.includes(threatId) 
        ? prev.filter(id => id !== threatId)
        : [...prev, threatId]
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-emerald-200 rounded-full animate-spin"></div>
            <div className="w-20 h-20 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin absolute top-0"></div>
          </div>
          <h3 className="mt-6 text-xl font-semibold text-gray-700">Loading Threats</h3>
          <p className="mt-2 text-gray-500">Fetching threat intelligence...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <ShieldCheckIcon className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-emerald-700 mb-2">Connection Error</h3>
          <p className="text-emerald-600 mb-6">{error}</p>
          <button
            onClick={handleRefresh}
            className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors duration-200 font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-lg shadow-lg border-b border-white/20 px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl shadow-lg">
              <ShieldCheckIcon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Threat Intelligence
              </h1>
              <p className="text-gray-600 text-sm">Monitor and manage threat indicators</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors duration-200 disabled:opacity-50"
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
                <div className="text-3xl font-bold text-red-600">{stats?.critical_threats || 0}</div>
                <div className="text-sm text-gray-600 font-medium">Critical</div>
              </div>
              <div className="p-3 bg-red-100 rounded-xl">
                <FireIcon className="w-8 h-8 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-blue-600">{stats?.high_confidence_threats || 0}</div>
                <div className="text-sm text-gray-600 font-medium">High Confidence</div>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl">
                <EyeIcon className="w-8 h-8 text-blue-600" />
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
                  placeholder="Search threats..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2.5 w-80 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
                />
              </div>

              {/* Type Filter */}
              <div className="flex items-center space-x-2">
                <FunnelIcon className="w-5 h-5 text-gray-400" />
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
                >
                  <option value="All">All Types</option>
                  <option value="hash">File Hash</option>
                  <option value="ip">IP Address</option>
                  <option value="domain">Domain</option>
                  <option value="url">URL</option>
                  <option value="signature">Signature</option>
                  <option value="yara">YARA Rule</option>
                </select>
              </div>

              {/* Severity Filter */}
              <select
                value={filterSeverity}
                onChange={(e) => setFilterSeverity(e.target.value)}
                className="border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
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
                className="border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
              >
                <option value="All">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            <div className="flex items-center space-x-4">
              {selectedThreats.length > 0 && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">{selectedThreats.length} selected</span>
                  <button className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-sm hover:bg-emerald-700 transition-colors">
                    Actions
                  </button>
                </div>
              )}
              <div className="text-sm text-gray-500">
                Showing {filteredThreats.length} of {threats.length} threats
              </div>
            </div>
          </div>
        </div>

        {/* Threats Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredThreats.map((threat, index) => {
            const threatId = threat.threat_id || threat.ThreatID || index;
            const threatName = threat.threat_name || threat.ThreatName || 'Unknown Threat';
            const threatType = threat.threat_type || threat.ThreatType || 'Unknown';
            const threatValue = threat.threat_value || threat.ThreatValue || threat.description || threat.Description || 'N/A';
            const severity = threat.severity || threat.Severity || 'Unknown';
            const platform = threat.platform || threat.Platform || 'All';
            const isActive = threat.is_active ?? threat.IsActive;
            const confidence = threat.confidence || threat.Confidence || 'Medium';
            const detectionCount = threat.detection_count || threat.DetectionCount || 0;
            
            const typeInfo = getThreatTypeInfo(threatType);
            const severityInfo = getSeverityInfo(severity);
            const statusInfo = getStatusInfo(isActive);
            const TypeIcon = typeInfo.icon;
            const SeverityIcon = severityInfo.icon;

            return (
              <div key={threatId} className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 group">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={selectedThreats.includes(threatId)}
                      onChange={() => toggleSelectThreat(threatId)}
                      className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    <div className={`p-3 rounded-xl ${typeInfo.bg}`}>
                      <TypeIcon className={`w-6 h-6 ${typeInfo.color}`} />
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${severityInfo.bg} ${severityInfo.text} ${severityInfo.border} border`}>
                      {severityInfo.label}
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusInfo.bg} ${statusInfo.text} ${statusInfo.border} border`}>
                      {statusInfo.label}
                    </span>
                  </div>
                </div>

                <div className="mb-4">
                  <h3 className="font-bold text-gray-900 text-lg mb-2">{threatName}</h3>
                  <div className="flex items-center space-x-2 mb-3">
                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${typeInfo.bg} ${typeInfo.color}`}>
                      {typeInfo.label}
                    </span>
                    <span className="text-sm text-gray-500">{platform}</span>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">{typeInfo.description}</p>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Threat Value:</span>
                    <span className="font-mono text-gray-900 text-xs truncate ml-2 max-w-32" title={threatValue}>
                      {threatValue}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Confidence:</span>
                    <span className="font-medium text-gray-900">{confidence}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Detections:</span>
                    <span className="font-bold text-emerald-600">{detectionCount}</span>
                  </div>
                </div>

                {/* Threat Intelligence Indicators */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="text-center p-2 bg-red-50 rounded-lg">
                    <SeverityIcon className="w-4 h-4 text-red-500 mx-auto mb-1" />
                    <div className="text-xs text-red-700 font-medium">Risk</div>
                  </div>
                  <div className="text-center p-2 bg-blue-50 rounded-lg">
                    <EyeIcon className="w-4 h-4 text-blue-500 mx-auto mb-1" />
                    <div className="text-xs text-blue-700 font-medium">Intel</div>
                  </div>
                  <div className="text-center p-2 bg-green-50 rounded-lg">
                    <CheckCircleIcon className="w-4 h-4 text-green-500 mx-auto mb-1" />
                    <div className="text-xs text-green-700 font-medium">Verified</div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setShowDetails(threatId)}
                    className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors duration-200 text-sm font-medium"
                  >
                    <EyeIcon className="w-4 h-4" />
                    <span>Analyze</span>
                  </button>
                  
                  <button 
                    className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-200 text-sm font-medium"
                    title="Toggle Status"
                  >
                    {isActive ? 'Disable' : 'Enable'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredThreats.length === 0 && (
          <div className="text-center py-16">
            <ShieldCheckIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No threats found</h3>
            <p className="text-gray-500">
              {threats.length === 0 
                ? "No threat indicators available." 
                : "No threats match your search criteria."
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
                className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors duration-200"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Threat Details Modal */}
      {showDetails && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Threat Intelligence Analysis</h2>
              <button
                onClick={() => setShowDetails(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <XCircleIcon className="w-6 h-6 text-gray-500" />
              </button>
            </div>
            
            {/* Threat details content */}
            <div className="space-y-6">
              <div className="text-center py-8 text-gray-500">
                <ShieldCheckIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Detailed threat analysis view coming soon...</p>
                <p className="text-sm mt-2">This will include IOC details, attribution, and remediation steps.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Threats;