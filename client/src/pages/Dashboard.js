import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';

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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const totalBalance = budgetData?.summary
    ? budgetData.summary.totalIncome - budgetData.summary.totalExpenses
    : 0;

  const savingsRate = budgetData?.summary?.totalIncome
    ? ((totalBalance / budgetData.summary.totalIncome) * 100).toFixed(1)
    : 0;

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
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
              {/* Income Card */}
              <div className="card bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 border-emerald-200 dark:border-emerald-800">
                <div className="flex items-center justify-between mb-3">
                  <div className="h-12 w-12 rounded-xl bg-emerald-500 flex items-center justify-center">
                    <span className="text-2xl">💰</span>
                  </div>
                  <span className="text-xs font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-200 dark:bg-emerald-800 px-2 py-1 rounded-full">
                    Income
                  </span>
                </div>
                <h3 className="text-sm font-medium text-ink-600 dark:text-ink-400 mb-1">
                  Total Income
                </h3>
                <p className="text-3xl font-bold text-emerald-700 dark:text-emerald-300">
                  {formatCurrency(budgetData?.summary?.totalIncome)}
                </p>
              </div>

              {/* Expenses Card */}
              <div className="card bg-gradient-to-br from-rose-50 to-rose-100 dark:from-rose-900/20 dark:to-rose-800/20 border-rose-200 dark:border-rose-800">
                <div className="flex items-center justify-between mb-3">
                  <div className="h-12 w-12 rounded-xl bg-rose-500 flex items-center justify-center">
                    <span className="text-2xl">💸</span>
                  </div>
                  <span className="text-xs font-medium text-rose-700 dark:text-rose-300 bg-rose-200 dark:bg-rose-800 px-2 py-1 rounded-full">
                    Expenses
                  </span>
                </div>
                <h3 className="text-sm font-medium text-ink-600 dark:text-ink-400 mb-1">
                  Total Expenses
                </h3>
                <p className="text-3xl font-bold text-rose-700 dark:text-rose-300">
                  {formatCurrency(budgetData?.summary?.totalExpenses)}
                </p>
              </div>

              {/* Savings Card */}
              <div className={`card bg-gradient-to-br ${
                totalBalance >= 0
                  ? 'from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 border-emerald-200 dark:border-emerald-800'
                  : 'from-rose-50 to-rose-100 dark:from-rose-900/20 dark:to-rose-800/20 border-rose-200 dark:border-rose-800'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <div className={`h-12 w-12 rounded-xl ${
                    totalBalance >= 0 ? 'bg-emerald-500' : 'bg-rose-500'
                  } flex items-center justify-center`}>
                    <span className="text-2xl">{totalBalance >= 0 ? '💵' : '📉'}</span>
                  </div>
                  <span className={`text-xs font-medium ${
                    totalBalance >= 0
                      ? 'text-emerald-700 dark:text-emerald-300 bg-emerald-200 dark:bg-emerald-800'
                      : 'text-rose-700 dark:text-rose-300 bg-rose-200 dark:bg-rose-800'
                  } px-2 py-1 rounded-full`}>
                    {totalBalance >= 0 ? 'Savings' : 'Deficit'}
                  </span>
                </div>
                <h3 className="text-sm font-medium text-ink-600 dark:text-ink-400 mb-1">
                  Net Balance
                </h3>
                <p className={`text-3xl font-bold ${
                  totalBalance >= 0
                    ? 'text-emerald-700 dark:text-emerald-300'
                    : 'text-rose-700 dark:text-rose-300'
                }`}>
                  {formatCurrency(totalBalance)}
                </p>
              </div>

              {/* Savings Rate Card */}
              <div className="card bg-gradient-to-br from-brand-50 to-brand-100 dark:from-brand-900/20 dark:to-brand-800/20 border-brand-200 dark:border-brand-800">
                <div className="flex items-center justify-between mb-3">
                  <div className="h-12 w-12 rounded-xl bg-brand-500 flex items-center justify-center">
                    <span className="text-2xl">📊</span>
                  </div>
                  <span className="text-xs font-medium text-brand-700 dark:text-brand-300 bg-brand-200 dark:bg-brand-800 px-2 py-1 rounded-full">
                    Rate
                  </span>
                </div>
                <h3 className="text-sm font-medium text-ink-600 dark:text-ink-400 mb-1">
                  Savings Rate
                </h3>
                <p className="text-3xl font-bold text-brand-700 dark:text-brand-300">
                  {savingsRate}%
                </p>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3 mb-8">
              {/* Recent Transactions */}
              <div className="lg:col-span-2 card">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-ink-900 dark:text-ink-100">
                    Recent Transactions
                  </h2>
                  <Link to="/transactions" className="btn-ghost text-sm">
                    View All →
                  </Link>
                </div>
                {recentTransactions.length > 0 ? (
                  <div className="space-y-3">
                    {recentTransactions.map((transaction) => (
                      <div
                        key={transaction.id}
                        className="flex items-center justify-between p-4 rounded-xl border border-ink-200 dark:border-ink-700 hover:bg-ink-50 dark:hover:bg-ink-800/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                            transaction.type === 'income'
                              ? 'bg-emerald-100 dark:bg-emerald-900/30'
                              : 'bg-rose-100 dark:bg-rose-900/30'
                          }`}>
                            <span className="text-lg">
                              {transaction.type === 'income' ? '⬆️' : '⬇️'}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-ink-900 dark:text-ink-100">
                              {transaction.description || transaction.category}
                            </p>
                            <p className="text-sm text-ink-500 dark:text-ink-400">
                              {transaction.category} • {formatDate(transaction.date)}
                            </p>
                          </div>
                        </div>
                        <p className={`font-semibold ${
                          transaction.type === 'income'
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-rose-600 dark:text-rose-400'
                        }`}>
                          {transaction.type === 'income' ? '+' : '-'}
                          {formatCurrency(transaction.amount)}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-3">📝</div>
                    <p className="text-ink-600 dark:text-ink-400 mb-4">
                      No transactions yet
                    </p>
                    <Link to="/transactions" className="btn-primary">
                      Add Your First Transaction
                    </Link>
                  </div>
                )}
              </div>

              {/* Quick Stats */}
              <div className="card">
                <h2 className="text-xl font-semibold text-ink-900 dark:text-ink-100 mb-6">
                  Quick Stats
                </h2>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-ink-600 dark:text-ink-400">Income vs Expenses</span>
                      <span className="font-medium text-ink-900 dark:text-ink-100">
                        {budgetData?.summary?.totalIncome
                          ? ((budgetData.summary.totalExpenses / budgetData.summary.totalIncome) * 100).toFixed(1)
                          : 0}%
                      </span>
                    </div>
                    <div className="w-full bg-ink-200 dark:bg-ink-700 rounded-full h-2">
                      <div
                        className="bg-brand-500 h-2 rounded-full"
                        style={{
                          width: `${Math.min(
                            budgetData?.summary?.totalIncome
                              ? (budgetData.summary.totalExpenses / budgetData.summary.totalIncome) * 100
                              : 0,
                            100
                          )}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-ink-200 dark:border-ink-700">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-ink-600 dark:text-ink-400">Transaction Count</span>
                      <span className="font-semibold text-ink-900 dark:text-ink-100">
                        {recentTransactions.length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-ink-600 dark:text-ink-400">Active Budgets</span>
                      <span className="font-semibold text-ink-900 dark:text-ink-100">
                        {budgetData?.budgets?.length || 0}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Budget Overview */}
            {budgetData?.period && budgetData.budgets && budgetData.budgets.length > 0 && (
              <div className="card">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-semibold text-ink-900 dark:text-ink-100">
                      Budget Overview
                    </h2>
                    <p className="text-sm text-ink-600 dark:text-ink-400 mt-1">
                      {new Date(budgetData.period.year, budgetData.period.month - 1).toLocaleString('default', { month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                  <Link to="/budgets" className="btn-ghost text-sm">
                    Manage Budgets →
                  </Link>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  {budgetData.budgets.map((budget) => (
                    <div
                      key={budget.id}
                      className={`p-4 rounded-xl border-2 ${
                        budget.isOverBudget
                          ? 'border-rose-300 dark:border-rose-700 bg-rose-50 dark:bg-rose-900/20'
                          : 'border-ink-200 dark:border-ink-700'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center gap-2">
                          <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${
                            budget.isOverBudget
                              ? 'bg-rose-100 dark:bg-rose-900/30'
                              : 'bg-emerald-100 dark:bg-emerald-900/30'
                          }`}>
                            <span>{budget.isOverBudget ? '⚠️' : '✅'}</span>
                          </div>
                          <span className="font-semibold text-ink-900 dark:text-ink-100">
                            {budget.category}
                          </span>
                        </div>
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                          budget.isOverBudget
                            ? 'text-rose-700 dark:text-rose-300 bg-rose-200 dark:bg-rose-800'
                            : 'text-emerald-700 dark:text-emerald-300 bg-emerald-200 dark:bg-emerald-800'
                        }`}>
                          {budget.isOverBudget ? 'Over' : 'OK'}
                        </span>
                      </div>
                      <div className="mb-2">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-ink-600 dark:text-ink-400">
                            {formatCurrency(budget.actualSpending)} / {formatCurrency(Number(budget.limit))}
                          </span>
                          <span className="font-medium text-ink-900 dark:text-ink-100">
                            {budget.percentageUsed.toFixed(1)}%
                          </span>
                        </div>
                        <div className="w-full bg-ink-200 dark:bg-ink-700 rounded-full h-2.5 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              budget.isOverBudget ? 'bg-rose-500' : 'bg-emerald-500'
                            }`}
                            style={{
                              width: `${Math.min(budget.percentageUsed, 100)}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                      <div className="flex justify-between text-xs text-ink-500 dark:text-ink-400">
                        <span>Remaining: {formatCurrency(budget.remaining)}</span>
                        <span>
                          {budget.remaining >= 0 ? '💰' : '💸'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Empty State for Budgets */}
            {budgetData?.period && (!budgetData.budgets || budgetData.budgets.length === 0) && (
              <div className="card text-center py-12">
                <div className="text-5xl mb-4">📊</div>
                <h3 className="text-xl font-semibold text-ink-900 dark:text-ink-100 mb-2">
                  No Budgets Set
                </h3>
                <p className="text-ink-600 dark:text-ink-400 mb-6">
                  Create a budget to track your spending and stay on top of your finances!
                </p>
                <Link to="/budgets" className="btn-primary">
                  Create Your First Budget
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}


