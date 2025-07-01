// File: src/services/api.js
// Enhanced API service for EDR dashboard - Real database integration

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

// Utility function for API calls with better error handling
async function apiCall(endpoint, options = {}) {
  try {
    const url = `${API_BASE}${endpoint}`;
    const response = await fetch(url, { ...fetchOptions, ...options });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText || 'API request failed'}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`API Error for ${endpoint}:`, error);
    throw error;
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