import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const ChatList = () => {
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await api.get('/chat/conversations/', {
          headers: {
            Authorization: `Token ${localStorage.getItem('token')}`,
          },
        });
        setConversations(res.data);
      } catch (err) {
        console.error('Failed to fetch conversations:', err);
      }
    };

    fetchConversations();
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-center">Your Chats</h2>

      {conversations.length === 0 ? (
        <p className="text-center text-gray-600">No conversations yet.</p>
      ) : (
        <ul className="space-y-4">
          {conversations.map((conv) => {
            const otherUser =
              conv.user1 === parseInt(localStorage.getItem('user_id'))
                ? conv.user2_username
                : conv.user1_username;

            return (
              <li
                key={conv.id}
                className="bg-white rounded-xl shadow-md px-5 py-4 hover:shadow-lg transition"
              >
                <Link
                  to={`/chat/${conv.id}`}
                  className="text-blue-600 font-semibold text-lg hover:underline"
                >
                  Chat with @{otherUser}
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
