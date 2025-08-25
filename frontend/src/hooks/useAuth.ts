import { create } from 'zustand'
import { persist } from 'zustand/middleware'

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
          const response = await fetch(`${import.meta.env.VITE_API_JAVA}/api/java/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
          })

          if (!response.ok) {
            throw new Error('Login failed')
          }

          const data = await response.json()
          set({ user: data, isAuthenticated: true })
        } catch (error) {
          throw error
        }
      },
      register: async (email, username, password) => {
        try {
          const response = await fetch(`${import.meta.env.VITE_API_JAVA}/api/java/auth/register`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, username, password }),
          })

          if (!response.ok) {
            throw new Error('Registration failed')
          }

          const data = await response.json()
          set({ user: data, isAuthenticated: true })
        } catch (error) {
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