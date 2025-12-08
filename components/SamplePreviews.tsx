import React, { useState } from 'react';

interface SampleReport {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
}

const SAMPLES: SampleReport[] = [
  {
    id: 1,
    title: "Trend Analysis (20MA & 200MA)",
    description: "Identify Golden Crosses and Death Crosses with clear Buy/Hold/Sell signals. Includes volume analysis and stop-loss targets.",
    // REPLACE THIS URL with your actual image path (e.g., "/images/trend-analysis.png")
    imageUrl: "/image/Trend20MA200MA.png"
  },
  {
    id: 2,
    title: "AI Price Prediction Models",
    description: "5-Day Forecasts using ARIMA and Holt-Winters machine learning models to predict future price movements.",
    // REPLACE THIS URL with your actual image path
    imageUrl: "/image/ARIMA_HoltWinter.png"
  },
  {
    id: 3,
    title: "Volatility Scatter Plot",
    description: "Visual cluster analysis to spot 'Big Gainers' and 'Big Droppers'. Filter by volatility characteristics to find breakout stocks.",
    // REPLACE THIS URL with your actual image path
    imageUrl: "/imageScatterPlot.png"
  }
];

export const SamplePreviews: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<SampleReport | null>(null);

  return (
    <section className="py-20 bg-brand-dark border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl mb-4">
            Sneak Peek: What You Get
          </h2>
          <p className="max-w-2xl mx-auto text-xl text-slate-400">
            Actual snapshots from our daily Power BI reports. Click on any chart to see the details.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {SAMPLES.map((sample) => (
            <div 
              key={sample.id} 
              className="group cursor-pointer flex flex-col h-full"
              onClick={() => setSelectedImage(sample)}
            >
              <div className="relative overflow-hidden rounded-xl border border-slate-700 aspect-video bg-slate-800">
                <img 
                  src={sample.imageUrl} 
                  alt={sample.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 bg-brand-600 text-white px-4 py-2 rounded-full font-medium flex items-center shadow-lg">
                    <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                    </svg>
                    Zoom In
                  </div>
                </div>
              </div>
              
              <div className="mt-4 flex-1">
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-brand-500 transition-colors">
                  {sample.title}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {sample.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/95 backdrop-blur-sm"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-7xl w-full max-h-full flex flex-col items-center">
            
            {/* Close Button */}
            <button 
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 right-0 text-slate-400 hover:text-white transition-colors"
            >
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Image */}
            <img 
              src={selectedImage.imageUrl} 
              alt={selectedImage.title} 
              className="max-w-full max-h-[85vh] rounded shadow-2xl border border-slate-700"
              onClick={(e) => e.stopPropagation()} 
            />
            
            {/* Caption */}
            <div className="mt-4 text-center">
              <h3 className="text-xl font-bold text-white">{selectedImage.title}</h3>
              <p className="text-slate-400 text-sm mt-1">{selectedImage.description}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};