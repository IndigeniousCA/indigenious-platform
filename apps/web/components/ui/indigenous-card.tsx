import React from 'react'
import { cn } from '@/lib/utils'

interface IndigenousCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'sacred' | 'elemental' | 'seasonal'
  glow?: boolean
  blur?: 'sm' | 'md' | 'lg' | 'xl'
}

export function IndigenousCard({ 
  className, 
  variant = 'default', 
  glow = false,
  blur = 'md',
  children,
  ...props 
}: IndigenousCardProps) {
  const variants = {
    default: 'bg-white/10 border-white/20',
    sacred: 'bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-400/30',
    elemental: 'bg-gradient-to-br from-blue-500/10 to-teal-500/10 border-teal-400/30',
    seasonal: 'bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-emerald-400/30',
  }

  const blurLevels = {
    sm: 'backdrop-blur-sm',
    md: 'backdrop-blur-md',
    lg: 'backdrop-blur-lg',
    xl: 'backdrop-blur-xl',
  }

  const glowEffect = glow ? 'shadow-[0_0_30px_rgba(59,130,246,0.3)]' : ''

  return (
    <div
      className={cn(
        'rounded-2xl p-6 border transition-all duration-300',
        variants[variant],
        blurLevels[blur],
        glowEffect,
        'hover:border-white/30 hover:bg-white/15',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function IndigenousCardHeader({ 
  className, 
  ...props 
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('mb-4 pb-4 border-b border-white/10', className)}
      {...props}
    />
  )
}

export function IndigenousCardTitle({ 
  className, 
  ...props 
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn(
        'text-2xl font-semibold bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent',
        className
      )}
      {...props}
    />
  )
}

export function IndigenousCardDescription({ 
  className, 
  ...props 
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn('text-white/70 mt-2', className)}
      {...props}
    />
  )
}

export function IndigenousCardContent({ 
  className, 
  ...props 
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('text-white/90', className)}
      {...props}
    />
  )
}

export function IndigenousCardFooter({ 
  className, 
  ...props 
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('mt-4 pt-4 border-t border-white/10', className)}
      {...props}
    />
  )
}