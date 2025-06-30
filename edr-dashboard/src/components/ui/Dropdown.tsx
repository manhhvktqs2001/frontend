import React, { useState } from 'react';

type DropdownProps = {
  label: React.ReactNode;
  children: React.ReactNode;
};

export const Dropdown: React.FC<DropdownProps> = ({ label, children }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative inline-block text-left">
      <button onClick={() => setOpen((v) => !v)} className="btn btn-outline">
        {label}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-gray-900 border border-gray-700 rounded-lg shadow-lg z-10">
          {children}
        </div>
      )}
    </div>
  );
}; 