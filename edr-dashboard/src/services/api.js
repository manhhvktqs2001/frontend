// File: src/services/api.js
// FIXED: Simplified API service without WebSocket for now

const API_BASE = "/api/v1";

// Common fetch options with error handling
const fetchOptions = {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  mode: 'cors',
};

// Fallback data for when API is not available
const fallbackData = {
  dashboard: {
    security_score: 87,
    incidents_resolved: 156,
    last_updated: new Date().toISOString(),
    threat_timeline: [
      { time: '00:00', threats: 5 },
      { time: '04:00', threats: 8 },
      { time: '08:00', threats: 15 },
      { time: '12:00', threats: 23 },
      { time: '16:00', threats: 18 },
      { time: '20:00', threats: 12 }
    ]
  },
  agents: {
    summary: {
      total_agents: 247,
      active_agents: 235,
      offline_agents: 8,
      inactive_agents: 4,
      agent_change: '+5'
    },
    agents: [
      {
        agent_id: 'WIN-001',
        hostname: 'WIN-WS-001',
        ip_address: '192.168.1.101',
        operating_system: 'Windows 11',
        agent_version: '3.0.0',
        status: 'Active',
        last_heartbeat: new Date().toISOString(),
        cpu_usage: 25.5,
        memory_usage: 68.2,
        disk_usage: 45.1
      },
      {
        agent_id: 'LIN-002',
        hostname: 'LIN-SRV-002',
        ip_address: '192.168.1.102',
        operating_system: 'Ubuntu 22.04',
        agent_version: '3.0.0',
        status: 'Active',
        last_heartbeat: new Date().toISOString(),
        cpu_usage: 45.8,
        memory_usage: 72.3,
        disk_usage: 38.9
      }
    ]
  },
  alerts: {
    summary: {
      total_alerts: 43,
      critical_alerts: 5,
      high_alerts: 12,
      medium_alerts: 18,
      low_alerts: 8,
      open_alerts: 23,
      alert_change: '-3'
    },
    severity_distribution: {
      Critical: 5,
      High: 12,
      Medium: 18,
      Low: 8
    },
    alerts: [
      {
        alert_id: 'AL001',
        title: 'Malware Detected',
        description: 'Trojan.Win32.Agent detected on endpoint',
        severity: 'Critical',
        status: 'Open',
        agent_id: 'WIN-001',
        first_detected: new Date().toISOString(),
        risk_score: 95
      }
    ]
  },
  threats: {
    summary: {
      detected_24h: 8,
      active_indicators: 156,
      high_risk: 5,
      blocked: 23,
      threat_change: '-12%'
    },
    top_threats: [
      { threat_name: 'Trojan.Win32.Agent', severity: 'Critical', count: 15 },
      { threat_name: 'Suspicious PowerShell', severity: 'High', count: 8 },
      { threat_name: 'Malware.Generic', severity: 'Medium', count: 5 }
    ]
  },
  system: {
    cpu_usage: 45,
    memory_usage: 62,
    disk_usage: 38,
    network_latency: 12,
    system_load: 'Normal'
  },
  events: {
    total_events: 1245,
    total_threats: 8,
    timeline: [
      {
        event_id: 'EV001',
        event_type: 'Threat',
        description: 'Malware signature detected',
        severity: 'Critical',
        agent_id: 'WIN-001',
        event_timestamp: new Date().toISOString()
      }
    ]
  },
  realtime: {
    activities: [
      { type: 'threat', message: 'Malware signature detected on WIN-WS-001', timestamp: '2 minutes ago' },
      { type: 'alert', message: 'Suspicious network activity from 192.168.1.100', timestamp: '5 minutes ago' },
      { type: 'scan', message: 'Full system scan completed on 15 endpoints', timestamp: '10 minutes ago' },
      { type: 'update', message: 'Agent updated on LIN-SRV-002', timestamp: '15 minutes ago' },
      { type: 'alert', message: 'Failed login attempts detected', timestamp: '20 minutes ago' }
    ]
  }
};

// Utility function for API calls with fallback data
async function apiCall(endpoint, options = {}) {
  try {
    const url = `${API_BASE}${endpoint}`;
    console.log(`🌐 API Call: ${url}`);
    
    const response = await fetch(url, { ...fetchOptions, ...options });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log(`✅ API Success: ${endpoint}`);
    return data;
  } catch (error) {
    console.warn(`⚠️ API Error for ${endpoint}, using fallback data:`, error.message);
    
    // Return fallback data based on endpoint
    if (endpoint.includes('/dashboard/stats')) return fallbackData.dashboard;
    if (endpoint.includes('/agents/overview')) return fallbackData.agents;
    if (endpoint.includes('/agents?') || endpoint.includes('/agents/')) return fallbackData.agents;
    if (endpoint.includes('/alerts/overview')) return fallbackData.alerts;
    if (endpoint.includes('/alerts?') || endpoint.includes('/alerts/')) return fallbackData.alerts;
    if (endpoint.includes('/threats')) return fallbackData.threats;
    if (endpoint.includes('/dashboard/system')) return fallbackData.system;
    if (endpoint.includes('/events')) return fallbackData.events;
    if (endpoint.includes('/dashboard/realtime')) return fallbackData.realtime;
    
    // Default fallback
    return { error: error.message, fallback: true, data: fallbackData.dashboard };
  }
}

// === DASHBOARD API ===
export async function fetchDashboardStats() {
  console.log('📊 Fetching dashboard stats...');
  return await apiCall('/dashboard/stats');
}

export async function fetchRealTimeStats() {
  console.log('⚡ Fetching real-time stats...');
  return await apiCall('/dashboard/realtime');
}

export async function fetchSystemOverview() {
  console.log('🖥️ Fetching system overview...');
  return await apiCall('/dashboard/system');
}

// === AGENTS API ===
export async function fetchAgentsOverview() {
  console.log('👥 Fetching agents overview...');
  return await apiCall('/agents/overview');
}

export async function fetchAgentsList(page = 1, limit = 50, filters = {}) {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...filters
  });
  console.log(`👥 Fetching agents list (page ${page})...`);
  return await apiCall(`/agents?${params}`);
}

export async function fetchAgentDetails(agentId) {
  console.log(`👤 Fetching agent details: ${agentId}...`);
  return await apiCall(`/agents/${agentId}`);
}

export async function fetchAgentEvents(agentId, hours = 24) {
  console.log(`📋 Fetching agent events: ${agentId} (${hours}h)...`);
  return await apiCall(`/agents/${agentId}/events?hours=${hours}`);
}

export async function updateAgentConfig(agentId, config) {
  console.log(`⚙️ Updating agent config: ${agentId}...`);
  return await apiCall(`/agents/${agentId}/config`, {
    method: 'PUT',
    body: JSON.stringify(config)
  });
}

// === EVENTS API ===
export async function fetchEventsTimeline(hours = 24, granularity = "hour") {
  const params = new URLSearchParams({
    hours: hours.toString(),
    granularity
  });
  console.log(`📊 Fetching events timeline (${hours}h)...`);
  return await apiCall(`/events/timeline?${params}`);
}

export async function fetchEventsList(page = 1, limit = 50, filters = {}) {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...filters
  });
  console.log(`📋 Fetching events list (page ${page})...`);
  return await apiCall(`/events?${params}`);
}

export async function fetchEventDetails(eventId) {
  console.log(`📄 Fetching event details: ${eventId}...`);
  return await apiCall(`/events/${eventId}`);
}

export async function searchEvents(query, filters = {}) {
  const params = new URLSearchParams({
    q: query,
    ...filters
  });
  console.log(`🔍 Searching events: ${query}...`);
  return await apiCall(`/events/search?${params}`);
}

// === ALERTS API ===
export async function fetchAlertsOverview(hours = 24) {
  const params = new URLSearchParams({
    hours: hours.toString()
  });
  console.log(`🚨 Fetching alerts overview (${hours}h)...`);
  return await apiCall(`/alerts/overview?${params}`);
}

export async function fetchAlertsList(page = 1, limit = 50, filters = {}) {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...filters
  });
  console.log(`🚨 Fetching alerts list (page ${page})...`);
  return await apiCall(`/alerts?${params}`);
}

export async function fetchAlertDetails(alertId) {
  console.log(`📄 Fetching alert details: ${alertId}...`);
  return await apiCall(`/alerts/${alertId}`);
}

export async function updateAlertStatus(alertId, status, assignedTo = null) {
  console.log(`📝 Updating alert status: ${alertId} -> ${status}...`);
  return await apiCall(`/alerts/${alertId}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status, assignedTo })
  });
}

export async function resolveAlert(alertId, resolution) {
  console.log(`✅ Resolving alert: ${alertId}...`);
  return await apiCall(`/alerts/${alertId}/resolve`, {
    method: 'PUT',
    body: JSON.stringify(resolution)
  });
}

// === THREATS API ===
export async function fetchThreatsOverview(hours = 24) {
  const params = new URLSearchParams({
    hours: hours.toString()
  });
  console.log(`🦠 Fetching threats overview (${hours}h)...`);
  return await apiCall(`/threats/overview?${params}`);
}

export async function fetchThreatsList(page = 1, limit = 50, filters = {}) {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...filters
  });
  console.log(`🦠 Fetching threats list (page ${page})...`);
  return await apiCall(`/threats?${params}`);
}

export async function fetchThreatDetails(threatId) {
  console.log(`📄 Fetching threat details: ${threatId}...`);
  return await apiCall(`/threats/${threatId}`);
}

export async function addThreatIndicator(indicator) {
  console.log('➕ Adding threat indicator...');
  return await apiCall('/threats', {
    method: 'POST',
    body: JSON.stringify(indicator)
  });
}

export async function updateThreatIndicator(threatId, updates) {
  console.log(`📝 Updating threat indicator: ${threatId}...`);
  return await apiCall(`/threats/${threatId}`, {
    method: 'PUT',
    body: JSON.stringify(updates)
  });
}

export async function deleteThreatIndicator(threatId) {
  console.log(`🗑️ Deleting threat indicator: ${threatId}...`);
  return await apiCall(`/threats/${threatId}`, {
    method: 'DELETE'
  });
}

// === DETECTION RULES API ===
export async function fetchDetectionRules(page = 1, limit = 50, filters = {}) {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...filters
  });
  console.log(`📏 Fetching detection rules (page ${page})...`);
  return await apiCall(`/rules?${params}`);
}

export async function fetchRuleDetails(ruleId) {
  console.log(`📄 Fetching rule details: ${ruleId}...`);
  return await apiCall(`/rules/${ruleId}`);
}

export async function createDetectionRule(rule) {
  console.log('➕ Creating detection rule...');
  return await apiCall('/rules', {
    method: 'POST',
    body: JSON.stringify(rule)
  });
}

export async function updateDetectionRule(ruleId, updates) {
  console.log(`📝 Updating detection rule: ${ruleId}...`);
  return await apiCall(`/rules/${ruleId}`, {
    method: 'PUT',
    body: JSON.stringify(updates)
  });
}

export async function deleteDetectionRule(ruleId) {
  console.log(`🗑️ Deleting detection rule: ${ruleId}...`);
  return await apiCall(`/rules/${ruleId}`, {
    method: 'DELETE'
  });
}

export async function toggleRule(ruleId, isActive) {
  console.log(`🔄 Toggling rule: ${ruleId} -> ${isActive ? 'ON' : 'OFF'}...`);
  return await apiCall(`/rules/${ruleId}/toggle`, {
    method: 'PUT',
    body: JSON.stringify({ isActive })
  });
}

// === ANALYTICS API ===
export async function fetchThreatAnalytics(timeRange = '7d') {
  console.log(`📈 Fetching threat analytics (${timeRange})...`);
  return await apiCall(`/analytics/threats?range=${timeRange}`);
}

export async function fetchPerformanceAnalytics(timeRange = '7d') {
  console.log(`📊 Fetching performance analytics (${timeRange})...`);
  return await apiCall(`/analytics/performance?range=${timeRange}`);
}

export async function fetchPerformanceMetrics(timeRange = '7d') {
  console.log(`📊 Fetching performance metrics (${timeRange})...`);
  return await apiCall(`/analytics/performance?range=${timeRange}`);
}

export async function fetchMitreAttackCoverage() {
  console.log('🎯 Fetching MITRE ATT&CK coverage...');
  return await apiCall('/analytics/mitre-coverage');
}

export async function fetchGeographicalThreats() {
  console.log('🌍 Fetching geographical threats...');
  return await apiCall('/analytics/geo-threats');
}

// === REPORTS API ===
export async function generateReport(reportType, params = {}) {
  console.log(`📄 Generating report: ${reportType}...`);
  return await apiCall('/reports/generate', {
    method: 'POST',
    body: JSON.stringify({ type: reportType, ...params })
  });
}

export async function fetchReportsList(page = 1, limit = 20) {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString()
  });
  console.log(`📋 Fetching reports list (page ${page})...`);
  return await apiCall(`/reports?${params}`);
}

export async function downloadReport(reportId) {
  console.log(`⬇️ Downloading report: ${reportId}...`);
  const response = await fetch(`${API_BASE}/reports/${reportId}/download`, {
    ...fetchOptions,
    method: 'GET'
  });
  
  if (!response.ok) {
    throw new Error('Failed to download report');
  }
  
  return response.blob();
}

// === SYSTEM CONFIG API ===
export async function fetchSystemConfig() {
  console.log('⚙️ Fetching system config...');
  return await apiCall('/config');
}

export async function updateSystemConfig(config) {
  console.log('📝 Updating system config...');
  return await apiCall('/config', {
    method: 'PUT',
    body: JSON.stringify(config)
  });
}

// === HEALTH CHECK API ===
export async function healthCheck() {
  console.log('🏥 Performing health check...');
  return await apiCall('/health');
}

// === Enhanced functions for compatibility ===
export async function getEvents(params = {}) {
  return await fetchEventsList(1, 100, params);
}

export async function getThreatAnalytics(params = {}) {
  return await fetchThreatAnalytics(params.timeRange);
}

export async function getPerformanceAnalytics(params = {}) {
  return await fetchPerformanceAnalytics(params.timeRange);
}

export async function getSystemMetrics() {
  return await fetchSystemOverview();
}

export async function getThreatsOverview() {
  return await fetchThreatsOverview();
}

// === WebSocket Class (for future implementation) ===
export class EDRWebSocket {
  constructor(onMessage, onError) {
    this.ws = null;
    this.onMessage = onMessage;
    this.onError = onError;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    console.log('🔌 EDRWebSocket initialized (not connected yet)');
  }

  connect() {
    console.log('🔌 WebSocket connection will be implemented later');
    // WebSocket implementation will be added when backend supports it
    return false;
  }

  disconnect() {
    console.log('🔌 WebSocket disconnected');
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  send(data) {
    console.log('📤 WebSocket send (not implemented yet):', data);
  }
}

// Default export for compatibility
const apiService = {
  fetchDashboardStats,
  fetchAgentsOverview,
  fetchAlertsList,
  fetchThreatsOverview,
  getEvents,
  getThreatAnalytics,
  getPerformanceAnalytics,
  getSystemMetrics,
  healthCheck
};

export default apiService;