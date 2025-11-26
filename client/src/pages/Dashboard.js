import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import DashboardStatsCards from '../components/DashboardStatsCards';
import RecentTransactions from '../components/RecentTransactions';
import QuickStats from '../components/QuickStats';
import BudgetOverview from '../components/BudgetOverview';
import IncomeExpenseChart from '../components/IncomeExpenseChart';
import CategorySpendingChart from '../components/CategorySpendingChart';

export default function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [budgetData, setBudgetData] = useState(null);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [budgetResponse, transactionsResponse] = await Promise.all([
        api.get('/api/budget'),
        api.get('/api/transactions?limit=5&sortBy=date&sortOrder=desc'),
      ]);
      setBudgetData(budgetResponse.data);
      setRecentTransactions(transactionsResponse.data.transactions || []);
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
            <Link to="/transactions" className="btn-ghost text-sm">Transactions</Link>
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

      {/* Dashboard Content */}
      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-ink-900 dark:text-ink-100">
                Welcome back, {user.name || 'User'}! 👋
              </h1>
              <p className="mt-2 text-ink-600 dark:text-ink-400">
                Here's your financial overview for{' '}
                {budgetData?.period
                  ? new Date(budgetData.period.year, budgetData.period.month - 1).toLocaleString('default', { month: 'long', year: 'numeric' })
                  : 'this month'}
              </p>
            </div>
            <Link to="/transactions" className="btn-primary hidden md:flex">
              + Add Transaction
            </Link>
          </div>
        </div>

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

            {/* Budget Overview */}
            <BudgetOverview budgetData={budgetData} />
          </>
        )}
      </div>
    </div>
  );
}
