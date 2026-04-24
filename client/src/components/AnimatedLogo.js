import React from 'react';

export default function AnimatedLogo({ size = 'md', className = '' }) {
  const sizeMap = {
    sm: { outer: 'h-8 w-8', text: 'text-sm' },
    md: { outer: 'h-9 w-9', text: 'text-base' },
    lg: { outer: 'h-11 w-11', text: 'text-xl' },
  };
  const { outer, text } = sizeMap[size] || sizeMap.md;

  return (
    <div className={`relative ${outer} ${className} flex-shrink-0`}>
      {/* Glow halo */}
      <div className="absolute inset-0 rounded-xl bg-brand-500/30 blur-md animate-money-glow" />
      {/* Main bg */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-brand-400 via-brand-500 to-brand-700 shadow-brand" />
      {/* Shimmer overlay */}
      <div
        className="absolute inset-0 rounded-xl opacity-60 animate-spin-slow"
        style={{
          background: 'conic-gradient(from 0deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%)',
        }}
      />
      {/* Dollar sign */}
      <div className="relative z-10 flex h-full w-full items-center justify-center">
        <span
          className={`font-display font-bold text-white select-none drop-shadow animate-bounce-slow ${text}`}
        >
          $
        </span>
      </div>
    </div>
  );
}
