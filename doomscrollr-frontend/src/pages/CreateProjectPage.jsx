// src/pages/CreateProjectPage.jsx
import { useState } from 'react';
import api from '../api/axios'; // axios instance with JWT auto-refresh
import { useNavigate } from 'react-router-dom';

export default function CreateProjectPage() {
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

    const token = localStorage.getItem('accessToken');
    if (!token) {
      alert('You must be logged in to post.');
      navigate('/login');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('target_amount', targetAmount);
    if (image) formData.append('image', image);

    try {
      const response = await api.post('/projects/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      console.log('Project created successfully:', response.data);

      // Reset form
      setTitle('');
      setDescription('');
      setTargetAmount('');
      setImage(null);
      setPreview(null);

      navigate('/feed'); // redirect after success
    } catch (err) {
      if (err.response) {
        console.error('Backend error response:', err.response.data);
        alert(
          typeof err.response.data === 'object'
            ? JSON.stringify(err.response.data)
            : err.response.data
        );
      } else {
        console.error('Error submitting project:', err.message);
        alert(`Error submitting project: ${err.message}`);
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow font-sans mt-10">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">Create a New Project</h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Project Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Project Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border px-3 py-2 rounded text-sm"
            required
          />
        </div>

        {/* Target Amount */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Target Amount</label>
          <input
            type="number"
            value={targetAmount}
            onChange={(e) => setTargetAmount(e.target.value)}
            className="w-full border px-3 py-2 rounded text-sm"
            required
          />
        </div>

        {/* Project Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Project Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Write something..."
            className="w-full border px-3 py-2 rounded text-sm"
            rows={4}
            required
          />
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Upload Image (optional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="block text-sm"
          />
          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="w-full max-h-64 object-cover rounded-lg mt-3"
            />
          )}
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-medium py-2 rounded hover:bg-blue-700 transition duration-200"
          >
            Create Project
          </button>
        </div>
      </form>
    </div>
  );
}
