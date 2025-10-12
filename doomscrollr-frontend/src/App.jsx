import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Explore from './pages/ExplorePage';
import Login from './pages/LoginPage';
import Register from './pages/Register';
import HomePage from './pages/HomePage';
// NOTE: Renamed to AccountSettings or similar for clarity, 
// but keeping 'Profile' for now as per your original file.
import AccountPage from './pages/AccountPage'; 
import UserProfilePage from './pages/UserProfilePage'; // 👈 NEW: Dedicated component for read-only profiles
import ChatList from './pages/ChatList';
import ChatRoom from './pages/ChatRoom';
import CreateProjectPage from './pages/CreateProjectPage';
import ProjectDetails from './pages/ProjectDetails';
import api from './api/axios';
import Layout from './components/Layout';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  // Optional: Store the current user's ID to allow routing from /profile to /profile/:currentUserId
  const [currentUserId, setCurrentUserId] = useState(null); 

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setLoggedIn(false);
        setCheckingAuth(false);
        return;
      }

      try {
        const response = await api.get('auth/user/'); // Assuming this endpoint returns user data including ID
        setLoggedIn(true);
        // Assuming the user object has an 'id' or 'pk' field
        setCurrentUserId(response.data.id || response.data.pk); 
      } catch (err) {
        setLoggedIn(false);
        // Optional: Clear token if it's invalid
        localStorage.removeItem('accessToken'); 
      } finally {
        setCheckingAuth(false);
      }
    };

    checkAuth();
  }, []);

  // Use a simple loading screen (will replace with a better skeleton later!)
  if (checkingAuth) return <div className="p-6 text-center text-lg font-semibold text-gray-600">Checking login status...</div>;

  return (
    <Router>
      <Routes>
        {/* Unauthenticated Routes */}
        <Route path="/" element={<Navigate to={loggedIn ? "/home" : "/login"} />} />
        <Route path="/login" element={<Login onLogin={() => setLoggedIn(true)} />} />
        <Route path="/register" element={<Register onLogin={() => setLoggedIn(true)} />} />

        {loggedIn && (
          <Route element={<Layout />}>
            <Route path="/home" element={<HomePage />} />
            <Route path="/explore" element={<Explore />} />
            
            {/* 1. Dynamic User Profile Route: Displays ANY user's profile, read-only */}
            <Route path="/profile/:userId" element={<UserProfilePage />} />

            {/* 2. Logged-in User's Profile/Account Settings */}
            <Route 
              path="/profile" 
              element={
                currentUserId 
                  // Redirects the logged-in user to their ID-based profile page
                  ? <Navigate to={`/profile/${currentUserId}`} replace /> 
                  // If ID isn't fetched yet or is null, show a temporary component (or the original AccountPage)
                  : <AccountPage /> 
              } 
            />

            {/* Other Authenticated Routes */}
            <Route path="/create" element={<CreateProjectPage />} />
            <Route path="/project/:id" element={<ProjectDetails />} />
            <Route path="/chat" element={<ChatList />} />
            <Route path="/chat/:id" element={<ChatRoom />} />
          </Route>
        )}

        {/* Fallback 404 Route */}
        <Route path="*" element={<div className="p-12 text-center text-xl font-bold text-red-700">404 - Doomscrollr Page Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;