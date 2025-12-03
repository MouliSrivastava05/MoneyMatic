import React from 'react';

export default function BudgetList({ budgets, onEdit, onDelete }) {
  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount || 0);

  if (!budgets || budgets.length === 0) {
    return (
      <div className="card text-center py-12">
        <div className="text-5xl mb-4">📊</div>
        <h3 className="text-xl font-semibold text-ink-900 dark:text-ink-100 mb-2">
          No Budgets Found
        </h3>
        <p className="text-ink-600 dark:text-ink-400">
          Create a new budget to start tracking your spending.
        </p>
      </div>
    );
  }

  const cellBase =
    'py-4 px-4 text-sm bg-white/85 dark:bg-ink-900/70 backdrop-blur border border-white/30 dark:border-ink-800/40 first:rounded-l-2xl last:rounded-r-2xl align-middle';

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full border-separate border-spacing-y-3">
          <thead>
            <tr className="text-xs uppercase tracking-[0.3em] text-ink-500 dark:text-ink-400">
              <th className="pb-2 pl-2 text-left">Category</th>
              <th className="pb-2 text-left">Limit</th>
              <th className="pb-2 text-left">Spent</th>
              <th className="pb-2 text-left">Remaining</th>
              <th className="pb-2 text-left">Status</th>
              <th className="pb-2 pr-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {budgets.map((budget) => (
              <tr key={budget.id} className="text-ink-900 dark:text-ink-100">
                <td className={`${cellBase} font-semibold`}>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-brand-start to-brand-end opacity-80" />
                    <div>
                      {budget.category}
                      <p className="text-xs text-ink-400 dark:text-ink-500">
                        {budget.month}/{budget.year}
                      </p>
                    </div>
                  </div>
                </td>
                <td className={`${cellBase} text-ink-600 dark:text-ink-300`}>
                  {formatCurrency(budget.limit)}
                </td>
                <td className={`${cellBase} text-ink-600 dark:text-ink-300`}>
                  {formatCurrency(budget.actualSpending)}
                </td>
                <td
                  className={`${cellBase} font-semibold ${
                    budget.remaining >= 0 ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {formatCurrency(budget.remaining)}
                </td>
                <td className={cellBase}>
                  <span
                    className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
                      budget.isOverBudget
                        ? 'bg-rose-500/15 text-rose-300'
                        : 'bg-emerald-500/15 text-emerald-300'
                    }`}
                  >
                    <span className="h-2 w-2 rounded-full bg-current" />
                    {budget.isOverBudget ? 'Over budget' : 'Within budget'}
                  </span>
                </td>
                <td className={`${cellBase} text-right`}>
                  <div className="flex items-center justify-end gap-2 text-sm font-medium">
                    <button
                      onClick={() => onEdit(budget)}
                      className="text-brand-400 hover:text-brand-300 transition"
                    >
                      Edit
                    </button>
                    <span className="h-5 w-px bg-white/30 dark:bg-ink-700" />
                    <button
                      onClick={() => onDelete(budget.id)}
                      className="text-rose-400 hover:text-rose-300 transition"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

