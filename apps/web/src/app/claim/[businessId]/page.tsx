'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { 
  Building, 
  Mail, 
  Phone, 
  Globe, 
  MapPin,
  CheckCircle,
  AlertTriangle,
  Shield,
  Award,
  TrendingUp,
  Users,
  DollarSign,
  FileText,
  ArrowRight,
  Sparkles,
  Lock
} from 'lucide-react';

export default function ClaimBusinessProfile() {
  const params = useParams();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [verificationMethod, setVerificationMethod] = useState<'email' | 'phone' | 'document'>('email');
  
  // Mock business data (would come from API)
  const [businessData] = useState({
    id: params.businessId,
    name: 'Eagle Technologies Inc.',
    industry: 'IT Services',
    address: '123 Main Street, Toronto, ON M5V 3A8',
    city: 'Toronto',
    province: 'ON',
    website: 'www.eagletech.ca',
    email: 'contact@eagletech.ca',
    phone: '(416) 555-0123',
    employee_count: 45,
    
    // Indigenous status
    is_indigenous: true,
    indigenous_certified: false,
    ownership_percentage: 51,
    
    // Platform benefits
    potential_rfqs: 23,
    estimated_value: 2500000,
    compliance_customers: 8,
    
    // Verification status
    claimed: false,
    verified: false
  });

  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    firstName: '',
    lastName: '',
    role: '',
    verificationCode: '',
    acceptTerms: false,
    subscribeUpdates: true
  });

  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;

  const handleVerificationSend = () => {
    // Simulate sending verification
    console.log(`Sending verification to ${verificationMethod}`);
    setStep(3);
  };

  const handleVerificationComplete = () => {
    // Simulate verification
    console.log('Verification complete');
    setStep(4);
  };

  const handleClaimComplete = () => {
    // Complete claim process
    console.log('Claim complete');
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between mt-2 text-sm text-gray-600">
            <span className={step >= 1 ? 'text-blue-600 font-semibold' : ''}>Business Info</span>
            <span className={step >= 2 ? 'text-blue-600 font-semibold' : ''}>Verification</span>
            <span className={step >= 3 ? 'text-blue-600 font-semibold' : ''}>Confirm</span>
            <span className={step >= 4 ? 'text-blue-600 font-semibold' : ''}>Complete</span>
          </div>
        </div>

        {/* Step 1: Business Information */}
        {step === 1 && (
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="text-2xl">Claim Your Business Profile</CardTitle>
              <CardDescription>
                Verify this is your business and unlock powerful features
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Business Details */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold flex items-center gap-2">
                      <Building className="h-5 w-5" />
                      {businessData.name}
                    </h3>
                    {businessData.is_indigenous && (
                      <Badge className="mt-2 bg-green-100 text-green-800">
                        Indigenous Business
                      </Badge>
                    )}
                  </div>
                  {businessData.is_indigenous && (
                    <Award className="h-8 w-8 text-green-600" />
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span>{businessData.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-gray-400" />
                    <span>{businessData.website}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span>{businessData.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span>{businessData.phone}</span>
                  </div>
                </div>
              </div>

              {/* Benefits Preview */}
              <div className="bg-blue-50 p-6 rounded-lg">
                <h4 className="font-semibold mb-4 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-blue-600" />
                  What You'll Unlock
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white p-4 rounded-lg">
                    <FileText className="h-8 w-8 text-blue-600 mb-2" />
                    <p className="font-bold text-2xl">{businessData.potential_rfqs}</p>
                    <p className="text-sm text-gray-600">Matching RFQs</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <DollarSign className="h-8 w-8 text-green-600 mb-2" />
                    <p className="font-bold text-2xl">
                      ${(businessData.estimated_value / 1000000).toFixed(1)}M
                    </p>
                    <p className="text-sm text-gray-600">Opportunity Value</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <Users className="h-8 w-8 text-purple-600 mb-2" />
                    <p className="font-bold text-2xl">{businessData.compliance_customers}</p>
                    <p className="text-sm text-gray-600">C-5 Buyers</p>
                  </div>
                </div>
              </div>

              {/* Special Indigenous Benefits */}
              {businessData.is_indigenous && (
                <Alert className="border-green-200 bg-green-50">
                  <Award className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    <strong>Indigenous Business Benefits:</strong> Your profile is FREE forever. 
                    Get priority matching for C-5 compliance opportunities and exclusive access to 
                    Indigenous procurement programs.
                  </AlertDescription>
                </Alert>
              )}

              {/* Contact Information Form */}
              <div className="space-y-4">
                <h4 className="font-semibold">Your Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email">Business Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="your@company.com"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="role">Your Role</Label>
                  <Input
                    id="role"
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                    placeholder="e.g., Owner, CEO, Manager"
                    required
                  />
                </div>
              </div>

              <Button 
                className="w-full" 
                size="lg"
                onClick={() => setStep(2)}
                disabled={!formData.firstName || !formData.lastName || !formData.email || !formData.role}
              >
                Continue to Verification
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Verification Method */}
        {step === 2 && (
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="text-2xl">Verify Your Authority</CardTitle>
              <CardDescription>
                Confirm you have the authority to manage this business profile
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                {/* Email Verification */}
                <div 
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                    verificationMethod === 'email' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                  }`}
                  onClick={() => setVerificationMethod('email')}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5" />
                      <div>
                        <p className="font-semibold">Email Verification</p>
                        <p className="text-sm text-gray-600">
                          We'll send a code to {formData.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="default" className="bg-green-500">Fastest</Badge>
                      {verificationMethod === 'email' && <CheckCircle className="h-5 w-5 text-blue-500" />}
                    </div>
                  </div>
                </div>

                {/* Phone Verification */}
                <div 
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                    verificationMethod === 'phone' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                  }`}
                  onClick={() => setVerificationMethod('phone')}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5" />
                      <div>
                        <p className="font-semibold">Phone Verification</p>
                        <p className="text-sm text-gray-600">
                          We'll call {businessData.phone}
                        </p>
                      </div>
                    </div>
                    {verificationMethod === 'phone' && <CheckCircle className="h-5 w-5 text-blue-500" />}
                  </div>
                </div>

                {/* Document Verification */}
                <div 
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                    verificationMethod === 'document' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                  }`}
                  onClick={() => setVerificationMethod('document')}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5" />
                      <div>
                        <p className="font-semibold">Document Verification</p>
                        <p className="text-sm text-gray-600">
                          Upload business registration or license
                        </p>
                      </div>
                    </div>
                    {verificationMethod === 'document' && <CheckCircle className="h-5 w-5 text-blue-500" />}
                  </div>
                </div>
              </div>

              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  Your information is encrypted and secure. We'll never share your 
                  personal data without your permission.
                </AlertDescription>
              </Alert>

              <div className="flex gap-4">
                <Button 
                  variant="outline" 
                  onClick={() => setStep(1)}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button 
                  onClick={handleVerificationSend}
                  className="flex-1"
                >
                  Send Verification
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Verification Confirmation */}
        {step === 3 && (
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="text-2xl">Enter Verification Code</CardTitle>
              <CardDescription>
                We've sent a verification code to your {verificationMethod}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center py-8">
                <div className="flex justify-center mb-4">
                  <div className="bg-blue-100 rounded-full p-4">
                    <Lock className="h-8 w-8 text-blue-600" />
                  </div>
                </div>
                
                <p className="text-gray-600 mb-6">
                  Enter the 6-digit code sent to<br />
                  <strong>{verificationMethod === 'email' ? formData.email : businessData.phone}</strong>
                </p>

                <div className="flex justify-center gap-2 mb-6">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <Input
                      key={i}
                      className="w-12 h-12 text-center text-xl font-bold"
                      maxLength={1}
                      onChange={(e) => {
                        if (e.target.value && i < 6) {
                          const nextInput = e.target.parentElement?.children[i] as HTMLInputElement;
                          nextInput?.focus();
                        }
                      }}
                    />
                  ))}
                </div>

                <Button variant="link" className="text-sm">
                  Didn't receive the code? Resend
                </Button>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-2">
                  <Checkbox 
                    id="terms"
                    checked={formData.acceptTerms}
                    onCheckedChange={(checked) => 
                      setFormData({...formData, acceptTerms: checked as boolean})
                    }
                  />
                  <Label htmlFor="terms" className="text-sm">
                    I agree to the Terms of Service and Privacy Policy
                  </Label>
                </div>

                <div className="flex items-start gap-2">
                  <Checkbox 
                    id="updates"
                    checked={formData.subscribeUpdates}
                    onCheckedChange={(checked) => 
                      setFormData({...formData, subscribeUpdates: checked as boolean})
                    }
                  />
                  <Label htmlFor="updates" className="text-sm">
                    Send me updates about new RFQ matches and opportunities
                  </Label>
                </div>
              </div>

              <div className="flex gap-4">
                <Button 
                  variant="outline" 
                  onClick={() => setStep(2)}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button 
                  onClick={handleVerificationComplete}
                  className="flex-1"
                  disabled={!formData.acceptTerms}
                >
                  Verify & Claim
                  <CheckCircle className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Success */}
        {step === 4 && (
          <Card className="border-2 border-green-500">
            <CardContent className="text-center py-12">
              <div className="flex justify-center mb-6">
                <div className="bg-green-100 rounded-full p-6">
                  <CheckCircle className="h-12 w-12 text-green-600" />
                </div>
              </div>

              <h2 className="text-3xl font-bold mb-4">
                Congratulations! 🎉
              </h2>
              
              <p className="text-xl text-gray-600 mb-8">
                You've successfully claimed<br />
                <strong>{businessData.name}</strong>
              </p>

              {businessData.is_indigenous && (
                <Alert className="mb-6 border-green-200 bg-green-50">
                  <Award className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    <strong>Indigenous Business Benefits Activated!</strong><br />
                    Your profile is FREE forever. You now have priority access to C-5 compliance 
                    opportunities and {businessData.potential_rfqs} matching RFQs worth 
                    ${(businessData.estimated_value / 1000000).toFixed(1)}M.
                  </AlertDescription>
                </Alert>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <TrendingUp className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <p className="font-semibold">Next Step</p>
                  <p className="text-sm text-gray-600">Complete your profile</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <FileText className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <p className="font-semibold">{businessData.potential_rfqs} RFQs</p>
                  <p className="text-sm text-gray-600">Ready to review</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <Users className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <p className="font-semibold">{businessData.compliance_customers} Buyers</p>
                  <p className="text-sm text-gray-600">Need your services</p>
                </div>
              </div>

              <Button 
                size="lg" 
                className="w-full"
                onClick={handleClaimComplete}
              >
                Go to Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}