import React from 'react';

const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(Number(amount || 0));

export default function CategorySpendingChart({ budgets = [], spendingByCategory = {} }) {
  if (!budgets.length) {
    return (
      <div className="card text-center py-10">
        <h3 className="text-lg font-semibold text-ink-900 dark:text-ink-100 mb-2">
          No budgets yet
        </h3>
        <p className="text-sm text-ink-500 dark:text-ink-400">
          Create budgets to visualize category performance.
        </p>
      </div>
    );
  }

  const items = budgets.map((budget) => {
    const actual = Number(spendingByCategory[budget.category] || 0);
    const limit = Number(budget.limit || 0);
    const percent = limit > 0 ? Math.min((actual / limit) * 100, 120) : 0;
    return {
      id: budget.id,
      category: budget.category,
      limit,
      actual,
      percent,
    };
  });

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm uppercase tracking-wide text-ink-500 dark:text-ink-400">
            Category performance
          </p>
          <h3 className="text-xl font-semibold text-ink-900 dark:text-ink-50">Budget vs actual</h3>
        </div>
        <span className="text-xs font-medium text-ink-500 dark:text-ink-400">
          Based on current month
        </span>
      </div>

      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id}>
            <div className="flex items-center justify-between text-sm font-medium text-ink-700 dark:text-ink-200 mb-1">
              <span>{item.category}</span>
              <span>
                {formatCurrency(item.actual)} / {formatCurrency(item.limit)}
              </span>
            </div>
            <div className="h-3 rounded-full bg-ink-100 dark:bg-ink-800 overflow-hidden">
              <div
                className={`h-3 rounded-full ${
                  item.actual > item.limit
                    ? 'bg-gradient-to-r from-rose-400 to-rose-600'
                    : 'bg-gradient-to-r from-brand-start to-brand-end'
                }`}
                style={{ width: `${item.percent}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


