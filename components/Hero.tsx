import React from 'react';
import { PRICING } from '../constants';

interface HeroProps {
  onSubscribeClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onSubscribeClick }) => {
  return (
    <div className="relative overflow-hidden bg-brand-dark pt-16 pb-32">
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        {/* Abstract Chart Background Effect */}
        <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
          <path d="M0 100 L0 80 L20 75 L40 85 L60 60 L80 65 L100 40 L100 100 Z" fill="#10b981" />
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
        <div className="inline-flex items-center px-3 py-1 rounded-full border border-brand-500/30 bg-brand-500/10 text-brand-500 text-sm font-medium mb-6">
          <span className="flex h-2 w-2 rounded-full bg-brand-500 mr-2 animate-pulse"></span>
          Live KLSE Data Integration
        </div>
        
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white mb-6">
          KLSE Share Analytics <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-blue-400">
            Daily Intelligent Insights
          </span>
        </h1>
        
        <p className="max-w-2xl text-lg md:text-xl text-slate-400 mb-10">
          Daily KLSE analysis powered by AI, Power BI, volatility metrics, and prediction models. 
          Designed for serious traders preparing their day.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <button 
            onClick={onSubscribeClick}
            className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-brand-dark bg-brand-500 hover:bg-brand-400 transition-colors shadow-lg shadow-brand-500/20"
          >
            Subscribe – {PRICING.amount}{PRICING.period}
          </button>
          
          <a 
            href="#benefits"
            className="inline-flex items-center justify-center px-8 py-3 border border-slate-700 text-base font-medium rounded-md text-slate-300 hover:bg-slate-800 transition-colors"
          >
            Learn More
          </a>
        </div>
      </div>
    </div>
  );
};