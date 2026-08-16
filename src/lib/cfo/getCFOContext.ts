import { createClient } from "@/lib/supabase/server";
import { getFinancialSnapshot } from "@/lib/finance/getFinancialSnapshot";

export async function getCFOContext() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("User is not authenticated.");
  }

  // ==========================================================
  // FINANCIAL SNAPSHOT
  // ==========================================================

  const snapshot = await getFinancialSnapshot();

  // ==========================================================
  // COMPANY
  // ==========================================================
  // employee_count is the OFFICIAL current workforce count.
  // Team Capacity updates this value.
  // ==========================================================

  const {
    data: company,
    error: companyError,
  } = await supabase
    .from("companies")
    .select(`
      id,
      industry,
      starting_revenue,
      employee_count
    `)
    .eq("owner_id", user.id)
    .single();

  if (companyError) {
    console.error(
      "[CFO] Failed to fetch company:",
      companyError
    );

    throw companyError;
  }

  // ==========================================================
  // OFFICIAL WORKFORCE COUNT
  // ==========================================================

  const currentEmployees = Math.max(
    0,
    Math.floor(
      Number(company.employee_count ?? 0)
    )
  );

  // ==========================================================
  // BUSINESS PROFILE
  // ==========================================================

  const {
    data: businessProfile,
    error: businessProfileError,
  } = await supabase
    .from("business_profiles")
    .select(`
      industry,
      answers,
      created_at,
      updated_at
    `)
    .eq("company_id", company.id)
    .maybeSingle();

  if (businessProfileError) {
    console.error(
      "[CFO] Failed to fetch business profile:",
      businessProfileError
    );

    throw businessProfileError;
  }

  // ==========================================================
  // INVOICES
  // ==========================================================

  const {
    data: invoices,
    error: invoicesError,
  } = await supabase
    .from("invoices")
    .select(`
      id,
      invoice_number,
      customer,
      invoice_date,
      due_date,
      total,
      amount_paid,
      balance_due,
      status
    `)
    .eq("owner_id", user.id)
    .order("invoice_date", {
      ascending: false,
    })
    .limit(50);

  if (invoicesError) {
    console.error(
      "[CFO] Failed to fetch invoices:",
      invoicesError
    );

    throw invoicesError;
  }

  // ==========================================================
  // EXPENSES
  // ==========================================================

  const {
    data: expenses,
    error: expensesError,
  } = await supabase
    .from("expenses")
    .select(`
      id,
      amount,
      category,
      description,
      vendor,
      expense_date,
      is_recurring
    `)
    .eq("owner_id", user.id)
    .order("expense_date", {
      ascending: false,
    })
    .limit(50);

  if (expensesError) {
    console.error(
      "[CFO] Failed to fetch expenses:",
      expensesError
    );

    throw expensesError;
  }

  // ==========================================================
  // EMPLOYEE DETAILS
  // ==========================================================
  // These are supplementary details only.
  // They DO NOT determine currentEmployees.
  // ==========================================================

  let workforce: Array<{
    id: string | number;
    name: string;
    role: string;
    department: string;
    monthlySalary: number;
    status: string;
    joinedAt: string | null;
  }> = [];

  const {
    data: workforceData,
    error: workforceError,
  } = await supabase
    .from("employees")
    .select(`
      id,
      name,
      role,
      department,
      monthly_salary,
      status,
      joined_at
    `)
    .eq("owner_id", user.id)
    .order("joined_at", {
      ascending: true,
    });

  if (workforceError) {
    console.warn(
      "[CFO] Workforce detail data unavailable:",
      workforceError.message
    );
  } else {
    workforce = (
      workforceData ?? []
    ).map((employee) => ({
      id: employee.id,

      name:
        typeof employee.name === "string"
          ? employee.name
          : "Employee",

      role:
        typeof employee.role === "string"
          ? employee.role
          : "Unspecified",

      department:
        typeof employee.department === "string"
          ? employee.department
          : "General",

      monthlySalary: Number(
        employee.monthly_salary ?? 0
      ),

      status:
        typeof employee.status === "string"
          ? employee.status
          : "active",

      joinedAt:
        employee.joined_at ?? null,
    }));
  }

  // ==========================================================
  // PAYROLL
  // ==========================================================

  const activeEmployees =
    workforce.filter((employee) => {
      const status =
        employee.status.toLowerCase();

      return (
        status === "active" ||
        status === "employed"
      );
    });

  const monthlyPayroll =
    activeEmployees.reduce(
      (total, employee) =>
        total +
        Math.max(
          0,
          Number(
            employee.monthlySalary
          ) || 0
        ),
      0
    );

  const annualPayroll =
    monthlyPayroll * 12;

  const averageMonthlySalary =
    activeEmployees.length > 0
      ? monthlyPayroll /
        activeEmployees.length
      : 0;

  const revenue = Number(
    snapshot.revenue ?? 0
  );

  const payrollToRevenue =
    revenue > 0
      ? (monthlyPayroll / revenue) * 100
      : 0;

  // ==========================================================
  // CUSTOMERS
  // ==========================================================

  const {
    data: customers,
    error: customersError,
  } = await supabase
    .from("customers")
    .select("*")
    .eq("owner_id", user.id)
    .limit(100);

  if (customersError) {
    console.error(
      "[CFO] Failed to fetch customers:",
      customersError
    );

    throw customersError;
  }

  // ==========================================================
  // BUSINESS INFORMATION
  // ==========================================================

  const industry =
    businessProfile?.industry ??
    company?.industry ??
    "Other";

  const answers =
    businessProfile?.answers &&
    typeof businessProfile.answers === "object"
      ? businessProfile.answers
      : {};

  // ==========================================================
  // FINAL CFO CONTEXT
  // ==========================================================

  return {
    business: {
      companyId: company.id,

      industry,

      startingRevenue: Number(
        company.starting_revenue ?? 0
      ),

      profile: {
        ...answers,

        // OFFICIAL TEAM CAPACITY
        employees: currentEmployees,
      },
    },

    financialSummary: {
      revenue: Number(
        snapshot.revenue ?? 0
      ),

      expenses: Number(
        snapshot.expenses ?? 0
      ),

      profit: Number(
        snapshot.profit ?? 0
      ),

      outstandingReceivables: Number(
        snapshot.outstandingReceivables ?? 0
      ),

      invoiceCount: Number(
        snapshot.invoiceCount ?? 0
      ),

      expenseCount: Number(
        snapshot.expenseCount ?? 0
      ),

      monthlyPayroll,

      annualPayroll,

      payrollToRevenue,

      averageMonthlySalary,
    },

    // ========================================================
    // WORKFORCE
    // ========================================================
    // THIS is the source the AI CFO uses for current employees.
    // ========================================================

    workforce: {
      currentEmployees,

      monthlyPayroll,

      annualPayroll,

      averageMonthlySalary,

      payrollToRevenue,

      employees: workforce,
    },

    snapshot,

    invoices: invoices ?? [],

    expenses: expenses ?? [],

    customers: customers ?? [],
  };
}