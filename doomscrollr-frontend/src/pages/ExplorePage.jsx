import { useEffect, useState } from 'react';
import api from '../api/axios';
import { MEDIA_URL } from '../api/config';

const Explore = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('projects/')
      .then(res => {
        setProjects(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch projects:', err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-4 text-center">Loading...</div>;

  return (
    <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map(project => {
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
  );
};

export default Explore;
