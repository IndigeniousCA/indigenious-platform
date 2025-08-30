'use client'

import { useState } from 'react'
import { IndigenousButton } from '@indigenious/design-system'
import { 
  IndigenousCard, 
  IndigenousCardHeader, 
  IndigenousCardTitle, 
  IndigenousCardDescription,
  IndigenousCardContent,
  IndigenousCardFooter 
} from '@/components/ui/indigenous-card'
import { IndigenousInput, IndigenousTextarea } from '@/components/ui/indigenous-input'

export default function IndigenousDemo() {
  const [formData, setFormData] = useState({
    businessName: '',
    community: '',
    description: '',
    category: 'construction'
  })

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-emerald-400 via-teal-500 to-blue-600 bg-clip-text text-transparent">
            Indigenous Procurement Platform
          </h1>
          <p className="text-xl text-white/80">
            Connecting Indigenous businesses with opportunities, honoring tradition through technology
          </p>
        </div>

        {/* Business Registration Form */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <IndigenousCard variant="elemental" glow>
            <IndigenousCardHeader>
              <IndigenousCardTitle>Register Your Business</IndigenousCardTitle>
              <IndigenousCardDescription>
                Join the Indigenous business network and access exclusive procurement opportunities
              </IndigenousCardDescription>
            </IndigenousCardHeader>
            
            <IndigenousCardContent>
              <form className="space-y-4">
                <IndigenousInput
                  label="Business Name"
                  placeholder="Enter your business name"
                  value={formData.businessName}
                  onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                  helperText="Your registered business name"
                />
                
                <IndigenousInput
                  label="Community Affiliation"
                  placeholder="Nation, Band, or Territory"
                  value={formData.community}
                  onChange={(e) => setFormData({...formData, community: e.target.value})}
                  variant="sacred"
                  helperText="Your Indigenous community connection"
                />
                
                <div>
                  <label className="block text-sm font-medium text-white/90 mb-2">
                    Business Category
                  </label>
                  <select 
                    className="w-full px-4 py-2.5 rounded-xl bg-white/10 backdrop-blur-md text-white border border-white/20 focus:outline-none focus:border-blue-400/50"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                  >
                    <option value="construction">Construction</option>
                    <option value="consulting">Consulting</option>
                    <option value="technology">Technology</option>
                    <option value="manufacturing">Manufacturing</option>
                    <option value="services">Professional Services</option>
                  </select>
                </div>
                
                <IndigenousTextarea
                  label="Business Description"
                  placeholder="Tell us about your business and services"
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  helperText="Brief description of your services and expertise"
                />
              </form>
            </IndigenousCardContent>
            
            <IndigenousCardFooter>
              <div className="flex gap-3">
                <IndigenousButton variant="primary" size="lg" fullWidth glow>
                  Register Business
                </IndigenousButton>
                <IndigenousButton variant="ghost" size="lg">
                  Learn More
                </IndigenousButton>
              </div>
            </IndigenousCardFooter>
          </IndigenousCard>

          {/* RFQ Opportunities */}
          <IndigenousCard variant="seasonal">
            <IndigenousCardHeader>
              <IndigenousCardTitle>Active Opportunities</IndigenousCardTitle>
              <IndigenousCardDescription>
                Current RFQs from government and Indigenous organizations
              </IndigenousCardDescription>
            </IndigenousCardHeader>
            
            <IndigenousCardContent>
              <div className="space-y-4">
                {/* RFQ Item 1 */}
                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-white">Highway 16 Maintenance</h4>
                    <span className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded-full">
                      Open
                    </span>
                  </div>
                  <p className="text-sm text-white/70 mb-3">
                    Winter road maintenance contract for Northern BC region
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-white/60">Closes: Dec 15, 2025</span>
                    <IndigenousButton variant="elemental" size="sm">
                      View Details
                    </IndigenousButton>
                  </div>
                </div>

                {/* RFQ Item 2 */}
                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-white">IT Consulting Services</h4>
                    <span className="text-xs px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-full">
                      Closing Soon
                    </span>
                  </div>
                  <p className="text-sm text-white/70 mb-3">
                    Digital transformation consulting for First Nations governance
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-white/60">Closes: Nov 30, 2025</span>
                    <IndigenousButton variant="elemental" size="sm">
                      View Details
                    </IndigenousButton>
                  </div>
                </div>

                {/* RFQ Item 3 */}
                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-white">Cultural Center Construction</h4>
                    <span className="text-xs px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full">
                      New
                    </span>
                  </div>
                  <p className="text-sm text-white/70 mb-3">
                    Design-build contract for new Indigenous cultural facility
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-white/60">Closes: Jan 20, 2026</span>
                    <IndigenousButton variant="elemental" size="sm">
                      View Details
                    </IndigenousButton>
                  </div>
                </div>
              </div>
            </IndigenousCardContent>
            
            <IndigenousCardFooter>
              <IndigenousButton variant="secondary" size="lg" fullWidth glow>
                Browse All Opportunities
              </IndigenousButton>
            </IndigenousCardFooter>
          </IndigenousCard>
        </div>

        {/* Statistics Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <IndigenousCard variant="default">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">3,847</div>
              <div className="text-sm text-white/70">Registered Businesses</div>
            </div>
          </IndigenousCard>
          
          <IndigenousCard variant="default">
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-400 mb-2">$2.8B</div>
              <div className="text-sm text-white/70">Contract Value</div>
            </div>
          </IndigenousCard>
          
          <IndigenousCard variant="default">
            <div className="text-center">
              <div className="text-3xl font-bold text-teal-400 mb-2">630+</div>
              <div className="text-sm text-white/70">First Nations</div>
            </div>
          </IndigenousCard>
          
          <IndigenousCard variant="default">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400 mb-2">12,450</div>
              <div className="text-sm text-white/70">Active RFQs</div>
            </div>
          </IndigenousCard>
        </div>

        {/* Community Features */}
        <IndigenousCard variant="sacred" glow blur="lg">
          <IndigenousCardHeader>
            <IndigenousCardTitle>Community-Driven Procurement</IndigenousCardTitle>
            <IndigenousCardDescription>
              Band councils set their own priorities for evaluating bids
            </IndigenousCardDescription>
          </IndigenousCardHeader>
          
          <IndigenousCardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4">
                <div className="text-4xl mb-3">🌍</div>
                <h4 className="font-semibold text-white mb-2">Environmental Impact</h4>
                <p className="text-sm text-white/70">
                  Prioritize businesses with sustainable practices
                </p>
              </div>
              
              <div className="text-center p-4">
                <div className="text-4xl mb-3">👥</div>
                <h4 className="font-semibold text-white mb-2">Local Employment</h4>
                <p className="text-sm text-white/70">
                  Support businesses that hire from the community
                </p>
              </div>
              
              <div className="text-center p-4">
                <div className="text-4xl mb-3">🎯</div>
                <h4 className="font-semibold text-white mb-2">Cultural Alignment</h4>
                <p className="text-sm text-white/70">
                  Value businesses that understand Indigenous ways
                </p>
              </div>
            </div>
          </IndigenousCardContent>
          
          <IndigenousCardFooter>
            <div className="text-center">
              <p className="text-white/80 mb-4">
                This is not about virtue signaling - it&apos;s about Indigenous communities 
                having control over what matters to them
              </p>
              <IndigenousButton variant="sacred" size="xl" glow>
                Join the Movement
              </IndigenousButton>
            </div>
          </IndigenousCardFooter>
        </IndigenousCard>
      </div>
    </div>
  )
}