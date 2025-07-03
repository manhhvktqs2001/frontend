import React from 'react';
import { useToast } from '../../contexts/ToastContext';
import { ToastContainer as ToastNotificationContainer } from './ToastNotification';

const ToastContainer = ({ position = 'top-right', maxToasts = 5 }) => {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <ToastNotificationContainer
      toasts={toasts}
      onRemoveToast={removeToast}
      position={position}
      maxToasts={maxToasts}
    />
  );
};

export default ToastContainer;