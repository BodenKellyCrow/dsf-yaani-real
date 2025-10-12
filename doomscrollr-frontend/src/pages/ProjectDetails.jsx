// src/pages/ProjectDetails.jsx
import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useParams, useNavigate } from 'react-router-dom';
import { MEDIA_URL } from '../api/config';

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProject();
  }, [id]);

  const fetchProject = async () => {
    try {
      const res = await api.get(`/projects/${id}/`);
      setProject(res.data);
      console.log('✅ Project loaded:', res.data);
    } catch (err) {
      console.error('❌ Failed to fetch project:', err);
    }
  };

  const handleFund = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      setMessage('❌ Please enter a valid amount');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      // Create a transaction
      await api.post('/transactions/', {
        receiver: project.owner.id,
        project: project.id,
        amount: parseFloat(amount),
      });

      setMessage('✅ Funded successfully!');
      setAmount('');
      
      // Refresh project data
      await fetchProject();
    } catch (err) {
      console.error('❌ Funding error:', err);
      const errorMsg = err.response?.data?.detail || 'Failed to fund project. Please try again.';
      setMessage(`❌ ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  if (!project) {
    return <div className="text-center p-6 font-sans">Loading project...</div>;
  }

  const fundingPercentage = (project.current_funding / project.funding_goal) * 100;

  return (
    <div className="max-w-3xl mx-auto p-6 font-sans bg-gray-50 min-h-screen">
      {/* Project Details Card */}
      <div className="bg-white p-6 rounded-2xl shadow mb-6">
        {/* Owner Info */}
        <div 
          className="flex items-center gap-3 mb-4 cursor-pointer hover:opacity-80"
          onClick={() => navigate(`/profile/${project.owner.id}`)}
        >
          <img
            src={
              project.owner.profile_image
                ? `${MEDIA_URL}${project.owner.profile_image}`
                : '/default-profile.png'
            }
            alt={project.owner.username}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <p className="font-semibold text-gray-900">@{project.owner.username}</p>
            <p className="text-sm text-gray-500">Project Creator</p>
          </div>
        </div>

        {/* Project Image */}
        {project.image && (
          <img
            src={`${MEDIA_URL}${project.image}`}
            alt={project.title}
            className="w-full h-64 object-cover rounded-lg mb-4"
          />
        )}

        <h1 className="text-3xl font-bold text-gray-900 mb-3">{project.title}</h1>
        <p className="text-gray-700 mb-6 whitespace-pre-wrap">{project.description}</p>

        {/* Funding Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progress</span>
            <span>{fundingPercentage.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="bg-green-600 h-full transition-all duration-300"
              style={{ width: `${Math.min(fundingPercentage, 100)}%` }}
            />
          </div>
          <div className="flex justify-between mt-2 text-sm">
            <span className="font-semibold text-green-700">
              KSh {project.current_funding}
            </span>
            <span className="text-gray-600">
              Goal: KSh {project.funding_goal}
            </span>
          </div>
        </div>

        {/* Funding Form */}
        <div className="border-t pt-6">
          <h3 className="font-semibold text-gray-900 mb-3">Fund This Project</h3>
          <div className="flex items-center gap-3">
            <input
              type="number"
              placeholder="Enter amount (KSh)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="flex-1 border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
              min="1"
              step="0.01"
              disabled={loading}
            />
            <button
              onClick={handleFund}
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 font-medium transition"
            >
              {loading ? 'Processing...' : 'Fund'}
            </button>
          </div>

          {message && (
            <p className={`text-sm font-medium mt-3 ${message.startsWith('✅') ? 'text-green-600' : 'text-red-600'}`}>
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;