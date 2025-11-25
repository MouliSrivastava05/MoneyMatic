import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import BudgetSummaryCards from '../components/BudgetSummaryCards';
import BudgetList from '../components/BudgetList';
import BudgetModal from '../components/BudgetModal';

const buildMonthOptions = () =>
  Array.from({ length: 12 }).map((_, index) => ({
    value: index + 1,
    label: new Date(0, index).toLocaleString('default', { month: 'long' }),
  }));

const buildYearOptions = () => {
  const current = new Date().getFullYear();
  const years = [];
  for (let i = current - 2; i <= current + 2; i += 1) {
    years.push(i);
  }
  return years;
};

const buildInitialForm = (month, year) => ({
  id: null,
  category: '',
  limit: '',
  month,
  year,
});

export default function Budgets() {
  const navigate = useNavigate();
  const currentDate = new Date();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const [filters, setFilters] = useState({
    month: currentDate.getMonth() + 1,
    year: currentDate.getFullYear(),
  });
  const [budgetData, setBudgetData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [formData, setFormData] = useState(buildInitialForm(filters.month, filters.year));

  const monthOptions = useMemo(() => buildMonthOptions(), []);
  const yearOptions = useMemo(() => buildYearOptions(), []);

  const fetchBudgets = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/api/budget', {
        params: { month: filters.month, year: filters.year },
      });
      setBudgetData(response.data);
    } catch (fetchError) {
      console.error('Budget fetch error:', fetchError);
      setError(fetchError.response?.data?.message || 'Failed to load budgets');
    } finally {
      setLoading(false);
    }
  }, [filters.month, filters.year]);

  useEffect(() => {
    fetchBudgets();
  }, [fetchBudgets]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleCreateClick = () => {
    setEditingBudget(null);
    setFormData(buildInitialForm(filters.month, filters.year));
    setShowModal(true);
  };

  const handleEditClick = (budget) => {
    setEditingBudget(budget);
    setFormData({
      id: budget.id,
      category: budget.category,
      limit: budget.limit.toString(),
      month: budget.month,
      year: budget.year,
    });
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingBudget(null);
    setFormData(buildInitialForm(filters.month, filters.year));
  };

  const handleFormChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmitBudget = async (event) => {
    event.preventDefault();
    const payload = {
      category: formData.category,
      limit: parseFloat(formData.limit),
      month: parseInt(formData.month, 10),
      year: parseInt(formData.year, 10),
      period: 'monthly',
    };

    if (!payload.category || Number.isNaN(payload.limit) || payload.limit <= 0) {
      setError('Please provide a valid category and positive budget limit.');
      return;
    }

    try {
      if (editingBudget?.id) {
        await api.put(`/api/budget/${editingBudget.id}`, payload);
      } else {
        await api.post('/api/budget', payload);
      }
      handleModalClose();
      fetchBudgets();
    } catch (submitError) {
      console.error('Budget save error:', submitError);
      setError(
        submitError.response?.data?.message ||
          submitError.message ||
          'Failed to save budget.'
      );
    }
  };

  const handleDeleteBudget = async (budgetId) => {
    if (!window.confirm('Delete this budget?')) return;
    try {
      await api.delete(`/api/budget/${budgetId}`);
      fetchBudgets();
    } catch (deleteError) {
      console.error('Budget delete error:', deleteError);
      setError(deleteError.response?.data?.message || 'Failed to delete budget');
    }
  };

  return (
    <div className="min-h-screen bg-ink-50 dark:bg-ink-900">
      <header className="sticky top-0 z-20 border-b border-ink-100/70 bg-white/80 backdrop-blur-md dark:bg-ink-900/70 dark:border-ink-800">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-brand-start to-brand-end" />
            <span className="font-display text-lg tracking-tight text-ink-900 dark:text-white">
              MoneyMatic
            </span>
          </Link>
          <nav className="hidden items-center gap-2 text-sm font-medium text-ink-600 dark:text-ink-400 md:flex">
            <Link className="btn-ghost" to="/dashboard">
              Dashboard
            </Link>
            <Link className="btn-ghost" to="/transactions">
              Transactions
            </Link>
            <Link className="btn-ghost bg-ink-100/80 dark:bg-ink-800/80" to="/budgets">
              Budgets
            </Link>
            <Link className="btn-ghost" to="/reminders">
              Reminders
            </Link>
          </nav>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-ink-600 dark:text-ink-300 capitalize">
              {user?.name || 'User'}
            </span>
            <button type="button" className="btn-ghost" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-wide text-ink-500">Budgets</p>
            <h1 className="mt-1 text-3xl font-bold text-ink-900 dark:text-ink-50">
              Monthly Budget Planner
            </h1>
            <p className="mt-2 text-ink-600 dark:text-ink-400">
              Track, adjust, and optimize your monthly spending goals.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <select
              className="input w-36"
              value={filters.month}
              onChange={(event) =>
                setFilters((prev) => ({ ...prev, month: Number(event.target.value) }))
              }
            >
              {monthOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <select
              className="input w-32"
              value={filters.year}
              onChange={(event) =>
                setFilters((prev) => ({ ...prev, year: Number(event.target.value) }))
              }
            >
              {yearOptions.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
            <button type="button" className="btn-ghost" onClick={fetchBudgets}>
              Refresh
            </button>
            <button type="button" className="btn-primary" onClick={handleCreateClick}>
              + New Budget
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-rose-200 bg-rose-50 p-4 text-rose-700 dark:border-rose-900/40 dark:bg-rose-900/30 dark:text-rose-200">
            <p className="font-semibold">Something went wrong</p>
            <p className="text-sm">{error}</p>
            <button
              type="button"
              className="mt-3 text-sm font-medium text-rose-600 underline dark:text-rose-300"
              onClick={fetchBudgets}
            >
              Try Again
            </button>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-ink-200 border-t-brand-500" />
          </div>
        ) : (
          <>
            <BudgetSummaryCards budgetData={budgetData} />
            <BudgetList
              budgets={budgetData?.budgets}
              onEdit={handleEditClick}
              onDelete={handleDeleteBudget}
            />
          </>
        )}
      </main>

      <BudgetModal
        show={showModal}
        editingBudget={editingBudget}
        formData={formData}
        onFieldChange={handleFormChange}
        onSubmit={handleSubmitBudget}
        onClose={handleModalClose}
      />
    </div>
  );
}

