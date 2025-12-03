import React from 'react';
import { CATEGORY_OPTIONS } from '../constants/categories';
import CloseIcon from '../icons/CloseIcon';

export default function FilterPanel({
  filters,
  onFilterChange,
  onApplyFilters,
  onClearFilters,
  onClose,
}) {
  return (
    <div className="card mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-ink-900 dark:text-ink-100">
          Filter Transactions
        </h3>
        <button
          onClick={onClose}
          className="text-ink-400 hover:text-ink-600 dark:hover:text-ink-300"
          aria-label="Close"
        >
          <CloseIcon className="w-5 h-5" />
        </button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Type Filter */}
        <div>
          <label className="block text-sm font-medium text-ink-700 dark:text-ink-300 mb-2">
            Type
          </label>
          <select
            value={filters.type}
            onChange={(e) => onFilterChange('type', e.target.value)}
            className="input"
          >
            <option value="">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>

        {/* Category Filter */}
        <div>
          <label className="block text-sm font-medium text-ink-700 dark:text-ink-300 mb-2">
            Category
          </label>
          <select
            value={filters.category}
            onChange={(e) => onFilterChange('category', e.target.value)}
            className="input"
          >
            <option value="">All Categories</option>
            {CATEGORY_OPTIONS.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Date Range - Start */}
        <div>
          <label className="block text-sm font-medium text-ink-700 dark:text-ink-300 mb-2">
            Start Date
          </label>
          <input
            type="date"
            value={filters.startDate}
            onChange={(e) => onFilterChange('startDate', e.target.value)}
            className="input"
          />
        </div>

        {/* Date Range - End */}
        <div>
          <label className="block text-sm font-medium text-ink-700 dark:text-ink-300 mb-2">
            End Date
          </label>
          <input
            type="date"
            value={filters.endDate}
            onChange={(e) => onFilterChange('endDate', e.target.value)}
            className="input"
          />
        </div>

        {/* Amount Range - Min */}
        <div>
          <label className="block text-sm font-medium text-ink-700 dark:text-ink-300 mb-2">
            Min Amount
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={filters.minAmount}
            onChange={(e) => onFilterChange('minAmount', e.target.value)}
            className="input"
            placeholder="0.00"
          />
        </div>

        {/* Amount Range - Max */}
        <div>
          <label className="block text-sm font-medium text-ink-700 dark:text-ink-300 mb-2">
            Max Amount
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={filters.maxAmount}
            onChange={(e) => onFilterChange('maxAmount', e.target.value)}
            className="input"
            placeholder="0.00"
          />
        </div>
      </div>

      {/* Filter Actions */}
      <div className="flex gap-3 mt-6 pt-4 border-t border-ink-200 dark:border-ink-700">
        <button onClick={onApplyFilters} className="btn-primary flex-1">
          Apply Filters
        </button>
        <button onClick={onClearFilters} className="btn-ghost flex-1">
          Clear All
        </button>
      </div>
    </div>
  );
}

