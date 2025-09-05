import { useState } from 'react'
import { Button } from '../atoms/Button'
import { TransactionItem } from '../molecules/TransactionItem'

type TransactionType = 'EARN' | 'TRANSFER' | 'REDEEM' | 'RECEIVE'

interface Transaction {
  id: string
  type: TransactionType
  amount: number
  description: string
  timestamp: string
  status: 'success' | 'pending' | 'failed'
}

interface TransactionListProps {
  transactions: Transaction[]
  isLoading?: boolean
}

const filterOptions = [
  { label: 'Tất cả', value: 'ALL' },
  { label: 'Tích điểm', value: 'EARN' },
  { label: 'Chuyển điểm', value: 'TRANSFER' },
  { label: 'Đổi quà', value: 'REDEEM' },
  { label: 'Nhận điểm', value: 'RECEIVE' },
]

export function TransactionList({
  transactions,
  isLoading,
}: TransactionListProps) {
  const [filter, setFilter] = useState('ALL')

  const filteredTransactions = transactions.filter(
    (transaction) => filter === 'ALL' || transaction.type === filter
  )

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="h-20 animate-pulse rounded-lg bg-gray-100"
          />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
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

      {filteredTransactions.length === 0 ? (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <p className="text-gray-500">Không có giao dịch nào</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTransactions.map((transaction) => (
            <TransactionItem key={transaction.id} {...transaction} />
          ))}
        </div>
      )}
    </div>
  )
}
