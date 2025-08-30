'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  Building,
  Calendar,
  DollarSign,
  MapPin,
  Users,
  FileText,
  Clock,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Award,
  Shield,
  Target,
  BarChart3,
  Download,
  Send,
  Sparkles,
  Brain,
  Zap,
  ChevronRight
} from 'lucide-react';

export default function ViewRFQ() {
  const params = useParams();
  const router = useRouter();
  
  // Mock RFQ data (would come from API)
  const [rfqData] = useState({
    id: params.rfqId,
    title: 'Cloud Infrastructure Migration and Modernization',
    status: 'open',
    category: 'IT Services',
    subcategory: 'Cloud Services',
    
    // Buyer info
    buyer: {
      name: 'Department of Innovation',
      type: 'Federal Government',
      verified: true,
      contractValue: 125000000,
      activeRFQs: 12
    },
    
    // Details
    description: `We are seeking qualified vendors to provide comprehensive cloud infrastructure migration services for our legacy systems. This project involves migrating 50+ applications from on-premises data centers to a modern cloud environment.
    
Key objectives:
• Migrate existing applications to cloud-native architecture
• Implement DevOps practices and CI/CD pipelines
• Ensure zero downtime during migration
• Provide training and knowledge transfer to internal teams
• Establish monitoring and security frameworks`,
    
    // Requirements
    deliverables: [
      'Migration strategy and roadmap',
      'Cloud architecture design',
      'Application migration (50+ apps)',
      'DevOps implementation',
      'Documentation and training',
      'Post-migration support (6 months)'
    ],
    
    requirements: [
      'Minimum 5 years cloud migration experience',
      'AWS and Azure certifications required',
      'ISO 27001 compliance',
      'Canadian data residency',
      'Security clearance (Reliability Status)'
    ],
    
    // Budget & Timeline
    budget: {
      min: 2000000,
      max: 3500000,
      visibility: 'range'
    },
    
    timeline: {
      startDate: '2024-04-01',
      endDate: '2025-03-31',
      submissionDeadline: '2024-02-15',
      daysRemaining: 14
    },
    
    // Location
    location: {
      province: 'ON',
      city: 'Ottawa',
      remote: true,
      onsite: true,
      hybrid: true
    },
    
    // C-5 Compliance
    indigenousRequirement: true,
    indigenousPreference: 'preferred',
    certificationRequired: false,
    
    // Evaluation
    evaluationCriteria: [
      { criterion: 'Technical Approach', weight: 35 },
      { criterion: 'Price', weight: 25 },
      { criterion: 'Experience', weight: 20 },
      { criterion: 'Team Qualifications', weight: 10 },
      { criterion: 'Indigenous Participation', weight: 10 }
    ],
    
    // Stats
    stats: {
      views: 523,
      downloads: 89,
      questions: 12,
      responses: 7,
      averageScore: 82
    },
    
    // Attachments
    attachments: [
      { name: 'RFQ_Document.pdf', size: '2.3 MB' },
      { name: 'Technical_Requirements.xlsx', size: '456 KB' },
      { name: 'Security_Standards.pdf', size: '1.1 MB' }
    ]
  });

  // Mock user/business data
  const [currentBusiness] = useState({
    id: 'bus_123',
    name: 'Eagle Technologies Inc.',
    isIndigenous: true,
    hasResponded: false,
    matchScore: 87,
    winProbability: 0.72,
    strengths: [
      '10+ years cloud migration experience',
      'AWS Advanced Partner',
      'Indigenous-owned (CCAB Certified)',
      'Local presence in Ottawa'
    ],
    gaps: [
      'Azure certification pending',
      'Security clearance in progress'
    ],
    recommendations: [
      'Emphasize your AWS expertise',
      'Highlight similar government projects',
      'Partner for Azure requirements'
    ]
  });

  const [selectedTab, setSelectedTab] = useState('overview');

  const handleRespond = () => {
    router.push(`/rfq/${params.rfqId}/respond`);
  };

  const handleDownload = (fileName: string) => {
    console.log(`Downloading ${fileName}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {rfqData.title}
              </h1>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <Building className="h-4 w-4" />
                  {rfqData.buyer.name}
                </span>
                <span className="flex items-center gap-1">
                  <FileText className="h-4 w-4" />
                  {rfqData.category}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Closes in {rfqData.timeline.daysRemaining} days
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="default" className="bg-green-500">
                {rfqData.status.toUpperCase()}
              </Badge>
              {rfqData.buyer.verified && (
                <Badge variant="outline" className="border-blue-500">
                  <Shield className="h-3 w-3 mr-1" />
                  Verified Buyer
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Match Score Alert (for matched businesses) */}
        {currentBusiness.matchScore > 80 && (
          <Alert className="mb-6 border-green-500 bg-green-50">
            <Sparkles className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-800">Excellent Match!</AlertTitle>
            <AlertDescription className="text-green-700">
              Your business has an <strong>{currentBusiness.matchScore}% match score</strong> for this RFQ 
              with a <strong>{Math.round(currentBusiness.winProbability * 100)}% win probability</strong>.
              {currentBusiness.isIndigenous && rfqData.indigenousRequirement && 
                <> You have a scoring advantage as an Indigenous business.</>
              }
            </AlertDescription>
          </Alert>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <DollarSign className="h-8 w-8 text-green-600" />
                <div className="text-right">
                  <p className="text-sm text-gray-600">Budget</p>
                  <p className="text-lg font-bold">
                    ${(rfqData.budget.max / 1000000).toFixed(1)}M
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <Clock className="h-8 w-8 text-blue-600" />
                <div className="text-right">
                  <p className="text-sm text-gray-600">Timeline</p>
                  <p className="text-lg font-bold">12 months</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <Users className="h-8 w-8 text-purple-600" />
                <div className="text-right">
                  <p className="text-sm text-gray-600">Responses</p>
                  <p className="text-lg font-bold">{rfqData.stats.responses}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <Target className="h-8 w-8 text-orange-600" />
                <div className="text-right">
                  <p className="text-sm text-gray-600">Your Score</p>
                  <p className="text-lg font-bold">{currentBusiness.matchScore}%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <TrendingUp className="h-8 w-8 text-green-600" />
                <div className="text-right">
                  <p className="text-sm text-gray-600">Win Chance</p>
                  <p className="text-lg font-bold">
                    {Math.round(currentBusiness.winProbability * 100)}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Tabs value={selectedTab} onValueChange={setSelectedTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="requirements">Requirements</TabsTrigger>
                <TabsTrigger value="evaluation">Evaluation</TabsTrigger>
                <TabsTrigger value="qa">Q&A</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose max-w-none">
                      <p className="whitespace-pre-wrap">{rfqData.description}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Key Deliverables</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {rfqData.deliverables.map((item, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Timeline & Location</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Project Start</p>
                        <p className="font-semibold">{rfqData.timeline.startDate}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Project End</p>
                        <p className="font-semibold">{rfqData.timeline.endDate}</p>
                      </div>
                    </div>
                    <Separator />
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Location</p>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>{rfqData.location.city}, {rfqData.location.province}</span>
                      </div>
                      <div className="flex gap-2 mt-2">
                        {rfqData.location.remote && <Badge variant="outline">Remote</Badge>}
                        {rfqData.location.onsite && <Badge variant="outline">On-site</Badge>}
                        {rfqData.location.hybrid && <Badge variant="outline">Hybrid</Badge>}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Requirements Tab */}
              <TabsContent value="requirements" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Mandatory Requirements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {rfqData.requirements.map((req, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <div className="mt-1">
                            <div className="h-2 w-2 bg-blue-500 rounded-full" />
                          </div>
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {rfqData.indigenousRequirement && (
                  <Card className="border-green-500">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Award className="h-5 w-5 text-green-600" />
                        Indigenous Business Preference
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700">
                        This RFQ gives {rfqData.indigenousPreference === 'required' ? 'requires' : 'preference to'} Indigenous businesses 
                        for Bill C-5 compliance. Indigenous suppliers receive additional scoring weight in the evaluation.
                      </p>
                      {currentBusiness.isIndigenous && (
                        <Alert className="mt-4 border-green-200 bg-green-50">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <AlertDescription className="text-green-800">
                            Your business qualifies for Indigenous preference scoring
                          </AlertDescription>
                        </Alert>
                      )}
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Evaluation Tab */}
              <TabsContent value="evaluation" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Evaluation Criteria</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {rfqData.evaluationCriteria.map((criterion, index) => (
                        <div key={index}>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">{criterion.criterion}</span>
                            <span className="text-sm text-gray-600">{criterion.weight}%</span>
                          </div>
                          <Progress value={criterion.weight} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Submission Requirements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-gray-400" />
                        Technical proposal (max 50 pages)
                      </li>
                      <li className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-gray-400" />
                        Financial proposal (separate document)
                      </li>
                      <li className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-gray-400" />
                        Team resumes and certifications
                      </li>
                      <li className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-gray-400" />
                        References (minimum 3)
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Q&A Tab */}
              <TabsContent value="qa" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Questions & Answers</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="border-l-4 border-blue-500 pl-4">
                        <p className="font-semibold">Q: Can international partners be included?</p>
                        <p className="text-gray-600 mt-1">
                          A: Yes, but the prime contractor must be Canadian with required certifications.
                        </p>
                      </div>
                      <div className="border-l-4 border-blue-500 pl-4">
                        <p className="font-semibold">Q: Is there an incumbent?</p>
                        <p className="text-gray-600 mt-1">
                          A: This is a new initiative with no incumbent vendor.
                        </p>
                      </div>
                      <div className="border-l-4 border-blue-500 pl-4">
                        <p className="font-semibold">Q: Are site visits required?</p>
                        <p className="text-gray-600 mt-1">
                          A: Optional site visit scheduled for Feb 1, 2024. Register via email.
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full mt-4">
                      Ask a Question
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Action Card */}
            <Card className="border-2 border-blue-500">
              <CardHeader>
                <CardTitle>Your Response</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {!currentBusiness.hasResponded ? (
                  <>
                    <Alert className="border-orange-200 bg-orange-50">
                      <Clock className="h-4 w-4 text-orange-600" />
                      <AlertDescription className="text-orange-700">
                        <strong>{rfqData.timeline.daysRemaining} days</strong> remaining to submit
                      </AlertDescription>
                    </Alert>
                    
                    <Button 
                      className="w-full bg-blue-600 hover:bg-blue-700" 
                      size="lg"
                      onClick={handleRespond}
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Respond to RFQ
                    </Button>
                    
                    <Button variant="outline" className="w-full">
                      Save for Later
                    </Button>
                  </>
                ) : (
                  <Alert className="border-green-200 bg-green-50">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-700">
                      Response submitted on Jan 28, 2024
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            {/* AI Insights Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-purple-600" />
                  AI Bid Assistant
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-semibold text-green-600 mb-2">Your Strengths</p>
                  <ul className="space-y-1 text-sm">
                    {currentBusiness.strengths.map((strength, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="h-3 w-3 text-green-500 mt-0.5" />
                        <span>{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {currentBusiness.gaps.length > 0 && (
                  <div>
                    <p className="text-sm font-semibold text-orange-600 mb-2">Gaps to Address</p>
                    <ul className="space-y-1 text-sm">
                      {currentBusiness.gaps.map((gap, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <AlertTriangle className="h-3 w-3 text-orange-500 mt-0.5" />
                          <span>{gap}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div>
                  <p className="text-sm font-semibold text-blue-600 mb-2">Recommendations</p>
                  <ul className="space-y-1 text-sm">
                    {currentBusiness.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Zap className="h-3 w-3 text-blue-500 mt-0.5" />
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Button variant="outline" className="w-full">
                  Get Full Analysis
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>

            {/* Documents Card */}
            <Card>
              <CardHeader>
                <CardTitle>RFQ Documents</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {rfqData.attachments.map((doc, index) => (
                    <div 
                      key={index}
                      className="flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer"
                      onClick={() => handleDownload(doc.name)}
                    >
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium">{doc.name}</p>
                          <p className="text-xs text-gray-500">{doc.size}</p>
                        </div>
                      </div>
                      <Download className="h-4 w-4 text-gray-400" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Buyer Info Card */}
            <Card>
              <CardHeader>
                <CardTitle>About the Buyer</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Organization</p>
                    <p className="font-semibold">{rfqData.buyer.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Type</p>
                    <p className="font-semibold">{rfqData.buyer.type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Annual Contract Value</p>
                    <p className="font-semibold">
                      ${(rfqData.buyer.contractValue / 1000000).toFixed(0)}M
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Active RFQs</p>
                    <p className="font-semibold">{rfqData.buyer.activeRFQs}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}