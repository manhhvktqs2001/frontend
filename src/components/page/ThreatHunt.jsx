import React, { useState, useEffect } from 'react';
import {
  MagnifyingGlassIcon,
  FireIcon,
  EyeIcon,
  ClockIcon,
  FunnelIcon,
  DocumentTextIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XMarkIcon,
  ArrowPathIcon,
  BookmarkIcon,
  ShareIcon,
  PlayIcon,
  PauseIcon,
  CodeBracketIcon,
  CpuChipIcon,
  GlobeAltIcon,
  ShieldCheckIcon,
  BoltIcon
} from '@heroicons/react/24/outline';

const ThreatHunt = () => {
  const [activeTab, setActiveTab] = useState('query');
  const [huntQuery, setHuntQuery] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState([]);
  const [savedHunts, setSavedHunts] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [filters, setFilters] = useState({
    timeRange: '24h',
    dataSource: 'all',
    severity: 'all'
  });

  // Hunt tabs
  const huntTabs = [
    {
      id: 'query',
      label: 'Query Builder',
      icon: CodeBracketIcon,
      description: 'Build custom hunting queries'
    },
    {
      id: 'templates',
      label: 'Hunt Templates',
      icon: DocumentTextIcon,
      description: 'Pre-built hunting scenarios'
    },
    {
      id: 'results',
      label: 'Results',
      icon: ChartBarIcon,
      description: 'View hunting results'
    },
    {
      id: 'saved',
      label: 'Saved Hunts',
      icon: BookmarkIcon,
      description: 'Manage saved hunts'
    }
  ];

  // Sample hunt templates
  useEffect(() => {
    setTemplates([
      {
        id: 1,
        name: 'Suspicious PowerShell Activity',
        description: 'Detect potentially malicious PowerShell commands',
        query: 'process_name:"powershell.exe" AND (command_line:"-enc" OR command_line:"-EncodedCommand" OR command_line:"DownloadString")',
        category: 'Process Analysis',
        severity: 'High',
        mitre: 'T1059.001'
      },
      {
        id: 2,
        name: 'Lateral Movement Detection',
        description: 'Identify potential lateral movement activities',
        query: 'event_type:"authentication" AND (login_type:"Network" OR login_type:"RemoteInteractive") AND failure_count:>5',
        category: 'Network Analysis',
        severity: 'Medium',
        mitre: 'T1021'
      },
      {
        id: 3,
        name: 'File Exfiltration Hunt',
        description: 'Hunt for large file transfers to external IPs',
        query: 'event_type:"network" AND bytes_out:>1000000 AND NOT dest_ip:[10.0.0.0/8 OR 192.168.0.0/16 OR 172.16.0.0/12]',
        category: 'Data Exfiltration',
        severity: 'Critical',
        mitre: 'T1041'
      },
      {
        id: 4,
        name: 'Registry Persistence Hunt',
        description: 'Detect registry modifications for persistence',
        query: 'event_type:"registry" AND (registry_key:"*\\Run*" OR registry_key:"*\\RunOnce*" OR registry_key:"*\\Winlogon*")',
        category: 'Persistence',
        severity: 'Medium',
        mitre: 'T1547'
      },
      {
        id: 5,
        name: 'Credential Dumping Detection',
        description: 'Hunt for credential dumping activities',
        query: 'process_name:("mimikatz.exe" OR "procdump.exe" OR "lsass.exe") OR (process_name:"powershell.exe" AND command_line:"*Invoke-Mimikatz*")',
        category: 'Credential Access',
        severity: 'Critical',
        mitre: 'T1003'
      }
    ]);

    setSavedHunts([
      {
        id: 1,
        name: 'Weekly Security Review',
        query: 'severity:("High" OR "Critical") AND timestamp:>7d',
        lastRun: '2025-01-01T10:00:00Z',
        resultCount: 156,
        status: 'completed'
      },
      {
        id: 2,
        name: 'Anomalous Network Activity',
        query: 'event_type:"network" AND bytes_out:>100MB',
        lastRun: '2025-01-01T08:30:00Z',
        resultCount: 23,
        status: 'completed'
      }
    ]);
  }, []);

  // Execute hunt query
  const executeHunt = async () => {
    if (!huntQuery.trim()) return;

    setIsRunning(true);
    try {
      // Simulate API call
      const response = await fetch('http://192.168.20.85:5000/api/v1/threat-hunt/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: huntQuery,
          filters: filters
        })
      });

      const data = await response.json();
      setResults(data.results || []);
      setActiveTab('results');
    } catch (error) {
      console.error('Hunt execution failed:', error);
      // Use mock data for demo
      setTimeout(() => {
        setResults([
          {
            id: 1,
            timestamp: '2025-01-02T10:30:00Z',
            event_type: 'process',
            agent_id: 'WIN-SRV-001',
            process_name: 'powershell.exe',
            command_line: 'powershell.exe -enc UwB0AGEAcgB0AC0AUAByAG8AYwBlAHMAcwA=',
            severity: 'High',
            confidence: 85
          },
          {
            id: 2,
            timestamp: '2025-01-02T10:25:00Z',
            event_type: 'network',
            agent_id: 'WIN-WS-045',
            dest_ip: '192.168.1.100',
            bytes_out: 1500000,
            severity: 'Medium',
            confidence: 70
          }
        ]);
        setActiveTab('results');
      }, 2000);
    } finally {
      setIsRunning(false);
    }
  };

  // Save current hunt
  const saveHunt = () => {
    if (!huntQuery.trim()) return;

    const huntName = prompt('Enter hunt name:');
    if (huntName) {
      const newHunt = {
        id: Date.now(),
        name: huntName,
        query: huntQuery,
        lastRun: new Date().toISOString(),
        resultCount: results.length,
        status: 'saved'
      };
      setSavedHunts(prev => [newHunt, ...prev]);
    }
  };

  // Load template
  const loadTemplate = (template) => {
    setHuntQuery(template.query);
    setActiveTab('query');
  };

  // Query Builder Component
  const QueryBuilder = () => (
    <div className="space-y-6">
      {/* Query Input */}
      <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">Hunt Query</h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={saveHunt}
              className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
            >
              <BookmarkIcon className="w-4 h-4 mr-1 inline" />
              Save
            </button>
            <button className="px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm">
              <ShareIcon className="w-4 h-4 mr-1 inline" />
              Share
            </button>
          </div>
        </div>
        
        <div className="space-y-4">
          <textarea
            value={huntQuery}
            onChange={(e) => setHuntQuery(e.target.value)}
            placeholder="Enter your hunt query... (e.g., process_name:powershell.exe AND command_line:*DownloadString*)"
            className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent font-mono text-sm resize-none"
          />
          
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Use KQL syntax for advanced queries. <a href="#" className="text-blue-600 hover:underline">View documentation</a>
            </div>
            <button
              onClick={executeHunt}
              disabled={isRunning || !huntQuery.trim()}
              className="flex items-center space-x-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isRunning ? (
                <>
                  <ArrowPathIcon className="w-5 h-5 animate-spin" />
                  <span>Hunting...</span>
                </>
              ) : (
                <>
                  <PlayIcon className="w-5 h-5" />
                  <span>Execute Hunt</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Hunt Filters</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Time Range</label>
            <select
              value={filters.timeRange}
              onChange={(e) => setFilters(prev => ({ ...prev, timeRange: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="1h">Last 1 hour</option>
              <option value="24h">Last 24 hours</option>
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="custom">Custom range</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Data Source</label>
            <select
              value={filters.dataSource}
              onChange={(e) => setFilters(prev => ({ ...prev, dataSource: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="all">All Sources</option>
              <option value="process">Process Events</option>
              <option value="network">Network Events</option>
              <option value="file">File Events</option>
              <option value="registry">Registry Events</option>
              <option value="authentication">Authentication</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Severity</label>
            <select
              value={filters.severity}
              onChange={(e) => setFilters(prev => ({ ...prev, severity: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="all">All Severities</option>
              <option value="low">Low and above</option>
              <option value="medium">Medium and above</option>
              <option value="high">High and above</option>
              <option value="critical">Critical only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Query Suggestions */}
      <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Queries</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { label: 'Recent High Severity Events', query: 'severity:"High" AND timestamp:>24h' },
            { label: 'PowerShell Executions', query: 'process_name:"powershell.exe"' },
            { label: 'External Network Connections', query: 'event_type:"network" AND NOT dest_ip:[10.0.0.0/8 OR 192.168.0.0/16]' },
            { label: 'Failed Authentication Events', query: 'event_type:"authentication" AND status:"failed"' }
          ].map((suggestion, index) => (
            <button
              key={index}
              onClick={() => setHuntQuery(suggestion.query)}
              className="text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors border"
            >
              <div className="font-medium text-gray-900 text-sm">{suggestion.label}</div>
              <div className="text-xs text-gray-500 font-mono mt-1">{suggestion.query}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  // Templates Component
  const Templates = () => (
    <div className="space-y-6">
      <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-900">Hunt Templates</h3>
          <div className="text-sm text-gray-500">
            {templates.length} templates available
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {templates.map(template => {
            const getSeverityColor = (severity) => {
              const colors = {
                'Critical': 'bg-red-100 text-red-800 border-red-200',
                'High': 'bg-orange-100 text-orange-800 border-orange-200',
                'Medium': 'bg-yellow-100 text-yellow-800 border-yellow-200',
                'Low': 'bg-green-100 text-green-800 border-green-200'
              };
              return colors[severity] || colors.Medium;
            };

            return (
              <div key={template.id} className="bg-white/80 rounded-xl p-5 border border-gray-200 hover:shadow-lg transition-all duration-200">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 mb-1">{template.name}</h4>
                    <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                    <div className="flex items-center space-x-3">
                      <span className="text-xs font-medium text-gray-500">{template.category}</span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getSeverityColor(template.severity)}`}>
                        {template.severity}
                      </span>
                      {template.mitre && (
                        <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">
                          {template.mitre}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <code className="text-xs text-gray-700 font-mono break-all">
                    {template.query}
                  </code>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => loadTemplate(template)}
                    className="flex-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium transition-colors"
                  >
                    Use Template
                  </button>
                  <button className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm">
                    <EyeIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  // Results Component  
  const Results = () => (
    <div className="space-y-6">
      <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-900">Hunt Results</h3>
          <div className="text-sm text-gray-500">
            {results.length} events found
          </div>
        </div>
        
        {results.length > 0 ? (
          <div className="space-y-4">
            {results.map(result => (
              <div key={result.id} className="bg-white/80 rounded-xl p-5 border border-gray-200">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${
                      result.event_type === 'process' ? 'bg-blue-100 text-blue-600' :
                      result.event_type === 'network' ? 'bg-purple-100 text-purple-600' :
                      result.event_type === 'file' ? 'bg-green-100 text-green-600' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {result.event_type === 'process' ? <CpuChipIcon className="w-5 h-5" /> :
                       result.event_type === 'network' ? <GlobeAltIcon className="w-5 h-5" /> :
                       result.event_type === 'file' ? <DocumentTextIcon className="w-5 h-5" /> :
                       <ChartBarIcon className="w-5 h-5" />}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {result.process_name || result.event_type} Event
                      </h4>
                      <p className="text-sm text-gray-600">
                        Agent: {result.agent_id} | {new Date(result.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      result.severity === 'High' ? 'bg-orange-100 text-orange-800' :
                      result.severity === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {result.severity}
                    </span>
                    <span className="text-xs text-gray-500">
                      {result.confidence}% confidence
                    </span>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-sm text-gray-700">
                    {result.command_line && (
                      <div><strong>Command:</strong> <code className="text-xs">{result.command_line}</code></div>
                    )}
                    {result.dest_ip && (
                      <div><strong>Destination:</strong> {result.dest_ip}</div>
                    )}
                    {result.bytes_out && (
                      <div><strong>Bytes Out:</strong> {result.bytes_out.toLocaleString()}</div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <FireIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No results found. Try adjusting your hunt query or filters.</p>
          </div>
        )}
      </div>
    </div>
  );

  // Saved Hunts Component
  const SavedHunts = () => (
    <div className="space-y-6">
      <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-900">Saved Hunts</h3>
          <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm">
            New Hunt
          </button>
        </div>
        
        <div className="space-y-4">
          {savedHunts.map(hunt => (
            <div key={hunt.id} className="bg-white/80 rounded-xl p-5 border border-gray-200 hover:shadow-lg transition-all duration-200">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900 mb-1">{hunt.name}</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    Last run: {new Date(hunt.lastRun).toLocaleString()}
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>{hunt.resultCount} results</span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      hunt.status === 'completed' ? 'bg-green-100 text-green-800' :
                      hunt.status === 'running' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {hunt.status}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-3 mb-4">
                <code className="text-xs text-gray-700 font-mono break-all">
                  {hunt.query}
                </code>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    setHuntQuery(hunt.query);
                    setActiveTab('query');
                  }}
                  className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
                >
                  <PlayIcon className="w-4 h-4 mr-1 inline" />
                  Run
                </button>
                <button className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                  <EyeIcon className="w-4 h-4 mr-1 inline" />
                  View
                </button>
                <button className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm">
                  <ShareIcon className="w-4 h-4 mr-1 inline" />
                  Share
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Render active tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'query':
        return <QueryBuilder />;
      case 'templates':
        return <Templates />;
      case 'results':
        return <Results />;
      case 'saved':
        return <SavedHunts />;
      default:
        return <QueryBuilder />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50 to-orange-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-lg shadow-lg border-b border-white/20 px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-r from-red-600 to-orange-600 rounded-xl shadow-lg">
              <FireIcon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                Threat Hunting
              </h1>
              <p className="text-gray-600 text-sm">Proactively hunt for advanced threats and suspicious activities</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {isRunning && (
              <div className="flex items-center space-x-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg">
                <ArrowPathIcon className="w-5 h-5 animate-spin" />
                <span className="text-sm font-medium">Hunt in progress...</span>
              </div>
            )}
            
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <ClockIcon className="w-4 h-4" />
              <span>Last hunt: {new Date().toLocaleTimeString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white/70 backdrop-blur-lg shadow-sm border-b border-white/20">
        <div className="px-8">
          <nav className="flex space-x-8">
            {huntTabs.map(tab => {
              const TabIcon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-red-500 text-red-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <TabIcon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-8">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default ThreatHunt;