import React from 'react';
import ChartIcon from '../icons/ChartIcon';
import WarningIcon from '../icons/WarningIcon';
import CheckIcon from '../icons/CheckIcon';

const fmt = (n) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(n || 0);

export default function BudgetList({ budgets, onEdit, onDelete }) {
  if (!budgets || budgets.length === 0) {
    return (
      <div className="card text-center py-14">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-ink-800/60">
          <ChartIcon className="h-8 w-8 text-ink-500" />
        </div>
        <h3 className="text-lg font-bold text-white mb-1">No Budgets Found</h3>
        <p className="text-sm text-ink-400">Create a new budget to start tracking your spending.</p>
      </div>
    );
  }

  return (
    <div className="card overflow-hidden !p-0">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/[0.06]">
              <th className="tbl-head-cell">Category</th>
              <th className="tbl-head-cell">Limit</th>
              <th className="tbl-head-cell">Spent</th>
              <th className="tbl-head-cell">Remaining</th>
              <th className="tbl-head-cell">Progress</th>
              <th className="tbl-head-cell">Status</th>
              <th className="tbl-head-cell text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {budgets.map((budget) => {
              const pct    = Math.min(budget.percentageUsed || 0, 100);
              const isOver = budget.isOverBudget;
              const barColor = isOver
                ? 'bg-gradient-to-r from-rose-600 to-rose-400'
                : pct > 80
                ? 'bg-gradient-to-r from-amber-600 to-amber-400'
                : 'bg-gradient-to-r from-brand-600 to-brand-400';

              return (
                <tr key={budget.id} className="tbl-row group">
                  {/* Category */}
                  <td className="tbl-cell">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg ${
                        isOver ? 'bg-rose-500/15 text-rose-400' : 'bg-brand-500/15 text-brand-400'
                      }`}>
                        {isOver
                          ? <WarningIcon className="h-4 w-4" />
                          : <CheckIcon   className="h-4 w-4" />
                        }
                      </div>
                      <div>
                        <p className="font-semibold text-ink-100">{budget.category}</p>
                        <p className="text-xs text-ink-500">{budget.month}/{budget.year}</p>
                      </div>
                    </div>
                  </td>

                  {/* Limit */}
                  <td className="tbl-cell font-mono text-ink-300">{fmt(budget.limit)}</td>

                  {/* Spent */}
                  <td className="tbl-cell font-mono text-ink-300">{fmt(budget.actualSpending)}</td>

                  {/* Remaining */}
                  <td className={`tbl-cell font-bold font-mono ${budget.remaining >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {fmt(budget.remaining)}
                  </td>

                  {/* Progress bar */}
                  <td className="tbl-cell min-w-[100px]">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 rounded-full bg-ink-800 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${barColor} transition-all duration-500`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-xs text-ink-500 w-8 text-right">{pct.toFixed(0)}%</span>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="tbl-cell">
                    <span className={isOver ? 'badge-danger' : 'badge-success'}>
                      <span className="dot bg-current" />
                      {isOver ? 'Over' : 'OK'}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="tbl-cell text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => onEdit(budget)}
                        className="rounded-lg px-3 py-1.5 text-xs font-semibold text-brand-400 hover:bg-brand-500/10 hover:text-brand-300 transition-all"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onDelete(budget.id)}
                        className="rounded-lg px-3 py-1.5 text-xs font-semibold text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-all"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
