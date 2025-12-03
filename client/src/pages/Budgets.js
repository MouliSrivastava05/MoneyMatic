import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import BudgetSummaryCards from '../components/BudgetSummaryCards';
import BudgetList from '../components/BudgetList';
import BudgetModal from '../components/BudgetModal';
import ShellHeader from '../components/ShellHeader';
import PageHero from '../components/PageHero';

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
    <div className="page-shell">
      <ShellHeader active="budgets" user={user} onLogout={handleLogout} />

      <main className="mx-auto max-w-7xl px-4 py-10 space-y-8">
        <PageHero
          eyebrow="Budgets"
          title="Monthly budget planner"
          description="Track categories with intentional visuals and quick actions."
          meta={[
            {
              label: 'Month',
              value: monthOptions.find((option) => option.value === filters.month)?.label || '',
            },
            { label: 'Year', value: String(filters.year) },
          ]}
          actions={[
            <select
              key="month"
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
            </select>,
            <select
              key="year"
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
            </select>,
            <button key="refresh" type="button" className="btn-outline" onClick={fetchBudgets}>
              Refresh
            </button>,
            <button key="new" type="button" className="btn-primary" onClick={handleCreateClick}>
              + New Budget
            </button>,
          ]}
        />

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

