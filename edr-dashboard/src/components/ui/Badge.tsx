import React from 'react';

type BadgeProps = {
  color?: string;
  children: React.ReactNode;
};

export const Badge: React.FC<BadgeProps> = ({ color = 'bg-primary-500', children }) => (
  <span className={`badge ${color}`}>{children}</span>
); 