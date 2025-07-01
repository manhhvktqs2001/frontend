// File: src/services/api.js
// Enhanced API service for EDR dashboard - Real database integration with fallback data

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
  }
};

// Utility function for API calls with fallback data
async function apiCall(endpoint, options = {}) {
  try {
    const url = `${API_BASE}${endpoint}`;
    const response = await fetch(url, { ...fetchOptions, ...options });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.warn(`API Error for ${endpoint}, using fallback data:`, error.message);
    
    // Return fallback data based on endpoint
    if (endpoint.includes('/dashboard/stats')) return fallbackData.dashboard;
    if (endpoint.includes('/agents/overview')) return fallbackData.agents;
    if (endpoint.includes('/agents?') || endpoint.includes('/agents/')) return fallbackData.agents;
    if (endpoint.includes('/alerts/overview')) return fallbackData.alerts;
    if (endpoint.includes('/alerts?') || endpoint.includes('/alerts/')) return fallbackData.alerts;
    if (endpoint.includes('/threats')) return fallbackData.threats;
    if (endpoint.includes('/dashboard/system')) return fallbackData.system;
    if (endpoint.includes('/events')) return fallbackData.events;
    
    // Default fallback
    return { error: error.message, fallback: true };
  }
}

// === DASHBOARD API ===
export async function fetchDashboardStats() {
  return await apiCall('/dashboard/stats');
}

export async function fetchRealTimeStats() {
  return await apiCall('/dashboard/realtime');
}

export async function fetchSystemOverview() {
  return await apiCall('/dashboard/system');
}

// === AGENTS API ===
export async function fetchAgentsOverview() {
  return await apiCall('/agents/overview');
}

export async function fetchAgentsList(page = 1, limit = 50, filters = {}) {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...filters
  });
  return await apiCall(`/agents?${params}`);
}

export async function fetchAgentDetails(agentId) {
  return await apiCall(`/agents/${agentId}`);
}

export async function fetchAgentEvents(agentId, hours = 24) {
  return await apiCall(`/agents/${agentId}/events?hours=${hours}`);
}

export async function updateAgentConfig(agentId, config) {
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
  return await apiCall(`/events/timeline?${params}`);
}

export async function fetchEventsList(page = 1, limit = 50, filters = {}) {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...filters
  });
  return await apiCall(`/events?${params}`);
}

export async function fetchEventDetails(eventId) {
  return await apiCall(`/events/${eventId}`);
}

export async function searchEvents(query, filters = {}) {
  const params = new URLSearchParams({
    q: query,
    ...filters
  });
  return await apiCall(`/events/search?${params}`);
}

// === ALERTS API ===
export async function fetchAlertsOverview(hours = 24) {
  const params = new URLSearchParams({
    hours: hours.toString()
  });
  return await apiCall(`/alerts/overview?${params}`);
}

export async function fetchAlertsList(page = 1, limit = 50, filters = {}) {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...filters
  });
  return await apiCall(`/alerts?${params}`);
}

export async function fetchAlertDetails(alertId) {
  return await apiCall(`/alerts/${alertId}`);
}

export async function updateAlertStatus(alertId, status, assignedTo = null) {
  return await apiCall(`/alerts/${alertId}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status, assignedTo })
  });
}

export async function resolveAlert(alertId, resolution) {
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
  return await apiCall(`/threats/overview?${params}`);
}

export async function fetchThreatsList(page = 1, limit = 50, filters = {}) {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...filters
  });
  return await apiCall(`/threats?${params}`);
}

export async function fetchThreatDetails(threatId) {
  return await apiCall(`/threats/${threatId}`);
}

export async function addThreatIndicator(indicator) {
  return await apiCall('/threats', {
    method: 'POST',
    body: JSON.stringify(indicator)
  });
}

export async function updateThreatIndicator(threatId, updates) {
  return await apiCall(`/threats/${threatId}`, {
    method: 'PUT',
    body: JSON.stringify(updates)
  });
}

export async function deleteThreatIndicator(threatId) {
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
  return await apiCall(`/rules?${params}`);
}

export async function fetchRuleDetails(ruleId) {
  return await apiCall(`/rules/${ruleId}`);
}

export async function createDetectionRule(rule) {
  return await apiCall('/rules', {
    method: 'POST',
    body: JSON.stringify(rule)
  });
}

export async function updateDetectionRule(ruleId, updates) {
  return await apiCall(`/rules/${ruleId}`, {
    method: 'PUT',
    body: JSON.stringify(updates)
  });
}

export async function deleteDetectionRule(ruleId) {
  return await apiCall(`/rules/${ruleId}`, {
    method: 'DELETE'
  });
}

export async function toggleRule(ruleId, isActive) {
  return await apiCall(`/rules/${ruleId}/toggle`, {
    method: 'PUT',
    body: JSON.stringify({ isActive })
  });
}

// === ANALYTICS API ===
export async function fetchThreatAnalytics(timeRange = '7d') {
  return await apiCall(`/analytics/threats?range=${timeRange}`);
}

export async function fetchPerformanceAnalytics(timeRange = '7d') {
  return await apiCall(`/analytics/performance?range=${timeRange}`);
}

export async function fetchPerformanceMetrics(timeRange = '7d') {
  return await apiCall(`/analytics/performance?range=${timeRange}`);
}

export async function fetchMitreAttackCoverage() {
  return await apiCall('/analytics/mitre-coverage');
}

export async function fetchGeographicalThreats() {
  return await apiCall('/analytics/geo-threats');
}

// === REPORTS API ===
export async function generateReport(reportType, params = {}) {
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
  return await apiCall(`/reports?${params}`);
}

export async function downloadReport(reportId) {
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
  return await apiCall('/config');
}

export async function updateSystemConfig(config) {
  return await apiCall('/config', {
    method: 'PUT',
    body: JSON.stringify(config)
  });
}

// === HEALTH CHECK API ===
export async function healthCheck() {
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

// === WebSocket for Real-time Updates ===
export class EDRWebSocket {
  constructor(onMessage, onError) {
    this.ws = null;
    this.onMessage = onMessage;
    this.onError = onError;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
  }

  connect() {
    try {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/ws`;
      
      this.ws = new WebSocket(wsUrl);
      
      this.ws.onopen = () => {
        console.log('WebSocket connected');
        this.reconnectAttempts = 0;
      };
      
      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.onMessage(data);
        } catch (error) {
          console.error('WebSocket message parse error:', error);
        }
      };
      
      this.ws.onclose = () => {
        console.log('WebSocket disconnected');
        this.reconnect();
      };
      
      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.onError?.(error);
      };
    } catch (error) {
      console.error('WebSocket connection failed:', error);
      this.onError?.(error);
    }
  }

  reconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => {
        console.log(`Reconnecting... Attempt ${this.reconnectAttempts}`);
        this.connect();
      }, 5000 * this.reconnectAttempts);
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  send(data) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    }
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