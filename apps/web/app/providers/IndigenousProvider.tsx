'use client'

import React, { useEffect } from 'react'
import { useTheme, indigenousTheme, getCurrentSeason, getCurrentDirection } from '@indigenious/design-system'

interface IndigenousProviderProps {
  children: React.ReactNode
}

export function IndigenousProvider({ children }: IndigenousProviderProps) {
  const { theme, season, timeOfDay, direction, applyTheme } = useTheme()
  
  useEffect(() => {
    // Apply theme on mount and changes
    applyTheme()
    
    // Add seasonal class to body
    document.body.className = `season-${season.season} time-${timeOfDay} direction-${direction.direction}`
    
    // Add CSS variables for animations
    document.documentElement.style.setProperty('--aurora-color-1', season.aurora.colors[0] || '#10B981')
    document.documentElement.style.setProperty('--aurora-color-2', season.aurora.colors[1] || '#3B82F6')
    document.documentElement.style.setProperty('--aurora-intensity', String(season.aurora.intensity))
    document.documentElement.style.setProperty('--particle-color', season.particles.color)
    document.documentElement.style.setProperty('--particle-density', String(season.particles.density))
    document.documentElement.style.setProperty('--particle-speed', String(season.particles.speed))
  }, [season, timeOfDay, direction, applyTheme])
  
  return (
    <>
      {/* Background Layers */}
      <div className="fixed inset-0 z-0">
        {/* Video Background (existing river video) */}
        <div className="video-background">
          <video autoPlay muted loop playsInline className="object-cover w-full h-full">
            <source src="/videos/river-flow.mp4" type="video/mp4" />
          </video>
          <div className="video-overlay" />
        </div>
        
        {/* Ecosystem Layers */}
        <div className="ecosystem-background">
          <div className="topographic-layer" />
          <div className="water-flow" />
          <div className="river-current" />
          {season.aurora.active && <div className="aurora-layer" />}
          <div className="mist-layer" />
          <div className="network-layer" id="network-layer" />
          <div className="particle-container" id="particle-container" />
        </div>
      </div>
      
      {/* Seasonal Indicator */}
      <div className="seasonal-indicator">
        <div className="season-label">SEASON</div>
        <div className="season-value">{season.name}</div>
        <div className="growth-stage">{direction.teaching}</div>
      </div>
      
      {/* Ecosystem Health */}
      <div className="ecosystem-health">
        <div className="health-label">ECOSYSTEM</div>
        <div className="health-value">98.7%</div>
      </div>
      
      {/* Medicine Wheel Navigator */}
      <div className="medicine-wheel">
        <div className="wheel-container">
          <div className="wheel-segment wheel-east" title="East - New Beginnings" />
          <div className="wheel-segment wheel-south" title="South - Growth" />
          <div className="wheel-segment wheel-west" title="West - Introspection" />
          <div className="wheel-segment wheel-north" title="North - Wisdom" />
          <div className="wheel-center">{direction.symbol}</div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="relative z-10">
        {children}
      </div>
      
      {/* Particle System Script */}
      <script dangerouslySetInnerHTML={{
        __html: `
          // Particle System
          const particleContainer = document.getElementById('particle-container');
          const particleCount = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--particle-density') || '50');
          const particleSpeed = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--particle-speed') || '0.5');
          
          for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 20 + 's';
            particle.style.animationDuration = (20 / particleSpeed) + 's';
            particleContainer?.appendChild(particle);
          }
          
          // Network Nodes
          const networkLayer = document.getElementById('network-layer');
          const nodeCount = 15;
          
          for (let i = 0; i < nodeCount; i++) {
            const node = document.createElement('div');
            node.className = 'network-node';
            node.style.left = Math.random() * 100 + '%';
            node.style.top = Math.random() * 100 + '%';
            node.style.animationDelay = Math.random() * 4 + 's';
            networkLayer?.appendChild(node);
          }
          
          // Ripple Effect on Click
          document.addEventListener('click', (e) => {
            const ripple = document.createElement('div');
            ripple.className = 'ripple';
            ripple.style.left = e.clientX + 'px';
            ripple.style.top = e.clientY + 'px';
            document.body.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 1500);
          });
        `
      }} />
    </>
  )
}