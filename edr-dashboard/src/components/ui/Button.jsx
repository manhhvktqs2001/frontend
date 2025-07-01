// components/ui/Button.jsx
// Modern Button component with glassmorphism design

import React from 'react';
import { clsx } from 'clsx';

const Button = React.forwardRef(({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  loading = false,
  icon: Icon,
  iconPosition = 'left',
  onClick,
  type = 'button',
  ...props
}, ref) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group';
  
  const variants = {
    primary: 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl focus:ring-blue-500',
    secondary: 'bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/20 text-white shadow-lg hover:shadow-xl focus:ring-white/50',
    success: 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg hover:shadow-xl focus:ring-green-500',
    danger: 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg hover:shadow-xl focus:ring-red-500',
    warning: 'bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 text-white shadow-lg hover:shadow-xl focus:ring-yellow-500',
    ghost: 'bg-transparent hover:bg-white/10 text-white hover:text-white focus:ring-white/50',
    outline: 'bg-transparent border-2 border-white/20 hover:bg-white/10 text-white focus:ring-white/50',
    glass: 'bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/20 text-white shadow-lg hover:shadow-xl focus:ring-white/50',
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
    xl: 'px-8 py-4 text-lg',
  };
  
  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-7 h-7',
  };

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={clsx(
        baseClasses,
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {/* Loading spinner */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm rounded-xl">
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      
      {/* Icon */}
      {Icon && iconPosition === 'left' && !loading && (
        <Icon className={clsx(iconSizes[size], 'mr-2')} />
      )}
      
      {/* Content */}
      <span className={clsx(loading && 'opacity-0')}>
        {children}
      </span>
      
      {/* Icon */}
      {Icon && iconPosition === 'right' && !loading && (
        <Icon className={clsx(iconSizes[size], 'ml-2')} />
      )}
      
      {/* Hover effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform -skew-x-12 -translate-x-full group-hover:translate-x-full" />
    </button>
  );
});

Button.displayName = 'Button';

export default Button; 