import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import Dashboard from './components/page/Dashboard';
import Agents from './components/page/Agents';
import Events from './components/page/Events';
import Alerts from './components/page/Alerts';
import Rules from './components/page/Rules';
import Threats from './components/page/Threats';
import Settings from './components/page/Settings';
import ThreatHunt from './components/page/ThreatHunt';
import ToastContainer from './components/common/ToastContainer';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const App = () => {
  const location = useLocation();
  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
        <Sidebar currentPath={location.pathname} />
        <div className="flex-1 flex flex-col min-w-0">
          <Header />
          <main className="flex-1 overflow-y-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/agents" element={<Agents />} />
              <Route path="/events" element={<Events />} />
              <Route path="/alerts" element={<Alerts />} />
              <Route path="/rules" element={<Rules />} />
              <Route path="/threats" element={<Threats />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/threat-hunt" element={<ThreatHunt />} />
            </Routes>
          </main>
        </div>
        {/* Custom Toast Container */}
        <ToastContainer />
      </div>
    </QueryClientProvider>
  );
};

export default App;