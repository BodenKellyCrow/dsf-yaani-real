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

  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    if (postType === 'project') {
      formData.append('title', title);
      formData.append('description', description);
      formData.append('target_amount', targetAmount);
    } else {
      formData.append('content', description);
    }

    if (image) formData.append('image', image);

    try {
      const endpoint = postType === 'project' ? '/projects/' : '/social-posts/';
      await api.post(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Accept: 'application/json', // ✅ ensures JSON response
        },
      });
      navigate('/feed');
    } catch (err) {
      if (err.response) {
        console.error('Error response:', err.response.data);
        alert(
          JSON.stringify(err.response.data, null, 2) ||
            'Error submitting post. Please try again.'
        );
      } else {
        console.error('Error submitting post:', err.message);
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow font-sans mt-10">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">
        Create a New {postType === 'project' ? 'Project' : 'Post'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Post Type
          </label>
          <select
            value={postType}
            onChange={(e) => setPostType(e.target.value)}
            className="w-full border px-3 py-2 rounded text-sm"
          >
            <option value="social">Social Post</option>
            <option value="project">Project Post</option>
          </select>
        </div>

        {postType === 'project' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Project Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border px-3 py-2 rounded text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Target Amount
              </label>
              <input
                type="number"
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                className="w-full border px-3 py-2 rounded text-sm"
                required
              />
            </div>
          </>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {postType === 'project' ? 'Project Description' : 'Post Content'}
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Write something..."
            className="w-full border px-3 py-2 rounded text-sm"
            rows={4}
            required
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
          />
          {preview && (
            <div className="relative">
              <img
                src={preview}
                alt="Preview"
                className="w-full max-h-64 object-cover rounded-lg mt-3 border"
              />
            </div>
          )}
        </div>

        <div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-medium py-2 rounded hover:bg-blue-700 transition duration-200"
          >
            {postType === 'project' ? 'Create Project' : 'Post'}
          </button>
        </div>
      </form>
    </div>
  );
}
