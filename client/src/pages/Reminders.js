import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import ReminderSummaryCards from '../components/ReminderSummaryCards';
import ReminderList from '../components/ReminderList';
import ReminderModal from '../components/ReminderModal';
import ShellHeader from '../components/ShellHeader';
import PageHero from '../components/PageHero';

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
    <div className="page-shell">
      <ShellHeader active="reminders" user={user} onLogout={handleLogout} />

      <main className="mx-auto max-w-7xl px-4 py-10 space-y-8">
        <PageHero
          eyebrow="Reminders"
          title="Smart reminder center"
          description="Bills, renewals, and subscriptions stay calm and predictable."
          meta={[
            { label: 'Active', value: String(reminders.filter((r) => r.isActive).length) },
            { label: 'Paused', value: String(reminders.filter((r) => !r.isActive).length) },
          ]}
          actions={[
            <div
              key="filter-tabs"
              className="flex rounded-full border border-ink-200 bg-white/80 p-1 text-sm font-medium dark:border-ink-700 dark:bg-ink-900/50"
            >
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
            </div>,
            <button key="new" type="button" className="btn-primary" onClick={openNewReminderModal}>
              + New Reminder
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
                  onClick={fetchReminders}
                >
                  Try Again →
                </button>
              </div>
            </div>
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


