import React from 'react';

export default function QuickStats({ budgetData, transactionCount }) {
  const totalIncome   = budgetData?.summary?.totalIncome   || 0;
  const totalExpenses = budgetData?.summary?.totalExpenses || 0;
  const activeBudgets = budgetData?.budgets?.length || 0;
  const expenseRatio  = totalIncome > 0
    ? ((totalExpenses / totalIncome) * 100).toFixed(1)
    : 0;
  const savingsRate = totalIncome > 0
    ? (((totalIncome - totalExpenses) / totalIncome) * 100).toFixed(1)
    : 0;

  const stats = [
    { label: 'Transactions', value: transactionCount, suffix: '' },
    { label: 'Active Budgets', value: activeBudgets,  suffix: '' },
  ];

  return (
    <div className="card flex flex-col gap-5 h-full">
      <div>
        <p className="eyebrow mb-0.5">Snapshot</p>
        <h2 className="section-title text-xl">Quick Stats</h2>
      </div>

      {/* Expense ratio bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-ink-400 font-medium">Income vs Expenses</span>
          <span className="font-bold text-white">{expenseRatio}%</span>
        </div>
        <div className="h-2.5 w-full rounded-full bg-ink-800 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${
              Number(expenseRatio) > 90
                ? 'bg-gradient-to-r from-rose-600 to-rose-400'
                : Number(expenseRatio) > 70
                ? 'bg-gradient-to-r from-amber-600 to-amber-400'
                : 'bg-gradient-to-r from-brand-600 to-brand-400'
            }`}
            style={{ width: `${Math.min(Number(expenseRatio), 100)}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-ink-500">
          <span>Spent</span>
          <span>of income</span>
        </div>
      </div>

      {/* Savings rate bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-ink-400 font-medium">Savings Rate</span>
          <span className="font-bold text-brand-400">{savingsRate}%</span>
        </div>
        <div className="h-2.5 w-full rounded-full bg-ink-800 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-brand-700 to-brand-400 transition-all duration-700"
            style={{ width: `${Math.min(Math.max(Number(savingsRate), 0), 100)}%` }}
          />
        </div>
      </div>

      {/* Count stats */}
      <div className="border-t border-white/[0.06] pt-4 space-y-3">
        {stats.map(({ label, value, suffix }) => (
          <div key={label} className="flex items-center justify-between">
            <span className="text-sm text-ink-400">{label}</span>
            <span className="text-lg font-bold font-mono text-white">
              {value}{suffix}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
