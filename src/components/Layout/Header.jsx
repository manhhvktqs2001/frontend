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
  WrenchScrewdriverIcon
} from '@heroicons/react/24/outline';
import { fetchDashboardStats, fetchAlerts, fetchAgents } from '../../service/api';
import { useTheme } from '../../contexts/ThemeContext';
import { useToast } from '../../contexts/ToastContext';

const Header = ({ user = { name: 'Đức Mạnh', role: 'Security Analyst', avatar: null } }) => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { showAlert, showSuccess } = useToast();
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
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
          showAlert(alert); // Toast sẽ tự động ẩn sau vài giây
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

  // Get notification icon and colors
  const getNotificationStyle = (type) => {
    const styles = {
      critical: {
        icon: ExclamationTriangleIcon,
        bgColor: 'bg-red-900/60',
        textColor: 'text-red-200',
        iconColor: 'text-red-400'
      },
      warning: {
        icon: ExclamationTriangleIcon,
        bgColor: 'bg-orange-900/60',
        textColor: 'text-orange-200',
        iconColor: 'text-orange-400'
      },
      info: {
        icon: InformationCircleIcon,
        bgColor: 'bg-blue-900/60',
        textColor: 'text-blue-200',
        iconColor: 'text-blue-400'
      },
      success: {
        icon: CheckCircleIcon,
        bgColor: 'bg-green-900/60',
        textColor: 'text-green-200',
        iconColor: 'text-green-400'
      }
    };
    return styles[type] || styles.info;
  };

  // Get threat level color
  const getThreatLevelColor = (level) => {
    const colors = {
      'Low': 'text-green-400 bg-green-900/60',
      'Medium': 'text-yellow-400 bg-yellow-900/60',
      'High': 'text-orange-400 bg-orange-900/60',
      'Critical': 'text-red-400 bg-red-900/60'
    };
    return colors[level] || colors.Medium;
  };

  // Mark notification as read
  const markAsRead = (notificationId) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId
          ? { ...notification, unread: false }
          : notification
      )
    );
  };

  // Mark all as read
  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, unread: false }))
    );
  };

  // Get unread count
  const unreadCount = notifications.filter(n => n.unread).length;

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log('Searching for:', searchQuery);
      // Implement search functionality
    }
  };

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between px-6 py-3 bg-white dark:bg-gray-900 shadow">
      <div className="text-2xl font-bold tracking-tight text-gray-800 dark:text-white select-none">
        EDR Dashboard
      </div>
      <div className="flex items-center gap-4">
        <button
          onClick={toggleTheme}
          className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          aria-label="Toggle theme"
        >
          {isDarkMode ? (
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M21 12.79A9 9 0 0 1 12.79 3a1 1 0 0 0-1.13 1.13A7 7 0 1 0 20.87 13.92a1 1 0 0 0 1.13-1.13Z"/></svg>
          ) : (
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5" fill="currentColor"/><path stroke="currentColor" strokeWidth="2" d="M12 1v2m0 18v2m11-11h-2M3 12H1m16.95 7.07-1.41-1.41M6.46 6.46 5.05 5.05m12.02 0-1.41 1.41M6.46 17.54l-1.41 1.41"/></svg>
          )}
        </button>
      </div>
    </header>
  );
};

export default Header;