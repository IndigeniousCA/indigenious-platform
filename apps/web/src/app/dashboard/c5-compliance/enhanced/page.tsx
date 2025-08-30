'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  FileText,
  Target,
  Shield,
  BarChart3,
  Activity,
  Calendar,
  Download,
  Send,
  CheckCircle,
  XCircle,
  Clock,
  ArrowUp,
  ArrowDown,
  Zap,
  Award,
  Building,
  MapPin,
  Filter,
  RefreshCw,
  Bell,
  ChevronRight,
  Info,
  AlertCircle
} from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar
} from 'recharts';

export default function EnhancedC5ComplianceDashboard() {
  const [timeRange, setTimeRange] = useState('quarter');
  const [department, setDepartment] = useState('all');
  const [refreshing, setRefreshing] = useState(false);
  const [selectedContract, setSelectedContract] = useState<any>(null);

  // Real-time compliance data
  const [complianceData, setComplianceData] = useState({
    currentPercentage: 3.2,
    targetPercentage: 5.0,
    trend: -0.3, // Negative trend is concerning
    projectedPercentage: 2.8, // Projected for end of quarter
    daysUntilDeadline: 45,
    
    // Financial impact
    totalContractValue: 485000000,
    indigenousContractValue: 15520000,
    contractsAtRisk: 125000000,
    potentialPenalties: 6250000,
    
    // Contract details
    totalContracts: 1247,
    indigenousContracts: 89,
    contractsNeedingAction: 156,
    upcomingRenewals: 43,
    
    // Supplier metrics
    totalSuppliers: 3456,
    indigenousSuppliers: 112,
    certifiedIndigenousSuppliers: 89,
    pendingVerifications: 23,
    
    // Department breakdown
    departments: [
      { name: 'IT Services', percentage: 4.1, value: 45000000, contracts: 234 },
      { name: 'Construction', percentage: 2.8, value: 78000000, contracts: 89 },
      { name: 'Professional Services', percentage: 3.5, value: 34000000, contracts: 456 },
      { name: 'Facilities', percentage: 1.9, value: 23000000, contracts: 123 },
      { name: 'Transportation', percentage: 2.3, value: 19000000, contracts: 67 }
    ]
  });

  // Historical data for trends
  const historicalData = [
    { month: 'Jan', percentage: 3.8, target: 5.0, contracts: 78 },
    { month: 'Feb', percentage: 3.9, target: 5.0, contracts: 81 },
    { month: 'Mar', percentage: 4.1, target: 5.0, contracts: 85 },
    { month: 'Apr', percentage: 3.7, target: 5.0, contracts: 82 },
    { month: 'May', percentage: 3.5, target: 5.0, contracts: 84 },
    { month: 'Jun', percentage: 3.2, target: 5.0, contracts: 89 }
  ];

  // Contracts at risk
  const contractsAtRisk = [
    {
      id: 'CON-2024-1234',
      name: 'Enterprise Cloud Services',
      value: 12500000,
      supplier: 'TechCorp Solutions',
      renewalDate: '2025-03-31',
      daysUntilRenewal: 30,
      indigenousAlternatives: 3,
      riskLevel: 'high'
    },
    {
      id: 'CON-2024-2345',
      name: 'Facilities Management',
      value: 8900000,
      supplier: 'BuildRight Inc',
      renewalDate: '2025-04-15',
      daysUntilRenewal: 45,
      indigenousAlternatives: 5,
      riskLevel: 'high'
    },
    {
      id: 'CON-2024-3456',
      name: 'Professional Consulting',
      value: 5600000,
      supplier: 'Advisory Partners',
      renewalDate: '2025-05-01',
      daysUntilRenewal: 61,
      indigenousAlternatives: 8,
      riskLevel: 'medium'
    }
  ];

  // Indigenous suppliers ready to engage
  const indigenousSuppliers = [
    {
      name: 'Indigenous Tech Solutions',
      certifications: ['CCAB Platinum', 'ISO 27001'],
      capabilities: ['Cloud Services', 'Cybersecurity', 'AI/ML'],
      matchScore: 94,
      contractCapacity: 15000000
    },
    {
      name: 'First Nations Construction Group',
      certifications: ['CCAB Gold', 'ISO 9001'],
      capabilities: ['Commercial Building', 'Infrastructure', 'Renovation'],
      matchScore: 89,
      contractCapacity: 25000000
    },
    {
      name: 'Métis Professional Services',
      certifications: ['CCAB Silver', 'PMP'],
      capabilities: ['Management Consulting', 'Change Management', 'Training'],
      matchScore: 87,
      contractCapacity: 8000000
    }
  ];

  // Action items
  const actionItems = [
    {
      priority: 'critical',
      action: 'Review and convert Enterprise Cloud Services contract',
      impact: '+0.3% compliance',
      value: 12500000,
      deadline: '2025-03-15'
    },
    {
      priority: 'high',
      action: 'Issue RFQ with Indigenous preference for Q2 procurements',
      impact: '+0.5% compliance',
      value: 23000000,
      deadline: '2025-03-01'
    },
    {
      priority: 'high',
      action: 'Partner Indigenous suppliers with existing contractors',
      impact: '+0.2% compliance',
      value: 8000000,
      deadline: '2025-03-20'
    },
    {
      priority: 'medium',
      action: 'Conduct supplier diversity training for procurement team',
      impact: 'Long-term improvement',
      value: null,
      deadline: '2025-04-01'
    }
  ];

  // Refresh data
  const refreshData = () => {
    setRefreshing(true);
    setTimeout(() => {
      // Simulate data refresh
      setComplianceData(prev => ({
        ...prev,
        currentPercentage: prev.currentPercentage + (Math.random() * 0.2 - 0.1)
      }));
      setRefreshing(false);
    }, 1000);
  };

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(refreshData, 30000);
    return () => clearInterval(interval);
  }, []);

  // Calculate risk level
  const getRiskLevel = () => {
    const gap = complianceData.targetPercentage - complianceData.currentPercentage;
    if (gap > 2) return 'critical';
    if (gap > 1) return 'high';
    if (gap > 0.5) return 'medium';
    return 'low';
  };

  const riskLevel = getRiskLevel();

  // Colors for charts
  const COLORS = {
    indigenous: '#22c55e',
    nonIndigenous: '#94a3b8',
    target: '#3b82f6',
    critical: '#ef4444',
    warning: '#f59e0b',
    success: '#22c55e'
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">
              C-5 Compliance Command Center
            </h1>
            <p className="text-gray-600 mt-2">
              Real-time monitoring and action management for Bill C-5 compliance
            </p>
          </div>
          
          <div className="flex gap-4">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="month">Month</SelectItem>
                <SelectItem value="quarter">Quarter</SelectItem>
                <SelectItem value="year">Year</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={department} onValueChange={setDepartment}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                <SelectItem value="it">IT Services</SelectItem>
                <SelectItem value="construction">Construction</SelectItem>
                <SelectItem value="professional">Professional</SelectItem>
              </SelectContent>
            </Select>
            
            <Button
              variant="outline"
              onClick={refreshData}
              disabled={refreshing}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            
            <Button>
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Critical Alert */}
        {riskLevel === 'critical' && (
          <Alert className="mb-6 border-red-500 bg-red-50">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <AlertTitle className="text-red-900 text-lg">
              Critical: C-5 Compliance at Risk
            </AlertTitle>
            <AlertDescription className="text-red-700">
              <div className="mt-2 space-y-2">
                <p>Current compliance is {complianceData.currentPercentage.toFixed(1)}%, requiring immediate action to meet the 5% target.</p>
                <p className="font-semibold">
                  ${(complianceData.contractsAtRisk / 1000000).toFixed(1)}M in contracts at risk • 
                  Potential penalties: ${(complianceData.potentialPenalties / 1000000).toFixed(1)}M
                </p>
                <div className="flex gap-2 mt-3">
                  <Button size="sm" variant="destructive">
                    View Action Plan
                  </Button>
                  <Button size="sm" variant="outline">
                    Schedule Emergency Meeting
                  </Button>
                </div>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Main Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                Current Compliance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-gray-900">
                  {complianceData.currentPercentage.toFixed(1)}%
                </span>
                <Badge 
                  variant={complianceData.trend >= 0 ? "default" : "destructive"}
                  className="flex items-center gap-1"
                >
                  {complianceData.trend >= 0 ? (
                    <ArrowUp className="h-3 w-3" />
                  ) : (
                    <ArrowDown className="h-3 w-3" />
                  )}
                  {Math.abs(complianceData.trend).toFixed(1)}%
                </Badge>
              </div>
              <Progress 
                value={(complianceData.currentPercentage / complianceData.targetPercentage) * 100}
                className="mt-3 h-2"
              />
              <p className="text-sm text-gray-500 mt-2">
                Target: {complianceData.targetPercentage}%
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                Contracts at Risk
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-red-600">
                  ${(complianceData.contractsAtRisk / 1000000).toFixed(1)}M
                </span>
              </div>
              <div className="mt-3 space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Contracts</span>
                  <span className="font-medium">{complianceData.contractsNeedingAction}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Avg. Value</span>
                  <span className="font-medium">
                    ${(complianceData.contractsAtRisk / complianceData.contractsNeedingAction / 1000000).toFixed(1)}M
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                Indigenous Suppliers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-green-600">
                  {complianceData.certifiedIndigenousSuppliers}
                </span>
                <Badge variant="outline" className="text-green-600">
                  Certified
                </Badge>
              </div>
              <div className="mt-3 space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Available</span>
                  <span className="font-medium">{complianceData.indigenousSuppliers}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Pending Verification</span>
                  <span className="font-medium">{complianceData.pendingVerifications}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                Days Until Deadline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-orange-600">
                  {complianceData.daysUntilDeadline}
                </span>
                <span className="text-gray-600">days</span>
              </div>
              <div className="mt-3">
                <p className="text-sm text-gray-600">Q4 2025 Reporting</p>
                <p className="text-sm font-medium text-orange-600 mt-1">
                  Action Required Now
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for detailed views */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="contracts">Contracts</TabsTrigger>
            <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
            <TabsTrigger value="actions">Action Items</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Compliance Trend Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Compliance Trend</CardTitle>
                  <CardDescription>
                    6-month trend with projection
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={historicalData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis domain={[0, 6]} />
                      <Tooltip />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="percentage"
                        stroke={COLORS.indigenous}
                        fill={COLORS.indigenous}
                        fillOpacity={0.3}
                        name="Actual %"
                      />
                      <Line
                        type="monotone"
                        dataKey="target"
                        stroke={COLORS.critical}
                        strokeDasharray="5 5"
                        dot={false}
                        name="Target %"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Department Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle>Department Performance</CardTitle>
                  <CardDescription>
                    Compliance by department
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {complianceData.departments.map((dept) => (
                      <div key={dept.name}>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium">{dept.name}</span>
                          <span className={`text-sm font-bold ${
                            dept.percentage >= 5 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {dept.percentage}%
                          </span>
                        </div>
                        <Progress
                          value={(dept.percentage / 5) * 100}
                          className="h-2"
                        />
                        <div className="flex justify-between mt-1">
                          <span className="text-xs text-gray-500">
                            ${(dept.value / 1000000).toFixed(1)}M
                          </span>
                          <span className="text-xs text-gray-500">
                            {dept.contracts} contracts
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Projected Impact */}
            <Card>
              <CardHeader>
                <CardTitle>Projected Compliance Impact</CardTitle>
                <CardDescription>
                  Based on current pipeline and planned actions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900">
                      {complianceData.currentPercentage.toFixed(1)}%
                    </div>
                    <p className="text-sm text-gray-600 mt-1">Current</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">
                      {(complianceData.currentPercentage + 0.8).toFixed(1)}%
                    </div>
                    <p className="text-sm text-gray-600 mt-1">With Pipeline</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">
                      {(complianceData.currentPercentage + 1.5).toFixed(1)}%
                    </div>
                    <p className="text-sm text-gray-600 mt-1">With Actions</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600">
                      5.2%
                    </div>
                    <p className="text-sm text-gray-600 mt-1">Full Potential</p>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-800">
                    <CheckCircle className="inline h-4 w-4 mr-1" />
                    Executing all planned actions will achieve compliance with 0.2% buffer
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contracts Tab */}
          <TabsContent value="contracts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Contracts Requiring Action</CardTitle>
                <CardDescription>
                  Prioritized by value and renewal date
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {contractsAtRisk.map((contract) => (
                    <div
                      key={contract.id}
                      className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
                      onClick={() => setSelectedContract(contract)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold">{contract.name}</h4>
                            <Badge 
                              variant={contract.riskLevel === 'high' ? 'destructive' : 'default'}
                            >
                              {contract.riskLevel} risk
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            {contract.supplier} • Contract #{contract.id}
                          </p>
                          <div className="flex gap-4 mt-2">
                            <span className="text-sm">
                              <DollarSign className="inline h-3 w-3" />
                              ${(contract.value / 1000000).toFixed(1)}M
                            </span>
                            <span className="text-sm">
                              <Calendar className="inline h-3 w-3" />
                              Renews in {contract.daysUntilRenewal} days
                            </span>
                            <span className="text-sm text-green-600">
                              <Users className="inline h-3 w-3" />
                              {contract.indigenousAlternatives} alternatives available
                            </span>
                          </div>
                        </div>
                        <Button size="sm">
                          Review Options
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Suppliers Tab */}
          <TabsContent value="suppliers" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Indigenous Suppliers Ready to Engage</CardTitle>
                <CardDescription>
                  Pre-qualified and matched to your needs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {indigenousSuppliers.map((supplier) => (
                    <div key={supplier.name} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold">{supplier.name}</h4>
                            <Badge variant="outline" className="text-green-600">
                              {supplier.matchScore}% match
                            </Badge>
                          </div>
                          <div className="flex gap-2 mt-2">
                            {supplier.certifications.map((cert) => (
                              <Badge key={cert} variant="secondary">
                                <Award className="h-3 w-3 mr-1" />
                                {cert}
                              </Badge>
                            ))}
                          </div>
                          <div className="mt-3">
                            <p className="text-sm text-gray-600">Capabilities:</p>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {supplier.capabilities.map((cap) => (
                                <span key={cap} className="text-sm px-2 py-1 bg-gray-100 rounded">
                                  {cap}
                                </span>
                              ))}
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mt-2">
                            Contract capacity: ${(supplier.contractCapacity / 1000000).toFixed(1)}M
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            View Profile
                          </Button>
                          <Button size="sm">
                            Invite to RFQ
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Action Items Tab */}
          <TabsContent value="actions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Priority Action Items</CardTitle>
                <CardDescription>
                  Immediate steps to improve compliance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {actionItems.map((item, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Badge 
                              variant={
                                item.priority === 'critical' ? 'destructive' :
                                item.priority === 'high' ? 'default' : 'secondary'
                              }
                            >
                              {item.priority}
                            </Badge>
                            <span className="font-medium">{item.action}</span>
                          </div>
                          <div className="flex gap-4 mt-2">
                            <span className="text-sm text-green-600">
                              <TrendingUp className="inline h-3 w-3" />
                              {item.impact}
                            </span>
                            {item.value && (
                              <span className="text-sm">
                                <DollarSign className="inline h-3 w-3" />
                                ${(item.value / 1000000).toFixed(1)}M
                              </span>
                            )}
                            <span className="text-sm">
                              <Clock className="inline h-3 w-3" />
                              Due: {item.deadline}
                            </span>
                          </div>
                        </div>
                        <Button size="sm">
                          Take Action
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Generate RFQ</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Create RFQ with Indigenous preference criteria
                  </p>
                  <Button className="w-full">
                    <FileText className="h-4 w-4 mr-2" />
                    Create RFQ
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Find Suppliers</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Search Indigenous business directory
                  </p>
                  <Button className="w-full">
                    <Users className="h-4 w-4 mr-2" />
                    Search Directory
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Schedule Training</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    C-5 compliance training for teams
                  </p>
                  <Button className="w-full">
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Compliance by Category */}
              <Card>
                <CardHeader>
                  <CardTitle>Spend Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Indigenous', value: complianceData.indigenousContractValue },
                          { name: 'Non-Indigenous', value: complianceData.totalContractValue - complianceData.indigenousContractValue }
                        ]}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ percent }) => `${(percent * 100).toFixed(1)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        <Cell fill={COLORS.indigenous} />
                        <Cell fill={COLORS.nonIndigenous} />
                      </Pie>
                      <Tooltip formatter={(value) => `$${(value as number / 1000000).toFixed(1)}M`} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Forecast */}
              <Card>
                <CardHeader>
                  <CardTitle>12-Month Forecast</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={[
                      { month: 'Jul', current: 3.2, withActions: 3.2, target: 5 },
                      { month: 'Aug', current: 3.1, withActions: 3.5, target: 5 },
                      { month: 'Sep', current: 3.0, withActions: 4.0, target: 5 },
                      { month: 'Oct', current: 2.9, withActions: 4.5, target: 5 },
                      { month: 'Nov', current: 2.8, withActions: 4.8, target: 5 },
                      { month: 'Dec', current: 2.7, withActions: 5.2, target: 5 }
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis domain={[0, 6]} />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="current" stroke={COLORS.critical} name="Without Action" />
                      <Line type="monotone" dataKey="withActions" stroke={COLORS.success} name="With Actions" />
                      <Line type="monotone" dataKey="target" stroke={COLORS.target} strokeDasharray="5 5" name="Target" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}