import { CFOContext } from "./cfoContext";

/*
 * ============================================================
 * DhanarkOS AI CFO — DECISION ENGINE
 * ============================================================
 *
 * Phase 4
 *
 * Purpose:
 *
 * Convert a natural-language CFO question into a deterministic
 * financial decision context BEFORE the question reaches OpenAI.
 *
 * IMPORTANT:
 *
 * - No OpenAI calls.
 * - No external APIs.
 * - No database calls.
 * - No user-controlled financial calculations.
 * - No invented financial values.
 *
 * This layer gives the AI CFO structured financial evidence,
 * priorities and a recommended next action.
 */

/*
 * ============================================================
 * DECISION TYPES
 * ============================================================
 */

export type CFODecisionType =
  | "next_step"
  | "hiring"
  | "spending"
  | "cash"
  | "collections"
  | "growth"
  | "pricing"
  | "expenses"
  | "profitability"
  | "customer"
  | "general";

/*
 * ============================================================
 * PRIORITY
 * ============================================================
 */

export type CFODecisionPriority =
  | "critical"
  | "high"
  | "medium"
  | "low";

/*
 * ============================================================
 * DECISION CONTEXT
 * ============================================================
 */

export interface CFODecisionContext {
  type: CFODecisionType;

  question: string;

  priority: CFODecisionPriority;

  recommendationBasis: string[];

  financialEvidence: {
    availableCash: number;
    monthlyRevenue: number;
    monthlyExpenses: number;
    monthlyProfit: number;

    outstandingReceivables: number;

    cashRunwayDays: number;

    revenueGrowth: number;
    expenseGrowth: number;

    healthScore: number;
  };

  decision: {
    affordable: boolean;
    amount: number;
    explanation: string;
  };

  nextAction: string;
}

/*
 * ============================================================
 * SAFE NUMBER
 * ============================================================
 */

function safeNumber(
  value: unknown,
  fallback = 0
): number {
  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : fallback;
}

/*
 * ============================================================
 * SAFE NON-NEGATIVE NUMBER
 * ============================================================
 */

function safeNonNegativeNumber(
  value: unknown,
  fallback = 0
): number {
  return Math.max(
    0,
    safeNumber(
      value,
      fallback
    )
  );
}

/*
 * ============================================================
 * SAFE TEXT
 * ============================================================
 */

function safeText(
  value: unknown,
  fallback = ""
): string {
  if (
    typeof value !== "string"
  ) {
    return fallback;
  }

  return value.trim();
}

/*
 * ============================================================
 * INR FORMATTER
 * ============================================================
 */

function formatINR(
  value: unknown
): string {
  return safeNumber(
    value
  ).toLocaleString(
    "en-IN",
    {
      maximumFractionDigits: 0,
    }
  );
}

/*
 * ============================================================
 * QUESTION NORMALIZATION
 * ============================================================
 */

function normalizeQuestion(
  question: string
): string {
  return safeText(
    question
  ).slice(0, 500);
}

/*
 * ============================================================
 * QUESTION CLASSIFICATION
 * ============================================================
 *
 * This intentionally runs locally.
 *
 * It costs ZERO OpenAI tokens.
 *
 * Classification order matters.
 * More specific financial intents are checked before broad
 * categories such as growth or customer.
 */

/*
 * ============================================================
 * NEXT STEP KEYWORDS
 * ============================================================
 */

function isNextStepQuestion(
  q: string
): boolean {
  return (
    q.includes("what should i do") ||
    q.includes("what do i do") ||
    q.includes("what should we do") ||
    q.includes("what next") ||
    q.includes("next step") ||
    q.includes("next move") ||
    q.includes("what should i focus") ||
    q.includes("where should i focus") ||
    q.includes("what is the next") ||
    q.includes("what's the next") ||
    q.includes("best next action") ||
    q.includes("best next step") ||
    q.includes("what action should") ||
    q.includes("what should be my priority")
  );
}

/*
 * ============================================================
 * HIRING KEYWORDS
 * ============================================================
 */

function isHiringQuestion(
  q: string
): boolean {
  return (
    q.includes("hire") ||
    q.includes("hiring") ||
    q.includes("employee") ||
    q.includes("employees") ||
    q.includes("staff") ||
    q.includes("workforce") ||
    q.includes("team") ||
    q.includes("salary") ||
    q.includes("salaries") ||
    q.includes("payroll") ||
    q.includes("new employee") ||
    q.includes("another employee")
  );
}

/*
 * ============================================================
 * COLLECTION KEYWORDS
 * ============================================================
 */

function isCollectionsQuestion(
  q: string
): boolean {
  return (
    q.includes("collect") ||
    q.includes("collection") ||
    q.includes("receivable") ||
    q.includes("receivables") ||
    q.includes("outstanding") ||
    q.includes("overdue") ||
    q.includes("unpaid") ||
    q.includes("payment") ||
    q.includes("payments") ||
    q.includes("customer owes") ||
    q.includes("money owed") ||
    q.includes("invoice due")
  );
}

/*
 * ============================================================
 * PRICING KEYWORDS
 * ============================================================
 */

function isPricingQuestion(
  q: string
): boolean {
  return (
    q.includes("price") ||
    q.includes("pricing") ||
    q.includes("charge") ||
    q.includes("increase my price") ||
    q.includes("raise price") ||
    q.includes("raise my price") ||
    q.includes("discount") ||
    q.includes("discounting") ||
    q.includes("how much should i charge")
  );
}

/*
 * ============================================================
 * SPENDING KEYWORDS
 * ============================================================
 */

function isSpendingQuestion(
  q: string
): boolean {
  return (
    q.includes("spend") ||
    q.includes("spending") ||
    q.includes("afford") ||
    q.includes("buy") ||
    q.includes("purchase") ||
    q.includes("invest") ||
    q.includes("investment") ||
    q.includes("marketing budget") ||
    q.includes("budget") ||
    q.includes("can i spend") ||
    q.includes("can we spend")
  );
}

/*
 * ============================================================
 * EXPENSE KEYWORDS
 * ============================================================
 */

function isExpenseQuestion(
  q: string
): boolean {
  return (
    q.includes("expense") ||
    q.includes("expenses") ||
    q.includes("cost") ||
    q.includes("costs") ||
    q.includes("cut") ||
    q.includes("reduce spending") ||
    q.includes("reduce expenses") ||
    q.includes("save money") ||
    q.includes("lower expenses") ||
    q.includes("where can i cut")
  );
}

/*
 * ============================================================
 * GROWTH KEYWORDS
 * ============================================================
 */

function isGrowthQuestion(
  q: string
): boolean {
  return (
    q.includes("grow") ||
    q.includes("growth") ||
    q.includes("scale") ||
    q.includes("scaling") ||
    q.includes("revenue") ||
    q.includes("sales") ||
    q.includes("increase revenue") ||
    q.includes("increase sales") ||
    q.includes("make more money") ||
    q.includes("grow revenue")
  );
}

/*
 * ============================================================
 * CASH KEYWORDS
 * ============================================================
 */

function isCashQuestion(
  q: string
): boolean {
  return (
    q.includes("cash") ||
    q.includes("runway") ||
    q.includes("liquidity") ||
    q.includes("burn") ||
    q.includes("cash flow") ||
    q.includes("cashflow") ||
    q.includes("cash position")
  );
}

/*
 * ============================================================
 * PROFITABILITY KEYWORDS
 * ============================================================
 */

function isProfitabilityQuestion(
  q: string
): boolean {
  return (
    q.includes("profit") ||
    q.includes("profitable") ||
    q.includes("margin") ||
    q.includes("loss") ||
    q.includes("losing money") ||
    q.includes("break even") ||
    q.includes("break-even") ||
    q.includes("break even point")
  );
}

/*
 * ============================================================
 * CUSTOMER KEYWORDS
 * ============================================================
 */

function isCustomerQuestion(
  q: string
): boolean {
  return (
    q.includes("customer") ||
    q.includes("customers") ||
    q.includes("client") ||
    q.includes("clients") ||
    q.includes("concentration") ||
    q.includes("top customer") ||
    q.includes("best customer")
  );
}

/*
 * ============================================================
 * QUESTION CLASSIFICATION
 * ============================================================
 */

function classifyQuestion(
  question: string
): CFODecisionType {
  const q =
    normalizeQuestion(
      question
    ).toLowerCase();

  /*
   * Next-step questions are intentionally checked first.
   */

  if (
    isNextStepQuestion(q)
  ) {
    return "next_step";
  }

  /*
   * Specific decision types.
   */

  if (
    isHiringQuestion(q)
  ) {
    return "hiring";
  }

  if (
    isCollectionsQuestion(q)
  ) {
    return "collections";
  }

  if (
    isPricingQuestion(q)
  ) {
    return "pricing";
  }

  if (
    isSpendingQuestion(q)
  ) {
    return "spending";
  }

  if (
    isExpenseQuestion(q)
  ) {
    return "expenses";
  }

  if (
    isCashQuestion(q)
  ) {
    return "cash";
  }

  if (
    isProfitabilityQuestion(q)
  ) {
    return "profitability";
  }

  if (
    isGrowthQuestion(q)
  ) {
    return "growth";
  }

  if (
    isCustomerQuestion(q)
  ) {
    return "customer";
  }

  return "general";
}

/*
 * ============================================================
 * PRIORITY CALCULATION
 * ============================================================
 */

function calculatePriority(
  context: CFOContext
): CFODecisionPriority {
  const finance =
    context.finance;

  const healthScore =
    safeNumber(
      finance.healthScore
    );

  const cash =
    safeNumber(
      finance.cash
    );

  const cashFlow =
    safeNumber(
      finance.cashFlow
    );

  const runway =
    safeNumber(
      finance.cashRunwayDays
    );

  const receivables =
    safeNumber(
      finance.outstandingReceivables
    );

  const revenue =
    safeNumber(
      finance.revenue
    );

  /*
   * CRITICAL
   *
   * Immediate financial stress.
   */

  if (
    healthScore < 30 ||
    (
      cash <= 0 &&
      cashFlow < 0
    ) ||
    (
      runway > 0 &&
      runway < 15
    )
  ) {
    return "critical";
  }

  /*
   * HIGH
   */

  if (
    healthScore < 50 ||
    cashFlow < 0 ||
    (
      runway > 0 &&
      runway < 30
    ) ||
    (
      revenue > 0 &&
      receivables >
        revenue * 0.5
    )
  ) {
    return "high";
  }

  /*
   * MEDIUM
   */

  if (
    healthScore < 75 ||
    finance.expenseGrowth >
      finance.revenueGrowth
  ) {
    return "medium";
  }

  return "low";
}

/*
 * ============================================================
 * FINANCIAL EVIDENCE
 * ============================================================
 */

function buildFinancialEvidence(
  context: CFOContext
): CFODecisionContext["financialEvidence"] {
  return {
    availableCash:
      safeNumber(
        context.finance.cash
      ),

    monthlyRevenue:
      safeNumber(
        context.finance.revenue
      ),

    monthlyExpenses:
      safeNumber(
        context.finance.expenses
      ),

    monthlyProfit:
      safeNumber(
        context.finance.profit
      ),

    outstandingReceivables:
      safeNumber(
        context.finance
          .outstandingReceivables
      ),

    cashRunwayDays:
      safeNumber(
        context.finance
          .cashRunwayDays
      ),

    revenueGrowth:
      safeNumber(
        context.finance
          .revenueGrowth
      ),

    expenseGrowth:
      safeNumber(
        context.finance
          .expenseGrowth
      ),

    healthScore:
      safeNumber(
        context.finance
          .healthScore
      ),
  };
}

/*
 * ============================================================
 * DECISION LOGIC
 * ============================================================
 */

function buildDecision(
  type: CFODecisionType,
  context: CFOContext
): CFODecisionContext["decision"] {
  const finance =
    context.finance;

  const revenue =
    safeNumber(
      finance.revenue
    );

  const expenses =
    safeNumber(
      finance.expenses
    );

  const profit =
    safeNumber(
      finance.profit
    );

  const cash =
    safeNumber(
      finance.cash
    );

  const receivables =
    safeNumber(
      finance.outstandingReceivables
    );

  const runway =
    safeNumber(
      finance.cashRunwayDays
    );

  /*
   * ==========================================================
   * HIRING
   * ==========================================================
   */

  if (
    type === "hiring"
  ) {
    const sustainableEmployees =
      safeNumber(
        context.workforce
          .financiallySustainableEmployees
      );

    const currentEmployees =
      safeNumber(
        context.workforce
          .currentEmployees
      );

    const difference =
      sustainableEmployees -
      currentEmployees;

    const affordable =
      difference > 0 &&
      profit >= 0 &&
      cash > 0;

    return {
      affordable,

      amount:
        Math.max(
          0,
          difference
        ),

      explanation:
        affordable
          ? `Current financial data indicates capacity for approximately ${difference} additional employee${
              difference === 1
                ? ""
                : "s"
            } based on the workforce capacity model.`
          : "Current financial data does not provide sufficient evidence that adding employees is financially safe right now.",
    };
  }

  /*
   * ==========================================================
   * SPENDING
   * ==========================================================
   */

  if (
    type === "spending"
  ) {
    const monthlySurplus =
      profit > 0
        ? profit
        : 0;

    const affordable =
      monthlySurplus > 0 &&
      cash > 0 &&
      finance.healthScore >= 60;

    return {
      affordable,

      amount:
        monthlySurplus,

      explanation:
        affordable
          ? `The business currently generates approximately ₹${formatINR(
              monthlySurplus
            )} of monthly profit before considering the proposed spending amount.`
          : "The current financial position does not provide a strong enough surplus to confidently approve discretionary spending.",
    };
  }

  /*
   * ==========================================================
   * COLLECTIONS
   * ==========================================================
   */

  if (
    type === "collections"
  ) {
    const collectionPriority =
      receivables > 0;

    return {
      affordable:
        collectionPriority,

      amount:
        receivables,

      explanation:
        collectionPriority
          ? `₹${formatINR(
              receivables
            )} is currently outstanding from receivables, making collections a direct cash-flow priority.`
          : "There is currently no recorded outstanding receivable balance requiring collection action.",
    };
  }

  /*
   * ==========================================================
   * CASH
   * ==========================================================
   */

  if (
    type === "cash"
  ) {
    const healthyCash =
      cash > 0 &&
      runway >= 30 &&
      finance.cashFlow >= 0;

    return {
      affordable:
        healthyCash,

      amount:
        cash,

      explanation:
        healthyCash
          ? `The current financial records show ₹${formatINR(
              cash
            )} of available financial cash position with approximately ${Math.round(
              runway
            )} days of estimated runway.`
          : "The current cash position requires caution because cash generation or estimated runway is under pressure.",
    };
  }

  /*
   * ==========================================================
   * EXPENSES
   * ==========================================================
   */

  if (
    type === "expenses"
  ) {
    const expenseRatio =
      revenue > 0
        ? expenses /
          revenue
        : 0;

    const needsReduction =
      expenseRatio >= 0.8 ||
      profit < 0;

    return {
      affordable:
        !needsReduction,

      amount:
        expenses,

      explanation:
        needsReduction
          ? `Expenses currently consume approximately ${Math.round(
              expenseRatio * 100
            )}% of recorded revenue, indicating that cost control should be reviewed.`
          : `Current expenses represent approximately ${Math.round(
              expenseRatio * 100
            )}% of recorded revenue.`,
    };
  }

  /*
   * ==========================================================
   * PROFITABILITY
   * ==========================================================
   */

  if (
    type === "profitability"
  ) {
    const profitable =
      profit > 0;

    return {
      affordable:
        profitable,

      amount:
        Math.abs(
          profit
        ),

      explanation:
        profitable
          ? `The current financial records show approximately ₹${formatINR(
              profit
            )} in profit.`
          : `The current financial records show a loss of approximately ₹${formatINR(
              Math.abs(
                profit
              )
            )}.`,
    };
  }

  /*
   * ==========================================================
   * GROWTH
   * ==========================================================
   */

  if (
    type === "growth"
  ) {
    const revenueGrowth =
      safeNumber(
        finance.revenueGrowth
      );

    const expenseGrowth =
      safeNumber(
        finance.expenseGrowth
      );

    const growthHealthy =
      revenueGrowth >= 0 &&
      expenseGrowth <=
        revenueGrowth;

    return {
      affordable:
        growthHealthy,

      amount:
        revenue,

      explanation:
        growthHealthy
          ? `Revenue growth is ${revenueGrowth.toFixed(
              1
            )}% while expense growth is ${expenseGrowth.toFixed(
              1
            )}%, giving the business a comparatively healthy growth profile.`
          : "Expense growth is currently outpacing revenue growth, so expansion should be approached cautiously.",
    };
  }

  /*
   * ==========================================================
   * PRICING
   * ==========================================================
   */

  if (
    type === "pricing"
  ) {
    const averageInvoiceValue =
      safeNumber(
        context.customers
          .averageInvoiceValue
      );

    return {
      affordable:
        profit >= 0,

      amount:
        averageInvoiceValue,

      explanation:
        `The current average invoice value is ₹${formatINR(
          averageInvoiceValue
        )}. Pricing decisions should be evaluated against margin, customer concentration and payment behavior.`,
    };
  }

  /*
   * ==========================================================
   * CUSTOMER
   * ==========================================================
   */

  if (
    type === "customer"
  ) {
    const customerCount =
      safeNumber(
        context.customers
          .total
      );

    const concentration =
      safeNumber(
        context.customers
          .customerConcentration
      );

    const topCustomerRevenue =
      safeNumber(
        context.customers
          .topCustomerRevenue
      );

    return {
      affordable:
        customerCount > 0,

      amount:
        topCustomerRevenue,

      explanation:
        `The largest customer currently represents approximately ${concentration.toFixed(
          1
        )}% of invoiced revenue.`,
    };
  }

  /*
   * ==========================================================
   * NEXT STEP
   * ==========================================================
   *
   * The decision engine deliberately does not pretend that a
   * single number is the answer to a broad strategic question.
   *
   * It instead provides the strongest deterministic financial
   * signal to the AI CFO.
   */

  if (
    type === "next_step"
  ) {
    /*
     * Collections take priority when a significant amount of
     * revenue is sitting unpaid.
     */

    if (
      revenue > 0 &&
      receivables >
        revenue * 0.3
    ) {
      return {
        affordable:
          true,

        amount:
          receivables,

        explanation:
          `Outstanding receivables of ₹${formatINR(
            receivables
          )} represent more than 30% of recorded revenue, making collections the strongest immediate cash-flow opportunity.`,
      };
    }

    /*
     * Losses take priority over expansion.
     */

    if (
      profit < 0
    ) {
      return {
        affordable:
          false,

        amount:
          Math.abs(
            profit
          ),

        explanation:
          `The business is currently recording a loss of approximately ₹${formatINR(
            Math.abs(
              profit
            )
          )}. Stabilizing profitability should take priority over discretionary expansion.`,
      };
    }

    /*
     * Negative cash flow is another major warning.
     */

    if (
      finance.cashFlow < 0
    ) {
      return {
        affordable:
          false,

        amount:
          Math.abs(
            finance.cashFlow
          ),

        explanation:
          `Current cash flow is negative by approximately ₹${formatINR(
            Math.abs(
              finance.cashFlow
            )
          )}. Protecting liquidity should take priority.`,
      };
    }

    /*
     * Expense growth exceeding revenue growth means growth
     * needs tighter control.
     */

    if (
      finance.expenseGrowth >
      finance.revenueGrowth
    ) {
      return {
        affordable:
          false,

        amount:
          Math.abs(
            finance.expenseGrowth -
              finance.revenueGrowth
          ),

        explanation:
          `Expense growth is outpacing revenue growth by approximately ${(
            finance.expenseGrowth -
            finance.revenueGrowth
          ).toFixed(
            1
          )} percentage points. Improving operating efficiency should come before aggressive expansion.`,
      };
    }

    /*
     * Healthy positive profit gives the CFO room to focus on
     * controlled growth.
     */

    if (
      profit > 0 &&
      finance.cashFlow >= 0
    ) {
      return {
        affordable:
          true,

        amount:
          profit,

        explanation:
          `The business is currently generating approximately ₹${formatINR(
            profit
          )} in recorded profit with non-negative cash flow, creating room for measured growth.`,
      };
    }

    /*
     * Default.
     */

    return {
      affordable:
        false,

      amount:
        0,

      explanation:
        "The available financial data does not provide a sufficiently strong signal for an aggressive next step.",
    };
  }

  /*
   * ==========================================================
   * GENERAL
   * ==========================================================
   */

  return {
    affordable:
      profit >= 0 &&
      finance.cashFlow >= 0,

    amount:
      Math.max(
        0,
        profit
      ),

    explanation:
      profit > 0
        ? `The business is currently generating approximately ₹${formatINR(
            profit
          )} in recorded profit.`
        : "The current financial position does not show a strong positive profit position.",
  };
}

/*
 * ============================================================
 * RECOMMENDATION BASIS
 * ============================================================
 */

function buildRecommendationBasis(
  type: CFODecisionType,
  context: CFOContext
): string[] {
  const finance =
    context.finance;

  const basis: string[] = [];

  /*
   * Core financial signals.
   */

  basis.push(
    `Revenue: ₹${formatINR(
      finance.revenue
    )}`
  );

  basis.push(
    `Expenses: ₹${formatINR(
      finance.expenses
    )}`
  );

  basis.push(
    `Profit: ₹${formatINR(
      finance.profit
    )}`
  );

  basis.push(
    `Financial health score: ${safeNumber(
      finance.healthScore
    ).toFixed(0)}/100`
  );

  /*
   * Cash-related evidence.
   */

  if (
    type === "collections" ||
    type === "cash" ||
    type === "next_step" ||
    type === "spending"
  ) {
    basis.push(
      `Available financial cash position: ₹${formatINR(
        finance.cash
      )}`
    );

    basis.push(
      `Outstanding receivables: ₹${formatINR(
        finance.outstandingReceivables
      )}`
    );
  }

  /*
   * Growth evidence.
   */

  if (
    type === "growth" ||
    type === "next_step" ||
    type === "pricing"
  ) {
    basis.push(
      `Revenue growth: ${safeNumber(
        finance.revenueGrowth
      ).toFixed(1)}%`
    );

    basis.push(
      `Expense growth: ${safeNumber(
        finance.expenseGrowth
      ).toFixed(1)}%`
    );
  }

  /*
   * Runway evidence.
   */

  if (
    type === "cash" ||
    type === "next_step" ||
    type === "spending" ||
    type === "hiring"
  ) {
    basis.push(
      `Estimated cash runway: ${safeNumber(
        finance.cashRunwayDays
      ).toFixed(0)} days`
    );
  }

  /*
   * Hiring evidence.
   */

  if (
    type === "hiring"
  ) {
    basis.push(
      `Current employees: ${safeNumber(
        context.workforce
          .currentEmployees
      )}`
    );

    basis.push(
      `Financial workforce capacity: ${safeNumber(
        context.workforce
          .financiallySustainableEmployees
      )}`
    );
  }

  /*
   * Customer evidence.
   */

  if (
    type === "customer" ||
    type === "collections" ||
    type === "pricing"
  ) {
    basis.push(
      `Total customers: ${safeNumber(
        context.customers
          .total
      )}`
    );

    basis.push(
      `Customer concentration: ${safeNumber(
        context.customers
          .customerConcentration
      ).toFixed(1)}%`
    );
  }

  return basis;
}

/*
 * ============================================================
 * NEXT ACTION
 * ============================================================
 */

function buildNextAction(
  type: CFODecisionType,
  context: CFOContext
): string {
  const finance =
    context.finance;

  const profit =
    safeNumber(
      finance.profit
    );

  const receivables =
    safeNumber(
      finance.outstandingReceivables
    );

  const cashFlow =
    safeNumber(
      finance.cashFlow
    );

  const health =
    safeNumber(
      finance.healthScore
    );

  /*
   * ==========================================================
   * UNIVERSAL FINANCIAL PRIORITIES
   * ==========================================================
   *
   * These are intentionally checked before the question-specific
   * recommendation.
   *
   * A CFO should not recommend discretionary expansion when the
   * business is in immediate financial distress.
   */

  if (
    cashFlow < 0 &&
    health < 50
  ) {
    return "Protect cash first: reduce discretionary spending and prioritize collecting outstanding receivables.";
  }

  if (
    receivables > 0 &&
    finance.revenue > 0 &&
    receivables >
      finance.revenue * 0.3
  ) {
    return "Prioritize collections: follow up with the customers carrying the largest outstanding balances.";
  }

  if (
    profit < 0
  ) {
    return "Stop discretionary expansion and identify the largest controllable expenses before pursuing growth.";
  }

  /*
   * ==========================================================
   * QUESTION-SPECIFIC ACTIONS
   * ==========================================================
   */

  switch (
    type
  ) {
    case "next_step":
      return "Prioritize the financial action with the greatest impact on cash flow and profitability, starting with collections if significant receivables remain unpaid.";

    case "hiring":
      return "Compare the proposed hire's fully loaded monthly cost against sustainable cash flow, runway and the financial workforce capacity before committing.";

    case "spending":
      return "Confirm the exact spending amount and test it against current monthly profit, available financial cash and estimated runway before approving it.";

    case "growth":
      return "Prioritize the growth activity most likely to increase revenue without causing expenses to grow faster than revenue.";

    case "pricing":
      return "Review average invoice value, customer concentration, margins and payment behavior before changing pricing.";

    case "collections":
      return "Follow up first with the customer carrying the largest outstanding balance and prioritize invoices that can improve near-term cash flow.";

    case "expenses":
      return "Review the largest recurring expenses and identify which can be reduced without damaging revenue generation.";

    case "cash":
      return "Protect liquidity by monitoring cash generation and prioritizing collections over discretionary spending.";

    case "profitability":
      return "Focus on increasing collected revenue and controlling expenses before committing to expansion.";

    case "customer":
      return "Review the largest customers, their contribution to revenue and their outstanding balances to protect concentration and cash flow.";

    default:
      return "Focus first on the financial issue with the greatest measurable impact on cash flow and profitability.";
  }
}

/*
 * ============================================================
 * MAIN ENGINE
 * ============================================================
 */

export function buildDecisionContext(
  context: CFOContext,
  question: string
): CFODecisionContext {
  const normalizedQuestion =
    normalizeQuestion(
      question
    );

  const type =
    classifyQuestion(
      normalizedQuestion
    );

  const priority =
    calculatePriority(
      context
    );

  const decision =
    buildDecision(
      type,
      context
    );

  const recommendationBasis =
    buildRecommendationBasis(
      type,
      context
    );

  const nextAction =
    buildNextAction(
      type,
      context
    );

  return {
    type,

    question:
      normalizedQuestion,

    priority,

    recommendationBasis,

    financialEvidence:
      buildFinancialEvidence(
        context
      ),

    decision,

    nextAction,
  };
}