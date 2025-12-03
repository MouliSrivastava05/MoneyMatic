import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import ShellHeader from '../components/ShellHeader';
import PageHero from '../components/PageHero';

export default function Settings() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');
  
  // Profile form state
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
  });
  
  // Password form state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/api/auth/me');
      const userData = response.data.user;
      setUser(userData);
      setProfileData({
        name: userData.name,
        email: userData.email,
      });
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError(err.response?.data?.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileChange = (key, value) => {
    setProfileData({ ...profileData, [key]: value });
    setError(null);
    setSuccess(null);
  };

  const handlePasswordChange = (key, value) => {
    setPasswordData({ ...passwordData, [key]: value });
    setError(null);
    setSuccess(null);
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const response = await api.put('/api/auth/me', profileData);
      setUser(response.data.user);
      // Update localStorage
      localStorage.setItem('user', JSON.stringify(response.data.user));
      setSuccess('Profile updated successfully!');
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.response?.data?.message || 'Failed to update profile');
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError('New password must be at least 6 characters');
      return;
    }

    try {
      await api.put('/api/auth/me/password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      setSuccess('Password updated successfully!');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Error changing password:', err);
      setError(err.response?.data?.message || 'Failed to change password');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const currentUser = user || JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <div className="page-shell">
      <ShellHeader active="settings" user={currentUser} onLogout={handleLogout} />

      <div className="mx-auto max-w-4xl px-4 py-10 space-y-8">
        <PageHero
          eyebrow="Settings"
          title="Manage your account"
          description="Update your profile information and security settings."
        />

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
            <span className="ml-4 text-ink-600 dark:text-ink-400 text-lg">Loading...</span>
          </div>
        ) : (
          <>
            {/* Tabs */}
            <div className="flex gap-2 border-b border-white/10">
              <button
                onClick={() => {
                  setActiveTab('profile');
                  setError(null);
                  setSuccess(null);
                }}
                className={`px-6 py-3 text-sm font-medium transition-colors ${
                  activeTab === 'profile'
                    ? 'border-b-2 border-brand-400 text-brand-400'
                    : 'text-white/60 hover:text-white/80'
                }`}
              >
                Profile
              </button>
              <button
                onClick={() => {
                  setActiveTab('password');
                  setError(null);
                  setSuccess(null);
                }}
                className={`px-6 py-3 text-sm font-medium transition-colors ${
                  activeTab === 'password'
                    ? 'border-b-2 border-brand-400 text-brand-400'
                    : 'text-white/60 hover:text-white/80'
                }`}
              >
                Password
              </button>
            </div>

            {/* Error/Success Messages */}
            {error && (
              <div className="card bg-rose-50 dark:bg-rose-900/20 border-2 border-rose-200 dark:border-rose-800">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">⚠️</div>
                  <p className="text-rose-700 dark:text-rose-300 font-medium">{error}</p>
                </div>
              </div>
            )}

            {success && (
              <div className="card bg-emerald-50 dark:bg-emerald-900/20 border-2 border-emerald-200 dark:border-emerald-800">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">✓</div>
                  <p className="text-emerald-700 dark:text-emerald-300 font-medium">{success}</p>
                </div>
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <form onSubmit={handleProfileSubmit} className="card space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-ink-900 dark:text-ink-100 mb-2">
                    Profile Information
                  </h3>
                  <p className="text-sm text-ink-600 dark:text-ink-400">
                    Update your name and email address.
                  </p>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-ink-600 dark:text-ink-300">
                    Name
                  </label>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => handleProfileChange('name', e.target.value)}
                    className="input"
                    required
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-ink-600 dark:text-ink-300">
                    Email
                  </label>
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => handleProfileChange('email', e.target.value)}
                    className="input"
                    required
                    placeholder="your.email@example.com"
                  />
                </div>

                {user && (
                  <div className="pt-4 border-t border-white/10">
                    <p className="text-xs text-ink-500 dark:text-ink-400">
                      Member since {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <button type="submit" className="btn-primary flex-1">
                    Save Changes
                  </button>
                </div>
              </form>
            )}

            {/* Password Tab */}
            {activeTab === 'password' && (
              <form onSubmit={handlePasswordSubmit} className="card space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-ink-900 dark:text-ink-100 mb-2">
                    Change Password
                  </h3>
                  <p className="text-sm text-ink-600 dark:text-ink-400">
                    Enter your current password and choose a new one.
                  </p>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-ink-600 dark:text-ink-300">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                    className="input"
                    required
                    placeholder="Enter current password"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-ink-600 dark:text-ink-300">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                    className="input"
                    required
                    minLength={6}
                    placeholder="At least 6 characters"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-ink-600 dark:text-ink-300">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                    className="input"
                    required
                    minLength={6}
                    placeholder="Confirm new password"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button type="submit" className="btn-primary flex-1">
                    Update Password
                  </button>
                </div>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
}

