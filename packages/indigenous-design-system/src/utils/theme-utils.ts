import { indigenousTheme } from '../themes/indigenous-theme'
import { getCurrentSeason, getTimeOfDayTheme } from '../themes/seasonal-themes'
import { getCurrentDirection } from '../themes/medicine-wheel'

export const getThemeColor = (path: string): string => {
  const keys = path.split('.')
  let value: any = indigenousTheme.colors
  
  for (const key of keys) {
    value = value[key]
    if (!value) return '#000000'
  }
  
  return value
}

export const generateGradient = (type: 'linear' | 'radial', colors: string[], angle = 90): string => {
  const colorStops = colors.join(', ')
  
  if (type === 'radial') {
    return `radial-gradient(circle, ${colorStops})`
  }
  
  return `linear-gradient(${angle}deg, ${colorStops})`
}

export const applyOpacity = (color: string, opacity: number): string => {
  if (color.startsWith('#')) {
    const r = parseInt(color.slice(1, 3), 16)
    const g = parseInt(color.slice(3, 5), 16)
    const b = parseInt(color.slice(5, 7), 16)
    return `rgba(${r}, ${g}, ${b}, ${opacity})`
  }
  
  return color
}

export const getCurrentThemeContext = () => ({
  season: getCurrentSeason(),
  timeOfDay: getTimeOfDayTheme(),
  direction: getCurrentDirection(),
  timestamp: new Date().toISOString(),
})

export const generateElementalGlow = (element: string): string => {
  const glows: Record<string, string> = {
    water: '0 0 20px rgba(59, 130, 246, 0.5)',
    earth: '0 0 20px rgba(139, 69, 19, 0.5)',
    fire: '0 0 20px rgba(239, 68, 68, 0.5)',
    air: '0 0 20px rgba(148, 163, 184, 0.5)',
    spirit: '0 0 20px rgba(139, 92, 246, 0.5)',
  }
  
  return glows[element] || '0 0 10px rgba(255, 255, 255, 0.3)'
}