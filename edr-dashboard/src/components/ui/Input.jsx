// components/ui/Input.jsx
// Modern Input component with glassmorphism design

import React from 'react';
import { clsx } from 'clsx';

const Input = React.forwardRef(({
  className = '',
  variant = 'default',
  size = 'md',
  error = false,
  icon: Icon,
  iconPosition = 'left',
  ...props
}, ref) => {
  const baseClasses = 'w-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    default: 'bg-white/10 backdrop-blur-xl border border-white/20 text-white placeholder-gray-400 focus:border-white/40 focus:ring-blue-500/50',
    glass: 'bg-white/5 backdrop-blur-xl border border-white/10 text-white placeholder-gray-400 focus:border-white/30 focus:ring-white/50',
    dark: 'bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 text-white placeholder-gray-400 focus:border-slate-600 focus:ring-slate-500/50',
    error: 'bg-red-500/10 backdrop-blur-xl border border-red-500/30 text-white placeholder-red-300 focus:border-red-400 focus:ring-red-500/50',
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm rounded-lg',
    md: 'px-4 py-2 text-sm rounded-xl',
    lg: 'px-6 py-3 text-base rounded-xl',
    xl: 'px-8 py-4 text-lg rounded-xl',
  };
  
  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-7 h-7',
  };

  const variantClass = error ? variants.error : variants[variant];

  return (
    <div className="relative">
      {/* Left Icon */}
      {Icon && iconPosition === 'left' && (
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          <Icon className={iconSizes[size]} />
        </div>
      )}
      
      {/* Input */}
      <input
        ref={ref}
        className={clsx(
          baseClasses,
          variantClass,
          sizes[size],
          Icon && iconPosition === 'left' && 'pl-10',
          Icon && iconPosition === 'right' && 'pr-10',
          className
        )}
        {...props}
      />
      
      {/* Right Icon */}
      {Icon && iconPosition === 'right' && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          <Icon className={iconSizes[size]} />
        </div>
      )}
      
      {/* Error indicator */}
      {error && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
        </div>
      )}
    </div>
  );
});

const TextArea = React.forwardRef(({
  className = '',
  variant = 'default',
  size = 'md',
  error = false,
  rows = 3,
  ...props
}, ref) => {
  const baseClasses = 'w-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed resize-none';
  
  const variants = {
    default: 'bg-white/10 backdrop-blur-xl border border-white/20 text-white placeholder-gray-400 focus:border-white/40 focus:ring-blue-500/50',
    glass: 'bg-white/5 backdrop-blur-xl border border-white/10 text-white placeholder-gray-400 focus:border-white/30 focus:ring-white/50',
    dark: 'bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 text-white placeholder-gray-400 focus:border-slate-600 focus:ring-slate-500/50',
    error: 'bg-red-500/10 backdrop-blur-xl border border-red-500/30 text-white placeholder-red-300 focus:border-red-400 focus:ring-red-500/50',
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm rounded-lg',
    md: 'px-4 py-2 text-sm rounded-xl',
    lg: 'px-6 py-3 text-base rounded-xl',
    xl: 'px-8 py-4 text-lg rounded-xl',
  };

  const variantClass = error ? variants.error : variants[variant];

  return (
    <textarea
      ref={ref}
      rows={rows}
      className={clsx(
        baseClasses,
        variantClass,
        sizes[size],
        className
      )}
      {...props}
    />
  );
});

const Select = React.forwardRef(({
  children,
  className = '',
  variant = 'default',
  size = 'md',
  error = false,
  ...props
}, ref) => {
  const baseClasses = 'w-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed appearance-none';
  
  const variants = {
    default: 'bg-white/10 backdrop-blur-xl border border-white/20 text-white focus:border-white/40 focus:ring-blue-500/50',
    glass: 'bg-white/5 backdrop-blur-xl border border-white/10 text-white focus:border-white/30 focus:ring-white/50',
    dark: 'bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 text-white focus:border-slate-600 focus:ring-slate-500/50',
    error: 'bg-red-500/10 backdrop-blur-xl border border-red-500/30 text-white focus:border-red-400 focus:ring-red-500/50',
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm rounded-lg',
    md: 'px-4 py-2 text-sm rounded-xl',
    lg: 'px-6 py-3 text-base rounded-xl',
    xl: 'px-8 py-4 text-lg rounded-xl',
  };

  const variantClass = error ? variants.error : variants[variant];

  return (
    <div className="relative">
      <select
        ref={ref}
        className={clsx(
          baseClasses,
          variantClass,
          sizes[size],
          'pr-10',
          className
        )}
        {...props}
      >
        {children}
      </select>
      
      {/* Custom dropdown arrow */}
      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
});

Input.TextArea = TextArea;
Input.Select = Select;

Input.displayName = 'Input';

export default Input; 