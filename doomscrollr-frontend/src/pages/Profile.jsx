// frontend/src/pages/Profile.jsx
import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import ProjectCard from '../components/ProjectCard'; // Reuse from Explore
import { useAuth } from '../context/AuthContext'; // Assuming you store user info here

const Profile = () => {
  const { user } = useAuth(); // Get logged-in user
  const [createdProjects, setCreatedProjects] = useState([]);
  const [fundedProjects, setFundedProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        const [createdRes, fundedRes] = await Promise.all([
          axios.get(`/users/${user.id}/projects/`),
          axios.get(`/users/${user.id}/funded/`)
        ]);
        setCreatedProjects(createdRes.data);
        setFundedProjects(fundedRes.data);
      } catch (err) {
        console.error('Failed to load profile data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-6 space-y-10">
      <h1 className="text-3xl font-bold">Welcome, {user?.username}</h1>

      <section>
        <h2 className="text-xl font-semibold mb-2">Your Projects</h2>
        {createdProjects.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {createdProjects.map(project => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <p>You haven't created any projects yet.</p>
        )}
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Projects You Funded</h2>
        {fundedProjects.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {fundedProjects.map(project => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <p>You haven't funded any projects yet.</p>
        )}
      </section>
    </div>
  );
};

export default Profile;
