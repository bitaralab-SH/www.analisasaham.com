import React from 'react';
import { POWER_BI_URL } from '../constants';

interface DashboardProps {
  expiryDate?: string | null;
}

export const Dashboard: React.FC<DashboardProps> = ({ expiryDate }) => {
  
  // Calculate remaining days
  let daysRemaining = 0;
  let isValidDate = false;

  if (expiryDate && expiryDate.trim() !== "") {
    const now = new Date();
    const expiry = new Date(expiryDate);
    
    // Check if date is valid
    if (!isNaN(expiry.getTime())) {
      isValidDate = true;
      const timeDiff = expiry.getTime() - now.getTime();
      daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24));
    }
  }

  // Determine color based on urgency
  let timerColor = 'text-brand-500 bg-brand-500/10 border-brand-500/30';
  if (daysRemaining <= 3) {
    timerColor = 'text-red-500 bg-red-500/10 border-red-500/30';
  } else if (daysRemaining <= 7) {
    timerColor = 'text-yellow-500 bg-yellow-500/10 border-yellow-500/30';
  }

  return (
    <div id="dashboard" className="py-12 bg-slate-900 border-t border-slate-800 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-bold text-white mb-1">Market Dashboard</h2>
            <p className="text-brand-500 font-semibold flex items-center justify-center md:justify-start">
              <span className="w-2 h-2 bg-brand-500 rounded-full animate-pulse mr-2"></span>
              Live Access Granted
            </p>
          </div>

          {/* Countdown Card */}
          {/* Always render card structure, control content based on valid date */}
          {expiryDate && (
             <div className={`px-6 py-3 rounded-xl border ${timerColor} flex flex-col items-center md:items-end shadow-lg`}>
                <span className="text-xs font-medium opacity-80 uppercase tracking-wider">Subscription Expires In</span>
                <span className="text-2xl font-bold">
                  {isValidDate 
                    ? (daysRemaining > 0 ? `${daysRemaining} Days` : 'Expired')
                    : 'Check Date'
                  }
                </span>
                <span className="text-[10px] opacity-60">
                   {isValidDate ? `Until ${new Date(expiryDate!).toLocaleDateString()}` : 'Date format error'}
                </span>
             </div>
          )}
        </div>
        
        <div className="bg-slate-800 p-2 rounded-xl shadow-2xl border border-slate-700 overflow-hidden">
          <div className="relative w-full" style={{ paddingBottom: '56.25%', height: 0 }}>
             <iframe 
                title="StockDetailsAnalysis-Local v04-autotuning" 
                className="absolute top-0 left-0 w-full h-full rounded-lg"
                src={POWER_BI_URL}
                frameBorder="0" 
                allowFullScreen={true}
            ></iframe>
          </div>
        </div>
        
        <div className="mt-8 text-center text-slate-500 text-sm">
          <p>Data is updated daily. Recommended viewing on Desktop for detailed analysis.</p>
        </div>
      </div>
    </div>
  );
};