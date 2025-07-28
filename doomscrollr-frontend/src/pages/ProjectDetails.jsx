import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { useParams } from 'react-router-dom';

const ProjectDetails = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetchProject();
    fetchTransactions();
  }, []);

  const fetchProject = async () => {
    try {
      const res = await api.get(`/api/projects/${id}/`);
      setProject(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTransactions = async () => {
    try {
      const res = await api.get(`/api/projects/${id}/`);
      setTransactions(res.data.transactions || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleFund = async () => {
    try {
      const res = await api.post(
        `/api/projects/${id}/fund/`,
        { amount },
        {
          headers: {
            Authorization: `Token ${localStorage.getItem('token')}`,
          },
        }
      );
      setMessage('✅ Funded successfully!');
      setAmount('');
      fetchProject();
      fetchTransactions();
    } catch (err) {
      setMessage('❌ Error funding project.');
      console.error(err);
    }
  };

  if (!project) return <p className="text-center p-6 font-sans">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 font-sans bg-gray-50 min-h-screen">
      <div className="bg-white p-6 rounded-2xl shadow mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">{project.title}</h1>
        <p className="text-gray-700 mb-4">{project.description}</p>

        <div className="text-sm text-gray-600 mb-4 space-y-1">
          <p>🎯 Goal: <span className="font-semibold text-gray-900">${project.goal_amount}</span></p>
          <p>💰 Raised: <span className="font-semibold text-green-700">${project.amount_raised}</span></p>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <input
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="border px-3 py-2 rounded w-40"
          />
          <button
            onClick={handleFund}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Fund Project
          </button>
        </div>

        {message && (
          <p className="text-sm text-green-600 font-medium mt-2">{message}</p>
        )}
      </div>

      {/* Transactions */}
      <div className="bg-white p-6 rounded-2xl shadow">
        <h2 className="text-xl font-semibold mb-4 text-gray-900">Funding Activity</h2>
        {transactions.length ? (
          <ul className="space-y-3">
            {transactions.map((tx) => (
              <li
                key={tx.id}
                className="text-sm text-gray-800 border-b pb-2"
              >
                <span className="font-medium text-gray-900">{tx.sender}</span> funded
                <span className="text-green-700 font-semibold"> ${tx.amount}</span> on{' '}
                <span className="text-gray-600">
                  {new Date(tx.timestamp).toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-sm">No transactions yet.</p>
        )}
      </div>
    </div>
  );
};

export default ProjectDetails;
