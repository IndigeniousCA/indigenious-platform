/**
 * Medicine Wheel Theme
 * Sacred circle representing the four directions and their teachings
 */

export interface MedicineWheelDirection {
  direction: 'east' | 'south' | 'west' | 'north'
  color: string
  element: string
  season: string
  timeOfDay: string
  stage: string
  animal: string
  teaching: string
  symbol: string
}

export const medicineWheel = {
  east: {
    direction: 'east',
    color: '#EF4444',      // Red
    element: 'fire',
    season: 'spring',
    timeOfDay: 'dawn',
    stage: 'birth',
    animal: 'eagle',
    teaching: 'New beginnings, vision, and illumination',
    symbol: '🌅',
  },
  
  south: {
    direction: 'south',
    color: '#F59E0B',      // Yellow
    element: 'earth',
    season: 'summer',
    timeOfDay: 'midday',
    stage: 'youth',
    animal: 'coyote',
    teaching: 'Growth, trust, and innocence',
    symbol: '☀️',
  },
  
  west: {
    direction: 'west',
    color: '#000000',      // Black
    element: 'water',
    season: 'fall',
    timeOfDay: 'dusk',
    stage: 'adulthood',
    animal: 'bear',
    teaching: 'Introspection, maturity, and strength',
    symbol: '🌑',
  },
  
  north: {
    direction: 'north',
    color: '#FFFFFF',      // White
    element: 'air',
    season: 'winter',
    timeOfDay: 'night',
    stage: 'elder',
    animal: 'buffalo',
    teaching: 'Wisdom, completion, and gratitude',
    symbol: '❄️',
  },
}

export const getMedicineWheelStyles = () => ({
  container: {
    position: 'relative' as const,
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    overflow: 'hidden',
  },
  
  segment: {
    position: 'absolute' as const,
    width: '50%',
    height: '50%',
    transformOrigin: 'bottom right',
  },
  
  east: {
    top: 0,
    left: '50%',
    background: medicineWheel.east.color,
    borderTopRightRadius: '120px',
  },
  
  south: {
    top: '50%',
    left: '50%',
    background: medicineWheel.south.color,
    borderBottomRightRadius: '120px',
  },
  
  west: {
    top: '50%',
    left: 0,
    background: medicineWheel.west.color,
    borderBottomLeftRadius: '120px',
  },
  
  north: {
    top: 0,
    left: 0,
    background: medicineWheel.north.color,
    borderTopLeftRadius: '120px',
  },
  
  center: {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: 'rgba(255, 255, 255, 0.9)',
    transform: 'translate(-50%, -50%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
  },
})

export const getCurrentDirection = (): MedicineWheelDirection => {
  const hour = new Date().getHours()
  
  if (hour >= 5 && hour < 11) return medicineWheel.east as MedicineWheelDirection
  if (hour >= 11 && hour < 17) return medicineWheel.south as MedicineWheelDirection
  if (hour >= 17 && hour < 23) return medicineWheel.west as MedicineWheelDirection
  return medicineWheel.north as MedicineWheelDirection
}

export type MedicineWheel = typeof medicineWheel