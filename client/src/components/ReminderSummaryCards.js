import React from 'react';
import BellIcon from '../icons/BellIcon';
import WarningIcon from '../icons/WarningIcon';
import ChartIcon from '../icons/ChartIcon';

const fmt = (amount) =>
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

  const cards = [
    {
      label: 'Active Reminders',
      value: activeReminders.length,
      Icon: BellIcon,
      gradient: 'from-brand-500/[0.12] to-brand-600/[0.06]',
      border: 'border-brand-500/20',
      iconBg: 'bg-brand-500/15 text-brand-400',
      valueColor: 'text-brand-400',
      badge: 'badge-brand',
    },
    {
      label: 'Total Amount Due',
      value: fmt(totalDue),
      Icon: ChartIcon,
      gradient: 'from-amber-500/[0.12] to-amber-600/[0.06]',
      border: 'border-amber-500/20',
      iconBg: 'bg-amber-500/15 text-amber-400',
      valueColor: 'text-amber-400',
      badge: 'badge-neutral',
    },
    {
      label: 'Overdue',
      value: overdueCount,
      Icon: WarningIcon,
      gradient: overdueCount > 0 ? 'from-rose-500/[0.12] to-rose-600/[0.06]' : 'from-ink-500/[0.12] to-ink-600/[0.06]',
      border: overdueCount > 0 ? 'border-rose-500/20' : 'border-ink-500/20',
      iconBg: overdueCount > 0 ? 'bg-rose-500/15 text-rose-400' : 'bg-ink-500/15 text-ink-400',
      valueColor: overdueCount > 0 ? 'text-rose-400' : 'text-ink-400',
      badge: overdueCount > 0 ? 'badge-danger' : 'badge-neutral',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
      {cards.map((card, i) => (
        <div
          key={i}
          className={`group relative overflow-hidden rounded-2xl border ${card.border} bg-gradient-to-br ${card.gradient} backdrop-blur-sm p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-elevated`}
        >
          {/* Ambient glow on hover */}
          <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{ background: `radial-gradient(circle at 50% 0%, rgba(20,184,166,0.08), transparent 70%)` }} />

          <div className="flex items-center justify-between mb-4">
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${card.iconBg} transition-transform duration-300 group-hover:scale-110`}>
              <card.Icon className="h-5 w-5" />
            </div>
            <span className={card.badge}>{card.label}</span>
          </div>

          <p className={`text-3xl font-bold font-mono tracking-tight ${card.valueColor} mb-1`}>
            {card.value}
          </p>
          <div className={`pointer-events-none absolute -right-6 -bottom-6 h-20 w-20 rounded-full opacity-20 blur-2xl bg-current ${card.valueColor}`} />
        </div>
      ))}

      {/* Next Reminder Card */}
      <div className="group relative overflow-hidden rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-indigo-500/[0.12] to-indigo-600/[0.06] backdrop-blur-sm p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-elevated">
          <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{ background: `radial-gradient(circle at 50% 0%, rgba(99,102,241,0.08), transparent 70%)` }} />
          
          <div className="flex items-center justify-between mb-4">
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-400 transition-transform duration-300 group-hover:scale-110`}>
              <BellIcon className="h-5 w-5" />
            </div>
            <span className="badge-neutral">Next</span>
          </div>

          {nextReminder ? (
            <div>
              <p className="text-lg font-bold text-indigo-400 mb-1 truncate">{nextReminder.title}</p>
              <p className="text-sm text-indigo-300/70 font-mono">
                {new Date(nextReminder.dueDate).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                })}
              </p>
            </div>
          ) : (
            <p className="text-lg font-semibold text-ink-500">No upcoming</p>
          )}
          <div className="pointer-events-none absolute -right-6 -bottom-6 h-20 w-20 rounded-full opacity-20 blur-2xl bg-current text-indigo-400" />
      </div>

    </div>
  );
}
