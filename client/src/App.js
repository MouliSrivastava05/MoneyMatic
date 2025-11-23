import React from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* Top nav */}
      <header className="sticky top-0 z-20 border-b border-ink-100/70 bg-white/70 backdrop-blur-xs dark:bg-ink-900/60 dark:border-ink-800">
        <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-brand-start to-brand-end" />
            <span className="font-display text-lg tracking-tight">MoneyMatic</span>
          </Link>
          <nav className="hidden md:flex items-center gap-2">
            <button className="btn-ghost">Dashboard</button>
            <button className="btn-ghost">Transactions</button>
            <button className="btn-ghost">Budgets</button>
            <button onClick={() => navigate('/login')} className="btn-primary">
              Sign in
            </button>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(600px_200px_at_20%_-20%,rgba(46,168,137,0.08),transparent),radial-gradient(600px_200px_at_80%_-20%,rgba(95,192,163,0.08),transparent)]" />
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-20">
          <div className="grid gap-10 md:grid-cols-2 items-center">
            <div className="animate-subtleIn">
              <h1 className="font-display text-4xl md:text-5xl font-semibold tracking-tight">
                Automate your finances with clarity.
              </h1>
              <p className="mt-4 text-ink-600 dark:text-ink-300">
                Track, analyze, and optimize spending with an elegant dashboard, real-time insights,
                and smart reminders.
              </p>
              <div className="mt-6 flex gap-3">
                <button onClick={() => navigate('/signup')} className="btn-primary">
                  Get started
                </button>
                <button className="btn-ghost">Live demo</button>
              </div>
            </div>
            <div className="animate-subtleIn-delay">
              <div className="card glass">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-ink-500">Monthly Overview</span>
                  <span className="text-xs text-ink-400">Nov</span>
                </div>
                <div className="mt-5 grid grid-cols-3 gap-4">
                  {[
                    { label: "Income", value: "$8,210", tone: "text-emerald-600" },
                    { label: "Expenses", value: "$4,120", tone: "text-rose-600" },
                    { label: "Savings", value: "$2,050", tone: "text-brand-600" },
                  ].map((kpi, i) => (
                    <div key={i} className="rounded-xl border border-ink-100/60 dark:border-ink-700 p-4">
                      <div className="text-xs text-ink-500">{kpi.label}</div>
                      <div className={`mt-1 text-lg font-semibold ${kpi.tone}`}>{kpi.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-20 grid gap-6 md:grid-cols-3">
        {["Smart Budgets", "Search & Filter", "Reminders"].map((title, i) => (
          <div key={i} className="card hover:shadow-glow transition-shadow">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-brand-start to-brand-end opacity-90" />
            <h3 className="mt-4 font-medium">{title}</h3>
            <p className="mt-1 text-sm text-ink-600 dark:text-ink-300">
              Elegant, intuitive, and delightful tooling for personal finance.
            </p>
            <button className="mt-4 btn-ghost">Learn more</button>
          </div>
        ))}
      </section>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/transactions" element={<Transactions />} />
      </Routes>
    </Router>
  );
}