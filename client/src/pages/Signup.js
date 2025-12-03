import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import AnimatedLogo from '../components/AnimatedLogo';

export default function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Validate password length
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, ...signupData } = formData;
      const response = await api.post('/api/auth/signup', signupData);
      const { token, user } = response.data;

      // Store token and user data
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      // Redirect to dashboard
      navigate('/dashboard');
    } catch (err) {
      console.error('Signup error:', err);
      
      // More detailed error messages
      if (err.response) {
        // Server responded with error
        setError(err.response?.data?.message || 'Server error. Please try again.');
      } else if (err.request) {
        // Request was made but no response received
        setError('Cannot connect to server. Please check your connection or contact support.');
      } else {
        // Something else happened
        setError('An error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-shell flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">

        <div className="text-center mb-8 animate-subtleIn">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <AnimatedLogo size="lg" />
            <span className="font-display text-2xl font-semibold tracking-tight">
              MoneyMatic
            </span>
          </Link>
          <h1 className="text-3xl font-semibold text-ink-900 dark:text-ink-100 mb-2">
            Create your account
          </h1>
          <p className="text-ink-600 dark:text-ink-400">
            Start managing your finances today
          </p>
        </div>

        <div className="card animate-subtleIn-delay">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="rounded-xl bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 px-4 py-3 text-sm text-rose-700 dark:text-rose-300">
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-ink-700 dark:text-ink-300 mb-2"
              >
                Full name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="input"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-ink-700 dark:text-ink-300 mb-2"
              >
                Email address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="input"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-ink-700 dark:text-ink-300 mb-2"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="input"
                placeholder="••••••••"
                minLength="6"
              />
              <p className="mt-1 text-xs text-ink-500 dark:text-ink-400">
                Must be at least 6 characters
              </p>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-ink-700 dark:text-ink-300 mb-2"
              >
                Confirm password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="input"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 text-base font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Creating account...
                </span>
              ) : (
                'Create account'
              )}
            </button>
          </form>

          {/* Sign In Link */}
          <div className="mt-6 text-center text-sm text-ink-600 dark:text-ink-400">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300 transition-colors"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

