// components/ui/Badge.jsx
// Modern Badge component with multiple variants

import React from 'react';
import { clsx } from 'clsx';

const Badge = React.forwardRef(({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  ...props
}, ref) => {
  const baseClasses = 'inline-flex items-center font-medium rounded-full transition-all duration-200';
  
  const variants = {
    default: 'bg-white/10 text-white border border-white/20',
    primary: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
    success: 'bg-green-500/20 text-green-400 border border-green-500/30',
    warning: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
    danger: 'bg-red-500/20 text-red-400 border border-red-500/30',
    info: 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30',
    purple: 'bg-purple-500/20 text-purple-400 border border-purple-500/30',
    gray: 'bg-gray-500/20 text-gray-400 border border-gray-500/30',
    glass: 'bg-white/10 backdrop-blur-xl text-white border border-white/20',
  };
  
  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm',
    xl: 'px-4 py-2 text-sm',
  };

  return (
    <span
      ref={ref}
      className={clsx(
        baseClasses,
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
});

// Status Badge variants
const StatusBadge = React.forwardRef(({
  status,
  children,
  className = '',
  ...props
}, ref) => {
  const statusVariants = {
    active: 'bg-green-500/20 text-green-400 border-green-500/30',
    inactive: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    error: 'bg-red-500/20 text-red-400 border-red-500/30',
    warning: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    updating: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    offline: 'bg-red-500/20 text-red-400 border-red-500/30',
    online: 'bg-green-500/20 text-green-400 border-green-500/30',
    pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    resolved: 'bg-green-500/20 text-green-400 border-green-500/30',
    investigating: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    open: 'bg-red-500/20 text-red-400 border-red-500/30',
    closed: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    excellent: 'bg-green-500/20 text-green-400 border-green-500/30',
    good: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    fair: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    poor: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    critical: 'bg-red-500/20 text-red-400 border-red-500/30',
    healthy: 'bg-green-500/20 text-green-400 border-green-500/30',
    unhealthy: 'bg-red-500/20 text-red-400 border-red-500/30',
  };

  const statusText = children || status;

  return (
    <Badge
      ref={ref}
      variant="default"
      className={clsx(
        statusVariants[status?.toLowerCase()] || statusVariants.inactive,
        className
      )}
      {...props}
    >
      {statusText}
    </Badge>
  );
});

// Severity Badge variants
const SeverityBadge = React.forwardRef(({
  severity,
  children,
  className = '',
  ...props
}, ref) => {
  const severityVariants = {
    critical: 'bg-red-500/20 text-red-400 border-red-500/30',
    high: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    low: 'bg-green-500/20 text-green-400 border-green-500/30',
    info: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  };

  const severityText = children || severity;

  return (
    <Badge
      ref={ref}
      variant="default"
      className={clsx(
        severityVariants[severity?.toLowerCase()] || severityVariants.info,
        className
      )}
      {...props}
    >
      {severityText}
    </Badge>
  );
});

// Threat Level Badge variants
const ThreatBadge = React.forwardRef(({
  level,
  children,
  className = '',
  ...props
}, ref) => {
  const threatVariants = {
    malicious: 'bg-red-500/20 text-red-400 border-red-500/30',
    suspicious: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    none: 'bg-green-500/20 text-green-400 border-green-500/30',
    unknown: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  };

  const threatText = children || level;

  return (
    <Badge
      ref={ref}
      variant="default"
      className={clsx(
        threatVariants[level?.toLowerCase()] || threatVariants.unknown,
        className
      )}
      {...props}
    >
      {threatText}
    </Badge>
  );
});

Badge.Status = StatusBadge;
Badge.Severity = SeverityBadge;
Badge.Threat = ThreatBadge;

Badge.displayName = 'Badge';

export default Badge; 