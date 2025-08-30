/**
 * Indigenous Design System Theme
 * Inspired by nature, water, and the four directions
 */

export const indigenousTheme = {
  name: 'Indigenous Platform Theme',
  
  colors: {
    // Primary palette - Water & Sky
    primary: {
      50: '#e6f7ff',
      100: '#bae7ff',
      200: '#91d5ff',
      300: '#69c0ff',
      400: '#40a9ff',
      500: '#3B82F6', // Main primary
      600: '#1890ff',
      700: '#096dd9',
      800: '#0050b3',
      900: '#003a8c',
    },
    
    // Secondary palette - Earth & Forest
    secondary: {
      50: '#f0fdf4',
      100: '#dcfce7',
      200: '#bbf7d0',
      300: '#86efac',
      400: '#4ade80',
      500: '#10B981', // Main secondary (Emerald)
      600: '#16a34a',
      700: '#15803d',
      800: '#166534',
      900: '#14532d',
    },
    
    // Accent palette - Aurora & Spirit
    accent: {
      50: '#faf5ff',
      100: '#f3e8ff',
      200: '#e9d5ff',
      300: '#d8b4fe',
      400: '#c084fc',
      500: '#14B8A6', // Teal accent
      600: '#9333ea',
      700: '#7e22ce',
      800: '#6b21a8',
      900: '#581c87',
    },
    
    // Sacred colors
    sacred: {
      red: '#EF4444',     // East - New beginnings
      yellow: '#F59E0B',  // South - Growth
      black: '#000000',   // West - Introspection
      white: '#FFFFFF',   // North - Wisdom
    },
    
    // Elemental colors
    elemental: {
      water: '#3B82F6',
      earth: '#8B4513',
      fire: '#EF4444',
      air: '#94A3B8',
      life: '#10B981',
      energy: '#F59E0B',
      spirit: '#8B5CF6',
      wisdom: '#EC4899',
    },
    
    // Seasonal colors
    seasonal: {
      spring: {
        primary: '#10B981',
        secondary: '#86efac',
        accent: '#fbbf24',
      },
      summer: {
        primary: '#F59E0B',
        secondary: '#ef4444',
        accent: '#3b82f6',
      },
      fall: {
        primary: '#DC2626',
        secondary: '#ea580c',
        accent: '#a16207',
      },
      winter: {
        primary: '#3B82F6',
        secondary: '#94a3b8',
        accent: '#e5e7eb',
      },
    },
    
    // Background gradients
    backgrounds: {
      river: 'linear-gradient(180deg, rgba(0,0,0,0.7) 0%, rgba(0,20,40,0.5) 20%, rgba(0,40,80,0.3) 40%, rgba(10,50,90,0.2) 60%, rgba(0,30,60,0.4) 80%, rgba(0,0,0,0.8) 100%)',
      aurora: 'linear-gradient(180deg, transparent 0%, rgba(16,185,129,0.05) 30%, rgba(20,184,166,0.1) 50%, rgba(59,130,246,0.05) 70%, transparent 100%)',
      mist: 'radial-gradient(circle at 20% 80%, rgba(255,255,255,0.02) 0%, transparent 50%)',
      forest: 'linear-gradient(135deg, #0f172a 0%, #0c4a6e 50%, #065f46 100%)',
      sky: 'linear-gradient(180deg, #0c4a6e 0%, #0284c7 50%, #38bdf8 100%)',
    },
    
    // UI states
    states: {
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      info: '#3B82F6',
    },
    
    // Neutral palette
    neutral: {
      50: '#fafafa',
      100: '#f4f4f5',
      200: '#e4e4e7',
      300: '#d4d4d8',
      400: '#a1a1aa',
      500: '#71717a',
      600: '#52525b',
      700: '#3f3f46',
      800: '#27272a',
      900: '#18181b',
      950: '#09090b',
    },
  },
  
  typography: {
    fonts: {
      display: '-apple-system, "SF Pro Display", system-ui, sans-serif',
      body: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      mono: '"SF Mono", "Monaco", "Inconsolata", monospace',
    },
    
    sizes: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px
      base: '1rem',     // 16px
      lg: '1.125rem',   // 18px
      xl: '1.25rem',    // 20px
      '2xl': '1.5rem',  // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem', // 36px
      '5xl': '3rem',    // 48px
      '6xl': '3.75rem', // 60px
      '7xl': '4.5rem',  // 72px
    },
    
    weights: {
      thin: 100,
      light: 200,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      black: 900,
    },
    
    lineHeights: {
      tight: 1.1,
      snug: 1.2,
      normal: 1.5,
      relaxed: 1.625,
      loose: 2,
    },
  },
  
  spacing: {
    0: '0',
    1: '0.25rem',   // 4px
    2: '0.5rem',    // 8px
    3: '0.75rem',   // 12px
    4: '1rem',      // 16px
    5: '1.25rem',   // 20px
    6: '1.5rem',    // 24px
    8: '2rem',      // 32px
    10: '2.5rem',   // 40px
    12: '3rem',     // 48px
    16: '4rem',     // 64px
    20: '5rem',     // 80px
    24: '6rem',     // 96px
    32: '8rem',     // 128px
  },
  
  borderRadius: {
    none: '0',
    sm: '0.125rem',  // 2px
    base: '0.25rem', // 4px
    md: '0.375rem',  // 6px
    lg: '0.5rem',    // 8px
    xl: '0.75rem',   // 12px
    '2xl': '1rem',   // 16px
    '3xl': '1.5rem', // 24px
    full: '9999px',
  },
  
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
    
    // Elemental shadows with glow
    water: '0 0 20px rgba(59, 130, 246, 0.5)',
    earth: '0 0 20px rgba(139, 69, 19, 0.5)',
    fire: '0 0 20px rgba(239, 68, 68, 0.5)',
    air: '0 0 20px rgba(148, 163, 184, 0.5)',
    spirit: '0 0 20px rgba(139, 92, 246, 0.5)',
  },
  
  animations: {
    // Durations
    durations: {
      instant: '100ms',
      fast: '200ms',
      normal: '300ms',
      slow: '500ms',
      lazy: '1000ms',
      eternal: '3000ms',
    },
    
    // Easings
    easings: {
      linear: 'linear',
      in: 'cubic-bezier(0.4, 0, 1, 1)',
      out: 'cubic-bezier(0, 0, 0.2, 1)',
      inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      elastic: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    },
    
    // Keyframes
    keyframes: {
      ripple: {
        '0%': { transform: 'scale(0)', opacity: 1 },
        '100%': { transform: 'scale(4)', opacity: 0 },
      },
      float: {
        '0%, 100%': { transform: 'translateY(0)' },
        '50%': { transform: 'translateY(-10px)' },
      },
      pulse: {
        '0%, 100%': { opacity: 1 },
        '50%': { opacity: 0.5 },
      },
      shimmer: {
        '0%': { backgroundPosition: '200% 0' },
        '100%': { backgroundPosition: '-200% 0' },
      },
      aurora: {
        '0%, 100%': { transform: 'translateY(0) scaleY(1)', filter: 'blur(20px) hue-rotate(0deg)' },
        '25%': { transform: 'translateY(-5%) scaleY(1.2)', filter: 'blur(30px) hue-rotate(20deg)' },
        '50%': { transform: 'translateY(5%) scaleY(0.9)', filter: 'blur(25px) hue-rotate(-10deg)' },
        '75%': { transform: 'translateY(-5%) scaleY(1.1)', filter: 'blur(35px) hue-rotate(15deg)' },
      },
      waterFlow: {
        '0%, 100%': { transform: 'translate(-50%, -50%) rotate(0deg) scale(1)' },
        '50%': { transform: 'translate(-55%, -45%) rotate(-3deg) scale(0.95)' },
      },
    },
  },
  
  breakpoints: {
    xs: '480px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
  
  zIndex: {
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
  },
}

export type IndigenousTheme = typeof indigenousTheme