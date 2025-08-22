import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Gifts from './pages/Gifts';
import Vouchers from './pages/Vouchers';
import Transactions from './pages/Transactions';
import { useAuth } from './hooks/useAuth';

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      <Route path="/" element={
        <PrivateRoute isAuthenticated={isAuthenticated}>
          <Layout />
        </PrivateRoute>
      }>
        <Route index element={<Dashboard />} />
        <Route path="gifts" element={<Gifts />} />
        <Route path="vouchers" element={<Vouchers />} />
        <Route path="transactions" element={<Transactions />} />
      </Route>
    </Routes>
  );
}

function PrivateRoute({ isAuthenticated, children }: { isAuthenticated: boolean, children: JSX.Element }) {
  return isAuthenticated ? children : <Navigate to="/login" />;
}

export default App;
