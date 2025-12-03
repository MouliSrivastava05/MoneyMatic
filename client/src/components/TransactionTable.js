import React from 'react';
import NoteIcon from '../icons/NoteIcon';
import ArrowUpIcon from '../icons/ArrowUpIcon';
import ArrowDownIcon from '../icons/ArrowDownIcon';

export default function TransactionTable({ transactions, onEdit, onDelete }) {
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
      year: 'numeric',
    });
  };

  if (transactions.length === 0) {
    return (
      <div className="card text-center py-12">
        <div className="flex justify-center mb-4">
          <NoteIcon className="w-20 h-20 text-ink-400 dark:text-ink-500" />
        </div>
        <h3 className="text-xl font-semibold text-ink-900 dark:text-ink-100 mb-2">
          No Transactions Found
        </h3>
        <p className="text-ink-600 dark:text-ink-400">
          Try adjusting your filters or add a new transaction.
        </p>
      </div>
    );
  }

  const cellBase =
    'py-4 px-4 text-sm bg-white/85 dark:bg-ink-900/70 backdrop-blur border border-white/40 dark:border-ink-800/40 first:rounded-l-2xl last:rounded-r-2xl align-middle';

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full border-separate border-spacing-y-3">
          <thead>
            <tr className="text-xs uppercase tracking-[0.3em] text-ink-500 dark:text-ink-400">
              <th className="pb-2 pl-2 text-left">Date</th>
              <th className="pb-2 text-left">Description</th>
              <th className="pb-2 text-left">Category</th>
              <th className="pb-2 text-left">Type</th>
              <th className="pb-2 pr-2 text-right">Amount</th>
              <th className="pb-2 pr-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction.id} className="text-ink-800 dark:text-ink-50">
                <td className={`${cellBase} text-ink-600 dark:text-ink-300`}>
                  {formatDate(transaction.date)}
                </td>
                <td className={`${cellBase}`}>
                  <div className="font-medium text-ink-900 dark:text-white">
                    {transaction.description || 'No description'}
                  </div>
                  <p className="text-xs text-ink-400 dark:text-ink-500 mt-1">{transaction.account || 'Personal'}</p>
                </td>
                <td className={`${cellBase}`}>
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/80 px-3 py-1 text-xs font-semibold text-ink-600 dark:border-ink-700 dark:bg-ink-800/60 dark:text-ink-200">
                    <span className="h-2 w-2 rounded-full bg-brand-500" />
                    {transaction.category}
                  </span>
                </td>
                <td className={`${cellBase}`}>
                    <span
                    className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
                      transaction.type === 'income'
                        ? 'bg-emerald-500/15 text-emerald-300'
                        : 'bg-rose-500/15 text-rose-300'
                    }`}
                  >
                    {transaction.type === 'income' ? (
                      <ArrowUpIcon className="w-4 h-4" />
                    ) : (
                      <ArrowDownIcon className="w-4 h-4" />
                    )}
                    {transaction.type === 'income' ? 'Income' : 'Expense'}
                  </span>
                </td>
                <td className={`${cellBase} text-right`}>
                  <span
                    className={`text-lg font-semibold ${
                      transaction.type === 'income' ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {transaction.type === 'income' ? '+' : '-'}
                    {formatCurrency(transaction.amount)}
                  </span>
                </td>
                <td className={`${cellBase} text-right`}>
                  <div className="flex items-center justify-end gap-2 text-sm font-medium">
                    <button
                      onClick={() => onEdit(transaction)}
                      className="text-brand-400 hover:text-brand-300 transition"
                    >
                      Edit
                    </button>
                    <span className="h-5 w-px bg-white/30 dark:bg-ink-700" />
                    <button
                      onClick={() => onDelete(transaction.id)}
                      className="text-rose-400 hover:text-rose-300 transition"
                    >
                      Delete
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

