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
  const displayName = name?.trim() || "Unknown Customer";

  const initials =
    displayName
      .split(" ")
      .filter(Boolean)
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "--";

  return (
    <GlassPanel className="h-full p-6 sm:p-8">

      {/* HEADER */}

      <div className="flex items-center gap-4 sm:gap-5">

        <div
          className="
            flex
            h-14
            w-14
            shrink-0
            items-center
            justify-center
            rounded-2xl
            border
            border-[#D4AF37]/15
            bg-[#D4AF37]/[0.07]
            text-base
            font-semibold
            text-[#D4AF37]
            sm:h-16
            sm:w-16
            sm:text-lg
          "
        >
          {initials}
        </div>

        <div className="min-w-0">

          <p
            className="
              text-[9px]
              font-medium
              uppercase
              tracking-[0.28em]
              text-zinc-600
            "
          >
            Customer
          </p>

          <h2
            className="
              mt-2
              truncate
              text-xl
              font-semibold
              tracking-[-0.025em]
              text-white
              sm:text-2xl
            "
          >
            {displayName}
          </h2>

        </div>

      </div>

      {/* CUSTOMER INFORMATION */}

      <div className="mt-7 space-y-1 border-t border-white/[0.05] pt-6">

        {/* EMAIL */}

        <div
          className="
            flex
            items-center
            gap-4
            rounded-xl
            px-2
            py-3
            transition-colors
            hover:bg-white/[0.02]
          "
        >

          <div
            className="
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              rounded-xl
              border
              border-white/[0.06]
              bg-white/[0.02]
            "
          >
            <Mail
              size={15}
              strokeWidth={1.8}
              className="text-zinc-500"
            />
          </div>

          <div className="min-w-0">

            <p
              className="
                text-[9px]
                font-medium
                uppercase
                tracking-[0.22em]
                text-zinc-600
              "
            >
              Email
            </p>

            <p
              className="
                mt-1
                truncate
                text-sm
                text-zinc-300
              "
            >
              {email || "Not available"}
            </p>

          </div>

        </div>

        {/* PHONE */}

        <div
          className="
            flex
            items-center
            gap-4
            rounded-xl
            px-2
            py-3
            transition-colors
            hover:bg-white/[0.02]
          "
        >

          <div
            className="
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              rounded-xl
              border
              border-white/[0.06]
              bg-white/[0.02]
            "
          >
            <Phone
              size={15}
              strokeWidth={1.8}
              className="text-zinc-500"
            />
          </div>

          <div className="min-w-0">

            <p
              className="
                text-[9px]
                font-medium
                uppercase
                tracking-[0.22em]
                text-zinc-600
              "
            >
              Phone
            </p>

            <p
              className="
                mt-1
                truncate
                text-sm
                text-zinc-300
              "
            >
              {phone || "Not available"}
            </p>

          </div>

        </div>

        {/* CUSTOMER TYPE */}

        <div
          className="
            flex
            items-center
            gap-4
            rounded-xl
            px-2
            py-3
            transition-colors
            hover:bg-white/[0.02]
          "
        >

          <div
            className="
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              rounded-xl
              border
              border-[#D4AF37]/10
              bg-[#D4AF37]/[0.05]
            "
          >
            <User
              size={15}
              strokeWidth={1.8}
              className="text-[#D4AF37]"
            />
          </div>

          <div>

            <p
              className="
                text-[9px]
                font-medium
                uppercase
                tracking-[0.22em]
                text-zinc-600
              "
            >
              Customer Type
            </p>

            <p className="mt-1 text-sm text-zinc-300">
              Business
            </p>

          </div>

        </div>

      </div>

    </GlassPanel>
  );
}