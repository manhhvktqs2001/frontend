import React from 'react';

// EDR System Type Definitions
// Based on database schema and API endpoints

export interface Agent {
  AgentID: string;
  HostName: string;
  IPAddress: string;
  OperatingSystem: string;
  MACAddress?: string;
  OSVersion?: string;
  Architecture?: string;
  Domain?: string;
  AgentVersion: string;
  InstallPath?: string;
  Status: 'Active' | 'Inactive' | 'Error' | 'Updating' | 'Offline';
  LastHeartbeat: string;
  FirstSeen: string;
  CPUUsage: number;
  MemoryUsage: number;
  DiskUsage: number;
  NetworkLatency: number;
  MonitoringEnabled: boolean;
  CreatedAt: string;
  UpdatedAt: string;
}

export interface Event {
  EventID: number;
  AgentID: string;
  EventType: 'Process' | 'File' | 'Network' | 'Registry' | 'Authentication' | 'System';
  EventAction: string;
  EventTimestamp: string;
  Severity: 'Info' | 'Low' | 'Medium' | 'High' | 'Critical';
  
  // Process Events
  ProcessID?: number;
  ProcessName?: string;
  ProcessPath?: string;
  CommandLine?: string;
  ParentPID?: number;
  ParentProcessName?: string;
  ProcessUser?: string;
  ProcessHash?: string;
  
  // File Events
  FilePath?: string;
  FileName?: string;
  FileSize?: number;
  FileHash?: string;
  FileExtension?: string;
  FileOperation?: string;
  
  // Network Events
  SourceIP?: string;
  DestinationIP?: string;
  SourcePort?: number;
  DestinationPort?: number;
  Protocol?: string;
  Direction?: string;
  
  // Registry Events
  RegistryKey?: string;
  RegistryValueName?: string;
  RegistryValueData?: string;
  RegistryOperation?: string;
  
  // Authentication Events
  LoginUser?: string;
  LoginType?: string;
  LoginResult?: string;
  
  // Detection Status
  ThreatLevel: 'None' | 'Suspicious' | 'Malicious';
  RiskScore: number;
  Analyzed: boolean;
  AnalyzedAt?: string;
  
  RawEventData?: string;
  CreatedAt: string;
}

export interface Threat {
  ThreatID: number;
  ThreatName: string;
  ThreatType: 'Hash' | 'IP' | 'Domain' | 'URL' | 'YARA' | 'Behavioral';
  ThreatValue: string;
  Severity: 'Low' | 'Medium' | 'High' | 'Critical';
  ThreatCategory?: string;
  Description?: string;
  MitreTactic?: string;
  MitreTechnique?: string;
  Platform: string;
  ThreatSource?: string;
  Confidence: number;
  IsActive: boolean;
  CreatedAt: string;
  UpdatedAt: string;
}

export interface DetectionRule {
  RuleID: number;
  RuleName: string;
  RuleType: 'Signature' | 'Behavioral' | 'Threshold' | 'Correlation';
  RuleCondition: string;
  AlertTitle: string;
  AlertSeverity: 'Low' | 'Medium' | 'High' | 'Critical';
  AlertType: string;
  RuleCategory?: string;
  AlertDescription?: string;
  MitreTactic?: string;
  MitreTechnique?: string;
  Platform: string;
  Priority: number;
  IsActive: boolean;
  TestMode: boolean;
  CreatedAt: string;
  UpdatedAt: string;
}

export interface Alert {
  AlertID: number;
  AgentID: string;
  EventID?: number;
  RuleID?: number;
  ThreatID?: number;
  AlertType: string;
  Title: string;
  Severity: 'Low' | 'Medium' | 'High' | 'Critical';
  DetectionMethod: string;
  Description?: string;
  Priority: 'Low' | 'Medium' | 'High' | 'Critical';
  Confidence: number;
  RiskScore: number;
  MitreTactic?: string;
  MitreTechnique?: string;
  Status: 'Open' | 'Investigating' | 'Resolved' | 'False Positive' | 'Suppressed';
  AssignedTo?: string;
  ResponseAction?: string;
  FirstDetected: string;
  LastDetected: string;
  ResolvedAt?: string;
  ResolvedBy?: string;
  EventCount: number;
  CreatedAt: string;
  UpdatedAt: string;
}

export interface SystemConfig {
  ConfigID: number;
  ConfigKey: string;
  ConfigValue: string;
  ConfigType: 'String' | 'Integer' | 'Boolean' | 'JSON';
  Description?: string;
  Category?: string;
  ValidationRegex?: string;
  DefaultValue?: string;
  CreatedAt: string;
  UpdatedAt: string;
}

// Dashboard Response Types
export interface DashboardStats {
  agents: {
    total: number;
    active: number;
    online: number;
    offline: number;
  };
  events: {
    last_24h: number;
    suspicious_24h: number;
    avg_per_hour: number;
  };
  alerts: {
    open: number;
    critical: number;
    last_24h: number;
    resolved_24h: number;
  };
  threats: {
    active_indicators: number;
    detected_24h: number;
  };
  detection: {
    active_rules: number;
    detection_rate: number;
  };
  system_health: {
    score: number;
    status: string;
    last_updated: string;
  };
}

export interface AgentOverview {
  summary: {
    total: number;
    active: number;
    online: number;
    offline: number;
    error: number;
  };
  status_distribution: Array<{
    status: string;
    count: number;
  }>;
  os_distribution: Array<{
    operating_system: string;
    count: number;
  }>;
  recent_activity: {
    heartbeats_last_hour: number;
    performance_issues: number;
  };
  top_event_agents: Array<{
    agent_id: string;
    hostname: string;
    event_count: number;
  }>;
}

export interface AlertOverview {
  summary: {
    total_open: number;
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  severity_distribution: Array<{
    severity: string;
    count: number;
  }>;
  status_distribution: Array<{
    status: string;
    count: number;
  }>;
  recent_alerts: Array<{
    alert_id: number;
    title: string;
    severity: string;
    agent_hostname: string;
    first_detected: string;
  }>;
  detection_methods: Array<{
    method: string;
    count: number;
  }>;
}

export interface ThreatOverview {
  summary: {
    total_active: number;
    detected_24h: number;
    by_type: Record<string, number>;
  };
  threat_types: Array<{
    threat_type: string;
    count: number;
  }>;
  severity_distribution: Array<{
    severity: string;
    count: number;
  }>;
  recent_threats: Array<{
    threat_id: number;
    threat_name: string;
    threat_type: string;
    severity: string;
    created_at: string;
  }>;
  mitre_tactics: Array<{
    tactic: string;
    count: number;
  }>;
}

export interface EventTimeline {
  timeline: Array<{
    timestamp: string;
    event_count: number;
    suspicious_count: number;
    malicious_count: number;
  }>;
  event_types: Array<{
    event_type: string;
    count: number;
  }>;
  severity_distribution: Array<{
    severity: string;
    count: number;
  }>;
}

export interface SystemOverview {
  database: {
    connected: boolean;
    response_time_ms: number;
    table_counts: Record<string, number>;
    server: string;
    database_name: string;
  };
  features: {
    detection_engine: boolean;
    threat_intelligence: boolean;
    agent_registration: boolean;
    event_collection: boolean;
  };
  performance: {
    events_per_second: number;
    alerts_per_hour: number;
    avg_response_time: number;
  };
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

// Filter and Query Types
export interface EventFilters {
  agent_id?: string;
  event_type?: string;
  severity?: string;
  threat_level?: string;
  start_date?: string;
  end_date?: string;
  process_name?: string;
  file_name?: string;
  ip_address?: string;
}

export interface AlertFilters {
  agent_id?: string;
  severity?: string;
  status?: string;
  detection_method?: string;
  start_date?: string;
  end_date?: string;
  assigned_to?: string;
}

export interface AgentFilters {
  status?: string;
  operating_system?: string;
  domain?: string;
  last_heartbeat_minutes?: number;
}

// Real-time Types
export interface RealTimeEvent {
  event_id: number;
  agent_hostname: string;
  event_type: string;
  severity: string;
  timestamp: string;
  description: string;
}

export interface RealTimeAlert {
  alert_id: number;
  title: string;
  severity: string;
  agent_hostname: string;
  timestamp: string;
}

// Form Types
export interface CreateRuleForm {
  rule_name: string;
  rule_type: string;
  rule_condition: string;
  alert_title: string;
  alert_severity: string;
  alert_type: string;
  rule_category?: string;
  alert_description?: string;
  mitre_tactic?: string;
  mitre_technique?: string;
  platform: string;
  priority: number;
  test_mode: boolean;
}

export interface CreateThreatForm {
  threat_name: string;
  threat_type: string;
  threat_value: string;
  severity: string;
  threat_category?: string;
  description?: string;
  mitre_tactic?: string;
  mitre_technique?: string;
  platform: string;
  threat_source?: string;
  confidence: number;
}

// UI Component Types
export interface TableColumn<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
  width?: string;
}

export interface ChartData {
  name: string;
  value: number;
  color?: string;
}

export interface StatusBadgeProps {
  status: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export interface SeverityBadgeProps {
  severity: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
} 