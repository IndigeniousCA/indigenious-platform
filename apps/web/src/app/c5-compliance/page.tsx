import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  AlertTriangle, 
  CheckCircle2, 
  TrendingUp,
  Building2,
  Users,
  Shield,
  ArrowRight,
  DollarSign,
  FileWarning,
  Zap
} from 'lucide-react';

export default function C5ComplianceLandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Critical Alert Banner */}
      <div className="bg-red-600 text-white py-3 px-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            <span className="font-medium">
              Bill C-5 is NOW in effect - 5% Indigenous procurement is MANDATORY for federal contractors
            </span>
          </div>
          <Link href="/dashboard/compliance">
            <Button size="sm" variant="secondary">
              Check Your Compliance →
            </Button>
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <Badge className="mb-4 bg-blue-100 text-blue-900">
            THE OFFICIAL C-5 COMPLIANCE PLATFORM
          </Badge>
          
          <h1 className="text-5xl font-bold mb-6">
            Don't Lose Your Government Contracts
          </h1>
          
          <p className="text-xl text-gray-700 mb-8">
            Bill C-5 requires 5% Indigenous procurement. Non-compliance means 
            <span className="font-bold text-red-600"> losing federal contracts worth millions</span>.
            We're the only platform that ensures you stay compliant.
          </p>

          <div className="flex gap-4 justify-center mb-8">
            <Link href="/dashboard/compliance">
              <Button size="lg" className="bg-red-600 hover:bg-red-700">
                <FileWarning className="mr-2 h-5 w-5" />
                Check Compliance Now
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="lg" variant="outline">
                Start Free Trial
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600">73%</div>
              <div className="text-sm text-gray-600">of companies are non-compliant</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">$2.8B</div>
              <div className="text-sm text-gray-600">in contracts at risk</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">500K+</div>
              <div className="text-sm text-gray-600">verified businesses</div>
            </div>
          </div>
        </div>
      </section>

      {/* Urgency Section */}
      <section className="bg-red-50 py-16">
        <div className="container mx-auto px-4">
          <Alert className="max-w-4xl mx-auto border-red-200 bg-white">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <AlertTitle className="text-xl">
              ⚠️ WARNING: Q4 Compliance Reports Due in 45 Days
            </AlertTitle>
            <AlertDescription className="mt-2 text-gray-700">
              Federal departments are now auditing C-5 compliance. Companies failing to meet the 5% threshold 
              are being disqualified from RFPs. The average company needs to redirect $212K in procurement 
              to Indigenous businesses immediately.
            </AlertDescription>
          </Alert>
        </div>
      </section>

      {/* Problem/Solution Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              The C-5 Compliance Crisis
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* Problems */}
              <Card className="border-red-200">
                <CardHeader>
                  <CardTitle className="text-red-700">Without Us</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-2">
                    <span className="text-red-500">✗</span>
                    <span>Lose eligibility for federal contracts</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-red-500">✗</span>
                    <span>Scramble to find Indigenous suppliers</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-red-500">✗</span>
                    <span>Manual compliance tracking</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-red-500">✗</span>
                    <span>Risk failed audits & penalties</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-red-500">✗</span>
                    <span>Damage to reputation</span>
                  </div>
                </CardContent>
              </Card>

              {/* Solutions */}
              <Card className="border-green-200">
                <CardHeader>
                  <CardTitle className="text-green-700">With Indigenous Platform</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Instant access to 50K+ Indigenous businesses</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Real-time compliance tracking</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Automated government reporting</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Verified supplier network</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Audit-ready documentation</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Everything You Need for C-5 Compliance
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <Card>
              <CardHeader>
                <Shield className="h-10 w-10 text-blue-600 mb-2" />
                <CardTitle>Compliance Dashboard</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Real-time tracking of your Indigenous procurement percentage with alerts before you fall below 5%
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Users className="h-10 w-10 text-green-600 mb-2" />
                <CardTitle>500K+ Businesses</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Pre-populated database of Indigenous and Canadian businesses, all verified and ready to connect
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <FileWarning className="h-10 w-10 text-orange-600 mb-2" />
                <CardTitle>Automated Reporting</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Generate government-ready compliance reports with one click. Never miss a deadline again
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Zap className="h-10 w-10 text-yellow-600 mb-2" />
                <CardTitle>Smart Matching</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  AI-powered RFQ matching connects you with the right Indigenous suppliers instantly
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Building2 className="h-10 w-10 text-purple-600 mb-2" />
                <CardTitle>Supplier Network</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Connect directly with verified Indigenous businesses across all industries
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <TrendingUp className="h-10 w-10 text-indigo-600 mb-2" />
                <CardTitle>Growth Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Monitor progress, set targets, and ensure continuous compliance improvement
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">
            Pricing That Pays for Itself
          </h2>
          <p className="text-center text-gray-600 mb-12">
            The cost of non-compliance: Losing ONE government contract. The cost of compliance: Less than your coffee budget.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Indigenous Business Tier */}
            <Card>
              <CardHeader>
                <CardTitle>Indigenous Business</CardTitle>
                <CardDescription>For Indigenous-owned businesses</CardDescription>
                <div className="mt-4">
                  <span className="text-3xl font-bold">FREE</span>
                  <span className="text-gray-600">/forever</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Full platform access</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Unlimited RFQ responses</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Business verification</span>
                  </li>
                </ul>
                <Button className="w-full" variant="outline">Get Started</Button>
              </CardContent>
            </Card>

            {/* C-5 Compliance Tier */}
            <Card className="border-blue-500 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-blue-600">MOST POPULAR</Badge>
              </div>
              <CardHeader>
                <CardTitle>C-5 Compliance Suite</CardTitle>
                <CardDescription>For businesses needing compliance</CardDescription>
                <div className="mt-4">
                  <span className="text-3xl font-bold">$999</span>
                  <span className="text-gray-600">/month</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Real-time compliance tracking</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Automated reporting</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Supplier matching AI</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Audit trail generation</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Priority support</span>
                  </li>
                </ul>
                <Button className="w-full bg-blue-600 hover:bg-blue-700">Start Free Trial</Button>
              </CardContent>
            </Card>

            {/* Enterprise Tier */}
            <Card>
              <CardHeader>
                <CardTitle>Enterprise</CardTitle>
                <CardDescription>For large organizations</CardDescription>
                <div className="mt-4">
                  <span className="text-3xl font-bold">$2,999</span>
                  <span className="text-gray-600">/month</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Everything in Compliance</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Unlimited API access</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Custom integrations</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Dedicated account team</span>
                  </li>
                </ul>
                <Button className="w-full" variant="outline">Contact Sales</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Don't Wait Until It's Too Late
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Companies are being audited NOW. Secure your compliance today.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/dashboard/compliance">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                Check Your Compliance
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/demo">
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-blue-700">
                Book a Demo
              </Button>
            </Link>
          </div>
          
          <div className="mt-12 flex justify-center gap-8 opacity-75">
            <div>
              <div className="text-3xl font-bold">50K+</div>
              <div className="text-sm">Indigenous Businesses</div>
            </div>
            <div>
              <div className="text-3xl font-bold">450K+</div>
              <div className="text-sm">Canadian Businesses</div>
            </div>
            <div>
              <div className="text-3xl font-bold">3K+</div>
              <div className="text-sm">Active Users</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-bold text-white mb-2">Indigenous Platform</p>
              <p className="text-sm">The Official C-5 Compliance Infrastructure</p>
            </div>
            <div className="flex gap-6">
              <Link href="/about" className="hover:text-white">About</Link>
              <Link href="/contact" className="hover:text-white">Contact</Link>
              <Link href="/privacy" className="hover:text-white">Privacy</Link>
              <Link href="/terms" className="hover:text-white">Terms</Link>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm">
            © 2025 Indigenous Platform. Empowering Indigenous prosperity through technology.
          </div>
        </div>
      </footer>
    </div>
  );
}