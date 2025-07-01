import React from "react";

export function Card({ children, className = "" }) {
  return (
    <div className={`border rounded-lg shadow-md p-4 transition-colors duration-300 bg-white text-gray-900 border-gray-200 dark:bg-slate-800 dark:text-white dark:border-slate-700 ${className}`}>
      {children}
    </div>
  );
} 