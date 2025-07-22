// src/pages/LoginPage.jsx
import { useState } from 'react';
import api from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';

const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await api.post('auth/login/', { email, password });
      onLogin();
      navigate('/explore');
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="max-w-md w-full bg-white p-6 rounded-2xl shadow">
        {/* 🎉 Welcome Header */}
        <h1 className="text-3xl font-bold mb-2 text-center">Welcome to Doomscrollr 🚀</h1>
        <p className="text-center text-gray-600 mb-6">
          Log in to explore and support your favorite projects.
        </p>

        {error && <div className="text-red-500 mb-3 text-sm text-center">{error}</div>}

        {/* 🔐 Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 border rounded"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 border rounded"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="w-full bg-black text-white p-3 rounded-xl">
            Log In
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-500">
          Don’t have an account?{' '}
          <Link to="/register" className="text-blue-600">Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
