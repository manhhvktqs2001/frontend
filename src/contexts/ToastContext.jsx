import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within a ToastProvider');
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((toast) => {
    const id = Date.now() + Math.random();
    const defaultDuration = toast.severity === 'critical' ? 8000 : 5000; // Critical alerts tồn tại lâu hơn
    const newToast = { 
      id, 
      duration: defaultDuration, 
      timestamp: new Date().toISOString(),
      showActions: true,
      ...toast 
    };
    
    setToasts((prev) => [newToast, ...prev]); // Thêm toast mới lên đầu
    
    // Auto remove sau duration
    setTimeout(() => {
      removeToast(id);
    }, newToast.duration);
    
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const clearAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  // Helper functions cho các loại toast khác nhau
  const showSuccess = useCallback((message, options = {}) => {
    return addToast({ 
      type: 'success', 
      message, 
      title: options.title || 'Success',
      duration: options.duration || 3000,
      ...options 
    });
  }, [addToast]);

  const showError = useCallback((message, options = {}) => {
    return addToast({ 
      type: 'error', 
      message, 
      title: options.title || 'Error',
      duration: options.duration || 6000,
      ...options 
    });
  }, [addToast]);

  const showWarning = useCallback((message, options = {}) => {
    return addToast({ 
      type: 'warning', 
      message, 
      title: options.title || 'Warning',
      duration: options.duration || 4000,
      ...options 
    });
  }, [addToast]);

  const showInfo = useCallback((message, options = {}) => {
    return addToast({ 
      type: 'info', 
      message, 
      title: options.title || 'Information',
      duration: options.duration || 4000,
      ...options 
    });
  }, [addToast]);

  // Special function for security alerts
  const showAlert = useCallback((alert, options = {}) => {
    const severityMap = {
      critical: { duration: 8000, type: 'alert' },
      high: { duration: 6000, type: 'alert' },
      medium: { duration: 5000, type: 'alert' },
      low: { duration: 4000, type: 'alert' }
    };
    
    const severityConfig = severityMap[alert.severity?.toLowerCase()] || severityMap.medium;
    
    return addToast({
      type: 'alert',
      severity: alert.severity || 'medium',
      title: alert.title || alert.alert_title || 'Security Alert',
      message: alert.message || alert.description,
      agent: alert.agent_id,
      timestamp: alert.timestamp || alert.first_detected || new Date().toISOString(),
      duration: severityConfig.duration,
      showActions: true,
      ...options
    });
  }, [addToast]);

  // Bulk operations
  const showMultipleAlerts = useCallback((alerts) => {
    alerts.forEach((alert, index) => {
      setTimeout(() => {
        showAlert(alert);
      }, index * 200); // Stagger alerts by 200ms
    });
  }, [showAlert]);

  const value = {
    toasts,
    addToast,
    removeToast,
    clearAllToasts,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showAlert,
    showMultipleAlerts,
    
    // Computed values
    hasToasts: toasts.length > 0,
    toastCount: toasts.length,
    criticalAlerts: toasts.filter(t => t.severity === 'critical').length
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
    </ToastContext.Provider>
  );
};