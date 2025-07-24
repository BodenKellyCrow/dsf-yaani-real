import { useState } from 'react';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';

export default function UnifiedPostForm() {
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
      formData.append('content', description); // re-use description as content
    }

    if (image) {
      formData.append('image', image);
    }

    try {
      const endpoint = postType === 'project' ? '/projects/' : '/social-posts/';
      await axios.post(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      navigate('/feed');
    } catch (err) {
      console.error('Error submitting post:', err);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-8 p-4 bg-white shadow rounded">
      <h2 className="text-xl font-semibold mb-4">Create New Post</h2>

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Post Type Selector */}
        <div>
          <label className="block mb-1 font-medium">Post Type</label>
          <select
            value={postType}
            onChange={(e) => setPostType(e.target.value)}
            className="w-full border p-2 rounded"
          >
            <option value="social">Social Post</option>
            <option value="project">Project Post</option>
          </select>
        </div>

        {/* Conditional Fields */}
        {postType === 'project' && (
          <>
            <input
              type="text"
              placeholder="Project Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="number"
              placeholder="Target Amount"
              value={targetAmount}
              onChange={(e) => setTargetAmount(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </>
        )}

        {/* Shared Description/Content Field */}
        <textarea
          placeholder={postType === 'project' ? 'Project Description' : 'What’s on your mind?'}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />

        {/* Image Upload */}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="block"
        />
        {preview && (
          <img src={preview} alt="Preview" className="w-full max-h-64 object-cover rounded" />
        )}

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {postType === 'project' ? 'Create Project' : 'Post'}
        </button>
      </form>
    </div>
  );
}
