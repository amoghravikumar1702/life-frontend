import {
  TrendingUp,
  Wallet,
  PieChart,
  BarChart3,
} from "lucide-react";

import { PageSection } from "@/components/ui";

interface Props {
  analysis: string;
}

export default function FinancialAnalysis({
  analysis,
}: Props) {
  const sections = analysis
    .split("\n")
    .filter(
      (paragraph) =>
        paragraph.trim().length > 0
    );

  const highlights = [
    {
      title: "Financial Position",
      icon: Wallet,
      description:
        "Overall financial stability based on current assets, liabilities and cash availability.",
    },
    {
      title: "Profitability",
      icon: TrendingUp,
      description:
        "Revenue generation, margins and operating performance.",
    },
    {
      title: "Cash Flow",
      icon: PieChart,
      description:
        "Liquidity, collections and cash movement across the business.",
    },
    {
      title: "Operational Efficiency",
      icon: BarChart3,
      description:
        "Expense management and financial efficiency.",
    },
  ];

  return (
    <PageSection
      title="Financial Analysis"
      subtitle="Executive Financial Review"
    >
      <div className="space-y-8">

        {/* Analysis */}

        <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-7">

          <h3 className="text-lg font-semibold text-white">
            Executive Assessment
          </h3>

          <div className="mt-6 space-y-5">

            {sections.map((paragraph, index) => (
              <p
                key={index}
                className="leading-8 text-zinc-300"
              >
                {paragraph}
              </p>
            ))}

          </div>

        </div>

        {/* Financial Dimensions */}

        <div className="grid gap-5 md:grid-cols-2">

          {highlights.map((item) => {

            const Icon = item.icon;

            return (

              <div
                key={item.title}
                className="rounded-3xl border border-white/10 bg-white/[0.02] p-6 transition hover:border-[#D4AF37]/30"
              >

                <div className="flex items-center gap-3">

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/5">

                    <Icon
                      size={18}
                      className="text-[#D4AF37]"
                    />

                  </div>

                  <h3 className="font-semibold text-white">
                    {item.title}
                  </h3>

                </div>

                <p className="mt-5 leading-7 text-zinc-400">
                  {item.description}
                </p>

              </div>

            );

          })}

        </div>

        {/* Executive Note */}

        <div className="rounded-3xl border border-[#D4AF37]/20 bg-[#D4AF37]/5 p-6">

          <h3 className="text-lg font-semibold text-white">
            CFO Commentary
          </h3>

          <p className="mt-4 leading-8 text-zinc-300">
            This assessment combines profitability,
            liquidity, operational efficiency, business
            risks and future projections to provide a
            consolidated executive view of the company's
            financial position. Continue reviewing these
            indicators regularly to support informed
            business decisions.
          </p>

        </div>

      </div>
    </PageSection>
  );
}