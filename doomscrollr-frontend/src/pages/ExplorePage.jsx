import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const Explore = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/projects/')
      .then((res) => {
        setProjects(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch projects:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="p-6 text-center">Loading projects...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Explore Projects</h1>
      {projects.length === 0 ? (
        <p>No projects found.</p>
      ) : (
        <div className="grid gap-6">
          {projects.map((project) => (
            <Link
              to={`/projects/${project.id}`}
              key={project.id}
              className="block p-4 border border-gray-300 rounded hover:bg-gray-100 transition"
            >
              <h2 className="text-lg font-semibold">{project.title}</h2>
              <p className="text-gray-600">{project.description}</p>
              <p className="text-sm text-gray-500">
                ${project.amount_raised} raised of ${project.goal_amount}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Explore;

