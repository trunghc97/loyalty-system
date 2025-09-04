import { Outlet } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { Navbar } from './Navbar'
import { useAuth } from '@/hooks/useAuth'
import { ChatbotLLM } from '@/components/molecules/ChatbotLLM'

export function Layout() {
  const { isAuthenticated } = useAuth()

  return (
    <div className="min-h-screen bg-gray-50">
      {isAuthenticated && <Navbar />}
      <main
        className={`mx-auto min-h-screen max-w-mobile bg-white ${
          isAuthenticated ? 'pb-32 lg:pb-0 lg:pl-64' : ''
        }`}
      >
        <Outlet />
      </main>
      <Toaster
        position="bottom-center"
        toastOptions={{
          className: 'max-w-mobile',
          duration: 3000,
          style: {
            background: '#333',
            color: '#fff',
          },
        }}
      />
      {isAuthenticated && (
        <ChatbotLLM
          isBubbleMode={true}
        />
      )}
    </div>
  )
}
