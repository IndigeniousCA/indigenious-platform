/**
 * C-5 Compliance Calculator
 * Calculates compliance scores and provides recommendations
 */

export interface ComplianceData {
  totalSpend: number;
  indigenousSpend: number;
  verifiedSuppliers: number;
  contracts: Contract[];
}

export interface Contract {
  id: string;
  value: number;
  isGovernment: boolean;
  requiresCompliance: boolean;
}

export interface ComplianceResult {
  percentage: number;
  status: ComplianceStatus;
  gap: number;
  requiredSpend: number;
  contractsAtRisk: number;
  recommendations: Recommendation[];
}

export interface Recommendation {
  priority: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  estimatedImpact: number;
  actionRequired: string;
}

export enum ComplianceStatus {
  NON_COMPLIANT = 'NON_COMPLIANT',
  WARNING = 'WARNING',
  MINIMUM = 'MINIMUM',
  GOOD = 'GOOD',
  EXCELLENT = 'EXCELLENT',
  LEADER = 'LEADER'
}

export class C5ComplianceCalculator {
  private static readonly MINIMUM_THRESHOLD = 5.0;
  private static readonly WARNING_THRESHOLD = 3.0;
  private static readonly GOOD_THRESHOLD = 7.5;
  private static readonly EXCELLENT_THRESHOLD = 10.0;
  private static readonly LEADER_THRESHOLD = 15.0;

  /**
   * Calculate compliance percentage and status
   */
  static calculate(data: ComplianceData): ComplianceResult {
    const percentage = (data.indigenousSpend / data.totalSpend) * 100;
    const status = this.getStatus(percentage);
    const gap = Math.max(0, this.MINIMUM_THRESHOLD - percentage);
    const requiredSpend = (data.totalSpend * this.MINIMUM_THRESHOLD / 100) - data.indigenousSpend;
    
    // Calculate contracts at risk if non-compliant
    const contractsAtRisk = data.contracts
      .filter(c => c.isGovernment && c.requiresCompliance)
      .reduce((sum, c) => sum + c.value, 0);

    const recommendations = this.generateRecommendations(
      percentage,
      status,
      requiredSpend,
      data.verifiedSuppliers
    );

    return {
      percentage,
      status,
      gap,
      requiredSpend: Math.max(0, requiredSpend),
      contractsAtRisk: percentage < this.MINIMUM_THRESHOLD ? contractsAtRisk : 0,
      recommendations
    };
  }

  /**
   * Get compliance status based on percentage
   */
  private static getStatus(percentage: number): ComplianceStatus {
    if (percentage < this.WARNING_THRESHOLD) {
      return ComplianceStatus.NON_COMPLIANT;
    } else if (percentage < this.MINIMUM_THRESHOLD) {
      return ComplianceStatus.WARNING;
    } else if (percentage < this.GOOD_THRESHOLD) {
      return ComplianceStatus.MINIMUM;
    } else if (percentage < this.EXCELLENT_THRESHOLD) {
      return ComplianceStatus.GOOD;
    } else if (percentage < this.LEADER_THRESHOLD) {
      return ComplianceStatus.EXCELLENT;
    } else {
      return ComplianceStatus.LEADER;
    }
  }

  /**
   * Generate actionable recommendations
   */
  private static generateRecommendations(
    percentage: number,
    status: ComplianceStatus,
    requiredSpend: number,
    currentSuppliers: number
  ): Recommendation[] {
    const recommendations: Recommendation[] = [];

    // Critical: Below minimum threshold
    if (status === ComplianceStatus.NON_COMPLIANT || status === ComplianceStatus.WARNING) {
      recommendations.push({
        priority: 'critical',
        title: 'Immediate Action Required',
        description: `Increase Indigenous procurement by $${(requiredSpend / 1000).toFixed(0)}K to meet C-5 requirements`,
        estimatedImpact: this.MINIMUM_THRESHOLD - percentage,
        actionRequired: 'Redirect procurement immediately'
      });

      recommendations.push({
        priority: 'critical',
        title: 'Risk of Contract Loss',
        description: 'Non-compliance may disqualify you from federal contracts',
        estimatedImpact: 100,
        actionRequired: 'Review federal contract requirements'
      });
    }

    // High: Need more suppliers
    if (currentSuppliers < 10) {
      recommendations.push({
        priority: 'high',
        title: 'Expand Supplier Network',
        description: `You only have ${currentSuppliers} Indigenous suppliers. Connect with more to ensure supply chain resilience`,
        estimatedImpact: 2.0,
        actionRequired: 'Browse Indigenous supplier directory'
      });
    }

    // Medium: Approaching deadline
    recommendations.push({
      priority: 'medium',
      title: 'Quarterly Reporting Due',
      description: 'Prepare your C-5 compliance report for government submission',
      estimatedImpact: 0,
      actionRequired: 'Generate compliance report'
    });

    // Positive reinforcement for good performance
    if (status === ComplianceStatus.EXCELLENT || status === ComplianceStatus.LEADER) {
      recommendations.push({
        priority: 'low',
        title: 'Maintain Excellence',
        description: `You're exceeding C-5 requirements at ${percentage.toFixed(1)}%. Consider sharing your success story`,
        estimatedImpact: 0,
        actionRequired: 'Generate PR content'
      });
    }

    return recommendations;
  }

  /**
   * Calculate monthly spend required to reach compliance
   */
  static calculateMonthlyTarget(
    currentPercentage: number,
    totalMonthlySpend: number,
    monthsRemaining: number
  ): number {
    if (currentPercentage >= this.MINIMUM_THRESHOLD) {
      return (totalMonthlySpend * this.MINIMUM_THRESHOLD) / 100;
    }

    const totalRequired = (totalMonthlySpend * monthsRemaining * this.MINIMUM_THRESHOLD) / 100;
    const currentIndigenousSpend = (totalMonthlySpend * currentPercentage) / 100;
    const gap = totalRequired - (currentIndigenousSpend * monthsRemaining);

    return (currentIndigenousSpend + (gap / monthsRemaining));
  }

  /**
   * Project future compliance based on current trajectory
   */
  static projectCompliance(
    currentPercentage: number,
    monthlyGrowthRate: number,
    monthsAhead: number
  ): number[] {
    const projections: number[] = [];
    let projected = currentPercentage;

    for (let i = 0; i < monthsAhead; i++) {
      projected = projected * (1 + monthlyGrowthRate / 100);
      projections.push(Math.min(projected, 100));
    }

    return projections;
  }

  /**
   * Calculate financial impact of non-compliance
   */
  static calculateFinancialImpact(
    contractsAtRisk: number,
    probabilityOfLoss: number = 0.3,
    reputationalDamage: number = 0.05
  ): {
    directLoss: number;
    reputationalLoss: number;
    totalImpact: number;
  } {
    const directLoss = contractsAtRisk * probabilityOfLoss;
    const reputationalLoss = contractsAtRisk * reputationalDamage;
    const totalImpact = directLoss + reputationalLoss;

    return {
      directLoss,
      reputationalLoss,
      totalImpact
    };
  }
}