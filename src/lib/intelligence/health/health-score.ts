import {
  calculateBusinessMetrics,
  BusinessMetricsInput,
} from "../core/metrics";

import {
  evaluateFinancialHealth,
} from "../engines/health-engine";

export function calculateHealthScore(
  input: BusinessMetricsInput
): number {

  const metrics =
    calculateBusinessMetrics(input);

  const health =
    evaluateFinancialHealth(metrics);

  return health.overall;
}