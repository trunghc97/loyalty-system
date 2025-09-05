import { Badge } from '../atoms/Badge'
import { Card, CardContent, CardHeader, CardTitle } from '../atoms/Card'
import { Button } from '../atoms/Button'
import { Gift } from 'lucide-react'

interface VoucherCardProps {
  title: string
  description: string
  points: number
  expiryDate: string
  isExpired?: boolean
  isUsed?: boolean
  onRedeem?: () => void
}

export function VoucherCard({
  title,
  description,
  points,
  expiryDate,
  isExpired,
  isUsed,
  onRedeem,
}: VoucherCardProps) {
  const getStatus = () => {
    if (isExpired) return { text: 'Hết hạn', variant: 'destructive' as const }
    if (isUsed) return { text: 'Đã sử dụng', variant: 'secondary' as const }
    return { text: 'Khả dụng', variant: 'success' as const }
  }

  const status = getStatus()

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-semibold">{title}</CardTitle>
        <Badge variant={status.variant}>{status.text}</Badge>
      </CardHeader>
      <CardContent>
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100">
            <Gift className="h-6 w-6 text-primary-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-500">{description}</p>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-sm font-medium">
                {points.toLocaleString()} điểm
              </span>
              <span className="text-sm text-gray-500">
                HSD: {new Date(expiryDate).toLocaleDateString()}
              </span>
            </div>
            {!isExpired && !isUsed && (
              <Button
                className="mt-4 w-full"
                onClick={onRedeem}
                variant="secondary"
              >
                Đổi ngay
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
