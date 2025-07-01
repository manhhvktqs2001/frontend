import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Agents from './pages/Agents';
import Alerts from './pages/Alerts';
import Threats from './pages/Threats';
import Events from './pages/Events';
import Analytics from './pages/Analytics';
import AI from './pages/AI';
import Reports from './pages/Reports';
import Rules from './pages/Rules';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';

// EDR v3.0.0 - Enhanced Security Dashboard
const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [systemStatus, setSystemStatus] = useState({
    connected: true,
    lastSync: new Date(),
    version: '3.0.0',
    build: '2024.01.15'
  });

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // Loading screen for EDR v3.0.0
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            {/* Animated Shield Logo */}
            <div className="w-24 h-24 mx-auto mb-6 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl animate-pulse"></div>
              <div className="absolute inset-2 bg-gray-900 rounded-xl flex items-center justify-center">
                <svg className="w-12 h-12 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>
                </svg>
              </div>
            </div>
            
            {/* Loading Text */}
            <h1 className="text-3xl font-bold text-white mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              EDR Security Platform
            </h1>
            <p className="text-gray-400 mb-4">Version 3.0.0 - Advanced Threat Detection</p>
            
            {/* Loading Animation */}
            <div className="flex justify-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
              <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
            
            <p className="text-gray-500 text-sm mt-4">Initializing security modules...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900/20 to-gray-900">
      <Layout systemStatus={systemStatus}>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/agents" element={<Agents />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/threats" element={<Threats />} />
          <Route path="/events" element={<Events />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/ai" element={<AI />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/rules" element={<Rules />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </div>
  );
};

export default App;