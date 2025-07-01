import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = ({ systemStatus }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const location = useLocation();

  useEffect(() => {
    // Simulate connection status
    const interval = setInterval(() => {
      setIsOnline(Math.random() > 0.1); // 90% uptime simulation
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-900 via-blue-900/10 to-gray-900 overflow-hidden">
      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)}
        currentPath={location.pathname}
        systemStatus={systemStatus}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header 
          onMenuClick={() => setSidebarOpen(true)}
          systemStatus={systemStatus}
          isOnline={isOnline}
        />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-gradient-to-br from-gray-900/50 via-blue-900/5 to-gray-900/50">
          <div className="p-6">
            <Outlet />
          </div>
        </main>

        {/* Status Bar */}
        <div className="bg-gray-800/50 border-t border-white/10 px-6 py-2">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-400' : 'bg-red-400'}`}></div>
                <span>{isOnline ? 'Connected' : 'Disconnected'}</span>
              </div>
              <span>•</span>
              <span>v{systemStatus.version}</span>
              <span>•</span>
              <span>Build {systemStatus.build}</span>
            </div>
            <div className="flex items-center gap-4">
              <span>Last sync: {systemStatus.lastSync.toLocaleTimeString()}</span>
              <span>•</span>
              <span>EDR Security Platform v3.0.0</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Layout;