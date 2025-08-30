'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  Building, 
  FileText, 
  DollarSign,
  TrendingUp,
  Activity,
  Mail,
  Target,
  Zap,
  Database,
  Server,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  BarChart3,
  Play,
  Pause,
  RefreshCw
} from 'lucide-react';

export default function AdminDashboard() {
  const [platformStats, setPlatformStats] = useState({
    // Business metrics
    totalBusinesses: 487234,
    indigenousBusinesses: 48921,
    verifiedBusinesses: 12453,
    claimedProfiles: 8234,
    
    // User metrics
    totalUsers: 15234,
    activeUsers: 3421,
    premiumUsers: 892,
    
    // Financial metrics
    mrr: 892000,
    arr: 10704000,
    totalRevenue: 2340000,
    avgCustomerValue: 999,
    
    // Platform activity
    rfqsActive: 342,
    rfqsTotal: 5621,
    totalMatches: 45234,
    emailsSent: 234521,
    emailsToday: 12453,
    
    // System health
    systemStatus: 'healthy',
    apiLatency: 45,
    errorRate: 0.02,
    uptime: 99.98,
    
    // Orchestration
    activeWorkflows: 23,
    jobsProcessing: 1234,
    eventsPerMinute: 523,
    
    // Growth metrics
    businessGrowth: 12.5,
    revenueGrowth: 34.2,
    userGrowth: 23.1
  });

  const [orchestrationStatus, setOrchestrationStatus] = useState({
    businessHunter: { status: 'running', collected: 234521, target: 500000 },
    emailCampaign: { status: 'active', sent: 12453, dailyLimit: 50000 },
    rfqMatching: { status: 'processing', processed: 89, pending: 12 },
    dataEnrichment: { status: 'running', enriched: 3421, queue: 523 }
  });

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Platform Admin Dashboard
          </h1>
          <p className="text-gray-600">
            Complete control center for Indigenous Platform operations
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center justify-between">
                <span>MRR</span>
                <DollarSign className="h-4 w-4 text-green-600" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${(platformStats.mrr / 1000).toFixed(0)}K
              </div>
              <div className="flex items-center text-sm text-green-600">
                <TrendingUp className="h-3 w-3 mr-1" />
                {platformStats.revenueGrowth}% growth
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center justify-between">
                <span>Total Businesses</span>
                <Building className="h-4 w-4 text-blue-600" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(platformStats.totalBusinesses / 1000).toFixed(0)}K
              </div>
              <Progress 
                value={(platformStats.totalBusinesses / 500000) * 100} 
                className="mt-2 h-2"
              />
              <p className="text-xs text-gray-500 mt-1">
                {((platformStats.totalBusinesses / 500000) * 100).toFixed(1)}% of target
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center justify-between">
                <span>Active Users</span>
                <Users className="h-4 w-4 text-purple-600" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {platformStats.activeUsers.toLocaleString()}
              </div>
              <div className="flex items-center text-sm text-purple-600">
                <TrendingUp className="h-3 w-3 mr-1" />
                {platformStats.userGrowth}% growth
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center justify-between">
                <span>System Health</span>
                <Activity className="h-4 w-4 text-green-600" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-lg font-semibold">Healthy</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {platformStats.uptime}% uptime
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Orchestration Control Panel */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Orchestration Control Center</span>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  <RefreshCw className="h-4 w-4 mr-1" /> Refresh
                </Button>
                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                  <Play className="h-4 w-4 mr-1" /> Deploy All
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Business Hunter Status */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-sm">Business Hunter</span>
                  <Badge variant="default" className="bg-green-500">
                    {orchestrationStatus.businessHunter.status}
                  </Badge>
                </div>
                <div className="text-2xl font-bold mb-1">
                  {(orchestrationStatus.businessHunter.collected / 1000).toFixed(0)}K
                </div>
                <Progress 
                  value={(orchestrationStatus.businessHunter.collected / orchestrationStatus.businessHunter.target) * 100}
                  className="h-2 mb-1"
                />
                <p className="text-xs text-gray-600">
                  {((orchestrationStatus.businessHunter.collected / orchestrationStatus.businessHunter.target) * 100).toFixed(1)}% of 500K target
                </p>
                <div className="flex gap-2 mt-3">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Pause className="h-3 w-3" />
                  </Button>
                  <Button size="sm" className="flex-1">
                    Boost
                  </Button>
                </div>
              </div>

              {/* Email Campaign Status */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-sm">Email Campaign</span>
                  <Badge variant="default" className="bg-blue-500">
                    {orchestrationStatus.emailCampaign.status}
                  </Badge>
                </div>
                <div className="text-2xl font-bold mb-1">
                  {orchestrationStatus.emailCampaign.sent.toLocaleString()}
                </div>
                <Progress 
                  value={(orchestrationStatus.emailCampaign.sent / orchestrationStatus.emailCampaign.dailyLimit) * 100}
                  className="h-2 mb-1"
                />
                <p className="text-xs text-gray-600">
                  {orchestrationStatus.emailCampaign.sent} / {(orchestrationStatus.emailCampaign.dailyLimit / 1000).toFixed(0)}K daily
                </p>
                <div className="flex gap-2 mt-3">
                  <Button size="sm" variant="outline" className="flex-1">
                    Stats
                  </Button>
                  <Button size="sm" className="flex-1">
                    Launch
                  </Button>
                </div>
              </div>

              {/* RFQ Matching Status */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-sm">RFQ Matching</span>
                  <Badge variant="default" className="bg-purple-500">
                    {orchestrationStatus.rfqMatching.status}
                  </Badge>
                </div>
                <div className="text-2xl font-bold mb-1">
                  {orchestrationStatus.rfqMatching.processed}
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  <span>{orchestrationStatus.rfqMatching.processed} processed</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-3 w-3 text-yellow-500" />
                  <span>{orchestrationStatus.rfqMatching.pending} pending</span>
                </div>
                <Button size="sm" className="w-full mt-3">
                  Process All
                </Button>
              </div>

              {/* Data Enrichment Status */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-sm">Enrichment</span>
                  <Badge variant="default" className="bg-orange-500">
                    {orchestrationStatus.dataEnrichment.status}
                  </Badge>
                </div>
                <div className="text-2xl font-bold mb-1">
                  {orchestrationStatus.dataEnrichment.enriched.toLocaleString()}
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Database className="h-3 w-3 text-blue-500" />
                  <span>{orchestrationStatus.dataEnrichment.queue} in queue</span>
                </div>
                <Button size="sm" className="w-full mt-3">
                  Accelerate
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Tabs */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="businesses">Businesses</TabsTrigger>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
            <TabsTrigger value="operations">Operations</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Platform Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Platform Activity (24h)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">New Businesses</span>
                      <span className="font-bold">+523</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Profile Claims</span>
                      <span className="font-bold">+89</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">RFQs Posted</span>
                      <span className="font-bold">+34</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Matches Made</span>
                      <span className="font-bold">+892</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Emails Sent</span>
                      <span className="font-bold">+{platformStats.emailsToday.toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start">
                    <Zap className="h-4 w-4 mr-2" />
                    Deploy Business Hunter Swarm
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Mail className="h-4 w-4 mr-2" />
                    Launch Email Campaign
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Target className="h-4 w-4 mr-2" />
                    Process All RFQ Matches
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Database className="h-4 w-4 mr-2" />
                    Backup Database
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Generate Reports
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Businesses Tab */}
          <TabsContent value="businesses" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Business Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Indigenous Verified</span>
                      <span className="font-bold">{platformStats.verifiedBusinesses.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Indigenous Unverified</span>
                      <span className="font-bold">
                        {(platformStats.indigenousBusinesses - platformStats.verifiedBusinesses).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Canadian Businesses</span>
                      <span className="font-bold">
                        {(platformStats.totalBusinesses - platformStats.indigenousBusinesses).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Profile Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Claimed</span>
                      <span className="font-bold">{platformStats.claimedProfiles.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Unclaimed</span>
                      <span className="font-bold">
                        {(platformStats.totalBusinesses - platformStats.claimedProfiles).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Claim Rate</span>
                      <span className="font-bold">
                        {((platformStats.claimedProfiles / platformStats.totalBusinesses) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Top Industries</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">IT Services</span>
                      <span className="font-bold">45,234</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Construction</span>
                      <span className="font-bold">38,921</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Consulting</span>
                      <span className="font-bold">32,456</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Revenue Tab */}
          <TabsContent value="revenue" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">ARR</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    ${(platformStats.arr / 1000000).toFixed(1)}M
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Total Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    ${(platformStats.totalRevenue / 1000000).toFixed(1)}M
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Premium Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {platformStats.premiumUsers}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">ARPU</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    ${platformStats.avgCustomerValue}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Revenue Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>C-5 Compliance Suite</span>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-500">423 customers</span>
                      <span className="font-bold">$422K/mo</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Enterprise Plan</span>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-500">89 customers</span>
                      <span className="font-bold">$267K/mo</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Indigenous Business (Free)</span>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-500">12,453 businesses</span>
                      <span className="font-bold">$0</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Operations Tab */}
          <TabsContent value="operations" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Workflows</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Active</span>
                      <Badge variant="default">{platformStats.activeWorkflows}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Completed (24h)</span>
                      <span className="font-bold">892</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Failed (24h)</span>
                      <span className="font-bold text-red-600">3</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Job Queues</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Processing</span>
                      <span className="font-bold">{platformStats.jobsProcessing}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Waiting</span>
                      <span className="font-bold">523</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Completed (1h)</span>
                      <span className="font-bold">8,234</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Events</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Events/min</span>
                      <span className="font-bold">{platformStats.eventsPerMinute}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Functions Active</span>
                      <span className="font-bold">45</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Webhooks</span>
                      <span className="font-bold">12</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* System Tab */}
          <TabsContent value="system" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">API Latency</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{platformStats.apiLatency}ms</div>
                  <Badge variant="default" className="mt-2">Excellent</Badge>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Error Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{platformStats.errorRate}%</div>
                  <Badge variant="default" className="mt-2">Low</Badge>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Uptime</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{platformStats.uptime}%</div>
                  <Badge variant="default" className="mt-2">SLA Met</Badge>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Database</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="font-semibold">Healthy</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">523 GB / 1 TB</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Service Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { name: 'API Gateway', status: 'healthy' },
                    { name: 'Business Service', status: 'healthy' },
                    { name: 'Email Service', status: 'healthy' },
                    { name: 'RFQ Service', status: 'healthy' },
                    { name: 'Payment Service', status: 'healthy' },
                    { name: 'Analytics', status: 'healthy' },
                    { name: 'Redis Cache', status: 'healthy' },
                    { name: 'PostgreSQL', status: 'healthy' }
                  ].map((service, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">{service.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}