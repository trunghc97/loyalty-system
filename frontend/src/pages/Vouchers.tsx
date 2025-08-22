import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

interface Voucher {
  id: string;
  code: string;
  name: string;
  description: string;
  pointsCost: number;
  discountAmount: number;
  expiryDate: string;
}

function Vouchers() {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVouchers();
  }, []);

  const fetchVouchers = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_JAVA_API_URL}/vouchers`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setVouchers(response.data);
    } catch (error) {
      toast.error('Failed to fetch vouchers');
    } finally {
      setLoading(false);
    }
  };

  const handleRedeem = async (voucherId: string) => {
    try {
      await axios.post(
        `${process.env.REACT_APP_JAVA_API_URL}/redeem/voucher`,
        { voucherId },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      toast.success('Voucher redeemed successfully');
      fetchVouchers();
    } catch (error) {
      toast.error('Failed to redeem voucher');
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
      {vouchers.map((voucher) => (
        <div key={voucher.id} className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">{voucher.name}</h3>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                {voucher.code}
              </span>
            </div>
            <p className="mt-1 text-sm text-gray-500">{voucher.description}</p>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Discount</span>
                <span className="font-medium">${voucher.discountAmount}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Cost</span>
                <span className="font-medium text-indigo-600">{voucher.pointsCost} points</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Expires</span>
                <span className="font-medium">{new Date(voucher.expiryDate).toLocaleDateString()}</span>
              </div>
            </div>
            <button
              onClick={() => handleRedeem(voucher.id)}
              className="mt-4 w-full bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
            >
              Redeem
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Vouchers;
