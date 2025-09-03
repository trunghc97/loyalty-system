import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'react-hot-toast'
import { Button } from '@/components/atoms/Button'
import { Input } from '@/components/atoms/Input'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/atoms/Card'
import {
  FormField,
  FormLabel,
  FormMessage,
} from '@/components/molecules/FormField'
import { usePoints } from '@/hooks/usePoints'
import { ExternalLink } from 'lucide-react'
import { parseNumber } from '@/utils/number'
import { tradePoints } from '@/services/api'

const tradeSchema = z.object({
  amount: z
    .string()
    .min(1, 'Vui lòng nhập số điểm')
    .transform((val) => parseInt(val, 10))
    .refine((val) => val > 0, 'Số điểm phải lớn hơn 0'),
  walletAddress: z
    .string()
    .min(1, 'Vui lòng nhập địa chỉ ví')
    .regex(/^0x[a-fA-F0-9]{40}$/, 'Địa chỉ ví không hợp lệ'),
})

type TradeForm = z.infer<typeof tradeSchema>

export default function Trade() {
  const navigate = useNavigate()
  const { points } = usePoints()
  const [isLoading, setIsLoading] = useState(false)
  const [txHash, setTxHash] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<TradeForm>({
    resolver: zodResolver(tradeSchema),
  })

  const amount = parseNumber(watch('amount') || '0')

  const onSubmit = async (data: TradeForm) => {
    try {
      setIsLoading(true)
      const response = await tradePoints({ amount: data.amount })
      setTxHash(response.data.blockchainTx)
      toast.success('Giao dịch thành công')
    } catch (error) {
      toast.error('Giao dịch thất bại')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container max-w-mobile space-y-6 p-4">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Đổi điểm lấy token</h1>
        <p className="text-gray-500">
          Chuyển đổi điểm thưởng thành token trên blockchain
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
          {amount > 0 && (
            <div className="mt-2 text-sm text-gray-500">
              Số dư sau khi đổi:{' '}
              <span className="font-medium">
                {(points - amount).toLocaleString()} điểm
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Thông tin giao dịch</CardTitle>
          <CardDescription>
            Điền thông tin để đổi điểm thành token
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormField>
              <FormLabel>Số điểm</FormLabel>
              <Input
                type="number"
                placeholder="Nhập số điểm muốn đổi"
                {...register('amount')}
                error={!!errors.amount}
              />
              {errors.amount && (
                <FormMessage>{errors.amount.message}</FormMessage>
              )}
            </FormField>

            <FormField>
              <FormLabel>Địa chỉ ví</FormLabel>
              <Input
                type="text"
                placeholder="Nhập địa chỉ ví (0x...)"
                {...register('walletAddress')}
                error={!!errors.walletAddress}
              />
              {errors.walletAddress && (
                <FormMessage>{errors.walletAddress.message}</FormMessage>
              )}
            </FormField>

            {txHash ? (
              <div className="rounded-lg border bg-gray-50 p-4">
                <h3 className="font-medium">Thông tin giao dịch</h3>
                <div className="mt-2 break-all text-sm text-gray-500">
                  Transaction Hash: {txHash}
                </div>
                <a
                  href={`https://etherscan.io/tx/${txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center text-sm text-primary-600 hover:underline"
                >
                  Xem trên Etherscan
                  <ExternalLink className="ml-1 h-4 w-4" />
                </a>
              </div>
            ) : (
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => navigate(-1)}
                >
                  Hủy
                </Button>
                <Button type="submit" className="flex-1" isLoading={isLoading}>
                  Xác nhận
                </Button>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  )
}