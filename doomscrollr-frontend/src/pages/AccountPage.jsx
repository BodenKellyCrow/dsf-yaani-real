// src/pages/UserProfilePage.jsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { MEDIA_URL } from '../api/config';

export default function UserProfilePage() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('posts'); // 'posts' or 'projects'
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserData();
  }, [userId]);

  const fetchUserData = async () => {
    setLoading(true);
    try {
      // Fetch user details
      const userRes = await api.get(`/users/${userId}/`);
      setUser(userRes.data);

      // Fetch user's posts
      const postsRes = await api.get(`/social-posts/?author=${userId}`);
      setPosts(postsRes.data);

      // Fetch user's projects
      const projectsRes = await api.get(`/projects/?owner=${userId}`);
      setProjects(projectsRes.data);

      console.log('✅ User profile loaded:', userRes.data);
    } catch (err) {
      console.error('❌ Failed to fetch user data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-6 text-center">Loading profile...</div>;
  }

  if (!user) {
    return <div className="p-6 text-center text-red-600">User not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
      {/* Profile Header */}
      <div className="bg-white rounded-2xl shadow p-6 mb-6">
        <div className="flex items-center gap-6">
          <img
            src={user.profile_image ? `${MEDIA_URL}${user.profile_image}` : '/default-profile.png'}
            alt={user.username}
            className="w-24 h-24 rounded-full object-cover border-4 border-blue-500"
          />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">@{user.username}</h1>
            {user.bio && <p className="text-gray-600 mt-2">{user.bio}</p>}
            <div className="flex gap-6 mt-3 text-sm text-gray-500">
              <span>{posts.length} Posts</span>
              <span>{projects.length} Projects</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow">
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('posts')}
            className={`flex-1 py-3 font-medium transition ${
              activeTab === 'posts'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Posts ({posts.length})
          </button>
          <button
            onClick={() => setActiveTab('projects')}
            className={`flex-1 py-3 font-medium transition ${
              activeTab === 'projects'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Projects ({projects.length})
          </button>
        </div>

        <div className="p-6">
          {/* Posts Tab */}
          {activeTab === 'posts' && (
            <div className="space-y-4">
              {posts.length === 0 ? (
                <p className="text-gray-500 text-center">No posts yet</p>
              ) : (
                posts.map((post) => (
                  <div key={post.id} className="border rounded-xl p-4 bg-gray-50">
                    <p className="text-gray-800 mb-2">{post.content}</p>
                    {post.image && (
                      <img
                        src={`${MEDIA_URL}${post.image}`}
                        alt="Post"
                        className="w-full max-h-96 object-cover rounded-lg"
                      />
                    )}
                    <div className="flex gap-4 mt-3 text-sm text-gray-500">
                      <span>{post.likes?.length || 0} likes</span>
                      <span>{post.comments?.length || 0} comments</span>
                      <span className="ml-auto">
                        {new Date(post.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Projects Tab */}
          {activeTab === 'projects' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projects.length === 0 ? (
                <p className="text-gray-500 text-center col-span-2">No projects yet</p>
              ) : (
                projects.map((project) => (
                  <div
                    key={project.id}
                    onClick={() => navigate(`/project/${project.id}`)}
                    className="border rounded-xl p-4 bg-gray-50 hover:shadow-md transition cursor-pointer"
                  >
                    {project.image && (
                      <img
                        src={`${MEDIA_URL}${project.image}`}
                        alt={project.title}
                        className="w-full h-48 object-cover rounded-lg mb-3"
                      />
                    )}
                    <h3 className="font-bold text-lg text-gray-900">{project.title}</h3>
                    <p className="text-gray-600 text-sm line-clamp-2 mt-2">
                      {project.description}
                    </p>
                    <div className="mt-3 text-sm text-gray-500">
                      KSh {project.current_funding} / KSh {project.funding_goal}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}