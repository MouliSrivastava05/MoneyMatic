import React from 'react';

export default function SearchBar({ search, onSearchChange, onSearch }) {
  return (
    <div className="mb-6">
      <div className="relative">
        <input
          type="text"
          placeholder="Search transactions by description or category..."
          value={search}
          onChange={(e) => {
            onSearchChange(e.target.value);
            if (e.target.value === '') {
              onSearch();
            }
          }}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              onSearch();
            }
          }}
          className="input pl-10"
        />
        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-ink-400">
          🔍
        </span>
        {search && (
          <button
            onClick={() => {
              onSearchChange('');
              onSearch();
            }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-ink-400 hover:text-ink-600"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}

