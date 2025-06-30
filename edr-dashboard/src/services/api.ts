import axios, { AxiosInstance, AxiosResponse } from 'axios';
import {
  Agent,
  Event,
  Alert,
  Threat,
  DetectionRule,
  SystemConfig,
  DashboardStats,
  AgentOverview,
  AlertOverview,
  ThreatOverview,
  EventTimeline,
  SystemOverview,
  PaginatedResponse,
  EventFilters,
  AlertFilters,
  AgentFilters,
  CreateRuleForm,
  CreateThreatForm,
} from '../types';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor
    this.api.interceptors.request.use(
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
    this.api.interceptors.response.use(
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
  }

  // Health Check
  async getHealth(): Promise<any> {
    const response = await this.api.get('/health');
    return response.data;
  }

  // Dashboard APIs
  async getDashboardStats(): Promise<DashboardStats> {
    const response = await this.api.get('/dashboard/stats');
    return response.data;
  }

  async getAgentsOverview(): Promise<AgentOverview> {
    const response = await this.api.get('/dashboard/agents-overview');
    return response.data;
  }

  async getAlertsOverview(hours: number = 24): Promise<AlertOverview> {
    const response = await this.api.get(`/dashboard/alerts-overview?hours=${hours}`);
    return response.data;
  }

  async getThreatsOverview(hours: number = 24): Promise<ThreatOverview> {
    const response = await this.api.get(`/dashboard/threats-overview?hours=${hours}`);
    return response.data;
  }

  async getEventsTimeline(hours: number = 24, granularity: string = 'hour'): Promise<EventTimeline> {
    const response = await this.api.get(`/dashboard/events-timeline?hours=${hours}&granularity=${granularity}`);
    return response.data;
  }

  async getSystemOverview(): Promise<SystemOverview> {
    const response = await this.api.get('/dashboard/system-overview');
    return response.data;
  }

  async getRealTimeStats(): Promise<any> {
    const response = await this.api.get('/dashboard/real-time-stats');
    return response.data;
  }

  // Agents APIs
  async getAgents(filters?: AgentFilters, page: number = 1, perPage: number = 20): Promise<PaginatedResponse<Agent>> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }
    params.append('page', page.toString());
    params.append('per_page', perPage.toString());

    const response = await this.api.get(`/agents?${params.toString()}`);
    return response.data;
  }

  async getAgent(agentId: string): Promise<Agent> {
    const response = await this.api.get(`/agents/${agentId}`);
    return response.data;
  }

  async updateAgent(agentId: string, data: Partial<Agent>): Promise<Agent> {
    const response = await this.api.put(`/agents/${agentId}`, data);
    return response.data;
  }

  async deleteAgent(agentId: string): Promise<void> {
    await this.api.delete(`/agents/${agentId}`);
  }

  async getAgentEvents(agentId: string, page: number = 1, perPage: number = 20): Promise<PaginatedResponse<Event>> {
    const response = await this.api.get(`/agents/${agentId}/events?page=${page}&per_page=${perPage}`);
    return response.data;
  }

  async getAgentAlerts(agentId: string, page: number = 1, perPage: number = 20): Promise<PaginatedResponse<Alert>> {
    const response = await this.api.get(`/agents/${agentId}/alerts?page=${page}&per_page=${perPage}`);
    return response.data;
  }

  // Events APIs
  async getEvents(filters?: EventFilters, page: number = 1, perPage: number = 20): Promise<PaginatedResponse<Event>> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }
    params.append('page', page.toString());
    params.append('per_page', perPage.toString());

    const response = await this.api.get(`/events?${params.toString()}`);
    return response.data;
  }

  async getEvent(eventId: number): Promise<Event> {
    const response = await this.api.get(`/events/${eventId}`);
    return response.data;
  }

  async updateEvent(eventId: number, data: Partial<Event>): Promise<Event> {
    const response = await this.api.put(`/events/${eventId}`, data);
    return response.data;
  }

  // Alerts APIs
  async getAlerts(filters?: AlertFilters, page: number = 1, perPage: number = 20): Promise<PaginatedResponse<Alert>> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }
    params.append('page', page.toString());
    params.append('per_page', perPage.toString());

    const response = await this.api.get(`/alerts?${params.toString()}`);
    return response.data;
  }

  async getAlert(alertId: number): Promise<Alert> {
    const response = await this.api.get(`/alerts/${alertId}`);
    return response.data;
  }

  async updateAlert(alertId: number, data: Partial<Alert>): Promise<Alert> {
    const response = await this.api.put(`/alerts/${alertId}`, data);
    return response.data;
  }

  async resolveAlert(alertId: number, resolution: string): Promise<Alert> {
    const response = await this.api.post(`/alerts/${alertId}/resolve`, { resolution });
    return response.data;
  }

  async assignAlert(alertId: number, assignedTo: string): Promise<Alert> {
    const response = await this.api.post(`/alerts/${alertId}/assign`, { assigned_to: assignedTo });
    return response.data;
  }

  // Threats APIs
  async getThreats(page: number = 1, perPage: number = 20): Promise<PaginatedResponse<Threat>> {
    const response = await this.api.get(`/threats?page=${page}&per_page=${perPage}`);
    return response.data;
  }

  async getThreat(threatId: number): Promise<Threat> {
    const response = await this.api.get(`/threats/${threatId}`);
    return response.data;
  }

  async createThreat(data: CreateThreatForm): Promise<Threat> {
    const response = await this.api.post('/threats', data);
    return response.data;
  }

  async updateThreat(threatId: number, data: Partial<Threat>): Promise<Threat> {
    const response = await this.api.put(`/threats/${threatId}`, data);
    return response.data;
  }

  async deleteThreat(threatId: number): Promise<void> {
    await this.api.delete(`/threats/${threatId}`);
  }

  // Detection Rules APIs
  async getDetectionRules(page: number = 1, perPage: number = 20): Promise<PaginatedResponse<DetectionRule>> {
    const response = await this.api.get(`/detection/rules?page=${page}&per_page=${perPage}`);
    return response.data;
  }

  async getDetectionRule(ruleId: number): Promise<DetectionRule> {
    const response = await this.api.get(`/detection/rules/${ruleId}`);
    return response.data;
  }

  async createDetectionRule(data: CreateRuleForm): Promise<DetectionRule> {
    const response = await this.api.post('/detection/rules', data);
    return response.data;
  }

  async updateDetectionRule(ruleId: number, data: Partial<DetectionRule>): Promise<DetectionRule> {
    const response = await this.api.put(`/detection/rules/${ruleId}`, data);
    return response.data;
  }

  async deleteDetectionRule(ruleId: number): Promise<void> {
    await this.api.delete(`/detection/rules/${ruleId}`);
  }

  async toggleDetectionRule(ruleId: number, isActive: boolean): Promise<DetectionRule> {
    const response = await this.api.patch(`/detection/rules/${ruleId}/toggle`, { is_active: isActive });
    return response.data;
  }

  // System Configuration APIs
  async getSystemConfigs(): Promise<SystemConfig[]> {
    const response = await this.api.get('/system/config');
    return response.data;
  }

  async updateSystemConfig(configKey: string, configValue: string): Promise<SystemConfig> {
    const response = await this.api.put(`/system/config/${configKey}`, { config_value: configValue });
    return response.data;
  }

  // File Upload APIs
  async uploadThreatFile(file: File): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await this.api.post('/threats/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  // Export APIs
  async exportEvents(filters?: EventFilters, format: 'csv' | 'json' = 'csv'): Promise<Blob> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }
    params.append('format', format);

    const response = await this.api.get(`/events/export?${params.toString()}`, {
      responseType: 'blob',
    });
    return response.data;
  }

  async exportAlerts(filters?: AlertFilters, format: 'csv' | 'json' = 'csv'): Promise<Blob> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }
    params.append('format', format);

    const response = await this.api.get(`/alerts/export?${params.toString()}`, {
      responseType: 'blob',
    });
    return response.data;
  }
}

// Create singleton instance
const apiService = new ApiService();
export default apiService; 