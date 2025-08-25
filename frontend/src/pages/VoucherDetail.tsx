import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { toast } from 'react-hot-toast'
import { Button } from '@/components/atoms/Button'
import { Badge } from '@/components/atoms/Badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/atoms/Card'
import { Gift, QrCode, Share2 } from 'lucide-react'

// Mock data for voucher
const voucher = {
  id: '1',
  title: 'Giảm 50k',
  description: 'Áp dụng cho đơn hàng từ 500k',
  points: 1000,
  expiryDate: '2024-12-31',
  code: 'VOUCHER50K',
  qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=VOUCHER50K',
  isUsed: false,
  isExpired: false,
  terms: [
    'Áp dụng cho đơn hàng từ 500.000đ',
    'Không áp dụng cùng các chương trình khuyến mãi khác',
    'Mỗi khách hàng chỉ được sử dụng 1 lần',
    'Có hiệu lực đến hết ngày 31/12/2024',
  ],
}

export default function VoucherDetail() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)

  const handleUseVoucher = async () => {
    try {
      setIsLoading(true)
      // TODO: Call API to use voucher
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast.success('Sử dụng voucher thành công')
      navigate('/vouchers')
    } catch (error) {
      toast.error('Sử dụng voucher thất bại')
    } finally {
      setIsLoading(false)
    }
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: voucher.title,
          text: voucher.description,
          url: window.location.href,
        })
        .catch(() => {
          toast.error('Không thể chia sẻ voucher')
        })
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success('Đã sao chép link')
    }
  }

  const getStatus = () => {
    if (voucher.isExpired) return { text: 'Hết hạn', variant: 'destructive' as const }
    if (voucher.isUsed) return { text: 'Đã sử dụng', variant: 'secondary' as const }
    return { text: 'Khả dụng', variant: 'success' as const }
  }

  const status = getStatus()

  return (
    <div className="container max-w-mobile space-y-6 p-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold">Chi tiết voucher</h1>
          <p className="text-gray-500">
            Thông tin và cách sử dụng voucher
          </p>
        </div>
        <Button variant="ghost" size="icon" onClick={handleShare}>
          <Share2 className="h-5 w-5" />
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-base font-semibold">
            {voucher.title}
          </CardTitle>
          <Badge variant={status.variant}>{status.text}</Badge>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100">
              <Gift className="h-6 w-6 text-primary-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-500">{voucher.description}</p>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-sm font-medium">
                  {voucher.points.toLocaleString()} điểm
                </span>
                <span className="text-sm text-gray-500">
                  HSD: {new Date(voucher.expiryDate).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Mã voucher</CardTitle>
          <CardDescription>
            Sử dụng mã này để áp dụng voucher
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-center">
            <img
              src={voucher.qrCode}
              alt="QR Code"
              className="h-48 w-48 rounded-lg"
            />
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1 rounded-lg border bg-gray-50 p-3 text-center font-mono text-lg font-semibold">
              {voucher.code}
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                navigator.clipboard.writeText(voucher.code)
                toast.success('Đã sao chép mã')
              }}
            >
              <QrCode className="h-5 w-5" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Điều khoản sử dụng</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-inside list-disc space-y-2 text-sm text-gray-500">
            {voucher.terms.map((term, index) => (
              <li key={index}>{term}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {!voucher.isUsed && !voucher.isExpired && (
        <div className="fixed inset-x-0 bottom-0 border-t bg-white p-4">
          <div className="container flex max-w-mobile gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => navigate(-1)}
            >
              Quay lại
            </Button>
            <Button
              className="flex-1"
              onClick={handleUseVoucher}
              isLoading={isLoading}
            >
              Sử dụng ngay
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}