import MissionHero from "./MissionHero";
import BusinessPulse from "./BusinessPulse";
import QuickActions from "./QuickActions";
import ActivityCenter from "./ActivityCenter";

import { getDashboardData } from "@/lib/dashboard";
import { getActivityFeed } from "@/lib/server";

export default async function MissionControl() {
  const [{ snapshot }, activityFeed] =
    await Promise.all([
      getDashboardData(),
      getActivityFeed(),
    ]);

  const activity = activityFeed.filter(
    (
      item
    ): item is Extract<
      (typeof activityFeed)[number],
      {
        type:
          | "payment"
          | "customer"
          | "invoice";
      }
    > => item.type !== "reminder"
  );

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">

      {/* Mission Hero */}

      <MissionHero
        revenue={snapshot.revenue}
        receivables={snapshot.outstandingReceivables}
      />

      {/* Business Pulse */}

      <BusinessPulse
        snapshot={snapshot}
      />

      {/* Quick Actions */}

      <QuickActions />

      {/* Recent Activity */}

      <ActivityCenter
        activity={activity}
      />

    </div>
  );
}