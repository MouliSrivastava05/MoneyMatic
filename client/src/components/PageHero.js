import React from 'react';

export default function PageHero({ eyebrow, title, description, meta, actions }) {
  return (
    <section className="relative overflow-hidden rounded-[32px] border border-white/60 bg-white/80 p-6 shadow-[0_40px_90px_-60px_rgba(15,23,42,0.8)] dark:border-ink-800/70 dark:bg-ink-900/60">
      <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-3 max-w-xl">
          {eyebrow && (
            <p className="text-xs uppercase tracking-[0.4em] text-ink-500 dark:text-ink-400">
              {eyebrow}
            </p>
          )}
          <h1 className="text-3xl font-semibold text-ink-900 dark:text-white">{title}</h1>
          {description && <p className="text-ink-600 dark:text-ink-300">{description}</p>}
          {meta && (
            <div className="flex flex-wrap gap-3">
              {meta.map((item) => (
                <span
                  key={item.label}
                  className="pill bg-white text-ink-700 shadow-sm dark:bg-ink-800/50 dark:text-ink-100"
                >
                  <span className="text-xs uppercase tracking-[0.2em] text-ink-400 dark:text-ink-500">
                    {item.label}
                  </span>
                  <span className="text-sm font-semibold">{item.value}</span>
                </span>
              ))}
            </div>
          )}
        </div>
        {actions && <div className="flex flex-wrap items-center gap-3">{actions}</div>}
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-brand-500/20 to-transparent dark:from-brand-400/10" />
      <div className="absolute inset-0 opacity-40 mix-blend-soft-light blur-3xl dark:opacity-60" />
    </section>
  );
}



