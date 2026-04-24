import React from 'react';
import { createPortal } from 'react-dom';
import { CATEGORY_OPTIONS } from '../constants/categories';

export default function BudgetModal({
  show,
  editingBudget,
  formData,
  onClose,
  onSubmit,
  onFieldChange,
}) {
  if (!show) return null;

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 6 }).map((_, i) => currentYear - 2 + i);

  return createPortal(
    <div className="modal-overlay">
      <div className="modal-panel animate-scale-in">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-white">
              {editingBudget ? 'Edit Budget' : 'New Budget'}
            </h2>
            {editingBudget && (
              <p className="text-sm text-ink-400 mt-1">Adjust limit and timeframe</p>
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
          {/* Category */}
          <div>
            <label className="block text-sm font-semibold text-ink-300 mb-2">Category</label>
            <select
              value={formData.category}
              onChange={(e) => onFieldChange('category', e.target.value)}
              className="input"
              required
            >
              <option value="" disabled>Select category</option>
              {CATEGORY_OPTIONS.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Limit */}
          <div>
            <label className="block text-sm font-semibold text-ink-300 mb-2">Monthly Limit</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-500 font-mono">$</span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.limit}
                onChange={(e) => onFieldChange('limit', e.target.value)}
                className="input pl-8 font-mono"
                placeholder="0.00"
                required
              />
            </div>
          </div>

          {/* Timeframe */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-ink-300 mb-2">Month</label>
              <select
                value={formData.month}
                onChange={(e) => onFieldChange('month', e.target.value)}
                className="input"
                required
              >
                {Array.from({ length: 12 }).map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {new Date(0, i).toLocaleString('default', { month: 'long' })}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-ink-300 mb-2">Year</label>
              <select
                value={formData.year}
                onChange={(e) => onFieldChange('year', e.target.value)}
                className="input"
                required
              >
                {yearOptions.map((year) => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-white/[0.06] mt-6">
            <button type="button" className="btn-ghost flex-1" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary flex-1">
              {editingBudget ? 'Save Changes' : 'Create Budget'}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
