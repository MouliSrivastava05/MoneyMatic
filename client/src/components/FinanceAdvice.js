import React from 'react';

const adviceBlocks = [
  {
    title: 'Build guardrails',
    points: [
      'Adopt the 50/30/20 split (needs/wants/saving) and review it monthly.',
      'Automate transfers to savings the same day income arrives.',
    ],
  },
  {
    title: 'Know your runway',
    points: [
      'Keep 3–6 months of expenses in an emergency fund.',
      'Audit subscriptions quarterly; cancel the ones you no longer love.',
    ],
  },
  {
    title: 'Stay proactive',
    points: [
      'Set reminder cadences: weekly check-ins, monthly deep dives.',
      'Tag every transaction—even a coffee—to keep insights trustworthy.',
    ],
  },
];

export default function FinanceAdvice() {
  return (
    <section className="rounded-[32px] border border-white/10 bg-white/70 p-6 shadow-card dark:bg-ink-900/80 dark:border-ink-800">
      <div className="flex flex-col gap-2 mb-6">
        <p className="text-xs uppercase tracking-[0.5em] text-ink-500 dark:text-ink-400">Personal finance playbook</p>
        <h2 className="text-2xl font-semibold text-ink-900 dark:text-white">How to manage money intentionally</h2>
        <p className="text-ink-600 dark:text-ink-300 text-sm">
          A few principles we encourage MoneyMatic users to follow. Apply them inside the dashboard for a calmer
          relationship with money.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {adviceBlocks.map((block) => (
          <div key={block.title} className="rounded-2xl border border-ink-100/60 bg-white/60 p-4 dark:bg-ink-800/70 dark:border-ink-700">
            <h3 className="text-lg font-semibold text-ink-900 dark:text-white">{block.title}</h3>
            <ul className="mt-3 space-y-2 text-sm text-ink-600 dark:text-ink-300">
              {block.points.map((point) => (
                <li key={point} className="flex gap-2">
                  <span className="text-brand-500">•</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}



