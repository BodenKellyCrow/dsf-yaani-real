// src/pages/Register.jsx
import { useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setError(null);

    if (password !== password2) {
      setError("Passwords don't match");
      return;
    }

    try {
      await api.post(
        '/auth/register/',
        { username, email, password },
        {
          headers: {
            Accept: 'application/json', // ✅ Force JSON
          },
        }
      );
      navigate('/login');
    } catch (err) {
      if (err.response) {
        setError(
          JSON.stringify(err.response.data, null, 2) ||
            'Registration failed. Try again.'
        );
      } else {
        setError(err.message);
      }
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">Register</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          className="w-full border px-3 py-2 rounded text-sm"
          required
        />
        <input
          type="email"
          placeholder="Email (optional)"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full border px-3 py-2 rounded text-sm"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full border px-3 py-2 rounded text-sm"
          required
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={password2}
          onChange={e => setPassword2(e.target.value)}
          className="w-full border px-3 py-2 rounded text-sm"
          required
        />

        {error && (
          <div className="text-red-600 text-sm whitespace-pre-wrap">{error}</div>
        )}

        <button
          type="submit"
          className="w-full bg-green-600 text-white font-medium py-2 rounded hover:bg-green-700 transition duration-200"
        >
          Register
        </button>
      </form>
    </div>
  );
}
