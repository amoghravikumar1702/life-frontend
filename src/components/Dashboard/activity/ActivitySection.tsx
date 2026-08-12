"use client";

import ActivityCard from "./ActivityCard";
import { ActivityItem } from "./types";
import {
  formatActivityDate,
  mockActivities,
} from "./mock";

type Props = {
  activities?: ActivityItem[];
};

export default function ActivitySection({
  activities = mockActivities,
}: Props) {
  if (!activities.length) {
    return (
      <section className="mt-14">
        <div className="rounded-3xl border border-white/10/[0.03] p-10 text-center">
          <h2 className="text-xl font-semibold text-white">
            Recent Activity
          </h2>

          <p className="mt-3 text-[#8A8A8F]">
            Activity will appear here once customers,
            invoices and payments start flowing into
            ArkenOne.
          </p>
        </div>
      </section>
    );
  }

  let previousDate = "";

  return (
    <section className="mt-14">
      <div className="mb-8">
        <p className="text-xs uppercase tracking-[0.25em] text-[#D4AF37]">
          Dashboard
        </p>

        <h2 className="mt-2 text-3xl font-semibold tracking-tight text-white">
          Recent Activity
        </h2>

        <p className="mt-2 max-w-2xl text-sm text-[#8A8A8F]">
          Stay updated with the latest customer,
          invoice and payment events.
        </p>
      </div>

      <div className="space-y-5">
        {activities.map((activity) => {
          const currentDate = formatActivityDate(
            activity.timestamp
          );

          const showHeading =
            previousDate !== currentDate;

          previousDate = currentDate;

          return (
            <div key={activity.id}>
              {showHeading && (
                <h3 className="mb-4 text-xs uppercase tracking-[0.25em] text-[#8A8A8F]">
                  {currentDate}
                </h3>
              )}

              <ActivityCard item={activity} />
            </div>
          );
        })}
      </div>
    </section>
  );
}