import React from 'react';
import { CATEGORY_OPTIONS } from '../constants/categories';

export default function FilterPanel({
  filters,
  onFilterChange,
  onApplyFilters,
  onClearFilters,
  onClose,
}) {
  return (
    <div className="card mb-6 animate-scale-in">
      <div className="flex items-center justify-between mb-5 border-b border-white/[0.06] pb-4">
        <div>
          <h3 className="section-title text-lg">Filter Transactions</h3>
          <p className="text-xs text-ink-400 mt-1">Refine your view by categories, date, or amount</p>
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
      
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {/* Type Filter */}
        <div>
          <label className="block text-sm font-semibold text-ink-300 mb-2">Type</label>
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
          <label className="block text-sm font-semibold text-ink-300 mb-2">Category</label>
          <select
            value={filters.category}
            onChange={(e) => onFilterChange('category', e.target.value)}
            className="input"
          >
            <option value="">All Categories</option>
            {CATEGORY_OPTIONS.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Date Range - Start */}
        <div>
          <label className="block text-sm font-semibold text-ink-300 mb-2">Start Date</label>
          <input
            type="date"
            value={filters.startDate}
            onChange={(e) => onFilterChange('startDate', e.target.value)}
            className="input"
          />
        </div>

        {/* Date Range - End */}
        <div>
          <label className="block text-sm font-semibold text-ink-300 mb-2">End Date</label>
          <input
            type="date"
            value={filters.endDate}
            onChange={(e) => onFilterChange('endDate', e.target.value)}
            className="input"
          />
        </div>

        {/* Amount Range - Min */}
        <div>
          <label className="block text-sm font-semibold text-ink-300 mb-2">Min Amount</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-500 font-mono">$</span>
            <input
              type="number"
              step="0.01"
              min="0"
              value={filters.minAmount}
              onChange={(e) => onFilterChange('minAmount', e.target.value)}
              className="input pl-8 font-mono"
              placeholder="0.00"
            />
          </div>
        </div>

        {/* Amount Range - Max */}
        <div>
          <label className="block text-sm font-semibold text-ink-300 mb-2">Max Amount</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-500 font-mono">$</span>
            <input
              type="number"
              step="0.01"
              min="0"
              value={filters.maxAmount}
              onChange={(e) => onFilterChange('maxAmount', e.target.value)}
              className="input pl-8 font-mono"
              placeholder="0.00"
            />
          </div>
        </div>
      </div>

      {/* Filter Actions */}
      <div className="flex gap-3 mt-6 pt-4 border-t border-white/[0.06]">
        <button onClick={onClearFilters} className="btn-ghost flex-1">
          Clear All
        </button>
        <button onClick={onApplyFilters} className="btn-primary flex-1">
          Apply Filters
        </button>
      </div>
    </div>
  );
}
