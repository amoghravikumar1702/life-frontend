// src/components/Dashboard/ExecutiveSummary.tsx

"use client";

type ExecutiveStrength = {
  title: string;
  description: string;
};

type ExecutiveRisk = {
  title: string;
  description: string;
};

type Props = {
  revenue: number;
  expenses: number;
  profit: number;
  cashAvailable: number;
  receivables: number;
  healthScore: number;
  strengths: ExecutiveStrength[];
  risks: ExecutiveRisk[];
};

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number.isFinite(value) ? value : 0);
}

function getHealthLabel(score: number): string {
  if (score >= 85) return "Strong";
  if (score >= 70) return "Healthy";
  if (score >= 50) return "Watch";
  return "Attention";
}

export default function ExecutiveSummary({
  revenue,
  expenses,
  profit,
  cashAvailable,
  receivables,
  healthScore,
  strengths,
  risks,
}: Props) {
  const safeHealthScore = Math.max(
    0,
    Math.min(
      100,
      Number.isFinite(healthScore)
        ? healthScore
        : 0
    )
  );

  return (
    <section className="relative overflow-hidden rounded-[30px] border border-white/[0.06] bg-[#111419]">
      {/* Ambient light */}
      <div className="pointer-events-none absolute -right-32 -top-32 h-72 w-72 rounded-full bg-[#D4AF37]/[0.035] blur-[100px]" />

      <div className="relative p-6 sm:p-8 lg:p-10">
        {/* Header */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.35em] text-[#D4AF37]">
              Executive Summary
            </p>

            <h2 className="mt-2 text-xl font-medium tracking-tight text-white">
              Financial Position
            </h2>

            <p className="mt-1 text-sm text-zinc-500">
              Current business performance and financial signals.
            </p>
          </div>

          {/* Health */}
          <div className="flex items-center gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.02] px-4 py-3">
            <div>
              <p className="text-[9px] uppercase tracking-[0.25em] text-zinc-600">
                Health
              </p>

              <p className="mt-1 text-sm font-medium text-zinc-200">
                {getHealthLabel(safeHealthScore)}
              </p>
            </div>

            <div className="h-10 w-10 rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/[0.06] flex items-center justify-center">
              <span className="text-xs font-semibold text-[#D4AF37]">
                {Math.round(safeHealthScore)}
              </span>
            </div>
          </div>
        </div>

        {/* Metrics */}
        <div className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/[0.05] bg-white/[0.05] lg:grid-cols-5">
          <Metric
            label="Revenue"
            value={formatCurrency(revenue)}
          />

          <Metric
            label="Expenses"
            value={formatCurrency(expenses)}
          />

          <Metric
            label="Profit"
            value={formatCurrency(profit)}
          />

          <Metric
            label="Cash Available"
            value={formatCurrency(cashAvailable)}
          />

          <Metric
            label="Receivables"
            value={formatCurrency(receivables)}
          />
        </div>

        {/* Intelligence */}
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {/* Strengths */}
          <div className="rounded-2xl border border-white/[0.05] bg-white/[0.015] p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-600">
                  Strengths
                </p>

                <p className="mt-1 text-sm font-medium text-zinc-200">
                  What is working
                </p>
              </div>

              <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-emerald-400/10 bg-emerald-400/[0.05]">
                <span className="text-xs text-emerald-400">
                  ✓
                </span>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              {strengths.length > 0 ? (
                strengths.map((strength, index) => (
                  <div
                    key={`${strength.title}-${index}`}
                    className="rounded-xl border border-white/[0.04] bg-white/[0.015] p-4"
                  >
                    <p className="text-sm font-medium text-zinc-200">
                      {strength.title}
                    </p>

                    <p className="mt-1.5 text-xs leading-5 text-zinc-500">
                      {strength.description}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-zinc-600">
                  No financial strengths identified yet.
                </p>
              )}
            </div>
          </div>

          {/* Risks */}
          <div className="rounded-2xl border border-white/[0.05] bg-white/[0.015] p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-600">
                  Risks
                </p>

                <p className="mt-1 text-sm font-medium text-zinc-200">
                  What needs attention
                </p>
              </div>

              <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#D4AF37]/10 bg-[#D4AF37]/[0.05]">
                <span className="text-xs text-[#D4AF37]">
                  !
                </span>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              {risks.length > 0 ? (
                risks.map((risk, index) => (
                  <div
                    key={`${risk.title}-${index}`}
                    className="rounded-xl border border-white/[0.04] bg-white/[0.015] p-4"
                  >
                    <p className="text-sm font-medium text-zinc-200">
                      {risk.title}
                    </p>

                    <p className="mt-1.5 text-xs leading-5 text-zinc-500">
                      {risk.description}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-zinc-600">
                  No major financial risks identified.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Health bar */}
        <div className="mt-8 border-t border-white/[0.05] pt-6">
          <div className="flex items-center justify-between">
            <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-600">
              Financial Health
            </p>

            <p className="text-xs text-zinc-500">
              {Math.round(safeHealthScore)} / 100
            </p>
          </div>

          <div className="mt-3 h-1 overflow-hidden rounded-full bg-white/[0.05]">
            <div
              className="h-full rounded-full bg-[#D4AF37] transition-all duration-700"
              style={{
                width: `${safeHealthScore}%`,
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function Metric({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0 bg-[#111419] p-4 sm:p-5">
      <p className="truncate text-[9px] uppercase tracking-[0.22em] text-zinc-600">
        {label}
      </p>

      <p className="mt-2 truncate text-sm font-medium text-zinc-200 sm:text-base">
        {value}
      </p>
    </div>
  );
}