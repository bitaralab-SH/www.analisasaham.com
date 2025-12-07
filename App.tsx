import React, { useState } from 'react';
import { Hero } from './components/Hero';
import { Benefits } from './components/Benefits';
import { SamplePreviews } from './components/SamplePreviews';
import { AccessGate } from './components/AccessGate';
import { Dashboard } from './components/Dashboard';
import { AdminPanel } from './components/AdminPanel';

const App: React.FC = () => {
  const [hasAccess, setHasAccess] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [expiryDate, setExpiryDate] = useState<string | null>(null);

  const scrollToSubscribe = () => {
    const el = document.getElementById('subscribe');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleLogout = () => {
    setHasAccess(false);
    setExpiryDate(null);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-brand-500 text-2xl font-bold">KLSE</span>
              <span className="text-white text-xl font-light ml-2">Analytics</span>
            </div>
            <div className="hidden md:flex space-x-8">
              <a href="#benefits" className="text-slate-300 hover:text-white px-3 py-2 text-sm font-medium">Benefits</a>
              {hasAccess && (
                <a href="#dashboard" className="text-brand-400 hover:text-brand-300 px-3 py-2 text-sm font-medium">Dashboard</a>
              )}
            </div>
            <div className="flex items-center gap-4">
               {!hasAccess ? (
                 <button 
                  onClick={scrollToSubscribe}
                  className="bg-brand-600 hover:bg-brand-500 text-white px-4 py-2 rounded text-sm font-medium transition-colors"
                >
                  Member Login
                </button>
               ) : (
                 <>
                   {/* Neon Running Light Active Badge */}
                   <div className="relative inline-flex h-9 overflow-hidden rounded-full p-[2px] focus:outline-none select-none shadow-[0_0_15px_rgba(16,185,129,0.5)]">
                      {/* The Spinning Gradient (Running Light) */}
                      <span className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#064e3b_0%,#10b981_50%,#064e3b_100%)]" />
                      
                      {/* The Inner Content */}
                      <span className="inline-flex h-full w-full items-center justify-center rounded-full bg-slate-900 px-4 py-1 text-sm font-bold text-emerald-400 backdrop-blur-3xl">
                        <span className="relative flex h-2 w-2 mr-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        ACTIVE
                      </span>
                   </div>

                   {/* Logout Button */}
                   <button 
                     onClick={handleLogout}
                     className="text-slate-400 hover:text-white transition-colors"
                     title="Logout"
                   >
                     <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                     </svg>
                   </button>
                 </>
               )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow">
        <Hero onSubscribeClick={scrollToSubscribe} />
        <Benefits />
        <SamplePreviews />
        
        {/* If user has access, show dashboard. If not, show the gate */}
        {hasAccess ? (
          <Dashboard expiryDate={expiryDate} />
        ) : (
          <AccessGate onAccessGranted={(expiry) => {
            setHasAccess(true);
            if (expiry) setExpiryDate(expiry);
          }} />
        )}
      </main>

      {/* Admin Panel Modal */}
      {showAdmin && (
        <AdminPanel 
          onClose={() => setShowAdmin(false)} 
          onOpenDashboard={() => {
            setHasAccess(true);
            // Fix: Set to 30 days instead of 1 year, to emulate standard user experience
            const standardExpiry = new Date();
            standardExpiry.setDate(standardExpiry.getDate() + 30);
            setExpiryDate(standardExpiry.toISOString());
          }}
        />
      )}

      {/* Footer */}
      <footer className="bg-slate-950 py-8 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-500 text-sm">
            &copy; {new Date().getFullYear()} KLSE Share Analytics. All rights reserved. <br/>
            Disclaimer: For educational and preparation purposes only. Not financial advice.
          </p>
          <div className="mt-4">
            <button 
              onClick={() => setShowAdmin(true)} 
              className="text-slate-700 hover:text-slate-500 text-xs transition-colors"
            >
              Admin Login
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;