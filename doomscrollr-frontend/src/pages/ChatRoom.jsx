import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';

const ChatRoom = () => {
  const { id } = useParams(); // conversation ID
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    try {
      const res = await api.get(`/chat/messages/${id}/`, {
        headers: {
          Authorization: `Token ${localStorage.getItem('token')}`,
        },
      });
      setMessages(res.data);
    } catch (err) {
      console.error('Failed to fetch messages:', err);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!text.trim()) return;

    try {
      const res = await api.post(
        `/chat/messages/${id}/`,
        { text },
        {
          headers: {
            Authorization: `Token ${localStorage.getItem('token')}`,
          },
        }
      );
      setMessages((prev) => [...prev, res.data]);
      setText('');
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [id]);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">Chat Room</h2>

      {loading ? (
        <p className="text-center text-gray-600">Loading messages...</p>
      ) : (
        <div className="space-y-3 mb-6 max-h-[400px] overflow-y-auto bg-white p-4 rounded-lg shadow-inner">
          {messages.map((msg) => {
            const isMe = msg.sender_username === localStorage.getItem('username');
            return (
              <div
                key={msg.id}
                className={`max-w-[75%] p-3 rounded-lg shadow-sm ${
                  isMe
                    ? 'ml-auto bg-blue-100 text-right'
                    : 'mr-auto bg-gray-100 text-left'
                }`}
              >
                <p className="text-sm text-gray-600 font-medium">
                  {msg.sender_username}
                </p>
                <p className="text-base">{msg.text}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </p>
              </div>
            );
          })}
        </div>
      )}

      <div className="flex gap-3 items-center">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          className="flex-grow border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring focus:border-blue-400"
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatRoom;
