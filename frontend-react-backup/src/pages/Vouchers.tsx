import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/atoms/Button'
import { VoucherGrid } from '@/components/organisms/VoucherGrid'

// Mock data for vouchers
const vouchers = [
  {
    id: '1',
    title: 'Giảm 50k',
    description: 'Áp dụng cho đơn hàng từ 500k',
    points: 1000,
    expiryDate: '2024-12-31',
    isUsed: false,
  },
  {
    id: '2',
    title: 'Freeship',
    description: 'Miễn phí vận chuyển toàn quốc',
    points: 500,
    expiryDate: '2024-12-31',
    isUsed: true,
  },
  {
    id: '3',
    title: 'Giảm 100k',
    description: 'Áp dụng cho đơn hàng từ 1000k',
    points: 2000,
    expiryDate: '2024-12-31',
    isExpired: true,
  },
]

const filterOptions = [
  { label: 'Tất cả', value: 'all' },
  { label: 'Chưa sử dụng', value: 'unused' },
  { label: 'Đã sử dụng', value: 'used' },
  { label: 'Hết hạn', value: 'expired' },
]

export default function Vouchers() {
  const navigate = useNavigate()
  const [filter, setFilter] = useState('all')

  const filteredVouchers = vouchers.filter((voucher) => {
    switch (filter) {
      case 'unused':
        return !voucher.isUsed && !voucher.isExpired
      case 'used':
        return voucher.isUsed
      case 'expired':
        return voucher.isExpired
      default:
        return true
    }
  })

  return (
    <div className="container max-w-mobile space-y-6 p-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold">Voucher của tôi</h1>
          <p className="text-gray-500">
            Quản lý và sử dụng voucher của bạn
          </p>
        </div>
        <Button onClick={() => navigate('/redeem')}>Đổi voucher</Button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {filterOptions.map((option) => (
          <Button
            key={option.value}
            variant={filter === option.value ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter(option.value)}
          >
            {option.label}
          </Button>
        ))}
      </div>

      <VoucherGrid
        vouchers={filteredVouchers}
        onRedeem={(id) => navigate(`/voucher/${id}`)}
      />
    </div>
  )
}