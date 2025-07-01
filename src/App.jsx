import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <Router>
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <Header />
          <main className="flex-1 overflow-y-auto p-6">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/agents" element={<Agents />} />
              <Route path="/events" element={<Events />} />
              <Route path="/alerts" element={<Alerts />} />
              <Route path="/rules" element={<Rules />} />
              <Route path="/threats" element={<Threats />} />
              {/* Có thể thêm các route khác ở đây */}
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  </QueryClientProvider>
);

export default App;