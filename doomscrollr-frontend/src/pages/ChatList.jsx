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
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">My Chats</h2>
      <ul className="space-y-4">
        {conversations.map((conv) => {
          const otherUser =
            conv.user1 === parseInt(localStorage.getItem('user_id'))
              ? conv.user2_username
              : conv.user1_username;

          return (
            <li key={conv.id} className="p-4 bg-white shadow rounded">
              <Link to={`/chat/${conv.id}`} className="text-blue-600 font-semibold">
                Chat with @{otherUser}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default ChatList;
