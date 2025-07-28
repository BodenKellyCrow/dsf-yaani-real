import { useEffect, useState } from 'react';
import api from '../api/axios';
import { MEDIA_URL } from '../api/config';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchFeed();
  }, []);

  const fetchFeed = async () => {
    try {
      const res = await api.get('/feed/');
      setPosts(res.data);
    } catch (err) {
      console.error('Failed to fetch feed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId) => {
    try {
      await api.post(`/feed/${postId}/like/`, {}, {
        headers: { Authorization: `Token ${localStorage.getItem('token')}` },
      });
      setPosts(posts.map(p => p.id === postId ? { ...p, likes: p.likes + 1 } : p));
    } catch (err) {
      console.error('Like failed:', err);
    }
  };

  const handleComment = async (postId) => {
    const text = commentText[postId];
    if (!text) return;

    try {
      await api.post(`/feed/${postId}/comment/`, { text }, {
        headers: { Authorization: `Token ${localStorage.getItem('token')}` },
      });
      setCommentText(prev => ({ ...prev, [postId]: '' }));
      fetchFeed(); // Refresh after new comment
    } catch (err) {
      console.error('Comment failed:', err);
    }
  };

  const handleShare = async (post) => {
    try {
      await navigator.share({
        title: post.title,
        text: post.description || '',
        url: `${window.location.origin}/posts/${post.id}`,
      });
    } catch (err) {
      console.warn('Share cancelled:', err);
    }
  };

  if (loading) return <div className="p-4 text-center">Loading feed...</div>;

  return (
    <div className="p-4 max-w-2xl mx-auto space-y-6">
      {posts.map(post => (
        <div key={post.id} className="bg-white p-5 rounded-2xl shadow-md">
          {/* Top Bar */}
          <div className="flex items-center gap-3 mb-3">
            <img
              src={post.user?.profile_image ? `${MEDIA_URL}${post.user.profile_image}` : '/fallback.png'}
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover"
            />
            <p className="font-semibold">@{post.user?.username || 'unknown'}</p>
          </div>

          {/* Post Body */}
          <h3 className="text-lg font-bold mb-1">{post.title}</h3>
          {post.description && (
            <p className="text-gray-700 mb-3">{post.description}</p>
          )}
          {post.image && (
            <img
              src={`${MEDIA_URL}${post.image}`}
              alt="Post"
              className="w-full max-h-96 object-cover rounded-xl mb-4"
            />
          )}

          {/* Buttons */}
          <div className="flex space-x-6 text-sm text-gray-600 mb-3">
            <button onClick={() => handleLike(post.id)} className="hover:text-red-500">❤️ {post.likes}</button>
            <button onClick={() => document.getElementById(`comment-${post.id}`).focus()} className="hover:text-blue-600">💬 {post.comments?.length || 0}</button>
            <button onClick={() => handleShare(post)} className="hover:text-green-600">🔗 Share</button>
          </div>

          {/* Comments */}
          <div className="space-y-2 mb-3">
            {post.comments?.map((c, i) => (
              <p key={i} className="text-sm text-gray-800">
                <span className="font-semibold">@{c.user?.username}</span>: {c.text}
              </p>
            ))}
          </div>

          {/* Add Comment */}
          <div className="flex gap-2">
            <input
              id={`comment-${post.id}`}
              type="text"
              placeholder="Add a comment..."
              value={commentText[post.id] || ''}
              onChange={(e) => setCommentText(prev => ({ ...prev, [post.id]: e.target.value }))}
              className="flex-1 border px-3 py-2 rounded focus:outline-none focus:ring"
            />
            <button
              onClick={() => handleComment(post.id)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Post
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default HomePage;

