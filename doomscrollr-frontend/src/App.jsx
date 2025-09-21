import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Explore from './pages/ExplorePage';
import Login from './pages/LoginPage';
import Register from './pages/Register';
import HomePage from './pages/HomePage';
import Profile from './pages/AccountPage';
import ChatList from './pages/ChatList';
import ChatRoom from './pages/ChatRoom';
import CreateProjectPage from './pages/CreateProjectPage';
import ProjectDetails from './pages/ProjectDetails';
import api from './api/axios';
import Layout from './components/Layout';

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
        {/* Redirect root */}
        <Route path="/" element={<Navigate to={loggedIn ? "/home" : "/login"} />} />

        {/* Auth routes */}
        <Route path="/login" element={<Login onLogin={() => setLoggedIn(true)} />} />
        <Route path="/register" element={<Register onLogin={() => setLoggedIn(true)} />} />

        {/* Protected routes inside Layout */}
        {loggedIn && (
          <Route element={<Layout />}>
            <Route path="/home" element={<HomePage />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/create" element={<CreateProjectPage />} />
            <Route path="/project/:id" element={<ProjectDetails />} />
            <Route path="/chat" element={<ChatList />} />
            <Route path="/chat/:id" element={<ChatRoom />} />
          </Route>
        )}

        {/* Catch-all */}
        <Route path="*" element={<div className="p-6 text-center">404 - Page Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;

