import React from 'react';
import { createPortal } from 'react-dom';

const FREQUENCY_OPTIONS = [
  { value: 'one-time', label: 'One-time' },
  { value: 'weekly',   label: 'Weekly' },
  { value: 'monthly',  label: 'Monthly' },
  { value: 'yearly',   label: 'Yearly' },
];

export default function ReminderModal({
  show,
  formData,
  onFieldChange,
  onSubmit,
  onClose,
  saving,
}) {
  if (!show) return null;

  return createPortal(
    <div className="modal-overlay">
      <div className="modal-panel animate-scale-in">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-white">
              {formData.id ? 'Edit Reminder' : 'New Reminder'}
            </h2>
            <p className="text-sm text-ink-400 mt-1">
              {formData.id ? 'Update schedule or status' : 'Track bills & payments'}
            </p>
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
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-ink-300 mb-2">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => onFieldChange('title', e.target.value)}
              className="input"
              placeholder="e.g. Rent, Gym"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Amount */}
            <div>
              <label className="block text-sm font-semibold text-ink-300 mb-2">Amount (optional)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-500 font-mono">$</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => onFieldChange('amount', e.target.value)}
                  className="input pl-8 font-mono"
                  placeholder="0.00"
                />
              </div>
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-semibold text-ink-300 mb-2">Due Date</label>
              <input
                type="date"
                value={formData.dueDate?.slice(0, 10)}
                onChange={(e) => onFieldChange('dueDate', e.target.value)}
                className="input"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Frequency */}
            <div>
              <label className="block text-sm font-semibold text-ink-300 mb-2">Frequency</label>
              <select
                className="input"
                value={formData.frequency}
                onChange={(e) => onFieldChange('frequency', e.target.value)}
              >
                {FREQUENCY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-semibold text-ink-300 mb-2">Status</label>
              <div className="flex items-center gap-2 p-1.5 rounded-xl border border-white/10 bg-white/5">
                <button
                  type="button"
                  onClick={() => onFieldChange('isActive', true)}
                  className={`flex-1 rounded-lg py-1.5 text-xs font-bold transition-all ${
                    formData.isActive
                      ? 'bg-emerald-500/20 text-emerald-400 shadow-sm'
                      : 'text-ink-400 hover:text-white'
                  }`}
                >
                  Active
                </button>
                <button
                  type="button"
                  onClick={() => onFieldChange('isActive', false)}
                  className={`flex-1 rounded-lg py-1.5 text-xs font-bold transition-all ${
                    !formData.isActive
                      ? 'bg-white/10 text-white shadow-sm'
                      : 'text-ink-400 hover:text-white'
                  }`}
                >
                  Paused
                </button>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-semibold text-ink-300 mb-2">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => onFieldChange('notes', e.target.value)}
              rows={2}
              className="input resize-none"
              placeholder="Add context..."
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-white/[0.06] mt-6">
            <button type="button" className="btn-ghost flex-1" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary flex-1" disabled={saving}>
              {saving ? 'Saving...' : formData.id ? 'Save Changes' : 'Create Reminder'}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
