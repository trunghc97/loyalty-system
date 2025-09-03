import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth-storage')
    if (token) {
      const user = JSON.parse(token)?.state?.user
      if (user?.token) {
        config.headers.Authorization = `Bearer ${user.token}`
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Add a response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('auth-storage')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

import { EncryptionService } from './encryption'

// Auth APIs
export const getPublicKey = () => api.get('/auth/public-key')

export const login = async (data: { username: string; password: string }) => {
  const { data: { publicKey } } = await getPublicKey()
  const encryptedPassword = await EncryptionService.encrypt(publicKey, data.password)
  return api.post('/auth/login', {
    username: data.username,
    password: encryptedPassword
  })
}

export const register = async (data: { email: string; username: string; password: string }) => {
  try {
    console.log('Getting public key...')
    const publicKeyResponse = await getPublicKey()
    console.log('Public key response:', publicKeyResponse)

    const publicKey = publicKeyResponse.data.publicKey
    console.log('Encrypting password...')
    const encryptedPassword = await EncryptionService.encrypt(publicKey, data.password)
    console.log('Password encrypted successfully')

    console.log('Sending registration request...')
    const response = await api.post('/auth/register', {
      email: data.email,
      username: data.username,
      password: encryptedPassword
    })
    console.log('Registration response:', response)
    return response
  } catch (error) {
    console.error('Registration error:', error)
    throw error
  }
}

// Points APIs
export const getBalance = () => 
  api.get('/points/balance')

export const getTransactionHistory = () =>
  api.get('/points/history')

export const earnPoints = (data: { amount: number; description: string }) =>
  api.post('/points/earn', data)

export const redeemPoints = (data: { amount: number; description: string }) =>
  api.post('/points/redeem', data)

export const transferPoints = (toUserId: string, data: { amount: number; description: string }) =>
  api.post(`/points/transfer/${toUserId}`, data)

export const tradePoints = (data: { amount: number }) =>
  api.post('/points/trade', data)

export const payWithPoints = (data: { amount: number }) =>
  api.post('/points/pay', data)

export default api