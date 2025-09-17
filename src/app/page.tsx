'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface User {
  _id: string;
  userName: string;
  user: string;
  role: string;
  createdAt: string;
}

interface HealthStatus {
  status: string;
  database: string;
  environment: string;
  timestamp: string;
}

export default function Home() {
  const [users, setUsers] = useState<User[]>([]);
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [loginForm, setLoginForm] = useState({ user: '', password: '' });
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const fetchHealth = async () => {
    try {
      const response = await fetch('/api/health');
      const data = await response.json();
      setHealth(data.data);
    } catch (error) {
      console.error('Error fetching health:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users');
      const data = await response.json();
      setUsers(data.data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setLoginError('');
        // Save token to localStorage (or cookie for production)
        localStorage.setItem('feez_token', data.data.token);
        // Redirect or show success (demo: alert)
        alert('Login successful!');
      } else {
        setLoginError(data.error || 'Invalid credentials');
      }
    } catch (error) {
      setLoginError('Login failed');
    } finally {
      setLoginLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
    fetchUsers();
    // Check for token
    const token = localStorage.getItem('feez_token');
    setIsAuthenticated(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('feez_token');
    setIsAuthenticated(false);
    setLoginForm({ user: '', password: '' });
    setLoginError('');
    alert('Logged out successfully!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 text-white p-4 flex flex-col items-center">
      {/* Navigation Bar */}
      <nav className="w-full flex flex-col md:flex-row justify-between items-center py-4 px-2 mb-8 bg-gray-800 rounded-xl shadow-lg">
        <div className="text-3xl font-extrabold tracking-wide mb-2 md:mb-0">FEEZ</div>
        <div className="flex gap-4 md:gap-6 items-center">
          <Link href="/" className="text-xl md:text-2xl font-bold px-4 py-2 rounded-lg hover:bg-blue-700 transition-all">LOGIN</Link>
          <Link href="/public" className="text-xl md:text-2xl font-bold px-4 py-2 rounded-lg hover:bg-blue-700 transition-all">PUBLIC</Link>
          {isAuthenticated && (
            <Link href="/dashboard" className="text-xl md:text-2xl font-bold px-4 py-2 rounded-lg bg-yellow-600 hover:bg-yellow-700 transition-all">DASHBOARD</Link>
          )}
          {isAuthenticated && (
            <button
              onClick={handleLogout}
              className="text-xl md:text-2xl font-bold px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 transition-all"
            >
              LOGOUT
            </button>
          )}
        </div>
      </nav>

      {/* Login Form */}
      <div className="w-full max-w-md bg-gray-800 rounded-xl shadow-lg p-8 mb-8">
        <h1 className="text-4xl font-extrabold mb-6 text-center">{isAuthenticated ? 'WELCOME' : 'LOGIN'}</h1>
        {!isAuthenticated ? (
          <form onSubmit={handleLogin} className="flex flex-col gap-6">
            <input
              type="text"
              placeholder="EMAIL"
              className="text-2xl px-6 py-4 rounded-xl bg-gray-900 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={loginForm.user}
              onChange={e => setLoginForm({ ...loginForm, user: e.target.value })}
              required
            />
            <input
              type="password"
              placeholder="PASSWORD"
              className="text-2xl px-6 py-4 rounded-xl bg-gray-900 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={loginForm.password}
              onChange={e => setLoginForm({ ...loginForm, password: e.target.value })}
              required
            />
            <button
              type="submit"
              disabled={loginLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-2xl font-extrabold py-4 rounded-xl transition-all"
            >
              {loginLoading ? 'LOGGING IN...' : 'LOGIN'}
            </button>
            {loginError && <div className="text-xl text-red-500 text-center font-bold">{loginError}</div>}
          </form>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <div className="text-2xl font-bold text-green-400">You are logged in.</div>
            <button
              onClick={handleLogout}
              className="w-full bg-red-600 hover:bg-red-700 text-2xl font-extrabold py-4 rounded-xl transition-all"
            >
              LOGOUT
            </button>
          </div>
        )}
        <div className="mt-8 text-center">
          <Link href="/register" className="w-full bg-green-600 hover:bg-green-700 text-2xl font-extrabold py-4 px-8 rounded-xl transition-all inline-block">REGISTER</Link>
        </div>
      </div>

      {/* Health Status */}
      {/*
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
          System Status
        </h2>
        {health ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className={`text-2xl font-bold ${health && health.status === 'healthy' ? 'text-green-500' : 'text-red-500'}`}>
                {health && health.status.toUpperCase()}
              </div>
              <div className="text-gray-600 dark:text-gray-300">Status</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-500">
                {health && health.database.toUpperCase()}
              </div>
              <div className="text-gray-600 dark:text-gray-300">Database</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-500">
                {health && health.environment.toUpperCase()}
              </div>
              <div className="text-gray-600 dark:text-gray-300">Environment</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-orange-500">
                {health && new Date(health.timestamp).toLocaleTimeString()}
              </div>
              <div className="text-gray-600 dark:text-gray-300">Last Check</div>
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-500">Loading system status...</div>
        )}
      </div>
      */}

      {/* Users List */}
      {/*
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
            Users ({users.length})
          </h2>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {users.length > 0 ? (
              users.map((user) => (
                <div
                  key={user._id}
                  className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md border-l-4 border-blue-500"
                >
                  <div className="font-semibold text-gray-800 dark:text-white">
                    {user.userName}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    {user.user}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Role: {user.role} | Created: {new Date(user.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-gray-500 text-center py-8">
                No users found. Create your first user!
              </div>
            )}
          </div>
        </div>
      </div>
      */}
    </div>
  );
}
