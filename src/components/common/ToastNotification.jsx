import React, { useState, useEffect, useRef } from 'react';
import {
  ExclamationTriangleIcon,
  CheckCircleIcon,
  InformationCircleIcon,
  XMarkIcon,
  FireIcon,
  ShieldExclamationIcon,
  BoltIcon,
  ClockIcon,
  XCircleIcon,
  BellIcon
} from '@heroicons/react/24/outline';
import { useTheme } from '../../contexts/ThemeContext';

// Toast Container Component - Hiển thị tất cả toast ở góc màn hình
export const ToastContainer = ({ toasts = [], onRemoveToast, position = 'top-right', maxToasts = 5 }) => {
  const getPositionClasses = () => {
    const positions = {
      'top-right': 'top-6 right-6',
      'top-left': 'top-6 left-6', 
      'top-center': 'top-6 left-1/2 transform -translate-x-1/2',
      'bottom-right': 'bottom-6 right-6',
      'bottom-left': 'bottom-6 left-6',
      'bottom-center': 'bottom-6 left-1/2 transform -translate-x-1/2'
    };
    return positions[position] || positions['top-right'];
  };

  // Giới hạn số lượng toast hiển thị cùng lúc
  const visibleToasts = toasts.slice(0, maxToasts);

  return (
    <div className={`fixed z-50 pointer-events-none ${getPositionClasses()}`}>
      <div className="flex flex-col space-y-3">
        {visibleToasts.map((toast, index) => (
          <ToastNotification
            key={toast.id}
            toast={toast}
            index={index}
            onRemove={onRemoveToast}
          />
        ))}
      </div>
    </div>
  );
};

// Individual Toast Component với animation mượt mà
const ToastNotification = ({ toast, index, onRemove }) => {
  const { isDarkMode } = useTheme();
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [progress, setProgress] = useState(100);
  const [isPaused, setIsPaused] = useState(false);
  const timeoutRef = useRef(null);
  const progressRef = useRef(null);
  const startTimeRef = useRef(null);
  const pausedTimeRef = useRef(0);

  const duration = toast.duration || 3000; // 3 giây mặc định
  const isAlert = toast.type === 'alert' || toast.severity;

  const alertStylesDark = {
    critical: {
      bg: 'bg-gradient-to-r from-red-700 to-red-900',
      border: 'border-4 border-red-500',
      icon: FireIcon,
      iconBg: 'bg-red-600 animate-pulse',
      iconColor: 'text-white',
      textColor: 'text-white',
      progressColor: 'bg-red-400',
      shadow: 'shadow-2xl shadow-red-700/60',
      glow: 'ring-4 ring-red-500/60',
      animate: 'animate-pulse'
    },
    high: {
      bg: 'bg-gradient-to-r from-orange-600 to-orange-800',
      border: 'border-4 border-orange-500',
      icon: ExclamationTriangleIcon,
      iconBg: 'bg-orange-600',
      iconColor: 'text-white',
      textColor: 'text-white',
      progressColor: 'bg-orange-400',
      shadow: 'shadow-2xl shadow-orange-700/50',
      glow: 'ring-2 ring-orange-400/60',
      animate: ''
    },
    medium: {
      bg: 'bg-gradient-to-r from-yellow-600 to-yellow-800',
      border: 'border-4 border-yellow-400',
      icon: ShieldExclamationIcon,
      iconBg: 'bg-yellow-600',
      iconColor: 'text-white',
      textColor: 'text-gray-900',
      progressColor: 'bg-yellow-300',
      shadow: 'shadow-xl shadow-yellow-600/40',
      glow: '',
      animate: ''
    },
    low: {
      bg: 'bg-gradient-to-r from-blue-700 to-blue-900',
      border: 'border-4 border-blue-500',
      icon: InformationCircleIcon,
      iconBg: 'bg-blue-700',
      iconColor: 'text-white',
      textColor: 'text-white',
      progressColor: 'bg-blue-400',
      shadow: 'shadow-lg shadow-blue-700/40',
      glow: '',
      animate: ''
    }
  };
  const alertStylesLight = {
    critical: {
      bg: 'bg-gradient-to-r from-red-200 to-red-400',
      border: 'border-4 border-red-400',
      icon: FireIcon,
      iconBg: 'bg-red-300 animate-pulse',
      iconColor: 'text-red-900',
      textColor: 'text-red-900',
      progressColor: 'bg-red-300',
      shadow: 'shadow-2xl shadow-red-200/60',
      glow: 'ring-4 ring-red-400/40',
      animate: 'animate-pulse'
    },
    high: {
      bg: 'bg-gradient-to-r from-orange-200 to-orange-400',
      border: 'border-4 border-orange-400',
      icon: ExclamationTriangleIcon,
      iconBg: 'bg-orange-200',
      iconColor: 'text-orange-900',
      textColor: 'text-orange-900',
      progressColor: 'bg-orange-200',
      shadow: 'shadow-2xl shadow-orange-200/50',
      glow: 'ring-2 ring-orange-300/40',
      animate: ''
    },
    medium: {
      bg: 'bg-gradient-to-r from-yellow-100 to-yellow-300',
      border: 'border-4 border-yellow-300',
      icon: ShieldExclamationIcon,
      iconBg: 'bg-yellow-200',
      iconColor: 'text-yellow-900',
      textColor: 'text-yellow-900',
      progressColor: 'bg-yellow-200',
      shadow: 'shadow-xl shadow-yellow-200/40',
      glow: '',
      animate: ''
    },
    low: {
      bg: 'bg-gradient-to-r from-blue-100 to-blue-300',
      border: 'border-4 border-blue-300',
      icon: InformationCircleIcon,
      iconBg: 'bg-blue-200',
      iconColor: 'text-blue-900',
      textColor: 'text-blue-900',
      progressColor: 'bg-blue-200',
      shadow: 'shadow-lg shadow-blue-200/40',
      glow: '',
      animate: ''
    }
  };
  const severity = toast.severity?.toLowerCase() || 'medium';
  const style = isDarkMode ? (alertStylesDark[severity] || alertStylesDark.medium)
                          : (alertStylesLight[severity] || alertStylesLight.medium);

  useEffect(() => {
    // Animate in với delay dựa trên index
    setTimeout(() => setIsVisible(true), 50 + index * 100);

    // Khởi tạo thời gian bắt đầu
    startTimeRef.current = Date.now();

    // Bắt đầu progress bar animation
    const updateProgress = () => {
      if (isPaused) {
        progressRef.current = requestAnimationFrame(updateProgress);
        return;
      }

      const currentTime = Date.now();
      const elapsed = currentTime - startTimeRef.current - pausedTimeRef.current;
      const remaining = Math.max(0, ((duration - elapsed) / duration) * 100);
      setProgress(remaining);
      
      if (remaining > 0) {
        progressRef.current = requestAnimationFrame(updateProgress);
      } else {
        handleClose();
      }
    };
    progressRef.current = requestAnimationFrame(updateProgress);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (progressRef.current) cancelAnimationFrame(progressRef.current);
    };
  }, [duration, index, isPaused]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onRemove?.(toast.id);
    }, 300);
  };

  const handleMouseEnter = () => {
    setIsPaused(true);
    pausedTimeRef.current = Date.now() - startTimeRef.current;
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
    startTimeRef.current = Date.now() - pausedTimeRef.current;
  };

  const getToastStyle = () => {
    if (isAlert) {
      const severity = toast.severity?.toLowerCase() || 'medium';
      const alertStyles = {
        critical: {
          bg: 'bg-gradient-to-r from-red-700 to-red-900',
          border: 'border-4 border-red-500',
          icon: FireIcon,
          iconBg: 'bg-red-600',
          iconColor: 'text-white',
          textColor: 'text-white',
          progressColor: 'bg-red-400',
          shadow: 'shadow-lg shadow-red-700/40'
        },
        high: {
          bg: 'bg-gradient-to-r from-orange-600 to-orange-800',
          border: 'border-4 border-orange-500',
          icon: ExclamationTriangleIcon,
          iconBg: 'bg-orange-600',
          iconColor: 'text-white',
          textColor: 'text-white',
          progressColor: 'bg-orange-400',
          shadow: 'shadow-lg shadow-orange-700/40'
        },
        medium: {
          bg: 'bg-gradient-to-r from-yellow-500 to-yellow-700',
          border: 'border-4 border-yellow-400',
          icon: ShieldExclamationIcon,
          iconBg: 'bg-yellow-500',
          iconColor: 'text-white',
          textColor: 'text-gray-900',
          progressColor: 'bg-yellow-300',
          shadow: 'shadow-lg shadow-yellow-600/40'
        },
        low: {
          bg: 'bg-gradient-to-r from-blue-600 to-blue-900',
          border: 'border-4 border-blue-500',
          icon: InformationCircleIcon,
          iconBg: 'bg-blue-600',
          iconColor: 'text-white',
          textColor: 'text-white',
          progressColor: 'bg-blue-400',
          shadow: 'shadow-lg shadow-blue-700/40'
        }
      };
      return alertStyles[severity] || alertStyles.medium;
    }

    const typeStyles = {
      success: {
        bg: 'bg-gradient-to-r from-green-500 to-emerald-600',
        border: 'border-green-300',
        icon: CheckCircleIcon,
        iconBg: 'bg-green-500',
        iconColor: 'text-white',
        textColor: 'text-white',
        progressColor: 'bg-green-300',
        shadow: 'shadow-green-500/25'
      },
      error: {
        bg: 'bg-gradient-to-r from-red-500 to-red-600',
        border: 'border-red-300',
        icon: XCircleIcon,
        iconBg: 'bg-red-500',
        iconColor: 'text-white',
        textColor: 'text-white',
        progressColor: 'bg-red-300',
        shadow: 'shadow-red-500/25'
      },
      warning: {
        bg: 'bg-gradient-to-r from-amber-500 to-orange-500',
        border: 'border-amber-300',
        icon: ExclamationTriangleIcon,
        iconBg: 'bg-amber-500',
        iconColor: 'text-white',
        textColor: 'text-white',
        progressColor: 'bg-amber-300',
        shadow: 'shadow-amber-500/25'
      },
      info: {
        bg: 'bg-gradient-to-r from-blue-500 to-blue-600',
        border: 'border-blue-300',
        icon: InformationCircleIcon,
        iconBg: 'bg-blue-500',
        iconColor: 'text-white',
        textColor: 'text-white',
        progressColor: 'bg-blue-300',
        shadow: 'shadow-blue-500/25'
      }
    };

    return typeStyles[toast.type] || typeStyles.info;
  };

  const IconComponent = style.icon;

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
      className={`rounded-2xl p-4 mb-2 transition-all duration-300 cursor-pointer group 
        ${style.bg} ${style.border} ${style.shadow} ${style.glow} 
        hover:scale-105 hover:z-50`}
      style={{ minWidth: 340, maxWidth: 420, boxShadow: '0 8px 32px 0 rgba(0,0,0,0.18)' }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClose}
      role="alert"
      aria-live="assertive"
    >
      <div className="flex items-start gap-3">
        <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${style.iconBg} ${style.animate} shadow-lg`}>
          <IconComponent className={`w-7 h-7 ${style.iconColor}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className={`font-bold text-lg leading-tight mb-0.5 ${style.textColor}`}>{toast.title}</div>
          <div className={`text-sm mb-1 ${style.textColor}`}>{toast.message}</div>
          {/* Metadata for alerts */}
          {isAlert && (
            <div className="flex items-center space-x-4 text-xs opacity-75">
              {toast.agent && (
                <div className="flex items-center space-x-1">
                  <BoltIcon className="w-3 h-3" />
                  <span>Agent: {toast.agent}</span>
                </div>
              )}
              {toast.timestamp && (
                <div className="flex items-center space-x-1">
                  <ClockIcon className="w-3 h-3" />
                  <span>{getTimeAgo(toast.timestamp)}</span>
                </div>
              )}
              {toast.severity && (
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-white/20">
                  {toast.severity.toUpperCase()}
                </span>
              )}
            </div>
          )}
        </div>
        <button
          className="ml-2 p-1 rounded-full hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
          onClick={handleClose}
          aria-label="Close notification"
        >
          <XMarkIcon className="w-5 h-5 text-white" />
        </button>
      </div>
      {/* Progress bar */}
      <div className={`h-1 mt-3 rounded-full overflow-hidden ${style.progressColor} bg-opacity-40`}>
        <div
          className={`h-full transition-all duration-300 ${style.progressColor}`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default ToastNotification;