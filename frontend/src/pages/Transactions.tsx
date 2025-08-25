import { useState } from 'react'
import { Button } from '@/components/atoms/Button'
import { Input } from '@/components/atoms/Input'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/atoms/Card'
import { TransactionList } from '@/components/organisms/TransactionList'
import { usePoints } from '@/hooks/usePoints'
import { Calendar } from 'lucide-react'

export default function Transactions() {
  const { points, transactions, isLoading } = usePoints()
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const filteredTransactions = transactions.filter((transaction) => {
    if (!startDate && !endDate) return true

    const transactionDate = new Date(transaction.timestamp)
    const start = startDate ? new Date(startDate) : null
    const end = endDate ? new Date(endDate) : null

    if (start && end) {
      return transactionDate >= start && transactionDate <= end
    }

    if (start) {
      return transactionDate >= start
    }

    if (end) {
      return transactionDate <= end
    }

    return true
  })

  return (
    <div className="container max-w-mobile space-y-6 p-4">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Lịch sử giao dịch</h1>
        <p className="text-gray-500">
          Xem lại các giao dịch điểm của bạn
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
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Lọc theo thời gian</CardTitle>
          <CardDescription>
            Chọn khoảng thời gian để xem giao dịch
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Từ ngày</label>
              <div className="relative">
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
                <Calendar className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Đến ngày</label>
              <div className="relative">
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
                <Calendar className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              </div>
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                setStartDate('')
                setEndDate('')
              }}
            >
              Đặt lại
            </Button>
            <Button className="flex-1">Lọc</Button>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Danh sách giao dịch</h2>
          <span className="text-sm text-gray-500">
            {filteredTransactions.length} giao dịch
          </span>
        </div>
        <TransactionList
          transactions={filteredTransactions}
          isLoading={isLoading}
        />
      </div>
    </div>
  )
}