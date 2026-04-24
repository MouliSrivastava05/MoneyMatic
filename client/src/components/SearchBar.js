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
          className="input pl-10 h-12 text-base"
        />
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-500 flex items-center justify-center">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
             <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </span>
        {search && (
          <button
            onClick={() => {
              onSearchChange('');
              onSearch();
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-ink-500 hover:text-white transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
