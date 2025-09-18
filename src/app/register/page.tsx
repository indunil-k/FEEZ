'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Register() {
  const [form, setForm] = useState({ userName: '', user: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setSuccess('Registration successful! You can now log in.');
        setForm({ userName: '', user: '', password: '' });
      } else {
        setError(data.error || 'Registration failed');
      }
    } catch (_err) {
      setError('Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 text-white p-4 flex flex-col items-center">
      <div className="w-full max-w-md bg-gray-800 rounded-xl shadow-lg p-8 mb-8">
        <h1 className="text-4xl font-extrabold mb-6 text-center">REGISTER</h1>
        <form onSubmit={handleRegister} className="flex flex-col gap-6">
          <input
            type="text"
            placeholder="NAME"
            className="text-2xl px-6 py-4 rounded-xl bg-gray-900 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={form.userName}
            onChange={e => setForm({ ...form, userName: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="EMAIL OR USERNAME"
            className="text-2xl px-6 py-4 rounded-xl bg-gray-900 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={form.user}
            onChange={e => setForm({ ...form, user: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="PASSWORD"
            className="text-2xl px-6 py-4 rounded-xl bg-gray-900 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
            required
            minLength={6}
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-2xl font-extrabold py-4 rounded-xl transition-all"
          >
            {loading ? 'REGISTERING...' : 'REGISTER'}
          </button>
          {error && <div className="text-xl text-red-500 text-center font-bold">{error}</div>}
          {success && <div className="text-xl text-green-500 text-center font-bold">{success}</div>}
        </form>
        <div className="mt-8 text-center">
          <Link href="/" className="w-full bg-blue-600 hover:bg-blue-700 text-2xl font-extrabold py-4 px-8 rounded-xl transition-all inline-block">BACK TO LOGIN</Link>
        </div>
      </div>
    </div>
  );
}
