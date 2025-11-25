import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import ReminderSummaryCards from '../components/ReminderSummaryCards';
import ReminderList from '../components/ReminderList';
import ReminderModal from '../components/ReminderModal';

const buildInitialForm = () => ({
  id: null,
  title: '',
  amount: '',
  dueDate: new Date().toISOString().slice(0, 10),
  frequency: 'monthly',
  isActive: true,
  notes: '',
});

const filterTabs = [
  { id: 'active', label: 'Active' },
  { id: 'all', label: 'All' },
  { id: 'paused', label: 'Paused' },
];

export default function Reminders() {
  const navigate = useNavigate();
  const user = useMemo(() => JSON.parse(localStorage.getItem('user') || '{}'), []);

  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('active');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState(buildInitialForm());
  const [saving, setSaving] = useState(false);

  const fetchReminders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params = {};
      if (filter === 'active') params.isActive = true;
      if (filter === 'paused') params.isActive = false;

      const response = await api.get('/api/reminders', { params });
      setReminders(response.data.reminders || []);
    } catch (fetchError) {
      console.error('Fetch reminders error:', fetchError);
      setError(fetchError.response?.data?.message || 'Failed to load reminders.');
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchReminders();
  }, [fetchReminders]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const openNewReminderModal = () => {
    setFormData(buildInitialForm());
    setShowModal(true);
  };

  const handleEditReminder = (reminder) => {
    setFormData({
      id: reminder.id,
      title: reminder.title || '',
      amount: reminder.amount ? reminder.amount.toString() : '',
      dueDate: reminder.dueDate ? new Date(reminder.dueDate).toISOString().slice(0, 10) : '',
      frequency: reminder.frequency || 'monthly',
      isActive: reminder.isActive ?? true,
      notes: reminder.notes || '',
    });
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setFormData(buildInitialForm());
  };

  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError(null);

    try {
      await api.post('/api/reminders', {
        id: formData.id,
        title: formData.title.trim(),
        amount: formData.amount ? parseFloat(formData.amount) : null,
        dueDate: formData.dueDate,
        frequency: formData.frequency,
        isActive: formData.isActive,
        notes: formData.notes ? formData.notes.trim() : null,
      });

      setShowModal(false);
      setFormData(buildInitialForm());
      fetchReminders();
    } catch (submitError) {
      console.error('Save reminder error:', submitError);
      setError(submitError.response?.data?.message || 'Failed to save reminder.');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (reminder) => {
    try {
      await api.post('/api/reminders', {
        id: reminder.id,
        title: reminder.title,
        amount: reminder.amount,
        dueDate: reminder.dueDate,
        frequency: reminder.frequency,
        isActive: !reminder.isActive,
        notes: reminder.notes,
      });
      fetchReminders();
    } catch (toggleError) {
      console.error('Toggle reminder error:', toggleError);
      setError(toggleError.response?.data?.message || 'Failed to update reminder status.');
    }
  };

  const filteredSummary = useMemo(() => {
    if (filter === 'all') return reminders;
    if (filter === 'active') return reminders.filter((reminder) => reminder.isActive);
    return reminders.filter((reminder) => !reminder.isActive);
  }, [reminders, filter]);

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
            <Link className="btn-ghost" to="/budgets">
              Budgets
            </Link>
            <Link className="btn-ghost bg-ink-100/80 dark:bg-ink-800/80" to="/reminders">
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
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-wide text-ink-500">Reminders</p>
            <h1 className="mt-1 text-3xl font-bold text-ink-900 dark:text-ink-50">
              Smart Reminder Center
            </h1>
            <p className="mt-2 text-ink-600 dark:text-ink-400">
              Track bills, renewals, and subscriptions in a single calm view.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex rounded-full border border-ink-200 bg-white p-1 text-sm font-medium dark:border-ink-800 dark:bg-ink-900">
              {filterTabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setFilter(tab.id)}
                  className={`rounded-full px-3 py-1.5 transition ${
                    tab.id === filter
                      ? 'bg-ink-900 text-white dark:bg-white dark:text-ink-900'
                      : 'text-ink-500 hover:text-ink-900 dark:text-ink-400 dark:hover:text-ink-100'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <button type="button" className="btn-primary" onClick={openNewReminderModal}>
              + New Reminder
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
              onClick={fetchReminders}
            >
              Try Again
            </button>
          </div>
        )}

        <ReminderSummaryCards reminders={filteredSummary} />

        <ReminderList
          reminders={filteredSummary}
          loading={loading}
          onEdit={handleEditReminder}
          onToggleActive={handleToggleActive}
        />
      </main>

      <ReminderModal
        show={showModal}
        formData={formData}
        onFieldChange={handleFieldChange}
        onSubmit={handleSubmit}
        onClose={handleModalClose}
        saving={saving}
      />
    </div>
  );
}


