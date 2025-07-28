import { useEffect, useState } from 'react';
import api from '../api/axios';
import { MEDIA_URL } from '../api/config';

const Explore = () => {
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectRes, userRes] = await Promise.all([
          api.get('projects/'),
          api.get('users/')
        ]);
        setProjects(projectRes.data);
        setUsers(userRes.data);
      } catch (err) {
        console.error('Failed to fetch data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredProjects = projects.filter(project =>
    project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="p-4 text-center font-sans">Loading...</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto bg-gray-50 font-sans min-h-screen">
      {/* 🔍 Search input */}
      <div className="mb-8">
        <input
          type="text"
          placeholder="Search projects or users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:w-1/2 px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* 👥 User results */}
      {searchTerm && filteredUsers.length > 0 && (
        <div className="mb-10">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Users</h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {filteredUsers.map(user => (
              <li key={user.id} className="flex items-center gap-4 p-4 bg-white rounded-xl shadow hover:shadow-md transition">
                <img
                  src={user.profile_image ? `${MEDIA_URL}${user.profile_image}` : '/default-profile.png'}
                  alt={user.username}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold text-gray-800">@{user.username}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 📦 Project results */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProjects.map(project => {
          const profileImg = project.owner?.profile?.profile_image
            ? `${MEDIA_URL}${project.owner.profile.profile_image}`
            : '/default-profile.png';

          return (
            <div key={project.id} className="bg-white p-5 rounded-xl shadow hover:shadow-md transition space-y-3">
              {/* Owner info */}
              <div className="flex items-center gap-3">
                <img
                  src={profileImg}
                  alt="Profile"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <p className="text-sm font-medium text-gray-700">@{project.owner?.username}</p>
              </div>

              {/* Project image */}
              <img
                src={project.image ? `${MEDIA_URL}${project.image}` : '/fallback.png'}
                alt={project.title}
                className="w-full h-48 object-cover rounded-lg"
              />

              {/* Project info */}
              <h2 className="text-lg font-bold text-gray-900">{project.title}</h2>
              <p className="text-gray-600 text-sm line-clamp-3">{project.description}</p>
              <div className="text-sm text-gray-500">
                ${project.current_funding} raised of ${project.funding_goal}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Explore;
