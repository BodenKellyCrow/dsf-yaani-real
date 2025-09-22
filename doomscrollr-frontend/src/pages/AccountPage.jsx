// src/pages/AccountPage.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { MEDIA_URL } from '../api/config';

function AccountPage() {
  const [user, setUser] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUser();
    fetchFundingHistory();
  }, []);

  const fetchFundingHistory = async () => {
    try {
      const res = await api.get('/user-transactions/', {
        headers: { Accept: 'application/json' }, // ✅ force JSON
      });
      setTransactions(res.data);
    } catch (err) {
      console.error('Failed to fetch funding history:', err);
    }
  };

  const fetchUser = async () => {
    try {
      const res = await api.get('/auth/user/', {
        headers: { Accept: 'application/json' }, // ✅ force JSON
      });
      setUser(res.data);
    } catch (err) {
      console.error('Failed to fetch user:', err);
    }
  };

  const handleImageChange = e => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    const formData = new FormData();
    formData.append('profile_image', selectedFile);

    try {
      setUploading(true);
      await api.patch('/profile/update/', formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          Accept: 'application/json', // ✅ ensure JSON response
        },
      });
      fetchUser(); // refresh after upload
      setSelectedFile(null);
    } catch (err) {
      console.error('Profile image upload failed:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    navigate('/login');
  };

  if (!user) {
    return <p className="text-center p-6 font-sans">Loading...</p>;
  }

  return (
    <div className="p-6 max-w-3xl mx-auto bg-gray-50 min-h-screen font-sans">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">My Account</h2>

      {/* Profile Card */}
      <div className="bg-white rounded-2xl shadow p-6 space-y-4">
        <div className="flex items-center gap-5">
          <img
            src={
              user.profile?.profile_image
                ? `${MEDIA_URL}${user.profile.profile_image}`
                : '/default-profile.png'
            }
            alt="Profile"
            className="w-20 h-20 rounded-full object-cover border"
          />
          <div>
            <p className="text-gray-500 text-sm font-medium">Username</p>
            <p className="text-gray-900 font-semibold text-lg">@{user.username}</p>
            <p className="text-gray-500 text-sm font-medium mt-2">Email</p>
            <p className="text-gray-900">{user.email}</p>
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-700 font-medium mb-1">
            Change Profile Image
          </label>
          <input type="file" onChange={handleImageChange} className="mb-2 text-sm" />
          <button
            onClick={handleUpload}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
            disabled={uploading}
          >
            {uploading ? 'Uploading...' : 'Upload'}
          </button>
        </div>

        <div className="pt-4 border-t">
          <button
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 text-sm"
            onClick={handleLogout}
          >
            Log Out
          </button>
        </div>
      </div>

      {/* Funding History */}
      <div className="mt-10">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Funding History</h3>
        {transactions.length === 0 ? (
          <p className="text-gray-500 text-sm">
            You haven’t funded any projects yet.
          </p>
        ) : (
          <ul className="space-y-3">
            {transactions.map(tx => (
              <li
                key={tx.id}
                className="bg-white p-4 rounded-xl border shadow flex justify-between items-center"
              >
                <div>
                  <p className="font-medium text-gray-900">{tx.project_title}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(tx.timestamp).toLocaleString()}
                  </p>
                </div>
                <span className="text-green-600 font-semibold text-sm">
                  KSh {tx.amount}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default AccountPage;
