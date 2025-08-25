import { HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/utils/cn'

const FormField = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('space-y-2', className)} {...props} />
    )
  }
)
FormField.displayName = 'FormField'

const FormLabel = forwardRef<HTMLLabelElement, HTMLAttributes<HTMLLabelElement>>(
  ({ className, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={cn(
          'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
          className
        )}
        {...props}
      />
    )
  }
)
FormLabel.displayName = 'FormLabel'

const FormDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => {
    return (
      <p
        ref={ref}
        className={cn('text-[0.8rem] text-gray-500', className)}
        {...props}
      />
    )
  }
)
FormDescription.displayName = 'FormDescription'

const FormMessage = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <p
        ref={ref}
        className={cn('text-[0.8rem] font-medium text-red-500', className)}
        {...props}
      >
        {children}
      </p>
    )
  }
)
FormMessage.displayName = 'FormMessage'

export { FormField, FormLabel, FormDescription, FormMessage }
