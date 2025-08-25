import { ArrowDownRight, ArrowUpRight, Gift } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { Badge } from '../atoms/Badge'
import { cn } from '@/utils/cn'

type TransactionType = 'EARN' | 'TRANSFER' | 'REDEEM' | 'RECEIVE'

interface TransactionItemProps {
  type: TransactionType
  amount: number
  description: string
  timestamp: string
  status: 'success' | 'pending' | 'failed'
}

const transactionIcons = {
  EARN: <ArrowUpRight className="h-6 w-6 text-green-500" />,
  TRANSFER: <ArrowUpRight className="h-6 w-6 text-red-500" />,
  REDEEM: <Gift className="h-6 w-6 text-primary-500" />,
  RECEIVE: <ArrowDownRight className="h-6 w-6 text-green-500" />,
}

const statusVariants = {
  success: 'success',
  pending: 'warning',
  failed: 'destructive',
} as const

export function TransactionItem({
  type,
  amount,
  description,
  timestamp,
  status,
}: TransactionItemProps) {
  return (
    <div className="flex items-center gap-4 rounded-lg border p-4">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
        {transactionIcons[type]}
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <h3 className="font-medium">{description}</h3>
          <Badge variant={statusVariants[status]}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        </div>
        <div className="mt-1 flex items-center justify-between text-sm text-gray-500">
          <span>{formatDistanceToNow(new Date(timestamp), { addSuffix: true })}</span>
          <span className={cn(
            'font-medium',
            type === 'TRANSFER' ? 'text-red-500' : 'text-green-500'
          )}>
            {type === 'TRANSFER' ? '-' : '+'}{amount.toLocaleString()} points
          </span>
        </div>
      </div>
    </div>
  )
}