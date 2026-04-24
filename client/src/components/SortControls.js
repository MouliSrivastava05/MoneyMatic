import React from 'react';

export default function SortControls({ sortBy, sortOrder, onSortChange }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-semibold text-ink-400">Sort by:</span>
      <select
        value={sortBy}
        onChange={(e) => onSortChange(e.target.value, sortOrder)}
        className="input text-sm !py-1.5 !w-auto"
      >
        <option value="date">Date</option>
        <option value="amount">Amount</option>
      </select>
      <button
        onClick={() => onSortChange(sortBy, sortOrder === 'asc' ? 'desc' : 'asc')}
        className="btn-ghost !py-1.5 !px-3 text-sm flex items-center gap-1.5"
        title={`Sort ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
      >
        <span className="font-mono">{sortOrder === 'asc' ? '↑' : '↓'}</span>
        <span className="hidden sm:inline">
          {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
        </span>
      </button>
    </div>
  );
}
