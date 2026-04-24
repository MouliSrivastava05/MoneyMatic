import React from 'react';
import IncomeIcon from '../icons/IncomeIcon';
import ExpenseIcon from '../icons/ExpenseIcon';
import SavingsIcon from '../icons/SavingsIcon';
import ChartDownIcon from '../icons/ChartDownIcon';
import ChartIcon from '../icons/ChartIcon';

const fmt = (n) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency', currency: 'USD',
    minimumFractionDigits: 0, maximumFractionDigits: 0,
  }).format(n || 0);

const CARDS_META = (totalIncome, totalExpenses, totalBalance, savingsRate, expenseRatio) => [
  {
    label: 'Total Income',
    value: fmt(totalIncome),
    Icon: IncomeIcon,
    accentColor: 'emerald',
    gradient: 'from-emerald-500/[0.12] to-emerald-600/[0.06]',
    border: 'border-emerald-500/20',
    iconBg: 'bg-emerald-500/15 text-emerald-400',
    valueColor: 'text-emerald-400',
    badge: 'badge-success',
    badgeLabel: 'Income',
    sub: null,
  },
  {
    label: 'Total Expenses',
    value: fmt(totalExpenses),
    Icon: ExpenseIcon,
    accentColor: 'rose',
    gradient: 'from-rose-500/[0.12] to-rose-600/[0.06]',
    border: 'border-rose-500/20',
    iconBg: 'bg-rose-500/15 text-rose-400',
    valueColor: 'text-rose-400',
    badge: 'badge-danger',
    badgeLabel: 'Expenses',
    sub: totalIncome > 0 ? `${expenseRatio}% of income` : null,
  },
  {
    label: 'Net Balance',
    value: fmt(totalBalance),
    Icon: totalBalance >= 0 ? SavingsIcon : ChartDownIcon,
    accentColor: totalBalance >= 0 ? 'emerald' : 'rose',
    gradient: totalBalance >= 0 ? 'from-emerald-500/[0.12] to-emerald-600/[0.06]' : 'from-rose-500/[0.12] to-rose-600/[0.06]',
    border: totalBalance >= 0 ? 'border-emerald-500/20' : 'border-rose-500/20',
    iconBg: totalBalance >= 0 ? 'bg-emerald-500/15 text-emerald-400' : 'bg-rose-500/15 text-rose-400',
    valueColor: totalBalance >= 0 ? 'text-emerald-400' : 'text-rose-400',
    badge: totalBalance >= 0 ? 'badge-success' : 'badge-danger',
    badgeLabel: totalBalance >= 0 ? 'Savings' : 'Deficit',
    sub: null,
  },
  {
    label: 'Savings Rate',
    value: `${savingsRate}%`,
    Icon: ChartIcon,
    accentColor: 'brand',
    gradient: 'from-brand-500/[0.12] to-brand-600/[0.06]',
    border: 'border-brand-500/20',
    iconBg: 'bg-brand-500/15 text-brand-400',
    valueColor: 'text-brand-400',
    badge: 'badge-brand',
    badgeLabel: 'Rate',
    sub: totalIncome > 0 ? `${(100 - parseFloat(expenseRatio)).toFixed(1)}% surplus` : 'No income yet',
  },
];

export default function DashboardStatsCards({ budgetData }) {
  const totalIncome   = budgetData?.summary?.totalIncome   || 0;
  const totalExpenses = budgetData?.summary?.totalExpenses || 0;
  const totalBalance  = totalIncome - totalExpenses;

  const savingsRate  = totalIncome > 0 ? ((totalBalance  / totalIncome) * 100).toFixed(1) : 0;
  const expenseRatio = totalIncome > 0 ? ((totalExpenses / totalIncome) * 100).toFixed(1) : 0;

  const cards = CARDS_META(totalIncome, totalExpenses, totalBalance, savingsRate, expenseRatio);

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, i) => (
        <div
          key={i}
          className={`group relative overflow-hidden rounded-2xl border ${card.border} bg-gradient-to-br ${card.gradient} backdrop-blur-sm p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-elevated`}
          style={{ animationDelay: `${i * 0.07}s` }}
        >
          {/* Ambient glow on hover */}
          <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{ background: `radial-gradient(circle at 50% 0%, rgba(20,184,166,0.08), transparent 70%)` }} />

          {/* Top row: icon + badge */}
          <div className="flex items-center justify-between mb-4">
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${card.iconBg} transition-transform duration-300 group-hover:scale-110`}>
              <card.Icon className="h-5 w-5" />
            </div>
            <span className={card.badge}>{card.badgeLabel}</span>
          </div>

          {/* Label */}
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-ink-500 mb-1.5">
            {card.label}
          </p>

          {/* Value */}
          <p className={`text-3xl font-bold font-mono tracking-tight ${card.valueColor} mb-1`}>
            {card.value}
          </p>

          {/* Subtext */}
          {card.sub && (
            <p className="text-xs text-ink-500 font-medium">{card.sub}</p>
          )}

          {/* Decorative corner blob */}
          <div className={`pointer-events-none absolute -right-6 -bottom-6 h-20 w-20 rounded-full opacity-20 blur-2xl bg-current ${card.valueColor}`} />
        </div>
      ))}
    </div>
  );
}
