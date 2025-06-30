import React from 'react';
import { cn } from '../../utils/cn';

interface StatusBadgeProps {
  status: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const statusConfig = {
  // Agent Statuses
  Active: {
    color: 'bg-success-100 text-success-800 border-success-200',
    icon: '🟢',
  },
  Inactive: {
    color: 'bg-gray-100 text-gray-800 border-gray-200',
    icon: '⚪',
  },
  Error: {
    color: 'bg-danger-100 text-danger-800 border-danger-200',
    icon: '🔴',
  },
  Updating: {
    color: 'bg-warning-100 text-warning-800 border-warning-200',
    icon: '🔄',
  },
  Offline: {
    color: 'bg-secondary-100 text-secondary-800 border-secondary-200',
    icon: '⚫',
  },
  
  // Alert Statuses
  Open: {
    color: 'bg-danger-100 text-danger-800 border-danger-200',
    icon: '🔴',
  },
  Investigating: {
    color: 'bg-warning-100 text-warning-800 border-warning-200',
    icon: '🔍',
  },
  Resolved: {
    color: 'bg-success-100 text-success-800 border-success-200',
    icon: '✅',
  },
  'False Positive': {
    color: 'bg-secondary-100 text-secondary-800 border-secondary-200',
    icon: '❌',
  },
  Suppressed: {
    color: 'bg-secondary-100 text-secondary-800 border-secondary-200',
    icon: '🔇',
  },
  
  // Event Severities
  Info: {
    color: 'bg-primary-100 text-primary-800 border-primary-200',
    icon: 'ℹ️',
  },
  Low: {
    color: 'bg-success-100 text-success-800 border-success-200',
    icon: '🟢',
  },
  Medium: {
    color: 'bg-warning-100 text-warning-800 border-warning-200',
    icon: '🟡',
  },
  High: {
    color: 'bg-danger-100 text-danger-800 border-danger-200',
    icon: '🔴',
  },
  Critical: {
    color: 'bg-critical-100 text-critical-800 border-critical-200',
    icon: '💀',
  },
  
  // Threat Levels
  None: {
    color: 'bg-gray-100 text-gray-800 border-gray-200',
    icon: '⚪',
  },
  Suspicious: {
    color: 'bg-warning-100 text-warning-800 border-warning-200',
    icon: '⚠️',
  },
  Malicious: {
    color: 'bg-danger-100 text-danger-800 border-danger-200',
    icon: '🦠',
  },
};

const sizeConfig = {
  sm: 'px-2 py-1 text-xs',
  md: 'px-3 py-1.5 text-sm',
  lg: 'px-4 py-2 text-base',
};

const variantConfig = {
  default: 'border',
  outline: 'border bg-transparent',
  ghost: 'border-0 bg-transparent',
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  variant = 'default',
  size = 'md',
  className,
}) => {
  const config = statusConfig[status as keyof typeof statusConfig] || {
    color: 'bg-gray-100 text-gray-800 border-gray-200',
    icon: '❓',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-medium transition-colors',
        config.color,
        sizeConfig[size],
        variantConfig[variant],
        className
      )}
    >
      <span className="text-xs">{config.icon}</span>
      {status}
    </span>
  );
}; 