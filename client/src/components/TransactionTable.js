import React from 'react';
import NoteIcon from '../icons/NoteIcon';
import ArrowUpIcon from '../icons/ArrowUpIcon';
import ArrowDownIcon from '../icons/ArrowDownIcon';

const fmtCurrency = (n) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(n || 0);

const fmtDate = (ds) =>
  new Date(ds).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

export default function TransactionTable({ transactions, onEdit, onDelete }) {
  if (transactions.length === 0) {
    return (
      <div className="card text-center py-14">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-ink-800/60">
          <NoteIcon className="h-8 w-8 text-ink-500" />
        </div>
        <h3 className="text-lg font-bold text-white mb-1">No Transactions Found</h3>
        <p className="text-sm text-ink-400">Try adjusting your filters or add a new transaction.</p>
      </div>
    );
  }

  return (
    <div className="card overflow-hidden !p-0">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/[0.06]">
              <th className="tbl-head-cell">Date</th>
              <th className="tbl-head-cell">Description</th>
              <th className="tbl-head-cell">Category</th>
              <th className="tbl-head-cell">Type</th>
              <th className="tbl-head-cell text-right">Amount</th>
              <th className="tbl-head-cell text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => {
              const isIncome = tx.type === 'income';
              return (
                <tr key={tx.id} className="tbl-row group">
                  {/* Date */}
                  <td className="tbl-cell">
                    <span className="font-mono text-ink-400">{fmtDate(tx.date)}</span>
                  </td>

                  {/* Description */}
                  <td className="tbl-cell max-w-[180px]">
                    <p className="font-semibold text-ink-100 truncate">
                      {tx.description || 'No description'}
                    </p>
                    <p className="text-xs text-ink-500 mt-0.5">Personal</p>
                  </td>

                  {/* Category */}
                  <td className="tbl-cell">
                    <span className="pill">
                      <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
                      {tx.category}
                    </span>
                  </td>

                  {/* Type */}
                  <td className="tbl-cell">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                      isIncome
                        ? 'bg-emerald-500/12 text-emerald-400 border border-emerald-500/20'
                        : 'bg-rose-500/12 text-rose-400 border border-rose-500/20'
                    }`}>
                      {isIncome
                        ? <ArrowUpIcon className="h-3 w-3" />
                        : <ArrowDownIcon className="h-3 w-3" />
                      }
                      {isIncome ? 'Income' : 'Expense'}
                    </span>
                  </td>

                  {/* Amount */}
                  <td className="tbl-cell text-right">
                    <span className={`font-bold font-mono ${isIncome ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {isIncome ? '+' : '−'}{fmtCurrency(tx.amount)}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="tbl-cell text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => onEdit(tx)}
                        className="rounded-lg px-3 py-1.5 text-xs font-semibold text-brand-400 hover:bg-brand-500/10 hover:text-brand-300 transition-all"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onDelete(tx.id)}
                        className="rounded-lg px-3 py-1.5 text-xs font-semibold text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-all"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
