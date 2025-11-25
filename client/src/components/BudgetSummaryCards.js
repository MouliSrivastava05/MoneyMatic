import React from 'react';

export default function BudgetSummaryCards({ budgetData }) {
  const totalBudget = budgetData?.budgets?.reduce(
    (sum, budget) => sum + Number(budget.limit || 0),
    0
  );

  const totalSpent = budgetData?.budgets?.reduce(
    (sum, budget) => sum + Number(budget.actualSpending || 0),
    0
  );

  const remaining = totalBudget - totalSpent;
  const activeBudgets = budgetData?.budgets?.length || 0;

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount || 0);

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
      <div className="card bg-gradient-to-br from-brand-50 to-brand-100 dark:from-brand-900/20 dark:to-brand-800/20 border-brand-200 dark:border-brand-800">
        <h3 className="text-sm font-medium text-ink-600 dark:text-ink-400 mb-2">
          Total Budget
        </h3>
        <p className="text-3xl font-bold text-brand-700 dark:text-brand-300">
          {formatCurrency(totalBudget)}
        </p>
      </div>

      <div className="card bg-gradient-to-br from-rose-50 to-rose-100 dark:from-rose-900/20 dark:to-rose-800/20 border-rose-200 dark:border-rose-800">
        <h3 className="text-sm font-medium text-ink-600 dark:text-ink-400 mb-2">
          Actual Spending
        </h3>
        <p className="text-3xl font-bold text-rose-700 dark:text-rose-300">
          {formatCurrency(totalSpent)}
        </p>
      </div>

      <div className={`card bg-gradient-to-br ${
        remaining >= 0
          ? 'from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 border-emerald-200 dark:border-emerald-800'
          : 'from-rose-50 to-rose-100 dark:from-rose-900/20 dark:to-rose-800/20 border-rose-200 dark:border-rose-800'
      }`}>
        <h3 className="text-sm font-medium text-ink-600 dark:text-ink-400 mb-2">
          Remaining
        </h3>
        <p className={`text-3xl font-bold ${
          remaining >= 0
            ? 'text-emerald-700 dark:text-emerald-300'
            : 'text-rose-700 dark:text-rose-300'
        }`}>
          {formatCurrency(remaining)}
        </p>
      </div>

      <div className="card bg-gradient-to-br from-ink-50 to-ink-100 dark:from-ink-900/20 dark:to-ink-800/20 border-ink-200 dark:border-ink-800">
        <h3 className="text-sm font-medium text-ink-600 dark:text-ink-400 mb-2">
          Active Budgets
        </h3>
        <p className="text-3xl font-bold text-ink-900 dark:text-ink-100">
          {activeBudgets}
        </p>
      </div>
    </div>
  );
}

