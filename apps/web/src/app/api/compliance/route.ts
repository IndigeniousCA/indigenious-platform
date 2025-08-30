import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { C5ComplianceCalculator, ComplianceData } from '@/lib/compliance/calculator';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    // Get organization ID from auth or query params
    const organizationId = request.nextUrl.searchParams.get('org_id');
    
    if (!organizationId) {
      // Return demo data if no org specified
      return NextResponse.json(getDemoComplianceData());
    }

    // Fetch organization's compliance data
    const { data: orgData, error: orgError } = await supabase
      .from('organizations')
      .select('*')
      .eq('id', organizationId)
      .single();

    if (orgError) {
      throw new Error('Organization not found');
    }

    // Fetch procurement data
    const { data: contracts, error: contractError } = await supabase
      .from('contracts')
      .select('*')
      .eq('organization_id', organizationId);

    if (contractError) {
      throw new Error('Failed to fetch contracts');
    }

    // Calculate Indigenous spend
    const indigenousSpend = contracts
      ?.filter(c => c.supplier_is_indigenous)
      .reduce((sum, c) => sum + c.value, 0) || 0;

    const totalSpend = contracts
      ?.reduce((sum, c) => sum + c.value, 0) || 0;

    // Get verified suppliers count
    const { count: supplierCount } = await supabase
      .from('organization_suppliers')
      .select('*', { count: 'exact' })
      .eq('organization_id', organizationId)
      .eq('indigenous_verified', true);

    // Prepare compliance data
    const complianceData: ComplianceData = {
      totalSpend,
      indigenousSpend,
      verifiedSuppliers: supplierCount || 0,
      contracts: contracts?.map(c => ({
        id: c.id,
        value: c.value,
        isGovernment: c.is_government,
        requiresCompliance: c.requires_c5_compliance
      })) || []
    };

    // Calculate compliance
    const result = C5ComplianceCalculator.calculate(complianceData);

    // Get historical data for trends
    const { data: history } = await supabase
      .from('compliance_history')
      .select('*')
      .eq('organization_id', organizationId)
      .order('month', { ascending: false })
      .limit(12);

    // Get available Indigenous suppliers
    const { count: availableSuppliers } = await supabase
      .from('businesses')
      .select('*', { count: 'exact' })
      .eq('is_indigenous', true)
      .eq('verified', true)
      .in('industry', orgData.industries || []);

    return NextResponse.json({
      organization: {
        id: orgData.id,
        name: orgData.name,
        industries: orgData.industries
      },
      current: {
        percentage: result.percentage,
        status: result.status,
        totalSpend,
        indigenousSpend,
        gap: result.gap,
        requiredSpend: result.requiredSpend,
        contractsAtRisk: result.contractsAtRisk,
        verifiedSuppliers: supplierCount || 0,
        availableSuppliers: availableSuppliers || 0
      },
      recommendations: result.recommendations,
      history: history || [],
      projections: C5ComplianceCalculator.projectCompliance(
        result.percentage,
        0.5, // 0.5% monthly growth
        12 // 12 months ahead
      )
    });

  } catch (error) {
    console.error('Compliance API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch compliance data' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { organizationId, action, data } = body;

    switch (action) {
      case 'generate_report':
        // Generate compliance report
        const report = await generateComplianceReport(organizationId);
        return NextResponse.json({ report });

      case 'set_alert':
        // Set compliance alert
        const alert = await setComplianceAlert(organizationId, data);
        return NextResponse.json({ alert });

      case 'request_suppliers':
        // Request Indigenous supplier matches
        const suppliers = await requestSupplierMatches(organizationId, data);
        return NextResponse.json({ suppliers });

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Compliance POST error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}

// Helper functions
async function generateComplianceReport(organizationId: string) {
  // Generate PDF report for government submission
  return {
    id: `report-${Date.now()}`,
    organizationId,
    generatedAt: new Date().toISOString(),
    status: 'ready',
    downloadUrl: `/api/compliance/report/${organizationId}`
  };
}

async function setComplianceAlert(organizationId: string, alertData: any) {
  const { data, error } = await supabase
    .from('compliance_alerts')
    .insert({
      organization_id: organizationId,
      threshold: alertData.threshold,
      email: alertData.email,
      frequency: alertData.frequency,
      active: true
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

async function requestSupplierMatches(organizationId: string, criteria: any) {
  const { data, error } = await supabase
    .from('businesses')
    .select('*')
    .eq('is_indigenous', true)
    .eq('verified', true)
    .in('industry', criteria.industries || [])
    .limit(20);

  if (error) throw error;
  return data;
}

// Demo data for testing
function getDemoComplianceData() {
  return {
    organization: {
      id: 'demo',
      name: 'Demo Corporation',
      industries: ['Information Technology', 'Consulting']
    },
    current: {
      percentage: 3.2,
      status: 'NON_COMPLIANT',
      totalSpend: 4250000,
      indigenousSpend: 136000,
      gap: 1.8,
      requiredSpend: 76500,
      contractsAtRisk: 12500000,
      verifiedSuppliers: 8,
      availableSuppliers: 127
    },
    recommendations: [
      {
        priority: 'critical',
        title: 'Immediate Action Required',
        description: 'Increase Indigenous procurement by $77K to meet C-5 requirements',
        estimatedImpact: 1.8,
        actionRequired: 'Redirect procurement immediately'
      },
      {
        priority: 'critical',
        title: 'Risk of Contract Loss',
        description: 'Non-compliance may disqualify you from federal contracts',
        estimatedImpact: 100,
        actionRequired: 'Review federal contract requirements'
      },
      {
        priority: 'high',
        title: 'Expand Supplier Network',
        description: 'You only have 8 Indigenous suppliers. Connect with more to ensure supply chain resilience',
        estimatedImpact: 2.0,
        actionRequired: 'Browse Indigenous supplier directory'
      }
    ],
    history: [
      { month: '2025-08', percentage: 3.2 },
      { month: '2025-07', percentage: 4.0 },
      { month: '2025-06', percentage: 3.8 },
      { month: '2025-05', percentage: 3.5 },
      { month: '2025-04', percentage: 3.1 },
      { month: '2025-03', percentage: 2.8 }
    ],
    projections: [3.22, 3.23, 3.25, 3.27, 3.28, 3.30, 3.32, 3.33, 3.35, 3.37, 3.38, 3.40]
  };
}