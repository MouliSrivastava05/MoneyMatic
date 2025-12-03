import React from 'react';
import { useNavigate } from 'react-router-dom';
import ShellHeader from '../components/ShellHeader';

export default function PersonalFinanceBlog() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="page-shell">
      <ShellHeader active="dashboard" user={user} onLogout={handleLogout} />

      <div className="mx-auto max-w-4xl px-4 py-10">
        <button
          onClick={() => navigate('/dashboard')}
          className="mb-8 text-sm text-ink-400 dark:text-ink-500 hover:text-brand-400 dark:hover:text-brand-300 transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Dashboard
        </button>

        <article className="card space-y-6">
          <header className="space-y-3 border-b border-ink-200 dark:border-ink-700 pb-6">
            <h1 className="text-3xl md:text-4xl font-bold text-ink-900 dark:text-white leading-tight">
              How to Manage Personal Finance
            </h1>
            <p className="text-base text-ink-600 dark:text-ink-400">
              Essential strategies to take control of your money and build financial security.
            </p>
          </header>

          <div className="space-y-6 text-ink-700 dark:text-ink-300">
            <section>
              <h2 className="text-xl font-semibold text-ink-900 dark:text-white mb-3">
                1. Create and Follow a Budget
              </h2>
              <p className="mb-2">
                Track your income and expenses using the 50/30/20 rule: 50% for needs, 30% for wants, and 20% for savings and debt repayment. Use MoneyMatic to set category budgets and monitor spending in real-time.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-ink-900 dark:text-white mb-3">
                2. Build an Emergency Fund
              </h2>
              <p>
                Save 3-6 months of living expenses in a high-yield savings account. Start with $1,000 if needed, then automate monthly transfers to build it gradually.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-ink-900 dark:text-white mb-3">
                3. Track Every Transaction
              </h2>
              <p>
                Record all spending to identify patterns and leaks. Review transactions weekly to catch unauthorized charges and stay within budget.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-ink-900 dark:text-white mb-3">
                4. Pay Off High-Interest Debt
              </h2>
              <p>
                Focus on eliminating credit card debt and high-interest loans first. Once debt-free, redirect those payments to savings and investments.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-ink-900 dark:text-white mb-3">
                5. Automate Your Finances
              </h2>
              <p>
                Set up automatic bill payments, savings transfers, and retirement contributions. Use MoneyMatic's reminders to never miss a payment or subscription renewal.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-ink-900 dark:text-white mb-3">
                6. Review and Adjust Monthly
              </h2>
              <p>
                Compare actual spending to your budget each month. Adjust categories that consistently go over and update goals based on your progress.
              </p>
            </section>

            <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-brand-50 to-emerald-50 dark:from-brand-900/20 dark:to-emerald-900/20 border border-brand-200 dark:border-brand-800">
              <h3 className="text-lg font-semibold text-ink-900 dark:text-white mb-2">
                Ready to Take Control?
              </h3>
              <p className="text-ink-700 dark:text-ink-300 mb-4 text-sm">
                Start managing your finances today with MoneyMatic.
              </p>
              <button
                onClick={() => navigate('/dashboard')}
                className="btn-primary"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}

