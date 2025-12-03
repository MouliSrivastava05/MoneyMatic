import React from 'react';
import { createPortal } from 'react-dom';
import CloseIcon from '../icons/CloseIcon';

const FREQUENCY_OPTIONS = [
  { value: 'one-time', label: 'One-time' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly' },
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

  const handleChange = (field, value) => {
    onFieldChange(field, value);
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
      <div className="w-full max-w-lg">
        <div className="card max-h-[90vh] overflow-y-auto">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-ink-900 dark:text-ink-100">
                {formData.id ? 'Edit Reminder' : 'New Reminder'}
              </h2>
              <p className="text-sm text-ink-500 dark:text-ink-400">
                {formData.id ? 'Update schedule or status.' : 'Keep bills and payments on track.'}
              </p>
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
                Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                className="input"
                placeholder="Rent payment, Gym membership..."
                required
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-ink-600 dark:text-ink-300">
                  Amount (optional)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => handleChange('amount', e.target.value)}
                  className="input"
                  placeholder="e.g. 150.00"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-ink-600 dark:text-ink-300">
                  Due Date
                </label>
                <input
                  type="date"
                  value={formData.dueDate?.slice(0, 10)}
                  onChange={(e) => handleChange('dueDate', e.target.value)}
                  className="input"
                  required
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-ink-600 dark:text-ink-300">
                  Frequency
                </label>
                <select
                  className="input"
                  value={formData.frequency}
                  onChange={(e) => handleChange('frequency', e.target.value)}
                >
                  {FREQUENCY_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-ink-600 dark:text-ink-300">
                  Status
                </label>
                <div className="flex items-center gap-3 rounded-xl border border-ink-200 px-3 py-2 dark:border-ink-700">
                  <button
                    type="button"
                    onClick={() => handleChange('isActive', true)}
                    className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium ${
                      formData.isActive
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-200'
                        : 'text-ink-500'
                    }`}
                  >
                    Active
                  </button>
                  <button
                    type="button"
                    onClick={() => handleChange('isActive', false)}
                    className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium ${
                      !formData.isActive
                        ? 'bg-ink-100 text-ink-700 dark:bg-ink-800/50 dark:text-ink-200'
                        : 'text-ink-500'
                    }`}
                  >
                    Paused
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-ink-600 dark:text-ink-300">
                Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
                rows={3}
                className="input resize-none"
                placeholder="Add extra context or account details."
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button type="button" className="btn-ghost flex-1" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn-primary flex-1" disabled={saving}>
                {saving ? 'Saving…' : formData.id ? 'Update Reminder' : 'Create Reminder'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>,
    document.body
  );
}


