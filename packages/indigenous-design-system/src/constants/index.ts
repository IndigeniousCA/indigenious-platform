export const ELEMENTAL_CATEGORIES = {
  INSTANT: 'instant',
  RAPID: 'rapid',
  DAILY: 'daily',
  CYCLE: 'cycle',
  NETWORK: 'network',
  PERMANENT: 'permanent',
  GENERATIONAL: 'generational',
  SACRED: 'sacred',
} as const

export const ELEMENTS = {
  WATER: 'water',
  EARTH: 'earth',
  FIRE: 'fire',
  AIR: 'air',
  SPIRIT: 'spirit',
  LIFE: 'life',
  ENERGY: 'energy',
  WISDOM: 'wisdom',
} as const

export const PERFORMANCE_MODES = {
  FULL_FOREST: 'full-forest',
  FLOWING_RIVER: 'flowing-river',
  STILL_POND: 'still-pond',
} as const

export const ANIMATION_DURATIONS = {
  instant: 100,
  fast: 200,
  normal: 300,
  slow: 500,
  lazy: 1000,
  eternal: 3000,
} as const

export const BREAKPOINTS = {
  xs: 480,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const

export const Z_INDEX = {
  base: 0,
  dropdown: 10,
  sticky: 20,
  fixed: 30,
  overlay: 40,
  modal: 50,
  popover: 60,
  tooltip: 70,
  notification: 80,
  top: 90,
  maximum: 100,
} as const