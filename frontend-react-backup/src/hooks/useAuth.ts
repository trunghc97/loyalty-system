import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { login as loginApi, register as registerApi } from '@/services/api'

interface User {
  id: string
  username: string
  email: string
  token: string
}

interface AuthState {
  user: User | null
  setUser: (user: User | null) => void
  isAuthenticated: boolean
  login: (username: string, password: string) => Promise<void>
  register: (email: string, username: string, password: string) => Promise<void>
  logout: () => void
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      login: async (username, password) => {
        try {
          const response = await loginApi({ username: username, password })
          set({ user: response.data, isAuthenticated: true })
        } catch (error) {
          throw error
        }
      },
      register: async (email, username, password) => {
        try {
          console.log('Starting registration process...')
          console.log('Data:', { email, username, password: '***' })
          const response = await registerApi({ email, username, password })
          console.log('Registration successful:', response.data)
          set({ user: response.data, isAuthenticated: true })
        } catch (error) {
          console.error('Registration failed:', error)
          throw error
        }
      },
      logout: () => {
        set({ user: null, isAuthenticated: false })
      },
    }),
    {
      name: 'auth-storage',
    }
  )
)