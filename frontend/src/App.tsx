import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Layout } from './components/organisms/Layout'
import { useAuth } from './hooks/useAuth'

// Pages
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Earn from './pages/Earn'
import Transfer from './pages/Transfer'
import Redeem from './pages/Redeem'
import Gifts from './pages/Gifts'
import Vouchers from './pages/Vouchers'
import VoucherDetail from './pages/VoucherDetail'
import Transactions from './pages/Transactions'
import Trade from './pages/Trade'
import Pay from './pages/Pay'

const queryClient = new QueryClient()

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? children : <Navigate to="/login" replace />
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth()
  return !isAuthenticated ? children : <Navigate to="/dashboard" replace />
}

function AuthRoute() {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            {/* Public routes */}
            <Route
              path="login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path="register"
              element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              }
            />

            {/* Private routes */}
            <Route
              path="dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="earn"
              element={
                <PrivateRoute>
                  <Earn />
                </PrivateRoute>
              }
            />
            <Route
              path="transfer"
              element={
                <PrivateRoute>
                  <Transfer />
                </PrivateRoute>
              }
            />
            <Route
              path="redeem"
              element={
                <PrivateRoute>
                  <Redeem />
                </PrivateRoute>
              }
            />
            <Route
              path="gifts"
              element={
                <PrivateRoute>
                  <Gifts />
                </PrivateRoute>
              }
            />
            <Route
              path="vouchers"
              element={
                <PrivateRoute>
                  <Vouchers />
                </PrivateRoute>
              }
            />
            <Route
              path="voucher/:id"
              element={
                <PrivateRoute>
                  <VoucherDetail />
                </PrivateRoute>
              }
            />
            <Route
              path="transactions"
              element={
                <PrivateRoute>
                  <Transactions />
                </PrivateRoute>
              }
            />
            <Route
              path="trade"
              element={
                <PrivateRoute>
                  <Trade />
                </PrivateRoute>
              }
            />
            <Route
              path="pay"
              element={
                <PrivateRoute>
                  <Pay />
                </PrivateRoute>
              }
            />

            {/* Root route */}
            <Route path="/" element={<AuthRoute />} />
            
            {/* Catch all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}