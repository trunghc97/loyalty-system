import { Coins } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../atoms/Card'
import { Button } from '../atoms/Button'

interface PointsCardProps {
  points: number
  onEarn?: () => void
  onTransfer?: () => void
}

export function PointsCard({ points, onEarn, onTransfer }: PointsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center space-x-4 pb-2">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100">
          <Coins className="h-6 w-6 text-primary-600" />
        </div>
        <div>
          <CardTitle className="text-base font-semibold">Điểm tích lũy</CardTitle>
          <p className="mt-1 text-2xl font-bold text-primary-600">
            {points.toLocaleString()}
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2">
          <Button onClick={onEarn} className="flex-1" variant="secondary">
            Tích điểm
          </Button>
          <Button onClick={onTransfer} className="flex-1" variant="outline">
            Chuyển điểm
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
