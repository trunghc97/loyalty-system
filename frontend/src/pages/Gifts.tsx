import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

interface Gift {
  id: string;
  name: string;
  description: string;
  pointsCost: number;
  stock: number;
  imageUrl: string;
}

function Gifts() {
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGifts();
  }, []);

  const fetchGifts = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_JAVA_API_URL}/gifts`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setGifts(response.data);
    } catch (error) {
      toast.error('Failed to fetch gifts');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {gifts.map((gift) => (
        <div key={gift.id} className="bg-white overflow-hidden shadow rounded-lg">
          <div className="aspect-w-3 aspect-h-2">
            <img
              className="object-cover w-full h-48"
              src={gift.imageUrl || 'https://via.placeholder.com/300'}
              alt={gift.name}
            />
          </div>
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900">{gift.name}</h3>
            <p className="mt-1 text-sm text-gray-500">{gift.description}</p>
            <div className="mt-4">
              <span className="text-indigo-600 font-medium">{gift.pointsCost} points</span>
              <span className="ml-2 text-sm text-gray-500">({gift.stock} available)</span>
            </div>
            <button
              className="mt-4 w-full bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
              disabled={gift.stock === 0}
            >
              {gift.stock === 0 ? 'Out of Stock' : 'Redeem'}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Gifts;
