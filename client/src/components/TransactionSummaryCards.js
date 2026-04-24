import React from 'react';
import IncomeIcon from '../icons/IncomeIcon';
import ExpenseIcon from '../icons/ExpenseIcon';
import ChartIcon from '../icons/ChartIcon';

const fmt = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount || 0);
};

export default function TransactionSummaryCards({ transactions }) {
  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalExpenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const netBalance = totalIncome - totalExpenses;

  const cards = [
    {
      label: 'Total Income',
      value: fmt(totalIncome),
      Icon: IncomeIcon,
      gradient: 'from-emerald-500/[0.12] to-emerald-600/[0.06]',
      border: 'border-emerald-500/20',
      iconBg: 'bg-emerald-500/15 text-emerald-400',
      valueColor: 'text-emerald-400',
      badge: 'badge-success',
    },
    {
      label: 'Total Expenses',
      value: fmt(totalExpenses),
      Icon: ExpenseIcon,
      gradient: 'from-rose-500/[0.12] to-rose-600/[0.06]',
      border: 'border-rose-500/20',
      iconBg: 'bg-rose-500/15 text-rose-400',
      valueColor: 'text-rose-400',
      badge: 'badge-danger',
    },
    {
      label: 'Net Balance',
      value: fmt(netBalance),
      Icon: ChartIcon,
      gradient: netBalance >= 0 ? 'from-brand-500/[0.12] to-brand-600/[0.06]' : 'from-rose-500/[0.12] to-rose-600/[0.06]',
      border: netBalance >= 0 ? 'border-brand-500/20' : 'border-rose-500/20',
      iconBg: netBalance >= 0 ? 'bg-brand-500/15 text-brand-400' : 'bg-rose-500/15 text-rose-400',
      valueColor: netBalance >= 0 ? 'text-brand-400' : 'text-rose-400',
      badge: netBalance >= 0 ? 'badge-brand' : 'badge-danger',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3 mb-8">
      {cards.map((card, i) => (
        <div
          key={i}
          className={`group relative overflow-hidden rounded-2xl border ${card.border} bg-gradient-to-br ${card.gradient} backdrop-blur-sm p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-elevated`}
        >
          {/* Ambient glow on hover */}
          <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{ background: `radial-gradient(circle at 50% 0%, rgba(20,184,166,0.08), transparent 70%)` }} />

          {/* Top row: icon */}
          <div className="flex items-center justify-between mb-4">
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${card.iconBg} transition-transform duration-300 group-hover:scale-110`}>
              <card.Icon className="h-5 w-5" />
            </div>
            <span className={card.badge}>{card.label}</span>
          </div>

          {/* Value */}
          <p className={`text-3xl font-bold font-mono tracking-tight ${card.valueColor} mb-1`}>
            {card.value}
          </p>

          {/* Decorative corner blob */}
          <div className={`pointer-events-none absolute -right-6 -bottom-6 h-20 w-20 rounded-full opacity-20 blur-2xl bg-current ${card.valueColor}`} />
        </div>
      ))}
    </div>
  );
}
