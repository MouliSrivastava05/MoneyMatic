import React from 'react';
import { createPortal } from 'react-dom';
import { CATEGORY_OPTIONS } from '../constants/categories';
import CloseIcon from '../icons/CloseIcon';

export default function BudgetModal({
  show,
  editingBudget,
  formData,
  onClose,
  onSubmit,
  onFieldChange,
}) {
  if (!show) return null;

  const title = editingBudget ? 'Edit Budget' : 'New Budget';
  const submitLabel = editingBudget ? 'Update Budget' : 'Create Budget';
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 6 }).map((_, index) => currentYear - 2 + index);

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md">
        <div className="card max-h-[90vh] overflow-y-auto">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-ink-900 dark:text-ink-100">
                {title}
              </h2>
              {editingBudget && (
                <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">
                  Adjust the values below and save your changes.
                </p>
              )}
            </div>
            <button
              type="button"
              className="text-ink-400 hover:text-rose-500 dark:text-ink-300"
              onClick={onClose}
              aria-label="Close dialog"
            >
              <CloseIcon className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-ink-600 dark:text-ink-300">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => onFieldChange('category', e.target.value)}
                className="input"
                required
              >
                <option value="">Select category</option>
                {CATEGORY_OPTIONS.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-ink-600 dark:text-ink-300">
                Monthly Limit
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.limit}
                onChange={(e) => onFieldChange('limit', e.target.value)}
                className="input"
                placeholder="e.g. 500"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-2 block text-sm font-medium text-ink-600 dark:text-ink-300">
                  Month
                </label>
                <select
                  value={formData.month}
                  onChange={(e) => onFieldChange('month', e.target.value)}
                  className="input"
                  required
                >
                  {Array.from({ length: 12 }).map((_, index) => (
                    <option key={index + 1} value={index + 1}>
                      {new Date(0, index).toLocaleString('default', { month: 'long' })}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-ink-600 dark:text-ink-300">
                  Year
                </label>
                <select
                  value={formData.year}
                  onChange={(e) => onFieldChange('year', e.target.value)}
                  className="input"
                  required
                >
                  {yearOptions.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button type="button" className="btn-ghost flex-1" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn-primary flex-1">
                {submitLabel}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>,
    document.body
  );
}


