// src/pages/CreateProjectPage.jsx
import { useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

export default function CreateProjectPage() {
  const [postType, setPostType] = useState('social'); // 'social' or 'project'
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // ✅ CRITICAL: Use FormData for file uploads
      const formData = new FormData();

      if (postType === 'project') {
        formData.append('title', title);
        formData.append('description', description);
        formData.append('funding_goal', targetAmount);
        formData.append('current_funding', '0');
      } else {
        formData.append('content', description);
      }

      if (image) {
        formData.append('image', image);
      }

      // ✅ Determine endpoint
      const endpoint = postType === 'project' ? '/projects/' : '/social-posts/';

      console.log(`📤 Posting to: ${endpoint}`);

      // ✅ Send request
      const response = await api.post(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('✅ Post created successfully:', response.data);
      navigate('/explore');
    } catch (err) {
      console.error('❌ Post creation error:', err);

      // Better error handling
      if (err.response?.data) {
        const errorData = err.response.data;
        if (typeof errorData === 'object') {
          const errorMessages = Object.entries(errorData)
            .map(([key, value]) => {
              const val = Array.isArray(value) ? value.join(', ') : value;
              return `${key}: ${val}`;
            })
            .join('\n');
          setError(errorMessages);
        } else {
          setError(errorData);
        }
      } else {
        setError(err.message || 'Failed to create post. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow font-sans mt-10">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">
        Create a New {postType === 'project' ? 'Project' : 'Post'}
      </h2>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 whitespace-pre-wrap text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Post Type
          </label>
          <select
            value={postType}
            onChange={(e) => setPostType(e.target.value)}
            className="w-full border px-3 py-2 rounded text-sm focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          >
            <option value="social">Social Post</option>
            <option value="project">Project Post</option>
          </select>
        </div>

        {postType === 'project' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Project Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border px-3 py-2 rounded text-sm focus:ring-2 focus:ring-blue-500"
                required
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Funding Goal (KSh) *
              </label>
              <input
                type="number"
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                className="w-full border px-3 py-2 rounded text-sm focus:ring-2 focus:ring-blue-500"
                required
                min="0"
                step="0.01"
                disabled={loading}
              />
            </div>
          </>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {postType === 'project' ? 'Project Description *' : 'Post Content *'}
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Write something..."
            className="w-full border px-3 py-2 rounded text-sm focus:ring-2 focus:ring-blue-500"
            rows={4}
            required
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Upload Image (optional)
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="block text-sm mb-2"
            disabled={loading}
          />
          {preview && (
            <div className="relative mt-3">
              <img
                src={preview}
                alt="Preview"
                className="w-full max-h-64 object-cover rounded-lg border"
              />
              <button
                type="button"
                onClick={() => {
                  setImage(null);
                  setPreview(null);
                }}
                className="absolute top-2 right-2 bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                disabled={loading}
              >
                Remove
              </button>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white font-medium py-2 rounded hover:bg-blue-700 disabled:bg-gray-400 transition duration-200"
        >
          {loading ? 'Creating...' : postType === 'project' ? 'Create Project' : 'Post'}
        </button>
      </form>
    </div>
  );
}