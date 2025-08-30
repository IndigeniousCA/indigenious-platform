'use client'

import { ReactNode } from 'react'
import { AuthProvider } from '@/contexts/auth-context'
import { ElementalProvider } from '@/contexts/ElementalContext'
import { IndigenousProvider } from './providers/IndigenousProvider'
import { ExactLivingBackground } from '@/components/ExactLivingBackground'
import { MedicineWheel } from '@/components/MedicineWheel'
import { CarbonCrimeCalculator } from '@/components/CarbonCrimeCalculator'
import { MycelialNetwork } from '@/components/MycelialNetwork'
import { PWAInstaller, NetworkMonitor } from '@/components/PWAInstaller'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ElementalProvider>
      <AuthProvider>
        <IndigenousProvider>
          <div className="relative min-h-screen">
            <div className="relative z-10">
              {children}
            </div>
            <PWAInstaller />
            <NetworkMonitor />
          </div>
        </IndigenousProvider>
      </AuthProvider>
    </ElementalProvider>
  )
}