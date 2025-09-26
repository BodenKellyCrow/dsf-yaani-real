// frontend/src/pages/Profile.jsx
import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import ProjectCard from "../components/ProjectCard";
import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState({});
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [image, setImage] = useState(null);
  const [createdProjects, setCreatedProjects] = useState([]);
  const [fundedProjects, setFundedProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Password fields
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        const [profileRes, createdRes, fundedRes] = await Promise.all([
          axios.get("/me/"),
          axios.get(`/users/${user.id}/projects/`),
          axios.get(`/users/${user.id}/funded-projects/`), // ✅ fixed
        ]);

        setProfile(profileRes.data);
        setUsername(profileRes.data.username || "");
        setBio(profileRes.data.bio || "");
        setCreatedProjects(createdRes.data);
        setFundedProjects(fundedRes.data);
      } catch (err) {
        console.error("Failed to load profile data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleProfileUpdate = async () => {
    const formData = new FormData();
    formData.append("username", username);
    formData.append("bio", bio);
    if (image) formData.append("image", image);

    try {
      const res = await axios.put("/me/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setProfile(res.data);
      alert("Profile updated!");
    } catch (err) {
      console.error("Failed to update profile:", err);
      alert("Profile update failed.");
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      alert("New passwords do not match!");
      return;
    }

    try {
      await axios.post("/me/change-password/", { // ✅ fixed
        old_password: currentPassword,
        new_password: newPassword,
      });

      alert("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error("Failed to change password:", err);
      alert("Password change failed. Check your current password.");
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-6 space-y-10">
      <h1 className="text-3xl font-bold">Welcome, {profile.username}</h1>

      {/* Profile editing */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Edit Profile</h2>
        <input
          type="text"
          className="border p-2 w-full"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
        />
        <textarea
          className="border p-2 w-full"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Bio"
        />
        <input type="file" onChange={(e) => setImage(e.target.files[0])} />
        <button
          onClick={handleProfileUpdate}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Save Changes
        </button>
      </section>

      {/* Password change */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Change Password</h2>
        <input
          type="password"
          className="border p-2 w-full"
          placeholder="Current password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />
        <input
          type="password"
          className="border p-2 w-full"
          placeholder="New password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <input
          type="password"
          className="border p-2 w-full"
          placeholder="Confirm new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button
          onClick={handleChangePassword}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Update Password
        </button>
      </section>

      {/* Created Projects */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Your Projects</h2>
        {createdProjects.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {createdProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <p>You haven't created any projects yet.</p>
        )}
      </section>

      {/* Funded Projects */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Projects You Funded</h2>
        {fundedProjects.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {fundedProjects.map((project) => (
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
