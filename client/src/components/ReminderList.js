import React from 'react';
import BellIcon from '../icons/BellIcon';

const frequencyLabels = {
  'one-time': 'One-time',
  weekly: 'Weekly',
  monthly: 'Monthly',
  yearly: 'Yearly',
};

const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount || 0);

const formatDate = (date) =>
  new Date(date).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

export default function ReminderList({
  reminders = [],
  onEdit,
  onToggleActive,
  loading,
  emptyMessage = 'Create a reminder to track upcoming bills and renewals.',
}) {
  if (loading) {
    return (
      <div className="card flex items-center justify-center py-12">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-ink-200 border-t-brand-500" />
      </div>
    );
  }

  if (!reminders.length) {
    return (
      <div className="card text-center py-12">
        <div className="flex justify-center mb-4">
          <BellIcon className="w-20 h-20 text-ink-400 dark:text-ink-500" />
        </div>
        <h3 className="text-xl font-semibold text-ink-900 dark:text-ink-100 mb-2">No Reminders</h3>
        <p className="text-ink-600 dark:text-ink-400">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-ink-200 dark:border-ink-700">
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-ink-500">
                Title
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-ink-500">
                Due Date
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-ink-500">
                Amount
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-ink-500">
                Frequency
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-ink-500">
                Notes
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-ink-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {reminders.map((reminder) => (
              <tr
                key={reminder.id}
                className="border-b border-ink-100 dark:border-ink-800 hover:bg-ink-50/60 dark:hover:bg-ink-800/30 transition"
              >
                <td className="px-4 py-4">
                  <div className="font-medium text-ink-900 dark:text-ink-50">{reminder.title}</div>
                  <span
                    className={`mt-1 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      reminder.isActive
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
                        : 'bg-ink-100 text-ink-600 dark:bg-ink-800/40 dark:text-ink-300'
                    }`}
                  >
                    {reminder.isActive ? 'Active' : 'Paused'}
                  </span>
                </td>
                <td className="px-4 py-4 text-ink-600 dark:text-ink-300">
                  {formatDate(reminder.dueDate)}
                </td>
                <td className="px-4 py-4 text-ink-900 dark:text-ink-100 font-semibold">
                  {reminder.amount ? formatCurrency(reminder.amount) : '—'}
                </td>
                <td className="px-4 py-4 text-ink-600 dark:text-ink-300">
                  {frequencyLabels[reminder.frequency] || reminder.frequency}
                </td>
                <td className="px-4 py-4 text-ink-600 dark:text-ink-300">
                  {reminder.notes || '—'}
                </td>
                <td className="px-4 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      className="btn-ghost text-sm"
                      onClick={() => onEdit(reminder)}
                      type="button"
                    >
                      Edit
                    </button>
                    <button
                      className={`text-sm font-medium ${
                        reminder.isActive
                          ? 'text-rose-600 dark:text-rose-400'
                          : 'text-emerald-600 dark:text-emerald-300'
                      }`}
                      onClick={() => onToggleActive(reminder)}
                      type="button"
                    >
                      {reminder.isActive ? 'Pause' : 'Resume'}
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


