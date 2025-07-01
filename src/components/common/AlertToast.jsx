import React, { useState, useEffect } from 'react';
import {
  ExclamationTriangleIcon,
  CheckCircleIcon,
  InformationCircleIcon,
  XMarkIcon,
  FireIcon,
  ShieldExclamationIcon,
  BoltIcon,
  EyeIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

const AlertToast = ({
  alert,
  onClose,
  onAction,
  autoClose = true,
  autoCloseDelay = 5000,
  position = 'top-right'
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Animate in
    setTimeout(() => setIsVisible(true), 100);

    // Auto close
    if (autoClose) {
      const timer = setTimeout(() => {
        handleClose();
      }, autoCloseDelay);

      return () => clearTimeout(timer);
    }
  }, [autoClose, autoCloseDelay]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose?.();
    }, 300);
  };

  const getAlertStyle = (severity) => {
    const styles = {
      critical: {
        bg: 'bg-gradient-to-r from-red-500 to-red-600',
        border: 'border-red-200',
        icon: FireIcon,
        iconBg: 'bg-red-100',
        iconColor: 'text-red-600',
        textColor: 'text-red-800',
        buttonBg: 'bg-red-600 hover:bg-red-700',
        shadowColor: 'shadow-red-500/20'
      },
      high: {
        bg: 'bg-gradient-to-r from-orange-500 to-orange-600',
        border: 'border-orange-200',
        icon: ExclamationTriangleIcon,
        iconBg: 'bg-orange-100',
        iconColor: 'text-orange-600',
        textColor: 'text-orange-800',
        buttonBg: 'bg-orange-600 hover:bg-orange-700',
        shadowColor: 'shadow-orange-500/20'
      },
      medium: {
        bg: 'bg-gradient-to-r from-yellow-500 to-yellow-600',
        border: 'border-yellow-200',
        icon: ShieldExclamationIcon,
        iconBg: 'bg-yellow-100',
        iconColor: 'text-yellow-600',
        textColor: 'text-yellow-800',
        buttonBg: 'bg-yellow-600 hover:bg-yellow-700',
        shadowColor: 'shadow-yellow-500/20'
      },
      low: {
        bg: 'bg-gradient-to-r from-blue-500 to-blue-600',
        border: 'border-blue-200',
        icon: InformationCircleIcon,
        iconBg: 'bg-blue-100',
        iconColor: 'text-blue-600',
        textColor: 'text-blue-800',
        buttonBg: 'bg-blue-600 hover:bg-blue-700',
        shadowColor: 'shadow-blue-500/20'
      },
      success: {
        bg: 'bg-gradient-to-r from-green-500 to-green-600',
        border: 'border-green-200',
        icon: CheckCircleIcon,
        iconBg: 'bg-green-100',
        iconColor: 'text-green-600',
        textColor: 'text-green-800',
        buttonBg: 'bg-green-600 hover:bg-green-700',
        shadowColor: 'shadow-green-500/20'
      }
    };

    return styles[severity?.toLowerCase()] || styles.medium;
  };

  const getPositionClasses = () => {
    const positions = {
      'top-right': 'top-4 right-4',
      'top-left': 'top-4 left-4',
      'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
      'bottom-right': 'bottom-4 right-4',
      'bottom-left': 'bottom-4 left-4',
      'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2'
    };
    return positions[position] || positions['top-right'];
  };

  const style = getAlertStyle(alert.severity);
  const AlertIcon = style.icon;

  const getTimeAgo = (timestamp) => {
    if (!timestamp) return 'Now';
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  return (
    <div
      className={`
        fixed z-50 max-w-md w-full pointer-events-auto
        ${getPositionClasses()}
        transform transition-all duration-300 ease-out
        ${isVisible && !isExiting 
          ? 'translate-y-0 opacity-100 scale-100' 
          : 'translate-y-2 opacity-0 scale-95'
        }
      `}
    >
      <div className={`
        bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl border ${style.border} ${style.shadowColor}
        relative overflow-hidden
      `}>
        {/* Severity Bar */}
        <div className={`h-1 ${style.bg}`}></div>

        {/* Alert Content */}
        <div className="p-4">
          <div className="flex items-start space-x-3">
            {/* Icon */}
            <div className={`flex-shrink-0 p-2 rounded-xl ${style.iconBg}`}>
              <AlertIcon className={`w-6 h-6 ${style.iconColor}`} />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {/* Title */}
                  <h3 className="text-sm font-bold text-gray-900 mb-1">
                    {alert.title || 'Security Alert'}
                  </h3>

                  {/* Message */}
                  <p className="text-sm text-gray-700 mb-2 line-clamp-2">
                    {alert.message || alert.description}
                  </p>

                  {/* Metadata */}
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    {alert.agent_id && (
                      <div className="flex items-center space-x-1">
                        <BoltIcon className="w-3 h-3" />
                        <span>Agent: {alert.agent_id}</span>
                      </div>
                    )}
                    {alert.timestamp && (
                      <div className="flex items-center space-x-1">
                        <ClockIcon className="w-3 h-3" />
                        <span>{getTimeAgo(alert.timestamp)}</span>
                      </div>
                    )}
                    {alert.severity && (
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${style.iconBg} ${style.textColor}`}>
                        {alert.severity.toUpperCase()}
                      </span>
                    )}
                  </div>
                </div>

                {/* Close Button */}
                <button
                  onClick={handleClose}
                  className="flex-shrink-0 p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors ml-2"
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
              </div>

              {/* Actions */}
              {(alert.actions || onAction) && (
                <div className="flex items-center space-x-2 mt-3">
                  {alert.actions?.map((action, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        action.onClick?.(alert);
                        onAction?.(action.type, alert);
                      }}
                      className={`px-3 py-1.5 text-xs font-medium text-white rounded-lg ${style.buttonBg} transition-colors`}
                    >
                      {action.label}
                    </button>
                  )) || (
                    <button
                      onClick={() => onAction?.('investigate', alert)}
                      className={`flex items-center space-x-1 px-3 py-1.5 text-xs font-medium text-white rounded-lg ${style.buttonBg} transition-colors`}
                    >
                      <EyeIcon className="w-3 h-3" />
                      <span>Investigate</span>
                    </button>
                  )}
                  
                  <button
                    onClick={() => onAction?.('dismiss', alert)}
                    className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    Dismiss
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Progress Bar for Auto Close */}
        {autoClose && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200">
            <div 
              className={`h-full ${style.bg} transition-all ease-linear`}
              style={{
                animation: `shrink ${autoCloseDelay}ms linear forwards`
              }}
            />
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
};

// Alert Toast Container Component
export const AlertToastContainer = ({ alerts = [], onRemoveAlert, onActionAlert }) => {
  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {alerts.map((alert, index) => (
        <div
          key={alert.id || index}
          style={{
            transform: `translateY(${index * 70}px)`
          }}
        >
          <AlertToast
            alert={alert}
            onClose={() => onRemoveAlert?.(alert.id || index)}
            onAction={(action, alertData) => onActionAlert?.(action, alertData)}
          />
        </div>
      ))}
    </div>
  );
};

// Hook for managing alerts
export const useAlertToasts = () => {
  const [alerts, setAlerts] = useState([]);

  const addAlert = (alert) => {
    const newAlert = {
      id: Date.now() + Math.random(),
      timestamp: new Date().toISOString(),
      ...alert
    };
    
    setAlerts(prev => [...prev, newAlert]);
    
    return newAlert.id;
  };

  const removeAlert = (alertId) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  const clearAlerts = () => {
    setAlerts([]);
  };

  const addCriticalAlert = (title, message, options = {}) => {
    return addAlert({
      title,
      message,
      severity: 'critical',
      ...options
    });
  };

  const addSuccessAlert = (title, message, options = {}) => {
    return addAlert({
      title,
      message,
      severity: 'success',
      ...options
    });
  };

  const addWarningAlert = (title, message, options = {}) => {
    return addAlert({
      title,
      message,
      severity: 'medium',
      ...options
    });
  };

  const addInfoAlert = (title, message, options = {}) => {
    return addAlert({
      title,
      message,
      severity: 'low',
      ...options
    });
  };

  return {
    alerts,
    addAlert,
    removeAlert,
    clearAlerts,
    addCriticalAlert,
    addSuccessAlert,
    addWarningAlert,
    addInfoAlert
  };
};

// Example usage component
export const AlertDemo = () => {
  const { 
    alerts, 
    addCriticalAlert, 
    addSuccessAlert, 
    addWarningAlert, 
    addInfoAlert,
    removeAlert 
  } = useAlertToasts();

  const handleAction = (action, alert) => {
    console.log(`Action "${action}" on alert:`, alert);
    if (action === 'dismiss') {
      removeAlert(alert.id);
    }
  };

  return (
    <div className="p-8 space-y-4">
      <h2 className="text-2xl font-bold mb-4">Alert Toast Demo</h2>
      
      <div className="space-x-4">
        <button
          onClick={() => addCriticalAlert(
            'Critical Security Alert',
            'Malware detected on WIN-SRV-001. Immediate action required.',
            { agent_id: 'WIN-SRV-001' }
          )}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Add Critical Alert
        </button>
        
        <button
          onClick={() => addWarningAlert(
            'Agent Offline',
            '3 endpoints have gone offline in the last 10 minutes.',
            { agent_id: 'Multiple' }
          )}
          className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
        >
          Add Warning Alert
        </button>
        
        <button
          onClick={() => addSuccessAlert(
            'Threat Mitigated',
            'Successfully blocked malicious domain access attempt.',
            { agent_id: 'WIN-WS-045' }
          )}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          Add Success Alert
        </button>
        
        <button
          onClick={() => addInfoAlert(
            'System Update',
            'EDR System v2.4.1 is now available for download.',
            {}
          )}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Add Info Alert
        </button>
      </div>

      <AlertToastContainer
        alerts={alerts}
        onRemoveAlert={removeAlert}
        onActionAlert={handleAction}
      />
    </div>
  );
};

export default AlertToast;