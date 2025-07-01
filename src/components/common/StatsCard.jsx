import React from 'react';
import { 
  ArrowTrendingUpIcon, 
  ArrowTrendingDownIcon,
  MinusIcon 
} from '@heroicons/react/24/outline';

const StatsCard = ({
  title,
  value,
  previousValue,
  icon: Icon,
  trend,
  trendValue,
  trendLabel,
  color = 'blue',
  size = 'default',
  loading = false,
  onClick,
  children,
  subtitle,
  badge,
  animated = true
}) => {
  // Color variants
  const colorVariants = {
    blue: {
      bg: 'bg-blue-50',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      textColor: 'text-blue-900',
      accentColor: 'text-blue-600'
    },
    green: {
      bg: 'bg-green-50',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      textColor: 'text-green-900',
      accentColor: 'text-green-600'
    },
    red: {
      bg: 'bg-red-50',
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600',
      textColor: 'text-red-900',
      accentColor: 'text-red-600'
    },
    yellow: {
      bg: 'bg-yellow-50',
      iconBg: 'bg-yellow-100',
      iconColor: 'text-yellow-600',
      textColor: 'text-yellow-900',
      accentColor: 'text-yellow-600'
    },
    purple: {
      bg: 'bg-purple-50',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
      textColor: 'text-purple-900',
      accentColor: 'text-purple-600'
    },
    indigo: {
      bg: 'bg-indigo-50',
      iconBg: 'bg-indigo-100',
      iconColor: 'text-indigo-600',
      textColor: 'text-indigo-900',
      accentColor: 'text-indigo-600'
    },
    pink: {
      bg: 'bg-pink-50',
      iconBg: 'bg-pink-100',
      iconColor: 'text-pink-600',
      textColor: 'text-pink-900',
      accentColor: 'text-pink-600'
    },
    gray: {
      bg: 'bg-gray-50',
      iconBg: 'bg-gray-100',
      iconColor: 'text-gray-600',
      textColor: 'text-gray-900',
      accentColor: 'text-gray-600'
    }
  };

  // Size variants
  const sizeVariants = {
    small: {
      card: 'p-4',
      icon: 'w-6 h-6',
      iconContainer: 'p-2',
      title: 'text-xs',
      value: 'text-xl',
      trend: 'text-xs'
    },
    default: {
      card: 'p-6',
      icon: 'w-8 h-8',
      iconContainer: 'p-3',
      title: 'text-sm',
      value: 'text-3xl',
      trend: 'text-sm'
    },
    large: {
      card: 'p-8',
      icon: 'w-10 h-10',
      iconContainer: 'p-4',
      title: 'text-base',
      value: 'text-4xl',
      trend: 'text-base'
    }
  };

  const colors = colorVariants[color];
  const sizes = sizeVariants[size];

  // Calculate trend
  const calculateTrend = () => {
    if (trend !== undefined) return trend;
    if (previousValue && value) {
      const change = ((value - previousValue) / previousValue) * 100;
      return change;
    }
    return null;
  };

  const trendPercentage = calculateTrend();

  // Get trend icon and color
  const getTrendDisplay = () => {
    if (trendPercentage === null) return null;
    
    if (trendPercentage > 0) {
      return {
        icon: ArrowTrendingUpIcon,
        color: 'text-green-600',
        bg: 'bg-green-100',
        label: `+${Math.abs(trendPercentage).toFixed(1)}%`
      };
    } else if (trendPercentage < 0) {
      return {
        icon: ArrowTrendingDownIcon,
        color: 'text-red-600',
        bg: 'bg-red-100',
        label: `-${Math.abs(trendPercentage).toFixed(1)}%`
      };
    } else {
      return {
        icon: MinusIcon,
        color: 'text-gray-600',
        bg: 'bg-gray-100',
        label: '0%'
      };
    }
  };

  const trendDisplay = getTrendDisplay();

  // Format large numbers
  const formatValue = (val) => {
    if (typeof val !== 'number') return val;
    
    if (val >= 1000000) {
      return (val / 1000000).toFixed(1) + 'M';
    } else if (val >= 1000) {
      return (val / 1000).toFixed(1) + 'K';
    }
    return val.toLocaleString();
  };

  return (
    <div
      className={`
        bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 
        hover:shadow-2xl transition-all duration-300 group relative overflow-hidden
        ${onClick ? 'cursor-pointer' : ''}
        ${sizes.card}
        ${animated ? 'hover:scale-105' : ''}
      `}
      onClick={onClick}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className={`absolute inset-0 ${colors.bg}`}></div>
        <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-gradient-to-br from-white to-transparent -translate-y-16 translate-x-16"></div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center z-10 rounded-2xl">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600"></div>
        </div>
      )}

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            {Icon && (
              <div className={`${sizes.iconContainer} ${colors.iconBg} rounded-xl group-hover:scale-110 transition-transform duration-300`}>
                <Icon className={`${sizes.icon} ${colors.iconColor}`} />
              </div>
            )}
            <div>
              <h3 className={`${sizes.title} font-semibold text-gray-600 uppercase tracking-wide`}>
                {title}
              </h3>
              {subtitle && (
                <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
              )}
            </div>
          </div>
          
          {badge && (
            <div className={`px-2 py-1 text-xs font-medium rounded-full ${colors.bg} ${colors.textColor}`}>
              {badge}
            </div>
          )}
        </div>

        {/* Value */}
        <div className="space-y-2">
          <div className={`${sizes.value} font-bold ${colors.textColor} ${animated ? 'group-hover:scale-110' : ''} transition-transform duration-300`}>
            {loading ? (
              <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
            ) : (
              formatValue(value)
            )}
          </div>

          {/* Trend */}
          {trendDisplay && (
            <div className="flex items-center space-x-2">
              <div className={`flex items-center space-x-1 px-2 py-1 rounded-full ${trendDisplay.bg}`}>
                <trendDisplay.icon className={`w-3 h-3 ${trendDisplay.color}`} />
                <span className={`${sizes.trend} font-medium ${trendDisplay.color}`}>
                  {trendValue || trendDisplay.label}
                </span>
              </div>
              {trendLabel && (
                <span className={`${sizes.trend} text-gray-500`}>
                  {trendLabel}
                </span>
              )}
            </div>
          )}

          {/* Custom Content */}
          {children && (
            <div className="mt-3">
              {children}
            </div>
          )}
        </div>
      </div>

      {/* Hover Effect */}
      {onClick && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-10 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-all duration-700"></div>
      )}
    </div>
  );
};

// Predefined stat card variants
export const CriticalStatsCard = (props) => (
  <StatsCard color="red" {...props} />
);

export const SuccessStatsCard = (props) => (
  <StatsCard color="green" {...props} />
);

export const WarningStatsCard = (props) => (
  <StatsCard color="yellow" {...props} />
);

export const InfoStatsCard = (props) => (
  <StatsCard color="blue" {...props} />
);

export default StatsCard;