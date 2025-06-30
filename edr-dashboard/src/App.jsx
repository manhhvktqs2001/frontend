import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { Agents } from './pages/Agents';
import { Alerts } from './pages/Alerts';
import { Threats } from './pages/Threats';
import { Events } from './pages/Events';
import { Settings } from './pages/Settings';
import { Analytics } from './pages/Analytics';
import { Reports } from './pages/Reports';
import { AI } from './pages/AI';
import { Rules } from './pages/Rules';
import { NotFound } from './pages/NotFound';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/agents" element={<Agents />} />
        <Route path="/alerts" element={<Alerts />} />
        <Route path="/threats" element={<Threats />} />
        <Route path="/events" element={<Events />} />
        <Route path="/rules" element={<Rules />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/ai" element={<AI />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
}

export default App;