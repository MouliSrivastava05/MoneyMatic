import React from 'react';
import IncomeIcon from '../icons/IncomeIcon';
import ExpenseIcon from '../icons/ExpenseIcon';
import SavingsIcon from '../icons/SavingsIcon';
import ChartDownIcon from '../icons/ChartDownIcon';
import ChartIcon from '../icons/ChartIcon';

export default function DashboardStatsCards({ budgetData }) {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  const totalIncome = budgetData?.summary?.totalIncome || 0;
  const totalExpenses = budgetData?.summary?.totalExpenses || 0;
  const totalBalance = totalIncome - totalExpenses;

  const savingsRate = totalIncome > 0
    ? ((totalBalance / totalIncome) * 100).toFixed(1)
    : 0;

  const expenseRatio = totalIncome > 0
    ? ((totalExpenses / totalIncome) * 100).toFixed(1)
    : 0;

  const cards = [
    {
      label: 'Total Income',
      value: formatCurrency(totalIncome),
      Icon: IncomeIcon,
      color: 'emerald',
      badge: 'Income',
      gradient: 'from-emerald-500/20 to-emerald-600/10',
      borderColor: 'border-emerald-500/30',
      iconBg: 'bg-emerald-500',
      textColor: 'text-emerald-600 dark:text-emerald-400',
      badgeColor: 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300',
    },
    {
      label: 'Total Expenses',
      value: formatCurrency(totalExpenses),
      Icon: ExpenseIcon,
      color: 'rose',
      badge: 'Expenses',
      gradient: 'from-rose-500/20 to-rose-600/10',
      borderColor: 'border-rose-500/30',
      iconBg: 'bg-rose-500',
      textColor: 'text-rose-600 dark:text-rose-400',
      badgeColor: 'bg-rose-500/20 text-rose-700 dark:text-rose-300',
      subtext: `${expenseRatio}% of income`,
    },
    {
      label: 'Net Balance',
      value: formatCurrency(totalBalance),
      Icon: totalBalance >= 0 ? SavingsIcon : ChartDownIcon,
      color: totalBalance >= 0 ? 'emerald' : 'rose',
      badge: totalBalance >= 0 ? 'Savings' : 'Deficit',
      gradient: totalBalance >= 0 
        ? 'from-emerald-500/20 to-emerald-600/10' 
        : 'from-rose-500/20 to-rose-600/10',
      borderColor: totalBalance >= 0 
        ? 'border-emerald-500/30' 
        : 'border-rose-500/30',
      iconBg: totalBalance >= 0 ? 'bg-emerald-500' : 'bg-rose-500',
      textColor: totalBalance >= 0 
        ? 'text-emerald-600 dark:text-emerald-400' 
        : 'text-rose-600 dark:text-rose-400',
      badgeColor: totalBalance >= 0
        ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300'
        : 'bg-rose-500/20 text-rose-700 dark:text-rose-300',
    },
    {
      label: 'Savings Rate',
      value: `${savingsRate}%`,
      Icon: ChartIcon,
      color: 'brand',
      badge: 'Rate',
      gradient: 'from-brand-500/20 to-brand-600/10',
      borderColor: 'border-brand-500/30',
      iconBg: 'bg-brand-500',
      textColor: 'text-brand-600 dark:text-brand-400',
      badgeColor: 'bg-brand-500/20 text-brand-700 dark:text-brand-300',
      subtext: totalIncome > 0 ? `${(100 - parseFloat(expenseRatio)).toFixed(1)}% remaining` : 'No income',
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => (
        <div
          key={index}
          className={`group relative overflow-hidden rounded-2xl border-2 ${card.borderColor} bg-gradient-to-br ${card.gradient} backdrop-blur-sm p-6 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-${card.color}-500/20`}
        >
          {/* Animated background glow */}
          <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl`} />
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className={`h-14 w-14 rounded-2xl ${card.iconBg} flex items-center justify-center shadow-lg transform group-hover:rotate-12 transition-transform duration-300`}>
                <card.Icon className="w-8 h-8 text-white" />
              </div>
              <span className={`text-xs font-semibold ${card.badgeColor} px-3 py-1.5 rounded-full backdrop-blur-sm`}>
                {card.badge}
              </span>
            </div>
            
            <h3 className="text-sm font-medium text-ink-600 dark:text-ink-400 mb-2 uppercase tracking-wide">
              {card.label}
            </h3>
            
            <p className={`text-4xl font-bold ${card.textColor} mb-2 transition-all duration-300`}>
              {card.value}
            </p>
            
            {card.subtext && (
              <p className="text-xs text-ink-500 dark:text-ink-400 font-medium">
                {card.subtext}
              </p>
            )}
          </div>

          {/* Decorative corner element */}
          <div className={`absolute -bottom-8 -right-8 h-24 w-24 rounded-full ${card.iconBg} opacity-10 blur-2xl`} />
        </div>
      ))}
    </div>
  );
}

