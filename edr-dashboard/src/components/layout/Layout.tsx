import * as React from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Animated background pattern */}
      <div className="fixed inset-0 opacity-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent)]"></div>
        <div className="absolute inset-0 bg-[conic-gradient(from_0deg,transparent,rgba(59,130,246,0.05),transparent)]"></div>
      </div>

      <div className="relative z-10 flex h-screen">
        <Sidebar isOpen={sidebarOpen} />
        
        <div className={`flex-1 flex flex-col transition-all duration-300 ${
          sidebarOpen ? 'ml-0' : 'ml-0'
        }`}>
          <Header 
            onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
            sidebarOpen={sidebarOpen}
          />
          
          <main className="flex-1 overflow-y-auto p-6 custom-scrollbar">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};