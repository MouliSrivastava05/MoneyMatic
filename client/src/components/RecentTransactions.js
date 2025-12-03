import React from 'react';
import { Link } from 'react-router-dom';
import ArrowUpIcon from '../icons/ArrowUpIcon';
import ArrowDownIcon from '../icons/ArrowDownIcon';
import NoteIcon from '../icons/NoteIcon';

export default function RecentTransactions({ transactions }) {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="lg:col-span-2 card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-ink-900 dark:text-ink-100">
          Recent Transactions
        </h2>
        <Link to="/transactions" className="btn-ghost text-sm">
          View All →
        </Link>
      </div>
      {transactions.length > 0 ? (
        <div className="space-y-3">
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-4 rounded-xl border border-ink-200 dark:border-ink-700 hover:bg-ink-50 dark:hover:bg-ink-800/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                  transaction.type === 'income'
                    ? 'bg-emerald-100 dark:bg-emerald-900/30'
                    : 'bg-rose-100 dark:bg-rose-900/30'
                }`}>
                  {transaction.type === 'income' ? (
                    <ArrowUpIcon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <ArrowDownIcon className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-ink-900 dark:text-ink-100">
                    {transaction.description || transaction.category}
                  </p>
                  <p className="text-sm text-ink-500 dark:text-ink-400">
                    {transaction.category} • {formatDate(transaction.date)}
                  </p>
                </div>
              </div>
              <p className={`font-semibold ${
                transaction.type === 'income'
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-rose-600 dark:text-rose-400'
              }`}>
                {transaction.type === 'income' ? '+' : '-'}
                {formatCurrency(transaction.amount)}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="flex justify-center mb-3">
            <NoteIcon className="w-16 h-16 text-ink-400 dark:text-ink-500" />
          </div>
          <p className="text-ink-600 dark:text-ink-400 mb-4">
            No transactions yet
          </p>
          <Link to="/transactions" className="btn-primary">
            Add Your First Transaction
          </Link>
        </div>
      )}
    </div>
  );
}

