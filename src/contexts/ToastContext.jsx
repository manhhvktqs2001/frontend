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
    const newToast = { id, duration: 5000, ...toast };
    setToasts((prev) => [...prev, newToast]);
    setTimeout(() => removeToast(id), newToast.duration);
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showSuccess = useCallback((message, options = {}) =>
    addToast({ type: 'success', message, ...options }), [addToast]);
  const showError = useCallback((message, options = {}) =>
    addToast({ type: 'error', message, ...options }), [addToast]);
  const showWarning = useCallback((message, options = {}) =>
    addToast({ type: 'warning', message, ...options }), [addToast]);
  const showInfo = useCallback((message, options = {}) =>
    addToast({ type: 'info', message, ...options }), [addToast]);
  const showAlert = useCallback((alert, options = {}) => {
    const typeMap = {
      critical: 'error',
      high: 'warning',
      medium: 'warning',
      low: 'info'
    };
    return addToast({
      type: typeMap[alert.severity?.toLowerCase()] || 'info',
      title: alert.title || 'Security Alert',
      message: alert.message || alert.description,
      agent: alert.agent_id,
      duration: alert.severity === 'critical' ? 10000 : 5000,
      ...options
    });
  }, [addToast]);

  return (
    <ToastContext.Provider value={{
      toasts, addToast, removeToast,
      showSuccess, showError, showWarning, showInfo, showAlert
    }}>
      {children}
    </ToastContext.Provider>
  );
}; 