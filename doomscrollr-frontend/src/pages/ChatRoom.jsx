// src/pages/ChatRoom.jsx
import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';

const ChatRoom = () => {
  const { id } = useParams(); // conversation ID
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  // ✅ Auto-scroll to bottom when messages update
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    fetchMessages();
    // Optional: Poll for new messages every 3 seconds
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [id]);

  const fetchMessages = async () => {
    try {
      // ✅ FIX 1: Changed from /chat/messages/${id}/ to /conversations/${id}/messages/
      // ✅ FIX 2: Removed Authorization header (axios interceptor handles this)
      const res = await api.get(`/conversations/${id}/messages/`);
      setMessages(res.data);
      setError(null);
    } catch (err) {
      console.error('❌ Failed to fetch messages:', err);
      setError('Failed to load messages.');
      
      if (err.response?.status === 401) {
        navigate('/login');
      } else if (err.response?.status === 404) {
        setError('Conversation not found.');
      }
    } finally {
      setLoading(false);
    }
  };

const sendMessage = async (e) => {
  e?.preventDefault();
  if (!text.trim() || sending) return;

  setSending(true);
  try {
    // ✅ Make sure the payload structure matches backend expectations
    const payload = {
      text: text.trim(),
      // Remove these if not needed:
      // conversation: parseInt(id),
      // sender: currentUserId,
    };

    console.log('📤 Sending message:', payload); // Debug log

    const res = await api.post(`/conversations/${id}/messages/`, payload);
    
    setMessages((prev) => [...prev, res.data]);
    setText('');
    console.log('✅ Message sent:', res.data);
  } catch (err) {
    console.error('❌ Failed to send message:', err);
    console.error('Response data:', err.response?.data); // ✅ See actual error
    alert(`Failed to send message: ${err.response?.data?.text?.[0] || 'Unknown error'}`);
  } finally {
    setSending(false);
  }
};

  // ✅ FIX 4: Get username from localStorage
  const currentUsername = localStorage.getItem('username') || 
                          JSON.parse(localStorage.getItem('user'))?.username;

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <p className="text-center text-gray-600">Loading chat...</p>
      </div>
    );
  }

  if (error && messages.length === 0) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg text-center">
          {error}
        </div>
        <button
          onClick={() => navigate('/chat')}
          className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
        >
          Back to Conversations
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 h-screen flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => navigate('/chat')}
          className="text-blue-600 hover:text-blue-700 font-medium"
        >
          ← Back to Chats
        </button>
        <h2 className="text-2xl font-bold text-gray-900">Chat Room</h2>
        <div className="w-20"></div> {/* Spacer for centering */}
      </div>

      {/* Messages Container */}
      <div className="flex-1 bg-white rounded-lg shadow-inner p-4 overflow-y-auto mb-4">
        {messages.length === 0 ? (
          <p className="text-center text-gray-500">No messages yet. Start the conversation!</p>
        ) : (
          <div className="space-y-3">
            {messages.map((msg) => {
              const isMe = msg.sender_username === currentUsername;
              return (
                <div
                  key={msg.id}
                  className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[75%] p-3 rounded-lg shadow-sm ${
                      isMe
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    {!isMe && (
                      <p className="text-xs font-semibold mb-1 opacity-75">
                        {msg.sender_username}
                      </p>
                    )}
                    <p className="text-base break-words">{msg.text}</p>
                    <p className={`text-xs mt-1 ${isMe ? 'text-blue-100' : 'text-gray-500'}`}>
                      {new Date(msg.timestamp).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Form */}
      <form onSubmit={sendMessage} className="flex gap-3 items-center">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage(e)}
          placeholder="Type a message..."
          className="flex-grow border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={sending}
        />
        <button
          type="submit"
          disabled={!text.trim() || sending}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
        >
          {sending ? 'Sending...' : 'Send'}
        </button>
      </form>
    </div>
  );
};

export default ChatRoom;