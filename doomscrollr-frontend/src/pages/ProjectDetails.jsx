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
      setMessage('Funded successfully!');
      setAmount('');
      fetchProject();
      fetchTransactions();
    } catch (err) {
      setMessage('Error funding project.');
      console.error(err);
    }
  };

  if (!project) return <p className="text-center p-6">Loading...</p>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">{project.title}</h1>
      <p className="text-gray-700 mb-2">{project.description}</p>
      <p className="mb-2">Goal: ${project.goal_amount}</p>
      <p className="mb-4 font-semibold">Raised: ${project.amount_raised}</p>

      <div className="mb-4">
        <input
          type="number"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="border px-3 py-2 mr-2 rounded"
        />
        <button
          onClick={handleFund}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Fund Project
        </button>
      </div>
      {message && <p className="text-sm text-green-600">{message}</p>}

      <hr className="my-6" />

      <h2 className="text-xl font-semibold mb-2">Transactions</h2>
      {transactions.length ? (
        <ul className="space-y-2">
          {transactions.map((tx) => (
            <li key={tx.id} className="text-gray-800 border-b pb-2">
              {tx.sender} funded ${tx.amount} on {new Date(tx.timestamp).toLocaleString()}
            </li>
          ))}
        </ul>
      ) : (
        <p>No transactions yet.</p>
      )}
    </div>
  );
};

export default ProjectDetails;
