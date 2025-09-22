import { useState } from 'react';
import api from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';

const LoginPage = ({ onLogin }) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const payload =
      identifier.includes('@')
        ? { email: identifier, password }
        : { username: identifier, password };

    try {
      const response = await api.post('auth/login/', payload);

      localStorage.setItem('accessToken', response.data.access);
      localStorage.setItem('refreshToken', response.data.refresh);

      onLogin?.();
      navigate('/explore');
    } catch (err) {
      const data = err?.response?.data;
      const msg =
        typeof data === 'string'
          ? data
          : data?.detail ||
            Object.values(data || {})
              .flat()
              .join(' ') ||
            'Invalid login. Please check your credentials.';
      setError(msg);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white p-6">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg border border-red-200">
        <h1 className="text-3xl font-bold mb-2 text-center text-red-600">
          Welcome to Doomscrollr 🚀
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Log in to explore and support your favorite projects.
        </p>

        {error && (
          <div className="text-red-600 bg-red-50 border border-red-200 mb-4 p-3 rounded-lg text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Username or Email"
            className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
