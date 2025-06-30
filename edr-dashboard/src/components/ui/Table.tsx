import React from 'react';

export const Table: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="overflow-x-auto">
    <table className="table bg-gray-900 w-full rounded-lg">
      {children}
    </table>
  </div>
); 