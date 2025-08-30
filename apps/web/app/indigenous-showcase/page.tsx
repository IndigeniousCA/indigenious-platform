'use client'

import { IndigenousButton } from '@indigenious/design-system'
import { useState } from 'react'

export default function IndigenousShowcase() {
  const [selectedElement, setSelectedElement] = useState<string>('water')
  
  return (
    <div className="min-h-screen p-8">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto mb-16">
        <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-teal-500 to-emerald-600 bg-clip-text text-transparent">
          Indigenous Design System
        </h1>
        <p className="text-xl text-white/80">
          A beautiful, culturally-inspired design system honoring Indigenous wisdom and connection to nature
        </p>
      </div>

      {/* Button Showcase */}
      <section className="max-w-7xl mx-auto mb-16">
        <h2 className="text-3xl font-semibold mb-8 text-white">Sacred Buttons</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Primary Variants */}
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
            <h3 className="text-lg font-medium mb-4 text-white/90">Primary Actions</h3>
            <div className="space-y-3">
              <IndigenousButton variant="primary" size="sm" fullWidth>
                Small River Flow
              </IndigenousButton>
              <IndigenousButton variant="primary" size="md" fullWidth>
                Medium Stream
              </IndigenousButton>
              <IndigenousButton variant="primary" size="lg" fullWidth glow>
                Large Ocean Wave
              </IndigenousButton>
              <IndigenousButton variant="primary" size="xl" fullWidth glow>
                Extra Large Tide
              </IndigenousButton>
            </div>
          </div>

          {/* Secondary Variants */}
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
            <h3 className="text-lg font-medium mb-4 text-white/90">Forest Actions</h3>
            <div className="space-y-3">
              <IndigenousButton variant="secondary" size="sm" fullWidth>
                Seedling
              </IndigenousButton>
              <IndigenousButton variant="secondary" size="md" fullWidth>
                Growing Tree
              </IndigenousButton>
              <IndigenousButton variant="secondary" size="lg" fullWidth glow>
                Ancient Forest
              </IndigenousButton>
              <IndigenousButton variant="secondary" size="xl" fullWidth glow>
                Sacred Grove
              </IndigenousButton>
            </div>
          </div>

          {/* Sacred Variants */}
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
            <h3 className="text-lg font-medium mb-4 text-white/90">Sacred Actions</h3>
            <div className="space-y-3">
              <IndigenousButton variant="sacred" size="sm" fullWidth>
                Morning Ceremony
              </IndigenousButton>
              <IndigenousButton variant="sacred" size="md" fullWidth>
                Sacred Circle
              </IndigenousButton>
              <IndigenousButton variant="sacred" size="lg" fullWidth glow>
                Spirit Dance
              </IndigenousButton>
              <IndigenousButton variant="sacred" size="xl" fullWidth glow>
                Elder Wisdom
              </IndigenousButton>
            </div>
          </div>
        </div>
      </section>

      {/* Elemental Buttons */}
      <section className="max-w-7xl mx-auto mb-16">
        <h2 className="text-3xl font-semibold mb-8 text-white">Elemental Powers</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <IndigenousButton 
            element="water" 
            onClick={() => setSelectedElement('water')}
            glow={selectedElement === 'water'}
          >
            💧 Water
          </IndigenousButton>
          <IndigenousButton 
            element="earth" 
            onClick={() => setSelectedElement('earth')}
            glow={selectedElement === 'earth'}
          >
            🌍 Earth
          </IndigenousButton>
          <IndigenousButton 
            element="fire" 
            onClick={() => setSelectedElement('fire')}
            glow={selectedElement === 'fire'}
          >
            🔥 Fire
          </IndigenousButton>
          <IndigenousButton 
            element="air" 
            onClick={() => setSelectedElement('air')}
            glow={selectedElement === 'air'}
          >
            💨 Air
          </IndigenousButton>
          <IndigenousButton 
            element="spirit" 
            onClick={() => setSelectedElement('spirit')}
            glow={selectedElement === 'spirit'}
          >
            ✨ Spirit
          </IndigenousButton>
        </div>
        
        {selectedElement && (
          <div className="mt-8 p-6 bg-white/5 backdrop-blur-md rounded-2xl border border-white/20">
            <p className="text-white/90">
              <span className="font-semibold capitalize">{selectedElement}</span> element selected - 
              {selectedElement === 'water' && ' Flowing with adaptability and cleansing energy'}
              {selectedElement === 'earth' && ' Grounded in stability and nurturing strength'}
              {selectedElement === 'fire' && ' Burning with transformation and passionate purpose'}
              {selectedElement === 'air' && ' Moving with clarity and freedom of thought'}
              {selectedElement === 'spirit' && ' Connected to the sacred wisdom of all relations'}
            </p>
          </div>
        )}
      </section>

      {/* Ghost and Elemental Variants */}
      <section className="max-w-7xl mx-auto mb-16">
        <h2 className="text-3xl font-semibold mb-8 text-white">Subtle Actions</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
            <h3 className="text-lg font-medium mb-4 text-white/90">Ghost Buttons</h3>
            <div className="space-y-3">
              <IndigenousButton variant="ghost" size="md" fullWidth>
                Whisper of the Wind
              </IndigenousButton>
              <IndigenousButton variant="ghost" size="lg" fullWidth>
                Shadow of the Mountain
              </IndigenousButton>
            </div>
          </div>
          
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
            <h3 className="text-lg font-medium mb-4 text-white/90">Elemental Glass</h3>
            <div className="space-y-3">
              <IndigenousButton variant="elemental" size="md" fullWidth>
                Crystal Clear Water
              </IndigenousButton>
              <IndigenousButton variant="elemental" size="lg" fullWidth glow>
                Aurora Borealis
              </IndigenousButton>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Demo */}
      <section className="max-w-7xl mx-auto mb-16">
        <h2 className="text-3xl font-semibold mb-8 text-white">Medicine Wheel Journey</h2>
        
        <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <IndigenousButton 
                variant="sacred" 
                size="lg" 
                fullWidth
                style={{ background: 'linear-gradient(135deg, #EF4444, #DC2626)' }}
              >
                🌅 East
              </IndigenousButton>
              <p className="text-sm text-white/60 mt-2">New Beginnings</p>
            </div>
            
            <div className="text-center">
              <IndigenousButton 
                variant="sacred" 
                size="lg" 
                fullWidth
                style={{ background: 'linear-gradient(135deg, #F59E0B, #D97706)' }}
              >
                ☀️ South
              </IndigenousButton>
              <p className="text-sm text-white/60 mt-2">Growth & Trust</p>
            </div>
            
            <div className="text-center">
              <IndigenousButton 
                variant="sacred" 
                size="lg" 
                fullWidth
                style={{ background: 'linear-gradient(135deg, #1F2937, #111827)' }}
              >
                🌑 West
              </IndigenousButton>
              <p className="text-sm text-white/60 mt-2">Introspection</p>
            </div>
            
            <div className="text-center">
              <IndigenousButton 
                variant="sacred" 
                size="lg" 
                fullWidth
                style={{ background: 'linear-gradient(135deg, #F3F4F6, #E5E7EB)' }}
                className="!text-gray-900"
              >
                ❄️ North
              </IndigenousButton>
              <p className="text-sm text-white/60 mt-2">Wisdom</p>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-white/80 mb-4">
              The Medicine Wheel teaches us about the cycles of life and our connection to all directions
            </p>
            <IndigenousButton variant="primary" size="lg" glow>
              Begin Your Journey
            </IndigenousButton>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="max-w-7xl mx-auto text-center">
        <div className="bg-gradient-to-br from-blue-500/20 via-teal-500/20 to-emerald-500/20 backdrop-blur-md rounded-3xl p-12 border border-white/20">
          <h2 className="text-4xl font-bold mb-4 text-white">
            Honoring Indigenous Wisdom Through Design
          </h2>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Every element in this design system reflects the deep connection between technology and nature, 
            guided by Indigenous teachings and respect for the land.
          </p>
          <div className="flex gap-4 justify-center">
            <IndigenousButton variant="primary" size="xl" glow>
              Explore the Platform
            </IndigenousButton>
            <IndigenousButton variant="ghost" size="xl">
              Learn More
            </IndigenousButton>
          </div>
        </div>
      </section>
    </div>
  )
}