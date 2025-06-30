import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { Agents } from './pages/Agents';
import { Events } from './pages/Events';
import { Alerts } from './pages/Alerts';
import { Threats } from './pages/Threats';
import { DetectionRules } from './pages/DetectionRules';
import { Settings } from './pages/Settings';
import { NotFound } from './pages/NotFound';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/agents" element={<Agents />} />
        <Route path="/events" element={<Events />} />
        <Route path="/alerts" element={<Alerts />} />
        <Route path="/threats" element={<Threats />} />
        <Route path="/rules" element={<DetectionRules />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
}

export default App; 