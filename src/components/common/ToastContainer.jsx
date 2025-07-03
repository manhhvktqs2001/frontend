import React from 'react';
import { useToast } from '../../contexts/ToastContext';

const typeStyles = {
  success: 'bg-green-500 text-white',
  error: 'bg-red-500 text-white',
  warning: 'bg-yellow-400 text-black',
  info: 'bg-blue-500 text-white',
};

const ToastContainer = () => {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed top-5 right-5 z-50 flex flex-col gap-3">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`min-w-[250px] max-w-xs px-4 py-3 rounded shadow-lg flex items-start gap-2 animate-fade-in-up ${typeStyles[toast.type] || typeStyles.info}`}
        >
          <div className="flex-1">
            {toast.title && <div className="font-bold mb-1">{toast.title}</div>}
            <div>{toast.message}</div>
            {toast.agent && (
              <div className="text-xs mt-1 opacity-80">Agent: {toast.agent}</div>
            )}
          </div>
          <button
            className="ml-2 text-lg font-bold opacity-70 hover:opacity-100"
            onClick={() => removeToast(toast.id)}
            aria-label="Close"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
};

export default ToastContainer; 