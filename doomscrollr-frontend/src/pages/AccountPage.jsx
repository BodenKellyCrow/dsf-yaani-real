import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { MEDIA_URL } from '../api/config';

function AccountPage() {
  const [user, setUser] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);


  useEffect(() => {
    fetchUser();
    fetchFundingHistory();
  }, []);

  const fetchFundingHistory = async () => {
  try {
    const res = await api.get('/user-transactions/', {
      headers: {
        Authorization: `Token ${localStorage.getItem('token')}`,
      },
    });
    setTransactions(res.data);
  } catch (err) {
    console.error('Failed to fetch funding history:', err);
  }
};

  const fetchUser = async () => {
    try {
      const res = await api.get('/auth/user/', {
        headers: {
          Authorization: `Token ${localStorage.getItem('token')}`,
        },
      });
      setUser(res.data);
    } catch (err) {
      console.error('Failed to fetch user:', err);
    }
  };

  const handleImageChange = (e) => {
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
          Authorization: `Token ${localStorage.getItem('token')}`,
        },
      });
      fetchUser(); // Refresh user info after upload
      setSelectedFile(null);
    } catch (err) {
      console.error('Profile image upload failed:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (!user) return <p className="text-center p-6">Loading...</p>;

  return (
  <div className="p-6 max-w-2xl mx-auto">
    <h2 className="text-2xl font-bold mb-4">My Account</h2>

    {/* Profile card */}
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-4 mb-6">
        <img
          src={
            user.profile?.profile_image
              ? `${MEDIA_URL}${user.profile.profile_image}`
              : '/default-profile.png'
          }
          alt="Profile"
          className="w-20 h-20 rounded-full object-cover"
        />
        <div>
          <p className="text-gray-700 font-semibold">Username:</p>
          <p className="text-gray-900">@{user.username}</p>
          <p className="text-gray-700 font-semibold mt-2">Email:</p>
          <p className="text-gray-900">{user.email}</p>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-1">Change Profile Image</label>
        <input type="file" onChange={handleImageChange} className="mb-2" />
        <button
          onClick={handleUpload}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          disabled={uploading}
        >
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
      </div>

      <div className="mt-6">
        <button
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          onClick={handleLogout}
        >
          Log Out
        </button>
      </div>
    </div>

    {/* 👇 Funding History goes here, outside the white card but still on profile page */}
    <div className="mt-8">
      <h3 className="text-lg font-semibold mb-3">Funding History</h3>
      {transactions.length === 0 ? (
        <p className="text-gray-600 text-sm">You haven’t funded any projects yet.</p>
      ) : (
        <ul className="space-y-3">
          {transactions.map((tx) => (
            <li
              key={tx.id}
              className="bg-gray-50 p-4 rounded border shadow flex justify-between items-center"
            >
              <div>
                <p className="font-medium">{tx.project_title}</p>
                <p className="text-sm text-gray-500">
                  {new Date(tx.timestamp).toLocaleString()}
                </p>
              </div>
              <span className="text-green-600 font-semibold">KSh {tx.amount}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  </div>
 );
}

export default AccountPage;
