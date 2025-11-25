import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import TransactionSummaryCards from '../components/TransactionSummaryCards';
import SearchBar from '../components/SearchBar';
import FilterPanel from '../components/FilterPanel';
import TransactionTable from '../components/TransactionTable';
import TransactionModal from '../components/TransactionModal';
import SortControls from '../components/SortControls';
import Pagination from '../components/Pagination';

export default function Transactions() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [transactions, setTransactions] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [formData, setFormData] = useState({
    type: 'expense',
    amount: '',
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
  });
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    type: '',
    startDate: '',
    endDate: '',
    minAmount: '',
    maxAmount: '',
  });

  const buildQueryString = useCallback(() => {
    const params = new URLSearchParams();
    params.append('page', pagination.page.toString());
    params.append('limit', pagination.limit.toString());
    params.append('sortBy', sortBy);
    params.append('sortOrder', sortOrder);
    
    if (filters.search) params.append('search', filters.search);
    if (filters.category) params.append('category', filters.category);
    if (filters.type) params.append('type', filters.type);
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);
    if (filters.minAmount) params.append('minAmount', filters.minAmount);
    if (filters.maxAmount) params.append('maxAmount', filters.maxAmount);
    
    return params.toString();
  }, [filters, pagination.page, pagination.limit, sortBy, sortOrder]);

  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const queryString = buildQueryString();
      const response = await api.get(`/api/transactions?${queryString}`);
      setTransactions(response.data.transactions || []);
      if (response.data.pagination) {
        setPagination(response.data.pagination);
      }
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setError(err.response?.data?.message || 'Failed to load transactions');
    } finally {
      setLoading(false);
    }
  }, [buildQueryString]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
  };

  const handleApplyFilters = () => {
    setPagination({ ...pagination, page: 1 });
    fetchTransactions();
    setShowFilters(false);
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      category: '',
      type: '',
      startDate: '',
      endDate: '',
      minAmount: '',
      maxAmount: '',
    });
    setPagination({ ...pagination, page: 1 });
    setTimeout(() => {
      fetchTransactions();
    }, 100);
  };

  const handleSortChange = (newSortBy, newSortOrder) => {
    setSortBy(newSortBy);
    setSortOrder(newSortOrder || sortOrder);
    setPagination({ ...pagination, page: 1 });
  };

  const handlePageChange = (newPage) => {
    setPagination({ ...pagination, page: newPage });
  };

  const hasActiveFilters = () => {
    return Object.values(filters).some(value => value !== '');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleOpenModal = (transaction = null) => {
    if (transaction) {
      setEditingTransaction(transaction);
      setFormData({
        type: transaction.type,
        amount: transaction.amount.toString(),
        category: transaction.category,
        description: transaction.description || '',
        date: new Date(transaction.date).toISOString().split('T')[0],
      });
    } else {
      setEditingTransaction(null);
      setFormData({
        type: 'expense',
        amount: '',
        category: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingTransaction(null);
    setFormData({
      type: 'expense',
      amount: '',
      category: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
    });
  };

  const handleFormChange = (key, value) => {
    setFormData({ ...formData, [key]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTransaction) {
        await api.put(`/api/transactions/${editingTransaction.id}`, formData);
      } else {
        await api.post('/api/transactions', formData);
      }
      handleCloseModal();
      fetchTransactions();
    } catch (err) {
      console.error('Error saving transaction:', err);
      setError(err.response?.data?.message || 'Failed to save transaction');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this transaction?')) {
      return;
    }
    try {
      await api.delete(`/api/transactions/${id}`);
      fetchTransactions();
    } catch (err) {
      console.error('Error deleting transaction:', err);
      setError(err.response?.data?.message || 'Failed to delete transaction');
    }
  };

  return (
    <div className="min-h-screen bg-ink-50 dark:bg-ink-900">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-ink-100/70 bg-white/70 backdrop-blur-xs dark:bg-ink-900/60 dark:border-ink-800">
        <div className="mx-auto max-w-7xl px-4 h-14 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-brand-start to-brand-end" />
            <span className="font-display text-lg tracking-tight">MoneyMatic</span>
          </Link>
          <nav className="hidden md:flex items-center gap-2">
            <Link to="/dashboard" className="btn-ghost text-sm">Dashboard</Link>
            <Link to="/transactions" className="btn-ghost text-sm bg-ink-100 dark:bg-ink-800">Transactions</Link>
            <Link to="/budgets" className="btn-ghost text-sm">Budgets</Link>
            <Link to="/reminders" className="btn-ghost text-sm">Reminders</Link>
          </nav>
          <div className="flex items-center gap-4">
            <span className="text-sm text-ink-600 dark:text-ink-400">
              {user.name || 'User'}
            </span>
            <button onClick={handleLogout} className="btn-ghost text-sm">
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-ink-900 dark:text-ink-100">
                Transactions 💳
              </h1>
              <p className="mt-2 text-ink-600 dark:text-ink-400">
                Manage all your income and expenses
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`btn-ghost flex items-center gap-2 ${
                  hasActiveFilters() ? 'bg-brand-100 dark:bg-brand-900/20' : ''
                }`}
              >
                <span>🔍</span>
                <span className="hidden md:inline">Filters</span>
                {hasActiveFilters() && (
                  <span className="h-2 w-2 rounded-full bg-brand-500"></span>
                )}
              </button>
              <button
                onClick={() => handleOpenModal()}
                className="btn-primary flex items-center gap-2"
              >
                <span>+</span>
                <span className="hidden md:inline">Add Transaction</span>
              </button>
            </div>
          </div>
        </div>

        <SearchBar
          search={filters.search}
          onSearchChange={(value) => handleFilterChange('search', value)}
          onSearch={fetchTransactions}
        />

        {showFilters && (
          <FilterPanel
            filters={filters}
            onFilterChange={handleFilterChange}
            onApplyFilters={handleApplyFilters}
            onClearFilters={handleClearFilters}
            onClose={() => setShowFilters(false)}
          />
        )}

        <TransactionSummaryCards transactions={transactions} />

        {/* Sort Controls */}
        {!loading && transactions.length > 0 && (
          <div className="mb-4">
            <SortControls
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSortChange={handleSortChange}
            />
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
            <span className="ml-4 text-ink-600 dark:text-ink-400 text-lg">Loading transactions...</span>
          </div>
        ) : error ? (
          <div className="card bg-rose-50 dark:bg-rose-900/20 border-2 border-rose-200 dark:border-rose-800">
            <div className="flex items-center gap-3">
              <div className="text-2xl">⚠️</div>
              <div>
                <p className="text-rose-700 dark:text-rose-300 font-medium">{error}</p>
                <button onClick={fetchTransactions} className="mt-3 btn-ghost text-sm">
                  Retry
                </button>
              </div>
            </div>
          </div>
        ) : transactions.length === 0 && !hasActiveFilters() ? (
          <div className="card text-center py-12">
            <div className="text-5xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-ink-900 dark:text-ink-100 mb-2">
              No Transactions Yet
            </h3>
            <p className="text-ink-600 dark:text-ink-400 mb-6">
              Start tracking your finances by adding your first transaction!
            </p>
            <button onClick={() => handleOpenModal()} className="btn-primary">
              Add Your First Transaction
            </button>
          </div>
        ) : (
          <>
            <TransactionTable
              transactions={transactions}
              onEdit={handleOpenModal}
              onDelete={handleDelete}
            />
            {pagination.totalPages > 1 && (
              <Pagination
                pagination={pagination}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}

        <TransactionModal
          show={showModal}
          editingTransaction={editingTransaction}
          formData={formData}
          onClose={handleCloseModal}
          onSubmit={handleSubmit}
          onFormChange={handleFormChange}
        />
      </div>
    </div>
  );
}
