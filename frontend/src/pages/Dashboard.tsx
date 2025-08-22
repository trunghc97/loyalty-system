import React, { useState } from 'react';
import { usePoints } from '../hooks/usePoints';
import { useAuth } from '../hooks/useAuth';

function Dashboard() {
  const { user } = useAuth();
  const { earnPoints, transferPoints, loading } = usePoints();
  const [earnAmount, setEarnAmount] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [transferTo, setTransferTo] = useState('');

  const handleEarn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (earnAmount) {
      await earnPoints(Number(earnAmount));
      setEarnAmount('');
    }
  };

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (transferAmount && transferTo) {
      await transferPoints(Number(transferAmount), transferTo);
      setTransferAmount('');
      setTransferTo('');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome, {user?.username}!</h2>
        <p className="text-lg text-gray-700">Your current balance: <span className="font-bold text-indigo-600">{user?.points} points</span></p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Earn Points</h3>
          <form onSubmit={handleEarn}>
            <div className="mb-4">
              <label htmlFor="earnAmount" className="block text-sm font-medium text-gray-700">
                Amount
              </label>
              <input
                type="number"
                id="earnAmount"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                value={earnAmount}
                onChange={(e) => setEarnAmount(e.target.value)}
                min="1"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Earn Points'}
            </button>
          </form>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Transfer Points</h3>
          <form onSubmit={handleTransfer}>
            <div className="mb-4">
              <label htmlFor="transferAmount" className="block text-sm font-medium text-gray-700">
                Amount
              </label>
              <input
                type="number"
                id="transferAmount"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                value={transferAmount}
                onChange={(e) => setTransferAmount(e.target.value)}
                min="1"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="transferTo" className="block text-sm font-medium text-gray-700">
                Recipient Username
              </label>
              <input
                type="text"
                id="transferTo"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                value={transferTo}
                onChange={(e) => setTransferTo(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Transfer Points'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
