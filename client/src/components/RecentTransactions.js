import React from 'react';
import { Link } from 'react-router-dom';
import ArrowUpIcon from '../icons/ArrowUpIcon';
import ArrowDownIcon from '../icons/ArrowDownIcon';
import NoteIcon from '../icons/NoteIcon';

const fmtCurrency = (n) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(n || 0);

const fmtDate = (ds) =>
  new Date(ds).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

export default function RecentTransactions({ transactions }) {
  return (
    <div className="card h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="eyebrow mb-0.5">Activity</p>
          <h2 className="section-title text-xl">Recent Transactions</h2>
        </div>
        <Link to="/transactions" className="btn btn-ghost btn-sm">
          View all →
        </Link>
      </div>

      {transactions.length > 0 ? (
        <div className="space-y-2 flex-1">
          {transactions.map((tx, i) => {
            const isIncome = tx.type === 'income';
            return (
              <div
                key={tx.id}
                className="flex items-center gap-3 rounded-xl px-3 py-3 transition-all duration-200 hover:bg-white/[0.03] group"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                {/* Icon */}
                <div className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-110 ${
                  isIncome ? 'bg-emerald-500/15 text-emerald-400' : 'bg-rose-500/15 text-rose-400'
                }`}>
                  {isIncome
                    ? <ArrowUpIcon className="h-4 w-4" />
                    : <ArrowDownIcon className="h-4 w-4" />
                  }
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-ink-100 truncate">
                    {tx.description || tx.category}
                  </p>
                  <p className="text-xs text-ink-500">
                    {tx.category} · {fmtDate(tx.date)}
                  </p>
                </div>

                {/* Amount */}
                <span className={`text-sm font-bold font-mono flex-shrink-0 ${
                  isIncome ? 'text-emerald-400' : 'text-rose-400'
                }`}>
                  {isIncome ? '+' : '−'}{fmtCurrency(tx.amount)}
                </span>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center py-10 text-center">
          <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-ink-800/60">
            <NoteIcon className="h-8 w-8 text-ink-500" />
          </div>
          <p className="text-sm font-semibold text-ink-300 mb-1">No transactions yet</p>
          <p className="text-xs text-ink-500 mb-4">Start tracking by adding your first entry</p>
          <Link to="/transactions" className="btn-primary btn-sm">
            Add Transaction
          </Link>
        </div>
      )}
    </div>
  );
}
