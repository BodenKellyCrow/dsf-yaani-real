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

  if (loading) return <div className="p-4 text-center">Loading...</div>;

  return (
    <div className="p-4 max-w-6xl mx-auto">
      {/* 🔍 Search input */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search projects or users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:w-1/2 p-2 border rounded"
        />
      </div>

      {/* 👥 User results */}
      {searchTerm && filteredUsers.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-3">Users</h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {filteredUsers.map(user => (
              <li key={user.id} className="flex items-center gap-4 p-4 bg-white rounded shadow">
                <img
                  src={user.profile_image ? `${MEDIA_URL}${user.profile_image}` : '/default-profile.png'}
                  alt={user.username}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-medium">@{user.username}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 📦 Project results */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map(project => {
          const profileImg = project.owner?.profile?.profile_image
            ? `${MEDIA_URL}${project.owner.profile.profile_image}`
            : '/default-profile.png';

          return (
            <div key={project.id} className="bg-white p-4 rounded-2xl shadow space-y-2">
              {/* Owner info */}
              <div className="flex items-center gap-3">
                <img
                  src={profileImg}
                  alt="Profile"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <p className="font-medium text-sm">{project.owner?.username}</p>
              </div>

              {/* Project image */}
              <img
                src={project.image ? `${MEDIA_URL}${project.image}` : '/fallback.png'}
                alt={project.title}
                className="w-full h-48 object-cover rounded-xl"
              />

              {/* Project info */}
              <h2 className="text-xl font-bold">{project.title}</h2>
              <p className="text-gray-600 line-clamp-3">{project.description}</p>
              <div className="mt-1 text-sm text-gray-500">
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
