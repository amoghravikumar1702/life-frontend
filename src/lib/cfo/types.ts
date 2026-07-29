export interface CompanyProfile {
  id: string;

  name: string;

  industry: string;

  businessModel: string;

  yearsInBusiness: number;

  employees: number;

  annualRevenue: number;

  monthlyRevenue: number;

  monthlyExpenses: number;

  businessGoal: string;

  growthStage:
    | "Startup"
    | "Growing"
    | "Established";

  riskAppetite:
    | "Low"
    | "Medium"
    | "High";
}

export interface FinancialMetrics {
  revenue: number;

  expenses: number;

  profit: number;

  grossMargin: number;

  netMargin: number;

  cashFlow: number;

  workingCapital: number;

  cashRunwayDays: number;

  outstandingReceivables: number;

  outstandingPayables: number;

  monthlyBurnRate: number;

  revenueGrowth: number;

  expenseGrowth: number;

  healthScore: number;
}

export interface CustomerMetrics {
  totalCustomers: number;

  activeCustomers: number;

  repeatCustomers: number;

  averageInvoiceValue: number;

  averagePaymentTime: number;

  customerConcentration: number;

  topCustomer: string;

  topCustomerRevenue: number;

  highestOutstandingCustomer: string;

  highestOutstandingAmount: number;
}

export interface BusinessRisk {
  id: string;

  title: string;

  description: string;

  severity:
    | "Low"
    | "Medium"
    | "High"
    | "Critical";

  recommendation: string;
}

export interface Forecast {
  next30Revenue: number;

  next30Expenses: number;

  next30Profit: number;

  expectedCashPosition: number;

  expectedGrowth: number;

  confidence: number;
}

export interface InvestmentSuggestion {
  category:
    | "Emergency Reserve"
    | "Marketing"
    | "Inventory"
    | "Hiring"
    | "Technology"
    | "Expansion"
    | "Debt Reduction"
    | "Owner Draw";

  amount: number;

  reason: string;

  expectedImpact: string;

  priority: number;
}

export interface ExecutivePriority {
  priority: number;

  title: string;

  explanation: string;

  expectedImpact: string;

  urgency:
    | "Low"
    | "Medium"
    | "High"
    | "Critical";
}

export interface ExecutiveReport {
  generatedAt: string;

  company: CompanyProfile;

  finance: FinancialMetrics;

  customers: CustomerMetrics;

  risks: BusinessRisk[];

  forecast: Forecast;

  investmentSuggestions: InvestmentSuggestion[];

  priorities: ExecutivePriority[];

  executiveSummary: string;

  finalRecommendation: string;
}