// src/pages/Register.jsx
import { useState } from 'react';
import api from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';

const Register = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');

    if (password1 !== password2) {
      setError('Passwords do not match');
      return;
    }

    try {
      // ✅ Create account
      await api.post('auth/registration/', {
        email,
        username,
        password1,
        password2,
      });

      // ✅ Auto-login immediately
      const loginRes = await api.post('auth/login/', {
        username,
        password: password1,
      });

      // ✅ Store tokens
      const { access, refresh } = loginRes.data;
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
            'Signup failed. Please check your details.';
      setError(msg);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white p-6">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg border border-red-200">
        <h1 className="text-3xl font-bold mb-2 text-center text-red-600">
          Create Your Account
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Join Doomscrollr and back amazing projects.
        </p>

        {error && (
          <div className="text-red-600 bg-red-50 border border-red-200 mb-4 p-3 rounded-lg text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
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
            value={password1}
            onChange={e => setPassword1(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
            value={password2}
            onChange={e => setPassword2(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white p-3 rounded-xl font-semibold shadow-md transition"
          >
            Register
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-red-600 hover:underline font-medium">
            Log in here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
