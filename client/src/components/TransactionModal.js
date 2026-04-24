import React from 'react';
import { CATEGORY_OPTIONS } from '../constants/categories';
import IncomeIcon from '../icons/IncomeIcon';
import ExpenseIcon from '../icons/ExpenseIcon';
import WarningIcon from '../icons/WarningIcon';

export default function TransactionModal({
  show,
  editingTransaction,
  formData,
  onClose,
  onSubmit,
  onFormChange,
}) {
  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-panel animate-scale-in">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-white">
              {editingTransaction ? 'Edit Transaction' : 'Add Transaction'}
            </h2>
            {editingTransaction && (
              <p className="text-sm text-ink-400 mt-1">
                Modify transaction details
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-500 hover:bg-white/5 hover:text-white transition-colors"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-5">
          {/* Type Toggle */}
          <div>
            <label className="block text-sm font-semibold text-ink-300 mb-2">
              Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => onFormChange('type', 'income')}
                className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${
                  formData.type === 'income'
                    ? 'border-emerald-500/50 bg-emerald-500/10'
                    : 'border-white/10 bg-white/5 hover:border-emerald-500/30'
                }`}
              >
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${formData.type === 'income' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-ink-800 text-ink-500'}`}>
                  <IncomeIcon className="w-5 h-5" />
                </div>
                <span className={`text-sm font-semibold ${formData.type === 'income' ? 'text-emerald-400' : 'text-ink-400'}`}>
                  Income
                </span>
              </button>

              <button
                type="button"
                onClick={() => onFormChange('type', 'expense')}
                className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${
                  formData.type === 'expense'
                    ? 'border-rose-500/50 bg-rose-500/10'
                    : 'border-white/10 bg-white/5 hover:border-rose-500/30'
                }`}
              >
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${formData.type === 'expense' ? 'bg-rose-500/20 text-rose-400' : 'bg-ink-800 text-ink-500'}`}>
                  <ExpenseIcon className="w-5 h-5" />
                </div>
                <span className={`text-sm font-semibold ${formData.type === 'expense' ? 'text-rose-400' : 'text-ink-400'}`}>
                  Expense
                </span>
              </button>
            </div>
            
            {editingTransaction && editingTransaction.type !== formData.type && (
              <div className="mt-3 flex items-start gap-2 rounded-lg bg-amber-500/10 p-3 border border-amber-500/20">
                <WarningIcon className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-300">
                  Changing type from <strong className="font-bold">{editingTransaction.type}</strong> to <strong className="font-bold">{formData.type}</strong>
                </p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Amount */}
            <div>
              <label className="block text-sm font-semibold text-ink-300 mb-2">Amount</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-500 font-mono">$</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  value={formData.amount}
                  onChange={(e) => onFormChange('amount', e.target.value)}
                  className="input pl-8 font-mono"
                  placeholder="0.00"
                />
              </div>
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-semibold text-ink-300 mb-2">Date</label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => onFormChange('date', e.target.value)}
                className="input"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-semibold text-ink-300 mb-2">Category</label>
            <select
              required
              value={formData.category}
              onChange={(e) => onFormChange('category', e.target.value)}
              className="input"
            >
              <option value="" disabled>Select category</option>
              {CATEGORY_OPTIONS.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-ink-300 mb-2">Description</label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => onFormChange('description', e.target.value)}
              className="input"
              placeholder="e.g. Grocery shopping"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-white/[0.06] mt-6">
            <button type="button" onClick={onClose} className="btn-ghost flex-1">
              Cancel
            </button>
            <button type="submit" className="btn-primary flex-1">
              {editingTransaction ? 'Save Changes' : 'Add Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
