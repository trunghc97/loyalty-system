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

const registerSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
  username: z.string().min(1, 'Vui lòng nhập tên đăng nhập'),
  password: z.string()
    .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
    .max(50, 'Mật khẩu không được quá 50 ký tự'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Mật khẩu xác nhận không khớp",
  path: ["confirmPassword"],
})

type RegisterForm = z.infer<typeof registerSchema>

export default function Register() {
  const navigate = useNavigate()
  const { register: registerUser } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterForm) => {
    try {
      setIsLoading(true)
      await registerUser(data.email, data.username, data.password)
      toast.success('Đăng ký thành công')
      navigate('/dashboard')
    } catch (error) {
      console.error('Registration error:', error)
      toast.error('Đăng ký thất bại. Vui lòng thử lại.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container flex min-h-screen max-w-mobile items-center justify-center">
      <div className="w-full space-y-6 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Đăng ký tài khoản
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Đã có tài khoản?{' '}
            <Link to="/login" className="font-medium text-primary-600">
              Đăng nhập
            </Link>
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormField>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              {...register('email')}
              error={!!errors.email}
            />
            {errors.email && (
              <FormMessage>{errors.email.message}</FormMessage>
            )}
          </FormField>

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

          <FormField>
            <FormLabel>Xác nhận mật khẩu</FormLabel>
            <Input
              type="password"
              {...register('confirmPassword')}
              error={!!errors.confirmPassword}
            />
            {errors.confirmPassword && (
              <FormMessage>{errors.confirmPassword.message}</FormMessage>
            )}
          </FormField>

          <Button type="submit" className="w-full" isLoading={isLoading}>
            Đăng ký
          </Button>
        </form>
      </div>
    </div>
  )
}