import React from 'react';

const categories = [
  'Food & Dining',
  'Shopping',
  'Transportation',
  'Bills & Utilities',
  'Entertainment',
  'Healthcare',
  'Education',
  'Travel',
  'Salary',
  'Freelance',
  'Investment',
  'Other',
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
          <h2 className="text-2xl font-bold text-ink-900 dark:text-ink-100">
            {editingTransaction ? 'Edit Transaction' : 'Add Transaction'}
          </h2>
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
              Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => onFormChange('type', 'income')}
                className={`p-3 rounded-xl border-2 transition-all ${
                  formData.type === 'income'
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                    : 'border-ink-200 dark:border-ink-700'
                }`}
              >
                <div className="text-2xl mb-1">💰</div>
                <div className="font-medium text-sm">Income</div>
              </button>
              <button
                type="button"
                onClick={() => onFormChange('type', 'expense')}
                className={`p-3 rounded-xl border-2 transition-all ${
                  formData.type === 'expense'
                    ? 'border-rose-500 bg-rose-50 dark:bg-rose-900/20'
                    : 'border-ink-200 dark:border-ink-700'
                }`}
              >
                <div className="text-2xl mb-1">💸</div>
                <div className="font-medium text-sm">Expense</div>
              </button>
            </div>
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

