import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { Button } from '@/components/atoms/Button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/atoms/Card'
import { VoucherGrid } from '@/components/organisms/VoucherGrid'
import { usePoints } from '@/hooks/usePoints'

// Mock data for available rewards
const rewards = [
  {
    id: '1',
    title: 'Giảm 50k',
    description: 'Áp dụng cho đơn hàng từ 500k',
    points: 1000,
    expiryDate: '2024-12-31',
  },
  {
    id: '2',
    title: 'Freeship',
    description: 'Miễn phí vận chuyển toàn quốc',
    points: 500,
    expiryDate: '2024-12-31',
  },
  {
    id: '3',
    title: 'Giảm 100k',
    description: 'Áp dụng cho đơn hàng từ 1000k',
    points: 2000,
    expiryDate: '2024-12-31',
  },
  {
    id: '4',
    title: 'Hoàn tiền 5%',
    description: 'Hoàn tiền cho mọi giao dịch',
    points: 5000,
    expiryDate: '2024-12-31',
  },
]

export default function Redeem() {
  const navigate = useNavigate()
  const { points } = usePoints()
  const [selectedReward, setSelectedReward] = useState<string | null>(null)

  const handleRedeem = async (id: string) => {
    const reward = rewards.find((r) => r.id === id)
    if (!reward) return

    if (points < reward.points) {
      toast.error('Số điểm không đủ')
      return
    }

    try {
      // TODO: Call API to redeem reward
      toast.success('Đổi thưởng thành công')
      navigate('/vouchers')
    } catch (error) {
      toast.error('Đổi thưởng thất bại')
    }
  }

  return (
    <div className="container max-w-mobile space-y-6 p-4">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Đổi thưởng</h1>
        <p className="text-gray-500">
          Đổi điểm tích lũy lấy voucher hoặc quà tặng
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Số dư hiện tại</CardTitle>
          <CardDescription>
            Số điểm hiện có trong tài khoản của bạn
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-primary-600">
            {points.toLocaleString()} điểm
          </div>
          {selectedReward && (
            <div className="mt-2 text-sm text-gray-500">
              Số dư sau khi đổi:{' '}
              <span className="font-medium">
                {(
                  points -
                  (rewards.find((r) => r.id === selectedReward)?.points || 0)
                ).toLocaleString()}{' '}
                điểm
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Phần thưởng khả dụng</h2>
        <VoucherGrid
          vouchers={rewards.map((reward) => ({
            ...reward,
            isExpired: false,
            isUsed: false,
          }))}
          onRedeem={handleRedeem}
        />
      </div>

      {selectedReward && (
        <div className="fixed inset-x-0 bottom-0 border-t bg-white p-4">
          <div className="container flex max-w-mobile gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setSelectedReward(null)}
            >
              Hủy
            </Button>
            <Button
              className="flex-1"
              onClick={() => handleRedeem(selectedReward)}
            >
              Xác nhận đổi
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
