// src/pages/UserProfilePage.jsx
import { useEffect, useState, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { MEDIA_URL } from '../api/config';

// -----------------------------------------------------------
// ⭐️ NEW COMPONENT: ProfileSkeleton (Place the code from above here)
const ProfileSkeleton = () => (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen animate-pulse">
        {/* Profile Header Skeleton */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <div className="flex items-start gap-6">
                {/* Image Placeholder */}
                <div className="w-32 h-32 rounded-full bg-gray-300 border-4 border-gray-400"></div>
                
                <div className="flex-1">
                    {/* Username Placeholder */}
                    <div className="h-8 bg-gray-300 w-1/3 mb-4 rounded"></div>
                    {/* Bio Placeholder */}
                    <div className="space-y-2 mb-4">
                        <div className="h-4 bg-gray-200 w-full rounded"></div>
                        <div className="h-4 bg-gray-200 w-3/4 rounded"></div>
                    </div>
                    {/* Stats Placeholder */}
                    <div className="flex gap-6 text-sm">
                        <div className="h-4 bg-gray-200 w-20 rounded"></div>
                        <div className="h-4 bg-gray-200 w-24 rounded"></div>
                    </div>
                </div>
            </div>
            
            {/* Button Placeholders */}
            <div className="flex gap-3 mt-6">
                <div className="flex-1 h-10 bg-blue-300 rounded-lg"></div>
                <div className="flex-1 h-10 bg-gray-300 rounded-lg"></div>
            </div>
        </div>

        {/* Tabs and Content Placeholder */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="flex border-b">
                <div className="flex-1 py-4 bg-gray-100 h-16"></div>
                <div className="flex-1 py-4 bg-gray-50 h-16"></div>
            </div>
            <div className="p-6 space-y-4">
                {/* Content Items Placeholder */}
                <div className="border rounded-xl p-4 bg-gray-100 h-32"></div>
                <div className="border rounded-xl p-4 bg-gray-100 h-32"></div>
            </div>
        </div>
    </div>
);

// -----------------------------------------------------------
// ⭐️ NEW COMPONENT: DataListFallback (Place the code from above here)
const DataListFallback = ({ type, hasError, onRetry }) => {
    let message = '';
    let icon = '';
    let color = 'text-gray-500';

    if (hasError) {
        message = `Failed to load ${type}. Please try again.`;
        icon = '⚠️';
        color = 'text-red-500';
    } else {
        message = `This user hasn't created any ${type} yet.`;
        icon = '✨';
    }

    return (
        <div className={`p-8 text-center border-2 border-dashed ${color} rounded-xl my-4`}>
            <p className="text-4xl mb-4">{icon}</p>
            <p className="text-lg font-medium mb-4">{message}</p>
            {hasError && (
                <button 
                    onClick={onRetry}
                    className="mt-2 bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200 transition"
                >
                    Retry Loading {type}
                </button>
            )}
        </div>
    );
};
// -----------------------------------------------------------


export default function UserProfilePage() {
    const { userId } = useParams();
    const navigate = useNavigate();

    // Core Data States
    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [projects, setProjects] = useState([]);

    // Loading/Error States (Granular Tracking)
    const [loading, setLoading] = useState(true);
    const [userError, setUserError] = useState(null);
    const [postsError, setPostsError] = useState(null);
    const [projectsError, setProjectsError] = useState(null);

    // UX State
    const [activeTab, setActiveTab] = useState('posts');

    // Feature Extension State (Follow/Message)
    const [isFollowing, setIsFollowing] = useState(false); 
    const [followLoading, setFollowLoading] = useState(false);

    // =================================================================
    // ⭐️ DATA FETCHING FUNCTIONS (Improved Error Handling & Retries)
    // =================================================================

    const fetchUser = useCallback(async () => {
        setUserError(null);
        try {
            const userRes = await api.get(`/users/${userId}/`);
            setUser(userRes.data);
            // NOTE: Add logic here to determine initial isFollowing state 
            // e.g., if (userRes.data.is_followed_by_current_user) setIsFollowing(true);
            return userRes.data;
        } catch (err) {
            setUserError(err);
            setUser(null);
            console.error(`❌ Failed to fetch user (${userId}):`, err);
            return null;
        }
    }, [userId]);

    const fetchPosts = useCallback(async (retry = false) => {
        if (!retry) setPostsError(null); // Clear error unless it's a dedicated retry
        try {
            const postsRes = await api.get(`/social-posts/?author=${userId}`);
            setPosts(postsRes.data);
            setPostsError(null);
        } catch (err) {
            setPostsError(err);
            setPosts([]);
            console.error(`❌ Failed to fetch posts for user ${userId}:`, err);
        }
    }, [userId]);

    const fetchProjects = useCallback(async (retry = false) => {
        if (!retry) setProjectsError(null); // Clear error unless it's a dedicated retry
        try {
            const projectsRes = await api.get(`/projects/?owner=${userId}`);
            setProjects(projectsRes.data);
            setProjectsError(null);
        } catch (err) {
            setProjectsError(err);
            setProjects([]);
            console.error(`❌ Failed to fetch projects for user ${userId}:`, err);
        }
    }, [userId]);

    const fetchAllData = useCallback(async () => {
        setLoading(true);
        // Fetch user first, as subsequent fetches depend on the profile being valid
        const user = await fetchUser();

        // Only fetch content if user exists
        if (user) {
            // Use Promise.all to fetch posts and projects concurrently
            await Promise.all([
                fetchPosts(),
                fetchProjects(),
            ]);
        }
        setLoading(false);
    }, [fetchUser, fetchPosts, fetchProjects]);


    useEffect(() => {
        fetchAllData();
    }, [fetchAllData]);


    // =================================================================
    // ⭐️ FEATURE EXTENSION: Follow/Message Logic
    // =================================================================

    const handleFollowToggle = async () => {
        if (followLoading) return;
        setFollowLoading(true);
        const endpoint = `/users/${userId}/${isFollowing ? 'unfollow' : 'follow'}/`;
        
        // Optimistic UI Update
        setIsFollowing(prev => !prev); 

        try {
            // NOTE: You'll need to create a dedicated Django endpoint for this (e.g., POST /users/123/follow/)
            await api.post(endpoint);
            // If success, keep the optimistic update
        } catch (err) {
            // Revert on failure
            setIsFollowing(prev => !prev); 
            console.error(`❌ Failed to toggle follow state:`, err);
            alert(`Failed to ${isFollowing ? 'unfollow' : 'follow'} user. Please try again.`);
        } finally {
            setFollowLoading(false);
        }
    };

    const handleMessage = () => {
        // NOTE: Redirect to the user's specific chat room
        navigate(`/chat/${userId}`);
    };

    // =================================================================
    // ⭐️ RENDER LOGIC
    // =================================================================

    // 1. Loading State (Use Skeleton)
    if (loading) {
        return <ProfileSkeleton />;
    }

    // 2. User Not Found/Critical Error (e.g., 404 on user endpoint)
    if (userError || !user) {
        return (
            <div className="max-w-md mx-auto p-10 bg-white shadow-xl rounded-lg mt-20 text-center">
                <p className="text-4xl mb-4">😔</p>
                <p className="text-red-600 mb-4 text-xl font-bold">
                    {userError?.response?.status === 404 ? 'User Not Found' : 'Critical Error'}
                </p>
                <p className="text-gray-600 mb-6">
                    We could not load the profile for ID: {userId}. It may not exist or an API error occurred.
                </p>
                <button
                    onClick={() => navigate('/explore')}
                    className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition font-semibold shadow-md"
                >
                    Back to Explore
                </button>
            </div>
        );
    }

    // 3. Main Content Rendering
    const followButtonClass = isFollowing 
        ? "bg-gray-200 text-gray-800 hover:bg-gray-300" 
        : "bg-blue-600 text-white hover:bg-blue-700";

    return (
        <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
            {/* Profile Header */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                <div className="flex items-start gap-6">
                    <img
                        src={user.profile_image ? `${MEDIA_URL}${user.profile_image}` : '/default-profile.png'}
                        alt={user.username}
                        className="w-32 h-32 rounded-full object-cover border-4 border-blue-500 shadow-md"
                    />
                    <div className="flex-1">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">@{user.username}</h1>
                        {user.bio && (
                            <p className="text-gray-600 mb-4 italic">"{user.bio}"</p>
                        )}
                        <div className="flex gap-6 text-sm text-gray-500">
                            <span><strong>{posts.length}</strong> Posts</span>
                            <span><strong>{projects.length}</strong> Projects</span>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mt-6">
                    <button
                        onClick={handleFollowToggle}
                        disabled={followLoading}
                        className={`flex-1 py-2 px-4 rounded-lg transition font-medium shadow-sm ${followButtonClass}`}
                    >
                        {followLoading ? '...' : (isFollowing ? 'Following' : 'Follow')}
                    </button>
                    <button
                        onClick={handleMessage}
                        className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition font-medium shadow-sm"
                    >
                        Message
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                {/* Tabs are now visually polished with a focus transition */}
                <div className="flex border-b">
                    <button
                        onClick={() => setActiveTab('posts')}
                        className={`flex-1 py-4 font-semibold transition duration-300 ease-in-out ${
                            activeTab === 'posts'
                                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                        Posts ({posts.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('projects')}
                        className={`flex-1 py-4 font-semibold transition duration-300 ease-in-out ${
                            activeTab === 'projects'
                                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                        Projects ({projects.length})
                    </button>
                </div>

                <div className="p-6">
                    {/* Posts Tab Content */}
                    {activeTab === 'posts' && (
                        <div className="space-y-4">
                            {postsError || posts.length === 0 ? (
                                <DataListFallback 
                                    type="posts" 
                                    hasError={!!postsError} 
                                    onRetry={() => fetchPosts(true)} 
                                />
                            ) : (
                                posts.map((post) => (
                                    <div key={post.id} className="border rounded-xl p-4 bg-gray-50 hover:bg-gray-100 transition shadow-sm">
                                        <p className="text-gray-800 mb-3 whitespace-pre-wrap">{post.content}</p>
                                        {/* Image handling remains the same */}
                                        {post.image && (
                                            <img
                                                src={`${MEDIA_URL}${post.image}`}
                                                alt="Post"
                                                className="w-full max-h-96 object-cover rounded-lg mb-3"
                                            />
                                        )}
                                        {/* Simplified Footer */}
                                        <div className="text-sm text-gray-500">
                                             {new Date(post.created_at).toLocaleDateString()}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {/* Projects Tab Content */}
                    {activeTab === 'projects' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {projectsError || projects.length === 0 ? (
                                <DataListFallback 
                                    type="projects" 
                                    hasError={!!projectsError} 
                                    onRetry={() => fetchProjects(true)} 
                                />
                            ) : (
                                projects.map((project) => (
                                    <div
                                        key={project.id}
                                        onClick={() => navigate(`/project/${project.id}`)}
                                        className="border rounded-xl p-4 bg-gray-50 hover:shadow-lg transition cursor-pointer"
                                    >
                                        {/* Project card rendering remains the same, but wrapped in error logic */}
                                        {project.image && (
                                            <img
                                                src={`${MEDIA_URL}${project.image}`}
                                                alt={project.title}
                                                className="w-full h-48 object-cover rounded-lg mb-3"
                                            />
                                        )}
                                        <h3 className="font-bold text-lg text-gray-900 mb-2">{project.title}</h3>
                                        <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                                            {project.description}
                                        </p>
                                        <div className="flex justify-between items-center text-sm">
                                            <div className="text-sm">
                                                <span className="text-green-600 font-semibold">
                                                    KSh {project.current_funding}
                                                </span>
                                                <span className="text-gray-500"> / KSh {project.funding_goal}</span>
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {((project.current_funding / project.funding_goal) * 100).toFixed(0)}%
                                            </div>
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