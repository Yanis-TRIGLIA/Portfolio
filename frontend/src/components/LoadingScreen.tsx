
import React, { useState, useEffect } from 'react';

interface LoadingScreenProps {
  onLoadingComplete: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onLoadingComplete }) => {
  const [showY, setShowY] = useState(false);
  const [showT, setShowT] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => setShowY(true), 250);
    const timer2 = setTimeout(() => setShowT(true), 500);
    const timer3 = setTimeout(() => setFadeOut(true), 2500);
    const timer4 = setTimeout(() => onLoadingComplete(), 3000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [onLoadingComplete]);

  return (
    <div className={`fixed inset-0 z-50 bg-gradient-to-br from-gray-900 to-black flex items-center justify-center transition-opacity duration-500 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}>
      <div className="relative">
        <div className="w-32 h-32 border-4 border-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
          <div className="flex space-x-2 text-white font-bold text-4xl font-serif">
            <span 
              className={`transition-all duration-1000 ${
                showY 
                  ? 'opacity-100 transform translate-y-0 scale-100' 
                  : 'opacity-0 transform translate-y-4 scale-75'
              }`}
            >
              Y
            </span>
            <span 
              className={`transition-all duration-1000 delay-300 ${
                showT 
                  ? 'opacity-100 transform translate-y-0 scale-100' 
                  : 'opacity-0 transform translate-y-4 scale-75'
              }`}
            >
              T
            </span>
          </div>
        </div>
        
        <div className="absolute inset-0 w-32 h-32 border-2 border-white/30 rounded-full animate-ping"></div>
        <div className="absolute inset-0 w-32 h-32 border border-white/20 rounded-full animate-pulse"></div>
      </div>
      
      <div className="absolute bottom-20 flex space-x-2">
        <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce"></div>
        <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
        <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
      </div>
    </div>
  );
};

export default LoadingScreen;
