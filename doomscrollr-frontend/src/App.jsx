import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Explore from './pages/ExplorePage';
import Login from './pages/LoginPage';
import Register from './pages/Register';
import api from './api/axios';
import HomePage from './pages/HomePage'; 
import Profile from './pages/AccountPage';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    api.get('auth/user/')
      .then(() => setLoggedIn(true))
      .catch(() => setLoggedIn(false))
      .finally(() => setCheckingAuth(false));
  }, []);

  if (checkingAuth) return <div className="p-6 text-center">Checking login status...</div>;

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to={loggedIn ? "/home" : "/login"} />} />
        <Route path="/login" element={<Login onLogin={() => setLoggedIn(true)} />} />
        <Route path="/register" element={<Register onLogin={() => setLoggedIn(true)} />} />
        <Route
          path="/explore"
          element={loggedIn ? <Explore /> : <Navigate to="/login" />}
        />
        <Route path="*" element={<div className="p-6 text-center">404 - Page Not Found</div>} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/home" element={loggedIn ? <HomePage /> : <Navigate to="/login" />}/>
      </Routes>
    </Router>
  );
}

export default App;

