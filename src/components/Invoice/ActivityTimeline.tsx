"use client";

import GlassPanel from "@/components/ui/GlassPanel";

type TimelineEvent = {
  title: string;
  date: string;
};

type ActivityTimelineProps = {
  events: TimelineEvent[];
};

export default function ActivityTimeline({
  events,
}: ActivityTimelineProps) {
  return (
    <GlassPanel className="p-8">

      <h2 className="section-title">
        Activity Timeline
      </h2>

      <p className="section-description">
        Important invoice events.
      </p>

      <div className="mt-8 space-y-6">

        {events.map((event, index) => (
          <div
            key={index}
            className="flex gap-5"
          >
            <div className="flex flex-col items-center">

              <div className="h-3 w-3 rounded-full bg-[var(--primary)]" />

              {index !== events.length - 1 && (
                <div className="mt-2 h-full w-px bg-[var(--border)]" />
              )}

            </div>

            <div>

              <p className="font-medium">
                {event.title}
              </p>

              <p className="mt-1 text-sm text-[var(--text-secondary)]">
                {event.date}
              </p>

            </div>

          </div>
        ))}

      </div>

    </GlassPanel>
  );
}