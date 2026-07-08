import {
  Wallet,
  FileText,
  Landmark,
  TriangleAlert,
} from "lucide-react";

type StatCardProps = {
  title: string;
  value: string;
};

const cardData = {
  "Money to Collect": {
    icon: Wallet,
    trend: "+12%",
    trendColor: "text-green-400",
    bg: "bg-cyan-500/10",
    iconColor: "text-cyan-400",
  },

  "Bills Due": {
    icon: FileText,
    trend: "-5%",
    trendColor: "text-orange-400",
    bg: "bg-orange-500/10",
    iconColor: "text-orange-400",
  },

  "Cash Position": {
    icon: Landmark,
    trend: "+8%",
    trendColor: "text-green-400",
    bg: "bg-green-500/10",
    iconColor: "text-green-400",
  },

  Alerts: {
    icon: TriangleAlert,
    trend: "3 Active",
    trendColor: "text-red-400",
    bg: "bg-red-500/10",
    iconColor: "text-red-400",
  },
};

export default function StatCard({ title, value }: StatCardProps) {
  const data =
    cardData[title as keyof typeof cardData];

  const Icon = data.icon;

  return (
    <div className="group rounded-3xl border border-white/10 bg-gradient-to-br from-[#111827] to-[#0B1220] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/40 hover:shadow-[0_0_35px_rgba(34,211,238,0.15)]">

      <div className="flex items-center justify-between">

        <div
          className={`flex h-14 w-14 items-center justify-center rounded-2xl ${data.bg}`}
        >
          <Icon
            size={28}
            className={data.iconColor}
          />
        </div>

        <span
          className={`rounded-full bg-white/5 px-3 py-1 text-sm font-medium ${data.trendColor}`}
        >
          {data.trend}
        </span>

      </div>

      <p className="mt-6 text-sm uppercase tracking-[0.2em] text-gray-400">
        {title}
      </p>

      <h2 className="mt-2 text-4xl font-bold tracking-tight">
        {value}
      </h2>

      <div className="mt-6 h-1 overflow-hidden rounded-full bg-white/5">

        <div className="h-full w-2/3 rounded-full bg-cyan-400 transition-all duration-300 group-hover:w-full" />

      </div>

    </div>
  );
}