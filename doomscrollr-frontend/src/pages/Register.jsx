import { useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

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
      // After registering, auto login
      await api.post('auth/login/', { email, password: password1 });
      onLogin();
      navigate('/explore');
    } catch (err) {
      console.error(err);
      setError('Signup failed. Try a different email.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded-2xl shadow">
      <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
      {error && <div className="text-red-500 mb-3">{error}</div>}
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
          type="text"
          placeholder="Username"
          className="w-full p-3 border rounded"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 border rounded"
          value={password1}
          onChange={e => setPassword1(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirm Password"
          className="w-full p-3 border rounded"
          value={password2}
          onChange={e => setPassword2(e.target.value)}
          required
        />
        <button type="submit" className="w-full bg-black text-white p-3 rounded-xl">
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
