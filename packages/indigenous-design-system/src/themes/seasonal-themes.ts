/**
 * Seasonal Themes - Dynamic themes that change with the seasons
 * Inspired by Indigenous connection to natural cycles
 */

export interface SeasonalTheme {
  name: string
  season: 'spring' | 'summer' | 'fall' | 'winter'
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    surface: string
    text: string
  }
  imagery: {
    pattern: string
    opacity: number
  }
  particles: {
    type: 'rain' | 'snow' | 'leaves' | 'pollen'
    density: number
    speed: number
    color: string
  }
  aurora: {
    active: boolean
    colors: string[]
    intensity: number
  }
}

export const springTheme: SeasonalTheme = {
  name: 'Spring Awakening',
  season: 'spring',
  colors: {
    primary: '#10B981',     // Emerald green
    secondary: '#86efac',   // Light green
    accent: '#fbbf24',      // Amber
    background: '#0f1f1a',  // Dark forest
    surface: '#1a2f28',     // Moss
    text: '#f0fdf4',        // Light mint
  },
  imagery: {
    pattern: 'buds',
    opacity: 0.1,
  },
  particles: {
    type: 'pollen',
    density: 50,
    speed: 0.3,
    color: '#fbbf24',
  },
  aurora: {
    active: true,
    colors: ['#10B981', '#86efac', '#fbbf24'],
    intensity: 0.3,
  },
}

export const summerTheme: SeasonalTheme = {
  name: 'Summer Abundance',
  season: 'summer',
  colors: {
    primary: '#F59E0B',     // Amber
    secondary: '#ef4444',   // Red
    accent: '#3b82f6',      // Blue
    background: '#1a1410',  // Warm earth
    surface: '#2d2416',     // Sunbaked clay
    text: '#fef3c7',        // Warm cream
  },
  imagery: {
    pattern: 'sun',
    opacity: 0.15,
  },
  particles: {
    type: 'rain',
    density: 30,
    speed: 0.8,
    color: '#3b82f6',
  },
  aurora: {
    active: false,
    colors: [],
    intensity: 0,
  },
}

export const fallTheme: SeasonalTheme = {
  name: 'Fall Harvest',
  season: 'fall',
  colors: {
    primary: '#DC2626',     // Red
    secondary: '#ea580c',   // Orange
    accent: '#a16207',      // Brown
    background: '#1f1210',  // Dark amber
    surface: '#3d2418',     // Rust
    text: '#fed7aa',        // Peach
  },
  imagery: {
    pattern: 'leaves',
    opacity: 0.2,
  },
  particles: {
    type: 'leaves',
    density: 40,
    speed: 0.5,
    color: '#ea580c',
  },
  aurora: {
    active: true,
    colors: ['#DC2626', '#ea580c', '#fbbf24'],
    intensity: 0.4,
  },
}

export const winterTheme: SeasonalTheme = {
  name: 'Winter Reflection',
  season: 'winter',
  colors: {
    primary: '#3B82F6',     // Blue
    secondary: '#94a3b8',   // Slate
    accent: '#e5e7eb',      // Gray
    background: '#0a0f1c',  // Deep night
    surface: '#1e293b',     // Slate dark
    text: '#f1f5f9',        // Snow white
  },
  imagery: {
    pattern: 'frost',
    opacity: 0.25,
  },
  particles: {
    type: 'snow',
    density: 60,
    speed: 0.2,
    color: '#ffffff',
  },
  aurora: {
    active: true,
    colors: ['#3B82F6', '#8b5cf6', '#06b6d4'],
    intensity: 0.6,
  },
}

export const seasonalThemes = {
  spring: springTheme,
  summer: summerTheme,
  fall: fallTheme,
  winter: winterTheme,
}

export const getCurrentSeason = (): SeasonalTheme => {
  const month = new Date().getMonth()
  
  if (month >= 2 && month <= 4) return springTheme
  if (month >= 5 && month <= 7) return summerTheme
  if (month >= 8 && month <= 10) return fallTheme
  return winterTheme
}

export const getTimeOfDayTheme = () => {
  const hour = new Date().getHours()
  
  if (hour >= 5 && hour < 8) return 'dawn'
  if (hour >= 8 && hour < 12) return 'morning'
  if (hour >= 12 && hour < 17) return 'afternoon'
  if (hour >= 17 && hour < 20) return 'evening'
  return 'night'
}