import { useState, useEffect } from 'react'
import { indigenousTheme } from '../themes/indigenous-theme'
import { getCurrentSeason, getTimeOfDayTheme } from '../themes/seasonal-themes'
import { getCurrentDirection } from '../themes/medicine-wheel'

export const useTheme = () => {
  const [theme] = useState(indigenousTheme)
  const [season, setSeason] = useState(getCurrentSeason())
  const [timeOfDay, setTimeOfDay] = useState(getTimeOfDayTheme())
  const [direction, setDirection] = useState(getCurrentDirection())

  useEffect(() => {
    const updateTheme = () => {
      setSeason(getCurrentSeason())
      setTimeOfDay(getTimeOfDayTheme())
      setDirection(getCurrentDirection())
    }

    updateTheme()
    
    // Update every minute
    const interval = setInterval(updateTheme, 60000)
    
    return () => clearInterval(interval)
  }, [])

  const applyTheme = (element: HTMLElement = document.documentElement) => {
    // Apply CSS variables
    Object.entries(theme.colors.primary).forEach(([key, value]) => {
      element.style.setProperty(`--color-primary-${key}`, value)
    })
    
    Object.entries(theme.colors.secondary).forEach(([key, value]) => {
      element.style.setProperty(`--color-secondary-${key}`, value)
    })
    
    Object.entries(theme.colors.elemental).forEach(([key, value]) => {
      element.style.setProperty(`--color-${key}`, value)
    })
    
    // Apply seasonal colors
    element.style.setProperty('--season-primary', season.colors.primary)
    element.style.setProperty('--season-secondary', season.colors.secondary)
    element.style.setProperty('--season-accent', season.colors.accent)
  }

  return {
    theme,
    season,
    timeOfDay,
    direction,
    applyTheme,
  }
}