import { VoucherCard } from '../molecules/VoucherCard'

interface Voucher {
  id: string
  title: string
  description: string
  points: number
  expiryDate: string
  isExpired?: boolean
  isUsed?: boolean
}

interface VoucherGridProps {
  vouchers: Voucher[]
  isLoading?: boolean
  onRedeem?: (id: string) => void
}

export function VoucherGrid({
  vouchers,
  isLoading,
  onRedeem,
}: VoucherGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="h-48 animate-pulse rounded-lg bg-gray-100"
          />
        ))}
      </div>
    )
  }

  if (vouchers.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center">
        <p className="text-gray-500">Không có voucher nào</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {vouchers.map((voucher) => (
        <VoucherCard
          key={voucher.id}
          {...voucher}
          onRedeem={() => onRedeem?.(voucher.id)}
        />
      ))}
    </div>
  )
}
