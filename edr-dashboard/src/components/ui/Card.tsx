import React from 'react';

type CardProps = {
  header?: React.ReactNode;
  body?: React.ReactNode;
  footer?: React.ReactNode;
  children?: React.ReactNode;
};

export const Card: React.FC<CardProps> = ({ header, body, footer, children }) => (
  <div className="card">
    {header && <div className="card-header">{header}</div>}
    {body && <div className="card-body">{body}</div>}
    {children}
    {footer && <div className="card-footer">{footer}</div>}
  </div>
); 