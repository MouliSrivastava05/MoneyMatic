import React from 'react';

export default function DashboardStatsCards({ budgetData }) {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount || 0);
  };

  const totalBalance = budgetData?.summary
    ? budgetData.summary.totalIncome - budgetData.summary.totalExpenses
    : 0;

  const savingsRate = budgetData?.summary?.totalIncome
    ? ((totalBalance / budgetData.summary.totalIncome) * 100).toFixed(1)
    : 0;

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
      {/* Income Card */}
      <div className="card bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 border-emerald-200 dark:border-emerald-800">
        <div className="flex items-center justify-between mb-3">
          <div className="h-12 w-12 rounded-xl bg-emerald-500 flex items-center justify-center">
            <span className="text-2xl">💰</span>
          </div>
          <span className="text-xs font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-200 dark:bg-emerald-800 px-2 py-1 rounded-full">
            Income
          </span>
        </div>
        <h3 className="text-sm font-medium text-ink-600 dark:text-ink-400 mb-1">
          Total Income
        </h3>
        <p className="text-3xl font-bold text-emerald-700 dark:text-emerald-300">
          {formatCurrency(budgetData?.summary?.totalIncome)}
        </p>
      </div>

      {/* Expenses Card */}
      <div className="card bg-gradient-to-br from-rose-50 to-rose-100 dark:from-rose-900/20 dark:to-rose-800/20 border-rose-200 dark:border-rose-800">
        <div className="flex items-center justify-between mb-3">
          <div className="h-12 w-12 rounded-xl bg-rose-500 flex items-center justify-center">
            <span className="text-2xl">💸</span>
          </div>
          <span className="text-xs font-medium text-rose-700 dark:text-rose-300 bg-rose-200 dark:bg-rose-800 px-2 py-1 rounded-full">
            Expenses
          </span>
        </div>
        <h3 className="text-sm font-medium text-ink-600 dark:text-ink-400 mb-1">
          Total Expenses
        </h3>
        <p className="text-3xl font-bold text-rose-700 dark:text-rose-300">
          {formatCurrency(budgetData?.summary?.totalExpenses)}
        </p>
      </div>

      {/* Savings Card */}
      <div className={`card bg-gradient-to-br ${
        totalBalance >= 0
          ? 'from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 border-emerald-200 dark:border-emerald-800'
          : 'from-rose-50 to-rose-100 dark:from-rose-900/20 dark:to-rose-800/20 border-rose-200 dark:border-rose-800'
      }`}>
        <div className="flex items-center justify-between mb-3">
          <div className={`h-12 w-12 rounded-xl ${
            totalBalance >= 0 ? 'bg-emerald-500' : 'bg-rose-500'
          } flex items-center justify-center`}>
            <span className="text-2xl">{totalBalance >= 0 ? '💵' : '📉'}</span>
          </div>
          <span className={`text-xs font-medium ${
            totalBalance >= 0
              ? 'text-emerald-700 dark:text-emerald-300 bg-emerald-200 dark:bg-emerald-800'
              : 'text-rose-700 dark:text-rose-300 bg-rose-200 dark:bg-rose-800'
          } px-2 py-1 rounded-full`}>
            {totalBalance >= 0 ? 'Savings' : 'Deficit'}
          </span>
        </div>
        <h3 className="text-sm font-medium text-ink-600 dark:text-ink-400 mb-1">
          Net Balance
        </h3>
        <p className={`text-3xl font-bold ${
          totalBalance >= 0
            ? 'text-emerald-700 dark:text-emerald-300'
            : 'text-rose-700 dark:text-rose-300'
        }`}>
          {formatCurrency(totalBalance)}
        </p>
      </div>

      {/* Savings Rate Card */}
      <div className="card bg-gradient-to-br from-brand-50 to-brand-100 dark:from-brand-900/20 dark:to-brand-800/20 border-brand-200 dark:border-brand-800">
        <div className="flex items-center justify-between mb-3">
          <div className="h-12 w-12 rounded-xl bg-brand-500 flex items-center justify-center">
            <span className="text-2xl">📊</span>
          </div>
          <span className="text-xs font-medium text-brand-700 dark:text-brand-300 bg-brand-200 dark:bg-brand-800 px-2 py-1 rounded-full">
            Rate
          </span>
        </div>
        <h3 className="text-sm font-medium text-ink-600 dark:text-ink-400 mb-1">
          Savings Rate
        </h3>
        <p className="text-3xl font-bold text-brand-700 dark:text-brand-300">
          {savingsRate}%
        </p>
      </div>
    </div>
  );
}

