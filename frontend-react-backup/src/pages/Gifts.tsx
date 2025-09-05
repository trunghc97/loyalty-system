import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/atoms/Button'
import { VoucherGrid } from '@/components/organisms/VoucherGrid'
import { Gift } from 'lucide-react'

// Mock data for gifts
const gifts = [
  {
    id: '1',
    title: 'Thẻ cào 50k',
    description: 'Thẻ cào điện thoại mệnh giá 50.000đ',
    points: 5000,
    expiryDate: '2024-12-31',
  },
  {
    id: '2',
    title: 'Thẻ cào 100k',
    description: 'Thẻ cào điện thoại mệnh giá 100.000đ',
    points: 10000,
    expiryDate: '2024-12-31',
  },
  {
    id: '3',
    title: 'Thẻ cào 200k',
    description: 'Thẻ cào điện thoại mệnh giá 200.000đ',
    points: 20000,
    expiryDate: '2024-12-31',
  },
  {
    id: '4',
    title: 'Thẻ cào 500k',
    description: 'Thẻ cào điện thoại mệnh giá 500.000đ',
    points: 50000,
    expiryDate: '2024-12-31',
  },
]

export default function Gifts() {
  const navigate = useNavigate()

  return (
    <div className="container max-w-mobile space-y-6 p-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold">Quà tặng</h1>
          <p className="text-gray-500">
            Đổi điểm tích lũy lấy quà tặng hấp dẫn
          </p>
        </div>
        <Button onClick={() => navigate('/redeem')}>
          <Gift className="mr-2 h-4 w-4" />
          Đổi quà
        </Button>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Thẻ cào điện thoại</h2>
        <VoucherGrid
          vouchers={gifts.map((gift) => ({
            ...gift,
            isExpired: false,
            isUsed: false,
          }))}
          onRedeem={(id) => navigate(`/redeem?gift=${id}`)}
        />
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Trả nợ thẻ tín dụng</h2>
        <VoucherGrid
          vouchers={[
            {
              id: '5',
              title: 'Trả nợ 500k',
              description: 'Trả nợ thẻ tín dụng 500.000đ',
              points: 50000,
              expiryDate: '2024-12-31',
              isExpired: false,
              isUsed: false,
            },
            {
              id: '6',
              title: 'Trả nợ 1000k',
              description: 'Trả nợ thẻ tín dụng 1.000.000đ',
              points: 100000,
              expiryDate: '2024-12-31',
              isExpired: false,
              isUsed: false,
            },
          ]}
          onRedeem={(id) => navigate(`/redeem?gift=${id}`)}
        />
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Quà tặng khác</h2>
        <VoucherGrid
          vouchers={[
            {
              id: '7',
              title: 'Thẻ game 200k',
              description: 'Thẻ game mệnh giá 200.000đ',
              points: 20000,
              expiryDate: '2024-12-31',
              isExpired: false,
              isUsed: false,
            },
            {
              id: '8',
              title: 'Thẻ game 500k',
              description: 'Thẻ game mệnh giá 500.000đ',
              points: 50000,
              expiryDate: '2024-12-31',
              isExpired: false,
              isUsed: false,
            },
          ]}
          onRedeem={(id) => navigate(`/redeem?gift=${id}`)}
        />
      </div>
    </div>
  )
}