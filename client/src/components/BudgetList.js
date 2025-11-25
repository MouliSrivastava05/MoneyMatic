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

  return (
    <div className="card">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-ink-200 dark:border-ink-700">
              <th className="text-left py-3 px-4 text-sm font-semibold text-ink-600 dark:text-ink-400">
                Category
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-ink-600 dark:text-ink-400">
                Limit
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-ink-600 dark:text-ink-400">
                Spent
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-ink-600 dark:text-ink-400">
                Remaining
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-ink-600 dark:text-ink-400">
                Status
              </th>
              <th className="text-right py-3 px-4 text-sm font-semibold text-ink-600 dark:text-ink-400">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {budgets.map((budget) => (
              <tr
                key={budget.id}
                className="border-b border-ink-100 dark:border-ink-800 hover:bg-ink-50 dark:hover:bg-ink-800/50 transition-colors"
              >
                <td className="py-4 px-4 font-medium text-ink-900 dark:text-ink-100">
                  {budget.category}
                </td>
                <td className="py-4 px-4 text-ink-700 dark:text-ink-300">
                  {formatCurrency(budget.limit)}
                </td>
                <td className="py-4 px-4 text-ink-700 dark:text-ink-300">
                  {formatCurrency(budget.actualSpending)}
                </td>
                <td
                  className={`py-4 px-4 font-semibold ${
                    budget.remaining >= 0
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-rose-600 dark:text-rose-400'
                  }`}
                >
                  {formatCurrency(budget.remaining)}
                </td>
                <td className="py-4 px-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      budget.isOverBudget
                        ? 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300'
                        : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
                    }`}
                  >
                    {budget.isOverBudget ? 'Over Budget' : 'Within Budget'}
                  </span>
                </td>
                <td className="py-4 px-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onEdit(budget)}
                      className="text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300 text-sm font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(budget.id)}
                      className="text-rose-600 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300 text-sm font-medium"
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

