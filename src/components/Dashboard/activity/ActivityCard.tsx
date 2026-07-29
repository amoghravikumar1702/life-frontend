"use client";

import { Receipt, Users, IndianRupee } from "lucide-react";

import { ActivityItem } from "./types";
import { formatActivityTime } from "./mock";

type Props = {
  item: ActivityItem;
};

function getIcon(type: ActivityItem["type"]) {
  switch (type) {
    case "customer":
      return <Users size={18} />;

    case "invoice":
      return <Receipt size={18} />;

    case "payment":
      return <IndianRupee size={18} />;

    default:
      return <Receipt size={18} />;
  }
}

export default function ActivityCard({ item }: Props) {
  return (
    <div className="flex items-start gap-5 rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition-all duration-300 hover:border-[#D4AF37]/20 hover:bg-white/[0.05]">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--gold)]/10 text-[var(--gold)]">
        {getIcon(item.type)}
      </div>

      <div className="flex-1">
        <div className="flex items-center justify-between">
          <h3 className="text-[15px] font-medium text-white">
            {item.title}
          </h3>

          <span className="text-xs text-[#8A8A8F]">
            {formatActivityTime(item.timestamp)}
          </span>
        </div>

        <p className="mt-2 text-sm leading-6 text-[#8A8A8F]">
          {item.description}
        </p>
      </div>
    </div>
  );
}