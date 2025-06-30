import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-gray-950 border-b border-gray-800">
      <div className="flex-1">
        <input
          type="text"
          placeholder="Search threats, endpoints, or alerts..."
          className="w-96 px-4 py-2 rounded-lg bg-gray-900 text-gray-100 border border-gray-800 focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />
      </div>
      <div className="flex items-center gap-6">
        <button className="relative text-gray-300 hover:text-cyan-400">
          <span className="text-2xl">🔔</span>
          <span className="absolute -top-1 -right-1 bg-red-500 text-xs rounded-full px-1.5">1</span>
        </button>
        <div className="flex items-center gap-2 bg-gray-800 px-3 py-1.5 rounded-full">
          <span className="bg-cyan-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">SA</span>
          <span className="font-medium text-gray-100">Security Admin</span>
        </div>
      </div>
    </header>
  );
}; 