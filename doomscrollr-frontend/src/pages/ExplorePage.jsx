// src/pages/ExplorePage.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { MEDIA_URL } from "../api/config";

// =================================================================
// ⭐️ NEW COMPONENT: ExploreSkeleton (Place the code from above here)
// =================================================================
const ExploreSkeleton = () => (
    <div className="p-6 max-w-7xl mx-auto bg-gray-50 min-h-screen animate-pulse">
        {/* Search Bar Skeleton */}
        <div className="mb-8">
            <div className="w-full sm:w-1/2 h-12 bg-gray-300 rounded-lg shadow-sm"></div>
        </div>

        {/* Users Section Skeleton */}
        <div className="mb-10">
            <div className="h-6 bg-gray-300 w-24 mb-4 rounded"></div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {[...Array(3)].map((_, index) => (
                    <li key={index} className="flex items-center gap-4 p-4 bg-white rounded-xl shadow">
                        <div className="w-12 h-12 rounded-full bg-gray-200"></div>
                        <div>
                            <div className="h-4 bg-gray-300 w-24 mb-1 rounded"></div>
                            <div className="h-4 bg-gray-200 w-32 rounded"></div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>

        {/* Projects Section Skeleton */}
        <div>
            <div className="h-6 bg-gray-300 w-32 mb-4 rounded"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, index) => (
                    <div key={index} className="bg-white p-5 rounded-xl shadow space-y-3">
                        {/* Owner Info Placeholder */}
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                            <div className="h-4 bg-gray-300 w-20 rounded"></div>
                        </div>
                        {/* Project Image Placeholder */}
                        <div className="w-full h-48 bg-gray-200 rounded-lg"></div>
                        {/* Text Placeholder */}
                        <div className="h-6 bg-gray-300 w-3/4 rounded"></div>
                        <div className="h-4 bg-gray-200 w-full rounded"></div>
                        <div className="h-4 bg-gray-200 w-2/3 rounded"></div>
                        <div className="h-4 bg-gray-200 w-1/4 rounded"></div>
                    </div>
                ))}
            </div>
        </div>
    </div>
);
// =================================================================


const ExplorePage = () => {
    const [projects, setProjects] = useState([]);
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null); // ⭐️ NEW: Error State
    const navigate = useNavigate();

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            // Fetch projects and users concurrently
            const [projectRes, userRes] = await Promise.all([
                api.get("/projects/"),
                api.get("/users/"),
            ]);

            setProjects(projectRes.data || []);
            setUsers(userRes.data || []);
            
            console.log("✅ Explore data loaded", {
                projects: projectRes.data?.length,
                users: userRes.data?.length,
            });

        } catch (err) {
            console.error("❌ Failed to fetch explore data:", err);
            setError(err); // Store the error
            
            // Handle specific authentication failure for better UX
            if (err.response?.status === 401) {
                // The axios interceptor should handle clearing the token, but this ensures a redirect
                navigate("/login"); 
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [navigate]);

    const filteredProjects = projects.filter(
        (p) =>
            p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredUsers = users.filter((u) =>
        u.username?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // ⭐️ Use Skeleton Loading
    if (loading) {
        return <ExploreSkeleton />;
    }

    // ⭐️ Handle Critical Error State
    if (error && !projects.length && !users.length) {
        return (
            <div className="p-12 max-w-lg mx-auto mt-10 bg-white shadow-lg rounded-xl text-center border-t-4 border-red-500">
                <p className="text-4xl mb-4">🚨</p>
                <h3 className="text-xl font-bold text-red-600 mb-2">Failed to Load Explore Data</h3>
                <p className="text-gray-600 mb-4">
                    There was a network issue or the server is unavailable. Please check your connection or try again.
                </p>
                <button
                    onClick={fetchData}
                    className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition font-semibold"
                >
                    Retry
                </button>
            </div>
        );
    }
    
    // Main Content
    return (
        <div className="p-6 max-w-7xl mx-auto bg-gray-50 font-sans min-h-screen">
            {/* 🔍 Search */}
            <div className="mb-8">
                <input
                    type="text"
                    placeholder="Search projects or users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full sm:w-1/2 px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {/* 👥 Users Section */}
            {/* Only show users if there is a search term */}
            {searchTerm && (
                <div className="mb-10">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Users</h3>
                    {filteredUsers.length > 0 ? (
                        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {filteredUsers.map((user) => (
                                <li
                                    key={user.id}
                                    // ⭐️ PROFILE LINK: Correctly navigating to the dynamic route
                                    onClick={() => navigate(`/profile/${user.id}`)} 
                                    className="flex items-center gap-4 p-4 bg-white rounded-xl shadow hover:shadow-lg transition cursor-pointer"
                                >
                                    <img
                                        src={
                                            user.profile_image
                                                ? `${MEDIA_URL}${user.profile_image}`
                                                : "/default-profile.png"
                                        }
                                        alt={user.username}
                                        className="w-12 h-12 rounded-full object-cover"
                                    />
                                    <div>
                                        <p className="font-semibold text-gray-800">
                                            @{user.username}
                                        </p>
                                        {user.bio && (
                                            <p className="text-sm text-gray-500 line-clamp-1">
                                                {user.bio}
                                            </p>
                                        )}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500 text-sm italic">No users found matching "{searchTerm}".</p>
                    )}
                </div>
            )}

            {/* 📦 Projects Section */}
            <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    {searchTerm ? "Matching Projects" : "All Projects"}
                </h3>
                {filteredProjects.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredProjects.map((project) => {
                            const profileImg = project.owner?.profile_image
                                ? `${MEDIA_URL}${project.owner.profile_image}`
                                : "/default-profile.png";

                            return (
                                <div
                                    key={project.id}
                                    onClick={() => navigate(`/project/${project.id}`)}
                                    className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition cursor-pointer space-y-3 border border-gray-100"
                                >
                                    {/* Owner Info - Link to profile is better here */}
                                    <div 
                                        className="flex items-center gap-3"
                                        // ⭐️ NEW: Add stopPropagation to prevent the parent div click from triggering
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigate(`/profile/${project.owner.id}`);
                                        }}
                                    >
                                        <img
                                            src={profileImg}
                                            alt="Profile"
                                            className="w-10 h-10 rounded-full object-cover"
                                        />
                                        <p className="text-sm font-medium text-gray-700 hover:text-blue-600 transition">
                                            @{project.owner?.username}
                                        </p>
                                    </div>

                                    {/* Project Image */}
                                    {project.image && (
                                        <img
                                            src={`${MEDIA_URL}${project.image}`}
                                            alt={project.title}
                                            className="w-full h-48 object-cover rounded-lg"
                                        />
                                    )}

                                    {/* Project Info */}
                                    <h2 className="text-lg font-bold text-gray-900 line-clamp-2">
                                        {project.title}
                                    </h2>
                                    <p className="text-gray-600 text-sm line-clamp-3">
                                        {project.description}
                                    </p>
                                    <div className="text-sm text-gray-500 pt-2 border-t border-gray-100">
                                        <span className="font-semibold text-green-600">
                                            KSh {project.current_funding}
                                        </span> 
                                        <span className="text-gray-500"> raised of KSh </span>
                                        {project.funding_goal}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <p className="text-gray-500 text-sm italic">
                        No projects found matching your search.
                    </p>
                )}
            </div>
        </div>
    );
};

export default ExplorePage;