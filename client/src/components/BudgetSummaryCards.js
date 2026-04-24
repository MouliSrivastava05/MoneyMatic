import React from 'react';
import ChartIcon from '../icons/ChartIcon';
import WarningIcon from '../icons/WarningIcon';
import CheckIcon from '../icons/CheckIcon';
import IncomeIcon from '../icons/IncomeIcon';

export default function BudgetSummaryCards({ budgetData }) {
  const totalBudget = budgetData?.budgets?.reduce(
    (sum, budget) => sum + Number(budget.limit || 0),
    0
  );

  const totalSpent = budgetData?.budgets?.reduce(
    (sum, budget) => sum + Number(budget.actualSpending || 0),
    0
  );

  const remaining = totalBudget - totalSpent;
  const activeBudgets = budgetData?.budgets?.length || 0;

  const fmt = (amount) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount || 0);

  const cards = [
    {
      label: 'Total Budget',
      value: fmt(totalBudget),
      Icon: ChartIcon,
      gradient: 'from-brand-500/[0.12] to-brand-600/[0.06]',
      border: 'border-brand-500/20',
      iconBg: 'bg-brand-500/15 text-brand-400',
      valueColor: 'text-brand-400',
      badge: 'badge-brand',
    },
    {
      label: 'Actual Spending',
      value: fmt(totalSpent),
      Icon: WarningIcon,
      gradient: 'from-rose-500/[0.12] to-rose-600/[0.06]',
      border: 'border-rose-500/20',
      iconBg: 'bg-rose-500/15 text-rose-400',
      valueColor: 'text-rose-400',
      badge: 'badge-danger',
    },
    {
      label: 'Remaining',
      value: fmt(remaining),
      Icon: remaining >= 0 ? CheckIcon : WarningIcon,
      gradient: remaining >= 0 ? 'from-emerald-500/[0.12] to-emerald-600/[0.06]' : 'from-rose-500/[0.12] to-rose-600/[0.06]',
      border: remaining >= 0 ? 'border-emerald-500/20' : 'border-rose-500/20',
      iconBg: remaining >= 0 ? 'bg-emerald-500/15 text-emerald-400' : 'bg-rose-500/15 text-rose-400',
      valueColor: remaining >= 0 ? 'text-emerald-400' : 'text-rose-400',
      badge: remaining >= 0 ? 'badge-success' : 'badge-danger',
    },
    {
      label: 'Active Budgets',
      value: activeBudgets,
      Icon: IncomeIcon,
      gradient: 'from-indigo-500/[0.12] to-indigo-600/[0.06]',
      border: 'border-indigo-500/20',
      iconBg: 'bg-indigo-500/15 text-indigo-400',
      valueColor: 'text-indigo-400',
      badge: 'badge-neutral',
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
