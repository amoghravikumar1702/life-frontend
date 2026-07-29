export interface ProfitabilityKnowledge {
  excellent: number;
  healthy: number;
  warning: number;
  critical: number;

  recommendations: {
    excellent: string;
    healthy: string;
    warning: string;
    critical: string;
  };
}

export const Profitability = {
  service: {
    excellent: 30,
    healthy: 20,
    warning: 10,
    critical: 0,

    recommendations: {
      excellent:
        "Maintain pricing discipline and continue investing in sustainable growth.",

      healthy:
        "Current profitability is healthy. Continue monitoring operating expenses.",

      warning:
        "Review pricing, supplier costs and operating expenses to improve margins.",

      critical:
        "Immediate action required. Reduce expenses and increase revenue to restore profitability.",
    },
  },

  retail: {
    excellent: 20,
    healthy: 12,
    warning: 6,
    critical: 0,

    recommendations: {
      excellent:
        "Strong retail margins. Continue optimizing inventory turnover.",

      healthy:
        "Margins are acceptable but should be monitored regularly.",

      warning:
        "Evaluate pricing strategy and supplier negotiations.",

      critical:
        "Current margins threaten long-term sustainability.",
    },
  },

  saas: {
    excellent: 40,
    healthy: 25,
    warning: 15,
    critical: 0,

    recommendations: {
      excellent:
        "Strong SaaS economics. Continue scaling efficiently.",

      healthy:
        "Business is profitable with room for optimization.",

      warning:
        "Improve customer retention and reduce acquisition costs.",

      critical:
        "Current unit economics are unsustainable.",
    },
  },
} satisfies Record<string, ProfitabilityKnowledge>;