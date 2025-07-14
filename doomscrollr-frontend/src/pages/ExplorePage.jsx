import { useEffect, useState } from 'react';
import api from '../api/axios';

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
      {projects.map(project => (
        <div key={project.id} className="bg-white p-4 rounded-2xl shadow">
          <img src={project.image} alt={project.title} className="w-full h-48 object-cover rounded-xl mb-2" />
          <h2 className="text-xl font-bold">{project.title}</h2>
          <p className="text-gray-600 line-clamp-3">{project.description}</p>
          <div className="mt-2 text-sm text-gray-500">
            ${project.current_funding} raised of ${project.funding_goal}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Explore;


