import {
  calculateBusinessMetrics,
  BusinessMetricsInput,
} from "./core";

import {
  buildBusinessSnapshot,
} from "./core";

import {
  evaluateFinancialHealth,
} from "./engines/health-engine";

import {
  evaluateFinancialRules,
} from "./rules/financial.rules";

import {
  evaluateBusinessRisk,
} from "./engines/risk-engine";

import {
  identifyGrowthOpportunities,
} from "./engines/opportunity-engine";

import {
  generateForecast,
} from "./engines/forecast-engine";

import {
  analyzeBusiness,
} from "./analysis/financial-analysis";

import {
  buildExecutiveDecisions,
} from "./decision/decision-engine";

import {
  generateExecutiveReasoning,
} from "./reasoning";

import {
  buildExecutiveReport,
} from "./reporting/executive-report";

export function runIntelligence(
  input: BusinessMetricsInput
) {
  /* ----------------------------- */
  /* Metrics                       */
  /* ----------------------------- */

  const metrics =
    calculateBusinessMetrics(input);

  /* ----------------------------- */
  /* Health                        */
  /* ----------------------------- */

  const health =
    evaluateFinancialHealth(metrics);

  /* ----------------------------- */
  /* Rules                         */
  /* ----------------------------- */

  const rules =
    evaluateFinancialRules(metrics);

  /* ----------------------------- */
  /* Risk                          */
  /* ----------------------------- */

  const risk =
    evaluateBusinessRisk(
      metrics,
      rules
    );

  /* ----------------------------- */
  /* Analysis                      */
  /* ----------------------------- */

  const analysis =
    analyzeBusiness(
      metrics,
      health,
      rules
    );

  /* ----------------------------- */
  /* Forecast                      */
  /* ----------------------------- */

  const forecast =
    generateForecast({
      revenue: input.revenue,
      expenses: input.expenses,
      cash: input.cash,
    });

  /* ----------------------------- */
  /* Opportunities                 */
  /* ----------------------------- */

  const opportunities =
    identifyGrowthOpportunities({
      revenue: input.revenue,
      expenses: input.expenses,
      receivables: input.receivables,
      customerCount: input.customerCount,
      profitMargin: metrics.profitMargin,
    });

  /* ----------------------------- */
  /* Decisions                     */
  /* ----------------------------- */

  const decisions =
    buildExecutiveDecisions(
      analysis,
      risk
    );

  /* ----------------------------- */
  /* Executive Reasoning           */
  /* ----------------------------- */

  const reasoning =
    generateExecutiveReasoning(
      health,
      risk,
      forecast
    );

  /* ----------------------------- */
  /* Business Snapshot             */
  /* ----------------------------- */

  const snapshot =
    buildBusinessSnapshot(
      metrics,
      health,
      risk,
      forecast,
      opportunities,
      decisions,
      reasoning
    );

  /* ----------------------------- */
  /* Executive Report              */
  /* ----------------------------- */

  const executiveReport =
    buildExecutiveReport(
      analysis,
      health,
      risk,
      forecast,
      decisions,
      opportunities
    );

  return {

    snapshot,

    metrics,

    health,

    rules,

    risk,

    analysis,

    forecast,

    opportunities,

    decisions,

    reasoning,

    executiveReport,

  };
}