'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown, 
  DollarSign,
  Users,
  Building,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  ArrowRight,
  Target,
  BarChart3,
  Activity
} from 'lucide-react';

export default function C5MonitoringDashboard() {
  const [complianceData, setComplianceData] = useState({
    currentPercentage: 3.2,
    targetPercentage: 5.0,
    trend: 'down',
    trendValue: -0.3,
    lastUpdated: new Date().toISOString(),
    
    // Financial impact
    totalContractValue: 45000000,
    contractsAtRisk: 12500000,
    potentialPenalties: 625000,
    
    // Supplier data
    totalSuppliers: 234,
    indigenousSuppliers: 8,
    verifiedIndigenous: 5,
    pendingVerification: 3,
    
    // Spend breakdown
    totalSpend: 8500000,
    indigenousSpend: 272000,
    
    // Contracts
    activeContracts: 47,
    contractsNeedingAttention: 12,
    upcomingDeadlines: 5,
    
    // Quarterly data
    quarters: [
      { period: 'Q1 2024', percentage: 3.8, spend: 95000 },
      { period: 'Q2 2024', percentage: 3.5, spend: 87500 },
      { period: 'Q3 2024', percentage: 3.2, spend: 80000 },
      { period: 'Q4 2024', percentage: 3.2, spend: 9500 }
    ],
    
    // Risk level
    riskLevel: 'CRITICAL',
    daysUntilDeadline: 45,
    
    // Recommendations
    immediateActions: [
      { action: 'Find 15 more Indigenous suppliers', impact: '+1.8%', urgency: 'high' },
      { action: 'Increase Indigenous spend by $425,000', impact: '+1.8%', urgency: 'critical' },
      { action: 'Verify 3 pending suppliers', impact: '+0.4%', urgency: 'medium' }
    ]
  });

  const [selectedView, setSelectedView] = useState('overview');
  const complianceGap = complianceData.targetPercentage - complianceData.currentPercentage;
  const complianceStatus = complianceData.currentPercentage >= 5.0 ? 'compliant' : 
                           complianceData.currentPercentage >= 4.0 ? 'warning' : 'critical';

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header with Critical Alert */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Bill C-5 Compliance Monitor
          </h1>
          <p className="text-gray-600">
            Real-time tracking of your Indigenous procurement compliance
          </p>
        </div>

        {/* Critical Alert Banner */}
        {complianceStatus === 'critical' && (
          <Alert className="mb-6 border-red-500 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertTitle className="text-red-800">CRITICAL: Non-Compliant Status</AlertTitle>
            <AlertDescription className="text-red-700">
              You are {complianceGap.toFixed(1)}% below the mandatory 5% threshold. 
              ${(complianceData.contractsAtRisk / 1000000).toFixed(1)}M in contracts at risk.
              Immediate action required to avoid penalties and contract loss.
            </AlertDescription>
            <Button className="mt-4 bg-red-600 hover:bg-red-700">
              Fix Compliance Now →
            </Button>
          </Alert>
        )}

        {/* Main Compliance Score Card */}
        <Card className="mb-6 border-2 border-red-500">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Current Compliance Status</span>
              <Badge variant={complianceStatus === 'critical' ? 'destructive' : 'warning'}>
                {complianceStatus.toUpperCase()}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Compliance Percentage */}
              <div className="col-span-2">
                <div className="mb-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-2xl font-bold">
                      {complianceData.currentPercentage}%
                    </span>
                    <span className="text-sm text-gray-500">
                      Target: {complianceData.targetPercentage}%
                    </span>
                  </div>
                  <Progress 
                    value={(complianceData.currentPercentage / complianceData.targetPercentage) * 100} 
                    className="h-6"
                  />
                  <div className="flex items-center mt-2 text-sm">
                    {complianceData.trend === 'down' ? (
                      <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                    ) : (
                      <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    )}
                    <span className={complianceData.trend === 'down' ? 'text-red-600' : 'text-green-600'}>
                      {complianceData.trendValue}% from last quarter
                    </span>
                  </div>
                </div>

                {/* Spend Breakdown */}
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div>
                    <p className="text-sm text-gray-600">Indigenous Spend</p>
                    <p className="text-2xl font-bold text-green-600">
                      ${(complianceData.indigenousSpend / 1000000).toFixed(2)}M
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Spend</p>
                    <p className="text-2xl font-bold">
                      ${(complianceData.totalSpend / 1000000).toFixed(1)}M
                    </p>
                  </div>
                </div>
              </div>

              {/* Risk Metrics */}
              <div className="space-y-4 bg-red-50 p-4 rounded-lg">
                <div>
                  <p className="text-sm font-semibold text-red-700">Contracts at Risk</p>
                  <p className="text-3xl font-bold text-red-600">
                    ${(complianceData.contractsAtRisk / 1000000).toFixed(1)}M
                  </p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-red-700">Potential Penalties</p>
                  <p className="text-xl font-bold text-red-600">
                    ${(complianceData.potentialPenalties / 1000).toFixed(0)}K
                  </p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-red-700">Days to Deadline</p>
                  <p className="text-xl font-bold text-red-600">
                    {complianceData.daysUntilDeadline} days
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Tabs */}
        <Tabs value={selectedView} onValueChange={setSelectedView} className="mb-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
            <TabsTrigger value="contracts">Contracts</TabsTrigger>
            <TabsTrigger value="actions">Action Plan</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Total Suppliers</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{complianceData.totalSuppliers}</div>
                  <p className="text-xs text-muted-foreground">
                    {complianceData.indigenousSuppliers} Indigenous ({((complianceData.indigenousSuppliers / complianceData.totalSuppliers) * 100).toFixed(1)}%)
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Active Contracts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{complianceData.activeContracts}</div>
                  <p className="text-xs text-red-600">
                    {complianceData.contractsNeedingAttention} need attention
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Compliance Gap</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">-{complianceGap.toFixed(1)}%</div>
                  <p className="text-xs text-muted-foreground">
                    ${((complianceGap / 100) * complianceData.totalSpend / 1000).toFixed(0)}K needed
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Quarterly Trend */}
            <Card>
              <CardHeader>
                <CardTitle>Quarterly Compliance Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {complianceData.quarters.map((quarter, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{quarter.period}</span>
                      <div className="flex items-center gap-4">
                        <span className="text-sm">${(quarter.spend / 1000).toFixed(0)}K</span>
                        <div className="w-32">
                          <Progress 
                            value={(quarter.percentage / 5) * 100} 
                            className="h-2"
                          />
                        </div>
                        <span className={`text-sm font-bold ${quarter.percentage >= 5 ? 'text-green-600' : 'text-red-600'}`}>
                          {quarter.percentage}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Suppliers Tab */}
          <TabsContent value="suppliers" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Indigenous Supplier Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Verified Indigenous
                      </span>
                      <span className="font-bold">{complianceData.verifiedIndigenous}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-yellow-500" />
                        Pending Verification
                      </span>
                      <span className="font-bold">{complianceData.pendingVerification}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="flex items-center gap-2">
                        <XCircle className="h-4 w-4 text-red-500" />
                        Gap to Target
                      </span>
                      <span className="font-bold text-red-600">15</span>
                    </div>
                  </div>
                  <Button className="w-full mt-4">
                    Find Indigenous Suppliers →
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Top Indigenous Suppliers</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Eagle Technologies</span>
                      <span className="font-bold">$45K</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Northern Construction</span>
                      <span className="font-bold">$38K</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Raven Consulting</span>
                      <span className="font-bold">$32K</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Bear Services</span>
                      <span className="font-bold">$28K</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Contracts Tab */}
          <TabsContent value="contracts" className="space-y-4">
            <Alert className="border-orange-500 bg-orange-50">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              <AlertTitle>Contract Compliance Requirements</AlertTitle>
              <AlertDescription>
                {complianceData.contractsNeedingAttention} contracts require immediate C-5 compliance updates
              </AlertDescription>
            </Alert>

            <div className="space-y-3">
              {[
                { name: 'Federal IT Services Contract', value: 5200000, risk: 'high', deadline: '30 days' },
                { name: 'Infrastructure Modernization', value: 3800000, risk: 'critical', deadline: '15 days' },
                { name: 'Consulting Services Agreement', value: 2100000, risk: 'medium', deadline: '45 days' },
                { name: 'Facilities Management', value: 1400000, risk: 'high', deadline: '60 days' }
              ].map((contract, index) => (
                <Card key={index}>
                  <CardContent className="flex items-center justify-between p-4">
                    <div>
                      <p className="font-semibold">{contract.name}</p>
                      <p className="text-sm text-gray-600">
                        Value: ${(contract.value / 1000000).toFixed(1)}M
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant={contract.risk === 'critical' ? 'destructive' : 'default'}>
                        {contract.risk} risk
                      </Badge>
                      <span className="text-sm">Due: {contract.deadline}</span>
                      <Button size="sm">Review →</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Action Plan Tab */}
          <TabsContent value="actions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Immediate Actions Required</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {complianceData.immediateActions.map((action, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-semibold">{action.action}</p>
                      <p className="text-sm text-gray-600">Impact: {action.impact} compliance</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={action.urgency === 'critical' ? 'destructive' : 
                                     action.urgency === 'high' ? 'default' : 'secondary'}>
                        {action.urgency}
                      </Badge>
                      <Button>
                        Start <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-green-50 border-green-200">
              <CardHeader>
                <CardTitle className="text-green-800">Path to Compliance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Target className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-semibold">Quick Win: Connect with 5 verified suppliers</p>
                      <p className="text-sm text-gray-600">+0.8% compliance in 1 week</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <BarChart3 className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-semibold">Strategic: Implement supplier diversity program</p>
                      <p className="text-sm text-gray-600">+2.5% compliance in 30 days</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Activity className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-semibold">Long-term: Automate Indigenous procurement tracking</p>
                      <p className="text-sm text-gray-600">Maintain 5%+ ongoing</p>
                    </div>
                  </div>
                </div>
                <Button className="w-full mt-6 bg-green-600 hover:bg-green-700">
                  Get Compliance Roadmap →
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}