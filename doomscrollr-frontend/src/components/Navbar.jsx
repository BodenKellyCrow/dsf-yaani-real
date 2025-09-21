import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post('auth/logout/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center sticky top-0 z-50">
      <Link to="/home" className="text-xl font-bold text-blue-600">
        Doomscrollr
      </Link>
      <div className="space-x-4 flex items-center">
        <Link to="/explore" className="text-gray-700 hover:text-blue-600">
          Explore
        </Link>
        <Link to="/create" className="text-gray-700 hover:text-blue-600">
          New Project
        </Link>
        <Link to="/profile" className="text-gray-700 hover:text-blue-600">
          Account
        </Link>
        <Link to="/chat" className="text-gray-700 hover:text-blue-600">
          Chat
        </Link>
        <button
          onClick={handleLogout}
          className="ml-4 px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;

