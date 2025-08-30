'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { 
  FileText,
  DollarSign,
  Calendar as CalendarIcon,
  Building,
  Users,
  Target,
  AlertTriangle,
  Info,
  CheckCircle,
  Plus,
  X,
  Upload,
  Sparkles,
  TrendingUp,
  Shield,
  Award,
  ArrowRight,
  Save,
  Eye
} from 'lucide-react';

export default function CreateRFQ() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;
  const progress = (currentStep / totalSteps) * 100;

  const [rfqData, setRfqData] = useState({
    // Basic Information
    title: '',
    category: '',
    subcategory: '',
    description: '',
    
    // Requirements
    deliverables: [''],
    requirements: [''],
    qualifications: [''],
    
    // Budget & Timeline
    budgetRange: { min: '', max: '' },
    budgetVisibility: 'range', // 'hidden', 'range', 'exact'
    startDate: undefined as Date | undefined,
    endDate: undefined as Date | undefined,
    submissionDeadline: undefined as Date | undefined,
    
    // Location & Preferences
    location: {
      province: '',
      city: '',
      remote: false,
      onsite: false,
      hybrid: false
    },
    
    // C-5 Compliance
    indigenousRequirement: false,
    indigenousPercentage: 5,
    indigenousPreference: 'required', // 'required', 'preferred', 'none'
    certificationRequired: false,
    
    // Evaluation Criteria
    evaluationCriteria: [
      { criterion: 'Technical Capability', weight: 40 },
      { criterion: 'Price', weight: 30 },
      { criterion: 'Experience', weight: 20 },
      { criterion: 'Timeline', weight: 10 }
    ],
    
    // Additional Options
    allowConsortium: false,
    requireBonding: false,
    requireInsurance: false,
    insuranceAmount: '',
    confidentialityRequired: false,
    
    // Documents
    attachments: [] as File[],
    
    // Visibility
    visibility: 'public', // 'public', 'invited', 'indigenous-only'
    invitedSuppliers: [] as string[]
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [isDraft, setIsDraft] = useState(false);

  const handleNext = () => {
    if (validateCurrentStep()) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  const validateCurrentStep = () => {
    const errors: Record<string, string> = {};
    
    switch (currentStep) {
      case 1:
        if (!rfqData.title) errors.title = 'Title is required';
        if (!rfqData.category) errors.category = 'Category is required';
        if (!rfqData.description) errors.description = 'Description is required';
        break;
      case 2:
        if (rfqData.deliverables.filter(d => d).length === 0) {
          errors.deliverables = 'At least one deliverable is required';
        }
        break;
      case 3:
        if (!rfqData.budgetRange.min) errors.budget = 'Minimum budget is required';
        if (!rfqData.submissionDeadline) errors.deadline = 'Submission deadline is required';
        break;
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (asDraft = false) => {
    setIsDraft(asDraft);
    
    if (!asDraft && !validateCurrentStep()) {
      return;
    }
    
    console.log('Submitting RFQ:', rfqData);
    // Submit to API
    
    router.push('/rfq/success');
  };

  const addArrayItem = (field: string) => {
    setRfqData({
      ...rfqData,
      [field]: [...(rfqData[field as keyof typeof rfqData] as string[]), '']
    });
  };

  const removeArrayItem = (field: string, index: number) => {
    const array = rfqData[field as keyof typeof rfqData] as string[];
    setRfqData({
      ...rfqData,
      [field]: array.filter((_, i) => i !== index)
    });
  };

  const updateArrayItem = (field: string, index: number, value: string) => {
    const array = [...(rfqData[field as keyof typeof rfqData] as string[])];
    array[index] = value;
    setRfqData({
      ...rfqData,
      [field]: array
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create RFQ</h1>
          <p className="text-gray-600">
            Post a Request for Quotation and get matched with qualified suppliers
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between mt-2 text-sm text-gray-600">
            <span className={currentStep >= 1 ? 'text-blue-600 font-semibold' : ''}>Basic Info</span>
            <span className={currentStep >= 2 ? 'text-blue-600 font-semibold' : ''}>Requirements</span>
            <span className={currentStep >= 3 ? 'text-blue-600 font-semibold' : ''}>Budget & Timeline</span>
            <span className={currentStep >= 4 ? 'text-blue-600 font-semibold' : ''}>Preferences</span>
            <span className={currentStep >= 5 ? 'text-blue-600 font-semibold' : ''}>Review</span>
          </div>
        </div>

        {/* C-5 Compliance Alert */}
        {currentStep === 1 && (
          <Alert className="mb-6 border-blue-500 bg-blue-50">
            <Shield className="h-4 w-4 text-blue-600" />
            <AlertTitle className="text-blue-800">Bill C-5 Compliance</AlertTitle>
            <AlertDescription className="text-blue-700">
              Federal contractors must allocate 5% of procurement to Indigenous businesses. 
              Enable Indigenous requirements to ensure compliance and access verified suppliers.
            </AlertDescription>
          </Alert>
        )}

        {/* Step 1: Basic Information */}
        {currentStep === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Provide the essential details about your RFQ</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="title">RFQ Title *</Label>
                <Input
                  id="title"
                  value={rfqData.title}
                  onChange={(e) => setRfqData({ ...rfqData, title: e.target.value })}
                  placeholder="e.g., IT Infrastructure Modernization Services"
                  className={validationErrors.title ? 'border-red-500' : ''}
                />
                {validationErrors.title && (
                  <p className="text-sm text-red-500 mt-1">{validationErrors.title}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={rfqData.category}
                    onValueChange={(value) => setRfqData({ ...rfqData, category: value })}
                  >
                    <SelectTrigger className={validationErrors.category ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="it-services">IT Services</SelectItem>
                      <SelectItem value="construction">Construction</SelectItem>
                      <SelectItem value="consulting">Consulting</SelectItem>
                      <SelectItem value="manufacturing">Manufacturing</SelectItem>
                      <SelectItem value="professional-services">Professional Services</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="subcategory">Subcategory</Label>
                  <Select
                    value={rfqData.subcategory}
                    onValueChange={(value) => setRfqData({ ...rfqData, subcategory: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select subcategory" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="software-development">Software Development</SelectItem>
                      <SelectItem value="cloud-services">Cloud Services</SelectItem>
                      <SelectItem value="network-infrastructure">Network Infrastructure</SelectItem>
                      <SelectItem value="cybersecurity">Cybersecurity</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={rfqData.description}
                  onChange={(e) => setRfqData({ ...rfqData, description: e.target.value })}
                  placeholder="Provide a detailed description of the project, scope of work, and objectives..."
                  rows={6}
                  className={validationErrors.description ? 'border-red-500' : ''}
                />
                <p className="text-sm text-gray-500 mt-1">
                  {rfqData.description.length}/2000 characters
                </p>
              </div>

              {/* Indigenous Requirement Toggle */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="indigenous"
                    checked={rfqData.indigenousRequirement}
                    onCheckedChange={(checked) => 
                      setRfqData({ ...rfqData, indigenousRequirement: checked as boolean })
                    }
                  />
                  <div className="flex-1">
                    <Label htmlFor="indigenous" className="text-base font-semibold cursor-pointer">
                      Enable Indigenous Business Requirements
                    </Label>
                    <p className="text-sm text-gray-600 mt-1">
                      Prioritize or require Indigenous suppliers for C-5 compliance
                    </p>
                    {rfqData.indigenousRequirement && (
                      <div className="mt-3 space-y-3">
                        <RadioGroup
                          value={rfqData.indigenousPreference}
                          onValueChange={(value) => 
                            setRfqData({ ...rfqData, indigenousPreference: value })
                          }
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="required" id="required" />
                            <Label htmlFor="required">Required (Indigenous businesses only)</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="preferred" id="preferred" />
                            <Label htmlFor="preferred">Preferred (scoring advantage)</Label>
                          </div>
                        </RadioGroup>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Requirements */}
        {currentStep === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Requirements & Deliverables</CardTitle>
              <CardDescription>Define what you need from suppliers</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Deliverables */}
              <div>
                <Label>Deliverables *</Label>
                <p className="text-sm text-gray-600 mb-3">List the specific deliverables expected</p>
                {rfqData.deliverables.map((deliverable, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <Input
                      value={deliverable}
                      onChange={(e) => updateArrayItem('deliverables', index, e.target.value)}
                      placeholder="e.g., Monthly progress reports"
                    />
                    {rfqData.deliverables.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeArrayItem('deliverables', index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addArrayItem('deliverables')}
                  className="mt-2"
                >
                  <Plus className="h-4 w-4 mr-1" /> Add Deliverable
                </Button>
              </div>

              {/* Requirements */}
              <div>
                <Label>Technical Requirements</Label>
                <p className="text-sm text-gray-600 mb-3">Specify technical or functional requirements</p>
                {rfqData.requirements.map((requirement, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <Input
                      value={requirement}
                      onChange={(e) => updateArrayItem('requirements', index, e.target.value)}
                      placeholder="e.g., ISO 27001 certification required"
                    />
                    {rfqData.requirements.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeArrayItem('requirements', index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addArrayItem('requirements')}
                  className="mt-2"
                >
                  <Plus className="h-4 w-4 mr-1" /> Add Requirement
                </Button>
              </div>

              {/* Qualifications */}
              <div>
                <Label>Supplier Qualifications</Label>
                <p className="text-sm text-gray-600 mb-3">Required qualifications or experience</p>
                {rfqData.qualifications.map((qualification, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <Input
                      value={qualification}
                      onChange={(e) => updateArrayItem('qualifications', index, e.target.value)}
                      placeholder="e.g., Minimum 5 years experience"
                    />
                    {rfqData.qualifications.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeArrayItem('qualifications', index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addArrayItem('qualifications')}
                  className="mt-2"
                >
                  <Plus className="h-4 w-4 mr-1" /> Add Qualification
                </Button>
              </div>

              {/* Additional Requirements */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Checkbox
                    id="bonding"
                    checked={rfqData.requireBonding}
                    onCheckedChange={(checked) => 
                      setRfqData({ ...rfqData, requireBonding: checked as boolean })
                    }
                  />
                  <Label htmlFor="bonding">Require bonding</Label>
                </div>

                <div className="flex items-center gap-3">
                  <Checkbox
                    id="insurance"
                    checked={rfqData.requireInsurance}
                    onCheckedChange={(checked) => 
                      setRfqData({ ...rfqData, requireInsurance: checked as boolean })
                    }
                  />
                  <Label htmlFor="insurance">Require insurance</Label>
                  {rfqData.requireInsurance && (
                    <Input
                      type="number"
                      value={rfqData.insuranceAmount}
                      onChange={(e) => setRfqData({ ...rfqData, insuranceAmount: e.target.value })}
                      placeholder="Amount"
                      className="w-32 ml-2"
                    />
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <Checkbox
                    id="consortium"
                    checked={rfqData.allowConsortium}
                    onCheckedChange={(checked) => 
                      setRfqData({ ...rfqData, allowConsortium: checked as boolean })
                    }
                  />
                  <Label htmlFor="consortium">Allow consortium/partnership bids</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Budget & Timeline */}
        {currentStep === 3 && (
          <Card>
            <CardHeader>
              <CardTitle>Budget & Timeline</CardTitle>
              <CardDescription>Set your budget range and project timeline</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Budget */}
              <div>
                <Label>Budget Range *</Label>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div>
                    <Label htmlFor="minBudget" className="text-sm">Minimum</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="minBudget"
                        type="number"
                        value={rfqData.budgetRange.min}
                        onChange={(e) => setRfqData({
                          ...rfqData,
                          budgetRange: { ...rfqData.budgetRange, min: e.target.value }
                        })}
                        className="pl-9"
                        placeholder="0"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="maxBudget" className="text-sm">Maximum</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="maxBudget"
                        type="number"
                        value={rfqData.budgetRange.max}
                        onChange={(e) => setRfqData({
                          ...rfqData,
                          budgetRange: { ...rfqData.budgetRange, max: e.target.value }
                        })}
                        className="pl-9"
                        placeholder="0"
                      />
                    </div>
                  </div>
                </div>
                
                <RadioGroup
                  value={rfqData.budgetVisibility}
                  onValueChange={(value) => setRfqData({ ...rfqData, budgetVisibility: value })}
                  className="mt-3"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="range" id="range" />
                    <Label htmlFor="range">Show budget range to suppliers</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="hidden" id="hidden" />
                    <Label htmlFor="hidden">Hide budget from suppliers</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Timeline */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Project Start Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !rfqData.startDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {rfqData.startDate ? format(rfqData.startDate, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={rfqData.startDate}
                        onSelect={(date) => setRfqData({ ...rfqData, startDate: date })}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <Label>Project End Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !rfqData.endDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {rfqData.endDate ? format(rfqData.endDate, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={rfqData.endDate}
                        onSelect={(date) => setRfqData({ ...rfqData, endDate: date })}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div>
                <Label>Submission Deadline *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !rfqData.submissionDeadline && "text-muted-foreground",
                        validationErrors.deadline && "border-red-500"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {rfqData.submissionDeadline ? format(rfqData.submissionDeadline, "PPP") : "Select deadline"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={rfqData.submissionDeadline}
                      onSelect={(date) => setRfqData({ ...rfqData, submissionDeadline: date })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {validationErrors.deadline && (
                  <p className="text-sm text-red-500 mt-1">{validationErrors.deadline}</p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Location & Preferences */}
        {currentStep === 4 && (
          <Card>
            <CardHeader>
              <CardTitle>Location & Preferences</CardTitle>
              <CardDescription>Specify location requirements and evaluation criteria</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Location */}
              <div>
                <Label>Location Requirements</Label>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <Select
                    value={rfqData.location.province}
                    onValueChange={(value) => setRfqData({
                      ...rfqData,
                      location: { ...rfqData.location, province: value }
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select province" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ON">Ontario</SelectItem>
                      <SelectItem value="BC">British Columbia</SelectItem>
                      <SelectItem value="AB">Alberta</SelectItem>
                      <SelectItem value="QC">Quebec</SelectItem>
                      <SelectItem value="MB">Manitoba</SelectItem>
                      <SelectItem value="SK">Saskatchewan</SelectItem>
                    </SelectContent>
                  </Select>

                  <Input
                    value={rfqData.location.city}
                    onChange={(e) => setRfqData({
                      ...rfqData,
                      location: { ...rfqData.location, city: e.target.value }
                    })}
                    placeholder="City"
                  />
                </div>

                <div className="flex gap-4 mt-3">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="remote"
                      checked={rfqData.location.remote}
                      onCheckedChange={(checked) => setRfqData({
                        ...rfqData,
                        location: { ...rfqData.location, remote: checked as boolean }
                      })}
                    />
                    <Label htmlFor="remote">Remote</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="onsite"
                      checked={rfqData.location.onsite}
                      onCheckedChange={(checked) => setRfqData({
                        ...rfqData,
                        location: { ...rfqData.location, onsite: checked as boolean }
                      })}
                    />
                    <Label htmlFor="onsite">On-site</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="hybrid"
                      checked={rfqData.location.hybrid}
                      onCheckedChange={(checked) => setRfqData({
                        ...rfqData,
                        location: { ...rfqData.location, hybrid: checked as boolean }
                      })}
                    />
                    <Label htmlFor="hybrid">Hybrid</Label>
                  </div>
                </div>
              </div>

              {/* Evaluation Criteria */}
              <div>
                <Label>Evaluation Criteria</Label>
                <p className="text-sm text-gray-600 mb-3">Define how proposals will be evaluated</p>
                {rfqData.evaluationCriteria.map((item, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <Input
                      value={item.criterion}
                      onChange={(e) => {
                        const updated = [...rfqData.evaluationCriteria];
                        updated[index].criterion = e.target.value;
                        setRfqData({ ...rfqData, evaluationCriteria: updated });
                      }}
                      placeholder="Criterion"
                      className="flex-1"
                    />
                    <Input
                      type="number"
                      value={item.weight}
                      onChange={(e) => {
                        const updated = [...rfqData.evaluationCriteria];
                        updated[index].weight = parseInt(e.target.value) || 0;
                        setRfqData({ ...rfqData, evaluationCriteria: updated });
                      }}
                      placeholder="Weight %"
                      className="w-24"
                    />
                  </div>
                ))}
                <p className="text-sm text-gray-500 mt-2">
                  Total weight: {rfqData.evaluationCriteria.reduce((sum, item) => sum + item.weight, 0)}%
                  {rfqData.evaluationCriteria.reduce((sum, item) => sum + item.weight, 0) !== 100 && 
                    <span className="text-orange-500"> (should equal 100%)</span>
                  }
                </p>
              </div>

              {/* Visibility */}
              <div>
                <Label>RFQ Visibility</Label>
                <RadioGroup
                  value={rfqData.visibility}
                  onValueChange={(value) => setRfqData({ ...rfqData, visibility: value })}
                  className="mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="public" id="public" />
                    <Label htmlFor="public">Public (all registered suppliers can view)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="indigenous-only" id="indigenous-only" />
                    <Label htmlFor="indigenous-only">Indigenous businesses only</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="invited" id="invited" />
                    <Label htmlFor="invited">Invited suppliers only</Label>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 5: Review & Submit */}
        {currentStep === 5 && (
          <Card>
            <CardHeader>
              <CardTitle>Review & Submit</CardTitle>
              <CardDescription>Review your RFQ before publishing</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Summary */}
                <div className="bg-gray-50 p-6 rounded-lg space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">Title</p>
                    <p className="font-semibold">{rfqData.title}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600">Category</p>
                    <p className="font-semibold">{rfqData.category}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600">Budget Range</p>
                    <p className="font-semibold">
                      ${parseInt(rfqData.budgetRange.min || '0').toLocaleString()} - 
                      ${parseInt(rfqData.budgetRange.max || '0').toLocaleString()}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600">Submission Deadline</p>
                    <p className="font-semibold">
                      {rfqData.submissionDeadline ? format(rfqData.submissionDeadline, "PPP") : 'Not set'}
                    </p>
                  </div>

                  {rfqData.indigenousRequirement && (
                    <div className="bg-green-100 p-3 rounded">
                      <p className="text-sm font-semibold text-green-800 flex items-center gap-2">
                        <Award className="h-4 w-4" />
                        Indigenous Requirement: {rfqData.indigenousPreference}
                      </p>
                    </div>
                  )}
                </div>

                {/* Expected Matches */}
                <Alert className="border-blue-500 bg-blue-50">
                  <Sparkles className="h-4 w-4 text-blue-600" />
                  <AlertTitle className="text-blue-800">Expected Matches</AlertTitle>
                  <AlertDescription className="text-blue-700">
                    Based on your requirements, we expect approximately <strong>23-45 qualified suppliers</strong> to 
                    match your RFQ. {rfqData.indigenousRequirement && 
                    <>Including <strong>12 verified Indigenous businesses</strong>.</>}
                  </AlertDescription>
                </Alert>

                {/* Actions */}
                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    onClick={() => handleSubmit(true)}
                    className="flex-1"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save as Draft
                  </Button>
                  <Button
                    onClick={() => handleSubmit(false)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Publish RFQ
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          {currentStep > 1 && (
            <Button variant="outline" onClick={handleBack}>
              Back
            </Button>
          )}
          {currentStep < totalSteps && (
            <Button onClick={handleNext} className="ml-auto">
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}