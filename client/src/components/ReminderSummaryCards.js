import React from 'react';

const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount || 0);

const getNextReminder = (reminders = []) => {
  if (!reminders.length) return null;
  return reminders.reduce((soonest, current) => {
    if (!soonest) return current;
    return new Date(current.dueDate) < new Date(soonest.dueDate) ? current : soonest;
  }, null);
};

export default function ReminderSummaryCards({ reminders = [] }) {
  const activeReminders = reminders.filter((reminder) => reminder.isActive);
  const totalDue = activeReminders.reduce((sum, reminder) => sum + Number(reminder.amount || 0), 0);
  const overdueCount = activeReminders.filter(
    (reminder) => new Date(reminder.dueDate) < new Date()
  ).length;
  const nextReminder = getNextReminder(
    activeReminders.filter((reminder) => new Date(reminder.dueDate) >= new Date())
  );

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
      <div className="card border-brand-200/80 bg-gradient-to-br from-brand-50 to-brand-100 dark:border-brand-900/30 dark:from-brand-900/20 dark:to-brand-800/10">
        <p className="text-sm font-medium text-ink-500 dark:text-ink-400">Active Reminders</p>
        <p className="mt-2 text-3xl font-semibold text-brand-700 dark:text-brand-300">
          {activeReminders.length}
        </p>
      </div>

      <div className="card border-emerald-200/80 bg-gradient-to-br from-emerald-50 to-emerald-100 dark:border-emerald-900/30 dark:from-emerald-900/20 dark:to-emerald-800/10">
        <p className="text-sm font-medium text-ink-500 dark:text-ink-400">Total Amount Due</p>
        <p className="mt-2 text-3xl font-semibold text-emerald-700 dark:text-emerald-300">
          {formatCurrency(totalDue)}
        </p>
      </div>

      <div className="card border-rose-200/80 bg-gradient-to-br from-rose-50 to-rose-100 dark:border-rose-900/30 dark:from-rose-900/20 dark:to-rose-800/10">
        <p className="text-sm font-medium text-ink-500 dark:text-ink-400">Overdue</p>
        <p className="mt-2 text-3xl font-semibold text-rose-600 dark:text-rose-300">
          {overdueCount}
        </p>
      </div>

      <div className="card border-ink-200/80 bg-gradient-to-br from-ink-50 to-ink-100 dark:border-ink-800/40 dark:from-ink-900/40 dark:to-ink-800/20">
        <p className="text-sm font-medium text-ink-500 dark:text-ink-400">Next Reminder</p>
        {nextReminder ? (
          <div className="mt-2">
            <p className="text-lg font-semibold text-ink-900 dark:text-ink-100">
              {nextReminder.title}
            </p>
            <p className="text-sm text-ink-500 dark:text-ink-400">
              {new Date(nextReminder.dueDate).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
              })}
            </p>
          </div>
        ) : (
          <p className="mt-2 text-lg font-semibold text-ink-400 dark:text-ink-500">No upcoming</p>
        )}
      </div>
    </div>
  );
}


