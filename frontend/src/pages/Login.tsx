import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'react-hot-toast'
import { Button } from '@/components/atoms/Button'
import { Input } from '@/components/atoms/Input'
import {
  FormField,
  FormLabel,
  FormMessage,
} from '@/components/molecules/FormField'
import { useAuth } from '@/hooks/useAuth'

const loginSchema = z.object({
  username: z.string().min(1, 'Vui lòng nhập tên đăng nhập'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
})

type LoginForm = z.infer<typeof loginSchema>

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginForm) => {
    try {
      setIsLoading(true)
      await login(data.username, data.password)
      toast.success('Đăng nhập thành công')
      navigate('/dashboard')
    } catch (error) {
      toast.error('Đăng nhập thất bại')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container flex min-h-screen max-w-mobile items-center justify-center">
      <div className="w-full space-y-6 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Đăng nhập vào Loyalty App
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Chưa có tài khoản?{' '}
            <Link to="/register" className="font-medium text-primary-600">
              Đăng ký ngay
            </Link>
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormField>
            <FormLabel>Tên đăng nhập</FormLabel>
            <Input
              type="text"
              {...register('username')}
              error={!!errors.username}
            />
            {errors.username && (
              <FormMessage>{errors.username.message}</FormMessage>
            )}
          </FormField>

          <FormField>
            <FormLabel>Mật khẩu</FormLabel>
            <Input
              type="password"
              {...register('password')}
              error={!!errors.password}
            />
            {errors.password && (
              <FormMessage>{errors.password.message}</FormMessage>
            )}
          </FormField>

          <Button type="submit" className="w-full" isLoading={isLoading}>
            Đăng nhập
          </Button>
        </form>
      </div>
    </div>
  )
}