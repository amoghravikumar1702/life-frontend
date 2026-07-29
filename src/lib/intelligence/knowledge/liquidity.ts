export interface LiquidityKnowledge {
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

export const Liquidity = {
  default: {

    excellent: 3,

    healthy: 2,

    warning: 1,

    critical: 0.5,

    recommendations: {

      excellent:
        "Cash reserves provide excellent operational flexibility.",

      healthy:
        "Current liquidity supports day-to-day operations comfortably.",

      warning:
        "Increase collections and reduce discretionary spending.",

      critical:
        "Immediate cash preservation measures are recommended.",

    },

  },

} satisfies Record<string, LiquidityKnowledge>;