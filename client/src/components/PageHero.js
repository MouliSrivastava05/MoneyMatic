import React from 'react';

export default function PageHero({ eyebrow, title, description, meta, actions }) {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-white/[0.07] bg-gradient-to-br from-ink-900/80 via-ink-900/60 to-ink-900/40 backdrop-blur-xl p-6 sm:p-8">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-64 w-64 rounded-full bg-brand-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 right-8 h-48 w-48 rounded-full bg-indigo-500/8 blur-3xl" />

      {/* Border gradient overlay */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/[0.06]" />

      <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2 max-w-2xl">
          {eyebrow && (
            <p className="eyebrow">{eyebrow}</p>
          )}
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
            {title}
          </h1>
          {description && (
            <p className="text-ink-400 text-sm sm:text-base leading-relaxed">
              {description}
            </p>
          )}
          {meta && meta.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {meta.map((item) => (
                <span key={item.label} className="pill">
                  <span className="text-ink-500 text-[10px] uppercase tracking-wider">{item.label}</span>
                  <span className="text-ink-200 font-bold">{item.value}</span>
                </span>
              ))}
            </div>
          )}
        </div>

        {actions && (
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {actions}
          </div>
        )}
      </div>
    </section>
  );
}
