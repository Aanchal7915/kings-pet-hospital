import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from './Header';
import Footer from './Footer';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const UserLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const { data } = await axios.post(`${API_URL}/api/auth/login`, { email, password });
      const user = data?.data?.user || {};
      if (user.role !== 'user') {
        setError('This account is an admin. Please use the admin login at /admin/login.');
        return;
      }
      localStorage.removeItem('adminToken');
      localStorage.setItem('userToken', data.token);
      localStorage.setItem('userInfo', JSON.stringify({
        id: user._id,
        name: user.name || '',
        email: user.email || '',
        role: user.role,
      }));
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Check your credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header showHero={false} />
      <main className="pt-28 pb-16 px-4">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-600 rounded-2xl shadow-lg shadow-blue-100 mb-3">
              <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.206" />
              </svg>
            </div>
            <h1 className="text-3xl font-black text-gray-900">Welcome Back</h1>
            <p className="text-gray-500 mt-1">Sign in to track your bookings & orders</p>
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8">
            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 p-3 rounded-xl mb-4 text-sm font-bold">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-700">Email *</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full mt-1 px-3 py-2.5 border rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-100 outline-none"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-gray-700">Password *</label>
                  <Link to="/forgot-password" className="text-xs text-blue-600 font-semibold">Forgot?</Link>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full mt-1 px-3 py-2.5 border rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-100 outline-none"
                  placeholder="••••••••"
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black disabled:opacity-60"
              >
                {submitting ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
            <p className="text-center text-sm text-gray-500 mt-5">
              New here?{' '}
              <Link to="/signup" className="text-blue-600 font-bold hover:underline">Create an account</Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default UserLogin;
