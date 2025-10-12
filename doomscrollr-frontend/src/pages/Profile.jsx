// src/pages/Profile.jsx — Your Personal Account Page
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { MEDIA_URL } from "../api/config";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  // Password fields
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // User’s projects and posts
  const [createdProjects, setCreatedProjects] = useState([]);
  const [createdPosts, setCreatedPosts] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    setLoading(true);
    try {
      const profileRes = await api.get("/auth/user/");
      const userData = profileRes.data;

      setProfile(userData);
      setUsername(userData.username || "");
      setBio(userData.bio || "");

      // Fetch user’s content
      const [projectsRes, postsRes] = await Promise.all([
        api.get(`/projects/?owner=${userData.id}`),
        api.get(`/social-posts/?author=${userData.id}`),
      ]);

      setCreatedProjects(projectsRes.data || []);
      setCreatedPosts(postsRes.data || []);
    } catch (err) {
      console.error("❌ Failed to load profile:", err);
      if (err.response?.status === 401) navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("bio", bio);
      if (image) formData.append("profile_image", image);

      const res = await api.patch("/auth/user/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setProfile(res.data);
      setMessage("✅ Profile updated successfully!");
      setImage(null);
      setImagePreview(null);
      await fetchProfileData();
    } catch (err) {
      console.error("❌ Profile update failed:", err);
      const errorMsg =
        err.response?.data?.username?.[0] ||
        err.response?.data?.detail ||
        "Failed to update profile";
      setMessage(`❌ ${errorMsg}`);
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setMessage("❌ New passwords do not match!");
      return;
    }

    if (newPassword.length < 8) {
      setMessage("❌ Password must be at least 8 characters long");
      return;
    }

    try {
      await api.put("/users/change-password/", {
        old_password: currentPassword,
        new_password: newPassword,
      });
      setMessage("✅ Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error("❌ Password change failed:", err);
      const errorMsg =
        err.response?.data?.error ||
        err.response?.data?.detail ||
        "Failed to change password";
      setMessage(`❌ ${errorMsg}`);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-600 font-sans">
        Loading your profile...
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="p-6 text-center text-red-600 font-sans">
        Failed to load profile
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8 font-sans">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
        >
          Log Out
        </button>
      </div>

      {/* Message */}
      {message && (
        <div
          className={`p-4 rounded-lg text-center ${
            message.startsWith("✅")
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {message}
        </div>
      )}

      {/* Profile Edit Section */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-semibold mb-6 text-gray-900">
          Profile Settings
        </h2>

        <form onSubmit={handleProfileUpdate} className="space-y-6">
          {/* Profile Image */}
          <div className="flex items-center gap-6">
            <img
              src={
                imagePreview ||
                (profile.profile_image
                  ? `${MEDIA_URL}${profile.profile_image}`
                  : "/default-profile.png")
              }
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border-4 border-blue-500"
            />
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Change Profile Picture
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="text-sm"
              />
              {imagePreview && (
                <button
                  type="button"
                  onClick={() => {
                    setImage(null);
                    setImagePreview(null);
                  }}
                  className="text-red-600 text-sm mt-2 hover:underline"
                >
                  Remove new image
                </button>
              )}
            </div>
          </div>

          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bio
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Tell us about yourself..."
            />
          </div>

          {/* Email (read-only) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={profile.email || "Not provided"}
              className="w-full px-4 py-2 border rounded-lg bg-gray-100"
              disabled
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 font-semibold transition"
          >
            {saving ? "Saving..." : "Save Profile Changes"}
          </button>
        </form>
      </div>

      {/* Password Change */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-semibold mb-6 text-gray-900">
          Change Password
        </h2>

        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Password
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              required
              minLength={8}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm New Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              required
              minLength={8}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-semibold transition"
          >
            Update Password
          </button>
        </form>
      </div>

      {/* Projects */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-semibold mb-4 text-gray-900">
          Your Projects
        </h2>
        {createdProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {createdProjects.map((project) => (
              <div
                key={project.id}
                onClick={() => navigate(`/project/${project.id}`)}
                className="border rounded-xl p-4 hover:shadow-md transition cursor-pointer"
              >
                {project.image && (
                  <img
                    src={`${MEDIA_URL}${project.image}`}
                    alt={project.title}
                    className="w-full h-40 object-cover rounded-lg mb-3"
                  />
                )}
                <h3 className="font-bold text-lg">{project.title}</h3>
                <p className="text-gray-600 text-sm line-clamp-2">
                  {project.description}
                </p>
                <div className="mt-2 text-sm text-gray-500">
                  KSh {project.current_funding} / KSh {project.funding_goal}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">You haven't created any projects yet.</p>
        )}
      </div>

      {/* Posts */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-semibold mb-4 text-gray-900">
          Your Posts
        </h2>
        {createdPosts.length > 0 ? (
          <div className="space-y-4">
            {createdPosts.map((post) => (
              <div
                key={post.id}
                className="border rounded-xl p-4 bg-gray-50 hover:shadow-sm transition"
              >
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
            ))}
          </div>
        ) : (
          <p className="text-gray-500">You haven't created any posts yet.</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
