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
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [progress, setProgress] = useState(100);
  const [isPaused, setIsPaused] = useState(false);
  const timeoutRef = useRef(null);
  const progressRef = useRef(null);
  const startTimeRef = useRef(null);
  const pausedTimeRef = useRef(0);

  const duration = toast.duration || 5000; // 5 giây mặc định, critical alert là 8 giây
  const isAlert = toast.type === 'alert' || toast.severity;

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
          bg: 'bg-gradient-to-r from-red-600 to-red-700',
          border: 'border-red-300',
          icon: FireIcon,
          iconBg: 'bg-red-500',
          iconColor: 'text-white',
          textColor: 'text-white',
          progressColor: 'bg-red-300',
          shadow: 'shadow-red-500/25'
        },
        high: {
          bg: 'bg-gradient-to-r from-orange-500 to-orange-600',
          border: 'border-orange-300',
          icon: ExclamationTriangleIcon,
          iconBg: 'bg-orange-500',
          iconColor: 'text-white',
          textColor: 'text-white',
          progressColor: 'bg-orange-300',
          shadow: 'shadow-orange-500/25'
        },
        medium: {
          bg: 'bg-gradient-to-r from-yellow-500 to-yellow-600',
          border: 'border-yellow-300',
          icon: ShieldExclamationIcon,
          iconBg: 'bg-yellow-500',
          iconColor: 'text-white',
          textColor: 'text-white',
          progressColor: 'bg-yellow-300',
          shadow: 'shadow-yellow-500/25'
        },
        low: {
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

  const style = getToastStyle();
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
      className={`
        max-w-md w-full pointer-events-auto cursor-pointer
        transform transition-all duration-300 ease-out
        ${isVisible && !isExiting 
          ? 'translate-x-0 opacity-100 scale-100' 
          : 'translate-x-full opacity-0 scale-95'
        }
        hover:scale-105
      `}
      style={{
        transform: `translateY(${index * 4}px)`,
        zIndex: 1000 - index
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className={`
        ${style.bg} ${style.shadow} rounded-2xl shadow-2xl border-2 ${style.border}
        relative overflow-hidden backdrop-blur-sm
      `}>
        {/* Toast Content */}
        <div className="p-4">
          <div className="flex items-start space-x-3">
            {/* Icon */}
            <div className={`flex-shrink-0 p-2 rounded-xl ${style.iconBg}`}>
              <IconComponent className={`w-6 h-6 ${style.iconColor}`} />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {/* Title */}
                  <h3 className={`text-sm font-bold ${style.textColor} mb-1`}>
                    {toast.title || (isAlert ? 'Security Alert' : 'Notification')}
                  </h3>

                  {/* Message */}
                  <p className={`text-sm ${style.textColor} mb-2 opacity-90 line-clamp-2`}>
                    {toast.message || toast.description}
                  </p>

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

                {/* Close Button */}
                <button
                  onClick={handleClose}
                  className="flex-shrink-0 p-1 text-white/70 hover:text-white hover:bg-white/20 rounded-lg transition-colors ml-2"
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
              </div>

              {/* Actions for alerts */}
              {isAlert && toast.showActions !== false && (
                <div className="flex items-center space-x-2 mt-3">
                  <button
                    onClick={() => {
                      // Handle investigate action
                      console.log('Investigate alert:', toast);
                      handleClose();
                    }}
                    className="px-3 py-1.5 text-xs font-medium bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                  >
                    Investigate
                  </button>
                  
                  <button
                    onClick={() => {
                      // Handle dismiss action
                      console.log('Dismiss alert:', toast);
                      handleClose();
                    }}
                    className="px-3 py-1.5 text-xs font-medium bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    Dismiss
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20">
          <div 
            className={`h-full ${style.progressColor} transition-all ease-linear`}
            style={{
              width: `${progress}%`,
              transitionDuration: isPaused ? '0ms' : '100ms'
            }}
          />
        </div>

        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </div>
    </div>
  );
};

export default ToastNotification;