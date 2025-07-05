import React from 'react';
import { useToast } from '../../contexts/ToastContext';
import { ToastContainer as ToastNotificationContainer } from './ToastNotification';

const ToastContainer = ({ position = 'top-right', maxToasts = 5 }) => {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container fixed top-16 right-6 z-50 flex flex-col items-end gap-2">
      <ToastNotificationContainer
        toasts={toasts}
        onRemoveToast={removeToast}
        position={position}
        maxToasts={maxToasts}
      />
    </div>
  );
};

export default ToastContainer;