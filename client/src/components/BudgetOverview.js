import React from 'react';
import { Link } from 'react-router-dom';
import ChartIcon from '../icons/ChartIcon';
import WarningIcon from '../icons/WarningIcon';
import CheckIcon from '../icons/CheckIcon';

const fmt = (n) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n || 0);

export default function BudgetOverview({ budgetData }) {
  if (!budgetData?.period) return null;

  if (!budgetData.budgets || budgetData.budgets.length === 0) {
    return (
      <div className="card text-center py-12">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-ink-800/60">
          <ChartIcon className="h-8 w-8 text-ink-500" />
        </div>
        <h3 className="text-lg font-bold text-white mb-1">No Budgets Set</h3>
        <p className="text-ink-400 text-sm mb-5">Create a budget to track your spending this month.</p>
        <Link to="/budgets" className="btn-primary btn-sm">
          Create Your First Budget
        </Link>
      </div>
    );
  }

  const monthLabel = new Date(budgetData.period.year, budgetData.period.month - 1)
    .toLocaleString('default', { month: 'long', year: 'numeric' });

  return (
    <div className="card">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="eyebrow mb-0.5">Monthly</p>
          <h2 className="section-title text-xl">Budget Overview</h2>
          <p className="text-xs text-ink-500 mt-0.5">{monthLabel}</p>
        </div>
        <Link to="/budgets" className="btn btn-ghost btn-sm">
          Manage →
        </Link>
      </div>

      {/* Budget grid */}
      <div className="grid gap-3 md:grid-cols-2">
        {budgetData.budgets.map((budget) => {
          const pct      = Math.min(budget.percentageUsed, 100);
          const isOver   = budget.isOverBudget;
          const barColor = isOver
            ? 'bg-gradient-to-r from-rose-600 to-rose-400'
            : pct > 80
            ? 'bg-gradient-to-r from-amber-600 to-amber-400'
            : 'bg-gradient-to-r from-brand-600 to-brand-400';

          return (
            <div
              key={budget.id}
              className={`rounded-xl border p-4 transition-all duration-200 hover:-translate-y-0.5 ${
                isOver
                  ? 'border-rose-500/25 bg-rose-500/[0.06]'
                  : 'border-white/[0.06] bg-white/[0.02]'
              }`}
            >
              {/* Row: icon + name + badge */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                    isOver ? 'bg-rose-500/15 text-rose-400' : 'bg-emerald-500/15 text-emerald-400'
                  }`}>
                    {isOver
                      ? <WarningIcon className="h-4 w-4" />
                      : <CheckIcon   className="h-4 w-4" />
                    }
                  </div>
                  <span className="text-sm font-semibold text-ink-100">{budget.category}</span>
                </div>
                <span className={isOver ? 'badge-danger' : 'badge-success'}>
                  {isOver ? 'Over' : 'OK'}
                </span>
              </div>

              {/* Progress bar */}
              <div className="mb-2">
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-ink-400">
                    {fmt(budget.actualSpending)} <span className="text-ink-600">/ {fmt(Number(budget.limit))}</span>
                  </span>
                  <span className={`font-bold ${isOver ? 'text-rose-400' : 'text-ink-200'}`}>
                    {budget.percentageUsed.toFixed(0)}%
                  </span>
                </div>
                <div className="h-2 rounded-full bg-ink-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${barColor}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>

              {/* Remaining */}
              <p className={`text-xs font-semibold ${budget.remaining >= 0 ? 'text-ink-400' : 'text-rose-400'}`}>
                {budget.remaining >= 0 ? `${fmt(budget.remaining)} remaining` : `${fmt(Math.abs(budget.remaining))} over limit`}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
