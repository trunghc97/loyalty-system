import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/atoms/Card'
import { PointsCard } from '@/components/molecules/PointsCard'
import { TransactionList } from '@/components/organisms/TransactionList'
import { VoucherGrid } from '@/components/organisms/VoucherGrid'
import { usePoints } from '@/hooks/usePoints'
import { Gift, Ticket } from 'lucide-react'

export default function Dashboard() {
  const navigate = useNavigate()
  const { points, transactions, isLoading } = usePoints()

  // Mock data for vouchers
  const vouchers = [
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
  ]

  return (
    <div className="container max-w-mobile space-y-6 p-4">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Xin chào!</h1>
        <p className="text-gray-500">
          Chào mừng bạn đến với chương trình Loyalty Points
        </p>
      </div>

      <PointsCard
        points={points}
        onEarn={() => navigate('/earn')}
        onTransfer={() => navigate('/transfer')}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center space-x-4 pb-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100">
              <Gift className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold">Quà tặng</CardTitle>
              <p className="text-sm text-gray-500">Đổi điểm lấy quà</p>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary-600">5</div>
            <p className="text-sm text-gray-500">Quà tặng khả dụng</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center space-x-4 pb-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100">
              <Ticket className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold">Voucher</CardTitle>
              <p className="text-sm text-gray-500">Ưu đãi của bạn</p>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary-600">3</div>
            <p className="text-sm text-gray-500">Voucher chưa sử dụng</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Voucher nổi bật</h2>
        <VoucherGrid
          vouchers={vouchers}
          onRedeem={(id) => navigate(`/voucher/${id}`)}
        />
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Giao dịch gần đây</h2>
        <TransactionList
          transactions={transactions.slice(0, 5)}
          isLoading={isLoading}
        />
      </div>
    </div>
  )
}