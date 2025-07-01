// File: src/utils/statusUtils.js
// Centralized status management utilities

// Agent Status Constants
export const AGENT_STATUS = {
  ACTIVE: 'Active',
  INACTIVE: 'Inactive',
  ERROR: 'Error',
  UPDATING: 'Updating',
  OFFLINE: 'Offline'
};

// Alert Status Constants
export const ALERT_STATUS = {
  OPEN: 'Open',
  INVESTIGATING: 'Investigating',
  RESOLVED: 'Resolved',
  FALSE_POSITIVE: 'False Positive',
  SUPPRESSED: 'Suppressed',
  CLOSED: 'Closed'
};

// Severity Levels
export const SEVERITY_LEVELS = {
  CRITICAL: 'Critical',
  HIGH: 'High',
  MEDIUM: 'Medium',
  LOW: 'Low',
  INFO: 'Info'
};

// System Health Status
export const HEALTH_STATUS = {
  EXCELLENT: 'Excellent',
  GOOD: 'Good',
  FAIR: 'Fair',
  WARNING: 'Warning',
  CRITICAL: 'Critical',
  ERROR: 'Error'
};

// Connection Status
export const CONNECTION_STATUS = {
  ONLINE: 'Online',
  OFFLINE: 'Offline',
  DEGRADED: 'Degraded'
};

// Performance Status
export const PERFORMANCE_STATUS = {
  GOOD: 'Good',
  DEGRADED: 'Degraded',
  POOR: 'Poor'
};

// Status Color Mapping
export const getStatusColor = (status, type = 'status') => {
  const statusLower = status?.toLowerCase();
  
  switch (type) {
    case 'severity':
      switch (statusLower) {
        case 'critical': return 'text-red-400 bg-red-500/20 border-red-500/30';
        case 'high': return 'text-orange-400 bg-orange-500/20 border-orange-500/30';
        case 'medium': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
        case 'low': return 'text-green-400 bg-green-500/20 border-green-500/30';
        case 'info': return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
        default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
      }
    
    case 'health':
      switch (statusLower) {
        case 'excellent': return 'text-green-400 bg-green-500/20 border-green-500/30';
        case 'good': return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
        case 'fair': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
        case 'warning': return 'text-orange-400 bg-orange-500/20 border-orange-500/30';
        case 'critical': return 'text-red-400 bg-red-500/20 border-red-500/30';
        case 'error': return 'text-red-400 bg-red-500/20 border-red-500/30';
        default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
      }
    
    case 'connection':
      switch (statusLower) {
        case 'online': return 'text-green-400 bg-green-500/20 border-green-500/30';
        case 'offline': return 'text-red-400 bg-red-500/20 border-red-500/30';
        case 'degraded': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
        default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
      }
    
    case 'performance':
      switch (statusLower) {
        case 'good': return 'text-green-400 bg-green-500/20 border-green-500/30';
        case 'degraded': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
        case 'poor': return 'text-red-400 bg-red-500/20 border-red-500/30';
        default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
      }
    
    default: // General status
      switch (statusLower) {
        case 'active': return 'text-green-400 bg-green-500/20 border-green-500/30';
        case 'inactive': return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
        case 'error': return 'text-red-400 bg-red-500/20 border-red-500/30';
        case 'warning': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
        case 'updating': return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
        case 'offline': return 'text-red-400 bg-red-500/20 border-red-500/30';
        case 'online': return 'text-green-400 bg-green-500/20 border-green-500/30';
        case 'pending': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
        case 'resolved': return 'text-green-400 bg-green-500/20 border-green-500/30';
        case 'investigating': return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
        case 'open': return 'text-red-400 bg-red-500/20 border-red-500/30';
        case 'closed': return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
        case 'excellent': return 'text-green-400 bg-green-500/20 border-green-500/30';
        case 'good': return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
        case 'fair': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
        case 'poor': return 'text-orange-400 bg-orange-500/20 border-orange-500/30';
        case 'critical': return 'text-red-400 bg-red-500/20 border-red-500/30';
        case 'healthy': return 'text-green-400 bg-green-500/20 border-green-500/30';
        case 'unhealthy': return 'text-red-400 bg-red-500/20 border-red-500/30';
        default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
      }
  }
};

// Status Icon Mapping
export const getStatusIcon = (status, type = 'status') => {
  const statusLower = status?.toLowerCase();
  
  switch (type) {
    case 'severity':
      switch (statusLower) {
        case 'critical': return '🔴';
        case 'high': return '🟠';
        case 'medium': return '🟡';
        case 'low': return '🟢';
        case 'info': return '🔵';
        default: return '⚪';
      }
    
    case 'health':
      switch (statusLower) {
        case 'excellent': return '🟢';
        case 'good': return '🔵';
        case 'fair': return '🟡';
        case 'warning': return '🟠';
        case 'critical': return '🔴';
        case 'error': return '🔴';
        default: return '⚪';
      }
    
    default:
      switch (statusLower) {
        case 'active': return '🟢';
        case 'inactive': return '⚪';
        case 'error': return '🔴';
        case 'warning': return '🟡';
        case 'offline': return '🔴';
        case 'online': return '🟢';
        case 'open': return '🔴';
        case 'resolved': return '🟢';
        case 'critical': return '🔴';
        case 'healthy': return '🟢';
        case 'unhealthy': return '🔴';
        default: return '⚪';
      }
  }
};

// Status Priority (for sorting)
export const getStatusPriority = (status) => {
  const statusLower = status?.toLowerCase();
  
  const priorityMap = {
    'critical': 1,
    'error': 2,
    'high': 3,
    'warning': 4,
    'medium': 5,
    'low': 6,
    'info': 7,
    'resolved': 8,
    'closed': 9,
    'inactive': 10
  };
  
  return priorityMap[statusLower] || 999;
};

// Validate Status
export const isValidStatus = (status, type = 'general') => {
  const validStatuses = {
    agent: Object.values(AGENT_STATUS),
    alert: Object.values(ALERT_STATUS),
    severity: Object.values(SEVERITY_LEVELS),
    health: Object.values(HEALTH_STATUS),
    connection: Object.values(CONNECTION_STATUS),
    performance: Object.values(PERFORMANCE_STATUS),
    general: [...Object.values(AGENT_STATUS), ...Object.values(ALERT_STATUS), ...Object.values(HEALTH_STATUS)]
  };
  
  return validStatuses[type]?.includes(status) || false;
};

// Format Status for Display
export const formatStatus = (status) => {
  if (!status) return 'Unknown';
  
  // Capitalize first letter and handle camelCase
  return status
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim();
};

// Get Status Description
export const getStatusDescription = (status, type = 'status') => {
  const statusLower = status?.toLowerCase();
  
  const descriptions = {
    status: {
      'active': 'System is operational and responding',
      'inactive': 'System is not currently active',
      'error': 'System encountered an error',
      'warning': 'System has potential issues',
      'offline': 'System is not connected',
      'online': 'System is connected and available',
      'open': 'Issue requires attention',
      'resolved': 'Issue has been resolved',
      'critical': 'Immediate attention required'
    },
    severity: {
      'critical': 'Highest priority - immediate action required',
      'high': 'High priority - action needed soon',
      'medium': 'Medium priority - monitor closely',
      'low': 'Low priority - routine attention',
      'info': 'Informational - no action required'
    },
    health: {
      'excellent': 'System is performing optimally',
      'good': 'System is performing well',
      'fair': 'System has minor issues',
      'warning': 'System has concerning issues',
      'critical': 'System has critical issues',
      'error': 'System is experiencing errors'
    }
  };
  
  return descriptions[type]?.[statusLower] || 'Status information not available';
}; 