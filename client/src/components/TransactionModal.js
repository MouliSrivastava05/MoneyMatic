import React from 'react';

const categories = ['Food & Dining', 'Shopping', 'Transportation',
  'Bills & Utilities', 'Entertainment', 'Healthcare',
  'Education', 'Travel', 'Salary', 'Freelance',
  'Investment','Other',
];

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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="card max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-ink-900 dark:text-ink-100">
              {editingTransaction ? 'Edit Transaction' : 'Add Transaction'}
            </h2>
            {editingTransaction && (
              <p className="text-sm text-ink-500 dark:text-ink-400 mt-1">
                You can change the type (Income/Expense) and all other fields
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-ink-400 hover:text-ink-600 dark:hover:text-ink-300"
          >
            ✕
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          {/* Type */}
          <div>
            <label className="block text-sm font-medium text-ink-700 dark:text-ink-300 mb-2">
              Transaction Type
              {editingTransaction && (
                <span className="ml-2 text-xs text-ink-500 dark:text-ink-400">
                  (Click to change)
                </span>
              )}
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => onFormChange('type', 'income')}
                className={`p-4 rounded-xl border-2 transition-all ${
                  formData.type === 'income'
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 shadow-md'
                    : 'border-ink-200 dark:border-ink-700 hover:border-emerald-300 dark:hover:border-emerald-700'
                }`}
              >
                <div className="text-3xl mb-2">💰</div>
                <div className="font-semibold text-sm">Income</div>
                {formData.type === 'income' && (
                  <div className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">
                    Selected
                  </div>
                )}
              </button>
              <button
                type="button"
                onClick={() => onFormChange('type', 'expense')}
                className={`p-4 rounded-xl border-2 transition-all ${
                  formData.type === 'expense'
                    ? 'border-rose-500 bg-rose-50 dark:bg-rose-900/20 shadow-md'
                    : 'border-ink-200 dark:border-ink-700 hover:border-rose-300 dark:hover:border-rose-700'
                }`}
              >
                <div className="text-3xl mb-2">💸</div>
                <div className="font-semibold text-sm">Expense</div>
                {formData.type === 'expense' && (
                  <div className="text-xs text-rose-600 dark:text-rose-400 mt-1">
                    Selected
                  </div>
                )}
              </button>
            </div>
            {editingTransaction && editingTransaction.type !== formData.type && (
              <div className="mt-2 p-2 rounded-lg bg-brand-50 dark:bg-brand-900/20 border border-brand-200 dark:border-brand-800">
                <p className="text-xs text-brand-700 dark:text-brand-300">
                  ⚠️ Type changed from <strong>{editingTransaction.type}</strong> to <strong>{formData.type}</strong>
                </p>
              </div>
            )}
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-ink-700 dark:text-ink-300 mb-2">
              Amount
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              required
              value={formData.amount}
              onChange={(e) => onFormChange('amount', e.target.value)}
              className="input"
              placeholder="0.00"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-ink-700 dark:text-ink-300 mb-2">
              Category
            </label>
            <select
              required
              value={formData.category}
              onChange={(e) => onFormChange('category', e.target.value)}
              className="input"
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-ink-700 dark:text-ink-300 mb-2">
              Description
            </label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => onFormChange('description', e.target.value)}
              className="input"
              placeholder="Add a description (optional)"
            />
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-ink-700 dark:text-ink-300 mb-2">
              Date
            </label>
            <input
              type="date"
              required
              value={formData.date}
              onChange={(e) => onFormChange('date', e.target.value)}
              className="input"
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="btn-ghost flex-1">
              Cancel
            </button>
            <button type="submit" className="btn-primary flex-1">
              {editingTransaction ? 'Update' : 'Add'} Transaction
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

