// File: src/App.jsx
// UPDATED: Added ErrorBoundary and optimized performance

import React, { useState, useEffect, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import ErrorBoundary from './components/ErrorBoundary';

// Lazy load components for better performance
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Agents = React.lazy(() => import('./pages/Agents'));
const Alerts = React.lazy(() => import('./pages/Alerts'));
const Threats = React.lazy(() => import('./pages/Threats'));
const Events = React.lazy(() => import('./pages/Events'));
const Analytics = React.lazy(() => import('./pages/Analytics'));
const AI = React.lazy(() => import('./pages/AI'));
const Reports = React.lazy(() => import('./pages/Reports'));
const Rules = React.lazy(() => import('./pages/Rules'));
const Settings = React.lazy(() => import('./pages/Settings'));
const NotFound = React.lazy(() => import('./pages/NotFound'));

// Loading component
const LoadingSpinner = ({ message = "Loading..." }) => (
  <div className="flex items-center justify-center h-64">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
      <div className="text-gray-400">{message}</div>
    </div>
  </div>
);

// Enhanced Loading Screen
const EDRLoadingScreen = () => (
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
    // Simulate initial loading with realistic timing
    const timer = setTimeout(() => {
      setIsLoading(false);
      console.log('🚀 EDR Security Platform v3.0.0 initialized');
    }, 2000); // Slightly longer for better UX

    // Update system status periodically
    const statusInterval = setInterval(() => {
      setSystemStatus(prev => ({
        ...prev,
        lastSync: new Date(),
        connected: navigator.onLine
      }));
    }, 30000); // Update every 30 seconds

    return () => {
      clearTimeout(timer);
      clearInterval(statusInterval);
    };
  }, []);

  // Show loading screen during initialization
  if (isLoading) {
    return <EDRLoadingScreen />;
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900/20 to-gray-900">
        <Layout systemStatus={systemStatus}>
          <Suspense fallback={<LoadingSpinner message="Loading security module..." />}>
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route 
                path="/dashboard" 
                element={
                  <ErrorBoundary>
                    <Dashboard />
                  </ErrorBoundary>
                } 
              />
              <Route 
                path="/agents" 
                element={
                  <ErrorBoundary>
                    <Agents />
                  </ErrorBoundary>
                } 
              />
              <Route 
                path="/alerts" 
                element={
                  <ErrorBoundary>
                    <Alerts />
                  </ErrorBoundary>
                } 
              />
              <Route 
                path="/threats" 
                element={
                  <ErrorBoundary>
                    <Threats />
                  </ErrorBoundary>
                } 
              />
              <Route 
                path="/events" 
                element={
                  <ErrorBoundary>
                    <Events />
                  </ErrorBoundary>
                } 
              />
              <Route 
                path="/analytics" 
                element={
                  <ErrorBoundary>
                    <Analytics />
                  </ErrorBoundary>
                } 
              />
              <Route 
                path="/ai" 
                element={
                  <ErrorBoundary>
                    <AI />
                  </ErrorBoundary>
                } 
              />
              <Route 
                path="/reports" 
                element={
                  <ErrorBoundary>
                    <Reports />
                  </ErrorBoundary>
                } 
              />
              <Route 
                path="/rules" 
                element={
                  <ErrorBoundary>
                    <Rules />
                  </ErrorBoundary>
                } 
              />
              <Route 
                path="/settings" 
                element={
                  <ErrorBoundary>
                    <Settings />
                  </ErrorBoundary>
                } 
              />
              <Route 
                path="*" 
                element={
                  <ErrorBoundary>
                    <NotFound />
                  </ErrorBoundary>
                } 
              />
            </Routes>
          </Suspense>
        </Layout>
      </div>
    </ErrorBoundary>
  );
};

export default App;