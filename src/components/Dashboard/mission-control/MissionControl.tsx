import MissionHero from "./MissionHero";
import TodaysFocus from "./TodaysFocus";
import BusinessPulse from "./BusinessPulse";
import ExecutiveSummary from "../ExecutiveSummary";
import ActivityCenter from "./ActivityCenter";
import AskYourCFO from "./AskYourCFO";

import { getDashboardData } from "@/lib/dashboard";
import { getActivityFeed } from "@/lib/server";

export default async function MissionControl() {
  const [{ snapshot }, activityFeed] = await Promise.all([
    getDashboardData(),
    getActivityFeed(),
  ]);

  const activity = activityFeed.filter(
    (
      item
    ): item is Extract<
      (typeof activityFeed)[number],
      {
        type: "payment" | "customer" | "invoice";
      }
    > => item.type !== "reminder"
  );

  return (
    <div className="space-y-5">
      {/* =====================================================
          MISSION HERO
      ===================================================== */}

      <MissionHero
        revenue={snapshot.revenue}
        expenses={snapshot.expenses}
        profit={snapshot.profit}
        cashAvailable={snapshot.cashAvailable}
        receivables={snapshot.outstandingReceivables}
        healthScore={snapshot.healthScore}
      />

      {/* =====================================================
          MAIN EXECUTIVE ROW
      ===================================================== */}

      <div className="grid gap-5 xl:grid-cols-[0.72fr_1.28fr]">
        <TodaysFocus
          receivables={snapshot.outstandingReceivables}
        />

        <BusinessPulse snapshot={snapshot} />
      </div>

      {/* =====================================================
          EXECUTIVE SUMMARY
      ===================================================== */}

      <ExecutiveSummary
        revenue={snapshot.revenue}
        expenses={snapshot.expenses}
        profit={snapshot.profit}
        cashAvailable={snapshot.cashAvailable}
        receivables={snapshot.outstandingReceivables}
        healthScore={snapshot.healthScore}
        strengths={snapshot.strengths}
        risks={snapshot.risks}
      />

      {/* =====================================================
          ASK YOUR CFO
      ===================================================== */}

      <AskYourCFO />

      {/* =====================================================
          ACTIVITY
      ===================================================== */}

      <ActivityCenter activity={activity} />
    </div>
  );
}