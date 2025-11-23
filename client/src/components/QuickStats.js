import React from 'react';

export default function QuickStats({ budgetData, transactionCount }) {
  return (
    <div className="card">
      <h2 className="text-xl font-semibold text-ink-900 dark:text-ink-100 mb-6">
        Quick Stats
      </h2>
      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-ink-600 dark:text-ink-400">Income vs Expenses</span>
            <span className="font-medium text-ink-900 dark:text-ink-100">
              {budgetData?.summary?.totalIncome
                ? ((budgetData.summary.totalExpenses / budgetData.summary.totalIncome) * 100).toFixed(1)
                : 0}%
            </span>
          </div>
          <div className="w-full bg-ink-200 dark:bg-ink-700 rounded-full h-2">
            <div
              className="bg-brand-500 h-2 rounded-full"
              style={{
                width: `${Math.min(
                  budgetData?.summary?.totalIncome
                    ? (budgetData.summary.totalExpenses / budgetData.summary.totalIncome) * 100
                    : 0,
                  100
                )}%`,
              }}
            ></div>
          </div>
        </div>
        <div className="pt-4 border-t border-ink-200 dark:border-ink-700">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-ink-600 dark:text-ink-400">Transaction Count</span>
            <span className="font-semibold text-ink-900 dark:text-ink-100">
              {transactionCount}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-ink-600 dark:text-ink-400">Active Budgets</span>
            <span className="font-semibold text-ink-900 dark:text-ink-100">
              {budgetData?.budgets?.length || 0}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

