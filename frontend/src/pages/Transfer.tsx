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
import { parseNumber } from '@/utils/number'

const transferSchema = z.object({
  recipient: z.string().min(1, 'Vui lòng nhập người nhận'),
  amount: z
    .string()
    .min(1, 'Vui lòng nhập số điểm')
    .transform((val) => parseInt(val, 10))
    .refine((val) => val > 0, 'Số điểm phải lớn hơn 0'),
  description: z.string().min(1, 'Vui lòng nhập lý do'),
  otp: z.string().length(6, 'Mã OTP phải có 6 số'),
})

type TransferForm = z.infer<typeof transferSchema>

export default function Transfer() {
  const navigate = useNavigate()
  const { points, transferPoints, isTransferring } = usePoints()
  const [showOTP, setShowOTP] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<TransferForm>({
    resolver: zodResolver(transferSchema),
  })

  const amount = parseNumber(watch('amount') || '0')

  const onSubmit = async (data: TransferForm) => {
    if (!showOTP) {
      // Simulate sending OTP
      toast.success('Mã OTP đã được gửi')
      setShowOTP(true)
      return
    }

    try {
      await transferPoints({
        recipient: data.recipient,
        amount: data.amount,
        description: data.description,
      })
      toast.success('Chuyển điểm thành công')
      navigate('/dashboard')
    } catch (error) {
      toast.error('Chuyển điểm thất bại')
    }
  }

  return (
    <div className="container max-w-mobile space-y-6 p-4">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Chuyển điểm</h1>
        <p className="text-gray-500">
          Chuyển điểm cho người dùng khác trong hệ thống
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
              Số dư sau khi chuyển:{' '}
              <span className="font-medium">
                {(points - amount).toLocaleString()} điểm
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Thông tin chuyển điểm</CardTitle>
          <CardDescription>
            Điền đầy đủ thông tin bên dưới để chuyển điểm
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormField>
              <FormLabel>Người nhận</FormLabel>
              <Input
                type="text"
                placeholder="Nhập tên đăng nhập người nhận"
                {...register('recipient')}
                error={!!errors.recipient}
              />
              {errors.recipient && (
                <FormMessage>{errors.recipient.message}</FormMessage>
              )}
            </FormField>

            <FormField>
              <FormLabel>Số điểm</FormLabel>
              <Input
                type="number"
                placeholder="Nhập số điểm"
                {...register('amount')}
                error={!!errors.amount}
              />
              {errors.amount && (
                <FormMessage>{errors.amount.message}</FormMessage>
              )}
            </FormField>

            <FormField>
              <FormLabel>Lý do</FormLabel>
              <Input
                type="text"
                placeholder="Nhập lý do chuyển điểm"
                {...register('description')}
                error={!!errors.description}
              />
              {errors.description && (
                <FormMessage>{errors.description.message}</FormMessage>
              )}
            </FormField>

            {showOTP && (
              <FormField>
                <FormLabel>Mã OTP</FormLabel>
                <Input
                  type="text"
                  placeholder="Nhập mã OTP"
                  maxLength={6}
                  {...register('otp')}
                  error={!!errors.otp}
                />
                {errors.otp && <FormMessage>{errors.otp.message}</FormMessage>}
              </FormField>
            )}

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => navigate(-1)}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                className="flex-1"
                isLoading={isTransferring}
              >
                {showOTP ? 'Xác nhận' : 'Tiếp tục'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}