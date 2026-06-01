import React from 'react';
import { Mail, Users, Settings, Activity } from 'lucide-react';
import { Toaster } from 'react-hot-toast';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex bg-background text-white font-sans">
      <Toaster position="top-right" toastOptions={{
        style: {
          background: '#ffffff',
          color: '#0f172a',
          border: '1px solid #e2e8f0'
        }
      }} />

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <div className="flex-1 overflow-auto p-8 z-10 animate-fade-in">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Create New Campaign</h1>
              <p className="text-white/80 text-sm">Complete the steps below to launch your next high-performance sequence.</p>
            </div>
            
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Layout;
