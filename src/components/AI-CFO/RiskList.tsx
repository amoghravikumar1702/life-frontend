import { AlertTriangle } from "lucide-react";

export interface Risk {
  title: string;
  description: string;
  severity: "Low" | "Medium" | "High" | "Critical";
}

interface RiskListProps {
  risks: Risk[];
}

const severityStyles = {
  Low: "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
  Medium: "border-yellow-500/20 bg-yellow-500/10 text-yellow-300",
  High: "border-orange-500/20 bg-orange-500/10 text-orange-400",
  Critical: "border-red-500/20 bg-red-500/10 text-red-400",
};

export default function RiskList({
  risks,
}: RiskListProps) {
  return (
    <section className="rounded-[32px] border border-white/10 bg-[#111111] p-8">

      <div className="mb-8 flex items-center gap-3">

        <AlertTriangle
          size={24}
          className="text-[#D4AF37]"
        />

        <h2 className="text-3xl font-bold text-white">
          Business Risks
        </h2>

      </div>

      {risks.length === 0 ? (
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6">

          <p className="text-emerald-400 font-medium">
            No significant business risks detected.
          </p>

        </div>
      ) : (
        <div className="space-y-5">

          {risks.map((risk) => (

            <div
              key={risk.title}
              className="rounded-2xl border border-white/5 bg-white/[0.03] p-6"
            >

              <div
                className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] ${severityStyles[risk.severity]}`}
              >
                {risk.severity}
              </div>

              <h3 className="mt-5 text-xl font-semibold text-white">
                {risk.title}
              </h3>

              <p className="mt-3 leading-7 text-zinc-400">
                {risk.description}
              </p>

            </div>

          ))}

        </div>
      )}

    </section>
  );
}