import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = process.env.REACT_APP_JAVA_API_URL;

export function usePoints() {
  const [loading, setLoading] = useState(false);

  const getBalance = async () => {
    try {
      const response = await axios.get(`${API_URL}/points/balance`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      return response.data;
    } catch (error) {
      toast.error('Failed to fetch balance');
      return 0;
    }
  };

  const earnPoints = async (amount: number, description?: string) => {
    setLoading(true);
    try {
      await axios.post(
        `${API_URL}/points/earn`,
        { amount, description },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      toast.success('Points earned successfully');
      return true;
    } catch (error) {
      toast.error('Failed to earn points');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const transferPoints = async (amount: number, toUsername: string) => {
    setLoading(true);
    try {
      await axios.post(
        `${API_URL}/points/transfer`,
        { amount, toUsername },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      toast.success('Points transferred successfully');
      return true;
    } catch (error) {
      toast.error('Failed to transfer points');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    getBalance,
    earnPoints,
    transferPoints
  };
}
