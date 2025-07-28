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
    if (password1 !== password2) {
      setError("Passwords don't match");
      return;
    }

    try {
      await api.post('auth/registration/', {
        email,
        username,
        password1,
        password2,
      });
      await api.post('auth/login/', { email, password: password1 });
      onLogin();
      navigate('/explore'); // or /home if preferred
    } catch (err) {
      console.error(err);
      setError('Signup failed. Try a different email.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="max-w-md w-full bg-white p-6 rounded-2xl shadow">
        <h1 className="text-3xl font-bold mb-2 text-center">Create Your Account</h1>
        <p className="text-center text-gray-600 mb-6">Join Doomscrollr and back amazing projects.</p>

        {error && <div className="text-red-500 text-sm text-center mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 border border-gray-300 rounded-lg"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Username"
            className="w-full p-3 border border-gray-300 rounded-lg"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 border border-gray-300 rounded-lg"
            value={password1}
            onChange={e => setPassword1(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            className="w-full p-3 border border-gray-300 rounded-lg"
            value={password2}
            onChange={e => setPassword2(e.target.value)}
            required
          />
          <button type="submit" className="w-full bg-black text-white p-3 rounded-xl">
            Register
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-500">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:underline">
            Log in here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
