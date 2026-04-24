import React from 'react';

export default function Pagination({ pagination, onPageChange }) {
  const { page, totalPages, total, limit } = pagination;

  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (page <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (page >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = page - 1; i <= page + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    return pages;
  };

  const startItem = (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, total);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-4 border-t border-white/[0.06]">
      <div className="text-sm text-ink-400">
        Showing <span className="font-semibold text-white">{startItem}</span> to{' '}
        <span className="font-semibold text-white">{endItem}</span> of{' '}
        <span className="font-semibold text-brand-400">{total}</span> transactions
      </div>
      
      <div className="flex items-center gap-1.5 bg-white/5 p-1 rounded-xl border border-white/10">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className="rounded-lg px-3 py-1.5 text-sm font-medium text-ink-300 hover:bg-white/10 hover:text-white transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-ink-300"
        >
          Prev
        </button>
        
        <div className="flex items-center gap-1 px-2 border-x border-white/10">
          {getPageNumbers().map((pageNum, index) => (
            pageNum === '...' ? (
              <span key={`ellipsis-${index}`} className="px-2 text-ink-500 font-bold">
                ...
              </span>
            ) : (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                className={`min-w-[32px] px-2 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                  page === pageNum
                    ? 'bg-brand-500 text-white shadow-brand'
                    : 'text-ink-400 hover:bg-white/10 hover:text-white'
                }`}
              >
                {pageNum}
              </button>
            )
          ))}
        </div>
        
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          className="rounded-lg px-3 py-1.5 text-sm font-medium text-ink-300 hover:bg-white/10 hover:text-white transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-ink-300"
        >
          Next
        </button>
      </div>
    </div>
  );
}
