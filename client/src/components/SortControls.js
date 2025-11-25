import React from 'react';

export default function SortControls({ sortBy, sortOrder, onSortChange }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <span className="text-sm font-medium text-ink-600 dark:text-ink-400">Sort by:</span>
      <select
        value={sortBy}
        onChange={(e) => onSortChange(e.target.value, sortOrder)}
        className="input text-sm"
      >
        <option value="date">Date</option>
        <option value="amount">Amount</option>
      </select>
      <button
        onClick={() => onSortChange(sortBy, sortOrder === 'asc' ? 'desc' : 'asc')}
        className="btn-ghost text-sm flex items-center gap-1"
        title={`Sort ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
      >
        {sortOrder === 'asc' ? '↑' : '↓'}
        <span className="hidden sm:inline">
          {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
        </span>
      </button>
    </div>
  );
}

