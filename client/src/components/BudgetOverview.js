import React from 'react';
import { Link } from 'react-router-dom';
import ChartIcon from '../icons/ChartIcon';
import WarningIcon from '../icons/WarningIcon';
import CheckIcon from '../icons/CheckIcon';
import IncomeIcon from '../icons/IncomeIcon';
import ExpenseIcon from '../icons/ExpenseIcon';

export default function BudgetOverview({ budgetData }) {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount || 0);
  };

  if (!budgetData?.period) return null;

  if (!budgetData.budgets || budgetData.budgets.length === 0) {
    return (
      <div className="card text-center py-12">
        <div className="flex justify-center mb-4">
          <ChartIcon className="w-20 h-20 text-ink-400 dark:text-ink-500" />
        </div>
        <h3 className="text-xl font-semibold text-ink-900 dark:text-ink-100 mb-2">
          No Budgets Set
        </h3>
        <p className="text-ink-600 dark:text-ink-400 mb-6">
          Create a budget to track your spending and stay on top of your finances!
        </p>
        <Link to="/budgets" className="btn-primary">
          Create Your First Budget
        </Link>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-ink-900 dark:text-ink-100">
            Budget Overview
          </h2>
          <p className="text-sm text-ink-600 dark:text-ink-400 mt-1">
            {new Date(budgetData.period.year, budgetData.period.month - 1).toLocaleString('default', { month: 'long', year: 'numeric' })}
          </p>
        </div>
        <Link to="/budgets" className="btn-ghost text-sm">
          Manage Budgets →
        </Link>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {budgetData.budgets.map((budget) => (
          <div
            key={budget.id}
            className={`p-4 rounded-xl border-2 ${
              budget.isOverBudget
                ? 'border-rose-300 dark:border-rose-700 bg-rose-50 dark:bg-rose-900/20'
                : 'border-ink-200 dark:border-ink-700'
            }`}
          >
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2">
                <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${
                  budget.isOverBudget
                    ? 'bg-rose-100 dark:bg-rose-900/30'
                    : 'bg-emerald-100 dark:bg-emerald-900/30'
                }`}>
                  {budget.isOverBudget ? (
                    <WarningIcon className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                  ) : (
                    <CheckIcon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  )}
                </div>
                <span className="font-semibold text-ink-900 dark:text-ink-100">
                  {budget.category}
                </span>
              </div>
              <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                budget.isOverBudget
                  ? 'text-rose-700 dark:text-rose-300 bg-rose-200 dark:bg-rose-800'
                  : 'text-emerald-700 dark:text-emerald-300 bg-emerald-200 dark:bg-emerald-800'
              }`}>
                {budget.isOverBudget ? 'Over' : 'OK'}
              </span>
            </div>
            <div className="mb-2">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-ink-600 dark:text-ink-400">
                  {formatCurrency(budget.actualSpending)} / {formatCurrency(Number(budget.limit))}
                </span>
                <span className="font-medium text-ink-900 dark:text-ink-100">
                  {budget.percentageUsed.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-ink-200 dark:bg-ink-700 rounded-full h-2.5 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    budget.isOverBudget ? 'bg-rose-500' : 'bg-emerald-500'
                  }`}
                  style={{
                    width: `${Math.min(budget.percentageUsed, 100)}%`,
                  }}
                ></div>
              </div>
            </div>
            <div className="flex justify-between items-center text-xs text-ink-500 dark:text-ink-400">
              <span>Remaining: {formatCurrency(budget.remaining)}</span>
              {budget.remaining >= 0 ? (
                <IncomeIcon className="w-4 h-4 text-emerald-500" />
              ) : (
                <ExpenseIcon className="w-4 h-4 text-rose-500" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

