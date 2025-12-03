import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import DashboardStatsCards from '../components/DashboardStatsCards';
import RecentTransactions from '../components/RecentTransactions';
import QuickStats from '../components/QuickStats';
import BudgetOverview from '../components/BudgetOverview';
import IncomeExpenseChart from '../components/IncomeExpenseChart';
import CategorySpendingChart from '../components/CategorySpendingChart';
import ShellHeader from '../components/ShellHeader';
import DashboardHero from '../components/DashboardHero';

export default function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [budgetData, setBudgetData] = useState(null);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [remindersCount, setRemindersCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const mainRef = useRef(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [budgetResponse, transactionsResponse, remindersResponse] = await Promise.all([
        api.get('/api/budget'),
        api.get('/api/transactions?limit=5&sortBy=date&sortOrder=desc'),
        api.get('/api/reminders?isActive=true').catch(() => ({ data: { reminders: [] } })),
      ]);
      setBudgetData(budgetResponse.data);
      setRecentTransactions(transactionsResponse.data.transactions || []);
      
      // Count reminders due in the next 7 days
      const reminders = remindersResponse.data?.reminders || [];
      const now = new Date();
      const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      const upcomingReminders = reminders.filter(r => {
        const dueDate = new Date(r.dueDate);
        return dueDate >= now && dueDate <= nextWeek;
      });
      setRemindersCount(upcomingReminders.length);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err.response?.data?.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="page-shell">
      <ShellHeader active="dashboard" user={user} onLogout={handleLogout} />

      <div className="mx-auto max-w-7xl px-4 py-10 space-y-8">
        <DashboardHero
          onExplore={() => {
            if (mainRef.current) {
              mainRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }}
          onLearn={() => navigate('/transactions')}
          budgetData={budgetData}
          remindersCount={remindersCount}
        />

        <div ref={mainRef}>
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
            <span className="ml-4 text-ink-600 dark:text-ink-400 text-lg">Loading your finances...</span>
          </div>
        ) : error ? (
          <div className="card bg-rose-50 dark:bg-rose-900/20 border-2 border-rose-200 dark:border-rose-800">
            <div className="flex items-center gap-3">
              <div className="text-2xl">⚠️</div>
              <div>
                <p className="text-rose-700 dark:text-rose-300 font-medium">{error}</p>
                <button
                  onClick={fetchDashboardData}
                  className="mt-3 btn-ghost text-sm"
                >
                  Retry
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Main Stats Cards */}
            <DashboardStatsCards budgetData={budgetData} />

            <div className="grid gap-6 lg:grid-cols-3 mb-8">
              {/* Recent Transactions */}
              <RecentTransactions transactions={recentTransactions} />

              {/* Quick Stats */}
              <QuickStats 
                budgetData={budgetData} 
                transactionCount={recentTransactions.length}
              />
            </div>

            <div className="grid gap-6 lg:grid-cols-2 mb-8">
              <IncomeExpenseChart
                income={budgetData?.summary?.totalIncome}
                expense={budgetData?.summary?.totalExpenses}
                savings={budgetData?.summary?.savings}
              />
              <CategorySpendingChart
                budgets={budgetData?.budgets || []}
                spendingByCategory={budgetData?.spendingByCategory || {}}
              />
            </div>

            <BudgetOverview budgetData={budgetData} />
          </>
        )}
        </div>
      </div>
    </div>
  );
}
