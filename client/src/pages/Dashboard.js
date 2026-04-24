import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import WarningIcon from '../icons/WarningIcon';
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
        api.get('/api/budget').catch(() => ({ 
          data: { 
            summary: { totalIncome: 0, totalExpenses: 0, savings: 0 },
            budgets: [],
            spendingByCategory: {},
            period: { month: new Date().getMonth() + 1, year: new Date().getFullYear() }
          } 
        })),
        api.get('/api/transactions?limit=5&sortBy=date&sortOrder=desc').catch(() => ({ 
          data: { transactions: [] } 
        })),
        api.get('/api/reminders?isActive=true').catch(() => ({ data: { reminders: [] } })),
      ]);
      
      // Ensure budgetData has proper structure
      const budgetData = budgetResponse.data || {};
      if (!budgetData.summary) {
        budgetData.summary = {
          totalIncome: 0,
          totalExpenses: 0,
          savings: 0,
        };
      }
      if (!budgetData.budgets) {
        budgetData.budgets = [];
      }
      if (!budgetData.spendingByCategory) {
        budgetData.spendingByCategory = {};
      }
      if (!budgetData.period) {
        const now = new Date();
        budgetData.period = {
          month: now.getMonth() + 1,
          year: now.getFullYear(),
        };
      }
      
      setBudgetData(budgetData);
      setRecentTransactions(transactionsResponse.data?.transactions || []);
      
      // Count reminders due in the next 7 days
      const reminders = remindersResponse.data?.reminders || [];
      const now = new Date();
      const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      const upcomingReminders = reminders.filter(r => {
        if (!r.dueDate) return false;
        const dueDate = new Date(r.dueDate);
        return dueDate >= now && dueDate <= nextWeek;
      });
      setRemindersCount(upcomingReminders.length);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err.response?.data?.message || 'Failed to load dashboard data');
      // Set default data structure on error
      setBudgetData({
        summary: { totalIncome: 0, totalExpenses: 0, savings: 0 },
        budgets: [],
        spendingByCategory: {},
        period: { month: new Date().getMonth() + 1, year: new Date().getFullYear() }
      });
      setRecentTransactions([]);
      setRemindersCount(0);
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
          budgetData={budgetData}
          remindersCount={remindersCount}
        />

        <div ref={mainRef}>
          {!loading && !error && budgetData?.period && (
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-semibold text-ink-900 dark:text-white mb-2">
                Dashboard
              </h2>
              <p className="text-sm text-ink-600 dark:text-ink-400 uppercase tracking-wider">
                {new Date(budgetData.period.year, budgetData.period.month - 1).toLocaleString('default', { 
                  month: 'long', 
                  year: 'numeric' 
                })}
              </p>
            </div>
          )}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 space-y-5">
              <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-2 border-brand-500/20 border-t-brand-500"></div>
                <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-emerald-400 animate-spin" style={{ animationDuration: '1.5s' }}></div>
              </div>
              <p className="text-ink-400 font-medium tracking-wide">Syncing your financial world...</p>
            </div>
          ) : error ? (
            <div className="card border-rose-500/20 bg-rose-500/[0.05] animate-scale-in">
              <div className="flex flex-col items-center justify-center text-center py-10">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-500/10 mb-4">
                  <WarningIcon className="w-8 h-8 text-rose-400" />
                </div>
                <p className="text-rose-400 font-bold text-lg mb-2">Connection Error</p>
                <p className="text-ink-400 max-w-md mb-6">{error}</p>
                <button
                  onClick={fetchDashboardData}
                  className="btn-danger"
                >
                  Try Again
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-8 animate-fade-in">
              {/* Main Stats Cards */}
              <DashboardStatsCards budgetData={budgetData} />

              {/* Charts Section */}
              <div className="grid gap-6 lg:grid-cols-2">
                <IncomeExpenseChart
                  income={budgetData?.summary?.totalIncome || 0}
                  expense={budgetData?.summary?.totalExpenses || 0}
                  savings={budgetData?.summary?.savings || 0}
                />
                <CategorySpendingChart
                  budgets={budgetData?.budgets || []}
                  spendingByCategory={budgetData?.spendingByCategory || {}}
                />
              </div>

              {/* Recent Activity Section */}
              <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2">
                  <RecentTransactions transactions={recentTransactions} />
                </div>
                <div>
                  <QuickStats 
                    budgetData={budgetData} 
                    transactionCount={recentTransactions.length}
                  />
                </div>
              </div>

              {/* Budget Overview */}
              <BudgetOverview budgetData={budgetData} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
