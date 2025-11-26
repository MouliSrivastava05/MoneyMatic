import React from 'react';

const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(Number(amount || 0));

export default function IncomeExpenseChart({ income = 0, expense = 0, savings = 0 }) {
  const maxValue = Math.max(income, expense, 1);
  const incomeWidth = Math.round((income / maxValue) * 100);
  const expenseWidth = Math.round((expense / maxValue) * 100);

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm uppercase tracking-wide text-ink-500 dark:text-ink-400">
            Income vs Expenses
          </p>
          <h3 className="text-xl font-semibold text-ink-900 dark:text-ink-50">Monthly flow</h3>
        </div>
        <span className="text-sm font-medium text-emerald-600 dark:text-emerald-300">
          Savings {formatCurrency(savings)}
        </span>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between text-xs font-medium text-ink-500 dark:text-ink-400 mb-1">
            <span>Income</span>
            <span>{formatCurrency(income)}</span>
          </div>
          <div className="h-3 rounded-full bg-emerald-100 dark:bg-emerald-900/30">
            <div
              className="h-3 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600 dark:from-emerald-300 dark:to-emerald-500 transition-all"
              style={{ width: `${incomeWidth}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between text-xs font-medium text-ink-500 dark:text-ink-400 mb-1">
            <span>Expenses</span>
            <span>{formatCurrency(expense)}</span>
          </div>
          <div className="h-3 rounded-full bg-rose-100 dark:bg-rose-900/30">
            <div
              className="h-3 rounded-full bg-gradient-to-r from-rose-400 to-rose-600 dark:from-rose-300 dark:to-rose-500 transition-all"
              style={{ width: `${expenseWidth}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}


