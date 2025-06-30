import React from 'react';
import { cn } from '../../utils/cn';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
};

const variantClasses = {
  primary: 'btn btn-primary',
  ghost: 'btn btn-ghost',
  outline: 'btn btn-outline',
};

const sizeClasses = {
  sm: 'btn-sm',
  md: 'btn-md',
  lg: 'btn-lg',
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  className,
  ...props
}) => (
  <button
    className={cn('btn', variantClasses[variant], sizeClasses[size], className)}
    {...props}
  />
); 