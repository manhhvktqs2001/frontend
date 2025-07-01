import React from 'react';
import { clsx } from 'clsx';

const Card = React.forwardRef(({
  children,
  className = '',
  variant = 'default',
  padding = 'default',
  hover = true,
  ...props
}, ref) => {
  const baseClasses = 'relative overflow-hidden transition-all duration-300';
  
  const variants = {
    default: 'bg-white/10 backdrop-blur-xl border border-white/20',
    elevated: 'bg-white/15 backdrop-blur-xl border border-white/30 shadow-xl',
    glass: 'bg-white/5 backdrop-blur-xl border border-white/10',
    dark: 'bg-slate-900/80 backdrop-blur-xl border border-slate-700/50',
    gradient: 'bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20',
  };
  
  const paddingVariants = {
    none: '',
    sm: 'p-4',
    default: 'p-6',
    lg: 'p-8',
    xl: 'p-10',
  };
  
  const hoverClasses = hover ? 'hover:bg-white/15 hover:border-white/30 hover:shadow-xl hover:scale-[1.02]' : '';

  return (
    <div
      ref={ref}
      className={clsx(
        baseClasses,
        variants[variant],
        paddingVariants[padding],
        hoverClasses,
        'rounded-2xl',
        className
      )}
      {...props}
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
});

const CardHeader = React.forwardRef(({
  children,
  className = '',
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      className={clsx('flex items-center justify-between mb-4', className)}
      {...props}
    >
      {children}
    </div>
  );
});

const CardTitle = React.forwardRef(({
  children,
  className = '',
  ...props
}, ref) => {
  return (
    <h3
      ref={ref}
      className={clsx('text-lg font-semibold text-white', className)}
      {...props}
    >
      {children}
    </h3>
  );
});

const CardDescription = React.forwardRef(({
  children,
  className = '',
  ...props
}, ref) => {
  return (
    <p
      ref={ref}
      className={clsx('text-gray-400 text-sm', className)}
      {...props}
    >
      {children}
    </p>
  );
});

const CardContent = React.forwardRef(({
  children,
  className = '',
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      className={clsx('', className)}
      {...props}
    >
      {children}
    </div>
  );
});

const CardFooter = React.forwardRef(({
  children,
  className = '',
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      className={clsx('flex items-center justify-between pt-4 border-t border-white/10', className)}
      {...props}
    >
      {children}
    </div>
  );
});

Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Description = CardDescription;
Card.Content = CardContent;
Card.Footer = CardFooter;

Card.displayName = 'Card';

export default Card; 