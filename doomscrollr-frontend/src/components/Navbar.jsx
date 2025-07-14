import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold text-blue-600">
        Doomscrollr
      </Link>
      <div className="space-x-4">
        <Link to="/explore" className="text-gray-700 hover:text-blue-600">
          Explore
        </Link>
        <Link to="/create" className="text-gray-700 hover:text-blue-600">
          New Project
        </Link>
        <Link to="/account" className="text-gray-700 hover:text-blue-600">
          Account
        </Link>

      </div>
    </nav>
  );
}

export default Navbar;
