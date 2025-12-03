import React from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Budgets from "./pages/Budgets";
import Reminders from "./pages/Reminders";
import PersonalFinanceBlog from "./pages/PersonalFinanceBlog";
import ProtectedRoute from "./components/ProtectedRoute";
import AnimatedLogo from "./components/AnimatedLogo";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="page-shell">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-6">
        <Link to="/" className="flex items-center gap-3 rounded-full border border-white/60 bg-white/70 px-4 py-2 shadow-soft">
          <AnimatedLogo size="sm" />
          <span className="font-display text-lg tracking-tight text-ink-900">MoneyMatic</span>
        </Link>
        <div className="hidden items-center gap-3 md:flex">
          <button onClick={() => navigate('/login')} className="btn-ghost text-sm">
            Sign in
          </button>
          <button onClick={() => navigate('/signup')} className="btn-primary text-sm">
            Create account
          </button>
        </div>
      </header>

      <section className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-10 lg:flex-row">
        <div className="flex-1 space-y-6">
          <span className="pill">Personal finance OS</span>
          <h1 className="font-display text-4xl font-semibold tracking-tight text-ink-900 dark:text-white md:text-5xl">
            Sleek budgeting meets intentional spending.
          </h1>
          <p className="text-lg text-ink-600 dark:text-ink-300">
            MoneyMatic blends dashboards, transactions, budgets, and reminders into one calm command center.
          </p>
          <div className="flex flex-wrap gap-3">
            <button onClick={() => navigate('/signup')} className="btn-primary px-6 py-3 text-base">
              Get started free
            </button>
            <button onClick={() => navigate('/login')} className="btn-outline px-6 py-3 text-base">
              Sign in
            </button>
          </div>
        </div>
        <div className="flex-1 space-y-4">
          <div className="card">
            <div className="flex items-center justify-between text-sm text-ink-500">
              <span>Monthly overview</span>
              <span>Live</span>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-4">
              {[
                { label: 'Income', value: '$8,210', tone: 'text-emerald-500' },
                { label: 'Expenses', value: '$4,120', tone: 'text-rose-500' },
                { label: 'Savings', value: '$2,050', tone: 'text-brand-600' },
              ].map((kpi) => (
                <div key={kpi.label} className="rounded-2xl border border-ink-100/80 p-4 dark:border-ink-700/80">
                  <p className="text-xs uppercase tracking-wide text-ink-400">{kpi.label}</p>
                  <p className={`text-xl font-semibold ${kpi.tone}`}>{kpi.value}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="card flex items-center justify-between">
            <div>
              <p className="text-sm text-ink-500">Automation layers</p>
              <h3 className="text-2xl font-semibold text-ink-900 dark:text-white">Reminders & insights</h3>
              <p className="mt-1 text-sm text-ink-500 dark:text-ink-300">
                Nudges you when bills and subscriptions are near.
              </p>
            </div>
            <span className="rounded-full bg-ink-900 px-4 py-2 text-sm font-medium text-white dark:bg-white dark:text-ink-900">
              Always-on
            </span>
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-6xl gap-6 px-4 pb-16 md:grid-cols-3">
        {['Smart budgets', 'Deep filters', 'Calm reminders'].map((title) => (
          <div key={title} className="card hover:shadow-glow transition">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-brand-start to-brand-end" />
            <h3 className="mt-4 text-xl font-semibold text-ink-900 dark:text-white">{title}</h3>
            <p className="mt-2 text-sm text-ink-600 dark:text-ink-300">
              Tools that feel handcrafted, tuned for the way you actually review money.
            </p>
            <button className="mt-4 text-sm font-medium text-brand-600 hover:text-brand-500">
              Learn more →
            </button>
          </div>
        ))}
      </section>
    </div>
  );
}

// Component to redirect authenticated users away from auth pages
function PublicRoute({ children }) {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');

  if (token && user) {
    // Redirect to dashboard if already authenticated
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route 
          path="/login" 
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } 
        />
        <Route 
          path="/signup" 
          element={
            <PublicRoute>
              <Signup />
            </PublicRoute>
          } 
        />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/transactions" 
          element={
            <ProtectedRoute>
              <Transactions />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/budgets" 
          element={
            <ProtectedRoute>
              <Budgets />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/reminders" 
          element={
            <ProtectedRoute>
              <Reminders />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/personal-finance-guide" 
          element={
            <ProtectedRoute>
              <PersonalFinanceBlog />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}