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
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-brand-200 dark:border-brand-800 border-t-brand-600"></div>
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-brand-400 animate-spin" style={{ animationDuration: '0.75s' }}></div>
              </div>
              <p className="text-ink-600 dark:text-ink-400 text-lg font-medium">Loading your finances...</p>
              <p className="text-sm text-ink-500 dark:text-ink-500">Gathering insights from your data</p>
            </div>
          ) : error ? (
            <div className="card bg-rose-50 dark:bg-rose-900/20 border-2 border-rose-200 dark:border-rose-800 animate-pulse">
              <div className="flex items-center gap-4">
                <WarningIcon className="w-12 h-12 text-rose-600 dark:text-rose-400 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-rose-700 dark:text-rose-300 font-medium text-lg mb-2">{error}</p>
                  <button
                    onClick={fetchDashboardData}
                    className="btn-primary text-sm mt-2"
                  >
                    Retry Loading
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-8 animate-fade-in">
              {/* Main Stats Cards */}
              <DashboardStatsCards budgetData={budgetData} />

              {/* Charts Section */}
              <div className="grid gap-6 lg:grid-cols-2">
                <div className="transform transition-all duration-300 hover:scale-[1.02]">
                  <IncomeExpenseChart
                    income={budgetData?.summary?.totalIncome || 0}
                    expense={budgetData?.summary?.totalExpenses || 0}
                    savings={budgetData?.summary?.savings || 0}
                  />
                </div>
                <div className="transform transition-all duration-300 hover:scale-[1.02]">
                  <CategorySpendingChart
                    budgets={budgetData?.budgets || []}
                    spendingByCategory={budgetData?.spendingByCategory || {}}
                  />
                </div>
              </div>

              {/* Recent Activity Section */}
              <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2 transform transition-all duration-300 hover:scale-[1.01]">
                  <RecentTransactions transactions={recentTransactions} />
                </div>
                <div className="transform transition-all duration-300 hover:scale-[1.01]">
                  <QuickStats 
                    budgetData={budgetData} 
                    transactionCount={recentTransactions.length}
                  />
                </div>
              </div>

              {/* Budget Overview */}
              <div className="transform transition-all duration-300 hover:scale-[1.01]">
                <BudgetOverview budgetData={budgetData} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
