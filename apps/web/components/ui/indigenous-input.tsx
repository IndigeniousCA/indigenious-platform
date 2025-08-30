import React, { forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface IndigenousInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  icon?: React.ReactNode
  variant?: 'default' | 'sacred' | 'elemental'
}

export const IndigenousInput = forwardRef<HTMLInputElement, IndigenousInputProps>(
  ({ className, label, error, helperText, icon, variant = 'default', ...props }, ref) => {
    const variants = {
      default: 'border-white/20 focus:border-blue-400/50',
      sacred: 'border-purple-400/30 focus:border-purple-400/60',
      elemental: 'border-teal-400/30 focus:border-teal-400/60',
    }

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-white/90 mb-2">
            {label}
          </label>
        )}
        
        <div className="relative">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-white/50">
              {icon}
            </div>
          )}
          
          <input
            ref={ref}
            className={cn(
              'w-full px-4 py-2.5 rounded-xl',
              'bg-white/10 backdrop-blur-md',
              'text-white placeholder-white/40',
              'border transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:ring-blue-400/20 focus:bg-white/15',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              variants[variant],
              icon && 'pl-10',
              error && 'border-red-400/50 focus:border-red-400/60',
              className
            )}
            {...props}
          />
        </div>
        
        {error && (
          <p className="mt-2 text-sm text-red-400">
            {error}
          </p>
        )}
        
        {helperText && !error && (
          <p className="mt-2 text-sm text-white/60">
            {helperText}
          </p>
        )}
      </div>
    )
  }
)

IndigenousInput.displayName = 'IndigenousInput'

export const IndigenousTextarea = forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string
  error?: string
  helperText?: string
  variant?: 'default' | 'sacred' | 'elemental'
}>(
  ({ className, label, error, helperText, variant = 'default', ...props }, ref) => {
    const variants = {
      default: 'border-white/20 focus:border-blue-400/50',
      sacred: 'border-purple-400/30 focus:border-purple-400/60',
      elemental: 'border-teal-400/30 focus:border-teal-400/60',
    }

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-white/90 mb-2">
            {label}
          </label>
        )}
        
        <textarea
          ref={ref}
          className={cn(
            'w-full px-4 py-2.5 rounded-xl',
            'bg-white/10 backdrop-blur-md',
            'text-white placeholder-white/40',
            'border transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-blue-400/20 focus:bg-white/15',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'resize-none min-h-[100px]',
            variants[variant],
            error && 'border-red-400/50 focus:border-red-400/60',
            className
          )}
          {...props}
        />
        
        {error && (
          <p className="mt-2 text-sm text-red-400">
            {error}
          </p>
        )}
        
        {helperText && !error && (
          <p className="mt-2 text-sm text-white/60">
            {helperText}
          </p>
        )}
      </div>
    )
  }
)

IndigenousTextarea.displayName = 'IndigenousTextarea'