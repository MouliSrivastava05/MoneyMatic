import React from 'react';
import IncomeIcon from '../icons/IncomeIcon';
import ExpenseIcon from '../icons/ExpenseIcon';
import ChartIcon from '../icons/ChartIcon';

export default function TransactionSummaryCards({ transactions }) {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount || 0);
  };

  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalExpenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const netBalance = totalIncome - totalExpenses;

  return (
    <div className="grid gap-6 md:grid-cols-3 mb-8">
      <div className="card bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 border-emerald-200 dark:border-emerald-800">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-10 w-10 rounded-lg bg-emerald-500 flex items-center justify-center">
            <IncomeIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-sm text-ink-600 dark:text-ink-400">Total Income</p>
            <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">
              {formatCurrency(totalIncome)}
            </p>
          </div>
        </div>
      </div>

      <div className="card bg-gradient-to-br from-rose-50 to-rose-100 dark:from-rose-900/20 dark:to-rose-800/20 border-rose-200 dark:border-rose-800">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-10 w-10 rounded-lg bg-rose-500 flex items-center justify-center">
            <ExpenseIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-sm text-ink-600 dark:text-ink-400">Total Expenses</p>
            <p className="text-2xl font-bold text-rose-700 dark:text-rose-300">
              {formatCurrency(totalExpenses)}
            </p>
          </div>
        </div>
      </div>

      <div className="card bg-gradient-to-br from-brand-50 to-brand-100 dark:from-brand-900/20 dark:to-brand-800/20 border-brand-200 dark:border-brand-800">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-10 w-10 rounded-lg bg-brand-500 flex items-center justify-center">
            <ChartIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-sm text-ink-600 dark:text-ink-400">Net Balance</p>
            <p className={`text-2xl font-bold ${
              netBalance >= 0
                ? 'text-emerald-700 dark:text-emerald-300'
                : 'text-rose-700 dark:text-rose-300'
            }`}>
              {formatCurrency(netBalance)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

