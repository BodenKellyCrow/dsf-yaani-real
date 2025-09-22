// src/pages/Login.jsx
import { useState } from 'react';
import api from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');

    try {
      // ✅ Attempt login
      const res = await api.post('auth/login/', {
        username,
        password,
      });

      // ✅ Store tokens
      const { access, refresh } = res.data;
      localStorage.setItem('accessToken', access);
      localStorage.setItem('refreshToken', refresh);

      // ✅ Trigger app-level login state
      if (onLogin) onLogin();

      // ✅ Redirect
      navigate('/explore');
    } catch (err) {
      const data = err?.response?.data;
      const msg =
        typeof data === 'string'
          ? data
          : data?.detail ||
            Object.entries(data || {})
              .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(' ') : v}`)
              .join(' ') ||
            'Login failed. Please check your credentials.';
      setError(msg);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white p-6">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg border border-red-200">
        <h1 className="text-3xl font-bold mb-2 text-center text-red-600">
          Welcome Back
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Log in to continue exploring Doomscrollr.
        </p>

        {error && (
          <div className="text-red-600 bg-red-50 border border-red-200 mb-4 p-3 rounded-lg text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white p-3 rounded-xl font-semibold shadow-md transition"
          >
            Log In
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Don’t have an account?{' '}
          <Link to="/register" className="text-red-600 hover:underline font-medium">
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
