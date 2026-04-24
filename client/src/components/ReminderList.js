import React from 'react';
import BellIcon from '../icons/BellIcon';

const frequencyLabels = {
  'one-time': 'One-time',
  weekly: 'Weekly',
  monthly: 'Monthly',
  yearly: 'Yearly',
};

const fmt = (n) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(n || 0);

const fmtDate = (d) =>
  new Date(d).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });

function getDueSoonClass(dueDate) {
  const days = Math.ceil((new Date(dueDate) - new Date()) / (1000 * 60 * 60 * 24));
  if (days < 0) return 'text-rose-400';
  if (days <= 3) return 'text-amber-400';
  return 'text-ink-300';
}

export default function ReminderList({ reminders = [], onEdit, onToggleActive, loading, emptyMessage = 'Create a reminder to track upcoming bills and renewals.' }) {
  if (loading) {
    return (
      <div className="card flex items-center justify-center py-14">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-ink-700 border-t-brand-500" />
      </div>
    );
  }

  if (!reminders.length) {
    return (
      <div className="card text-center py-14">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-ink-800/60">
          <BellIcon className="h-8 w-8 text-ink-500" />
        </div>
        <h3 className="text-lg font-bold text-white mb-1">No Reminders</h3>
        <p className="text-sm text-ink-400">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="card overflow-hidden !p-0">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/[0.06]">
              <th className="tbl-head-cell">Title</th>
              <th className="tbl-head-cell">Due Date</th>
              <th className="tbl-head-cell">Amount</th>
              <th className="tbl-head-cell">Frequency</th>
              <th className="tbl-head-cell">Notes</th>
              <th className="tbl-head-cell text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reminders.map((r) => (
              <tr key={r.id} className="tbl-row group">
                {/* Title + status */}
                <td className="tbl-cell">
                  <div className="flex items-center gap-2.5">
                    <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg ${
                      r.isActive ? 'bg-brand-500/15 text-brand-400' : 'bg-ink-800 text-ink-500'
                    }`}>
                      <BellIcon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-ink-100">{r.title}</p>
                      <span className={r.isActive ? 'badge-success' : 'badge-neutral'}>
                        {r.isActive ? 'Active' : 'Paused'}
                      </span>
                    </div>
                  </div>
                </td>

                {/* Due date */}
                <td className={`tbl-cell font-mono font-semibold ${getDueSoonClass(r.dueDate)}`}>
                  {fmtDate(r.dueDate)}
                </td>

                {/* Amount */}
                <td className="tbl-cell font-mono text-ink-200 font-semibold">
                  {r.amount ? fmt(r.amount) : <span className="text-ink-600">—</span>}
                </td>

                {/* Frequency */}
                <td className="tbl-cell">
                  <span className="badge-neutral">
                    {frequencyLabels[r.frequency] || r.frequency}
                  </span>
                </td>

                {/* Notes */}
                <td className="tbl-cell max-w-[140px]">
                  <span className="text-ink-400 truncate block text-xs">
                    {r.notes || <span className="text-ink-600">—</span>}
                  </span>
                </td>

                {/* Actions */}
                <td className="tbl-cell text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => onEdit(r)}
                      className="rounded-lg px-3 py-1.5 text-xs font-semibold text-brand-400 hover:bg-brand-500/10 hover:text-brand-300 transition-all"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onToggleActive(r)}
                      className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                        r.isActive
                          ? 'text-amber-400 hover:bg-amber-500/10 hover:text-amber-300'
                          : 'text-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-300'
                      }`}
                    >
                      {r.isActive ? 'Pause' : 'Resume'}
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
