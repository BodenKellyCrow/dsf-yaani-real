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
        
        {/* Protected Routes */}
        <Route path="/home" element={loggedIn ? <HomePage /> : <Navigate to="/login" />} />
        <Route path="/explore" element={loggedIn ? <Explore /> : <Navigate to="/login" />} />
        <Route path="/profile" element={loggedIn ? <Profile /> : <Navigate to="/login" />} />
        <Route path="/create" element={loggedIn ? <CreateProjectPage /> : <Navigate to="/login" />} />
        <Route path="/project/:id" element={loggedIn ? <ProjectDetails /> : <Navigate to="/login" />} />
        <Route path="/chat" element={loggedIn ? <ChatList /> : <Navigate to="/login" />} />
        <Route path="/chat/:id" element={loggedIn ? <ChatRoom /> : <Navigate to="/login" />} />
        
        {/* Fallback */}
        <Route path="*" element={<div className="p-6 text-center">404 - Page Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;
