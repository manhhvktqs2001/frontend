import React from 'react';
// Router imports will be handled by parent
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'react-hot-toast';
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
import NetworkMonitoring from './components/page/NetworkMonitoring';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Simple App Component - you need to handle routing in your main project
const App = ({ currentPath = '/', onNavigate = () => {} }) => {
  // Simple routing based on currentPath
  const renderCurrentPage = () => {
    switch (currentPath) {
      case '/agents':
        return <Agents />;
      case '/events':
        return <Events />;
      case '/alerts':
        return <Alerts />;
      case '/rules':
        return <Rules />;
      case '/threats':
        return <Threats />;
      case '/settings':
        return <Settings />;
      case '/threat-hunt':
        return <ThreatHunt />;
      case '/network':
      case '/monitoring':
        return <NetworkMonitoring />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex h-screen bg-gray-50">
        <Sidebar 
          currentPath={currentPath} 
          onNavigate={onNavigate}
        />
        <div className="flex-1 flex flex-col min-w-0">
          <Header />
          <main className="flex-1 overflow-y-auto">
            {renderCurrentPage()}
          </main>
        </div>
        
        {/* Toast Notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              theme: {
                primary: '#4ade80',
                secondary: '#fff',
              },
            },
            error: {
              duration: 5000,
              theme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </div>
    </QueryClientProvider>
  );
};

export default App;