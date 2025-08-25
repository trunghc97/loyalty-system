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

const earnSchema = z.object({
  amount: z
    .string()
    .min(1, 'Vui lòng nhập số điểm')
    .transform((val) => parseInt(val, 10))
    .refine((val) => val > 0, 'Số điểm phải lớn hơn 0'),
  description: z.string().min(1, 'Vui lòng nhập lý do'),
})

type EarnForm = z.infer<typeof earnSchema>

export default function Earn() {
  const navigate = useNavigate()
  const { points, earnPoints, isEarning } = usePoints()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EarnForm>({
    resolver: zodResolver(earnSchema),
  })

  const onSubmit = async (data: EarnForm) => {
    try {
      await earnPoints({
        amount: data.amount,
        description: data.description,
      })
      toast.success('Tích điểm thành công')
      navigate('/dashboard')
    } catch (error) {
      toast.error('Tích điểm thất bại')
    }
  }

  return (
    <div className="container max-w-mobile space-y-6 p-4">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Tích điểm</h1>
        <p className="text-gray-500">
          Nhập số điểm và lý do để tích điểm vào tài khoản
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
          <CardTitle>Thông tin tích điểm</CardTitle>
          <CardDescription>
            Điền đầy đủ thông tin bên dưới để tích điểm
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                placeholder="Nhập lý do tích điểm"
                {...register('description')}
                error={!!errors.description}
              />
              {errors.description && (
                <FormMessage>{errors.description.message}</FormMessage>
              )}
            </FormField>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => navigate(-1)}
              >
                Hủy
              </Button>
              <Button type="submit" className="flex-1" isLoading={isEarning}>
                Xác nhận
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
