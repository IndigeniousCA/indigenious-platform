'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { 
  Check,
  X,
  Sparkles,
  Shield,
  TrendingUp,
  Users,
  FileText,
  BarChart3,
  Zap,
  Award,
  DollarSign,
  CreditCard,
  Building,
  Target,
  Brain,
  Mail,
  Phone,
  HelpCircle,
  ChevronRight,
  Info
} from 'lucide-react';

export default function SubscriptionManagement() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('annual');
  const [selectedPlan, setSelectedPlan] = useState('c5-compliance');
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  // Mock current subscription
  const [currentSubscription] = useState({
    plan: 'free',
    status: 'active',
    businessType: 'indigenous',
    nextBilling: null,
    usage: {
      rfqsViewed: 8,
      rfqsResponded: 3,
      profileViews: 45,
      matchesSent: 23
    }
  });

  const plans = [
    {
      id: 'indigenous-free',
      name: 'Indigenous Business',
      price: { monthly: 0, annual: 0 },
      badge: 'FREE FOREVER',
      badgeColor: 'bg-green-500',
      description: 'For verified Indigenous businesses',
      highlighted: currentSubscription.businessType === 'indigenous',
      features: [
        { name: 'Unlimited RFQ access', included: true },
        { name: 'Priority matching', included: true },
        { name: 'C-5 compliance badge', included: true },
        { name: 'Bid assistance AI', included: true },
        { name: 'Partnership facilitation', included: true },
        { name: 'Analytics dashboard', included: true },
        { name: 'Email support', included: true },
        { name: 'API access', included: false },
        { name: 'White-label options', included: false },
        { name: 'Dedicated account manager', included: false }
      ]
    },
    {
      id: 'canadian-standard',
      name: 'Canadian Business',
      price: { monthly: 699, annual: 599 },
      description: 'For Canadian businesses seeking opportunities',
      features: [
        { name: 'Unlimited RFQ access', included: true },
        { name: 'Basic matching (10/month)', included: true },
        { name: 'Company profile', included: true },
        { name: 'Basic analytics', included: true },
        { name: 'Email notifications', included: true },
        { name: 'Standard support', included: true },
        { name: 'Bid assistance AI', included: false },
        { name: 'Priority matching', included: false },
        { name: 'API access', included: false },
        { name: 'Dedicated account manager', included: false }
      ]
    },
    {
      id: 'c5-compliance',
      name: 'C-5 Compliance Suite',
      price: { monthly: 999, annual: 849 },
      badge: 'MOST POPULAR',
      badgeColor: 'bg-blue-500',
      description: 'Complete C-5 compliance management',
      highlighted: true,
      features: [
        { name: 'Everything in Canadian Business', included: true },
        { name: 'C-5 compliance dashboard', included: true },
        { name: 'Indigenous supplier discovery', included: true },
        { name: 'Compliance reporting', included: true },
        { name: 'Contract risk alerts', included: true },
        { name: 'Unlimited matching', included: true },
        { name: 'Bid assistance AI', included: true },
        { name: 'Priority support', included: true },
        { name: 'API access (1000 calls/mo)', included: true },
        { name: 'Dedicated account manager', included: false }
      ]
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: { monthly: 2999, annual: 2499 },
      badge: 'FULL CONTROL',
      badgeColor: 'bg-purple-500',
      description: 'For large organizations and government',
      features: [
        { name: 'Everything in C-5 Compliance', included: true },
        { name: 'Unlimited API access', included: true },
        { name: 'White-label options', included: true },
        { name: 'Custom integrations', included: true },
        { name: 'Dedicated account manager', included: true },
        { name: 'Custom reporting', included: true },
        { name: 'SLA guarantee', included: true },
        { name: 'Training & onboarding', included: true },
        { name: 'Multi-department access', included: true },
        { name: 'Invoice billing', included: true }
      ]
    }
  ];

  const addons = [
    {
      id: 'api-boost',
      name: 'API Boost',
      description: 'Additional 10,000 API calls per month',
      price: { monthly: 199, annual: 169 }
    },
    {
      id: 'premium-support',
      name: 'Premium Support',
      description: '24/7 phone support with 1-hour response SLA',
      price: { monthly: 299, annual: 249 }
    },
    {
      id: 'compliance-audit',
      name: 'Compliance Audit',
      description: 'Quarterly C-5 compliance audit and recommendations',
      price: { monthly: 499, annual: 399 }
    }
  ];

  const calculatePrice = (plan: any) => {
    if (plan.price.monthly === 0) return 'Free';
    const price = billingPeriod === 'annual' ? plan.price.annual : plan.price.monthly;
    return `$${price}/mo`;
  };

  const calculateSavings = (plan: any) => {
    if (plan.price.monthly === 0) return 0;
    const monthlyCost = plan.price.monthly * 12;
    const annualCost = plan.price.annual * 12;
    return monthlyCost - annualCost;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Unlock the power of Indigenous procurement and C-5 compliance
          </p>
          
          {/* Billing Toggle */}
          <div className="inline-flex items-center gap-4 p-1 bg-gray-100 rounded-lg">
            <Button
              variant={billingPeriod === 'monthly' ? 'default' : 'ghost'}
              onClick={() => setBillingPeriod('monthly')}
              className="rounded-md"
            >
              Monthly
            </Button>
            <Button
              variant={billingPeriod === 'annual' ? 'default' : 'ghost'}
              onClick={() => setBillingPeriod('annual')}
              className="rounded-md"
            >
              Annual
              <Badge className="ml-2 bg-green-500">Save 15%</Badge>
            </Button>
          </div>
        </div>

        {/* Indigenous Business Alert */}
        {currentSubscription.businessType === 'indigenous' && (
          <Alert className="mb-6 border-green-500 bg-green-50">
            <Award className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              <strong>Your Indigenous Business account is FREE forever!</strong> You have full access to all 
              Indigenous business features. No credit card required.
            </AlertDescription>
          </Alert>
        )}

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {plans.map((plan) => (
            <Card 
              key={plan.id}
              className={`relative ${plan.highlighted ? 'border-2 border-blue-500 shadow-lg' : ''}`}
            >
              {plan.badge && (
                <div className={`absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-white text-xs font-bold ${plan.badgeColor}`}>
                  {plan.badge}
                </div>
              )}
              
              <CardHeader>
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-3xl font-bold">{calculatePrice(plan)}</span>
                  {plan.price.monthly > 0 && billingPeriod === 'annual' && (
                    <p className="text-sm text-green-600 mt-1">
                      Save ${calculateSavings(plan)}/year
                    </p>
                  )}
                </div>
              </CardHeader>
              
              <CardContent>
                <ul className="space-y-3">
                  {plan.features.slice(0, 6).map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      {feature.included ? (
                        <Check className="h-4 w-4 text-green-500 mt-0.5" />
                      ) : (
                        <X className="h-4 w-4 text-gray-300 mt-0.5" />
                      )}
                      <span className={`text-sm ${!feature.included ? 'text-gray-400' : ''}`}>
                        {feature.name}
                      </span>
                    </li>
                  ))}
                </ul>
                
                {plan.features.length > 6 && (
                  <button className="text-sm text-blue-600 hover:text-blue-700 mt-3">
                    View all features →
                  </button>
                )}
              </CardContent>
              
              <CardFooter>
                {plan.id === currentSubscription.plan ? (
                  <Button disabled className="w-full">
                    Current Plan
                  </Button>
                ) : plan.id === 'indigenous-free' && currentSubscription.businessType === 'indigenous' ? (
                  <Button disabled className="w-full">
                    Your Plan
                  </Button>
                ) : (
                  <Button 
                    className="w-full"
                    variant={plan.highlighted ? 'default' : 'outline'}
                    onClick={() => setSelectedPlan(plan.id)}
                  >
                    {plan.price.monthly === 0 ? 'Get Started' : 'Select Plan'}
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Add-ons Section */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle>Power-Up Your Plan</CardTitle>
            <CardDescription>Add these features to any paid plan</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {addons.map((addon) => (
                <div key={addon.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold">{addon.name}</h4>
                      <p className="text-sm text-gray-600 mt-1">{addon.description}</p>
                    </div>
                    <Switch />
                  </div>
                  <p className="text-sm font-semibold">
                    +${billingPeriod === 'annual' ? addon.price.annual : addon.price.monthly}/mo
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* FAQ Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="font-semibold mb-2">Why is it free for Indigenous businesses?</p>
                <p className="text-sm text-gray-600">
                  We believe in empowering Indigenous businesses. Your success drives the ecosystem, 
                  and we're committed to removing all barriers to your growth.
                </p>
              </div>
              
              <div>
                <p className="font-semibold mb-2">What is Bill C-5?</p>
                <p className="text-sm text-gray-600">
                  Bill C-5 requires federal departments and agencies to ensure a minimum of 5% of 
                  contracts are awarded to Indigenous businesses. Our platform helps organizations 
                  achieve and maintain compliance.
                </p>
              </div>
              
              <div>
                <p className="font-semibold mb-2">Can I change plans anytime?</p>
                <p className="text-sm text-gray-600">
                  Yes! You can upgrade or downgrade your plan at any time. Changes take effect 
                  immediately, and we'll prorate any differences.
                </p>
              </div>
              
              <div>
                <p className="font-semibold mb-2">Do you offer custom pricing?</p>
                <p className="text-sm text-gray-600">
                  For organizations with unique needs or high volume, we offer custom enterprise 
                  pricing. Contact our sales team for a personalized quote.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Need Help Choosing?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Not sure which plan is right?</h4>
                <p className="text-sm text-gray-700 mb-4">
                  Our team can help you choose the perfect plan based on your needs and goals.
                </p>
                <div className="space-y-3">
                  <Button className="w-full" variant="outline">
                    <Phone className="h-4 w-4 mr-2" />
                    Schedule a Call
                  </Button>
                  <Button className="w-full" variant="outline">
                    <Mail className="h-4 w-4 mr-2" />
                    Email Sales Team
                  </Button>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <p className="text-sm font-semibold mb-3">Quick Recommendations:</p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <Badge className="bg-green-100 text-green-800">Indigenous</Badge>
                    <span>Free forever - no credit card needed</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Badge className="bg-blue-100 text-blue-800">Service Provider</Badge>
                    <span>Canadian Business plan for RFQ access</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Badge className="bg-purple-100 text-purple-800">Gov Contractor</Badge>
                    <span>C-5 Compliance Suite for full features</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Current Usage (for existing users) */}
        {currentSubscription.plan === 'free' && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Your Current Usage</CardTitle>
              <CardDescription>Track your platform activity this month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <FileText className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold">{currentSubscription.usage.rfqsViewed}</p>
                  <p className="text-sm text-gray-600">RFQs Viewed</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Target className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold">{currentSubscription.usage.rfqsResponded}</p>
                  <p className="text-sm text-gray-600">Responses Sent</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Users className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold">{currentSubscription.usage.profileViews}</p>
                  <p className="text-sm text-gray-600">Profile Views</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Sparkles className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold">{currentSubscription.usage.matchesSent}</p>
                  <p className="text-sm text-gray-600">Match Alerts</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}