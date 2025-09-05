export const API_URL = import.meta.env.VITE_API_JAVA || ''
export const API_GO_URL = import.meta.env.VITE_API_GO || ''

export const API_ENDPOINTS = {
  auth: {
    login: `${API_URL}/auth/login`,
    register: `${API_URL}/auth/register`,
  },
  points: {
    get: `${API_URL}/points`,
    earn: `${API_URL}/points/earn`,
    transfer: `${API_URL}/points/transfer`,
  },
  transactions: `${API_URL}/transactions`,
  gifts: `${API_URL}/gifts`,
  vouchers: `${API_URL}/vouchers`,
}
