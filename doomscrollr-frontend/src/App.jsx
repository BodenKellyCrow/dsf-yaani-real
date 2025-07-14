import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import ExplorePage from './pages/ExplorePage';
import PostPage from './pages/PostPage';
import CreateProjectPage from './pages/CreateProjectPage';
import Navbar from './components/Navbar';
import AccountPage from './pages/AccountPage';
import React from 'react';
import ProjectDetails from './pages/ProjectDetails';


function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 text-gray-900">
        <Navbar />
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/post/:id" element={<PostPage />} />
          <Route path="/create" element={<CreateProjectPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/projects/:id" element={<ProjectDetails />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
