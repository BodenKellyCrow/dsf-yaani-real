// src/pages/ChatList.jsx
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';

const ChatList = () => {
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchConversations();
    }, []);

    const fetchConversations = async () => {
        setLoading(true);
        setError(null);
        try {
            // ✅ FIX 1: Ensure path is /conversations/ (Matches projects/urls.py fix)
            const res = await api.get('/conversations/');
            setConversations(res.data);
            console.log('✅ Conversations loaded:', res.data);
        } catch (err) {
            console.error('❌ Failed to fetch conversations:', err);
            setError('Failed to load conversations. Please ensure you are logged in.');
            
            // If unauthorized, redirect to login
            if (err.response?.status === 401) {
                navigate('/login');
            }
        } finally {
            setLoading(false);
        }
    };

    // ✅ Get current user ID from localStorage
    const currentUserId = parseInt(localStorage.getItem('userId')) || 
                        JSON.parse(localStorage.getItem('user'))?.id;

    if (loading) {
        return (
            <div className="max-w-3xl mx-auto p-6">
                <p className="text-center text-gray-600">Loading conversations...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-3xl mx-auto p-6">
                <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg text-center">
                    {error}
                </div>
                <button
                    onClick={fetchConversations}
                    className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto p-6 bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gray-900">Your Chats</h2>
                <button
                    onClick={fetchConversations}
                    className="text-blue-600 hover:text-blue-700 text-sm"
                >
                    Refresh
                </button>
            </div>

            {conversations.length === 0 ? (
                <div className="bg-white rounded-xl shadow p-8 text-center">
                    <p className="text-gray-600 mb-4">No conversations yet.</p>
                    <p className="text-sm text-gray-500">
                        Start a conversation by messaging someone from their profile!
                    </p>
                </div>
            ) : (
                <ul className="space-y-4">
                    {conversations.map((conv) => {
                        // ✅ Logic to determine the other user's username
                        const otherUser = conv.user1 === currentUserId
                            ? conv.user2_username
                            : conv.user1_username;

                        // Link to the chat room
                        return (
                            <li
                                key={conv.id}
                                className="bg-white rounded-xl shadow-md hover:shadow-lg transition"
                            >
                                <Link
                                    to={`/chat/${conv.id}`}
                                    className="block px-5 py-4"
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="text-blue-600 font-semibold text-lg hover:underline">
                                                Chat with @{otherUser}
                                            </h3>
                                            <p className="text-sm text-gray-500 mt-1">
                                                Started {new Date(conv.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <svg
                                            className="w-6 h-6 text-gray-400"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M9 5l7 7-7 7"
                                            />
                                        </svg>
                                    </div>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
};

export default ChatList;