"use client";

import { Mail, Phone, User } from "lucide-react";
import GlassPanel from "@/components/ui/GlassPanel";

type CustomerCardProps = {
  name?: string;
  email?: string;
  phone?: string;
};

export default function CustomerCard({
  name,
  email,
  phone,
}: CustomerCardProps) {
  const initials =
    name
      ?.split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "--";

  return (
    <GlassPanel className="p-8">

      <div className="flex items-center gap-5">

        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--primary)] text-xl font-bold text-black">
          {initials}
        </div>

        <div>

          <p className="text-sm uppercase tracking-[0.2em] text-[var(--text-secondary)]">
            Customer
          </p>

          <h2 className="mt-2 text-2xl font-semibold">
            {name || "Unknown Customer"}
          </h2>

        </div>

      </div>

      <div className="mt-8 space-y-5">

        <div className="flex items-center gap-4">

          <Mail
            size={18}
            className="text-[var(--primary)]"
          />

          <div>

            <p className="text-xs uppercase tracking-wider text-[var(--text-muted)]">
              Email
            </p>

            <p className="mt-1">
              {email || "Not Available"}
            </p>

          </div>

        </div>

        <div className="flex items-center gap-4">

          <Phone
            size={18}
            className="text-[var(--primary)]"
          />

          <div>

            <p className="text-xs uppercase tracking-wider text-[var(--text-muted)]">
              Phone
            </p>

            <p className="mt-1">
              {phone || "Not Available"}
            </p>

          </div>

        </div>

        <div className="flex items-center gap-4">

          <User
            size={18}
            className="text-[var(--primary)]"
          />

          <div>

            <p className="text-xs uppercase tracking-wider text-[var(--text-muted)]">
              Customer Type
            </p>

            <p className="mt-1">
              Business
            </p>

          </div>

        </div>

      </div>

    </GlassPanel>
  );
}