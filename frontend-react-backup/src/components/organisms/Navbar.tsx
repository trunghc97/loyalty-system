import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  Home,
  Gift,
  Ticket,
  History,
  Wallet,
  LogOut,
  Menu,
} from 'lucide-react'
import { useState } from 'react'
import { Button } from '../atoms/Button'
import { cn } from '@/utils/cn'
import { useAuth } from '@/hooks/useAuth'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Quà tặng', href: '/gifts', icon: Gift },
  { name: 'Voucher', href: '/vouchers', icon: Ticket },
  { name: 'Giao dịch', href: '/transactions', icon: History },
  { name: 'Blockchain', href: '/trade', icon: Wallet },
]

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-white lg:top-0 lg:border-b lg:border-t-0">
      <div className="mx-auto flex h-16 max-w-mobile items-center justify-between px-4">
        <div className="hidden items-center gap-8 lg:flex">
          <Link to="/" className="text-xl font-bold text-primary-600">
            Loyalty App
          </Link>
          <div className="flex items-center gap-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  'flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors',
                  pathname === item.href
                    ? 'bg-primary-100 text-primary-600'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            ))}
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={() => setIsOpen(!isOpen)}
        >
          <Menu className="h-5 w-5" />
        </Button>

        <div className="hidden items-center gap-4 lg:flex">
          <Button variant="ghost" size="icon" onClick={handleLogout}>
            <LogOut className="h-5 w-5" />
          </Button>
        </div>

        {/* Mobile navigation */}
        <div className="fixed inset-x-0 bottom-16 flex justify-around border-t bg-white p-2 lg:hidden">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                'flex flex-col items-center rounded-lg p-2 text-xs',
                pathname === item.href
                  ? 'text-primary-600'
                  : 'text-gray-600'
              )}
            >
              <item.icon className="mb-1 h-5 w-5" />
              {item.name}
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="flex flex-col items-center rounded-lg p-2 text-xs text-gray-600"
          >
            <LogOut className="mb-1 h-5 w-5" />
            Đăng xuất
          </button>
        </div>
      </div>
    </nav>
  )
}