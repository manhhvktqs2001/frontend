import axios from 'axios';

// API Base URL - adjust according to your backend
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://192.168.20.85:5000/api/v1';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Dashboard APIs
export const fetchDashboardStats = async () => {
  const response = await api.get('/dashboard/stats');
  return response.data;
};

export const fetchSystemOverview = async () => {
  const response = await api.get('/dashboard/system-overview');
  return response.data;
};

export const fetchRealTimeStats = async () => {
  const response = await api.get('/dashboard/real-time-stats');
  return response.data;
};

export const fetchEventsTimeline = async (params = {}) => {
  const response = await api.get('/dashboard/events-timeline', { params });
  return response.data;
};

// Agents APIs
// Luôn lấy dữ liệu agent mới nhất từ database (không cache, không filter sai)
export const fetchAgents = async () => {
  const response = await api.get('/agents/list', { params: { all: true } });
  return response.data;
};

export const fetchAgentDetails = async (agentId) => {
  const response = await api.get(`/agents/${agentId}`);
  return response.data;
};

export const updateAgentStatus = async (agentId, statusData) => {
  const response = await api.put(`/agents/${agentId}/status`, statusData);
  return response.data;
};

// Events APIs
export const fetchEvents = async (params = {}) => {
  const response = await api.get('/events/list', { params: { ...params, all: true } });
  return response.data;
};

export const fetchEventDetails = async (eventId) => {
  const response = await api.get(`/events/${eventId}`);
  return response.data;
};

export const fetchEventStats = async () => {
  const response = await api.get('/events/stats/summary');
  return response.data;
};

// Alerts APIs
export const fetchAlerts = async (params = {}) => {
  console.log('Fetching alerts with params:', params);
  const response = await api.get('/alerts/list', { params });
  console.log('Alerts response:', response.data);
  return response.data;
};

export const fetchAlertDetails = async (alertId) => {
  const response = await api.get(`/alerts/${alertId}`);
  return response.data;
};

export const updateAlertStatus = async (alertId, statusData) => {
  const response = await api.put(`/alerts/${alertId}/status`, statusData);
  return response.data;
};

export const fetchCriticalAlerts = async () => {
  const response = await api.get('/alerts/critical/list');
  return response.data;
};

export const fetchAlertStats = async () => {
  const response = await api.get('/alerts/stats/summary');
  return response.data;
};

// Detection Rules APIs
export const fetchDetectionRules = async (params = {}) => {
  const response = await api.get('/detection/rules', { params: { ...params, all: true } });
  return response.data;
};

export const fetchDetectionRuleDetails = async (ruleId) => {
  const response = await api.get(`/detection/rules/${ruleId}`);
  return response.data;
};

export const createDetectionRule = async (ruleData) => {
  const response = await api.post('/detection/rules', ruleData);
  return response.data;
};

export const updateDetectionRule = async (ruleId, ruleData) => {
  const response = await api.put(`/detection/rules/${ruleId}`, ruleData);
  return response.data;
};

export const deleteDetectionRule = async (ruleId) => {
  const response = await api.delete(`/detection/rules/${ruleId}`);
  return response.data;
};

export const enableDetectionRule = async (ruleId) => {
  const response = await api.post(`/detection/rules/${ruleId}/enable`);
  return response.data;
};

export const disableDetectionRule = async (ruleId) => {
  const response = await api.post(`/detection/rules/${ruleId}/disable`);
  return response.data;
};

export const fetchRuleTypes = async () => {
  const response = await api.get('/detection/rules/types');
  return response.data;
};

export const fetchDetectionRuleStats = async () => {
  const response = await api.get('/detection/rules/stats/summary');
  return response.data;
};

// Threats APIs
export const fetchThreats = async (params = {}) => {
  const response = await api.get('/threats/list', { params });
  return response.data;
};

export const fetchThreatDetails = async (threatId) => {
  const response = await api.get(`/threats/${threatId}`);
  return response.data;
};

export const createThreat = async (threatData) => {
  const response = await api.post('/threats/create', threatData);
  return response.data;
};

export const updateThreatStatus = async (threatId, isActive) => {
  const response = await api.put(`/threats/${threatId}/status`, { is_active: isActive });
  return response.data;
};

export const fetchThreatStats = async () => {
  const response = await api.get('/threats/stats/summary');
  return response.data;
};

export const checkHashReputation = async (fileHash) => {
  const response = await api.post('/threats/check-hash', null, { 
    params: { file_hash: fileHash } 
  });
  return response.data;
};

export const checkIPReputation = async (ipAddress) => {
  const response = await api.post('/threats/check-ip', { ip_address: ipAddress });
  return response.data;
};

export const checkDomainReputation = async (domain) => {
  const response = await api.post('/threats/check-domain', { domain });
  return response.data;
};

// Health Check API
export const fetchHealthStatus = async () => {
  const response = await api.get('/health');
  return response.data;
};

// Advanced Event Search (for Threat Hunting)
export const searchEvents = async (searchParams = {}) => {
  const response = await api.post('/events/search', searchParams);
  return response.data;
};

export default api;