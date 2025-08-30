'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  AlertTriangle, 
  CheckCircle2, 
  TrendingUp, 
  TrendingDown,
  Building2,
  DollarSign,
  FileText,
  Download,
  Bell,
  XCircle,
  Info
} from 'lucide-react';

// C-5 Compliance thresholds
const COMPLIANCE_LEVELS = {
  NON_COMPLIANT: { min: 0, max: 4.99, color: 'red', label: 'Non-Compliant' },
  MINIMUM: { min: 5, max: 7.49, color: 'yellow', label: 'Minimum Compliance' },
  GOOD: { min: 7.5, max: 9.99, color: 'blue', label: 'Good' },
  EXCELLENT: { min: 10, max: 14.99, color: 'green', label: 'Excellent' },
  LEADER: { min: 15, max: 100, color: 'purple', label: 'Industry Leader' }
};

export default function C5ComplianceDashboard() {
  const [companyData, setCompanyData] = useState({
    name: 'Acme Consulting Inc.',
    currentPercentage: 3.2,
    targetPercentage: 5.0,
    totalSpend: 4250000,
    indigenousSpend: 136000,
    contractsAtRisk: 12500000,
    monthlyTrend: -0.8,
    daysUntilDeadline: 45,
    verifiedSuppliers: 8,
    potentialSuppliers: 127
  });

  const [alerts, setAlerts] = useState([
    {
      type: 'critical',
      title: 'Below C-5 Compliance Threshold',
      message: 'Your Indigenous procurement is 1.8% below the required 5% minimum.',
      action: 'Find Indigenous Suppliers'
    },
    {
      type: 'warning',
      title: '$12.5M in Contracts at Risk',
      message: 'Non-compliance may disqualify you from federal contracts.',
      action: 'View Compliance Report'
    }
  ]);

  const getComplianceStatus = (percentage: number) => {
    for (const [key, level] of Object.entries(COMPLIANCE_LEVELS)) {
      if (percentage >= level.min && percentage <= level.max) {
        return level;
      }
    }
    return COMPLIANCE_LEVELS.NON_COMPLIANT;
  };

  const status = getComplianceStatus(companyData.currentPercentage);
  const complianceGap = companyData.targetPercentage - companyData.currentPercentage;
  const requiredSpend = (companyData.totalSpend * companyData.targetPercentage / 100) - companyData.indigenousSpend;

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Critical Alert Banner */}
      {companyData.currentPercentage < 5 && (
        <Alert className="border-red-500 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertTitle className="text-red-900">
            NON-COMPLIANT: Your organization does not meet Bill C-5 requirements
          </AlertTitle>
          <AlertDescription className="text-red-800">
            You are {complianceGap.toFixed(1)}% below the mandatory 5% Indigenous procurement threshold.
            This puts ${(companyData.contractsAtRisk / 1000000).toFixed(1)}M in federal contracts at risk.
          </AlertDescription>
        </Alert>
      )}

      {/* Header with Company Info */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">C-5 Compliance Dashboard</h1>
          <p className="text-gray-600 mt-1">{companyData.name}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Bell className="mr-2 h-4 w-4" />
            Setup Alerts
          </Button>
        </div>
      </div>

      {/* Main Compliance Score Card */}
      <Card className={`border-2 ${status.color === 'red' ? 'border-red-500' : 'border-gray-200'}`}>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl">Current Compliance Score</CardTitle>
              <CardDescription>Bill C-5 Indigenous Procurement Status</CardDescription>
            </div>
            <Badge 
              className={`text-lg px-4 py-2 ${
                status.color === 'red' ? 'bg-red-100 text-red-900' :
                status.color === 'yellow' ? 'bg-yellow-100 text-yellow-900' :
                status.color === 'green' ? 'bg-green-100 text-green-900' :
                'bg-blue-100 text-blue-900'
              }`}
            >
              {status.label}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Percentage Display */}
            <div className="text-center">
              <div className="text-6xl font-bold">
                {companyData.currentPercentage.toFixed(1)}%
              </div>
              <p className="text-gray-600 mt-2">
                of total procurement from Indigenous businesses
              </p>
            </div>

            {/* Progress Bar */}
            <div className="relative">
              <Progress 
                value={(companyData.currentPercentage / 15) * 100} 
                className="h-8"
              />
              <div className="absolute top-0 left-[33%] h-full w-0.5 bg-gray-400" />
              <div className="absolute top-9 left-[33%] transform -translate-x-1/2">
                <span className="text-xs text-gray-600">5% Min</span>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-3 gap-4 pt-4">
              <div className="text-center">
                <p className="text-sm text-gray-600">Total Spend</p>
                <p className="text-2xl font-semibold">
                  ${(companyData.totalSpend / 1000000).toFixed(1)}M
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Indigenous Spend</p>
                <p className="text-2xl font-semibold">
                  ${(companyData.indigenousSpend / 1000).toFixed(0)}K
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Gap to 5%</p>
                <p className="text-2xl font-semibold text-red-600">
                  ${(requiredSpend / 1000).toFixed(0)}K
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs for Different Views */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
          <TabsTrigger value="contracts">Contracts</TabsTrigger>
          <TabsTrigger value="action">Action Plan</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Trend Card */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Monthly Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">
                    {companyData.monthlyTrend > 0 ? '+' : ''}{companyData.monthlyTrend}%
                  </span>
                  {companyData.monthlyTrend < 0 ? (
                    <TrendingDown className="h-8 w-8 text-red-500" />
                  ) : (
                    <TrendingUp className="h-8 w-8 text-green-500" />
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  vs. last month
                </p>
              </CardContent>
            </Card>

            {/* Deadline Card */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Compliance Deadline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-orange-600">
                    {companyData.daysUntilDeadline} days
                  </span>
                  <AlertTriangle className="h-8 w-8 text-orange-500" />
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Until Q4 reporting
                </p>
              </CardContent>
            </Card>

            {/* Risk Card */}
            <Card className="border-red-200 bg-red-50">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Contracts at Risk</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-red-700">
                    ${(companyData.contractsAtRisk / 1000000).toFixed(1)}M
                  </span>
                  <XCircle className="h-8 w-8 text-red-500" />
                </div>
                <p className="text-sm text-red-600 mt-2">
                  If non-compliant
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle>Immediate Actions Required</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                  <Info className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <p className="font-medium">Increase Indigenous procurement by ${(requiredSpend / 1000).toFixed(0)}K</p>
                    <p className="text-sm text-gray-600 mt-1">
                      You need to redirect procurement to reach the 5% minimum threshold
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                  <Building2 className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-medium">Connect with {companyData.potentialSuppliers} verified Indigenous suppliers</p>
                    <p className="text-sm text-gray-600 mt-1">
                      We've identified suppliers in your industry ready to engage
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                  <FileText className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium">Generate compliance documentation</p>
                    <p className="text-sm text-gray-600 mt-1">
                      Prepare audit-ready reports for government review
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="suppliers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Indigenous Supplier Network</CardTitle>
              <CardDescription>
                Connect with verified Indigenous businesses to meet C-5 requirements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-gray-600">Current Suppliers</p>
                  <p className="text-3xl font-bold mt-1">{companyData.verifiedSuppliers}</p>
                  <p className="text-sm text-green-600 mt-2">Verified Indigenous</p>
                </div>
                <div className="p-4 border rounded-lg bg-blue-50">
                  <p className="text-sm text-gray-600">Available Suppliers</p>
                  <p className="text-3xl font-bold mt-1">{companyData.potentialSuppliers}</p>
                  <p className="text-sm text-blue-600 mt-2">In your industries</p>
                </div>
              </div>
              <Button className="w-full bg-green-600 hover:bg-green-700">
                Browse Indigenous Suppliers →
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contracts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Federal Contract Eligibility</CardTitle>
              <CardDescription>
                Your C-5 compliance status affects eligibility for government contracts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Alert className="mb-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Non-compliance Impact</AlertTitle>
                <AlertDescription>
                  Failure to meet C-5 requirements may result in:
                  <ul className="list-disc ml-5 mt-2">
                    <li>Disqualification from federal RFPs</li>
                    <li>Loss of existing contract renewals</li>
                    <li>Reduced scoring on proposals</li>
                    <li>Reputational damage</li>
                  </ul>
                </AlertDescription>
              </Alert>
              
              <div className="space-y-3">
                <div className="p-4 border rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Active Federal Contracts</p>
                      <p className="text-2xl font-bold mt-1">
                        ${(companyData.contractsAtRisk / 1000000).toFixed(1)}M
                      </p>
                    </div>
                    <Badge variant="destructive">At Risk</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="action" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Your Compliance Action Plan</CardTitle>
              <CardDescription>
                Steps to achieve and maintain C-5 compliance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 border rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold">
                    1
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Immediate: Redirect ${(requiredSpend / 1000).toFixed(0)}K to Indigenous suppliers</p>
                    <p className="text-sm text-gray-600">Required to reach 5% minimum</p>
                  </div>
                  <Button size="sm">Start Now</Button>
                </div>
                
                <div className="flex items-center gap-3 p-4 border rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600 font-bold">
                    2
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">This Week: Connect with 10 Indigenous suppliers</p>
                    <p className="text-sm text-gray-600">We've pre-selected matches for you</p>
                  </div>
                  <Button size="sm" variant="outline">View Matches</Button>
                </div>
                
                <div className="flex items-center gap-3 p-4 border rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                    3
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">This Month: Establish procurement partnerships</p>
                    <p className="text-sm text-gray-600">Long-term agreements for sustained compliance</p>
                  </div>
                  <Button size="sm" variant="outline">Learn More</Button>
                </div>
                
                <div className="flex items-center gap-3 p-4 border rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold">
                    4
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Ongoing: Track and report compliance</p>
                    <p className="text-sm text-gray-600">Automated reporting and alerts</p>
                  </div>
                  <Button size="sm" variant="outline">Setup Tracking</Button>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="font-medium text-blue-900 mb-2">
                  🎯 Upgrade to C-5 Compliance Suite
                </p>
                <p className="text-sm text-blue-800 mb-3">
                  Get automated compliance tracking, supplier matching, and government reporting
                </p>
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Upgrade Now - $999/month
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}