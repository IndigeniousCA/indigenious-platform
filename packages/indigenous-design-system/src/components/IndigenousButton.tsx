import React, { ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '../utils/cn'

export interface IndigenousButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'sacred' | 'elemental' | 'ghost'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  element?: 'water' | 'earth' | 'fire' | 'air' | 'spirit'
  ripple?: boolean
  glow?: boolean
  fullWidth?: boolean
}

export const IndigenousButton = forwardRef<HTMLButtonElement, IndigenousButtonProps>(
  ({ 
    className,
    variant = 'primary',
    size = 'md',
    element,
    ripple = true,
    glow = false,
    fullWidth = false,
    children,
    disabled,
    onClick,
    ...props
  }, ref) => {
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (ripple && !disabled) {
        const button = e.currentTarget
        const rect = button.getBoundingClientRect()
        const rippleElement = document.createElement('span')
        const diameter = Math.max(button.clientWidth, button.clientHeight)
        const radius = diameter / 2

        rippleElement.style.width = rippleElement.style.height = `${diameter}px`
        rippleElement.style.left = `${e.clientX - rect.left - radius}px`
        rippleElement.style.top = `${e.clientY - rect.top - radius}px`
        rippleElement.style.position = 'absolute'
        rippleElement.style.borderRadius = '50%'
        rippleElement.style.background = 'rgba(255, 255, 255, 0.5)'
        rippleElement.style.transform = 'scale(0)'
        rippleElement.style.animation = 'ripple-animation 0.6s ease-out'
        rippleElement.style.pointerEvents = 'none'

        button.appendChild(rippleElement)

        setTimeout(() => {
          rippleElement.remove()
        }, 600)
      }

      onClick?.(e)
    }

    const baseStyles = 'relative overflow-hidden transition-all duration-300 font-medium rounded-xl inline-flex items-center justify-center'
    
    const variants = {
      primary: 'bg-gradient-to-r from-blue-500 to-teal-500 text-white hover:from-blue-600 hover:to-teal-600 shadow-lg hover:shadow-xl',
      secondary: 'bg-gradient-to-r from-emerald-500 to-green-600 text-white hover:from-emerald-600 hover:to-green-700 shadow-lg hover:shadow-xl',
      sacred: 'bg-gradient-to-br from-purple-600 via-pink-500 to-red-500 text-white hover:from-purple-700 hover:via-pink-600 hover:to-red-600 shadow-lg hover:shadow-xl',
      elemental: 'bg-black/50 backdrop-blur-md border border-white/20 text-white hover:bg-black/60 hover:border-white/30',
      ghost: 'bg-transparent text-white hover:bg-white/10 border border-white/20 hover:border-white/30',
    }

    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
      xl: 'px-8 py-4 text-xl',
    }

    const elementStyles = {
      water: 'bg-gradient-to-r from-blue-400 to-cyan-500 hover:from-blue-500 hover:to-cyan-600',
      earth: 'bg-gradient-to-r from-amber-600 to-orange-700 hover:from-amber-700 hover:to-orange-800',
      fire: 'bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600',
      air: 'bg-gradient-to-r from-gray-400 to-slate-500 hover:from-gray-500 hover:to-slate-600',
      spirit: 'bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700',
    }

    const glowStyles = glow ? 'shadow-[0_0_20px_rgba(59,130,246,0.5)]' : ''
    const fullWidthStyles = fullWidth ? 'w-full' : ''
    const disabledStyles = disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 active:scale-95'

    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          element && elementStyles[element],
          glowStyles,
          fullWidthStyles,
          disabledStyles,
          className
        )}
        disabled={disabled}
        onClick={handleClick}
        {...props}
      >
        {children}
      </button>
    )
  }
)

IndigenousButton.displayName = 'IndigenousButton'