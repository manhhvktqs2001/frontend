import React, { useState, useEffect } from 'react';
import {
  ShieldCheckIcon,
  BellIcon,
  MagnifyingGlassIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  SunIcon,
  MoonIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  InformationCircleIcon,
  ChevronDownIcon,
  GlobeAltIcon,
  ComputerDesktopIcon,
  FireIcon,
  XCircleIcon,
  ClockIcon,
  UserIcon,
  KeyIcon,
  WrenchScrewdriverIcon,
  SparklesIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import { fetchDashboardStats, fetchAlerts, fetchAgents } from '../../service/api';
import { useTheme } from '../../contexts/ThemeContext';
import { useToast } from '../../contexts/ToastContext';

// Enhanced Theme Toggle Component with beautiful animations
const ThemeToggle = ({ className = "" }) => {
  const { isDarkMode, toggleTheme, isTransitioning } = useTheme();
  const [isAnimating, setIsAnimating] = useState(false);
  const [rippleEffect, setRippleEffect] = useState(false);

  const handleToggle = () => {
    if (isAnimating || isTransitioning) return;
    
    setIsAnimating(true);
    setRippleEffect(true);
    
    // Add visual feedback
    const button = document.getElementById('theme-toggle-btn');
    if (button) {
      button.style.transform = 'scale(0.95)';
      setTimeout(() => {
        button.style.transform = 'scale(1)';
      }, 150);
    }
    
    toggleTheme();
    
    // Reset animation states
    setTimeout(() => {
      setIsAnimating(false);
      setRippleEffect(false);
    }, 600);
  };

  return (
    <div className={`relative ${className}`}>
      {/* Theme Status Indicator */}
      {isTransitioning && (
        <div className={`
          absolute -top-12 left-1/2 transform -translate-x-1/2 
          px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 z-50
          ${isDarkMode 
            ? 'bg-indigo-900/90 text-indigo-200 border border-indigo-700/50' 
            : 'bg-orange-100/90 text-orange-700 border border-orange-200/50'
          }
          backdrop-blur-sm shadow-lg animate-pulse
        `}>
          <div className="flex items-center gap-2">
            <SparklesIcon className="w-3 h-3 animate-spin" />
            <span>Switching to {isDarkMode ? 'Light' : 'Dark'} Mode</span>
          </div>
        </div>
      )}

      {/* Main Toggle Button */}
      <button
        id="theme-toggle-btn"
        onClick={handleToggle}
        disabled={isAnimating || isTransitioning}
        className={`
          relative w-20 h-10 rounded-full transition-all duration-300 ease-in-out
          focus:outline-none focus:ring-4 focus:ring-offset-2 
          ${isDarkMode 
            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg shadow-indigo-500/25 focus:ring-indigo-500/50' 
            : 'bg-gradient-to-r from-amber-400 to-orange-500 shadow-lg shadow-amber-500/25 focus:ring-orange-500/50'
          }
          hover:scale-105 active:scale-95 transform
          ${(isAnimating || isTransitioning) ? 'pointer-events-none' : ''}
          overflow-hidden
        `}
        aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
        title={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
      >
        {/* Ripple Effect */}
        {rippleEffect && (
          <div className={`
            absolute inset-0 rounded-full animate-ping
            ${isDarkMode 
              ? 'bg-gradient-to-r from-indigo-400 to-purple-400' 
              : 'bg-gradient-to-r from-amber-300 to-orange-400'
            }
          `} />
        )}
        
        {/* Track highlight */}
        <div 
          className={`
            absolute inset-0.5 rounded-full transition-all duration-300
            ${isDarkMode 
              ? 'bg-gradient-to-r from-slate-800/30 to-slate-900/30' 
              : 'bg-gradient-to-r from-sky-200/30 to-blue-300/30'
            }
          `}
        />
        
        {/* Sliding circle */}
        <div
          className={`
            absolute top-1 w-8 h-8 rounded-full transition-all duration-300 ease-in-out
            transform shadow-xl backdrop-blur-sm z-10
            ${isDarkMode 
              ? 'translate-x-11 bg-gradient-to-br from-slate-100 to-white shadow-slate-900/40' 
              : 'translate-x-1 bg-gradient-to-br from-white to-yellow-50 shadow-orange-900/40'
            }
            ${(isAnimating || isTransitioning) ? 'scale-110' : 'hover:scale-105'}
            flex items-center justify-center border-2 border-white/20
          `}
        >
          {/* Moon Icon */}
          <div 
            className={`
              absolute transition-all duration-500 ease-in-out
              ${isDarkMode ? 'rotate-0 opacity-100 scale-100' : 'rotate-180 opacity-0 scale-75'}
            `}
          >
            <MoonIcon 
              className={`
                w-4 h-4 transition-colors duration-300
                ${isDarkMode ? 'text-slate-700' : 'text-slate-400'}
              `} 
            />
          </div>
          
          {/* Sun Icon */}
          <div 
            className={`
              absolute transition-all duration-500 ease-in-out
              ${!isDarkMode ? 'rotate-0 opacity-100 scale-100' : 'rotate-180 opacity-0 scale-75'}
            `}
          >
            <SunIcon 
              className={`
                w-4 h-4 transition-colors duration-300
                ${!isDarkMode ? 'text-amber-600' : 'text-amber-400'}
              `} 
            />
          </div>
        </div>
        
        {/* Glow effect on hover */}
        <div 
          className={`
            absolute inset-0 rounded-full transition-all duration-300 opacity-0 hover:opacity-30
            ${isDarkMode 
              ? 'bg-gradient-to-r from-indigo-400 to-purple-400' 
              : 'bg-gradient-to-r from-amber-300 to-orange-400'
            }
            blur-sm -z-10
          `}
        />
        
        {/* Status indicator dots */}
        <div className="absolute -top-1 -right-1 flex space-x-0.5">
          <div 
            className={`
              w-1.5 h-1.5 rounded-full transition-all duration-300
              ${isDarkMode ? 'bg-indigo-400 shadow-indigo-400/50 shadow-sm' : 'bg-amber-400 shadow-amber-400/50 shadow-sm'}
              ${(isAnimating || isTransitioning) ? 'animate-pulse' : ''}
            `}
          />
          <div 
            className={`
              w-1.5 h-1.5 rounded-full transition-all duration-300 delay-75
              ${isDarkMode ? 'bg-purple-400 shadow-purple-400/50 shadow-sm' : 'bg-orange-400 shadow-orange-400/50 shadow-sm'}
              ${(isAnimating || isTransitioning) ? 'animate-pulse' : ''}
            `}
          />
        </div>
        
        {/* Loading indicator when transitioning */}
        {(isAnimating || isTransitioning) && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div 
              className={`
                w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin
                ${isDarkMode ? 'text-white' : 'text-slate-700'}
              `}
            />
          </div>
        )}
      </button>
    </div>
  );
};

const Header = ({ user = { name: 'Đức Mạnh', role: 'Security Analyst', avatar: null } }) => {
  const { isDarkMode, isTransitioning } = useTheme();
  const { showAlert, showSuccess } = useToast();
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [systemStats, setSystemStats] = useState({
    agentsOnline: 0,
    agentsOffline: 0,
    criticalAlerts: 0,
    threatLevel: 'Medium',
    systemStatus: 'Online',
    lastUpdate: new Date()
  });

  // Fetch system stats from backend
  useEffect(() => {
    const fetchHeaderStats = async () => {
      try {
        const [stats, alerts, agents] = await Promise.all([
          fetchDashboardStats(),
          fetchAlerts(),
          fetchAgents()
        ]);
        setSystemStats({
          agentsOnline: agents?.agents?.filter(a => a.status === 'online').length || 0,
          agentsOffline: agents?.agents?.filter(a => a.status !== 'online').length || 0,
          criticalAlerts: alerts?.alerts?.filter(a => a.severity === 'critical').length || 0,
          threatLevel: stats?.threat_level || 'Medium',
          systemStatus: stats?.status || 'Online',
          lastUpdate: new Date()
        });
        
        // Show toast cho các alert cảnh báo mới
        const criticalAlerts = alerts?.alerts?.filter(a =>
          ['critical', 'high', 'medium', 'low'].includes((a.severity || '').toLowerCase()) &&
          new Date(a.timestamp || a.alert_timestamp) > new Date(Date.now() - 60000)
        ) || [];
        criticalAlerts.forEach(alert => {
          showAlert(alert);
        });
      } catch (err) {
        // fallback: do not update
      }
    };
    fetchHeaderStats();
    const interval = setInterval(fetchHeaderStats, 30000);
    return () => clearInterval(interval);
  }, [showAlert]);

  // Mock notifications - replace with real API call
  useEffect(() => {
    const mockNotifications = [
      {
        id: 1,
        type: 'critical',
        title: 'Critical Alert Detected',
        message: 'Suspicious process detected on Agent-001',
        time: '2 minutes ago',
        unread: true
      },
      {
        id: 2,
        type: 'warning',
        title: 'Agent Offline',
        message: 'Agent-005 has been offline for 5 minutes',
        time: '5 minutes ago',
        unread: true
      },
      {
        id: 3,
        type: 'info',
        title: 'System Update',
        message: 'New threat intelligence feed updated',
        time: '10 minutes ago',
        unread: false
      },
      {
        id: 4,
        type: 'success',
        title: 'Threat Blocked',
        message: 'Malicious file blocked on Agent-003',
        time: '15 minutes ago',
        unread: false
      }
    ];
    setNotifications(mockNotifications);
  }, []);

  return (
    <header className={`
      sticky top-0 z-40 flex items-center justify-between px-8 py-3 shadow-lg border-b 
      backdrop-blur-xl transition-all duration-300
      ${isDarkMode 
        ? 'bg-gray-900/95 border-gray-700/50 text-white' 
        : 'bg-white/95 border-gray-200/50 text-gray-900'
      }
      ${isTransitioning ? 'theme-transitioning' : ''}
    `}>
      {/* Left Section - Logo & Title */}
      <div className="flex items-center gap-4 min-w-[260px]">
        <div className={`
          p-2 rounded-xl shadow-lg transition-all duration-300
          ${isDarkMode 
            ? 'bg-gradient-to-br from-blue-600 to-indigo-600' 
            : 'bg-gradient-to-br from-blue-500 to-indigo-500'
          }
        `}>
          <ShieldCheckIcon className="w-8 h-8 text-white drop-shadow-lg" />
        </div>
        <div>
          <h1 className={`
            text-2xl font-bold tracking-tight transition-colors duration-300
            ${isDarkMode 
              ? 'bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent' 
              : 'bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent'
            }
          `}>
            EDR Dashboard
          </h1>
          <p className={`
            text-sm mt-0.5 transition-colors duration-300
            ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}
          `}>
            Realtime security monitoring
          </p>
        </div>
      </div>

      {/* Right Section - Controls */}
      <div className="flex items-center gap-4 min-w-[220px] justify-end">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className={`
              relative p-2 rounded-lg transition-all duration-200 hover:scale-105
              ${isDarkMode 
                ? 'text-gray-300 hover:bg-gray-800/50 hover:text-white' 
                : 'text-gray-600 hover:bg-gray-100/50 hover:text-gray-900'
              }
            `}
          >
            <BellIcon className="w-6 h-6" />
            {notifications.filter(n => n.unread).length > 0 && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            )}
          </button>
        </div>

        {/* Theme status indicator */}
        {isTransitioning && (
          <div className={`
            flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium transition-all duration-300
            ${isDarkMode 
              ? 'bg-indigo-900/50 text-indigo-300 border border-indigo-700/50' 
              : 'bg-indigo-100/50 text-indigo-600 border border-indigo-200/50'
            }
          `}>
            <div 
              className={`
                w-2 h-2 rounded-full animate-pulse
                ${isDarkMode ? 'bg-indigo-400' : 'bg-indigo-500'}
              `} 
            />
            <span>Switching theme...</span>
          </div>
        )}
        {/* Theme Toggle */}
        <div className="flex items-center space-x-2">
          <span className={`
            text-sm font-medium transition-colors duration-300 hidden sm:block
            ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}
          `}>
            {isDarkMode ? 'Dark' : 'Light'}
          </span>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default Header;