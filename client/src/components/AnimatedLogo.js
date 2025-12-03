import React from 'react';

export default function AnimatedLogo({ size = 'md', className = '' }) {
  const sizeClasses = {
    sm: 'h-8 w-8 text-base',
    md: 'h-9 w-9 text-lg',
    lg: 'h-10 w-10 text-xl',
  };

  return (
    <div className={`relative ${sizeClasses[size]} ${className}`}>
      {/* Animated gradient background with glow */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-brand-start via-brand-400 to-brand-end shadow-lg animate-money-glow" />
      
      {/* Rotating glow effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-400/50 via-brand-400/50 to-teal-400/50 opacity-70 animate-spin-slow" style={{ filter: 'blur(4px)' }} />
      
      {/* Money sign container */}
      <div className="relative z-10 flex items-center justify-center h-full w-full">
        <span className="font-bold text-white drop-shadow-lg animate-bounce-slow select-none" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
          $
        </span>
      </div>
    </div>
  );
}

