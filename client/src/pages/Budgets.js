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
          <div className="card border-rose-500/20 bg-rose-500/[0.05] mb-6 animate-scale-in">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-rose-500/10">
                <svg className="h-5 w-5 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-bold text-rose-400">Loading Error</p>
                <p className="text-sm text-ink-400 mt-1">{error}</p>
                <button
                  type="button"
                  className="mt-3 text-sm font-semibold text-rose-400 hover:text-rose-300 transition-colors"
                  onClick={fetchBudgets}
                >
                  Try Again →
                </button>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-5">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-2 border-brand-500/20 border-t-brand-500"></div>
              <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-emerald-400 animate-spin" style={{ animationDuration: '1.5s' }}></div>
            </div>
            <p className="text-ink-400 font-medium tracking-wide">Crunching numbers...</p>
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

